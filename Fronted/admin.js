// 🍞 Admin Floating Toast System
function showAdminToast(msg, isSuccess = true) {
  var old = document.getElementById("adminGlobalToast");
  if (old) old.remove();
  var toast = document.createElement("div");
  toast.id = "adminGlobalToast";
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: ${isSuccess ? "#16a34a" : "#dc2626"};
    color: white;
    padding: 13px 26px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    z-index: 999999999;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    text-align: center;
    transition: all 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast) toast.remove(); }, 3000);
}


// ================= CENTRAL API & STATIC CONFIG =================
const isLocal = window.location.hostname === "localhost" || 
                window.location.hostname === "127.0.0.1" || 
                window.location.protocol === "file:";

const SERVER_URL = isLocal ? "http://localhost:5000" : "https://alertify-backend-r8le.onrender.com";
const BASE_API_URL = `${SERVER_URL}/api`;





let selectedComplaintId = null;
let selectedStatus = null;
let _allComplaintsCache = [];
let _allDamageCache = [];
// 🔐 Protect Admin Page
const token = localStorage.getItem("token");
// Token check OK (console.log removed — was exposing JWT to DevTools)

if (!token) {
  window.location.href = "admin-login.html";
}
document.addEventListener("DOMContentLoaded", function() {
 
  var adminName = localStorage.getItem("adminName") || "";

var nameEl = document.getElementById("adminName");

if (nameEl) {
  nameEl.textContent =
    t("ngoDashWelcome") + " " + (adminName || "Admin") + " 👋";
}

  // Set avatar initials
  setAdminAvatar(adminName);
  updateSosAudioButtonUI();
loadComplaints();
loadNgos();
loadSOS();
loadStates();
loadDamageReports();
renderAdminAnalyticsCharts();
  // Logout button
  var logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      if (!confirm("Are you sure you want to logout?")) return;
      localStorage.clear();
      window.location.href = "admin-login.html";
    });
  }
});

// ── AVATAR FUNCTIONS ──
function getAdminInitials(name) {
  if (!name || !name.trim()) return "A";
  var words = name.trim().split(" ").filter(function(w){ return w.length > 0; });
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function setAdminAvatar(name) {
  var initials = getAdminInitials(name);
  var loggedUser = localStorage.getItem("loggedInUser") || "ADM-HQ";

  var circle = document.getElementById("adminAvatar");
  var menuIcon = document.getElementById("adminMenuAvatarIcon");
  var nameEl = document.getElementById("adminAvatarName");
  var idEl = document.getElementById("adminIdDisplay");

  if (circle) circle.textContent = initials;
  if (menuIcon) menuIcon.textContent = initials;
  if (nameEl) nameEl.textContent = name || "Disaster Control Admin";
  if (idEl) idEl.textContent = loggedUser;
}

function toggleAdminMenu() {
  var menu = document.getElementById("adminAvatarMenu");
  if (!menu) return;
  menu.classList.toggle("hidden");
  
  setTimeout(function() {
    function closeMenuOnClickOutside(e) {
      if (!e.target.closest(".avatar-wrap")) {
        menu.classList.add("hidden");
        document.removeEventListener("click", closeMenuOnClickOutside);
      }
    }
    document.addEventListener("click", closeMenuOnClickOutside);
  }, 0);
}

function toggleSection(sectionId) {
  const sections = [
    "complaints-section",
    "ngo-section",
    "sos-section",
    "alerts-section",
    "damage-section",
    "broadcast-section",
    "shelter-section"
  ];

  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;

    if (id === sectionId) {
      sec.classList.toggle("hidden");

      // Load section data only when it is opened/visible
      if (!sec.classList.contains("hidden")) {
        if (sectionId === "alerts-section") {
          loadLiveAlerts();
          loadUnifiedDisasterMap();
        }
        if (sectionId === "damage-section") loadDamageReports();
        if (sectionId === "broadcast-section") loadBroadcasts();
        if (sectionId === "shelter-section") loadShelters();
      }
    } else {
      sec.classList.add("hidden");
    }
  });
}










// === Complaint Management ===
async function loadComplaints() {

  const res = await fetch(`${BASE_API_URL}/admin/complaints`, {
  headers: {
    "Authorization": "Bearer " + token
  }
});
  const allComplaints = await res.json();
  _allComplaintsCache = Array.isArray(allComplaints) ? allComplaints : [];
  // 📊 Update Pending Complaints Counter
const pendingCount = Array.isArray(allComplaints) ? allComplaints.filter(c => c.status === "Under Progress" || c.status === "Submitted").length : 0;
const compKpi = document.getElementById("kpiComplaintsNum");
if (compKpi) compKpi.textContent = pendingCount;

  let tbody = document.querySelector("#complaintsTable tbody");
let newHTML = "";

 if (allComplaints.length === 0) {
  newHTML = `<tr><td colspan="5" style="text-align:center;">No complaints filed yet.</td></tr>`;
}

  allComplaints.forEach((c) => {
    let actionHtml = "";

    if (c.status === "Under Progress" || c.status === "Submitted") {
      actionHtml = `
        <button onclick="updateComplaint('${c.id || c._id}','Resolved')" style="background:#16a34a;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;margin-right:4px;">Resolve</button>
        <button onclick="updateComplaint('${c.id || c._id}','Rejected')" style="background:#dc2626;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">Reject</button>
      `;
    } else if (c.status === "Resolved") {
      actionHtml = `<span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;">✅ Resolved</span>`;
    } else if (c.status === "Rejected") {
      actionHtml = `<span style="background:#fee2e2;color:#b91c1c;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;">❌ Rejected</span>`;
    } else {
      actionHtml = `<span style="color:#64748b;font-size:12px;font-weight:600;">${c.status}</span>`;
    }

    newHTML += `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:12px;font-weight:600;color:#1e293b;">${c.id || "—"}</td>
        <td style="padding:12px;color:#334155;">${c.text || "—"}</td>
        <td style="padding:12px;"><strong style="color:${c.status === 'Resolved' ? '#16a34a' : c.status === 'Rejected' ? '#dc2626' : '#d97706'};">${c.status}</strong></td>
        <td style="padding:12px;color:#64748b;font-size:12px;">${c.date || "—"}</td>
        <td style="padding:12px;">${actionHtml}</td>
      </tr>
    `;
  });


 tbody.innerHTML = newHTML;
}
// Admin marks complaint as resolved
function updateComplaint(id, status) {

  selectedComplaintId = id;
  selectedStatus = status;

  openModal("Enter Reason:", "complaint", null, null);

}
// ================= LOAD NGOs =================
async function loadNgos() {
  try {
    const response = await fetch(`${BASE_API_URL}/admin/ngos`, {
  headers: {
    "Authorization": "Bearer " + token
  }
});

    const ngos = await response.json();
// 📊 Update Approved NGOs Counter
const approvedNgosCount = Array.isArray(ngos) ? ngos.filter(n => n.status === "Approved").length : 0;
const ngoKpi = document.getElementById("kpiNgosNum");
if (ngoKpi) ngoKpi.textContent = approvedNgosCount;
    const tbody = document.querySelector("#ngoTable tbody");
    

    displayNgos(ngos);
    loadOrders();
  } catch (error) {
    console.log("Error loading NGOs");
  }
}





function displayNgos(ngos) {
  var tbody = document.querySelector("#ngoTable tbody");
  let newHTML = "";
  if (!tbody) return;
 

 if (!ngos || !ngos.length) {
  newHTML = "<tr><td colspan='10' style='text-align:center;padding:20px;color:#94a3b8;'>No NGOs found</td></tr>";
}
  var statusColor = { Pending:"#f59e0b", Approved:"#16a34a", Rejected:"#dc2626" };

  ngos.forEach(function(ngo) {
    var sc   = statusColor[ngo.status] || "#64748b";
    var vols = "";
    if (ngo.volunteers && ngo.volunteers.length) {
      vols = ngo.volunteers.map(function(v){ return v.name || v; }).join(", ");
    } else {
      vols = ngo.volName || "—";
    }

    var ngoId2  = ngo._id  || "";
    var ngoNgoId = ngo.ngoId || "";
    var actionTd = "";
    if (ngo.status === "Pending") {
      actionTd = "<button data-id='" + ngoId2 + "' data-act='approve' class='ngo-act-btn' style='background:#16a34a;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;margin-right:4px;'>Approve</button>"
               + "<button data-id='" + ngoId2 + "' data-act='reject'  class='ngo-act-btn' style='background:#dc2626;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;'>Reject</button>";
    } else {
      actionTd = "<span style='color:#94a3b8;font-size:12px;'>No Action</span>";
    }
    var sendTd = "";
    if (ngo.status === "Approved") {
      sendTd = "<button data-ngoid='" + ngoNgoId + "' class='ngo-send-btn' style='background:#1d4ed8;color:white;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px;'>Send Order</button>";
    } else {
      sendTd = "<span style='color:#94a3b8;font-size:12px;'>—</span>";
    }

  newHTML +=
  "<tr style='border-bottom:1px solid #f1f5f9;'>"
  + "<td style='padding:10px 14px;font-size:12px;color:#64748b;'>" + (ngo.ngoId||"—") + "</td>"
  + "<td style='padding:10px 14px;font-weight:600;color:#1e293b;'>" + (ngo.ngoName||"—") + "</td>"
  + "<td style='padding:10px 14px;font-size:13px;'>" + (ngo.state||"—") + "</td>"
  + "<td style='padding:10px 14px;font-size:13px;'>" + (ngo.district||"—") + "</td>"
  + "<td style='padding:10px 14px;font-size:13px;'>" + (ngo.ngoType||"General") + "</td>"
  + "<td style='padding:10px 14px;font-size:13px;'>" + (ngo.headName||"—") + "</td>"
  + "<td style='padding:10px 14px;font-size:12px;'>" + vols + "</td>"
  + "<td style='padding:10px 14px;'><span style='background:" + sc + ";color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;'>" + (ngo.status||"—") + "</span></td>"
  + "<td style='padding:10px 14px;'>" + actionTd + "</td>"
  + "<td style='padding:10px 14px;'>" + sendTd + "</td>"
  + "</tr>";

    
  });
 tbody.innerHTML = newHTML;
}


// Event delegation for NGO approve/reject/send buttons
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("ngo-act-btn")) {
    var id  = e.target.getAttribute("data-id");
    var act = e.target.getAttribute("data-act");
    if (act === "approve") approveNgo(id);
    else if (act === "reject") rejectNgo(id);
  }
  if (e.target.classList.contains("ngo-send-btn")) {
    var ngoId = e.target.getAttribute("data-ngoid");
    sendHelp(ngoId);
  }
});

// ================= APPROVE =================
async function approveNgo(id) {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const res = await fetch(`${baseUrl}/admin/approve/${id}`, {
      method: "PUT",
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.ok) {
      showAdminToast("✅ NGO Approved Successfully!");
      loadNgos();
    } else {
      showAdminToast("❌ Failed to approve NGO", false);
    }
  } catch(e) {
    showAdminToast("❌ Network error", false);
  }
}

// ================= REJECT =================
async function rejectNgo(id) {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const res = await fetch(`${baseUrl}/admin/reject/${id}`, {
      method: "PUT",
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.ok) {
      showAdminToast("✅ NGO Request Rejected", false);
      loadNgos();
    } else {
      showAdminToast("❌ Failed to reject NGO", false);
    }
  } catch(e) {
    showAdminToast("❌ Network error", false);
  }
}



function openComplaints() {
  showPopup("📋 Complaints", `
    <ul>
      <li>Flood reported in Odisha – <b>Verified</b></li>
      <li>Road blockage due to landslide – <b>Pending</b></li>
      <li>Power outage report – <b>Resolved</b></li>
    </ul>
  `);
}



function contactNGO() {
  showPopup("🤝 Contact Nearest NGO", `
    <p>Nearby NGOs available for response:</p>
    <ul>
      <li>Red Cross India – <b>Active</b></li>
      <li>Goonj Foundation – <b>Available</b></li>
      <li>HelpAge India – <b>Responding</b></li>
    </ul>
    <button onclick="alert('✅ Help order sent to NGO!')">Send Help Order</button>
  `);
}

function showPopup(title, content) {
  const popup = document.getElementById("popup");
  document.getElementById("popupData").innerHTML = `<h2>${title}</h2>${content}`;
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}








async function loadOrders() {
  try {
    const response = await fetch(`${BASE_API_URL}/admin/orders`, {
      headers: { "Authorization": "Bearer " + token }
    });

    const orders = await response.json();
    const tbody = document.querySelector("#ordersTable tbody");

    let newHTML = ""; // ✅ ADD THIS LINE

    if (orders.length === 0) {
      newHTML = `<tr><td colspan="5">No orders yet</td></tr>`;
    }

    orders.forEach(order => {
      newHTML += `
      <tr>
        <td>${order.location}</td>
        <td>${order.note}</td>
        <td>${order.assignedNgo}</td>
        <td>${order.status}</td>
        <td>
  <div>${order.workNote || "Not updated yet"}</div>

${order.photo ? `
<div class="img-box">
  <img src="${SERVER_URL}/uploads/${order.photo}" 
       class="admin-img dmg-img-click"
       data-src="${SERVER_URL}/uploads/${order.photo}"
       onerror="this.style.display='none'">
  <div class="zoom-icon">🔍</div>
</div>
` : ""}
</td>
      </tr>
      `;
    });

    tbody.innerHTML = newHTML; // ✅ ALWAYS overwrite
  } catch (error) {
    console.log("Error loading orders");
  }
}





// ================= SOS MANAGEMENT ENGINE =================
let _isSosLoading = false;
let _cachedSosCount = 0;
let _allSosCache = [];
let _sosMapInstance = null;
let _sosMapMarkers = [];

// 1. Initialize Leaflet Map for SOS Coordinates
function initSosMap() {
  const mapContainer = document.getElementById("sosMap");
  if (!mapContainer || _sosMapInstance) return;

  // Center on India (Default Coordinates)
  _sosMapInstance = L.map("sosMap").setView([20.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(_sosMapInstance);
}

// 2. Load SOS Calls, Play Alarm, Plot Map Markers
async function loadSOS() {
  if (_isSosLoading) return;
  _isSosLoading = true;

  var refreshBtn = document.querySelector("#sos-section .btn-refresh");
  if (refreshBtn) {
    refreshBtn.style.opacity = "0.5";
    refreshBtn.textContent = "⏳ Refreshing...";
  }

  var container = document.getElementById("sosContainer");
  if (!container) { _isSosLoading = false; return; }

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    var res = await fetch(`${baseUrl}/admin/sos`, { 
      headers: { Authorization: "Bearer " + token } 
    });
    var sosList = await res.json();
    // 📊 Update Active SOS Counter
const activeSosCount = Array.isArray(sosList) ? sosList.filter(s => s.status === "Pending" || s.status === "Active").length : 0;
const sosKpi = document.getElementById("kpiSosNum");
if (sosKpi) sosKpi.textContent = activeSosCount;
    _allSosCache = Array.isArray(sosList) ? sosList : [];

    const activeList = _allSosCache.filter(s => s.status === "Pending" || s.status === "Active");

    // 🔊 Play Sound Alert on New Incoming SOS (Honoring Mute State)
    if (activeList.length > _cachedSosCount && _cachedSosCount !== 0) {
      if (!_isSosAudioMuted) {
        const audio = document.getElementById("sosAudio");
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      }
      showAdminToast(`🚨 NEW SOS ALERT RECEIVED! (${activeList.length} Active)`, false);
    }
    _cachedSosCount = activeList.length;

    // Initialize map if needed
    initSosMap();

    // Clear old map markers
    if (_sosMapInstance) {
      _sosMapMarkers.forEach(m => _sosMapInstance.removeLayer(m));
      _sosMapMarkers = [];
    }

    if (!_allSosCache.length) {
      container.innerHTML = "<p style='color:#94a3b8;padding:20px;text-align:center;'>✅ No SOS alerts received yet.</p>";
      _isSosLoading = false;
      if (refreshBtn) { refreshBtn.style.opacity = "1"; refreshBtn.textContent = "🔄 Refresh"; }
      return;
    }

    // Render Cards & Plot on Map
    let newHTML = _allSosCache.map(function(sos) {
      var isPending = sos.status === "Pending" || sos.status === "Active";
      var border = isPending ? "#dc2626" : "#16a34a";
      var bg = isPending ? "#fff5f5" : "#f0fdf4";
      var timeStr = new Date(sos.time || sos.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

      var isPre = sos.isPreLogin === true || (sos.userName && sos.userName.includes("Pre-Login"));
      var badgeHtml = isPre
        ? `<span style="background:#ea580c;color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:800;">⚠️ PRE-LOGIN CITIZEN</span>`
        : `<span style="background:#2563eb;color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:800;">👤 REGISTERED USER</span>`;

      var regionText = isPre
        ? "<span style='color:#94a3b8;'>Region: Unregistered</span>"
        : `<strong>${sos.district || "N/A"}, ${sos.state || "N/A"}</strong>`;

      // 📍 Plot GPS Coordinates on the Leaflet Map
      if (_sosMapInstance && sos.latitude && sos.longitude) {
        const lat = parseFloat(sos.latitude);
        const lng = parseFloat(sos.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const markerColor = isPending ? "#dc2626" : "#16a34a";
          const marker = L.circleMarker([lat, lng], {
            radius: 9,
            fillColor: markerColor,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85
          }).addTo(_sosMapInstance);

          marker.bindPopup(`
            <b>🚨 ${sos.userName || "Citizen"}</b><br>
            📱 ${sos.mobile || "—"}<br>
            📍 ${sos.district || ""}, ${sos.state || ""}<br>
            Status: <b>${sos.status || "Active"}</b>
          `);

          _sosMapMarkers.push(marker);
        }
      }

      return "<div style='background:" + bg + ";border:1px solid " + border + ";border-left:5px solid " + border + ";"
        + "border-radius:12px;padding:16px 18px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;'>"
        + "<div>"
        + "<div style='display:flex;align-items:center;gap:8px;margin-bottom:6px;'>"
        + "<strong style='font-size:15px;color:#1e293b;'>" + (sos.userName || "Unknown") + "</strong>"
        + badgeHtml
        + "<span style='background:" + border + ";color:white;font-size:11px;font-weight:700;padding:2px 10px;border-radius:12px;'>" + (sos.status || "Active") + "</span>"
        + "</div>"
        + "<div style='font-size:13px;color:#374151;margin-bottom:2px;'>📱 <strong>Mobile:</strong> " + (sos.mobile || "—") + "</div>"
        + "<div style='font-size:13px;color:#374151;margin-bottom:4px;'>📍 <strong>State & District:</strong> " + regionText + "</div>"
        + "<div style='font-size:12px;color:#64748b;margin-bottom:8px;'>⏰ " + timeStr + "</div>"
        + (sos.googleMapsLink ? "<a href='" + sos.googleMapsLink + "' target='_blank' style='font-size:13px;color:#2563eb;font-weight:700;text-decoration:none;'>📍 View Live GPS Location on Map →</a>" : "")
        + "</div>"
       + "<div style='display:flex; flex-direction:column; gap:8px; align-items:flex-end;'>"
      + (isPending
        ? "<button onclick=\"openQuickDispatchModal('" + (sos._id || sos.id) + "')\" style='background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;'>⚡ Quick Dispatch NGO</button>"
          + "<button onclick=\"resolveSOS('" + (sos._id || sos.id) + "')\" style='background:#16a34a;color:white;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;'>✅ Mark Resolved</button>"
        : "<span style='background:#dcfce7;color:#15803d;padding:4px 12px;border-radius:12px;font-weight:700;font-size:12px;'>✅ Resolved</span>")
      + "</div>"
      + "</div>";
    }).join("");

    container.innerHTML = newHTML;

    // Refresh map render view size
    if (_sosMapInstance) {
      setTimeout(() => { _sosMapInstance.invalidateSize(); }, 200);
    }
  } catch(e) {
    container.innerHTML = "<p style='color:#dc2626;padding:16px;text-align:center;'>❌ Failed to load SOS alerts.</p>";
  } finally {
    _isSosLoading = false;
    if (refreshBtn) { refreshBtn.style.opacity = "1"; refreshBtn.textContent = "🔄 Refresh"; }
  }
}

async function resolveSOS(id) {
  if (!confirm("Are you sure you want to mark this SOS as Resolved?")) return;

  try {
    const res = await fetch(`${BASE_API_URL}/admin/sos/${id}`, { 
      method: "PUT", 
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token 
      } 
    });

    const data = await res.json();
    if (res.ok) {
      showAdminToast("✅ SOS marked as Resolved!");
      loadSOS(); // Reload list
    } else {
      showAdminToast("❌ " + (data.message || "Failed to update SOS"), false);
    }
  } catch (e) { 
    console.error("Resolve SOS Error:", e);
    showAdminToast("❌ Server network error while updating SOS", false); 
  }
}

// 3. Export SOS Records to CSV
function exportSosToCsv() {
  if (!_allSosCache || !_allSosCache.length) {
    showAdminToast("⚠️ No SOS records available to export", false);
    return;
  }

  const data = _allSosCache.map(s => ({
    "User Name": `"${(s.userName || 'Citizen').replace(/"/g, '""')}"`,
    "Mobile": `"${s.mobile || ''}"`,
    "State": `"${s.state || ''}"`,
    "District": `"${s.district || ''}"`,
    "Latitude": s.latitude || "",
    "Longitude": s.longitude || "",
    "Status": s.status || "Active",
    "Pre-Login": s.isPreLogin ? "Yes" : "No",
    "Time": `"${new Date(s.time || s.createdAt).toLocaleString('en-IN')}"`
  }));

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(r => Object.values(r).join(",")).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `SOS_Records_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showAdminToast("✅ SOS CSV Export Downloaded!");
}





// ================= REAL INDIA LIVE ALERTS =================

const INDIA_BOUNDS = {
  minLat: 6,
  maxLat: 37,
  minLng: 68,
  maxLng: 97
};

async function loadLiveAlerts() {
  var container = document.getElementById("liveAlertsContainer");
  if (!container) return;
  container.innerHTML = "<p style='color:#94a3b8;text-align:center;padding:20px;'>⏳ Fetching live disaster data...</p>";

  var alertHTML  = "";
  var alertCount = 0;

  // ── 1. EARTHQUAKES (USGS last hour) ──
  try {
    var eqRes  = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson");
    var eqData = await eqRes.json();
    eqData.features.forEach(function(eq) {
      var coords = eq.geometry.coordinates;
      var lat = coords[1], lng = coords[0], mag = eq.properties.mag;
      if (lat>=6 && lat<=37 && lng>=68 && lng<=97) {
        alertCount++;
        var color = mag>=6 ? "#dc2626" : mag>=4 ? "#ea580c" : "#f59e0b";
        var label = mag>=6 ? "🔴 HIGH" : mag>=4 ? "🟠 MEDIUM" : "🟡 LOW";
        alertHTML += "<div class='alert-card' style='border-left:4px solid " + color + ";background:" + (mag>=6?"#fef2f2":mag>=4?"#fff7ed":"#fefce8") + ";'>"
          + "<div class='alert-header'><span class='alert-badge' style='background:" + color + ";'>🌍 EARTHQUAKE</span> <span class='alert-sev'>" + label + "</span></div>"
          + "<div class='alert-body'><strong>Location:</strong> " + eq.properties.place + "<br>"
          + "<strong>Magnitude:</strong> " + mag + "<br>"
          + "<strong>Time:</strong> " + new Date(eq.properties.time).toLocaleString("en-IN") + "</div></div>";
      }
    });
  } catch(e) { console.log("Earthquake API error"); }

  // ── 2. WEATHER — Wind, Rain, Temp for major cities ──
  var cities = [
    { name:"Delhi",       lat:28.6139, lng:77.2090 },
    { name:"Mumbai",      lat:19.0760, lng:72.8777 },
    { name:"Chennai",     lat:13.0827, lng:80.2707 },
    { name:"Kolkata",     lat:22.5726, lng:88.3639 },
    { name:"Bhubaneswar", lat:20.2961, lng:85.8245 },
    { name:"Hyderabad",   lat:17.3850, lng:78.4867 },
    { name:"Bengaluru",   lat:12.9716, lng:77.5946 }
  ];

  for (var i=0; i<cities.length; i++) {
    var city = cities[i];
    try {
      var wRes = await fetch(
  `https://alertify-backend-r8le.onrender.com/api/weather?lat=${city.lat}&lng=${city.lng}`
);
      var wData = await wRes.json();
      // OWM response format (backend now proxies OWM, not open-meteo)
      var wind  = wData.wind ? Math.round(wData.wind.speed * 3.6) : 0; // convert m/s → km/h
      var temp  = wData.main ? Math.round(wData.main.temp) : 0;
      var rain  = (wData.rain && wData.rain['1h']) ? wData.rain['1h'] : 0;

      if (wind > 70) {
        alertCount++;
        alertHTML += "<div class='alert-card' style='border-left:4px solid #7c3aed;background:#faf5ff;'>"
          + "<div class='alert-header'><span class='alert-badge' style='background:#7c3aed;'>🌀 CYCLONE RISK</span> <span class='alert-sev'>🔴 HIGH</span></div>"
          + "<div class='alert-body'><strong>City:</strong> " + city.name + "<br><strong>Wind Speed:</strong> " + wind + " km/h</div></div>";
      } else if (wind > 45) {
        alertCount++;
        alertHTML += "<div class='alert-card' style='border-left:4px solid #ea580c;background:#fff7ed;'>"
          + "<div class='alert-header'><span class='alert-badge' style='background:#ea580c;'>💨 STORM ALERT</span> <span class='alert-sev'>🟠 MEDIUM</span></div>"
          + "<div class='alert-body'><strong>City:</strong> " + city.name + "<br><strong>Wind:</strong> " + wind + " km/h</div></div>";
      }

      if (rain > 20) {
        alertCount++;
        alertHTML += "<div class='alert-card' style='border-left:4px solid #1d4ed8;background:#eff6ff;'>"
          + "<div class='alert-header'><span class='alert-badge' style='background:#1d4ed8;'>🌊 FLOOD RISK</span> <span class='alert-sev'>🟠 MEDIUM</span></div>"
          + "<div class='alert-body'><strong>City:</strong> " + city.name + "<br><strong>Rainfall:</strong> " + rain + " mm/hr</div></div>";
      }

      if (temp > 43) {
        alertCount++;
        alertHTML += "<div class='alert-card' style='border-left:4px solid #dc2626;background:#fef2f2;'>"
          + "<div class='alert-header'><span class='alert-badge' style='background:#dc2626;'>🔥 HEATWAVE</span> <span class='alert-sev'>🔴 HIGH</span></div>"
          + "<div class='alert-body'><strong>City:</strong> " + city.name + "<br><strong>Temperature:</strong> " + temp + "°C</div></div>";
      } else if (temp > 38) {
        alertCount++;
        alertHTML += "<div class='alert-card' style='border-left:4px solid #f59e0b;background:#fefce8;'>"
          + "<div class='alert-header'><span class='alert-badge' style='background:#f59e0b;'>☀️ HEAT WARNING</span> <span class='alert-sev'>🟡 LOW</span></div>"
          + "<div class='alert-body'><strong>City:</strong> " + city.name + "<br><strong>Temperature:</strong> " + temp + "°C</div></div>";
      }

    } catch(e) { console.log("Weather error for " + city.name); }
  }

  if (alertCount === 0) {
    alertHTML = "<div class='alert-card' style='border-left:4px solid #16a34a;background:#f0fdf4;'>"
      + "<div class='alert-header'><span class='alert-badge' style='background:#16a34a;'>✅ ALL CLEAR</span></div>"
      + "<div class='alert-body'>No major disaster activity detected across India at this time.</div></div>";
  } else {
    alertHTML = "<div style='margin-bottom:12px;font-size:13px;color:#64748b;'>🔔 <strong>" + alertCount + " active alert" + (alertCount>1?"s":"") + "</strong> detected across India</div>" + alertHTML;
  }

  container.innerHTML = "<div class='alert-list'>" + alertHTML + "</div>";
}



setInterval(() => {
  var sec = document.getElementById("complaints-section");
if (sec && !sec.classList.contains("hidden")) {
    loadComplaints();
  }
}, 5000);
setInterval(() => {
  var sec = document.getElementById("ngo-section");
if (sec && !sec.classList.contains("hidden")) {
    loadNgos();
    loadOrders();
  }
}, 7000);
setInterval(() => {
var sec = document.getElementById("sos-section");
if (sec && !sec.classList.contains("hidden")) {
    loadSOS();
  }
}, 5000);
setInterval(() => {
  var sec = document.getElementById("alerts-section");
if (sec && !sec.classList.contains("hidden")) {
    loadLiveAlerts();
  }
}, 60000); // every 1 minute
let modalType = "";
let modalIndex = null;
let selectedNgoId = null;
let tempLocation = "";

// Open modal
function openModal(title, type, index = null, ngoId = null) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalInput").value = "";
  document.getElementById("inputModal").classList.remove("hidden");

  modalType = type;
  modalIndex = index;
  selectedNgoId = ngoId;
}

// Close modal
function closeModal() {
  document.getElementById("inputModal").classList.add("hidden");
}

// Submit modal
// Submit modal with proper toast for each action
async function submitModal() {
  const value = document.getElementById("modalInput").value.trim();
  if (!value) {
    showAdminToast("⚠️ Please enter a note / reason", false);
    return;
  }

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  // 1. If updating Complaint
  if (modalType === "complaint") {
    try {
      const res = await fetch(`${baseUrl}/admin/complaint/${selectedComplaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          status: selectedStatus,
          adminReply: value
        })
      });

      if (res.ok) {
        showAdminToast(`✅ Complaint marked as ${selectedStatus}!`, true);
        loadComplaints();
      } else {
        showAdminToast("❌ Failed to update complaint", false);
      }
    } catch(e) {
      showAdminToast("❌ Server error while updating complaint", false);
    }
    closeModal();
    return;
  }

  // 2. If entering Help Order Location
  if (modalType === "location") {
    tempLocation = value;
    openModal("Enter Help Note:", "note", null, selectedNgoId);
    return;
  }

  // 3. If submitting Help Order Note
  if (modalType === "note") {
    try {
      const res = await fetch(`${baseUrl}/admin/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          location: tempLocation,
          note: value,
          assignedNgo: selectedNgoId
        })
      });

      const data = await res.json();
      if (res.ok) {
        showAdminToast("✅ Help Order Sent to NGO Successfully!", true);
        loadOrders();
      } else {
        showAdminToast("❌ " + (data.message || "Failed to create order"), false);
      }
    } catch (e) {
      showAdminToast("❌ Server error while dispatching help order", false);
    }
    closeModal();
    return;
  }

  closeModal();
}

 
function sendHelp(ngoId) {

  selectedNgoId = ngoId;

  openModal("Enter Location:", "location", null, ngoId);

}
// ================= LOAD STATES (Using Gov REST API) =================
async function loadStates() {
  const stateSelect = document.getElementById("stateSelect");
  if (!stateSelect) return;

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const response = await fetch(`${baseUrl}/states`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const states = await response.json();

    stateSelect.innerHTML = '<option value="">🗺️ Select State</option>';
    states.forEach(st => {
      // Store state ID in data-id for direct API district lookups
      stateSelect.innerHTML += `<option value="${st.name}" data-id="${st.id}">${st.name}</option>`;
    });
  } catch (err) {
    console.error("Failed to load states from API:", err);
  }
}

// ================= LOAD DISTRICTS (Using Gov REST API) =================
var stateSelect = document.getElementById("stateSelect");
if (stateSelect) {
  stateSelect.addEventListener("change", async function () {
    const districtSelect = document.getElementById("districtSelect");
    if (!districtSelect) return;

    districtSelect.innerHTML = '<option value="">⏳ Loading districts...</option>';

    if (!this.value) {
      districtSelect.innerHTML = '<option value="">📍 Select District</option>';
      return;
    }

    const selectedOption = this.options[this.selectedIndex];
    const stateId = selectedOption.getAttribute("data-id") || "";

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

    try {
      const response = await fetch(`${baseUrl}/districts?state=${encodeURIComponent(this.value)}&stateId=${stateId}`, {
        headers: { "Authorization": "Bearer " + token }
      });
      const districts = await response.json();

      districtSelect.innerHTML = '<option value="">📍 Select District</option>';
      if (Array.isArray(districts) && districts.length > 0) {
        districts.forEach(d => {
          const districtName = d.name || d;
          districtSelect.innerHTML += `<option value="${districtName}">${districtName}</option>`;
        });
      } else {
        districtSelect.innerHTML = '<option value="">No districts found</option>';
      }
    } catch (err) {
      console.error("Failed to load districts from API:", err);
      districtSelect.innerHTML = '<option value="">📍 Select District</option>';
    }
  });
}
async function filterNgos() {

  const state = document.getElementById("stateSelect").value;
  const district = document.getElementById("districtSelect").value;

  const response = await fetch(
  `https://alertify-backend-r8le.onrender.com/api/admin/filter-ngos?state=${state}&district=${district}`,
    {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );

  const ngos = await response.json();

  displayNgos(ngos);
}

// ============================================================
// DAMAGE REPORTS — Admin View
// ============================================================

// ============================================================
// DAMAGE REPORTS — Admin View
// ============================================================

async function loadDamageReports() {
  var list = document.getElementById("damageReportsList");
  if (!list) return;

  try {
    var res  = await fetch(`${BASE_API_URL}/admin/damage-reports`, { 
      headers: { Authorization: "Bearer " + token } 
    });
    var data = await res.json();
    _allDamageCache = Array.isArray(data) ? data : [];
    // 📊 Update Open Damage Reports Counter
const openReportsCount = Array.isArray(data) ? data.filter(r => r.status === "Under Progress" || r.status === "Submitted").length : 0;
const dmgKpi = document.getElementById("kpiReportsNum");
if (dmgKpi) dmgKpi.textContent = openReportsCount;


    if (!data.length) {
      list.innerHTML = "<p style='color:#94a3b8;text-align:center;padding:20px;'>No damage reports yet.</p>";
      return;
    }

    var sc = { "Under Progress": "#f59e0b", "Resolved": "#16a34a", "Rejected": "#dc2626" };
    var si = { "Under Progress": "⏳", "Resolved": "✅", "Rejected": "❌" };

    let html = data.map(function(r) {
      var currentStatus = r.status || "Under Progress";
      var col           = sc[currentStatus] || "#f59e0b";
      var icon          = si[currentStatus] || "⏳";
      var dateStr       = new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

      var photoHtml = r.photo
        ? `<div style="margin-top:12px;">
             <div class="img-box">
               <img src="${SERVER_URL}/uploads/${r.photo}" 
                    class="admin-img dmg-img-click" 
                    data-src="${SERVER_URL}/uploads/${r.photo}"
                    onerror="this.style.display='none'">
               <div class="zoom-icon">🔍</div>
             </div>
           </div>`
        : "";

      var noteHtml = r.adminNote
        ? `<div style="margin-top:10px;background:#f8fafc;border-left:3px solid ${col};border-radius:8px;padding:10px 14px;font-size:13px;color:#334155;">
             <strong>Admin Note:</strong> ${r.adminNote}
           </div>`
        : "";

      // Only show Resolve & Reject buttons if Under Progress (or Submitted)
      var btnHtml = (currentStatus === "Under Progress" || currentStatus === "Submitted")
        ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
             <button data-rid="${r._id}" data-rstatus="Resolved" class="dmg-action-btn" style="flex:1;min-width:100px;padding:9px 14px;background:#16a34a;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">✅ Resolve</button>
             <button data-rid="${r._id}" data-rstatus="Rejected" class="dmg-action-btn" style="flex:1;min-width:100px;padding:9px 14px;background:#dc2626;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">❌ Reject</button>
           </div>`
        : `<div style="margin-top:12px;font-size:13px;font-weight:700;color:${col};">Decision: ${currentStatus}</div>`;

      return `
        <div style="background:white;border-radius:14px;padding:18px 20px;border:1.5px solid #e2e8f0;border-top:4px solid ${col};box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div style="font-size:13px;font-weight:800;color:#1e293b;">📋 ${r.reportId}</div>
            <span style="background:${col};color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;">${icon} ${currentStatus}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;font-size:13px;margin-bottom:4px;">
            <div><span style="color:#94a3b8;">Name:</span> <strong>${r.name || "—"}</strong></div>
            <div><span style="color:#94a3b8;">Mobile:</span> <strong>${r.mobile || "—"}</strong></div>
            <div><span style="color:#94a3b8;">Disaster:</span> <strong style="text-transform:capitalize;">${r.disasterType || "—"}</strong></div>
            <div><span style="color:#94a3b8;">Date:</span> <strong>${dateStr}</strong></div>
            <div style="grid-column:1/-1;"><span style="color:#94a3b8;">Address:</span> <strong>${r.address || "—"}</strong></div>
            <div style="grid-column:1/-1;"><span style="color:#94a3b8;">Description:</span> ${r.description || "—"}</div>
          </div>
          ${photoHtml}
          ${noteHtml}
          ${btnHtml}
        </div>
      `;
    }).join("");

    if (list.innerHTML !== html) {
      list.innerHTML = html;
    }
  } catch(e) {
    list.innerHTML = "<p style='color:#dc2626;text-align:center;padding:20px;'>❌ Failed to load reports.</p>";
  }
}

// Event delegation — image click to enlarge
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("dmg-img-click")) {
    var src = e.target.getAttribute("data-src");
    if (src) openImgModal(src);
  }
});

// Event delegation for damage report action buttons
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("dmg-action-btn")) {
    var id     = e.target.getAttribute("data-rid");
    var status = e.target.getAttribute("data-rstatus");
    if (id && status) updateDamageReport(id, status);
  }
});

// Image modal — full screen click to view
function openImgModal(src) {
  var existing = document.getElementById("imgModal");
  if (existing) existing.remove();
  var modal = document.createElement("div");
  modal.id = "imgModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:999999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;";
  modal.onclick = function(){ modal.remove(); };
  var img = document.createElement("img");
  img.src = src;
  img.style.cssText = "max-width:95vw;max-height:92vh;object-fit:contain;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.6);";
  modal.appendChild(img);
  document.body.appendChild(modal);
}


// Admin note modal — replaces prompt()
var _dmgUpdateId     = null;
var _dmgUpdateStatus = null;

function updateDamageReport(id, status) {
  _dmgUpdateId     = id;
  _dmgUpdateStatus = status;

  var modal    = document.getElementById("adminNoteModal");
  var titleEl  = document.getElementById("adminNoteTitle");
  var confirmBtn = document.getElementById("adminNoteConfirm");
  if (!modal) return;

  var titles = { Resolved:"✅ Resolve Report", Rejected:"❌ Reject Report", Reviewed:"🔍 Mark as Reviewed" };
  var colors = { Resolved:"#16a34a", Rejected:"#dc2626", Reviewed:"#f59e0b" };
  if (titleEl)   titleEl.textContent      = titles[status] || "Update Report";
  if (confirmBtn) {
    confirmBtn.style.background = colors[status] || "#1565c0";
    confirmBtn.onclick = submitAdminNote;
  }

  document.getElementById("adminNoteInput").value = "";
  modal.style.display = "flex";
}

async function submitAdminNote() {
  var note = document.getElementById("adminNoteInput").value.trim();
  if (!note && _dmgUpdateStatus !== "Reviewed") {
    alert("Please write a note for the citizen.");
    return;
  }
  try {
   await fetch("https://alertify-backend-r8le.onrender.com/api/admin/damage-report/" + _dmgUpdateId, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ status: _dmgUpdateStatus, adminNote: note })
    });
    closeAdminNoteModal();
    loadDamageReports();
  } catch(e) { alert("Network error. Try again."); }
}

function closeAdminNoteModal() {
  var modal = document.getElementById("adminNoteModal");
  if (modal) modal.style.display = "none";
  _dmgUpdateId = null; _dmgUpdateStatus = null;
}

setInterval(() => {
  var sec = document.getElementById("damage-section");
  if (sec && !sec.classList.contains("hidden")) {
    loadDamageReports();
  }
}, 10000);
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("zoom-icon")) {
    const img = e.target.parentElement.querySelector("img");
    if (img) openImgModal(img.src);
  }
});





// ── TAB SWITCHER LOGIC ──
function switchAdminTab(sectionId, btnElement) {
  const sections = [
    "sos-section",
    "complaints-section",
    "ngo-section",
    "damage-section",
    "alerts-section"
  ];

  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (sec) {
      if (id === sectionId) {
        sec.classList.remove("hidden");
        if (id === "alerts-section") loadLiveAlerts();
        if (id === "damage-section") loadDamageReports();
        if (id === "sos-section" && _sosMapInstance) {
          setTimeout(() => { _sosMapInstance.invalidateSize(); }, 200);
        }
      } else {
        sec.classList.add("hidden");
      }
    }
  });

  // Update active button state
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  } else {
    // Find corresponding button if clicked from KPI card
    const targetBtn = document.querySelector(`.nav-item[onclick*="${sectionId}"]`);
    if (targetBtn) targetBtn.classList.add("active");
  }

  const titleMap = {
    "sos-section": "🚨 Emergency Alert Management",
    "complaints-section": "📋 Complaint Management",
    "ngo-section": "🤝 NGO & Volunteer Hub",
    "damage-section": "🏚️ Damage Assessment Reports",
    "alerts-section": "🗺️ Live Disaster Monitoring"
  };
  const heading = document.getElementById("pageTitleHeading");
  if (heading) heading.textContent = titleMap[sectionId] || "Admin Dashboard";
}


// ================= UNIFIED 3-LAYER LEAFLET DISASTER MAP =================
var _unifiedMap = null;
var _unifiedMarkersLayer = null;

const REGION_COORDINATES = {
  // Odisha Districts
  "bhubaneswar": [20.2961, 85.8245],
  "khordha": [20.1815, 85.6163],
  "cuttack": [20.4625, 85.8828],
  "puri": [19.8135, 85.8312],
  "balasore": [21.4934, 86.9135],
  "bhadrak": [21.0543, 86.4955],
  "mayurbhanj": [21.9287, 86.7416],
  "sambalpur": [21.4669, 83.9812],
  "ganjam": [19.3800, 85.0500],
  "berhampur": [19.3150, 84.7941],
  "jajpur": [20.8398, 86.3374],
  "kendrapara": [20.5019, 86.4222],
  "jagatsinghpur": [20.2677, 86.1706],
  "angul": [20.8394, 85.1013],
  "dhenkanal": [20.6586, 85.5976],
  "sundargarh": [22.1197, 84.0378],
  "rourkela": [22.2604, 84.8536],
  "odisha": [20.9517, 85.0985],

  // Other Major Regions
  "delhi": [28.6139, 77.2090],
  "mumbai": [19.0760, 72.8777],
  "maharashtra": [19.7515, 75.7139],
  "kolkata": [22.5726, 88.3639],
  "west bengal": [22.9868, 87.8550],
  "chennai": [13.0827, 80.2707],
  "tamil nadu": [11.1271, 78.6569],
  "bengaluru": [12.9716, 77.5946],
  "karnataka": [15.3173, 75.7139],
  "hyderabad": [17.3850, 78.4867],
  "telangana": [18.1124, 79.0193],
  "andhra pradesh": [15.9129, 79.7400],
  "patna": [25.5941, 85.1376],
  "bihar": [25.0961, 85.3131],
  "lucknow": [26.8467, 80.9462],
  "uttar pradesh": [26.8467, 80.9462],
  "ranchi": [23.3441, 85.3096],
  "jamshedpur": [22.8046, 86.2029],
  "jharkhand": [23.6102, 85.2799]
};

function getCoordsForPlace(name) {
  if (!name) return null;
  const clean = name.trim().toLowerCase();
  
  for (const [key, coords] of Object.entries(REGION_COORDINATES)) {
    if (clean.includes(key)) {
      // Add slight random offset so multiple pins in the same city don't completely hide each other
      const jitterLat = coords[0] + (Math.random() - 0.5) * 0.04;
      const jitterLng = coords[1] + (Math.random() - 0.5) * 0.04;
      return [jitterLat, jitterLng];
    }
  }

  // Fallback to center of Odisha / India if district name is unknown
  return [20.9517 + (Math.random() - 0.5) * 0.1, 85.0985 + (Math.random() - 0.5) * 0.1];
}

function initUnifiedMap() {
  const mapEl = document.getElementById("unifiedDisasterMap");
  if (!mapEl || _unifiedMap) return;

  _unifiedMap = L.map("unifiedDisasterMap").setView([20.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(_unifiedMap);

  // 🎯 Use Leaflet.markerClusterGroup instead of standard layerGroup
  if (typeof L.markerClusterGroup === "function") {
    _unifiedMarkersLayer = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 45
    });
  } else {
    _unifiedMarkersLayer = L.layerGroup();
  }
  _unifiedMap.addLayer(_unifiedMarkersLayer);
}




async function loadUnifiedDisasterMap() {
  initUnifiedMap();
  if (!_unifiedMap) return;

  _unifiedMarkersLayer.clearLayers();

  try {
    const [sosRes, ngoRes, dmgRes] = await Promise.all([
      fetch(`${BASE_API_URL}/admin/sos`, { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).catch(() => []),
      fetch(`${BASE_API_URL}/admin/ngos`, { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).catch(() => []),
      fetch(`${BASE_API_URL}/admin/damage-reports`, { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).catch(() => [])
    ]);

    // 🔴 LAYER 1: SOS Incidents (Red)
    if (Array.isArray(sosRes)) {
      sosRes.forEach(sos => {
        let lat = parseFloat(sos.latitude);
        let lng = parseFloat(sos.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          const fallback = getCoordsForPlace(sos.district || sos.state);
          if (fallback) [lat, lng] = fallback;
        }

        if (!isNaN(lat) && !isNaN(lng)) {
          const isPending = sos.status === "Pending" || sos.status === "Active";
          const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: isPending ? "#dc2626" : "#991b1b",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          });

          marker.bindPopup(`
            <strong style="color:#dc2626;">🚨 SOS Incident</strong><br>
            <b>User:</b> ${sos.userName || "Citizen"}<br>
            <b>Phone:</b> ${sos.mobile || "—"}<br>
            <b>Status:</b> ${sos.status || "Active"}<br>
            <b>Location:</b> ${sos.district || ""}, ${sos.state || ""}
          `);
          _unifiedMarkersLayer.addLayer(marker);
        }
      });
    }

    // 🟡 LAYER 2: Damage Reports (Yellow/Amber)
    if (Array.isArray(dmgRes)) {
      dmgRes.forEach(dmg => {
        const coords = getCoordsForPlace(dmg.address || dmg.district || dmg.state);
        if (coords) {
          const marker = L.circleMarker(coords, {
            radius: 7,
            fillColor: "#f59e0b",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85
          });

          marker.bindPopup(`
            <strong style="color:#d97706;">🟡 Damage Report (${dmg.reportId || "RPT"})</strong><br>
            <b>Disaster:</b> ${dmg.disasterType || "Damage"}<br>
            <b>Reporter:</b> ${dmg.name || "Citizen"}<br>
            <b>Status:</b> ${dmg.status || "Under Progress"}<br>
            <b>Address:</b> ${dmg.address || "—"}
          `);
          _unifiedMarkersLayer.addLayer(marker);
        }
      });
    }

   // 🔵 LAYER 3: Registered NGOs (Blue)
    if (Array.isArray(ngoRes)) {
      ngoRes.forEach(ngo => {
        // Allow Approved or default active NGOs
        if (ngo.status && ngo.status.toLowerCase() !== "approved") return;

        let coords = null;
        if (ngo.latitude && ngo.longitude) {
          coords = [parseFloat(ngo.latitude), parseFloat(ngo.longitude)];
        } else {
          coords = getCoordsForPlace(ngo.district || ngo.state || ngo.address);
        }

        if (coords) {
          const marker = L.circleMarker(coords, {
            radius: 8,
            fillColor: "#2563eb",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          });

          marker.bindPopup(`
            <strong style="color:#2563eb;">🔵 Approved NGO Partner</strong><br>
            <b>Name:</b> ${ngo.ngoName || "NGO"}<br>
            <b>Type:</b> ${ngo.ngoType || "Relief Hub"}<br>
            <b>Head:</b> ${ngo.headName || "—"}<br>
            <b>Region:</b> ${ngo.district || ""}, ${ngo.state || ""}
          `);
          _unifiedMarkersLayer.addLayer(marker);
        }
      });
    }

    // 🎯 Auto-fit camera view to enclose all active incident clusters
    setTimeout(() => {
      if (_unifiedMap) {
        _unifiedMap.invalidateSize();
        if (_unifiedMarkersLayer && _unifiedMarkersLayer.getBounds && _unifiedMarkersLayer.getLayers().length > 0) {
          const bounds = _unifiedMarkersLayer.getBounds();
          if (bounds.isValid()) {
            _unifiedMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
          }
        }
      }
    }, 300);

  } catch (error) {
    console.error("Error loading unified disaster map:", error);
  }
}



// ================= CSV EXPORT: COMPLAINTS =================
function exportComplaintsToCsv() {
  if (!_allComplaintsCache || !_allComplaintsCache.length) {
    showAdminToast("⚠️ No complaints data available to export", false);
    return;
  }

  const data = _allComplaintsCache.map(c => ({
    "Complaint ID": `"${c.id || c._id || ''}"`,
    "Description": `"${(c.text || c.description || '').replace(/"/g, '""')}"`,
    "Status": `"${c.status || 'Under Progress'}"`,
    "Date": `"${c.date || c.createdAt || ''}"`
  }));

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(r => Object.values(r).join(",")).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Complaints_Records_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showAdminToast("✅ Complaints CSV Downloaded!");
}

// ================= CSV EXPORT: DAMAGE REPORTS =================
function exportDamageToCsv() {
  if (!_allDamageCache || !_allDamageCache.length) {
    showAdminToast("⚠️ No damage reports available to export", false);
    return;
  }

  const data = _allDamageCache.map(r => ({
    "Report ID": `"${r.reportId || r._id || ''}"`,
    "Citizen Name": `"${(r.name || 'Citizen').replace(/"/g, '""')}"`,
    "Mobile": `"${r.mobile || ''}"`,
    "Disaster Type": `"${r.disasterType || 'Other'}"`,
    "Address": `"${(r.address || '').replace(/"/g, '""')}"`,
    "Description": `"${(r.description || '').replace(/"/g, '""')}"`,
    "Status": `"${r.status || 'Under Progress'}"`,
    "Date Filed": `"${new Date(r.createdAt).toLocaleString('en-IN')}"`
  }));

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(r => Object.values(r).join(",")).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Damage_Reports_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showAdminToast("✅ Damage Assessment CSV Downloaded!");
}



// ================= BROADCASTS MANAGEMENT =================
async function loadBroadcasts() {
  const container = document.getElementById("broadcastList");
  if (!container) return;

  try {
    const res = await fetch(`${BASE_API_URL}/broadcasts`);
    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = "<p style='color:#94a3b8; text-align:center;'>No active broadcasts.</p>";
      return;
    }

    container.innerHTML = data.map(b => `
      <div style="background:white; border-left:5px solid ${b.severity === 'Critical' ? '#dc2626' : '#ea580c'}; padding:16px; border-radius:10px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; font-size:15px; color:#1e293b; margin-bottom:4px;">${b.title} <span style="background:#fee2e2; color:#dc2626; font-size:11px; padding:2px 8px; border-radius:10px;">${b.severity}</span></div>
          <div style="font-size:13px; color:#475569; margin-bottom:4px;">${b.message}</div>
          <div style="font-size:12px; color:#94a3b8;">📍 Region: ${b.targetDistrict}, ${b.targetState} | ⏰ ${new Date(b.createdAt).toLocaleString('en-IN')}</div>
        </div>
        <button onclick="deleteBroadcast('${b._id}')" style="background:#fee2e2; color:#dc2626; border:none; padding:6px 12px; border-radius:6px; font-weight:700; cursor:pointer;">Delete</button>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = "<p style='color:#dc2626;'>Failed to load broadcasts.</p>";
  }
}

async function publishBroadcast() {
  const title = document.getElementById("broadcastTitle").value.trim();
  const message = document.getElementById("broadcastMsg").value.trim();
  const severity = document.getElementById("broadcastSeverity").value;
  const targetState = document.getElementById("broadcastState").value.trim() || "All";
  const targetDistrict = document.getElementById("broadcastDistrict").value.trim() || "All";

  if (!title || !message) {
    showAdminToast("⚠️ Title and message required", false);
    return;
  }

  try {
    const res = await fetch(`${BASE_API_URL}/admin/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ title, message, severity, targetState, targetDistrict })
    });
    if (res.ok) {
      showAdminToast("✅ Broadcast Alert Published!");
      document.getElementById("broadcastTitle").value = "";
      document.getElementById("broadcastMsg").value = "";
      loadBroadcasts();
    }
  } catch (e) {
    showAdminToast("❌ Error publishing broadcast", false);
  }
}

async function deleteBroadcast(id) {
  if (!confirm("Delete this broadcast alert?")) return;
  try {
    await fetch(`${BASE_API_URL}/admin/broadcast/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    showAdminToast("✅ Broadcast removed.");
    loadBroadcasts();
  } catch (e) {}
}

// ================= SHELTER MANAGEMENT =================
async function loadShelters() {
  const tbody = document.querySelector("#shelterTable tbody");
  if (!tbody) return;

  try {
    const res = await fetch(`${BASE_API_URL}/shelters`);
    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      tbody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No shelters registered yet.</td></tr>";
      return;
    }

    tbody.innerHTML = data.map(s => `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 14px; font-weight:600;">${s.name}</td>
        <td style="padding:10px 14px;">${s.district}, ${s.state}</td>
        <td style="padding:10px 14px;">${s.capacity}</td>
        <td style="padding:10px 14px;">
          <input type="number" value="${s.currentOccupancy || 0}" onchange="updateShelterOccupancy('${s._id}', this.value)" style="width:70px; padding:4px 8px; border-radius:6px; border:1px solid #cbd5e1;">
        </td>
        <td style="padding:10px 14px;"><span style="background:${s.status === 'Full' ? '#fee2e2' : '#dcfce7'}; color:${s.status === 'Full' ? '#dc2626' : '#16a34a'}; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:700;">${s.status}</span></td>
        <td style="padding:10px 14px;">${s.contactPhone || '—'}</td>
        <td style="padding:10px 14px;">
          <button onclick="deleteShelter('${s._id}')" style="background:#dc2626; color:white; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (e) {}
}

async function registerShelter() {
  const name = document.getElementById("shelterName").value.trim();
  const address = document.getElementById("shelterAddress").value.trim();
  const state = document.getElementById("shelterState").value.trim();
  const district = document.getElementById("shelterDistrict").value.trim();
  const capacity = document.getElementById("shelterCapacity").value;
  const contactPhone = document.getElementById("shelterPhone").value.trim();

  if (!name || !address || !state || !district || !capacity) {
    showAdminToast("⚠️ Please fill in all required shelter fields", false);
    return;
  }

  try {
    const res = await fetch(`${BASE_API_URL}/admin/shelter`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ name, address, state, district, capacity, contactPhone })
    });
    if (res.ok) {
      showAdminToast("✅ Relief Shelter Registered!");
      loadShelters();
    }
  } catch (e) {}
}

async function updateShelterOccupancy(id, currentOccupancy) {
  try {
    await fetch(`${BASE_API_URL}/admin/shelter/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ currentOccupancy })
    });
    showAdminToast("✅ Occupancy Updated");
    loadShelters();
  } catch (e) {}
}

async function deleteShelter(id) {
  if (!confirm("Delete this shelter?")) return;
  try {
    await fetch(`${BASE_API_URL}/admin/shelter/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    showAdminToast("✅ Shelter Removed");
    loadShelters();
  } catch (e) {}
}



// ============================================================
// ⚡ QUICK NGO DISPATCH ENGINE (P1)
// ============================================================

let _activeDispatchSos = null;

async function openQuickDispatchModal(sosId) {
  const sos = _allSosCache.find(s => (s._id || s.id) === sosId);
  if (!sos) {
    showAdminToast("⚠️ SOS record not found", false);
    return;
  }

  _activeDispatchSos = sos;
  const modal = document.getElementById("quickDispatchModal");
  if (!modal) return;

  // 1. Populate SOS summary in modal
  const infoBox = document.getElementById("dispatchSosInfo");
  const locStr = (sos.district || "") + (sos.state ? (sos.district ? ", " : "") + sos.state : "");
  infoBox.innerHTML = `
    <strong>🚨 Target Victim:</strong> ${sos.userName || "Citizen"} (${sos.mobile || "No Mobile"})<br>
    <strong>📍 Location:</strong> ${locStr || "GPS Coords Provided"} ${sos.googleMapsLink ? `— <a href="${sos.googleMapsLink}" target="_blank" style="color:#2563eb;font-weight:700;">View Map ↗</a>` : ''}
  `;

  // 2. Pre-fill location & suggested note
  const locInput = document.getElementById("dispatchLocation");
  if (locInput) locInput.value = locStr || (sos.latitude ? `${sos.latitude}, ${sos.longitude}` : "Emergency Zone");

  const noteInput = document.getElementById("dispatchNote");
  if (noteInput) {
    noteInput.value = `EMERGENCY RESCUE: Immediate dispatch required for ${sos.userName || 'Citizen'} (Phone: ${sos.mobile || 'N/A'}). ${sos.googleMapsLink ? 'GPS: ' + sos.googleMapsLink : ''}`;
  }

  // 3. Load and prioritize approved NGOs
  const select = document.getElementById("dispatchNgoSelect");
  select.innerHTML = '<option value="">⏳ Fetching available NGOs...</option>';

  modal.style.display = "flex";

  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const currentBase = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

    const res = await fetch(`${currentBase}/admin/ngos`, {
      headers: { Authorization: "Bearer " + token }
    });
    const ngos = await res.json();
    const approved = Array.isArray(ngos) ? ngos.filter(n => n.status === "Approved") : [];

    if (!approved.length) {
      select.innerHTML = '<option value="">⚠️ No approved NGOs found. Approve an NGO first.</option>';
      return;
    }

    // Sort by matching district first
    approved.sort((a, b) => {
      const matchA = sos.district && a.district && a.district.toLowerCase() === sos.district.toLowerCase() ? 1 : 0;
      const matchB = sos.district && b.district && b.district.toLowerCase() === sos.district.toLowerCase() ? 1 : 0;
      return matchB - matchA;
    });

    select.innerHTML = '<option value="">-- Choose NGO Team --</option>' + approved.map(n => {
      const isNearby = sos.district && n.district && n.district.toLowerCase() === sos.district.toLowerCase();
      const prefix = isNearby ? "🟢 [LOCAL TEAM] " : "🔵 ";
      return `<option value="${n.ngoId || n._id}">${prefix}${n.ngoName} (${n.district || n.state || 'India'} - ${n.ngoType || 'Relief'})</option>`;
    }).join("");

    // Auto-select top match if available
    if (approved.length === 1 || (sos.district && approved[0].district && approved[0].district.toLowerCase() === sos.district.toLowerCase())) {
      select.selectedIndex = 1;
    }

  } catch (err) {
    select.innerHTML = '<option value="">❌ Failed to load NGOs</option>';
  }
}

function closeQuickDispatchModal() {
  const modal = document.getElementById("quickDispatchModal");
  if (modal) modal.style.display = "none";
  _activeDispatchSos = null;
}

async function confirmQuickDispatch() {
  const select = document.getElementById("dispatchNgoSelect");
  const ngoId = select ? select.value : "";
  const location = document.getElementById("dispatchLocation").value.trim();
  const note = document.getElementById("dispatchNote").value.trim();

  if (!ngoId) {
    showAdminToast("⚠️ Please select an NGO team to assign", false);
    return;
  }
  if (!note) {
    showAdminToast("⚠️ Please enter a rescue instruction note", false);
    return;
  }

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const currentBase = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const res = await fetch(`${currentBase}/admin/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        assignedNgo: ngoId,
        location: location || "Disaster Zone",
        note: note
      })
    });

    const data = await res.json();
    if (res.ok) {
      showAdminToast("🚀 Rescue Task Force Dispatched to NGO Successfully!", true);
      closeQuickDispatchModal();
      loadOrders();
    } else {
      showAdminToast("❌ " + (data.message || "Failed to dispatch order"), false);
    }
  } catch (err) {
    showAdminToast("❌ Server network error while dispatching", false);
  }
}




// ============================================================
// 📊 P4: CHART.JS DISASTER ANALYTICS ENGINE
// ============================================================

let _statusChartInstance = null;
let _typeChartInstance = null;

async function renderAdminAnalyticsCharts() {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const [sosRes, compRes, dmgRes] = await Promise.all([
      fetch(`${baseUrl}/admin/sos`, { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}/admin/complaints`, { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}/admin/damage-reports`, { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).catch(() => [])
    ]);

    const sosList = Array.isArray(sosRes) ? sosRes : [];
    const compList = Array.isArray(compRes) ? compRes : [];
    const dmgList = Array.isArray(dmgRes) ? dmgRes : [];

    // ── Metric 1: Status Counts ──
    const activeSos = sosList.filter(s => s.status === "Pending" || s.status === "Active").length;
    const resolvedSos = sosList.filter(s => s.status === "Resolved").length;
    const pendingComp = compList.filter(c => c.status === "Under Progress" || c.status === "Submitted").length;
    const resolvedComp = compList.filter(c => c.status === "Resolved").length;

    // ── Metric 2: Disaster Types ──
    const typeCounts = {
      flood: 0,
      cyclone: 0,
      earthquake: 0,
      fire: 0,
      landslide: 0,
      other: 0
    };

    dmgList.forEach(d => {
      const t = (d.disasterType || "other").toLowerCase();
      if (typeCounts[t] !== undefined) typeCounts[t]++;
      else typeCounts.other++;
    });

    // ── Render Chart 1: Status Breakdown (Bar) ──
    const ctx1 = document.getElementById("incidentStatusChart")?.getContext("2d");
    if (ctx1) {
      if (_statusChartInstance) _statusChartInstance.destroy();
      _statusChartInstance = new Chart(ctx1, {
        type: "bar",
        data: {
          labels: ["Active SOS", "Resolved SOS", "Pending Complaints", "Resolved Complaints"],
          datasets: [{
            label: "Total Count",
            data: [activeSos, resolvedSos, pendingComp, resolvedComp],
            backgroundColor: ["#dc2626", "#16a34a", "#f59e0b", "#2563eb"],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });
    }

    // ── Render Chart 2: Disaster Type Breakdown (Doughnut) ──
    const ctx2 = document.getElementById("disasterTypeChart")?.getContext("2d");
    if (ctx2) {
      if (_typeChartInstance) _typeChartInstance.destroy();
      _typeChartInstance = new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: ["🌊 Flood", "🌀 Cyclone", "🌍 Earthquake", "🔥 Fire", "⛰️ Landslide", "📍 Other"],
          datasets: [{
            data: [
              typeCounts.flood,
              typeCounts.cyclone,
              typeCounts.earthquake,
              typeCounts.fire,
              typeCounts.landslide,
              typeCounts.other
            ],
            backgroundColor: ["#0284c7", "#7c3aed", "#d97706", "#dc2626", "#16a34a", "#64748b"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: { boxWidth: 12, font: { size: 11 } }
            }
          }
        }
      });
    }

  } catch (err) {
    console.error("Analytics chart render error:", err);
  }
}



// ============================================================
// ⚡ BROADCAST QUICK TEMPLATE PRESETS (UPGRADE 1)
// ============================================================

const BROADCAST_TEMPLATES = {
  flood: {
    title: "🌊 FLASH FLOOD WARNING & EVACUATION ADVISORY",
    message: "Heavy water discharge and persistent rainfall have caused waterlogging in low-lying areas. Citizens are advised to move to elevated ground or nearby designated relief shelters. Avoid crossing inundated roads and follow local authority alerts.",
    severity: "Critical"
  },
  cyclone: {
    title: "🌀 SEVERE CYCLONE ALERT: STAY INDOORS",
    message: "High wind speeds and extreme precipitation expected over the next 24 hours. Secure loose objects outdoors, keep emergency devices charged, prepare drinking water supplies, and do not venture near coastal or vulnerable structures.",
    severity: "Critical"
  },
  heatwave: {
    title: "🔥 SEVERE HEATWAVE RED ALERT",
    message: "Extreme temperatures exceeding 42°C expected today. Stay hydrated, avoid direct sun exposure between 11:00 AM and 4:00 PM, and report any cases of severe heat exhaustion to the emergency helpline (108 / 112).",
    severity: "High"
  },
  earthquake: {
    title: "🌍 EARTHQUAKE SAFETY ADVISORY (DROP, COVER, HOLD)",
    message: "Tremors detected in the region. Drop to your hands and knees, take cover under sturdy furniture, and hold on until shaking stops. If outdoors, move away from buildings, utility wires, and trees.",
    severity: "High"
  },
  allclear: {
    title: "✅ EMERGENCY ADVISORY LIFTED: ALL CLEAR",
    message: "Weather and ground conditions have returned to safe operational levels. Relief camps remain open for displaced citizens while local restoration teams complete road and utility repairs.",
    severity: "Medium"
  }
};

function applyBroadcastTemplate(type) {
  const tpl = BROADCAST_TEMPLATES[type];
  if (!tpl) return;

  const titleInp = document.getElementById("broadcastTitle");
  const msgInp = document.getElementById("broadcastMsg");
  const sevInp = document.getElementById("broadcastSeverity");

  if (titleInp) titleInp.value = tpl.title;
  if (msgInp) msgInp.value = tpl.message;
  if (sevInp) sevInp.value = tpl.severity;

  showAdminToast("⚡ Template Loaded! Edit details if needed and click Publish.", true);
}





// ============================================================
// 🔕 SOS AUTO-ALARM SNOOZE & MUTE ENGINE (PRIORITY 4)
// ============================================================

let _isSosAudioMuted = localStorage.getItem("adminSosMuted") === "true";
let _snoozeTimer = null;

function updateSosAudioButtonUI() {
  const btn = document.getElementById("sosAudioToggleBtn");
  const icon = document.getElementById("sosAudioIcon");
  const status = document.getElementById("sosAudioStatus");
  if (!btn || !icon || !status) return;

  if (_isSosAudioMuted) {
    btn.style.background = "#fee2e2";
    btn.style.borderColor = "#fca5a5";
    btn.style.color = "#dc2626";
    icon.textContent = "🔕";
    status.textContent = "Alarm Muted (5m)";
  } else {
    btn.style.background = "rgba(255,255,255,0.15)";
    btn.style.borderColor = "rgba(255,255,255,0.3)";
    btn.style.color = "white";
    icon.textContent = "🔊";
    status.textContent = "Alarm Active";
  }
}

function toggleSosAlarmMute() {
  const audio = document.getElementById("sosAudio");

  if (!_isSosAudioMuted) {
    // Mute & Snooze for 5 minutes
    _isSosAudioMuted = true;
    localStorage.setItem("adminSosMuted", "true");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    showAdminToast("🔕 SOS Emergency Siren Snoozed for 5 minutes", false);

    // Auto unmute after 5 minutes (300,000 ms)
    if (_snoozeTimer) clearTimeout(_snoozeTimer);
    _snoozeTimer = setTimeout(() => {
      _isSosAudioMuted = false;
      localStorage.setItem("adminSosMuted", "false");
      updateSosAudioButtonUI();
      showAdminToast("🔊 SOS Siren Unmuted & Armed", true);
    }, 300000);

  } else {
    // Unmute immediately
    _isSosAudioMuted = false;
    localStorage.setItem("adminSosMuted", "false");
    if (_snoozeTimer) clearTimeout(_snoozeTimer);
    showAdminToast("🔊 SOS Emergency Siren Active", true);
  }

  updateSosAudioButtonUI();
}




// ============================================================
// ✏️ ADMIN EDIT PROFILE & DARK MODE LOGIC
// ============================================================

function openAdminEditProfileModal() {
  const menu = document.getElementById("adminAvatarMenu");
  if (menu) menu.classList.add("hidden");

  const modal = document.getElementById("adminEditProfileModal");
  if (!modal) return;

  const currentName = localStorage.getItem("adminName") || "";
  const currentMobile = localStorage.getItem("adminMobile") || "";

  document.getElementById("adminEditName").value = currentName;
  document.getElementById("adminEditMobile").value = currentMobile;
  document.getElementById("adminEditPass").value = "";

  modal.style.display = "flex";
}

function closeAdminEditProfileModal() {
  const modal = document.getElementById("adminEditProfileModal");
  if (modal) modal.style.display = "none";
}

async function saveAdminProfileChanges() {
  const name = document.getElementById("adminEditName").value.trim();
  const mobile = document.getElementById("adminEditMobile").value.trim();
  const newPassword = document.getElementById("adminEditPass").value;

  if (!name) {
    showAdminToast("⚠️ Admin name is required", false);
    return;
  }

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const res = await fetch(`${baseUrl}/admin/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ name, mobile, newPassword })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("adminName", name);
      if (mobile) localStorage.setItem("adminMobile", mobile);

      // Update UI Header and Avatar
      setAdminAvatar(name);
      const nameEl = document.getElementById("adminName");
      if (nameEl) nameEl.textContent = `Welcome, ${name} 👋`;

      showAdminToast("✅ Admin Profile updated successfully!", true);
      closeAdminEditProfileModal();
    } else {
      showAdminToast("❌ " + (data.message || "Update failed"), false);
    }
  } catch (err) {
    showAdminToast("❌ Server error while updating profile", false);
  }
}

// 🌙 Night Mode Toggle for Admin Command Center
function toggleAdminDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("adminTheme", isDark ? "dark" : "light");

  const stateEl = document.getElementById("adminThemeState");
  if (stateEl) stateEl.textContent = isDark ? "ON" : "OFF";
}

// Restore saved dark theme on load
(function initAdminTheme() {
  if (localStorage.getItem("adminTheme") === "dark") {
    document.body.classList.add("dark-mode");
    const stateEl = document.getElementById("adminThemeState");
    if (stateEl) stateEl.textContent = "ON";
  }
})();


// ================= MASTER ADMIN AUTO-REFRESH (Real-Time Live Feed) =================
setInterval(function() {
  // Only poll if the token exists (admin is logged in)
  if (!localStorage.getItem("token")) return;

  // 1. Silently update SOS list & KPI counter
  if (typeof loadSOS === "function") {
    loadSOS();
  }

  // 2. Silently update Complaints list & KPI counter
  if (typeof loadComplaints === "function") {
    loadComplaints();
  }

  // 3. Silently update Damage Reports list & KPI counter
  if (typeof loadDamageReports === "function") {
    loadDamageReports();
  }

  // 4. Silently update NGO list
  if (typeof loadNgos === "function") {
    loadNgos();
  }
}, 5000); // Runs every 5 seconds automatically




