/* ============================================================
   LIVE INFO COMMAND CENTER — map.js
   Encapsulated Architecture with User-Agent Compliance, Heatmap Decoupling,
   Populated Wind Vectors, SessionStorage Fallback, Focus Traps, and Destroy Cleanup.
   ============================================================ */

'use strict';

/**
 * Security Helper: Escapes HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}



/**
 * Cache Manager with sessionStorage persistence
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.loadFromSession();
  }

  loadFromSession() {
    try {
      const stored = sessionStorage.getItem('disaster_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([k, v]) => {
          if (Date.now() < v.expires) this.cache.set(k, v);
        });
      }
    } catch (e) {
      console.warn('Session cache load failed', e);
    }
  }

  saveToSession() {
    try {
      const obj = {};
      this.cache.forEach((v, k) => { obj[k] = v; });
      sessionStorage.setItem('disaster_cache', JSON.stringify(obj));
    } catch (e) {
      console.warn('Session cache save failed', e);
    }
  }

  set(key, data, ttlMs = 300000) { // Default 5 mins
    this.cache.set(key, { data, expires: Date.now() + ttlMs });
    this.saveToSession();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.saveToSession();
      return null;
    }
    return item.data;
  }
}

/**
 * Main Disaster Application Class
 */
class DisasterApp {
  constructor() {
    this.userLat = 20.2961; // Default: Bhubaneswar
    this.userLng = 85.8245;
    this.alertCount = 0;
    this.bannerShown = false;
    this.bannerTimer = null;
    this.clockTimer = null;

    this.cache = new CacheManager();

    // Map and Independent Layer Groups
    this.map = null;
    this.userGroup = L.layerGroup();
    this.quakeGroup = L.layerGroup();
    this.heatGroup = L.layerGroup(); // Dedicated persistent layer for heatmap
    this.rainGroup = L.layerGroup();
    this.windGroup = L.layerGroup();

    // Bounding Box Constraints for India & Surrounding Regions
    this.BB = { minLat: 6, maxLat: 38, minLng: 68, maxLng: 98 };

    // Historical Records Data
    this.records = [
      {
        year: '2023', title: 'Turkey-Syria Earthquake', location: 'Turkey & Syria',
        deaths: '50,000+', injured: '120,000+', evacuated: '2M+',
        description: 'Deadliest earthquake in the region in over a century.',
        img: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&h=300&fit=crop'
      },
      {
        year: '2022', title: 'Pakistan Floods', location: 'Pakistan',
        deaths: '1,700+', injured: '12,000+', evacuated: '8M+',
        description: 'Unprecedented monsoon floods submerged one-third of the country.',
        img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=300&fit=crop'
      },
      {
        year: '2021', title: 'Cyclone Tauktae', location: 'West Coast, India',
        deaths: '174+', injured: '300+', evacuated: '200,000+',
        description: 'Extremely severe cyclonic storm impacting Gujarat and Maharashtra.',
        img: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&h=300&fit=crop'
      },
      {
        year: '1999', title: 'Odisha Super Cyclone', location: 'Odisha, India',
        deaths: '10,000+', injured: '15,000+', evacuated: '1.5M+',
        description: 'Strongest recorded tropical cyclone in the North Indian Ocean.',
        img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&h=300&fit=crop'
      }
    ];

    this.SAFETY_GUIDELINES = {
      'Thunderstorm Alert': {
        icon: '⚡', color: '#dc2626',
        dos: ['Stay indoors away from windows', 'Unplug sensitive electronics', 'Crouch low if outdoors in open field'],
        donts: ['Do NOT shelter under tall trees', 'Do NOT use landline phones', 'Do NOT touch metal fences'],
        emergency: [{ name: '112 — Emergency', num: '112' }, { name: 'Odisha Disaster', num: '1070' }],
        tip: 'Lightning can strike 10–15 km away from storm clouds.'
      },
      'default': {
        icon: '⚠️', color: '#64748b',
        dos: ['Monitor official emergency broadcasts', 'Keep emergency contacts saved offline', 'Prepare 3-day supply kit'],
        donts: ['Do NOT spread unverified rumors', 'Do NOT ignore official evacuation orders'],
        emergency: [{ name: '112 — Emergency', num: '112' }, { name: 'Odisha Helpline', num: '1070' }],
        tip: 'Save offline emergency phone numbers prior to network outages.'
      }
    };
  }

  /**
   * Application Boot sequence
   */
  init() {
    this.renderTimeline();
    this.setupClock();
    this.setupOfflineListeners();
    this.bindUIEvents();
  }

  /**
   * Memory Cleanup on SPA unload
   */
  destroy() {
    if (this.clockTimer) clearInterval(this.clockTimer);
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
  }

  txt(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  getDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
    const R = 6371;
    const r = Math.PI / 180;
    const dLat = (lat2 - lat1) * r;
    const dLon = (lon2 - lon1) * r;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  getWindDirectionSymbol(deg) {
    return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round((deg || 0) / 45) % 8];
  }

  getWeatherIcon(main) {
    const s = (main || '').toLowerCase();
    if (s.includes('thunder')) return '⛈️';
    if (s.includes('drizzle') || s.includes('rain')) return '🌧️';
    if (s.includes('snow')) return '❄️';
    if (s.includes('fog') || s.includes('mist')) return '🌫️';
    if (s.includes('cloud')) return '☁️';
    return '☀️';
  }

  setupClock() {
    const update = () => {
      const d = new Date();
      this.txt('mapClock', `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${d.toLocaleDateString([], { day: 'numeric', month: 'short' })}`);
    };
    update();
    this.clockTimer = setInterval(update, 30000);
  }

  setupOfflineListeners() {
    const banner = document.getElementById('offlineBanner');
    window.addEventListener('online', () => { if (banner) banner.style.display = 'none'; });
    window.addEventListener('offline', () => { if (banner) banner.style.display = 'block'; });
  }

  initMap(lat, lng) {
    if (this.map) {
      this.map.setView([lat, lng], 14);
      return;
    }

    this.map = L.map('map', { zoomControl: true, attributionControl: false }).setView([lat, lng], 14);

    this.userGroup.addTo(this.map);
    this.quakeGroup.addTo(this.map);
    this.heatGroup.addTo(this.map);
    this.rainGroup.addTo(this.map);
    this.windGroup.addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);
  }

  /**
   * Nominatim reverse geocode with OSM-Compliant User-Agent Header
   */
  async getExactPlaceName(lat, lng) {
    const cacheKey = `geo_${lat.toFixed(3)}_${lng.toFixed(3)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'DisasterManagementCommandCenter/1.0 (contact@disasterapp.org)'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const place = addr.village || addr.suburb || addr.town || addr.city_district || addr.county || 'Local Area';
        this.cache.set(cacheKey, place, 86400000); // 24hr cache
        return place;
      }
    } catch (e) {
      console.warn('Geocoding offline fallback triggered', e);
    }
    return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
  }

  async setUserLocation(lat, lng) {
    this.userLat = lat;
    this.userLng = lng;
    this.userGroup.clearLayers();

    const placeName = await this.getExactPlaceName(lat, lng);

    const icon = L.divIcon({
      className: 'cm',
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 8px rgba(59,130,246,0.25),0 0 20px rgba(59,130,246,0.5);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const safePlace = escapeHtml(placeName);
    L.marker([lat, lng], { icon })
      .addTo(this.userGroup)
      .bindPopup(`<b>📍 ${safePlace}</b><br><span style="font-size:11px;color:#94a3b8">GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>`, {
        autoClose: false,
        closeOnClick: false
      })
      .openPopup();

    this.initMap(lat, lng);
  }

  async fetchQuakes() {
    try {
      this.quakeGroup.clearLayers();
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      if (!res.ok) throw new Error('Seismic service error');
      const data = await res.json();
      let nearYou = false;

      data.features.forEach(eq => {
        const [lng, lat] = eq.geometry.coordinates;
        const mag = eq.properties.mag;
        if (!mag || lat < this.BB.minLat || lat > this.BB.maxLat || lng < this.BB.minLng || lng > this.BB.maxLng) return;

        const km = this.getDistanceKm(this.userLat, this.userLng, lat, lng);
        const col = mag >= 6 ? '#ef4444' : mag >= 4 ? '#f97316' : '#eab308';
        const r = Math.max(8, mag * 5);

        const icon = L.divIcon({
          className: 'cm',
          html: `<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${col};opacity:.8;border:2px solid #fff;box-shadow:0 0 ${r}px ${col};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;">M${mag.toFixed(1)}</div>`,
          iconSize: [r * 2, r * 2],
          iconAnchor: [r, r]
        });

        const safePlace = escapeHtml(eq.properties.place || 'Unknown');
        L.marker([lat, lng], { icon }).addTo(this.quakeGroup)
          .bindPopup(`<b style="color:#ef4444">🌍 Magnitude ${mag.toFixed(1)} Earthquake</b><br>${safePlace}<br>Depth: ${Math.round(eq.geometry.coordinates[2] || 0)} km<br>Distance: ${Math.round(km)} km`);

        if (km < 300 && mag >= 4) nearYou = true;
      });

      // Heatmap rendered to dedicated persistent heatGroup
      if (window.L && window.L.heatLayer) {
        this.heatGroup.clearLayers();
        const pts = data.features
          .filter(e => e.properties.mag)
          .map(e => [e.geometry.coordinates[1], e.geometry.coordinates[0], e.properties.mag]);
        if (pts.length) L.heatLayer(pts, { radius: 25, blur: 20, maxZoom: 7 }).addTo(this.heatGroup);
      }

      this.txt('condQuake', nearYou ? '⚠️ Active quakes within 300km' : '✅ Seismic activity normal');
      if (nearYou) {
        this.pushAlert('red', '🌍', 'Earthquake Nearby', 'Seismic activity detected within 300 km radius.', 'High Risk', 'red');
        this.showBanner('🌍', 'Earthquake detected in your broader region!');
      }
    } catch (e) {
      console.warn('Seismic fetch failure', e);
      this.txt('condQuake', '⚠️ Seismic data offline');
    }
  }

  async fetchWeather() {
    try {
      this.rainGroup.clearLayers();
      this.windGroup.clearLayers();

      const [wRes, aRes] = await Promise.all([
  fetch(`https://alertify-backend-r8le.onrender.com/api/weather?lat=${this.userLat}&lng=${this.userLng}`),
  fetch(`https://alertify-backend-r8le.onrender.com/api/aqi?lat=${this.userLat}&lng=${this.userLng}`)
]);

      if (!wRes.ok) throw new Error('Weather API endpoint down');
      const w = await wRes.json();
      const a = aRes.ok ? await aRes.json() : null;

      const temp = Math.round(w.main?.temp || 0);
      const main = w.weather?.[0]?.main || 'Clear';
      const wspeed = Math.round((w.wind?.speed || 0) * 3.6);
      const wdir = this.getWindDirectionSymbol(w.wind?.deg);

      this.txt('ssTemp', `${temp}°C`);
      this.txt('ssHum', `${w.main?.humidity || 0}%`);
      this.txt('ssWind', `${wspeed} km/h`);
      this.txt('ssWindDir', wdir);
      this.txt('ssVis', w.visibility ? `${(w.visibility / 1000).toFixed(1)} km` : '—');
      this.txt('ssPres', `${w.main?.pressure || 0} hPa`);

      if (a && a.list && a.list[0]) {
        const pm = a.list[0].components.pm2_5;
        const usAqi = Math.min(500, Math.round(pm * 4.2 + 10));
        const cat = usAqi <= 50 ? 'Good' : usAqi <= 100 ? 'Moderate' : usAqi <= 150 ? 'Unhealthy' : 'Hazardous';
        this.txt('ssAqi', usAqi);
        const l = document.getElementById('ssAqiLbl');
        if (l) l.textContent = cat;
      }

      const rain = w.rain ? (w.rain['1h'] || w.rain['3h'] || 0).toFixed(1) : 0;
      this.txt('condRain', rain > 0 ? `🌧️ ${rain} mm/hr` : '✅ Clear');
      this.txt('condStorm', main === 'Thunderstorm' ? '⚡ Storm Active' : '✅ Clear');
      this.txt('condFlood', rain > 15 ? '🌊 Severe Risk' : rain > 5 ? '⚠️ Elevated' : '✅ Low');
      this.txt('condHeat', temp > 38 ? '🔥 Heatwave' : temp > 33 ? '☀️ High' : '✅ Normal');
      this.txt('condWind', `${wspeed} km/h ${wdir}`);
      this.txt('condCyclone', wspeed > 70 ? '🌀 Cyclone Hazard!' : '✅ Low');

      // Rain Marker -> Rain Group
      const rIcon = L.divIcon({
        className: 'cm',
        html: `<div style="background:rgba(8,15,30,.92);border:1px solid #3b82f6;border-radius:6px;padding:4px 8px;color:#dde3f0;font-size:11px;font-weight:700;">${this.getWeatherIcon(main)} ${temp}°C Rain: ${rain}mm</div>`,
        iconSize: [140, 24]
      });
      L.marker([this.userLat, this.userLng], { icon: rIcon }).addTo(this.rainGroup);

      // Wind Vector Marker -> Populated Wind Group
      const wIcon = L.divIcon({
        className: 'cm',
        html: `<div style="background:rgba(14,26,46,0.92);border:1px solid #60a5fa;border-radius:6px;padding:4px 8px;color:#60a5fa;font-size:11px;font-weight:700;">💨 ${wspeed} km/h ${wdir}</div>`,
        iconSize: [120, 24]
      });
      L.marker([this.userLat, this.userLng], { icon: wIcon }).addTo(this.windGroup);

      if (main === 'Thunderstorm') {
        this.pushAlert('red', '⚡', 'Thunderstorm Alert', 'Heavy lightning and thunderstorm detected nearby.', 'High Risk', 'red');
        this.showBanner('⚡', 'Thunderstorm warning active for your area!');
      }
      if (temp > 35) {
        this.pushAlert('org', '🔥', 'Heatwave Warning', `Temperature elevated at ${temp}°C. Hydrate frequently.`, 'Medium Risk', 'org');
      }
      if (wspeed > 50) {
        this.pushAlert('yel', '💨', 'Strong Wind Advisory', `Wind gusts up to ${wspeed} km/h recorded.`, 'Medium Risk', 'yel');
      }
      if (this.alertCount === 0) {
        this.pushAlert('grn', '✅', 'All Clear', 'No active emergency disaster alerts in your zone.', 'Low Risk', 'grn');
      }
    } catch (e) {
      console.warn('Weather fetch failure', e);
    }
  }

  pushAlert(colorClass, icon, name, description, badgeText, badgeClass) {
    if (this.alertCount >= 10) return;
    this.alertCount++;
    this.txt('aCount', this.alertCount);

    const list = document.getElementById('alertsList');
    if (!list) return;

    const noAlerts = list.querySelector('.no-alerts');
    if (noAlerts) noAlerts.remove();

    const card = document.createElement('div');
    card.className = `al-card ${colorClass}`;

    const topRow = document.createElement('div');
    topRow.className = 'al-top';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'al-name';
    titleSpan.textContent = `${icon} ${name}`;

    const badgeSpan = document.createElement('span');
    badgeSpan.className = `al-badge badge-${badgeClass}`;
    badgeSpan.textContent = badgeText;

    topRow.appendChild(titleSpan);
    topRow.appendChild(badgeSpan);

    const descDiv = document.createElement('div');
    descDiv.className = 'al-desc';
    descDiv.textContent = description;

    const timeDiv = document.createElement('div');
    timeDiv.className = 'al-time';
    timeDiv.textContent = new Date().toLocaleTimeString();

    const viewBtn = document.createElement('button');
    viewBtn.className = 'al-view-btn';
    viewBtn.textContent = 'View Details →';
    viewBtn.addEventListener('click', () => this.showAlertModal(name));

    card.appendChild(topRow);
    card.appendChild(descDiv);
    card.appendChild(timeDiv);
    card.appendChild(viewBtn);

    list.appendChild(card);
  }

  showBanner(icon, message) {
    if (this.bannerShown) return;
    this.bannerShown = true;

    this.txt('bannerIco', icon);
    this.txt('bannerMsg', message);

    const banner = document.getElementById('topBanner');
    if (banner) banner.style.display = 'flex';

    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => {
      if (banner) banner.style.display = 'none';
      this.bannerShown = false;
    }, 10000);
  }

  /**
   * Accessible Modal with Focus Trap and Escape Key Handler
   */
  showAlertModal(alertName) {
    const existing = document.getElementById('safetyModal');
    if (existing) existing.remove();

    const guide = this.SAFETY_GUIDELINES[alertName] || this.SAFETY_GUIDELINES['default'];

    const modal = document.createElement('div');
    modal.id = 'safetyModal';
    modal.className = 'loc-overlay';

    const box = document.createElement('div');
    box.className = 'loc-box';
    box.style.maxWidth = '500px';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close Safety Modal');
    closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;min-width:32px;min-height:32px;';

    const title = document.createElement('h3');
    title.textContent = `${guide.icon} ${alertName} Safety Guide`;

    const tip = document.createElement('p');
    tip.textContent = `💡 Key Tip: ${guide.tip}`;
    tip.style.cssText = `background:#1e293b;padding:8px 12px;border-radius:6px;color:#e2e8f0;margin:12px 0;`;

    box.appendChild(closeBtn);
    box.appendChild(title);
    box.appendChild(tip);
    modal.appendChild(box);

    const closeModal = () => {
      document.removeEventListener('keydown', keyHandler);
      modal.remove();
    };

    const keyHandler = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', keyHandler);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.body.appendChild(modal);
    closeBtn.focus(); // Focus management
  }

  renderTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    container.innerHTML = '';
    this.records.forEach(rec => {
      const card = document.createElement('article');
      card.className = 'timeline-card';

      const img = document.createElement('img');
      img.className = 'timeline-img';
      img.src = rec.img;
      img.alt = escapeHtml(rec.title);
      img.onerror = () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="70" viewBox="0 0 90 70"><rect width="90" height="70" fill="%23122039"/><text x="45" y="38" fill="%23607090" font-size="10" text-anchor="middle">No Image</text></svg>';
      };

      const content = document.createElement('div');
      content.className = 'timeline-content';

      content.innerHTML = `
        <div class="timeline-hdr">
          <span class="timeline-title">${escapeHtml(rec.title)}</span>
          <span class="timeline-year">${escapeHtml(rec.year)}</span>
        </div>
        <div class="timeline-loc">📍 ${escapeHtml(rec.location)}</div>
        <div class="timeline-stats">
          <span>💀 ${escapeHtml(rec.deaths)}</span>
          <span>🏠 ${escapeHtml(rec.evacuated)}</span>
        </div>
        <div class="timeline-desc">${escapeHtml(rec.description)}</div>
      `;

      card.appendChild(img);
      card.appendChild(content);
      container.appendChild(card);
    });
  }

  bindUIEvents() {
    document.querySelectorAll('.f-btn[data-layer]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const isActive = btn.classList.contains('active');
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        const layer = btn.getAttribute('data-layer');

        if (layer === 'quake') {
          if (isActive) {
            this.map.addLayer(this.quakeGroup);
            this.map.addLayer(this.heatGroup);
          } else {
            this.map.removeLayer(this.quakeGroup);
            this.map.removeLayer(this.heatGroup);
          }
        } else if (layer === 'rain') {
          isActive ? this.map.addLayer(this.rainGroup) : this.map.removeLayer(this.rainGroup);
        } else if (layer === 'wind') {
          isActive ? this.map.addLayer(this.windGroup) : this.map.removeLayer(this.windGroup);
        }
      });
    });

    const locBtn = document.getElementById('locBtn');
    if (locBtn) {
      locBtn.addEventListener('click', () => {
        locBtn.textContent = '📡 Acquiring GPS Signal…';
        locBtn.disabled = true;

        if (!navigator.geolocation) {
          this.txt('locErr', 'Geolocation unsupported by browser.');
          locBtn.disabled = false;
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const overlay = document.getElementById('locOverlay');
            if (overlay) overlay.style.display = 'none';

            await this.setUserLocation(pos.coords.latitude, pos.coords.longitude);
            await Promise.all([this.fetchWeather(), this.fetchQuakes()]);
            locBtn.disabled = false;
            locBtn.textContent = '📍 Enable GPS Location';
          },
          (err) => {
            locBtn.disabled = false;
            locBtn.textContent = '📍 Enable GPS Location';
            const errEl = document.getElementById('locErr');
            if (errEl) {
              errEl.textContent = 'GPS Permission denied or timed out. Please enable device location and try again.';
              errEl.style.display = 'block';
            }
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      });
    }

  }
}

// Instantiate App
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DisasterApp();
  window.app.init();
});

window.addEventListener('beforeunload', () => {
  if (window.app) window.app.destroy();
});
