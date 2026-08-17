/* ============================================================
   DISASTER MANAGEMENT SYSTEM — WEATHER DASHBOARD
   weather.js  — FIXED VERSION
   Issues fixed:
   1. API keys removed from frontend → routed through backend
   2. IP-location removed → GPS only (was causing Nayagarh bug)
   3. enableHighAccuracy: true, timeout 20s, maximumAge: 0
   4. applyAlertsReal defined twice — removed duplicate, fixed scope
   5. Highlights section (hl-max, hl-min etc.) now populated
   6. updated-time now set
   7. View Details button on heatwave banner now works
   8. Village search added (same as map.js pattern)
   ============================================================ */

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ── HELPERS ──────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }

function wxEmoji(main, icon) {
  const m = (main || '').toLowerCase();
  if (m.includes('thunderstorm')) return '⛈️';
  if (m.includes('drizzle'))      return '🌦️';
  if (m.includes('rain'))         return '🌧️';
  if (m.includes('snow'))         return '❄️';
  if (m.includes('mist') || m.includes('fog') || m.includes('haze')) return '🌫️';
  if (m.includes('cloud'))        return icon && icon.startsWith('02') ? '⛅' : '☁️';
  if (m.includes('clear'))        return '☀️';
  return '🌤️';
}

function toTime(unix, tz) {
  const d = new Date((unix + tz) * 1000);
  let h = d.getUTCHours(), m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
}

function getSimpleWeather(main, desc) {
  const d = (desc || '').toLowerCase();
  if (main === 'Clear')        return 'Sunny';
  if (main === 'Clouds')       return d.includes('few') ? 'Partly Sunny' : 'Cloudy';
  if (main === 'Rain')         return 'Rainy';
  if (main === 'Drizzle')      return 'Light Rain';
  if (main === 'Thunderstorm') return 'Thunderstorm ⚡';
  if (main === 'Snow')         return 'Snowfall ❄️';
  if (main === 'Mist' || main === 'Fog' || main === 'Haze') return 'Hazy 🌫️';
  return desc || main;
}

function aqiCategory(aqi) {
  const cats   = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  const colors = ['', '#27ae60', '#f1c40f', '#e67e22', '#e74c3c', '#8e44ad'];
  return {
    label: cats[aqi]   || 'Moderate',
    color: colors[aqi] || '#e67e22',
    pct:   Math.min(((aqi - 1) / 4) * 100, 100)
  };
}

const TIPS = {
  Rain: 'Carry umbrella 🌂',
  Drizzle: 'Light rain — carry umbrella 🌂',
  Thunderstorm: '⚡ Stay indoors! Lightning is dangerous.',
  Snow: 'Bundle up ❄️',
  Clear: 'Enjoy the sunshine ☀️',
  Clouds: 'Partly cloudy ⛅',
  Mist: 'Drive carefully 🌫️',
  Fog: 'Low visibility — drive slow 🌫️'
};

async function reverseGeocode(lat, lon) {
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    const a    = data.address || {};
    const village = a.village || a.town || a.city || a.county || '';
    const district = a.state_district || a.state || '';
    return village ? (district ? village + ', ' + district : village) : 'Your Location';
  } catch { return 'Your Location'; }
}

/* ── ALERT DISPLAY ────────────────────────────────────────── */
function resetAlerts() {
  ['alert-storm','alert-rain','alert-heat','alert-clear'].forEach(id => {
    const el = $(id); if (el) el.style.display = 'none';
  });
  const banner = $('hw-banner');
  if (banner) banner.style.display = 'none';
}

function applyAlerts(wxMain, temp) {
  resetAlerts();
  let anyAlert = false;

  if (wxMain === 'Thunderstorm') {
    const el = $('alert-storm');
    if (el) el.style.display = 'flex';
    anyAlert = true;
  }
  if (wxMain === 'Rain' || wxMain === 'Drizzle') {
    const el = $('alert-rain');
    if (el) el.style.display = 'flex';
    anyAlert = true;
  }
  if (temp > 33) {
    const heat = $('alert-heat');
    if (heat) heat.style.display = 'flex';
    const sub = $('heat-sub');
    if (sub) sub.textContent = 'Temperature may reach ' + (temp + 2) + '°C tomorrow. Stay hydrated.';
    const banner = $('hw-banner');
    if (banner) banner.style.display = 'flex';
    const hwBtn = document.querySelector('.hw-btn');
    if (hwBtn) hwBtn.onclick = () => showWeatherSafetyModal('Heatwave Warning');
    anyAlert = true;
  }
  if (!anyAlert) {
    const el = $('alert-clear');
    if (el) el.style.display = 'flex';
  }
}

/* ── FORECAST RENDERER ────────────────────────────────────── */
function renderForecastFrom5Day(list) {
  const grid = $('forecast-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const days = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!days[date]) {
      days[date] = { temps: [], weather: item.weather[0], pops: [] };
    }
    days[date].temps.push(item.main.temp);
    days[date].pops.push(item.pop || 0);
  });

  Object.keys(days).slice(0, 7).forEach((dateKey, i) => {
    const day    = days[dateKey];
    const dateObj = new Date(dateKey);
    const label  = i === 0 ? 'Today' : DAYS[dateObj.getDay()];
    const hi     = Math.max(...day.temps);
    const lo     = Math.min(...day.temps);
    const avgPop = day.pops.reduce((a, b) => a + b, 0) / (day.pops.length || 1);

    const el = document.createElement('div');
    el.className = 'fc-day' + (i === 0 ? ' today' : '');
    el.innerHTML = `
      <div class="fc-label">${label}</div>
      <div class="fc-ico">${wxEmoji(day.weather.main)}</div>
      <div class="fc-hi">${Math.round(hi)}°</div>
      <div class="fc-lo">${Math.round(lo)}°</div>
      <div class="fc-rain">💧 ${Math.round(avgPop * 100)}%</div>
    `;
    grid.appendChild(el);
  });
}

/* ── AQI RENDERER ─────────────────────────────────────────── */
function renderAQI(aqiData) {
  if (!aqiData || !aqiData.list || !aqiData.list[0]) return;
  const item   = aqiData.list[0];
  const comp   = item.components;
  const aqiVal = item.main.aqi;
  const cat    = aqiCategory(aqiVal);

  $('aqi-num').textContent  = aqiVal;
  $('aqi-num').style.color  = cat.color;
  $('aqi-cat').textContent  = cat.label;
  $('aqi-cat').style.color  = cat.color;
  $('aqi-needle').style.left = cat.pct + '%';

  $('pm25').textContent = comp.pm2_5.toFixed(1) + ' µg/m³';
  $('pm10').textContent = comp.pm10.toFixed(1)  + ' µg/m³';
  $('o3').textContent   = comp.o3.toFixed(1)    + ' µg/m³';
  $('no2').textContent  = comp.no2.toFixed(1)   + ' µg/m³';
  $('so2').textContent  = comp.so2.toFixed(1)   + ' µg/m³';
  $('co').textContent   = (comp.co / 1000).toFixed(2) + ' mg/m³';
}

/* ── HIGHLIGHTS RENDERER ──────────────────────────────────── */
function renderHighlights(cur, fore, tz) {
  // Max / min from 5-day forecast today
  const todayStr = new Date().toDateString();
  const todayItems = (fore.list || []).filter(item =>
    new Date(item.dt * 1000).toDateString() === todayStr
  );

  if (todayItems.length) {
    const temps = todayItems.map(i => i.main.temp);
    const rains = todayItems.map(i => (i.rain && i.rain['3h']) || 0);
    $('hl-max').textContent      = Math.round(Math.max(...temps)) + '°C';
    $('hl-min').textContent      = Math.round(Math.min(...temps)) + '°C';
    $('hl-rain').textContent     = rains.reduce((a,b)=>a+b,0).toFixed(1) + ' mm';
  } else {
    $('hl-max').textContent = Math.round(cur.main.temp_max) + '°C';
    $('hl-min').textContent = Math.round(cur.main.temp_min) + '°C';
    $('hl-rain').textContent = ((cur.rain && cur.rain['1h']) || 0).toFixed(1) + ' mm';
  }

  $('hl-humidity').textContent = cur.main.humidity + '%';
  $('hl-wind').textContent     = Math.round(cur.wind.speed * 3.6) + ' km/h';

  // Sunrise from current weather
  if (cur.sys && cur.sys.sunrise) {
    $('hl-sunrise').textContent = toTime(cur.sys.sunrise, tz);
  }
}

/* ── MAIN WEATHER LOADER ──────────────────────────────────── */
async function loadWeatherData(lat, lon) {
  try {
   const [curRes, foreRes, aqiRes] = await Promise.all([
  fetch(`https://alertify-backend-r8le.onrender.com/api/weather?lat=${lat}&lng=${lon}`),
  fetch(`https://alertify-backend-r8le.onrender.com/api/forecast?lat=${lat}&lng=${lon}`),
  fetch(`https://alertify-backend-r8le.onrender.com/api/aqi?lat=${lat}&lng=${lon}`)
]);

    const cur  = await curRes.json();
    const fore = await foreRes.json();
    const aqi  = await aqiRes.json();

    if (cur.cod && cur.cod !== 200) throw new Error('Weather API error: ' + cur.message);

    // Location name (village-level using Nominatim)
    const place = await reverseGeocode(lat, lon);
    $('loc-name').textContent = place;

    // Updated time
    const now = new Date();
    $('updated-time').textContent = 'Updated: ' + now.toLocaleTimeString();

    const temp   = Math.round(cur.main.temp);
    const feels  = Math.round(cur.main.feels_like);
    const wxMain = cur.weather[0].main;
    const wxIcon = cur.weather[0].icon;
    const tz     = cur.timezone || 19800; // IST default

    $('wx-icon-big').textContent = wxEmoji(wxMain, wxIcon);
    $('main-temp').textContent   = temp + '°C';
    $('feels-like').textContent  = 'Feels like ' + feels + '°';
    $('wx-desc').textContent     = getSimpleWeather(wxMain, cur.weather[0].description);
    $('wx-tip').textContent      = TIPS[wxMain] || '';

    $('stat-humidity').textContent   = cur.main.humidity + '%';
    $('stat-wind').textContent       = Math.round(cur.wind.speed * 3.6) + ' km/h';
    $('stat-pressure').textContent   = cur.main.pressure + ' hPa';
    $('stat-visibility').textContent = ((cur.visibility || 0) / 1000).toFixed(1) + ' km';
    $('stat-cloud').textContent      = (cur.clouds && cur.clouds.all) + '%';

    renderForecastFrom5Day(fore.list || []);
    renderAQI(aqi);
    renderHighlights(cur, fore, tz);
    applyAlerts(wxMain, temp);

  } catch (err) {
    console.error('Weather load error:', err);
    $('loc-name').textContent = '⚠️ Could not load weather. Check server.';
  }
}

/* ── VILLAGE SEARCH — 4-engine with smart fallback ─────── */
async function searchWeatherVillage(query) {
  if (!query || query.trim().length < 2) {
    alert('Type your village name.\nExample: Bindipur\nExample: Bindipur Puri');
    return;
  }
  const btn = $('wVillageSearchBtn');
  const errEl = $('wLocErr');
  if (btn) { btn.textContent = '🔍 Searching…'; btn.disabled = true; }
  if (errEl) errEl.style.display = 'none';

  const q = query.trim();
  let found = null;

  // ENGINE 1: Nominatim
  const attempts = [q+', Puri, Odisha, India', q+', Odisha, India', q+', Odisha', q+', India', q, q.split(' ')[0]+', Odisha, India'];
  for (const attempt of attempts) {
    try {
      const r = await fetch('https://nominatim.openstreetmap.org/search?q='+encodeURIComponent(attempt)+'&format=json&limit=3&countrycodes=in', { headers: {'Accept-Language':'en','User-Agent':'DisasterApp/1.0'} });
      const d = await r.json();
      if (d && d.length > 0) { found = { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon), name: d[0].display_name }; break; }
    } catch(e) {}
  }

  // ENGINE 2: Photon
  if (!found) {
    try {
      const r = await fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(q+' Odisha India')+'&limit=3&lang=en', { headers: {'User-Agent':'DisasterApp/1.0'} });
      const d = await r.json();
      if (d && d.features && d.features.length > 0) {
        const f = d.features[0];
        found = { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], name: f.properties.name + ', ' + (f.properties.state || 'Odisha') };
      }
    } catch(e) {}
  }

  // ENGINE 3: Overpass
  if (!found) {
    try {
      const fw = q.split(' ')[0];
      const oq = '[out:json][timeout:15];(node["name"~"'+fw+'",i](17.8,81.3,22.6,87.5);way["name"~"'+fw+'",i](17.8,81.3,22.6,87.5););out center 5;';
      const r = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body:'data='+encodeURIComponent(oq) });
      const d = await r.json();
      if (d.elements && d.elements.length > 0) {
        const el = d.elements[0];
        const lat = el.lat || (el.center && el.center.lat);
        const lon = el.lon || (el.center && el.center.lon);
        if (lat && lon) found = { lat, lon, name: el.tags.name || q };
      }
    } catch(e) {}
  }

  if (btn) { btn.textContent = '🔍 Search'; btn.disabled = false; }

  // ENGINE 4: Smart fallback — show district
  if (!found) {
    const dg = q.split(' ').length > 1 ? q.split(' ').pop() : 'Puri';
    let fLat = 19.8135, fLon = 85.8312;
    try {
      const r = await fetch('https://nominatim.openstreetmap.org/search?q='+encodeURIComponent(dg+' district Odisha India')+'&format=json&limit=1', { headers: {'Accept-Language':'en','User-Agent':'DisasterApp/1.0'} });
      const d = await r.json();
      if (d && d.length > 0) { fLat = parseFloat(d[0].lat); fLon = parseFloat(d[0].lon); }
    } catch(e) {}
    const overlay = $('wLocOverlay');
    if (overlay) overlay.style.display = 'none';
    loadWeatherData(fLat, fLon);
    if (errEl) {
      errEl.style.display = 'block';
     errEl.innerHTML = `"${q}" not in map database. <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q + ' Odisha India')}" target="_blank" style="color:#3b82f6;font-weight:600;">Search on Google Maps →</a>`;
    }
    return;
  }

  const overlay = $('wLocOverlay');
  if (overlay) overlay.style.display = 'none';
  if (errEl) errEl.style.display = 'none';
  localStorage.setItem('wx_savedLoc', JSON.stringify({ lat: found.lat, lon: found.lon, name: found.name }));
  loadWeatherData(found.lat, found.lon);
}


/* ── SAFETY MODAL FOR HEATWAVE BANNER ─────────────────────── */
function showWeatherSafetyModal(alertType) {
  const existing = $('wxSafetyModal');
  if (existing) existing.remove();

  const TIPS_DETAIL = {
    'Heatwave Warning': {
      icon: '🌡️', color: '#ea580c',
      tip: 'Heatstroke is life-threatening. If someone stops sweating in 40°C+ heat, call 112 immediately.',
      dos: ['Drink 3–4 litres of water even if not thirsty','Stay indoors 11 AM – 4 PM','Wear light cotton clothes','Use ORS sachets if sweating heavily','Check on elderly and children often'],
      donts: ['Do NOT go outside without head cover','Do NOT drink alcohol or tea — they dehydrate','Do NOT leave anyone in a parked vehicle','Do NOT do heavy outdoor work at peak heat'],
      contacts: [{ name: 'Emergency', num: '112' },{ name: 'Odisha Health', num: '104' },{ name: 'Ambulance', num: '108' }]
    }
  };

  const data = TIPS_DETAIL[alertType] || TIPS_DETAIL['Heatwave Warning'];

  const modal = document.createElement('div');
  modal.id = 'wxSafetyModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';

  modal.innerHTML = `
    <div style="background:#0f172a;border:1.5px solid #334155;border-radius:16px;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;padding:22px;position:relative;">
      <button onclick="document.getElementById('wxSafetyModal').remove()"
        style="position:absolute;top:12px;right:12px;background:#1e293b;border:none;color:#94a3b8;font-size:18px;width:30px;height:30px;border-radius:50%;cursor:pointer;">✕</button>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="font-size:30px;">${data.icon}</div>
        <div>
          <div style="font-size:15px;font-weight:700;color:#f1f5f9;">${alertType}</div>
          <div style="font-size:11px;color:${data.color};font-weight:600;">Safety Guide</div>
        </div>
      </div>
      <div style="background:#1e293b;border-left:3px solid ${data.color};border-radius:6px;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#cbd5e1;line-height:1.7;">
        💡 ${data.tip}
      </div>
      <div style="font-size:12px;font-weight:700;color:#22c55e;margin-bottom:6px;">✅ What TO DO</div>
      ${data.dos.map(d=>`<div style="font-size:11px;color:#e2e8f0;line-height:1.8;display:flex;gap:6px;margin-bottom:4px;"><span style="color:#22c55e">▸</span><span>${d}</span></div>`).join('')}
      <div style="font-size:12px;font-weight:700;color:#ef4444;margin:12px 0 6px;">❌ What NOT to do</div>
      ${data.donts.map(d=>`<div style="font-size:11px;color:#e2e8f0;line-height:1.8;display:flex;gap:6px;margin-bottom:4px;"><span style="color:#ef4444">▸</span><span>${d}</span></div>`).join('')}
      <div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:14px;">
        <div style="font-size:12px;font-weight:700;color:#f1f5f9;margin-bottom:8px;">📞 Emergency</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
          ${data.contacts.map(c=>`<a href="tel:${c.num}" style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:7px;text-decoration:none;text-align:center;"><div style="font-size:10px;color:#94a3b8;">${c.name}</div><div style="font-size:15px;font-weight:700;color:#3b82f6;">${c.num}</div></a>`).join('')}
        </div>
      </div>
      <a href="Safezones.html" style="display:block;text-align:center;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;padding:11px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;margin-top:12px;">🛟 Find Nearest Safe Zone →</a>
    </div>`;

  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

/* ── GPS LOCATION INIT ────────────────────────────────────── */
function startWeather() {
  const btn = $('wAllowBtn');
  if (btn) { btn.textContent = '📡 Waiting for GPS…'; btn.disabled = true; }

  // Try saved location first
  const saved = localStorage.getItem('wx_savedLoc');
  if (saved) {
    try {
      const v = JSON.parse(saved);
      const overlay = $('wLocOverlay');
      if (overlay) overlay.style.display = 'none';
      loadWeatherData(v.lat, v.lon);
    } catch(e) { localStorage.removeItem('wx_savedLoc'); }
  }

  if (!navigator.geolocation) {
    if (btn) { btn.textContent = '📍 Allow Location'; btn.disabled = false; }
    const err = $('wLocErr');
    if (err) { err.textContent = 'GPS not supported. Use village search below.'; err.style.display = 'block'; }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      if (btn) { btn.textContent = '✅ Location Found'; btn.disabled = false; }
      const overlay = $('wLocOverlay');
      if (overlay) overlay.style.display = 'none';
      const err = $('wLocErr');
      if (err) err.style.display = 'none';
      const lat = pos.coords.latitude, lon = pos.coords.longitude;
      localStorage.setItem('wx_savedLoc', JSON.stringify({ lat, lon }));
      loadWeatherData(lat, lon);
    },
    err => {
      if (btn) { btn.textContent = '📍 Allow Location'; btn.disabled = false; }
      const msgs = { 1:'Location blocked. Use village search below.', 2:'GPS unavailable. Use village search.', 3:'GPS timed out. Use village search below.' };
      const errEl = $('wLocErr');
      if (errEl) { errEl.textContent = msgs[err.code] || 'Could not get location.'; errEl.style.display = 'block'; }
    },
    {
      enableHighAccuracy: true,   // ← FIXED
      timeout: 20000,             // ← FIXED (was 60000 effectively)
      maximumAge: 0               // ← FIXED (was 60000)
    }
  );
}

/* ── Auto-refresh every 10 minutes ─────────────────────────── */
setInterval(() => {
  const saved = localStorage.getItem('wx_savedLoc');
  if (saved) {
    try { const v = JSON.parse(saved); loadWeatherData(v.lat, v.lon); } catch(e) {}
  }
}, 10 * 60 * 1000);

/* ── START ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', startWeather);
