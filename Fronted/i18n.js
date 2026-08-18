/**
 * i18n.js — Centralized Multi-Language System
 * Disaster Management System
 *
 * Supported: en (English), hi (Hindi), or (Odia), bn (Bengali)
 * To add a new language: add its ISO code as a new key in TRANSLATIONS
 * Usage: t('key') → returns translated string for current language
 *        applyLang() → re-renders all [data-i18n] elements
 *        setLang('hi') → switch language globally
 */

// ─────────────────────────────────────────────────────────────
// TRANSLATION TABLE
// ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {

  // ── ENGLISH (default fallback) ──────────────────────────────
  en: {
    // App-wide
    appName:            "Disaster Management System",
   appTagline: "In times of crisis, your actions define outcomes. Stay alert, respond quickly, and save lives.",
    countryCode:        "+91",
    back:               "← Back",
    backToDashboard:    "← Back to Dashboard",
    cancel:             "Cancel",
    close:              "Close",
    save:               "💾 Save",
    submit:             "Submit",
    loading:            "Loading…",
    yes:                "Yes",
    no:                 "No",
    logout:             "⎋ Logout",
    confirm:            "Confirm",
    send:               "Send",
    update:             "Update",
    logoutConfirm:      "Are you sure you want to logout?",
    offlineBanner:      "📴 You are offline — Emergency calls and First Aid still work",

    // Lang selector
    langLabel:          "🌐 Language",
    langEn:             "English",
    langHi:             "हिन्दी",
    langOr:             "ଓଡ଼ିଆ",
    langBn:             "বাংলা",
    langMore:           "More languages coming soon…",

    // Index / Home
    welcomeTitle:       "Alertify",
    selectRole:         "Select your role to continue",
    emergencyNums:      "📞 Emergency Numbers — Call Direct (No Internet)",
    numEmergency:       "Emergency",
    numPolice:          "Police",
    numAmbulance:       "Ambulance",
    numFire:            "Fire Brigade",
    userLogin:          "👤 User Login",
    adminLogin:         "🛡️ Admin Login",
    ngoLogin:           "🤝 NGO Login / Register",
    welcomeMsg:         "Welcome! 👋",
    staySafe:           "Stay safe and informed during emergencies.",

    // Dashboard sidebar
    sidebarTitle:       "🌐 Disaster App",
    sidebarCitizen:     "Citizen",
    sidebarHome:        "🏠 Home",
    sidebarLiveInfo:    "🗺️ Live Info",
    adminLiveInfo: "🗺️ Disaster Monitoring Dashboard",
    adminSos: "🚨 Emergency Alert Management",
    fileComplaintSubtitle: "Review and respond to citizen complaints",
    damageAdminSubtitle: "View photo-verified damage reports submitted by citizens.",
    adminRegEmailPlaceholder: "Email Address *",
    userRegErrEmail: "Please enter a valid email address",
    adminSosSubtitle: "Track GPS location of users who triggered emergency SOS alerts",
    sidebarWeather:     "🌤️ Live Weather",
    sidebarNgo:         "🤝 NGO & Volunteer",
    sidebarSafeZones:   "🛟 Safe Zones",
    sidebarFirstAid:    "🩹 First Aid",
    sidebarContact:     "✉️ Contact Us",
    sidebarComplaint:   "📋 File Complaint",
    sidebarTrack:       "🔍 Track Status",
    sidebarDamage:      "🏚️ Damage Report",
    sidebarTrackRpt:    "📊 Track My Report",
    sidebarTheme:       "🌙 Toggle Theme",
    dashTitle:          "Disaster Management",
    copyright:          "© 2026 Disaster Management System | College Major Project",

    // Dashboard action grid
    sendSos:            "Send SOS",
    damageReport:       "Damage Report",
    fileComplaint:      "Complaint Management",
    trackReport:        "Track Report",
    safeZones:          "Safe Zones",
    firstAid:           "First Aid",

    // Emergency contacts section
    emergencyContacts:  "📞 Emergency Contacts",
    addContact:         "+ Add",
    viewAll:            "View All",
    contactName:        "Contact Name",
    phoneNumber:        "Phone Number",
    allContacts:        "📋 All Emergency Contacts",
    contactSaved:       "📞 Contact Saved!",
    contactDeleted:     "🗑️ Contact deleted successfully!",
    contactDeleteConfirm:"Are you sure you want to delete this contact?",
    contactFillBoth:    "Please fill in both fields.",

    // SOS popup
    sosSendTitle:       "🆘 Send SOS — Select Contacts",
    sosSubtitle:        "Choose who to send your emergency alert to",
    sosGettingGps:      "📡 Getting your location...",
    sosGpsReady:        "✅ GPS ready:",
    sosGpsUnavail:      "⚠️ GPS unavailable — SOS will send without location",
    sosGpsNotSupported: "⚠️ GPS not supported on this device",
    sosSelectAll:       "Select All Contacts",
    sosEmergSvc:        "Emergency Services",
    sosSavedContacts:   "Your Saved Contacts",
    sosNoContacts:      "No personal contacts saved yet. Add from dashboard.",
    sosAppAdmin:        "App Admin",
    sosSendNow:         "🆘 Send SOS Now",
    sosSent:            "🆘 SOS Sent!",
    sosSentMsg:         "Message sent. Also call directly for fastest response:",
    sosConfirm:         "⚠️ EMERGENCY SOS\n\nThis will send your location to selected contacts via SMS.\nMisuse is punishable.\n\nContinue?",
    sosSelectAtLeastOne:"Please select at least one contact.",
    sosBtnLabel:        "🆘 EMERGENCY SOS — No Login Needed",

    // Complaint popup
    complaintTitle:     "File a Complaint",
    complaintPlaceholder:"Describe your complaint...",
    complaintSubmit:    "Submit",
    complaintEmpty:     "Please describe your complaint!",
    complaintLoginFirst:"Please login first",
    complaintSuccess:   "✅ Complaint submitted successfully!",
    complaintId:        "Your ID:",
    complaintSaveId:    "Save this ID to track your complaint.",
    complaintFailed:    "❌ Failed to submit complaint:",

    // Track complaint popup
    trackComplaintTitle:"Track Complaint Status",
    trackPlaceholder:   "Enter Complaint ID",
    trackCheck:         "Check Status",
    trackEmpty:         "Please enter a Complaint ID!",
    trackNotFound:      "❌ Complaint ID not found!",

    // Damage report popup
    damageTitle:        "🏚️ Submit Damage Report",
    damageSubtitle:     "Report damage after a disaster. Admin will review and respond.",
    damageNamePlaceholder: "Your Full Name *",
    damageAddressPlaceholder: "Your Full Address *",
    damageTypeFlood:    "🌊 Flood",
    damageTypeCyclone:  "🌀 Cyclone",
    damageTypeEarthquake:"🌍 Earthquake",
    damageTypeFire:     "🔥 Fire",
    damageTypeLandslide:"⛰️ Landslide",
    damageTypeOther:    "📍 Other",
    damageDescPlaceholder:"Describe the damage situation *",
    damagePhotoLabel:   "📷 Upload Photo of Damage",
    damageSubmitBtn:    "🏚️ Submit Report",
    damageFillRequired: "⚠️ Please fill in Name, Address and Description.",
    damageSubmitting:   "Submitting...",
    damageSuccess:      "✅ Report submitted! ID:",
    damageFailed:       "❌",
    damageNetworkError: "❌ Network error. Check connection.",

    // Track damage report
    trackDamageTitle:   "🔍 Track My Damage Report",
    trackDamageSubtitle:"Enter your Report ID to check status and admin response.",
    trackDamagePlaceholder: "Enter Report ID (e.g. RPT1234567890)",
    trackDamageBtn:     "🔍 Check Status",
    trackDamageEmpty:   "⚠️ Please enter your Report ID.",
    trackDamageNotFound:"❌",
    trackDamageNetwork: "❌ Network error. Check connection.",
    trackDamageClose:   "Close",
    trackRptId:         "Report ID:",
    trackRptName:       "Name:",
    trackRptType:       "Disaster Type:",
    trackRptDate:       "Submitted:",
    adminNote:          "📝 Admin Note:",

    // Status badges
    statusSubmitted:    "📋 Submitted — Admin will review soon",
    statusReviewed:     "🔍 Reviewed — Admin is taking action",
    statusResolved:     "✅ Resolved — Issue has been addressed",
    statusRejected:     "❌ Rejected — See admin note below",

    // Forgot password
    forgotTitle:        "Reset Password",
    forgotMobilePlaceholder: "Enter Mobile Number",
    forgotOtpPlaceholder:   "Enter OTP",
    forgotNewPassPlaceholder:"New Password",
    forgotSendOtp:      "Send OTP",
    forgotVerifyOtp:    "Verify OTP",
    forgotResetPass:    "Reset Password",
    forgotCancel:       "Cancel",
    forgotSuccess:      "✅ Password reset successful! Please login.",

    // Chatbot
    chatbotTitle:       "🤖 Disaster Assistant",
    chatbotPlaceholder: "Type your question...",
    chatbotSend:        "Send",
    chatbotWelcome:     "Hi 👋 Welcome to Disaster Assistant!",
    chatbotSosHelp:     "🚨 SOS Help",
    chatbotComplaint:   "📋 File Complaint",
    chatbotContacts:    "📞 Contacts Help",
    chatbotPassword:    "🔐 Password Help",
    chatbotSosReply:    "🚨 Click SOS button.\nIf internet ON → admin gets alert.\nIf OFF → SMS app opens. You must press send manually.",
    chatbotComplaintReply:"📋 Click 'File Complaint' in sidebar.\nAfter submit, save your Complaint ID.",
    chatbotContactsReply:"📞 Add emergency contacts.\nDefault: 100 Police, 101 Fire, 102 Ambulance.",
    chatbotPasswordReply:"🔐 Click 'Forgot Password'.\nEnter mobile → OTP → New password.",
    chatbotDidntUnderstand:"Sorry 😔 I didn't understand. Please select an option below.",

    // User Login page
    userLoginBadge:     "👤 CITIZEN / USER",
    userLoginTitle:     "User Login",
    userLoginSubtitle:  "Sign in to access the Disaster Management System",
    userLoginEmailPlaceholder:"Email or Mobile Number",
    userLoginPassPlaceholder: "Password",
    userLoginHint:      "Use the same password you created during registration.",
    userLoginBtn:       "Login",
    userLoginNewHere:   "New here?",
    userLoginRegister:  "Register Here",
    userLoginForgot:    "Forgot Password?",
    userLoginAdmin:     "Are you admin?",
    userLoginAdminLink: "Admin Login →",
    userLoginErrIdentifier:"Please enter your email or mobile number.",
    userLoginErrPassword:  "Please enter your password.",
    userLoginErrAdmAccount:"❌ This is User Login. Admin must use Admin Login page.",
    userLoginErrFormat: "❌ Please enter a valid email address or 10-digit mobile number.",
    userLoginErrFailed: "Login failed.",
    userLoginErrRole:   "❌ Wrong role. Please use Admin Login if you are an admin.",
    userLoginErrServer: "❌ Server not responding. Please try again.",

    // User Register page
    userRegBadge:       "👤 NEW USER REGISTRATION",
    userRegTitle:       "Create Account",
    userRegSubtitle:    "Register to access disaster alerts, SOS, and emergency services",
    userRegNamePlaceholder: "Full Name *",
    userRegEmailPlaceholder:"Email Address (optional)",
    userRegMobilePlaceholder:"Mobile Number (10 digits) *",
    userRegPassPlaceholder: "Password *",
    userRegPassHint:    "Min 8 characters — must include uppercase, lowercase, number and special character (e.g. @$!%*?&)",
    userRegCpassPlaceholder:"Confirm Password *",
    userRegBtn:         "✅ Create Account",
    userRegHaveAccount: "Already have an account?",
    userRegLoginLink:   "Login Here",
    userRegAdminLink:   "Admin Login →",
    userRegErrName:     "Please enter your full name.",
    userRegErrMobile:   "Please enter a valid 10-digit mobile number.",
    userRegErrPassword: "Password must be minimum 8 characters and include:\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character (@$!%*?&)",
    userRegErrMatch:    "Passwords do not match. Please re-enter.",
    userRegErrServer:   "❌ Server not responding. Please try again.",
    userRegSuccess:     "You can now login with your mobile number or email.",

    // Admin Login page
    adminLoginBadge:    "🛡️ ADMIN ACCESS",
    adminLoginTitle:    "Admin Login",
    adminLoginSubtitle: "Disaster Management System — Control Panel",
    adminLoginInfo:     "🔐 Admin accounts are created by the system administrator.",
    adminLoginInfoADM:  "Login using your Admin ID (starts with ADM) and your password.",
    adminIdPlaceholder: "Admin ID (e.g. ADM12345)",
    adminPassPlaceholder:"Password",
    adminLoginHint:     "Your Admin ID starts with ADM followed by digits.",
    adminLoginBtn:      "🔐 Login as Admin",
    adminLoginCitizen:  "Are you a citizen?",
    adminLoginUserLink: "← User Login",
    adminLoginNewAdmin: "New admin?",
    adminLoginRegLink:  "Request Admin Access →",
    adminLoginNgoBox:   "Are you an NGO?",
    adminLoginNgoLink:  "NGO Login / Register →",

    // NGO page
    ngoPortalTitle:     "🤝 NGO & Volunteer Portal",
    ngoPortalSubtitle:  "Connecting NGOs with disaster relief operations",
    ngoLoginBtn:        "🔐 Login",
    ngoRegisterBtn:     "📝 Register",
    ngoCheckStatusBtn:  "🔍 Check Status",
    ngoRegTitle:        "Register NGO / Volunteer",
    ngoNamePlaceholder: "NGO / Organization Name *",
    ngoTypeLabel:       "Type of NGO *",
    ngoTypeSelect:      "Select NGO Type *",
    ngoTypeMedical:     "🏥 Medical / Health",
    ngoTypeRescue:      "🚒 Rescue & Relief",
    ngoTypeFood:        "🍱 Food & Nutrition",
    ngoTypeShelter:     "🏠 Shelter",
    ngoTypeEducation:   "📚 Education",
    ngoTypeGeneral:     "🤝 General Welfare",
    ngoVolunteersLabel: "Volunteers *",
    ngoVolunteersSelect:"How many volunteers?",
    ngoVolPlaceholder:  "Volunteer {n} Name *",
    ngoStateLabel:      "State *",
    ngoStateSelect:     "Select State",
    ngoDistrictLabel:   "District *",
    ngoDistrictSelect:  "Select District",
    ngoLandmark1:       "Landmark 1 (Required) *",
    ngoLandmark2:       "Landmark 2 (Optional)",
    ngoAddress:         "Full Address *",
    ngoMobilePlaceholder:"Mobile Number (10 digits) *",
    ngoEmailPlaceholder:"Email (optional)",
    ngoHeadPlaceholder: "Head / Leader Name *",
    ngoPassPlaceholder: "Password *",
    ngoCpassPlaceholder:"Confirm Password *",
    ngoPassHint:        "Min 8 characters — uppercase, lowercase, number & special character",
    ngoRegBtn:          "✅ Register NGO",
    ngoLoginTitle:      "NGO / Volunteer Login",
    ngoIdPlaceholder:   "NGO ID (e.g. NGO12345)",
    ngoLoginPassPlaceholder:"Password",
    ngoLoginSubmitBtn:  "🔐 Login",
    ngoForgotLink:      "Forgot Password?",
    ngoForgotTitle:     "🔐 Reset NGO Password",
    ngoForgotIdPlaceholder:"Enter NGO ID",
    ngoSendOtpBtn:      "Send OTP",
    ngoOtpPlaceholder:  "Enter OTP",
    ngoNewPassPlaceholder:"Enter New Password",
    ngoResetBtn:        "Reset Password",
    ngoStatusTitle:     "Check NGO Status",
    ngoStatusIdPlaceholder:"Enter NGO ID",
    ngoStatusCheckBtn:  "Check Status",
    ngoDashWelcome:     "Welcome,",
    ngoOrdersBtn:       "📦 Orders from Admin",
    ngoLogoutBtn:       "Logout",
    ngoWorkTitle:       "Update Work",
    ngoWorkNotePlaceholder:"Enter work details",
    ngoWorkPhotoLabel:  "Work Photo *",
    ngoWorkSubmitBtn:   "Submit",
    ngoWorkCancelBtn:   "Cancel",
    ngoMarkCompleted:   "✅ Mark Completed",
    ngoCompleted:       "✅ Completed",
    ngoNoOrders:        "No help orders assigned yet.",
    ngoOrderLocation:   "Location:",
    ngoOrderNote:       "Note:",
    ngoOrderStatus:     "Status:",
    ngoOrderWorkNote:   "Work Note:",
    ngoStatusResult:    "NGO Name:",
    ngoStatusStatus:    "Status:",
    ngoBackBtn:         "← Back",
    ngoLoginSuccess:    "✅ Login Successful!",
    ngoLogoutSuccess:   "Logged out successfully!",
    ngoWorkSuccess:     "✅ Work updated successfully!",
    ngoErrConnectServer:"❌ Cannot connect to server",
    ngoErrEnterNgoId:   "Please enter NGO ID",
    ngoErrServer:       "Server error",
    ngoErrWorkRequired: "Work note and photo required!",
    ngoErrOtpNewPass:   "Enter OTP and New Password",
    ngoErrInvalidOtp:   "Invalid OTP",

    // First Aid
    firstAidTitle:      "🩹 First Aid Guide",
    firstAidH2:         "Emergency First Aid — Quick Reference",
    firstAidSub:        "Works offline. Tap any guide to expand. Follow steps carefully until medical help arrives.",
    firstAidSearch:     "🔍 Search: flood, snake, CPR, burn, fracture...",
    firstAidNoResult:   "No guides found. Try another keyword.",

    // First Aid Guide Content Keys
    fa_flood_title:     "Flood Safety",
    fa_flood_s1:        "Move to higher ground immediately — do not wait.",
    fa_flood_s2:        "Do not walk through moving water. 6 inches can knock you down.",
    fa_flood_s3:        "Turn off utilities at main switches. Do not touch electrical equipment.",
    fa_flood_s4:        "Avoid bridges over fast-moving water.",
    fa_flood_s5:        "If trapped at home, go to the roof and signal for help.",
    fa_flood_s6:        "Drink only boiled or bottled water after flooding.",
    fa_flood_warn:      "Do not enter floodwater — it may be contaminated or electrically charged.",
    fa_earthquake_title:"Earthquake Response",
    fa_earthquake_s1:   "DROP to hands and knees immediately.",
    fa_earthquake_s2:   "Take COVER under a sturdy table or against an interior wall.",
    fa_earthquake_s3:   "HOLD ON until shaking stops.",
    fa_earthquake_s4:   "Do not run outside during shaking — falling debris is most dangerous.",
    fa_earthquake_s5:   "After shaking stops, check for injuries and exit carefully.",
    fa_earthquake_s6:   "Expect aftershocks. Stay away from damaged buildings.",
    fa_earthquake_warn: "Never use elevators after an earthquake. Check for gas leaks before switching on lights.",
    fa_cyclone_title:   "Cyclone Safety",
    fa_cyclone_s1:      "Evacuate if instructed by authorities immediately.",
    fa_cyclone_s2:      "Close all windows and doors securely.",
    fa_cyclone_s3:      "Stay indoors during the storm, away from windows.",
    fa_cyclone_s4:      "Go to the strongest room — bathroom or interior room.",
    fa_cyclone_s5:      "If outside, lie flat in a ditch and cover your head.",
    fa_cyclone_s6:      "After cyclone: watch for downed power lines, flooding and debris.",
    fa_cyclone_warn:    "Never go outside during the eye of a cyclone — the second half can be worse.",
    fa_cpr_title:       "CPR (Adult)",
    fa_cpr_s1:          "Check if the person is breathing. If not, call 112 immediately.",
    fa_cpr_s2:          "Place heel of hand on center of chest between nipples.",
    fa_cpr_s3:          "Push down hard and fast — at least 2 inches deep, 100-120 times per minute.",
    fa_cpr_s4:          "Allow chest to fully rise between compressions.",
    fa_cpr_s5:          "If trained: give 2 rescue breaths after every 30 compressions.",
    fa_cpr_s6:          "Continue until emergency help arrives or person wakes up.",
    fa_cpr_warn:        "Even untrained CPR (hands-only) doubles survival chance. Do not stop until help arrives.",
    fa_snakebite_title: "Snake Bite",
    fa_snakebite_s1:    "Keep the person calm and still. Movement spreads venom faster.",
    fa_snakebite_s2:    "Remove watches, rings or tight items near the bite.",
    fa_snakebite_s3:    "Keep the bitten limb below heart level.",
    fa_snakebite_s4:    "Do NOT cut the wound, suck out venom or apply ice.",
    fa_snakebite_s5:    "Note the snake's appearance if possible (do not chase it).",
    fa_snakebite_s6:    "Rush to hospital immediately — antivenom is the only treatment.",
    fa_snakebite_warn:  "90% of Indian snake bites can be treated with antivenom. Get to hospital within 4 hours.",
    fa_burns_title:     "Burns",
    fa_burns_s1:        "Cool the burn with cool (not cold) running water for 20 minutes.",
    fa_burns_s2:        "Do not use ice, butter, toothpaste or oil.",
    fa_burns_s3:        "Remove clothing and jewellery near the burn — unless stuck to skin.",
    fa_burns_s4:        "Cover loosely with a clean non-fluffy cloth or cling film.",
    fa_burns_s5:        "Do not break blisters — risk of infection.",
    fa_burns_s6:        "For large or deep burns — call 102 (ambulance) immediately.",
    fa_burns_warn:      "Chemical burns — flush with lots of water for 20+ minutes. Remove contaminated clothing carefully.",
    fa_fracture_title:  "Fracture / Broken Bone",
    fa_fracture_s1:     "Do not try to straighten the limb.",
    fa_fracture_s2:     "Immobilise the area using a splint or rolled newspaper.",
    fa_fracture_s3:     "Tie above and below the break — not over it.",
    fa_fracture_s4:     "Elevate if possible to reduce swelling.",
    fa_fracture_s5:     "Apply ice pack wrapped in cloth for 20 minutes.",
    fa_fracture_s6:     "For open fractures (bone visible): cover with clean cloth and go to hospital immediately.",
    fa_fracture_warn:   "Never move a person with suspected neck or spine injury unless they are in immediate danger.",
    fa_dehydration_title:"Dehydration During Disaster",
    fa_dehydration_s1:  "Give small sips of clean water every few minutes.",
    fa_dehydration_s2:  "If available, use ORS (Oral Rehydration Salts) — 1 packet per 1 litre water.",
    fa_dehydration_s3:  "Homemade ORS: 1 litre water + 6 teaspoons sugar + half teaspoon salt.",
    fa_dehydration_s4:  "Keep person in shade and cool them with wet cloth.",
    fa_dehydration_s5:  "For children — continue breastfeeding.",
    fa_dehydration_s6:  "If person is unconscious, do not give water orally. Call 102.",
    fa_dehydration_warn:"Contaminated water causes more deaths after floods than the flood itself. Always boil water.",
    fa_choking_title:   "Choking",
    fa_choking_s1:      "Ask 'Are you choking?' — if they cannot speak, act immediately.",
    fa_choking_s2:      "Give 5 sharp back blows between shoulder blades with heel of hand.",
    fa_choking_s3:      "If not cleared: stand behind them, make fist above belly button, give 5 abdominal thrusts (Heimlich).",
    fa_choking_s4:      "Alternate 5 back blows and 5 abdominal thrusts.",
    fa_choking_s5:      "If person becomes unconscious — begin CPR.",
    fa_choking_s6:      "For infants: face-down back blows on thigh, NOT abdominal thrusts.",
    fa_choking_warn:    "Do not do a blind finger sweep — you may push the object deeper.",
    fa_electric_title:  "Electric Shock",
    fa_electric_s1:     "Do NOT touch the person while they are still in contact with electricity.",
    fa_electric_s2:     "Switch off power at the main board before approaching.",
    fa_electric_s3:     "If you cannot switch off — use a dry wooden stick or rope to push them away.",
    fa_electric_s4:     "Call 112 immediately.",
    fa_electric_s5:     "Check for breathing. Start CPR if not breathing.",
    fa_electric_s6:     "Treat burns with cool running water.",
    fa_electric_warn:   "Never use metal objects near an electrocution victim. Always cut power first.",

    // Safe Zones
    safeZonesTitle:     "🛟 Safe Zones Near You",
    safeZonesH2:        "Emergency Shelters, Hospitals & Police Near You",
    safeZonesSub:       "Shows hospitals, police stations and fire stations within 5km.",
    safeZonesAllow:     "📍 Allow Location & Show Map",
    safeZonesPermH3:    "Allow Location to Show Safe Zones",
    safeZonesPermP:     "Tap the button below. Your browser will ask for location permission. Tap Allow to see hospitals, police and shelters near you. Your location is never stored or shared.",
    safeZonesLoading:   "⏳ Loading safe zones near you...",

    // Weather
    weatherTitle:       "Live Weather Monitor",
    weatherHumidity:    "Humidity:",
    weatherWind:        "Wind Speed:",
    weatherPressure:    "Pressure:",
    weatherAlerts:      "Disaster Alerts",
    weatherHeat:        "Heatwave Warning: High temperatures detected.",
    weatherStorm:       "Storm Alert: Strong winds expected.",
    weatherFlood:       "Flood Risk: Heavy rainfall may cause flooding.",
    weatherClear:       "All Clear: Weather conditions are stable.",

    // Contact page
    contactTitle:       "Contact Us",
    contactSend:        "Send Message",

    // Admin note modal
    adminNoteTitle:     "✅ Resolve Report",
    adminNoteSubtitle:  "Write a note for the citizen — they will see this when they track their report.",
    adminNotePlaceholder:"Enter your note here...",
    adminNoteConfirm:   "Confirm",
    adminNoteCancel:    "Cancel",
  },

  // ── HINDI ────────────────────────────────────────────────────
  hi: {
    appName:            "आपदा प्रबंधन प्रणाली",
    appTagline:         "आपात स्थिति में सुरक्षित और सूचित रहें।",
    countryCode:        "+91",
    back:               "← वापस",
    backToDashboard:    "← डैशबोर्ड पर वापस",
    cancel:             "रद्द करें",
    close:              "बंद करें",
    save:               "💾 सेव करें",
    submit:             "जमा करें",
    loading:            "लोड हो रहा है…",
    logout:             "⎋ लॉगआउट",
    confirm:            "पुष्टि करें",
    send:               "भेजें",
    update:             "अपडेट",
    adminSosSubtitle: "आपातकालीन SOS अलर्ट ट्रिगर करने वाले उपयोगकर्ताओं के GPS स्थान को ट्रैक करें",
    adminSos: "🚨 आपातकालीन अलर्ट प्रबंधन",
    fileComplaintSubtitle: "नागरिकों द्वारा दर्ज शिकायतों की समीक्षा करें और जवाब दें।",
    damageAdminSubtitle: "नागरिकों द्वारा प्रस्तुत फोटो-प्रमाणित क्षति रिपोर्ट देखें।",
    logoutConfirm:      "क्या आप वाकई लॉगआउट करना चाहते हैं?",
    userRegErrEmail: "कृपया एक सही ईमेल दर्ज करें",
    offlineBanner:      "📴 आप ऑफलाइन हैं — आपातकालीन कॉल और प्राथमिक चिकित्सा अभी भी काम करती है",

    langLabel:          "🌐 भाषा",
    langEn:             "English",
    langHi:             "हिन्दी",
    langOr:             "ଓଡ଼ିଆ",
    langBn:             "বাংলা",
    langMore:           "और भाषाएँ जल्द आ रही हैं…",

    welcomeTitle:       "आपदा प्रबंधन प्रणाली में आपका स्वागत है",
    selectRole:         "जारी रखने के लिए अपनी भूमिका चुनें",
    emergencyNums:      "📞 आपातकालीन नंबर — सीधे कॉल करें (इंटरनेट के बिना)",
    numEmergency:       "आपातकाल",
    numPolice:          "पुलिस",
    numAmbulance:       "एम्बुलेंस",
    numFire:            "दमकल",
    userLogin:          "👤 उपयोगकर्ता लॉगिन",
    adminLogin:         "🛡️ प्रशासक लॉगिन",
    ngoLogin:           "🤝 NGO लॉगिन / पंजीकरण",
    welcomeMsg:         "स्वागत है! 👋",
    staySafe:           "आपात स्थिति में सुरक्षित और सूचित रहें।",

    sidebarTitle:       "🌐 आपदा ऐप",
    sidebarCitizen:     "नागरिक",
    sidebarHome:        "🏠 होम",
    sidebarLiveInfo:    "🗺️ लाइव जानकारी",
    sidebarWeather:     "🌤️ लाइव मौसम",
    sidebarNgo:         "🤝 NGO और स्वयंसेवक",
    sidebarSafeZones:   "🛟 सुरक्षित क्षेत्र",
    sidebarFirstAid:    "🩹 प्राथमिक चिकित्सा",
    sidebarContact:     "✉️ संपर्क करें",
    sidebarComplaint:   "📋 शिकायत दर्ज करें",
    sidebarTrack:       "🔍 स्थिति ट्रैक करें",
    sidebarDamage:      "🏚️ क्षति रिपोर्ट",
    sidebarTrackRpt:    "📊 मेरी रिपोर्ट ट्रैक करें",
    sidebarTheme:       "🌙 थीम बदलें",
    dashTitle:          "आपदा प्रबंधन",
    copyright:          "© 2026 आपदा प्रबंधन प्रणाली | कॉलेज प्रमुख परियोजना",

    sendSos:            "SOS भेजें",
    damageReport:       "क्षति रिपोर्ट",
    fileComplaint:      "शिकायत दर्ज करें",
    trackReport:        "रिपोर्ट ट्रैक करें",
    safeZones:          "सुरक्षित क्षेत्र",
    firstAid:           "प्राथमिक चिकित्सा",

    emergencyContacts:  "📞 आपातकालीन संपर्क",
    addContact:         "+ जोड़ें",
    viewAll:            "सभी देखें",
    contactName:        "संपर्क का नाम",
    phoneNumber:        "फोन नंबर",
    allContacts:        "📋 सभी आपातकालीन संपर्क",
    contactSaved:       "📞 संपर्क सेव किया गया!",
    contactDeleted:     "🗑️ संपर्क सफलतापूर्वक हटाया गया!",
    contactDeleteConfirm:"क्या आप इस संपर्क को हटाना चाहते हैं?",
    contactFillBoth:    "कृपया दोनों फ़ील्ड भरें।",

    sosSendTitle:       "🆘 SOS भेजें — संपर्क चुनें",
    sosSubtitle:        "अपने आपातकालीन अलर्ट को किसे भेजना है चुनें",
    sosGettingGps:      "📡 आपकी लोकेशन प्राप्त की जा रही है...",
    sosGpsReady:        "✅ GPS तैयार है:",
    sosGpsUnavail:      "⚠️ GPS उपलब्ध नहीं — SOS बिना लोकेशन के भेजा जाएगा",
    sosGpsNotSupported: "⚠️ इस डिवाइस पर GPS समर्थित नहीं है",
    sosSelectAll:       "सभी संपर्क चुनें",
    sosEmergSvc:        "आपातकालीन सेवाएं",
    sosSavedContacts:   "आपके सहेजे गए संपर्क",
    sosNoContacts:      "अभी तक कोई व्यक्तिगत संपर्क नहीं। डैशबोर्ड से जोड़ें।",
    sosAppAdmin:        "ऐप एडमिन",
    sosSendNow:         "🆘 अभी SOS भेजें",
    sosSent:            "🆘 SOS भेजा गया!",
    sosSentMsg:         "संदेश भेजा गया। सबसे तेज़ प्रतिक्रिया के लिए सीधे कॉल भी करें:",
    sosConfirm:         "⚠️ आपातकालीन SOS\n\nयह SMS के माध्यम से चुने गए संपर्कों को आपकी लोकेशन भेजेगा।\nदुरुपयोग दंडनीय है।\n\nजारी रखें?",
    sosSelectAtLeastOne:"कृपया कम से कम एक संपर्क चुनें।",
    sosBtnLabel:        "🆘 आपातकालीन SOS — बिना लॉगिन के",

    complaintTitle:     "शिकायत दर्ज करें",
    complaintPlaceholder:"अपनी शिकायत का विवरण दें...",
    complaintSubmit:    "जमा करें",
    complaintEmpty:     "कृपया अपनी शिकायत का विवरण दें!",
    complaintLoginFirst:"पहले लॉगिन करें",
    complaintSuccess:   "✅ शिकायत सफलतापूर्वक जमा की गई!",
    complaintId:        "आपका ID:",
    complaintSaveId:    "शिकायत ट्रैक करने के लिए यह ID सेव करें।",
    complaintFailed:    "❌ शिकायत जमा करने में विफल:",

    trackComplaintTitle:"शिकायत स्थिति ट्रैक करें",
    trackPlaceholder:   "शिकायत ID दर्ज करें",
    trackCheck:         "स्थिति जांचें",
    trackEmpty:         "कृपया शिकायत ID दर्ज करें!",
    trackNotFound:      "❌ शिकायत ID नहीं मिली!",

    damageTitle:        "🏚️ क्षति रिपोर्ट जमा करें",
    damageSubtitle:     "आपदा के बाद नुकसान की रिपोर्ट करें। प्रशासक समीक्षा करेंगे।",
    damageNamePlaceholder:"आपका पूरा नाम *",
    damageAddressPlaceholder:"आपका पूरा पता *",
    damageTypeFlood:    "🌊 बाढ़",
    damageTypeCyclone:  "🌀 चक्रवात",
    damageTypeEarthquake:"🌍 भूकंप",
    damageTypeFire:     "🔥 आग",
    damageTypeLandslide:"⛰️ भूस्खलन",
    damageTypeOther:    "📍 अन्य",
    damageDescPlaceholder:"नुकसान की स्थिति का वर्णन करें *",
    damagePhotoLabel:   "📷 नुकसान की फोटो अपलोड करें",
    damageSubmitBtn:    "🏚️ रिपोर्ट जमा करें",
    damageFillRequired: "⚠️ कृपया नाम, पता और विवरण भरें।",
    damageSubmitting:   "जमा हो रहा है...",
    damageSuccess:      "✅ रिपोर्ट जमा! ID:",
    damageFailed:       "❌",
    damageNetworkError: "❌ नेटवर्क त्रुटि। कनेक्शन जांचें।",

    trackDamageTitle:   "🔍 मेरी क्षति रिपोर्ट ट्रैक करें",
    trackDamageSubtitle:"स्थिति और प्रशासक की प्रतिक्रिया देखने के लिए रिपोर्ट ID दर्ज करें।",
    trackDamagePlaceholder:"रिपोर्ट ID दर्ज करें (जैसे RPT1234567890)",
    trackDamageBtn:     "🔍 स्थिति जांचें",
    trackDamageEmpty:   "⚠️ कृपया अपनी रिपोर्ट ID दर्ज करें।",
    trackDamageNotFound:"❌",
    trackDamageNetwork: "❌ नेटवर्क त्रुटि। कनेक्शन जांचें।",
    trackDamageClose:   "बंद करें",
    trackRptId:         "रिपोर्ट ID:",
    trackRptName:       "नाम:",
    trackRptType:       "आपदा प्रकार:",
    trackRptDate:       "जमा किया:",
    adminNote:          "📝 प्रशासक नोट:",

    statusSubmitted:    "📋 जमा किया गया — प्रशासक शीघ्र समीक्षा करेंगे",
    statusReviewed:     "🔍 समीक्षित — प्रशासक कार्रवाई कर रहे हैं",
    statusResolved:     "✅ हल किया गया — समस्या का समाधान हो गया",
    statusRejected:     "❌ अस्वीकृत — नीचे प्रशासक नोट देखें",

    forgotTitle:        "पासवर्ड रीसेट करें",
    forgotMobilePlaceholder:"मोबाइल नंबर दर्ज करें",
    forgotOtpPlaceholder:   "OTP दर्ज करें",
    forgotNewPassPlaceholder:"नया पासवर्ड",
    forgotSendOtp:      "OTP भेजें",
    forgotVerifyOtp:    "OTP सत्यापित करें",
    forgotResetPass:    "पासवर्ड रीसेट करें",
    forgotCancel:       "रद्द करें",
    forgotSuccess:      "✅ पासवर्ड सफलतापूर्वक रीसेट! कृपया लॉगिन करें।",

    chatbotTitle:       "🤖 आपदा सहायक",
    chatbotPlaceholder: "अपना सवाल टाइप करें...",
    chatbotSend:        "भेजें",
    chatbotWelcome:     "नमस्ते 👋 आपदा सहायक में आपका स्वागत है!",
    chatbotSosHelp:     "🚨 SOS सहायता",
    chatbotComplaint:   "📋 शिकायत दर्ज करें",
    chatbotContacts:    "📞 संपर्क सहायता",
    chatbotPassword:    "🔐 पासवर्ड सहायता",
    chatbotSosReply:    "🚨 SOS बटन दबाएं।\nइंटरनेट है → एडमिन को अलर्ट मिलेगा।\nनहीं है → SMS ऐप खुलेगा। आपको मैन्युअल भेजना होगा।",
    chatbotComplaintReply:"📋 साइडबार में 'शिकायत दर्ज करें' पर क्लिक करें।\nजमा करने के बाद शिकायत ID सेव करें।",
    chatbotContactsReply:"📞 आपातकालीन संपर्क जोड़ें।\nडिफ़ॉल्ट: 100 पुलिस, 101 दमकल, 102 एम्बुलेंस।",
    chatbotPasswordReply:"🔐 'पासवर्ड भूल गए' पर क्लिक करें।\nमोबाइल → OTP → नया पासवर्ड दर्ज करें।",
    chatbotDidntUnderstand:"माफ़ करें 😔 मैं समझ नहीं पाया। नीचे विकल्प चुनें।",

    userLoginBadge:     "👤 नागरिक / उपयोगकर्ता",
    userLoginTitle:     "उपयोगकर्ता लॉगिन",
    userLoginSubtitle:  "आपदा प्रबंधन प्रणाली एक्सेस करने के लिए साइन इन करें",
    userLoginEmailPlaceholder:"ईमेल या मोबाइल नंबर",
    userLoginPassPlaceholder: "पासवर्ड",
    userLoginHint:      "पंजीकरण के समय बनाया गया पासवर्ड उपयोग करें।",
    userLoginBtn:       "लॉगिन",
    userLoginNewHere:   "नए हैं?",
    userLoginRegister:  "यहाँ पंजीकरण करें",
    userLoginForgot:    "पासवर्ड भूल गए?",
    userLoginAdmin:     "क्या आप एडमिन हैं?",
    userLoginAdminLink: "एडमिन लॉगिन →",

    userRegBadge:       "👤 नया उपयोगकर्ता पंजीकरण",
    userRegTitle:       "खाता बनाएं",
    userRegSubtitle:    "आपदा अलर्ट, SOS और आपातकालीन सेवाओं के लिए पंजीकरण करें",
    userRegNamePlaceholder: "पूरा नाम *",
    userRegEmailPlaceholder:"ईमेल पता (वैकल्पिक)",
    userRegMobilePlaceholder:"मोबाइल नंबर (10 अंक) *",
    userRegPassPlaceholder: "पासवर्ड *",
    userRegPassHint:    "न्यूनतम 8 वर्ण — बड़े अक्षर, छोटे अक्षर, संख्या और विशेष वर्ण शामिल होना चाहिए",
    userRegCpassPlaceholder:"पासवर्ड की पुष्टि करें *",
    userRegBtn:         "✅ खाता बनाएं",
    userRegHaveAccount: "पहले से खाता है?",
    userRegLoginLink:   "यहाँ लॉगिन करें",

    adminLoginBadge:    "🛡️ प्रशासक एक्सेस",
    adminLoginTitle:    "प्रशासक लॉगिन",
    adminLoginSubtitle: "आपदा प्रबंधन प्रणाली — नियंत्रण पैनल",
    adminLoginInfo:     "🔐 प्रशासक खाते सिस्टम एडमिनिस्ट्रेटर द्वारा बनाए जाते हैं।",
    adminLoginInfoADM:  "अपने एडमिन ID (ADM से शुरू) और पासवर्ड से लॉगिन करें।",
    adminIdPlaceholder: "एडमिन ID (जैसे ADM12345)",
    adminPassPlaceholder:"पासवर्ड",
    adminLoginHint:     "आपका एडमिन ID ADM से शुरू होता है।",
    adminLoginBtn:      "🔐 एडमिन के रूप में लॉगिन",
    adminLoginNgoLink:  "NGO लॉगिन / पंजीकरण →",

    ngoPortalTitle:     "🤝 NGO और स्वयंसेवक पोर्टल",
    ngoPortalSubtitle:  "आपदा राहत कार्यों के साथ NGO को जोड़ना",
    ngoLoginBtn:        "🔐 लॉगिन",
    ngoRegisterBtn:     "📝 पंजीकरण",
    ngoCheckStatusBtn:  "🔍 स्थिति जांचें",
    ngoRegTitle:        "NGO / स्वयंसेवक पंजीकरण",
    ngoNamePlaceholder: "NGO / संगठन का नाम *",
    ngoTypeSelect:      "NGO प्रकार चुनें *",
    ngoTypeMedical:     "🏥 चिकित्सा / स्वास्थ्य",
    ngoTypeRescue:      "🚒 बचाव और राहत",
    ngoTypeFood:        "🍱 खाद्य और पोषण",
    ngoTypeShelter:     "🏠 आश्रय",
    ngoTypeEducation:   "📚 शिक्षा",
    ngoTypeGeneral:     "🤝 सामान्य कल्याण",
    ngoVolunteersSelect:"कितने स्वयंसेवक? *",
    ngoStateSelect:     "राज्य चुनें",
    ngoDistrictSelect:  "जिला चुनें",
    ngoLandmark1:       "लैंडमार्क 1 (आवश्यक) *",
    ngoLandmark2:       "लैंडमार्क 2 (वैकल्पिक)",
    ngoAddress:         "पूरा पता *",
    ngoMobilePlaceholder:"मोबाइल नंबर (10 अंक) *",
    ngoEmailPlaceholder:"ईमेल (वैकल्पिक)",
    ngoHeadPlaceholder: "प्रमुख / नेता का नाम *",
    ngoPassPlaceholder: "पासवर्ड *",
    ngoCpassPlaceholder:"पासवर्ड की पुष्टि करें *",
    ngoPassHint:        "न्यूनतम 8 वर्ण — बड़े अक्षर, छोटे अक्षर, संख्या और विशेष वर्ण",
    ngoRegBtn:          "✅ NGO पंजीकरण करें",
    ngoLoginTitle:      "NGO / स्वयंसेवक लॉगिन",
    ngoIdPlaceholder:   "NGO ID (जैसे NGO12345)",
    ngoLoginPassPlaceholder:"पासवर्ड",
    ngoLoginSubmitBtn:  "🔐 लॉगिन",
    ngoForgotLink:      "पासवर्ड भूल गए?",
    ngoStatusTitle:     "NGO स्थिति जांचें",
    ngoStatusIdPlaceholder:"NGO ID दर्ज करें",
    ngoStatusCheckBtn:  "स्थिति जांचें",
    ngoDashWelcome:     "स्वागत है,",
    ngoOrdersBtn:       "📦 एडमिन के आदेश",
    ngoMarkCompleted:   "✅ पूर्ण चिह्नित करें",
    ngoCompleted:       "✅ पूर्ण",
    ngoNoOrders:        "अभी तक कोई सहायता आदेश नहीं।",
    ngoLogoutBtn:       "लॉगआउट",
    ngoWorkTitle:       "कार्य अपडेट करें",
    ngoWorkNotePlaceholder:"कार्य विवरण दर्ज करें",
    ngoWorkSubmitBtn:   "जमा करें",
    ngoWorkCancelBtn:   "रद्द करें",
    ngoBackBtn:         "← वापस",

    firstAidTitle:      "🩹 प्राथमिक चिकित्सा गाइड",
    firstAidH2:         "आपातकालीन प्राथमिक चिकित्सा — त्वरित संदर्भ",
    firstAidSub:        "ऑफलाइन काम करता है। किसी भी गाइड पर टैप करें।",
    firstAidSearch:     "🔍 खोजें: बाढ़, सांप, CPR, जलन, फ्रैक्चर...",
    firstAidNoResult:   "कोई गाइड नहीं मिला। दूसरा कीवर्ड आज़माएं।",

    fa_flood_title:     "बाढ़ सुरक्षा",
    fa_flood_s1:        "तुरंत ऊंचे स्थान पर जाएं — इंतजार न करें।",
    fa_flood_s2:        "बहते पानी में न चलें। 15 सेमी पानी आपको गिरा सकता है।",
    fa_flood_s3:        "मुख्य स्विच बंद करें। बिजली के उपकरण न छुएं।",
    fa_flood_s4:        "तेज बहाव वाले पानी पर बने पुलों से बचें।",
    fa_flood_s5:        "घर में फंसे हों तो छत पर जाएं और मदद के लिए संकेत दें।",
    fa_flood_s6:        "बाढ़ के बाद केवल उबला या बोतलबंद पानी पिएं।",
    fa_flood_warn:      "बाढ़ के पानी में न जाएं — यह दूषित या बिजली से चार्ज हो सकता है।",
    fa_earthquake_title:"भूकंप प्रतिक्रिया",
    fa_earthquake_s1:   "तुरंत हाथों और घुटनों पर झुकें।",
    fa_earthquake_s2:   "मजबूत टेबल के नीचे या अंदरूनी दीवार के पास आश्रय लें।",
    fa_earthquake_s3:   "कंपन रुकने तक पकड़े रहें।",
    fa_earthquake_s4:   "कंपन के दौरान बाहर न दौड़ें — गिरते मलबे से सबसे अधिक खतरा है।",
    fa_earthquake_s5:   "कंपन रुकने के बाद चोटों की जांच करें और सावधानी से बाहर निकलें।",
    fa_earthquake_s6:   "आफ्टरशॉक की उम्मीद करें। क्षतिग्रस्त इमारतों से दूर रहें।",
    fa_earthquake_warn: "भूकंप के बाद लिफ्ट का उपयोग न करें। बत्ती जलाने से पहले गैस रिसाव जांचें।",
    fa_cyclone_title:   "चक्रवात सुरक्षा",
    fa_cyclone_s1:      "अधिकारियों द्वारा निर्देश मिलते ही तुरंत निकलें।",
    fa_cyclone_s2:      "सभी खिड़कियां और दरवाजे अच्छी तरह बंद करें।",
    fa_cyclone_s3:      "तूफान के दौरान खिड़कियों से दूर घर के अंदर रहें।",
    fa_cyclone_s4:      "सबसे मजबूत कमरे में जाएं — बाथरूम या अंदरूनी कमरा।",
    fa_cyclone_s5:      "बाहर हों तो नाले में लेट जाएं और सिर ढक लें।",
    fa_cyclone_s6:      "चक्रवात के बाद: टूटे बिजली तार, बाढ़ और मलबे से सावधान रहें।",
    fa_cyclone_warn:    "चक्रवात की आंख के दौरान कभी बाहर न निकलें — दूसरा हिस्सा और भी खतरनाक हो सकता है।",
    fa_cpr_title:       "CPR (वयस्क)",
    fa_cpr_s1:          "जांचें कि व्यक्ति सांस ले रहा है। नहीं तो तुरंत 112 पर कॉल करें।",
    fa_cpr_s2:          "छाती के बीच में हाथ की एड़ी रखें।",
    fa_cpr_s3:          "जोर से और तेज दबाएं — कम से कम 5 सेमी गहरा, मिनट में 100-120 बार।",
    fa_cpr_s4:          "दो दबावों के बीच छाती को पूरी तरह उठने दें।",
    fa_cpr_s5:          "प्रशिक्षित हों तो: हर 30 दबाव के बाद 2 बचाव सांसें दें।",
    fa_cpr_s6:          "आपातकालीन मदद आने या व्यक्ति के होश में आने तक जारी रखें।",
    fa_cpr_warn:        "अप्रशिक्षित CPR (केवल हाथ) भी बचने की संभावना दोगुनी करती है। मदद आने तक न रुकें।",
    fa_snakebite_title: "सांप काटना",
    fa_snakebite_s1:    "व्यक्ति को शांत और स्थिर रखें। हिलने से जहर तेजी से फैलता है।",
    fa_snakebite_s2:    "काटने वाली जगह के पास घड़ी, अंगूठी या तंग चीजें हटाएं।",
    fa_snakebite_s3:    "काटे गए अंग को दिल के स्तर से नीचे रखें।",
    fa_snakebite_s4:    "घाव न काटें, जहर न चूसें और बर्फ न लगाएं।",
    fa_snakebite_s5:    "सांप की पहचान नोट करें (उसका पीछा न करें)।",
    fa_snakebite_s6:    "तुरंत अस्पताल जाएं — एंटीवेनम ही एकमात्र उपचार है।",
    fa_snakebite_warn:  "90% भारतीय सांप के काटने का इलाज एंटीवेनम से होता है। 4 घंटे के भीतर अस्पताल पहुंचें।",
    fa_burns_title:     "जलना",
    fa_burns_s1:        "जले हिस्से को 20 मिनट ठंडे (बर्फीले नहीं) बहते पानी से ठंडा करें।",
    fa_burns_s2:        "बर्फ, मक्खन, टूथपेस्ट या तेल का उपयोग न करें।",
    fa_burns_s3:        "जले के पास कपड़े और गहने हटाएं — जब तक त्वचा से न चिपके हों।",
    fa_burns_s4:        "साफ मुलायम कपड़े से ढीला ढकें।",
    fa_burns_s5:        "छाले न फोड़ें — संक्रमण का खतरा है।",
    fa_burns_s6:        "बड़े या गहरे जलने पर — तुरंत 102 (एम्बुलेंस) बुलाएं।",
    fa_burns_warn:      "रासायनिक जलन — 20+ मिनट खूब पानी से धोएं। दूषित कपड़े सावधानी से हटाएं।",
    fa_fracture_title:  "फ्रैक्चर / हड्डी टूटना",
    fa_fracture_s1:     "अंग को सीधा करने की कोशिश न करें।",
    fa_fracture_s2:     "पट्टी या लपेटे अखबार से टूटे हिस्से को स्थिर करें।",
    fa_fracture_s3:     "टूटने के ऊपर और नीचे बांधें — सीधे उस पर नहीं।",
    fa_fracture_s4:     "सूजन कम करने के लिए संभव हो तो ऊंचा रखें।",
    fa_fracture_s5:     "कपड़े में लपेटा बर्फ 20 मिनट के लिए लगाएं।",
    fa_fracture_s6:     "खुला फ्रैक्चर (हड्डी दिखे): साफ कपड़े से ढकें और तुरंत अस्पताल जाएं।",
    fa_fracture_warn:   "संदिग्ध गर्दन या रीढ़ की हड्डी की चोट वाले व्यक्ति को तत्काल खतरा न हो तो न हिलाएं।",
    fa_dehydration_title:"आपदा में निर्जलीकरण",
    fa_dehydration_s1:  "हर कुछ मिनट में साफ पानी के छोटे घूंट दें।",
    fa_dehydration_s2:  "उपलब्ध हो तो ORS (ओरल रिहाइड्रेशन साल्ट) दें — 1 लीटर पानी में 1 पैकेट।",
    fa_dehydration_s3:  "घर का ORS: 1 लीटर पानी + 6 चम्मच चीनी + आधा चम्मच नमक।",
    fa_dehydration_s4:  "छाए में रखें और गीले कपड़े से ठंडा करें।",
    fa_dehydration_s5:  "बच्चों के लिए — स्तनपान जारी रखें।",
    fa_dehydration_s6:  "व्यक्ति बेहोश हो तो मुंह से पानी न दें। 102 पर कॉल करें।",
    fa_dehydration_warn:"बाढ़ के बाद दूषित पानी बाढ़ से ज्यादा मौतें करता है। हमेशा पानी उबाल कर पिएं।",
    fa_choking_title:   "गला फंसना",
    fa_choking_s1:      "'क्या आपका गला फंसा है?' पूछें — बोल न सकें तो तुरंत कार्रवाई करें।",
    fa_choking_s2:      "कंधे के ब्लेड के बीच हाथ की एड़ी से 5 तेज पीठ पर थपकी दें।",
    fa_choking_s3:      "साफ न हो: पीछे खड़े हों, नाभि के ऊपर मुट्ठी बनाएं, 5 पेट थपकी दें (हाइमलिक)।",
    fa_choking_s4:      "5 पीठ थपकी और 5 पेट थपकी बारी-बारी दें।",
    fa_choking_s5:      "व्यक्ति बेहोश हो — CPR शुरू करें।",
    fa_choking_s6:      "शिशु के लिए: उल्टा करके जांघ पर रखें, पीठ पर थपकी दें, पेट थपकी नहीं।",
    fa_choking_warn:    "अंधा उंगली स्वाइप न करें — वस्तु और अंदर जा सकती है।",
    fa_electric_title:  "बिजली का झटका",
    fa_electric_s1:     "व्यक्ति को तब तक न छुएं जब तक वे बिजली के संपर्क में हों।",
    fa_electric_s2:     "पास जाने से पहले मुख्य बोर्ड पर बिजली बंद करें।",
    fa_electric_s3:     "बंद न कर सकें — सूखी लकड़ी की छड़ी या रस्सी से दूर करें।",
    fa_electric_s4:     "तुरंत 112 पर कॉल करें।",
    fa_electric_s5:     "सांस जांचें। न सांस ले तो CPR शुरू करें।",
    fa_electric_s6:     "जलन को ठंडे बहते पानी से उपचार करें।",
    fa_electric_warn:   "बिजली के झटके के पीड़ित के पास धातु की वस्तुएं न लाएं। पहले बिजली काटें।",
    safeZonesTitle:     "🛟 आपके पास सुरक्षित क्षेत्र",
    safeZonesH2:        "आपातकालीन आश्रय, अस्पताल और पुलिस",
    safeZonesSub:       "5 किमी के भीतर अस्पताल, पुलिस और दमकल स्टेशन दिखाता है।",
    safeZonesAllow:     "📍 लोकेशन अनुमति दें और नक्शा देखें",
    safeZonesPermH3:    "सुरक्षित क्षेत्र देखने के लिए लोकेशन अनुमति दें",
    safeZonesLoading:   "⏳ आपके पास सुरक्षित क्षेत्र लोड हो रहे हैं...",
    weatherTitle:       "लाइव मौसम मॉनिटर",
    contactTitle:       "संपर्क करें",
    adminNoteTitle:     "✅ रिपोर्ट हल करें",
    adminNoteSubtitle:  "नागरिक के लिए एक नोट लिखें।",
    adminNotePlaceholder:"यहाँ अपना नोट दर्ज करें...",
    adminNoteConfirm:   "पुष्टि करें",
    adminNoteCancel:    "रद्द करें",
  },

  // ── ODIA ─────────────────────────────────────────────────────
  or: {
    appName:            "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ବ୍ୟବସ୍ଥା",
    appTagline:         "ଜରୁରୀ ପରିସ୍ଥିତିରେ ସୁରକ୍ଷିତ ଏବଂ ସୂଚିତ ରୁହନ୍ତୁ।",
    countryCode:        "+91",
    back:               "← ଫେରନ୍ତୁ",
    backToDashboard:    "← ଡ୍ୟାଶବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    cancel:             "ବାତିଲ",
    close:              "ବନ୍ଦ",
    save:               "💾 ସଞ୍ଚୟ",
    submit:             "ଦାଖଲ",
    loading:            "ଲୋଡ ହେଉଛି…",
    adminSosSubtitle: "ଜରୁରୀ SOS ଆଲର୍ଟ ଦେଇଥିବା ବ୍ୟବହାରକାରୀଙ୍କ GPS ଅବସ୍ଥାନ ଟ୍ରାକ୍ କରନ୍ତୁ",
    adminSos: "🚨 ଜରୁରୀ ସତର୍କତା ପରିଚାଳନା",
    fileComplaintSubtitle: "ନାଗରିକମାନେ ଦାଖଲ କରିଥିବା ଅଭିଯୋଗଗୁଡିକୁ ସମୀକ୍ଷା କରି ଉତ୍ତର ଦିଅନ୍ତୁ।",
    damageAdminSubtitle: "ନାଗରିକମାନେ ଦାଖଲ କରିଥିବା ଫଟୋ-ସତ୍ୟାପିତ କ୍ଷତି ରିପୋର୍ଟଗୁଡିକୁ ଦେଖନ୍ତୁ।",
    userRegErrEmail: "ଦୟାକରି ଏକ ସଠିକ୍ ଇମେଲ୍ ଦିଅନ୍ତୁ",
    logout:             "⎋ ଲଗଆଉଟ",
    confirm:            "ନିଶ୍ଚିତ",
    send:               "ପଠାନ୍ତୁ",
    update:             "ଅଦ୍ୟତନ",
    logoutConfirm:      "ଆପଣ ଲଗଆଉଟ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
    offlineBanner:      "📴 ଆପଣ ଅଫଲାଇନ — ଜରୁରୀ କଲ ଏବଂ ପ୍ରାଥମିକ ଚିକିତ୍ସା ଏବେ ମଧ୍ୟ କାର୍ଯ୍ୟ କରୁଅଛି",

    langLabel:          "🌐 ଭାଷା",
    langEn:             "English",
    langHi:             "हिन्दी",
    langOr:             "ଓଡ଼ିଆ",
    langBn:             "বাংলা",
    langMore:           "ଆହୁରି ଭାଷା ଶୀଘ୍ର ଆସୁଛି…",

    welcomeTitle:       "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ବ୍ୟବସ୍ଥାକୁ ସ୍ୱାଗତ",
    selectRole:         "ଜାରି ରଖିବାକୁ ଆପଣଙ୍କ ଭୂମିକା ଚୟନ କରନ୍ତୁ",
    emergencyNums:      "📞 ଜରୁରୀ ନମ୍ବର — ସିଧା ଫୋନ (ଇଣ୍ଟର୍ନେଟ ବିନା)",
    numEmergency:       "ଜରୁରୀ",
    numPolice:          "ପୋଲିସ",
    numAmbulance:       "ଆମ୍ବୁଲାନ୍ସ",
    numFire:            "ଅଗ୍ନିଶମ",
    userLogin:          "👤 ଉପଯୋଗକର୍ତ୍ତା ଲଗଇନ",
    adminLogin:         "🛡️ ପ୍ରଶାସକ ଲଗଇନ",
    ngoLogin:           "🤝 NGO ଲଗଇନ / ପଞ୍ଜୀକରଣ",
    welcomeMsg:         "ସ୍ୱାଗତ! 👋",
    staySafe:           "ଜରୁରୀ ପରିସ୍ଥିତିରେ ସୁରକ୍ଷିତ ଏବଂ ସୂଚିତ ରୁହନ୍ତୁ।",

    sidebarTitle:       "🌐 ବିପର୍ଯ୍ୟୟ ଆପ",
    sidebarCitizen:     "ନାଗରିକ",
    sidebarHome:        "🏠 ହୋମ",
    sidebarLiveInfo:    "🗺️ ଲାଇଭ ତଥ୍ୟ",
    sidebarWeather:     "🌤️ ଲାଇଭ ପାଣିପାଗ",
    sidebarNgo:         "🤝 NGO ଏବଂ ସ୍ୱୟଂସେବୀ",
    sidebarSafeZones:   "🛟 ସୁରକ୍ଷିତ ଅଞ୍ଚଳ",
    sidebarFirstAid:    "🩹 ପ୍ରାଥମିକ ଚିକିତ୍ସା",
    sidebarContact:     "✉️ ଯୋଗାଯୋଗ",
    sidebarComplaint:   "📋 ଅଭିଯୋଗ ଦାଖଲ",
    sidebarTrack:       "🔍 ସ୍ଥିତି ଟ୍ରାକ",
    sidebarDamage:      "🏚️ କ୍ଷତି ରିପୋର୍ଟ",
    sidebarTrackRpt:    "📊 ମୋ ରିପୋର୍ଟ ଟ୍ରାକ",
    sidebarTheme:       "🌙 ଥିମ ବଦଳାନ୍ତୁ",
    dashTitle:          "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା",
    copyright:          "© 2026 ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ବ୍ୟବସ୍ଥା | କଲେଜ ପ୍ରକଳ୍ପ",



    userLoginBadge:     "👤 ନାଗରିକ / ଉପଯୋଗକର୍ତ୍ତା",
userLoginTitle:     "ଉପଯୋଗକର୍ତ୍ତା ଲଗଇନ୍",
userLoginSubtitle:  "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରଣାଳୀକୁ ପ୍ରବେଶ ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
userLoginEmailPlaceholder: "ଇମେଲ୍ କିମ୍ବା ମୋବାଇଲ୍ ନମ୍ବର",
userLoginPassPlaceholder:  "ପାସୱାର୍ଡ",
userLoginHint:      "ନିବନ୍ଧନ ସମୟରେ ସୃଷ୍ଟି କରିଥିବା ପାସୱାର୍ଡ ବ୍ୟବହାର କରନ୍ତୁ",
userLoginBtn:       "ଲଗଇନ୍",
userLoginNewHere:   "ନୂତନ ଉପଯୋଗକର୍ତ୍ତା?",
userLoginRegister:  "ଏଠାରେ ନିବନ୍ଧନ କରନ୍ତୁ",
userLoginForgot:    "ପାସୱାର୍ଡ ଭୁଲିଗଲେ?",
userLoginAdmin:     "ଆପଣ ଆଡମିନ୍ କି?",
userLoginAdminLink: "ଆଡମିନ୍ ଲଗଇନ୍ →",



userRegBadge: "👤 ନୂତନ ଉପଯୋଗକର୍ତ୍ତା ନିବନ୍ଧନ",
userRegTitle: "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",
userRegSubtitle: "ବିପର୍ଯ୍ୟୟ ସଚେତନତା, SOS ଏବଂ ଜରୁରୀ ସେବା ପାଇଁ ନିବନ୍ଧନ କରନ୍ତୁ",
userRegNamePlaceholder: "ପୂର୍ଣ୍ଣ ନାମ *",
userRegEmailPlaceholder: "ଇମେଲ୍ ଠିକଣା (ଇଚ୍ଛାନୁସାରେ)",
userRegMobilePlaceholder: "ମୋବାଇଲ୍ ନମ୍ବର (10 ଅଙ୍କ) *",
userRegPassPlaceholder: "ପାସୱାର୍ଡ *",
userRegPassHint: "କମରେ କମ 8 ଅକ୍ଷର — ବଡ଼, ଛୋଟ, ସଂଖ୍ୟା ଏବଂ ବିଶେଷ ଚିହ୍ନ ଥାଇବା ଦରକାର",
userRegCpassPlaceholder: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ *",
userRegBtn: "✅ ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",
userRegHaveAccount: "ଆଗରୁ ଖାତା ଅଛି କି?",
userRegLoginLink: "ଏଠାରେ ଲଗଇନ୍ କରନ୍ତୁ",



adminLoginBadge: "🛡️ ଆଡମିନ୍ ଆକ୍ସେସ୍",
adminLoginTitle: "ଆଡମିନ୍ ଲଗଇନ୍",
adminLoginSubtitle: "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରଣାଳୀ — କଣ୍ଟ୍ରୋଲ୍ ପ୍ୟାନେଲ୍",
adminLoginInfo: "🔐 ଆଡମିନ୍ ଖାତା ସିଷ୍ଟମ୍ ଆଡମିନ୍ ଦ୍ୱାରା ସୃଷ୍ଟି କରାଯାଏ",
adminLoginInfoADM: "ଆପଣଙ୍କ Admin ID (ADM ରୁ ଆରମ୍ଭ) ଏବଂ ପାସୱାର୍ଡ ସହିତ ଲଗଇନ୍ କରନ୍ତୁ",
adminIdPlaceholder: "ଆଡମିନ୍ ID (ଉଦାହରଣ: ADM12345)",
adminPassPlaceholder: "ପାସୱାର୍ଡ",
adminLoginHint: "ଆପଣଙ୍କ Admin ID ADM ରୁ ଆରମ୍ଭ ହୁଏ",
adminLoginBtn: "🔐 ଆଡମିନ୍ ଭାବେ ଲଗଇନ୍",
adminLoginCitizen: "ଆପଣ ଉପଯୋଗକର୍ତ୍ତା କି?",
adminLoginUserLink: "← ଉପଯୋଗକର୍ତ୍ତା ଲଗଇନ୍",
adminLoginNewAdmin: "ନୂତନ ଆଡମିନ୍?",
adminLoginRegLink: "ଆଡମିନ୍ ଅନୁମତି ଅନୁରୋଧ →",
adminLoginNgoBox: "ଆପଣ NGO କି?",
adminLoginNgoLink: "NGO ଲଗଇନ୍ / ନିବନ୍ଧନ →",



adminRegTitle: "ଆଡମିନ୍ ଖାତା ସେଟଅପ୍",
adminRegSubtitle: "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରଣାଳୀ ପାଇଁ ନୂତନ ଆଡମିନ୍ ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",

adminRegNamePlaceholder: "ପୂର୍ଣ୍ଣ ନାମ *",
adminRegEmailPlaceholder: "ଇମେଲ୍ ଠିକଣା *",
adminRegMobilePlaceholder: "ମୋବାଇଲ୍ ନମ୍ବର (10 ଅଙ୍କ) *",

adminRegPassPlaceholder: "ପାସୱାର୍ଡ *",
adminRegPassHint: "କମରେ କମ 8 ଅକ୍ଷର — ବଡ଼, ଛୋଟ, ସଂଖ୍ୟା ଏବଂ ବିଶେଷ ଚିହ୍ନ ଦରକାର",
adminRegCpassPlaceholder: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ *",

adminSecretKeyLabel: "ଆଡମିନ୍ ସିକ୍ରେଟ୍ କି *",
adminSecretKeyInfo: "ଆଡମିନ୍ ଖାତା ସୃଷ୍ଟି ପାଇଁ ସିକ୍ରେଟ୍ କି ଦରକାର",
adminRegBtn: "🔐 ଆଡମିନ୍ ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",


chatbotTitle: "🤖 ବିପର୍ଯ୍ୟୟ ସହାୟକ",
chatbotWelcome: "ନମସ୍କାର 👋 ବିପର୍ଯ୍ୟୟ ସହାୟକକୁ ସ୍ୱାଗତ!",
chatbotSos: "🚨 SOS ସହାୟତା",
chatbotComplaint: "📄 ଅଭିଯୋଗ କରନ୍ତୁ",
chatbotContacts: "📞 ସମ୍ପର୍କ ସହାୟତା",
chatbotPassword: "🔐 ପାସୱାର୍ଡ ସହାୟତା",
chatbotPlaceholder: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ...",
chatbotSend: "ପଠାନ୍ତୁ",


mapTitle: "🌍 ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରଣାଳୀ",
locationTitle: "📍 ଅବସ୍ଥାନ ଅନୁମତି ଦିଅନ୍ତୁ",
locationSubtitle: "ନିକଟସ୍ଥ ବିପଦ ସୂଚନା ଏବଂ ପାଣିପାଗ ଦେଖାଇବା ପାଇଁ ଆପଣଙ୍କ ଅବସ୍ଥାନ ଆବଶ୍ୟକ",
locationBtn: "ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ",
locationDenied: "ଅବସ୍ଥାନ ଅନୁମତି ନାହିଁ। ବ୍ରାଉଜର ସେଟିଂରେ ଅନୁମତି ଦିଅନ୍ତୁ",





alertTitle: "📡 ସଜୀବ ସତର୍କତା ସ୍ଥିତି",

alertRain: "ବର୍ଷା ସତର୍କତା",
alertEarthquake: "ଭୂକମ୍ପ ଝୁମ୍ପ",
alertThunder: "ବଜ୍ରପାତ",
alertFlood: "ବନ୍ୟା",
alertHeat: "ତାପମାତ୍ରା",
alertWind: "ବାତାସ",
alertCyclone: "ଘୂର୍ଣ୍ଣିବାତ୍ୟା",

alertAllClear: "ସବୁ ସାଧାରଣ",
alertNoEarthquake: "ଭୂକମ୍ପ ନାହିଁ",


weatherTitle: "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପାଣିପାଗ",
weatherAlerts: "ବିପଦ ସତର୍କତା",
weatherAllClear: "ସବୁ ସାଧାରଣ: ପାଣିପାଗ ସ୍ଥିର ଅଛି",

weatherHumidity: "ଆର୍ଦ୍ରତା",
weatherWind: "ବାତାସ ଗତି",
weatherPressure: "ଚାପ",



safeZoneTitle: "ନିକଟସ୍ଥ ସୁରକ୍ଷିତ ସ୍ଥାନ, ହସ୍ପିଟାଲ୍ ଏବଂ ପୋଲିସ",
safeZoneSubtitle: "5 କିମି ମଧ୍ୟରେ ହସ୍ପିଟାଲ୍, ପୋଲିସ ଏବଂ ଅଗ୍ନିଶମ ସେବା ଦେଖାଯାଉଛି",

youAreHere: "📍 ଆପଣ ଏଠାରେ ଅଛନ୍ତି",
safeZonesFound: "ନିକଟରେ {count}ଟି ସୁରକ୍ଷିତ ସ୍ଥାନ ମିଳିଲା",

openInMaps: "Google Maps ରେ ଖୋଲନ୍ତୁ",



    sendSos:            "SOS ପଠାନ୍ତୁ",
    damageReport:       "କ୍ଷତି ରିପୋର୍ଟ",
    fileComplaint:      "ଅଭିଯୋଗ ଦାଖଲ",
    trackReport:        "ରିପୋର୍ଟ ଟ୍ରାକ",
    safeZones:          "ସୁରକ୍ଷିତ ଅଞ୍ଚଳ",
    firstAid:           "ପ୍ରଥମ ଚିକିତ୍ସା",

    emergencyContacts:  "📞 ଜରୁରୀ ଯୋଗାଯୋଗ",
    addContact:         "+ ଯୋଡ଼ନ୍ତୁ",
    viewAll:            "ସବୁ ଦେଖନ୍ତୁ",
    contactName:        "ଯୋଗାଯୋଗ ନାମ",
    phoneNumber:        "ଫୋନ ନମ୍ବର",
    allContacts:        "📋 ସମସ୍ତ ଜରୁରୀ ଯୋଗାଯୋଗ",
    contactSaved:       "📞 ଯୋଗାଯୋଗ ସଞ୍ଚୟ ହୋଇଛି!",
    contactDeleted:     "🗑️ ଯୋଗାଯୋଗ ସଫଳତାର ସହ ହଟାଯାଇଛି!",
    contactDeleteConfirm:"ଆପଣ ଏହି ଯୋଗାଯୋଗ ଡିଲିଟ କରିବାକୁ ଚାହୁଁଛନ୍ତି?",
    contactFillBoth:    "ଦୟାକରି ଉଭୟ କ୍ଷେତ୍ର ପୂରଣ କରନ୍ତୁ।",

    sosSendTitle:       "🆘 SOS ପଠାନ୍ତୁ — ଯୋଗାଯୋଗ ଚୟନ",
    sosSubtitle:        "ଆପଣଙ୍କ ଜରୁରୀ ଚେତାବନୀ କାହାକୁ ପଠାଇବେ ଚୟନ କରନ୍ତୁ",
    sosGettingGps:      "📡 ଆପଣଙ୍କ ଅବସ୍ଥାନ ଗ୍ରହଣ ହେଉଛି...",
    sosGpsReady:        "✅ GPS ପ୍ରସ୍ତୁତ:",
    sosGpsUnavail:      "⚠️ GPS ଉପଲବ୍ଧ ନୁହେଁ — SOS ଅବସ୍ଥାନ ବିନା ପଠାଯିବ",
    sosGpsNotSupported: "⚠️ ଏହି ଡିଭାଇସ୍ ରେ GPS ସମର୍ଥିତ ନୁହେଁ",
    sosSelectAll:       "ସମସ୍ତ ଯୋଗାଯୋଗ ଚୟନ",
    sosEmergSvc:        "ଜରୁରୀ ସେବା",
    sosSavedContacts:   "ଆପଣଙ୍କ ସଞ୍ଚୟ ଯୋଗାଯୋଗ",
    sosNoContacts:      "ଏ ପର୍ଯ୍ୟନ୍ତ କୌଣସି ବ୍ୟକ୍ତିଗତ ଯୋଗାଯୋଗ ସଞ୍ଚୟ ହୋଇନାହିଁ। ଡ୍ୟାଶବୋର୍ଡରୁ ଯୋଡ଼ନ୍ତୁ।",
    sosAppAdmin:        "ଆପ ଏଡ୍ ମିନ",
    sosSendNow:         "🆘 ଏଠାରେ SOS ପଠାନ୍ତୁ",
    sosSent:            "🆘 SOS ପଠାଗଲା!",
    sosSentMsg:         "ବାର୍ତ୍ତା ପଠାଯାଇଛି। ସବୁଠୁ ଦ୍ରୁତ ପ୍ରତିକ୍ରିୟା ପାଇଁ ସିଧା ଫୋନ ମଧ୍ୟ କରନ୍ତୁ:",
    sosConfirm:         "⚠️ ଜରୁରୀ SOS\n\nଏହା SMS ମାଧ୍ୟମରେ ଚୟନ ଯୋଗାଯୋଗଙ୍କୁ ଅବସ୍ଥାନ ପଠାଇବ।\nଅପବ୍ୟବହାର ଦଣ୍ଡନୀୟ।\n\nଜାରି ରଖିବେ?",
    sosSelectAtLeastOne:"ଅନ୍ତତ ଗୋଟିଏ ଯୋଗାଯୋଗ ଚୟନ କରନ୍ତୁ।",
    sosBtnLabel:        "🆘 ଜରୁରୀ SOS — ଲଗଇନ ବିନା",

    complaintTitle:     "ଅଭିଯୋଗ ଦାଖଲ",
    complaintPlaceholder:"ଆପଣଙ୍କ ଅଭିଯୋଗ ବର୍ଣ୍ଣନା କରନ୍ତୁ...",
    complaintSubmit:    "ଦାଖଲ",
    complaintEmpty:     "ଦୟାକରି ଆପଣଙ୍କ ଅଭିଯୋଗ ବର୍ଣ୍ଣନା କରନ୍ତୁ!",
    complaintLoginFirst:"ପ୍ରଥମେ ଲଗଇନ କରନ୍ତୁ",
    complaintSuccess:   "✅ ଅଭିଯୋଗ ସଫଳତାର ସହ ଦାଖଲ ହୋଇଛି!",
    complaintId:        "ଆପଣଙ୍କ ID:",
    complaintSaveId:    "ଅଭିଯୋଗ ଟ୍ରାକ ପାଇଁ ଏହି ID ସଞ୍ଚୟ କରନ୍ତୁ।",
    complaintFailed:    "❌ ଅଭିଯୋଗ ଦାଖଲ ବିଫଳ:",

    trackComplaintTitle:"ଅଭିଯୋଗ ସ୍ଥିତି ଟ୍ରାକ",
    trackPlaceholder:   "ଅଭିଯୋଗ ID ଦିଅନ୍ତୁ",
    trackCheck:         "ସ୍ଥିତି ଯାଞ୍ଚ",
    trackEmpty:         "ଦୟାକରି ଅଭିଯୋଗ ID ଦିଅନ୍ତୁ!",
    trackNotFound:      "❌ ଅଭିଯୋଗ ID ମିଳିଲା ନାହିଁ!",

    damageTitle:        "🏚️ କ୍ଷତି ରିପୋର୍ଟ ଦାଖଲ",
    damageSubtitle:     "ବିପର୍ଯ୍ୟୟ ପରେ କ୍ଷତି ରିପୋର୍ଟ କରନ୍ତୁ। ପ୍ରଶାସକ ସମୀକ୍ଷା କରିବେ।",
    damageNamePlaceholder:"ଆପଣଙ୍କ ପୂର୍ଣ ନାଁ *",
    damageAddressPlaceholder:"ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ ଠିକଣା *",
    damageTypeFlood:    "🌊 ବନ୍ୟା",
    damageTypeCyclone:  "🌀 ଘୂର୍ଣ୍ଣିବାତ୍ୟା",
    damageTypeEarthquake:"🌍 ଭୂକମ୍ପ",
    damageTypeFire:     "🔥 ଅଗ୍ନି",
    damageTypeLandslide:"⛰️ ଭୂସ୍ଖଳନ",
    damageTypeOther:    "📍 ଅନ୍ୟ",
    damageDescPlaceholder:"କ୍ଷତି ସ୍ଥିତି ବର୍ଣ୍ଣନା *",
    damagePhotoLabel:   "📷 କ୍ଷତି ଫୋଟୋ ଅପଲୋଡ",
    damageSubmitBtn:    "🏚️ ରିପୋର୍ଟ ଦାଖଲ",
    damageFillRequired: "⚠️ ଦୟାକରି ନାଁ, ଠିକଣା ଏବଂ ବର୍ଣ୍ଣନା ପୂରଣ କରନ୍ତୁ।",
    damageSubmitting:   "ଦାଖଲ ହେଉଛି...",
    damageSuccess:      "✅ ରିପୋର୍ଟ ଦାଖଲ! ID:",
    damageFailed:       "❌",
    damageNetworkError: "❌ ନେଟ୍ ୱର୍କ ତ୍ରୁଟି। ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ।",

    trackDamageTitle:   "🔍 ମୋ କ୍ଷତି ରିପୋର୍ଟ ଟ୍ରାକ",
    trackDamageSubtitle:"ସ୍ଥିତି ଦେଖିବାକୁ ରିପୋର୍ଟ ID ଦିଅନ୍ତୁ।",
    trackDamagePlaceholder:"ରିପୋର୍ଟ ID ଦିଅନ୍ତୁ (ଯଥା RPT1234567890)",
    trackDamageBtn:     "🔍 ସ୍ଥିତି ଯାଞ୍ଚ",
    trackDamageEmpty:   "⚠️ ଦୟାକରି ଆପଣଙ୍କ ରିପୋର୍ଟ ID ଦିଅନ୍ତୁ।",
    trackDamageClose:   "ବନ୍ଦ",
    trackRptId:         "ରିପୋର୍ଟ ID:",
    trackRptName:       "ନାଁ:",
    trackRptType:       "ବିପର୍ଯ୍ୟୟ ପ୍ରକାର:",
    trackRptDate:       "ଦାଖଲ ଦିନ:",
    adminNote:          "📝 ପ୍ରଶାସକ ନୋଟ:",

    statusSubmitted:    "📋 ଦାଖଲ — ପ୍ରଶାସକ ଶୀଘ୍ର ସମୀକ୍ଷା କରିବେ",
    statusReviewed:     "🔍 ସମୀକ୍ଷିତ — ପ୍ରଶାସକ ପଦକ୍ଷେପ ନେଉଛନ୍ତି",
    statusResolved:     "✅ ସମାଧାନ — ସମସ୍ୟା ଦୂର ହୋଇଛି",
    statusRejected:     "❌ ପ୍ରତ୍ୟାଖ୍ୟାନ — ନୋଟ ଦେଖନ୍ତୁ",

    forgotTitle:        "ପାସୱାର୍ଡ ରିସେଟ",
    forgotMobilePlaceholder:"ମୋବାଇଲ ନମ୍ବର ଦିଅନ୍ତୁ",
    forgotOtpPlaceholder:   "OTP ଦିଅନ୍ତୁ",
    forgotNewPassPlaceholder:"ନୂତନ ପାସୱାର୍ଡ",
    forgotSendOtp:      "OTP ପଠାନ୍ତୁ",
    forgotVerifyOtp:    "OTP ଯାଞ୍ଚ",
    forgotResetPass:    "ପାସୱାର୍ଡ ରିସେଟ",
    forgotCancel:       "ବାତିଲ",
    forgotSuccess:      "✅ ପାସୱାର୍ଡ ସଫଳତାର ସହ ରିସେଟ! ଦୟାକରି ଲଗଇନ କରନ୍ତୁ।",

    chatbotTitle:       "🤖 ବିପର୍ଯ୍ୟୟ ସହାୟକ",
    chatbotPlaceholder: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଟାଇପ କରନ୍ତୁ...",
    chatbotSend:        "ପଠାନ୍ତୁ",
    chatbotWelcome:     "ନମସ୍କାର 👋 ବିପର୍ଯ୍ୟୟ ସହାୟକକୁ ସ୍ୱାଗତ!",
    chatbotSosHelp:     "🚨 SOS ସହାୟତା",
    chatbotComplaint:   "📋 ଅଭିଯୋଗ ଦାଖଲ",
    chatbotContacts:    "📞 ଯୋଗାଯୋଗ ସହାୟତା",
    chatbotPassword:    "🔐 ପାସୱାର୍ଡ ସହାୟତା",
    chatbotDidntUnderstand:"ଦୁଃଖିତ 😔 ବୁଝିଲି ନାହିଁ। ବିକଳ୍ପ ଚୟନ କରନ୍ତୁ।",

    ngoPortalTitle:     "🤝 NGO ଏବଂ ସ୍ୱୟଂସେବୀ ପୋର୍ଟାଲ",
    ngoPortalSubtitle:  "ବିପର୍ଯ୍ୟୟ ରାହତ ସହ NGO ସଂଯୋଗ",
    ngoLoginBtn:        "🔐 ଲଗଇନ",
    ngoRegisterBtn:     "📝 ପଞ୍ଜୀକରଣ",
    ngoCheckStatusBtn:  "🔍 ସ୍ଥିତି ଯାଞ୍ଚ",
    ngoRegTitle:        "NGO / ସ୍ୱୟଂସେବୀ ପଞ୍ଜୀକରଣ",
    ngoNamePlaceholder: "NGO / ସଂଗଠନ ନାଁ *",
    ngoTypeSelect:      "NGO ପ୍ରକାର ଚୟନ *",
    ngoStateSelect:     "ରାଜ୍ୟ ଚୟନ",
    ngoDistrictSelect:  "ଜିଲ୍ଲା ଚୟନ",
    ngoVolunteersSelect:"କେତେ ସ୍ୱୟଂସେବୀ? *",
    ngoLandmark1:       "ଲ୍ୟାଣ୍ଡମାର୍କ 1 (ଆବଶ୍ୟକ) *",
    ngoLandmark2:       "ଲ୍ୟାଣ୍ଡମାର୍କ 2 (ଐଚ୍ଛିକ)",
    ngoAddress:         "ସମ୍ପୂର୍ଣ ଠିକଣା *",
    ngoMobilePlaceholder:"ମୋବାଇଲ ନମ୍ବର (10 ଅଙ୍କ) *",
    ngoEmailPlaceholder:"ଇମେଲ (ଐଚ୍ଛିକ)",
    ngoHeadPlaceholder: "ମୁଖ୍ୟ / ନେତାଙ୍କ ନାଁ *",
    ngoPassPlaceholder: "ପାସୱାର୍ଡ *",
    ngoCpassPlaceholder:"ପାସୱାର୍ଡ ନିଶ୍ଚିତ *",
    ngoPassHint:        "ସର୍ବନିମ୍ନ 8 ଅକ୍ଷର — ବଡ, ଛୋଟ, ଅଙ୍କ ଏବଂ ବିଶେଷ ଅକ୍ଷର",
    ngoRegBtn:          "✅ NGO ପଞ୍ଜୀକରଣ",
    ngoLoginTitle:      "NGO / ସ୍ୱୟଂସେବୀ ଲଗଇନ",
    ngoIdPlaceholder:   "NGO ID (ଯଥା NGO12345)",
    ngoLoginPassPlaceholder:"ପାସୱାର୍ଡ",
    ngoLoginSubmitBtn:  "🔐 ଲଗଇନ",
    ngoForgotLink:      "ପାସୱାର୍ଡ ଭୁଲିଯାଇଛ?",
    ngoStatusTitle:     "NGO ସ୍ଥିତି ଯାଞ୍ଚ",
    ngoStatusIdPlaceholder:"NGO ID ଦିଅନ୍ତୁ",
    ngoStatusCheckBtn:  "ସ୍ଥିତି ଯାଞ୍ଚ",
    ngoDashWelcome:     "ସ୍ୱାଗତ,",
    ngoOrdersBtn:       "📦 ପ୍ରଶାସକ ଆଦେଶ",
    ngoMarkCompleted:   "✅ ସମ୍ପୂର୍ଣ ଚିହ୍ନ",
    ngoCompleted:       "✅ ସମ୍ପୂର୍ଣ",
    ngoNoOrders:        "ଏ ପର୍ଯ୍ୟନ୍ତ କୌଣସି ସହାୟତା ଆଦେଶ ନାହିଁ।",
    ngoLogoutBtn:       "ଲଗଆଉଟ",
    ngoWorkTitle:       "କାର୍ଯ୍ୟ ଅଦ୍ୟତନ",
    ngoWorkNotePlaceholder:"କାର୍ଯ୍ୟ ବିବରଣ ଦିଅନ୍ତୁ",
    ngoWorkSubmitBtn:   "ଦାଖଲ",
    ngoWorkCancelBtn:   "ବାତିଲ",
    ngoBackBtn:         "← ଫେରନ୍ତୁ",
    issueReports: "ସମସ୍ୟା ରିପୋର୍ଟ",
emergencyAlert: "ଜରୁରୀ ସତର୍କତା (SOS)",
liveDisasterUpdates: "ସଜୀବ ବିପଦ ସୂଚନା",
ngoHelp: "NGO ସହଯୋଗ",
adminLiveInfo: "🗺️ ଲାଇଭ ବିପର୍ଯ୍ୟୟ ଅପଡେଟ୍",
    firstAidTitle:      "🩹 ପ୍ରଥମ ଚିକିତ୍ସା ଗାଇଡ",
    safeZonesTitle:     "🛟 ଆପଣଙ୍କ ପାଖ ସୁରକ୍ଷିତ ଅଞ୍ଚଳ",
    weatherTitle:       "ଲାଇଭ ପାଣିପାଗ ମନିଟର",
    contactTitle:       "ଯୋଗାଯୋଗ",
    adminNoteTitle:     "✅ ରିପୋର୍ଟ ସମାଧାନ",
    adminNoteSubtitle:  "ନାଗରିକ ପାଇଁ ନୋଟ ଲେଖନ୍ତୁ।",
    adminNotePlaceholder:"ଏଠାରେ ଆପଣଙ୍କ ନୋଟ ଦିଅନ୍ତୁ...",
    adminNoteConfirm:   "ନିଶ୍ଚିତ",
    yes:                "ହଁ",
    no:                 "ନା",
    chatbotSosReply:    "🚨 SOS ବଟନ ଦବାନ୍ତୁ।\nଇଣ୍ଟରନେଟ ଅଛି → ଏଡ୍ ମିନ ଆଲର୍ଟ ପାଇବ।\nନାହିଁ → SMS ଆପ ଖୋଲିବ। ଆପଣ ନିଜେ ପଠାନ୍ତୁ।",
    chatbotComplaintReply: "📋 ସାଇଡ ବାରରେ 'ଅଭିଯୋଗ ଦାଖଲ' ଦବାନ୍ତୁ।\nଦାଖଲ ପରେ ଅଭିଯୋଗ ID ସଞ୍ଚୟ କରନ୍ତୁ।",
    chatbotContactsReply: "📞 ଜରୁରୀ ଯୋଗାଯୋଗ ଯୋଡ଼ନ୍ତୁ।\nଡିଫଲ୍ଟ: 100 ପୋଲିସ, 101 ଅଗ୍ନି, 102 ଆମ୍ବୁଲାନ୍ସ।",
    chatbotPasswordReply: "🔐 'ପାସୱାର୍ଡ ଭୁଲିଗଲ?' ଦବାନ୍ତୁ।\nମୋବାଇଲ → OTP → ନୂଆ ପାସୱାର୍ଡ।",
    trackDamageNotFound: "❌",
    trackDamageNetwork: "❌ ନେଟ ୱର୍କ ତ୍ରୁଟି। ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ।",
    firstAidH2:         "ଜରୁରୀ ପ୍ରଥମ ଚିକିତ୍ସା — ତ୍ୱରିତ ସନ୍ଦର୍ଭ",
    firstAidSub:        "ଅଫଲାଇନ କାର୍ଯ୍ୟ କରେ। ଯେ କୌଣସି ଗାଇଡ ଟ୍ୟାପ କରି ଖୋଲନ୍ତୁ। ଚିକିତ୍ସା ସାହାଯ୍ୟ ଆସିବା ଯାଏ ସ୍ଟେପ ଅନୁସରଣ କରନ୍ତୁ।",
    firstAidSearch:     "🔍 ଖୋଜନ୍ତୁ: ବନ୍ୟା, ସାପ, CPR, ଦଗ୍ଧ, ହାଡ ଭଙ୍ଗ...",
    firstAidNoResult:   "କୌଣସି ଗାଇଡ ମିଳିଲା ନାହିଁ। ଅନ୍ୟ ଶବ୍ଦ ଚେଷ୍ଟା କରନ୍ତୁ।",
    fa_flood_title:     "ବନ୍ୟା ସୁରକ୍ଷା",
    fa_flood_s1:        "ତୁରନ୍ତ ଉଚ୍ଚ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ — ଅପେକ୍ଷା କରନ୍ତୁ ନାହିଁ।",
    fa_flood_s2:        "ଗତିଶୀଳ ପାଣି ଦେଇ ଚାଲନ୍ତୁ ନାହିଁ। 15 ସେମି ପାଣି ଆପଣଙ୍କୁ ପ୍ରଭାବିତ କରିପାରେ।",
    fa_flood_s3:        "ମୁଖ୍ୟ ସ୍ୱିଚ ବନ୍ଦ କରନ୍ତୁ। ବୈଦ୍ୟୁତିକ ଯନ୍ତ୍ରପାତି ସ୍ପର୍ଶ କରନ୍ତୁ ନାହିଁ।",
    fa_flood_s4:        "ଦ୍ରୁତ ଗତି ପାଣି ଉପରୁ ଯାଉଥିବା ସେତୁ ଏଡ଼ାନ୍ତୁ।",
    fa_flood_s5:        "ଘରେ ଅଟକି ଗଲେ ଛାଦ ଉପରକୁ ଯାଆନ୍ତୁ ଏବଂ ସାହାଯ୍ୟ ପାଇଁ ସଙ୍କେତ ଦିଅନ୍ତୁ।",
    fa_flood_s6:        "ବନ୍ୟା ପରେ କେବଳ ଫୁଟାଇ ବା ବୋତଲ ପାଣି ପିଅନ୍ତୁ।",
    fa_flood_warn:      "ବନ୍ୟା ପାଣିରେ ଯାଆନ୍ତୁ ନାହିଁ — ଏହା ଦୂଷିତ ବା ବୈଦ୍ୟୁତିକ ହୋଇ ପାରେ।",
    fa_earthquake_title:"ଭୂକମ୍ପ ପ୍ରତିକ୍ରିୟା",
    fa_earthquake_s1:   "ତୁରନ୍ତ ହାତ ଓ ଗୋଡ଼ ଉପରେ ନତ ହୁଅନ୍ତୁ।",
    fa_earthquake_s2:   "ଏକ ମଜବୁତ ଟେବୁଲ ତଳେ ବା ଭିତର ପାଚେରୀ ପାଖରେ ଆଶ୍ରୟ ନିଅନ୍ତୁ।",
    fa_earthquake_s3:   "କମ୍ପନ ନ ଥଂଭା ଯାଏ ଧରି ରୁହନ୍ତୁ।",
    fa_earthquake_s4:   "କମ୍ପନ ସମୟରେ ବାହାର ଦୌଡ଼ନ୍ତୁ ନାହିଁ — ପଡ଼ୁଥିବା ଖଣ୍ଡ ଅତ୍ୟନ୍ତ ବିପଦଜନକ।",
    fa_earthquake_s5:   "କମ୍ପନ ଥଂଭିଲ ପରେ ଆଘାତ ଯାଞ୍ଚ କରି ସତର୍କ ଭାବ ବାହାର ଯାଆନ୍ତୁ।",
    fa_earthquake_s6:   "ପ୍ରତ୍ୟାଗତ ଭୂକମ୍ପ ଆଶା କରନ୍ତୁ। ଭଗ୍ନ ଭବନ ଠାରୁ ଦୂରରେ ରୁହନ୍ତୁ।",
    fa_earthquake_warn: "ଭୂକମ୍ପ ପରେ ଲିଫ୍ଟ ବ୍ୟବହାର କରନ୍ତୁ ନାହିଁ। ଆଲୋ ଜ୍ୱଳାଇବା ପୂର୍ବରୁ ଗ୍ୟାସ ଲିକ ଯାଞ୍ଚ କରନ୍ତୁ।",
    fa_cyclone_title:   "ଘୂର୍ଣ୍ଣିବାତ୍ୟା ସୁରକ୍ଷା",
    fa_cyclone_s1:      "ପ୍ରଶାସନ ନିର୍ଦ୍ଦେଶ ଦେଲେ ତୁରନ୍ତ ଅଞ୍ଚଳ ଛାଡ଼ନ୍ତୁ।",
    fa_cyclone_s2:      "ସମସ୍ତ ଝରକା ଓ ଦ୍ୱାର ଦୃଢ଼ ଭାବ ବନ୍ଦ କରନ୍ତୁ।",
    fa_cyclone_s3:      "ବାତ୍ୟା ସମୟରେ ଘର ଭିତରରେ ରୁହନ୍ତୁ, ଝରକା ଠୁ ଦୂରରେ।",
    fa_cyclone_s4:      "ସବୁଠୁ ଶକ୍ତ ଘର — ବାଥରୁମ ବା ଭିତର ଘରରେ ଆଶ୍ରୟ ନିଅନ୍ତୁ।",
    fa_cyclone_s5:      "ବାହାରେ ଥିଲେ ଏକ ଖାଡ଼ ରେ ଶୁଅନ୍ତୁ ଓ ମୁଣ୍ଡ ଢଙ୍କନ୍ତୁ।",
    fa_cyclone_s6:      "ଘୂର୍ଣ୍ଣିବାତ୍ୟା ପରେ: ଛିଣ୍ଡା ବିଜୁଳି ତାର, ବନ୍ୟା ଓ ଖଣ୍ଡ ଖଣ୍ଡ ଦୃଢ଼ ଦ୍ରବ୍ୟ ଦେଖନ୍ତୁ।",
    fa_cyclone_warn:    "ଘୂର୍ଣ୍ଣିବାତ୍ୟାର ଆଖ ସମୟରେ ବାହାର ଯାଆନ୍ତୁ ନାହିଁ — ଦ୍ୱିତୀୟ ଅଂଶ ଅଧିକ ଭୟଙ୍କର ହୋଇ ପାରେ।",
    fa_cpr_title:       "CPR (ବୟସ୍କ)",
    fa_cpr_s1:          "ବ୍ୟକ୍ତି ଶ୍ୱାସ ନେଉଛନ୍ତି କି ଯାଞ୍ଚ କରନ୍ତୁ। ନ ନେଉଥିଲେ ତୁରନ୍ତ 112 ଡାକନ୍ତୁ।",
    fa_cpr_s2:          "ଛାତି ମଝିରେ ବେଠ ମଝି ଉପ ହାତ ଗୋଡ଼ ତଳ ରଖନ୍ତୁ।",
    fa_cpr_s3:          "ଜୋରରେ ଓ ଦ୍ରୁତ ଗତିରେ ଦବାନ୍ତୁ — ଅନ୍ତତ 5 ସେମି ଗଭୀର, ମିନ ରେ 100-120 ଥ।",
    fa_cpr_s4:          "ଦୁଇ ଦବା ମଝିରେ ଛାତି ଭଲ ଭାବ ଉଠିବା ଦିଅନ୍ତୁ।",
    fa_cpr_s5:          "ତାଲିମ ପ୍ରାପ୍ତ ଥିଲେ: ପ୍ରତ 30 ଦବା ପରେ 2 ସ୍ୱାସ ଦିଅନ୍ତୁ।",
    fa_cpr_s6:          "ଜରୁରୀ ସାହାଯ୍ୟ ଆସିବା ବା ବ୍ୟକ୍ତି ସଚେତ ହେବା ଯାଏ ଜାରି ରଖନ୍ତୁ।",
    fa_cpr_warn:        "ଅ-ତାଲିମ CPR ମଧ୍ୟ ବଞ୍ଚିବା ସୁଯୋଗ ଦ୍ୱିଗୁଣ କରେ। ସାହାଯ୍ୟ ଆସିବା ଯାଏ ଥଂଭନ୍ତୁ ନାହିଁ।",
    fa_snakebite_title: "ସାପ କାମୁଡ଼ିବା",
fa_snakebite_s1: "ବ୍ୟକ୍ତିକୁ ଶାନ୍ତ ଏବଂ ନିଷ୍କ୍ରିୟ ରଖନ୍ତୁ। ଗତି ବିଷକୁ ଶୀଘ୍ର ପ୍ରସାରିତ କରେ।",
fa_snakebite_s2: "କାମୁଡ଼ିଥିବା ସ୍ଥାନ ପାଖରେ ଘଡ଼ି, ଆଠି କିମ୍ବା ଟାଇଟ୍ ବସ୍ତୁ କାଢ଼ନ୍ତୁ।",
fa_snakebite_s3: "କାମୁଡ଼ିଥିବା ଅଙ୍ଗକୁ ହୃଦୟ ତଳେ ରଖନ୍ତୁ।",
fa_snakebite_s4: "ଘାଉ କାଟନ୍ତୁ ନାହିଁ, ବିଷ ଚୁଷନ୍ତୁ ନାହିଁ, ବରଫ ଲଗାନ୍ତୁ ନାହିଁ।",
fa_snakebite_s5: "ସମ୍ଭବ ହେଲେ ସାପର ଆକୃତି ମନେ ରଖନ୍ତୁ (ତାକୁ ଧାଉନ୍ତୁ ନାହିଁ)।",
fa_snakebite_s6: "ତୁରନ୍ତ ହସ୍ପିଟାଲକୁ ନେଇଯାଆନ୍ତୁ — ଏଣ୍ଟିଭେନମ ମାତ୍ର ଚିକିତ୍ସା।",
fa_snakebite_warn: "ଭାରତର 90% ସାପ କାମୁଡ଼ିବା ଏଣ୍ଟିଭେନମ ଦ୍ୱାରା ଠିକ୍ ହୋଇପାରେ। 4 ଘଣ୍ଟା ମଧ୍ୟରେ ହସ୍ପିଟାଲକୁ ଯାଆନ୍ତୁ।",
    fa_burns_title: "ଦାଗ / ପୋଡ଼ା",
fa_burns_s1: "ପୋଡ଼ିଥିବା ସ୍ଥାନକୁ 20 ମିନିଟ୍ ଠଣ୍ଡା ପାଣିରେ ଧୋଆନ୍ତୁ।",
fa_burns_s2: "ବରଫ, ତେଲ, ଟୁଥପେଷ୍ଟ ବ୍ୟବହାର କରନ୍ତୁ ନାହିଁ।",
fa_burns_s3: "ପୋଡ଼ା ସ୍ଥାନ ପାଖରେ ପୋଶାକ ଏବଂ ଗହନା କାଢ଼ନ୍ତୁ।",
fa_burns_s4: "ସଫା କପଡ଼ାରେ ହଳୁକରେ ଢାକନ୍ତୁ।",
fa_burns_s5: "ଫୋକା ଫୋଡ଼ନ୍ତୁ ନାହିଁ।",
fa_burns_s6: "ବଡ଼ ଦାଗ ହେଲେ 102 କୁ ଫୋନ କରନ୍ତୁ।",
fa_burns_warn: "ରାସାୟନିକ ଦାଗ — ବହୁତ ପାଣିରେ ଧୋଆନ୍ତୁ।",
fa_fracture_title: "ହାଡ଼ ଭାଙ୍ଗିବା",
fa_fracture_s1: "ଭାଙ୍ଗିଥିବା ଅଂଶକୁ ସିଧା କରନ୍ତୁ ନାହିଁ।",
fa_fracture_s2: "ସ୍ପ୍ଲିଣ୍ଟ କିମ୍ବା କାଗଜ ଦ୍ୱାରା ନିଷ୍କ୍ରିୟ କରନ୍ତୁ।",
fa_fracture_s3: "ଉପରେ ଏବଂ ତଳେ ବାନ୍ଧନ୍ତୁ — ସିଧା ଉପରେ ନୁହେଁ।",
fa_fracture_s4: "ସୁଜିବା କମାଇବା ପାଇଁ ଉପରକୁ ରଖନ୍ତୁ।",
fa_fracture_s5: "କପଡ଼ାରେ ବରଫ ଲଗାନ୍ତୁ।",
fa_fracture_s6: "ଖୋଲା ହାଡ଼ ଦେଖିଲେ ତୁରନ୍ତ ହସ୍ପିଟାଲକୁ ଯାଆନ୍ତୁ।",
fa_fracture_warn: "ଗଳା କିମ୍ବା ପିଠି ଚୋଟ ଥିଲେ ଲୋକକୁ ହଲାଇବେ ନାହିଁ।",
    fa_dehydration_title: "ପାଣି ଅଭାବ",
fa_dehydration_s1: "ପ୍ରତି କିଛି ମିନିଟ୍‌ରେ ପାଣି ଦିଅନ୍ତୁ",
fa_dehydration_s2: "ORS ଥିଲେ ବ୍ୟବହାର କରନ୍ତୁ",
fa_dehydration_s3: "1 ଲିଟର ପାଣି + 6 ଚମ୍ଚା ଚିନି + ½ ଚମ୍ଚା ଲୁଣ",
fa_dehydration_s4: "ଛାୟାରେ ରଖନ୍ତୁ",
fa_dehydration_s5: "ଶିଶୁଙ୍କୁ ଦୁଧ ଦିଅନ୍ତୁ",
fa_dehydration_s6: "ବେହୋଶ ହେଲେ ପାଣି ନ ଦିଅନ୍ତୁ",
fa_dehydration_warn: "ଦୂଷିତ ପାଣି ମୃତ୍ୟୁର କାରଣ — ପାଣି ଫୁଟାଇ ପିଅନ୍ତୁ",
   fa_choking_title: "ଶ୍ୱାସ ଅଟକିବା",
fa_choking_s1: "ପଚାରନ୍ତୁ ‘ଆପଣଙ୍କ ଶ୍ୱାସ ଅଟକିଛି କି?’ — କହି ପାରୁନାହିଁ ହେଲେ ତୁରନ୍ତ କାର୍ଯ୍ୟ କରନ୍ତୁ",
fa_choking_s2: "କାନ୍ଧ ମଧ୍ୟରେ ହାତରେ 5 ଥର ଜୋରରେ ମାରନ୍ତୁ",
fa_choking_s3: "ସୁଧାର ନ ହେଲେ ପେଟରେ 5 ଥର ଧକ୍କା ଦିଅନ୍ତୁ (Heimlich)",
fa_choking_s4: "5 ଥର ପିଠିରେ ମାରିବା ଓ 5 ଥର ପେଟରେ ଧକ୍କା ପୁଣି ପୁଣି କରନ୍ତୁ",
fa_choking_s5: "ବେହୋଶ ହେଲେ CPR ଆରମ୍ଭ କରନ୍ତୁ",
fa_choking_s6: "ଶିଶୁ ପାଇଁ: ପିଠିରେ ମାରନ୍ତୁ, ପେଟରେ ନୁହେଁ",
fa_choking_warn: "ଆଙ୍ଗୁଠି ଦିଆରେ ଖୋଜନ୍ତୁ ନାହିଁ — ଅଧିକ ଭିତରକୁ ଯାଇପାରେ",
   fa_electric_title: "ବିଦ୍ୟୁତ ଘାତ",
fa_electric_s1: "ବିଦ୍ୟୁତ ଚାଲୁ ଥିଲେ ଛୁଇଁବେ ନାହିଁ",
fa_electric_s2: "ମେନ ସ୍ୱିଚ୍ ବନ୍ଦ କରନ୍ତୁ",
fa_electric_s3: "ଶୁଖିଲା କାଠ ଦ୍ୱାରା ଦୂର କରନ୍ତୁ",
fa_electric_s4: "112 କଲ୍ କରନ୍ତୁ",
fa_electric_s5: "ଶ୍ୱାସ ଯାଞ୍ଚ କରନ୍ତୁ",
fa_electric_s6: "ଜଳିଥିବା ଅଂଶକୁ ଥଣ୍ଡା ପାଣିରେ ଧୋଇବେ",
fa_electric_warn: "ପ୍ରଥମେ ବିଦ୍ୟୁତ ବନ୍ଦ କରନ୍ତୁ",
    adminNoteCancel:    "ବାତିଲ",
  },

  // ── BENGALI ──────────────────────────────────────────────────
  bn: {
    appName:            "দুর্যোগ ব্যবস্থাপনা সিস্টেম",
    appTagline:         "জরুরি পরিস্থিতিতে নিরাপদ ও সচেতন থাকুন।",
    countryCode:        "+91",
    back:               "← ফিরুন",
    backToDashboard:    "← ড্যাশবোর্ডে ফিরুন",
    cancel:             "বাতিল",
    close:              "বন্ধ",
    save:               "💾 সংরক্ষণ",
    submit:             "জমা দিন",
    loading:            "লোড হচ্ছে…",
    adminSos: "🚨 জরুরি সতর্কতা ব্যবস্থাপনা",
    adminSosSubtitle: "যেসব ব্যবহারকারী জরুরি SOS অ্যালার্ট পাঠিয়েছেন তাদের GPS অবস্থান ট্র্যাক করুন",
    userRegErrEmail: "অনুগ্রহ করে একটি সঠিক ইমেল লিখুন",
    damageAdminSubtitle: "নাগরিকদের জমা দেওয়া ছবি-যাচাইকৃত ক্ষতির রিপোর্টগুলো দেখুন।",
    logout:             "⎋ লগআউট",
    confirm:            "নিশ্চিত করুন",
    send:               "পাঠান",
    update:             "আপডেট",
    logoutConfirm:      "আপনি কি সত্যিই লগআউট করতে চান?",
    fileComplaintSubtitle: "দুর্যোগের পরে নাগরিকদের করা অভিযোগগুলো পর্যালোচনা করুন এবং উত্তর দিন।",
    offlineBanner:      "📴 আপনি অফলাইন — জরুরি কল এবং প্রাথমিক চিকিৎসা এখনও কাজ করছে",

    langLabel:          "🌐 ভাষা",
    langEn:             "English",
    langHi:             "हिन्दी",
    langOr:             "ଓଡ଼ିଆ",
    langBn:             "বাংলা",
    langMore:           "আরও ভাষা শীঘ্রই আসছে…",

    welcomeTitle:       "দুর্যোগ ব্যবস্থাপনা সিস্টেমে স্বাগতম",
    selectRole:         "চালিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন",
    emergencyNums:      "📞 জরুরি নম্বর — সরাসরি কল করুন (ইন্টারনেট ছাড়া)",
    numEmergency:       "জরুরি",
    numPolice:          "পুলিশ",
    numAmbulance:       "অ্যাম্বুলেন্স",
    numFire:            "দমকল",
    userLogin:          "👤 ব্যবহারকারী লগইন",
    adminLogin:         "🛡️ প্রশাসক লগইন",
    ngoLogin:           "🤝 NGO লগইন / নিবন্ধন",
    welcomeMsg:         "স্বাগতম! 👋",
    staySafe:           "জরুরি পরিস্থিতিতে নিরাপদ ও সচেতন থাকুন।",

    sidebarTitle:       "🌐 দুর্যোগ অ্যাপ",
    sidebarCitizen:     "নাগরিক",
    sidebarHome:        "🏠 হোম",
    sidebarLiveInfo:    "🗺️ লাইভ তথ্য",
    sidebarWeather:     "🌤️ লাইভ আবহাওয়া",
    sidebarNgo:         "🤝 NGO ও স্বেচ্ছাসেবক",
    sidebarSafeZones:   "🛟 নিরাপদ এলাকা",
    sidebarFirstAid:    "🩹 প্রাথমিক চিকিৎসা",
    sidebarContact:     "✉️ যোগাযোগ",
    sidebarComplaint:   "📋 অভিযোগ দাখিল",
    sidebarTrack:       "🔍 অবস্থা ট্র্যাক",
    sidebarDamage:      "🏚️ ক্ষতি রিপোর্ট",
    sidebarTrackRpt:    "📊 আমার রিপোর্ট ট্র্যাক",
    sidebarTheme:       "🌙 থিম পরিবর্তন",
    dashTitle:          "দুর্যোগ ব্যবস্থাপনা",
    copyright:          "© 2026 দুর্যোগ ব্যবস্থাপনা সিস্টেম | কলেজ প্রকল্প",

    sendSos:            "SOS পাঠান",
    damageReport:       "ক্ষতি রিপোর্ট",
    fileComplaint:      "অভিযোগ দাখিল",
    trackReport:        "রিপোর্ট ট্র্যাক",
    safeZones:          "নিরাপদ এলাকা",
    firstAid:           "প্রাথমিক চিকিৎসা",

    emergencyContacts:  "📞 জরুরি যোগাযোগ",
    addContact:         "+ যোগ করুন",
    viewAll:            "সব দেখুন",
    contactName:        "যোগাযোগের নাম",
    phoneNumber:        "ফোন নম্বর",
    allContacts:        "📋 সকল জরুরি যোগাযোগ",
    contactSaved:       "📞 যোগাযোগ সংরক্ষিত!",
    contactDeleted:     "🗑️ যোগাযোগ সফলভাবে মুছে ফেলা হয়েছে!",
    contactDeleteConfirm:"আপনি কি এই যোগাযোগ মুছে ফেলতে চান?",
    contactFillBoth:    "অনুগ্রহ করে উভয় ফিল্ড পূরণ করুন।",

    sosSendTitle:       "🆘 SOS পাঠান — যোগাযোগ নির্বাচন",
    sosSubtitle:        "আপনার জরুরি সতর্কতা কাকে পাঠাবেন নির্বাচন করুন",
    sosGettingGps:      "📡 আপনার অবস্থান নেওয়া হচ্ছে...",
    sosGpsReady:        "✅ GPS প্রস্তুত:",
    sosGpsUnavail:      "⚠️ GPS পাওয়া যাচ্ছে না — SOS অবস্থান ছাড়াই পাঠানো হবে",
    sosGpsNotSupported: "⚠️ এই ডিভাইসে GPS সমর্থিত নয়",
    sosSelectAll:       "সকল যোগাযোগ নির্বাচন",
    sosEmergSvc:        "জরুরি সেবা",
    sosSavedContacts:   "আপনার সংরক্ষিত যোগাযোগ",
    sosNoContacts:      "এখনও কোনো ব্যক্তিগত যোগাযোগ নেই।",
    sosAppAdmin:        "অ্যাপ অ্যাডমিন",
    sosSendNow:         "🆘 এখনই SOS পাঠান",
    sosSent:            "🆘 SOS পাঠানো হয়েছে!",
    sosSentMsg:         "বার্তা পাঠানো হয়েছে। দ্রুত সাড়া পেতে সরাসরি কল করুন:",
    sosConfirm:         "⚠️ জরুরি SOS\n\nএটি SMS-এর মাধ্যমে নির্বাচিত যোগাযোগে আপনার অবস্থান পাঠাবে।\nঅপব্যবহার শাস্তিযোগ্য।\n\nচালিয়ে যাবেন?",
    sosSelectAtLeastOne:"অন্তত একটি যোগাযোগ নির্বাচন করুন।",
    sosBtnLabel:        "🆘 জরুরি SOS — লগইন ছাড়া",

    complaintTitle:     "অভিযোগ দাখিল",
    complaintPlaceholder:"আপনার অভিযোগ বর্ণনা করুন...",
    complaintSubmit:    "জমা দিন",
    complaintEmpty:     "অনুগ্রহ করে আপনার অভিযোগ বর্ণনা করুন!",
    complaintLoginFirst:"প্রথমে লগইন করুন",
    complaintSuccess:   "✅ অভিযোগ সফলভাবে জমা দেওয়া হয়েছে!",
    complaintId:        "আপনার ID:",
    complaintSaveId:    "অভিযোগ ট্র্যাক করতে এই ID সংরক্ষণ করুন।",
    complaintFailed:    "❌ অভিযোগ জমা দিতে ব্যর্থ:",

    trackComplaintTitle:"অভিযোগ অবস্থা ট্র্যাক",
    trackPlaceholder:   "অভিযোগ ID দিন",
    trackCheck:         "অবস্থা যাচাই",
    trackEmpty:         "অনুগ্রহ করে অভিযোগ ID দিন!",
    trackNotFound:      "❌ অভিযোগ ID পাওয়া যায়নি!",

    damageTitle:        "🏚️ ক্ষতি রিপোর্ট জমা দিন",
    damageSubtitle:     "দুর্যোগের পর ক্ষতি রিপোর্ট করুন। প্রশাসক পর্যালোচনা করবেন।",
    damageNamePlaceholder:"আপনার পুরো নাম *",
    damageAddressPlaceholder:"আপনার পুরো ঠিকানা *",
    damageTypeFlood:    "🌊 বন্যা",
    damageTypeCyclone:  "🌀 ঘূর্ণিঝড়",
    damageTypeEarthquake:"🌍 ভূমিকম্প",
    damageTypeFire:     "🔥 আগুন",
    damageTypeLandslide:"⛰️ ভূমিধস",
    damageTypeOther:    "📍 অন্যান্য",
    damageDescPlaceholder:"ক্ষতির পরিস্থিতি বর্ণনা করুন *",
    damagePhotoLabel:   "📷 ক্ষতির ছবি আপলোড করুন",
    damageSubmitBtn:    "🏚️ রিপোর্ট জমা দিন",
    damageFillRequired: "⚠️ অনুগ্রহ করে নাম, ঠিকানা এবং বিবরণ পূরণ করুন।",
    damageSubmitting:   "জমা হচ্ছে...",
    damageSuccess:      "✅ রিপোর্ট জমা! ID:",
    damageFailed:       "❌",
    damageNetworkError: "❌ নেটওয়ার্ক ত্রুটি। সংযোগ যাচাই করুন।",

    trackDamageTitle:   "🔍 আমার ক্ষতি রিপোর্ট ট্র্যাক",
    trackDamageSubtitle:"অবস্থা দেখতে রিপোর্ট ID দিন।",
    trackDamagePlaceholder:"রিপোর্ট ID দিন (যেমন RPT1234567890)",
    trackDamageBtn:     "🔍 অবস্থা যাচাই",
    trackDamageEmpty:   "⚠️ অনুগ্রহ করে আপনার রিপোর্ট ID দিন।",
    trackDamageClose:   "বন্ধ",
    trackRptId:         "রিপোর্ট ID:",
    trackRptName:       "নাম:",
    trackRptType:       "দুর্যোগের ধরন:",
    trackRptDate:       "জমা দেওয়া হয়েছে:",
    adminNote:          "📝 প্রশাসকের নোট:",

    statusSubmitted:    "📋 জমা দেওয়া হয়েছে — প্রশাসক শীঘ্রই পর্যালোচনা করবেন",
    statusReviewed:     "🔍 পর্যালোচিত — প্রশাসক পদক্ষেপ নিচ্ছেন",
    statusResolved:     "✅ সমাধান হয়েছে — সমস্যার সমাধান করা হয়েছে",
    statusRejected:     "❌ প্রত্যাখ্যাত — নিচে প্রশাসকের নোট দেখুন",

    forgotTitle:        "পাসওয়ার্ড রিসেট",
    forgotMobilePlaceholder:"মোবাইল নম্বর দিন",
    forgotOtpPlaceholder:   "OTP দিন",
    forgotNewPassPlaceholder:"নতুন পাসওয়ার্ড",
    forgotSendOtp:      "OTP পাঠান",
    forgotVerifyOtp:    "OTP যাচাই",
    forgotResetPass:    "পাসওয়ার্ড রিসেট",
    forgotCancel:       "বাতিল",
    forgotSuccess:      "✅ পাসওয়ার্ড সফলভাবে রিসেট! অনুগ্রহ করে লগইন করুন।",

    chatbotTitle:       "🤖 দুর্যোগ সহকারী",
    chatbotPlaceholder: "আপনার প্রশ্ন টাইপ করুন...",
    chatbotSend:        "পাঠান",
    chatbotWelcome:     "হ্যালো 👋 দুর্যোগ সহকারীতে স্বাগতম!",
    chatbotSosHelp:     "🚨 SOS সহায়তা",
    chatbotComplaint:   "📋 অভিযোগ দাখিল",
    chatbotContacts:    "📞 যোগাযোগ সহায়তা",
    chatbotPassword:    "🔐 পাসওয়ার্ড সহায়তা",
    chatbotDidntUnderstand:"দুঃখিত 😔 বুঝতে পারিনি। বিকল্প নির্বাচন করুন।",

    ngoPortalTitle:     "🤝 NGO ও স্বেচ্ছাসেবক পোর্টাল",
    ngoPortalSubtitle:  "দুর্যোগ ত্রাণ কার্যক্রমের সাথে NGO সংযুক্ত করা",
    ngoLoginBtn:        "🔐 লগইন",
    ngoRegisterBtn:     "📝 নিবন্ধন",
    ngoCheckStatusBtn:  "🔍 অবস্থা যাচাই",
    ngoRegTitle:        "NGO / স্বেচ্ছাসেবক নিবন্ধন",
    ngoNamePlaceholder: "NGO / সংস্থার নাম *",
    ngoTypeSelect:      "NGO ধরন নির্বাচন *",
    ngoStateSelect:     "রাজ্য নির্বাচন",
    ngoDistrictSelect:  "জেলা নির্বাচন",
    ngoVolunteersSelect:"কতজন স্বেচ্ছাসেবক? *",
    ngoLandmark1:       "ল্যান্ডমার্ক 1 (প্রয়োজনীয়) *",
    ngoLandmark2:       "ল্যান্ডমার্ক 2 (ঐচ্ছিক)",
    ngoAddress:         "পুরো ঠিকানা *",
    ngoMobilePlaceholder:"মোবাইল নম্বর (10 সংখ্যা) *",
    ngoEmailPlaceholder:"ইমেইল (ঐচ্ছিক)",
    ngoHeadPlaceholder: "প্রধান / নেতার নাম *",
    ngoPassPlaceholder: "পাসওয়ার্ড *",
    ngoCpassPlaceholder:"পাসওয়ার্ড নিশ্চিত করুন *",
    ngoPassHint:        "ন্যূনতম 8 অক্ষর — বড়, ছোট, সংখ্যা ও বিশেষ অক্ষর",
    ngoRegBtn:          "✅ NGO নিবন্ধন করুন",
    ngoLoginTitle:      "NGO / স্বেচ্ছাসেবক লগইন",
    ngoIdPlaceholder:   "NGO ID (যেমন NGO12345)",
    ngoLoginPassPlaceholder:"পাসওয়ার্ড",
    ngoLoginSubmitBtn:  "🔐 লগইন",
    ngoForgotLink:      "পাসওয়ার্ড ভুলে গেছেন?",
    ngoStatusTitle:     "NGO অবস্থা যাচাই",
    ngoStatusIdPlaceholder:"NGO ID দিন",
    ngoStatusCheckBtn:  "অবস্থা যাচাই",
    ngoDashWelcome:     "স্বাগতম,",
    ngoOrdersBtn:       "📦 প্রশাসকের আদেশ",
    ngoMarkCompleted:   "✅ সম্পন্ন চিহ্নিত",
    ngoCompleted:       "✅ সম্পন্ন",
    ngoNoOrders:        "এখনও কোনো সহায়তা আদেশ নেই।",
    ngoLogoutBtn:       "লগআউট",
    ngoWorkTitle:       "কাজ আপডেট",
    ngoWorkNotePlaceholder:"কাজের বিবরণ দিন",
    ngoWorkSubmitBtn:   "জমা দিন",
    ngoWorkCancelBtn:   "বাতিল",
    ngoBackBtn:         "← ফিরুন",
    firstAidTitle:      "🩹 প্রাথমিক চিকিৎসা গাইড",
    safeZonesTitle:     "🛟 আপনার কাছের নিরাপদ এলাকা",
    weatherTitle:       "লাইভ আবহাওয়া মনিটর",
    contactTitle:       "যোগাযোগ",
    adminNoteTitle:     "✅ রিপোর্ট সমাধান",
    adminNoteSubtitle:  "নাগরিকের জন্য একটি নোট লিখুন।",
    adminNotePlaceholder:"এখানে আপনার নোট দিন...",
    adminNoteConfirm:   "নিশ্চিত করুন",
    yes:                "হ্যাঁ",
    no:                 "না",
    chatbotSosReply:    "🚨 SOS বাটন চাপুন।\nইন্টারনেট আছে → অ্যাডমিন সতর্কতা পাবে।\nনেই → SMS অ্যাপ খুলবে। আপনাকে ম্যানুয়ালি পাঠাতে হবে।",
    chatbotComplaintReply: "📋 সাইডবারে 'অভিযোগ দাখিল' ক্লিক করুন।\nজমার পর অভিযোগ ID সংরক্ষণ করুন।",
    chatbotContactsReply: "📞 জরুরি যোগাযোগ যোগ করুন।\nডিফল্ট: 100 পুলিশ, 101 দমকল, 102 অ্যাম্বুলেন্স।",
    chatbotPasswordReply: "🔐 'পাসওয়ার্ড ভুলেছেন' ক্লিক করুন।\nমোবাইল → OTP → নতুন পাসওয়ার্ড।",
    trackDamageNotFound: "❌",
    trackDamageNetwork: "❌ নেটওয়ার্ক ত্রুটি। সংযোগ যাচাই করুন।",
    firstAidH2:         "জরুরি প্রাথমিক চিকিৎসা — দ্রুত তথ্যসূত্র",
    firstAidSub:        "অফলাইনে কাজ করে। যেকোনো গাইড ট্যাপ করে খুলুন। চিকিৎসা সাহায্য আসা পর্যন্ত ধাপগুলো মেনে চলুন।",
    firstAidSearch:     "🔍 খুঁজুন: বন্যা, সাপ, CPR, পোড়া, হাড় ভাঙা...",
    firstAidNoResult:   "কোনো গাইড পাওয়া যায়নি। অন্য কীওয়ার্ড চেষ্টা করুন।",
    fa_flood_title:     "বন্যা সুরক্ষা",
    fa_flood_s1:        "অবিলম্বে উঁচু জায়গায় যান — অপেক্ষা করবেন না।",
    fa_flood_s2:        "চলন্ত জলের মধ্য দিয়ে হাঁটবেন না। ১৫ সেমি জল আপনাকে ফেলে দিতে পারে।",
    fa_flood_s3:        "প্রধান সুইচ বন্ধ করুন। বৈদ্যুতিক সরঞ্জাম স্পর্শ করবেন না।",
    fa_flood_s4:        "দ্রুত প্রবাহিত জলের উপরের সেতু এড়িয়ে চলুন।",
    fa_flood_s5:        "বাড়িতে আটকে গেলে ছাদে যান এবং সাহায্যের জন্য সংকেত দিন।",
    fa_flood_s6:        "বন্যার পর শুধু ফুটানো বা বোতলের জল পান করুন।",
    fa_flood_warn:      "বন্যার জলে প্রবেশ করবেন না — এটি দূষিত বা বিদ্যুৎযুক্ত হতে পারে।",
    fa_earthquake_title:"ভূমিকম্পের প্রতিক্রিয়া",
    fa_earthquake_s1:   "অবিলম্বে হাত ও হাঁটুতে ভর দিয়ে নামুন।",
    fa_earthquake_s2:   "শক্ত টেবিলের নিচে বা ভেতরের দেওয়ালের কাছে আশ্রয় নিন।",
    fa_earthquake_s3:   "কম্পন না থামা পর্যন্ত ধরে থাকুন।",
    fa_earthquake_s4:   "কম্পনের সময় বাইরে দৌড়াবেন না — পড়ন্ত ধ্বংসাবশেষ সবচেয়ে বিপজ্জনক।",
    fa_earthquake_s5:   "কম্পন থামলে আঘাতের জন্য পরীক্ষা করুন এবং সাবধানে বের হন।",
    fa_earthquake_s6:   "আফটারশক প্রত্যাশা করুন। ক্ষতিগ্রস্ত ভবন থেকে দূরে থাকুন।",
    fa_earthquake_warn: "ভূমিকম্পের পর লিফট ব্যবহার করবেন না। আলো জ্বালানোর আগে গ্যাস লিক পরীক্ষা করুন।",
    fa_cyclone_title:   "ঘূর্ণিঝড় সুরক্ষা",
    fa_cyclone_s1:      "কর্তৃপক্ষের নির্দেশনা পেলে অবিলম্বে সরে যান।",
    fa_cyclone_s2:      "সমস্ত জানালা ও দরজা শক্তভাবে বন্ধ করুন।",
    fa_cyclone_s3:      "ঝড়ের সময় ঘরের ভেতরে থাকুন, জানালা থেকে দূরে।",
    fa_cyclone_s4:      "সবচেয়ে শক্তিশালী ঘর — বাথরুম বা ভেতরের ঘরে আশ্রয় নিন।",
    fa_cyclone_s5:      "বাইরে থাকলে একটি খন্দকে শুয়ে পড়ুন এবং মাথা ঢাকুন।",
    fa_cyclone_s6:      "ঘূর্ণিঝড়ের পর: ছেঁড়া বিদ্যুৎ তার, বন্যা ও ধ্বংসাবশেষ সম্পর্কে সচেতন থাকুন।",
    fa_cyclone_warn:    "ঘূর্ণিঝড়ের চোখের সময় বাইরে যাবেন না — দ্বিতীয় অর্ধেক আরও খারাপ হতে পারে।",
    fa_cpr_title:       "CPR (প্রাপ্তবয়স্ক)",
    fa_cpr_s1:          "ব্যক্তি শ্বাস নিচ্ছেন কিনা পরীক্ষা করুন। না নিলে অবিলম্বে 112 ডাকুন।",
    fa_cpr_s2:          "বুকের মাঝখানে স্তনবৃন্তের মাঝে হাতের তালু রাখুন।",
    fa_cpr_s3:          "জোরে এবং দ্রুত চাপ দিন — কমপক্ষে ৫ সেমি গভীর, মিনিটে ১০০-১২০ বার।",
    fa_cpr_s4:          "দুটি চাপের মাঝে বুক পূর্ণভাবে উঠতে দিন।",
    fa_cpr_s5:          "প্রশিক্ষিত হলে: প্রতি ৩০টি চাপের পর ২টি উদ্ধার শ্বাস দিন।",
    fa_cpr_s6:          "জরুরি সাহায্য আসা বা ব্যক্তি জেগে ওঠা পর্যন্ত চালিয়ে যান।",
    fa_cpr_warn:        "অপ্রশিক্ষিত CPR (শুধু হাত) ও বেঁচে থাকার সম্ভাবনা দ্বিগুণ করে। সাহায্য আসা পর্যন্ত থামবেন না।",
    fa_snakebite_title: "সাপের কামড়",
    fa_snakebite_s1:    "ব্যক্তিকে শান্ত ও স্থির রাখুন। নড়াচড়া বিষ দ্রুত ছড়ায়।",
    fa_snakebite_s2:    "কামড়ের কাছাকাছি ঘড়ি, আংটি বা চাপের জিনিস খুলুন।",
    fa_snakebite_s3:    "কামড়ানো অঙ্গ হৃদয়ের স্তরের নিচে রাখুন।",
    fa_snakebite_s4:    "ক্ষত কাটবেন না, বিষ চুষবেন না বা বরফ লাগাবেন না।",
    fa_snakebite_s5:    "সাপের চেহারা লক্ষ্য করুন (তাড়া করবেন না)।",
    fa_snakebite_s6:    "অবিলম্বে হাসপাতালে যান — অ্যান্টিভেনম একমাত্র চিকিৎসা।",
    fa_snakebite_warn:  "৯০% ভারতীয় সাপের কামড় অ্যান্টিভেনম দিয়ে চিকিৎসা করা যায়। ৪ ঘণ্টার মধ্যে হাসপাতালে যান।",
    fa_burns_title:     "পোড়া",
    fa_burns_s1:        "পোড়া জায়গায় ২০ মিনিট ঠান্ডা প্রবাহিত জল দিন (বরফ নয়)।",
    fa_burns_s2:        "বরফ, মাখন, টুথপেস্ট বা তেল ব্যবহার করবেন না।",
    fa_burns_s3:        "পোড়ার কাছে পোশাক ও গহনা সরান — ত্বকে লেগে থাকলে ছুঁবেন না।",
    fa_burns_s4:        "পরিষ্কার নরম কাপড় দিয়ে আলগাভাবে ঢেকে দিন।",
    fa_burns_s5:        "ফোস্কা ফাটাবেন না — সংক্রমণের ঝুঁকি আছে।",
    fa_burns_s6:        "বড় বা গভীর পোড়ার জন্য — অবিলম্বে ১০২ (অ্যাম্বুলেন্স) ডাকুন।",
    fa_burns_warn:      "রাসায়নিক পোড়া — ২০+ মিনিট প্রচুর জল দিয়ে ধুয়ে দূষিত পোশাক সাবধানে সরান।",
    fa_fracture_title:  "হাড় ভাঙা",
    fa_fracture_s1:     "অঙ্গ সোজা করার চেষ্টা করবেন না।",
    fa_fracture_s2:     "একটি শক্ত জিনিস বা গোল করা খবরের কাগজ দিয়ে এলাকা স্থির করুন।",
    fa_fracture_s3:     "ভাঙার উপর ও নিচে বাঁধুন — সরাসরি উপরে নয়।",
    fa_fracture_s4:     "ফোলা কমাতে সম্ভব হলে উঁচু করুন।",
    fa_fracture_s5:     "কাপড়ে মোড়া বরফের প্যাক ২০ মিনিট লাগান।",
    fa_fracture_s6:     "খোলা ভাঙা (হাড় দৃশ্যমান): পরিষ্কার কাপড় দিয়ে ঢেকে অবিলম্বে হাসপাতালে যান।",
    fa_fracture_warn:   "সন্দেহভাজন ঘাড় বা মেরুদণ্ডের আঘাত আছে এমন ব্যক্তিকে তাৎক্ষণিক বিপদ না থাকলে নাড়াবেন না।",
    fa_dehydration_title:"দুর্যোগে পানিশূন্যতা",
    fa_dehydration_s1:  "কয়েক মিনিট পর পর পরিষ্কার জলের ছোট চুমুক দিন।",
    fa_dehydration_s2:  "পাওয়া গেলে ORS ব্যবহার করুন — ১ লিটার জলে ১ প্যাকেট।",
    fa_dehydration_s3:  "ঘরে তৈরি ORS: ১ লিটার জল + ৬ চা চামচ চিনি + আধা চা চামচ লবণ।",
    fa_dehydration_s4:  "ব্যক্তিকে ছায়ায় রাখুন এবং ভেজা কাপড় দিয়ে ঠান্ডা করুন।",
    fa_dehydration_s5:  "শিশুদের জন্য — বুকের দুধ চালিয়ে যান।",
    fa_dehydration_s6:  "অচেতন ব্যক্তিকে মুখে জল দেবেন না। ১০২ ডাকুন।",
    fa_dehydration_warn:"বন্যার পর দূষিত জল বন্যার চেয়ে বেশি মৃত্যু ঘটায়। সবসময় জল ফুটিয়ে পান করুন।",
    fa_choking_title:   "শ্বাসনালিতে বাধা",
    fa_choking_s1:      "'আপনি কি শ্বাস আটকে আছেন?' জিজ্ঞেস করুন — কথা বলতে না পারলে এখনই কাজ করুন।",
    fa_choking_s2:      "হাতের গোড়া দিয়ে কাঁধের ব্লেডের মাঝে ৫টি জোরালো আঘাত দিন।",
    fa_choking_s3:      "না সরলে: পেছন থেকে দাঁড়ান, নাভির উপর মুষ্টি করুন, ৫টি পেটে ঠেলা দিন।",
    fa_choking_s4:      "৫টি পিঠে আঘাত ও ৫টি পেটে ঠেলা পর্যায়ক্রমে দিন।",
    fa_choking_s5:      "অচেতন হলে — CPR শুরু করুন।",
    fa_choking_s6:      "শিশুদের ক্ষেত্রে: উপুড় করে উরুতে রেখে পিঠে আঘাত, পেটে ঠেলা নয়।",
    fa_choking_warn:    "অন্ধ আঙুল দিয়ে খোঁজাখুঁজি করবেন না — বস্তু আরও ভেতরে ঠেলে যেতে পারে।",
    fa_electric_title:  "বৈদ্যুতিক শক",
    fa_electric_s1:     "বিদ্যুতের সংস্পর্শে থাকা ব্যক্তিকে স্পর্শ করবেন না।",
    fa_electric_s2:     "কাছে যাওয়ার আগে মূল বোর্ডে বিদ্যুৎ বন্ধ করুন।",
    fa_electric_s3:     "বন্ধ করতে না পারলে — শুকনো কাঠের লাঠি বা দড়ি দিয়ে সরিয়ে দিন।",
    fa_electric_s4:     "অবিলম্বে ১১২ ডাকুন।",
    fa_electric_s5:     "শ্বাস পরীক্ষা করুন। না নিলে CPR শুরু করুন।",
    fa_electric_s6:     "পোড়া ঠান্ডা প্রবাহিত জল দিয়ে চিকিৎসা করুন।",
    fa_electric_warn:   "বৈদ্যুতিক আঘাতের শিকার ব্যক্তির কাছে ধাতব জিনিস ব্যবহার করবেন না। সবসময় আগে বিদ্যুৎ কাটুন।",
    adminNoteCancel:    "বাতিল",
  },
};
// ✅ ADD THIS LINE HERE (VERY IMPORTANT)
window.currentLang = localStorage.getItem("lang") || "en";
// ─────────────────────────────────────────────────────────────
// CORE i18n ENGINE
// ─────────────────────────────────────────────────────────────

const SUPPORTED_LANGS = ["en", "hi", "or", "bn"];
const DEFAULT_LANG    = "en";

/** Get currently active language (from localStorage or browser default) */
function getLang() {
  const stored = localStorage.getItem("appLang");
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  // Auto-detect browser language
  const browser = (navigator.language || "en").substring(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG;
}

/** Translate key → string for current language. Falls back to English. */
function t(key) {
  const lang = getLang();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
  if (dict[key] !== undefined) return dict[key];
  // Fallback to English
  if (TRANSLATIONS[DEFAULT_LANG][key] !== undefined) return TRANSLATIONS[DEFAULT_LANG][key];
  // Return key itself if totally missing
  return key;
}

/** Switch language — INSTANT, no page reload needed */
function setLang(code) {
  if (!SUPPORTED_LANGS.includes(code)) return;
  localStorage.setItem("appLang", code);
  applyLang();
  setTimeout(autoTranslateEverything, 20);
}

/**
 * Apply translations to every element with data-i18n attribute.
 * Supports:
 *   data-i18n="key"                 → element.textContent
 *   data-i18n-placeholder="key"     → element.placeholder
 *   data-i18n-title="key"           → element.title
 *   data-i18n-aria="key"            → element.ariaLabel
 */
function applyLang() {
  const lang = getLang();

  // Update <html lang=""> attribute
  document.documentElement.lang = lang;

  // Update page title if data-i18n is set
  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) { const k = titleEl.getAttribute("data-i18n"); document.title = t(k); }

  // Text content
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // Placeholder attribute
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });

  // Title attribute (tooltips)
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.title = t(key);
  });

  // aria-label
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });

  // Update language selector if present
  const sel = document.getElementById("langSelect");
  if (sel) sel.value = lang;

  // Dispatch custom event so pages can hook in
  document.dispatchEvent(new CustomEvent("langChanged", { detail: { lang } }));
}

// ─────────────────────────────────────────────────────────────
// LANGUAGE SELECTOR WIDGET — inject into any page
// ─────────────────────────────────────────────────────────────

/**
 * Inject a floating language switcher pill into the page.
 * Call injectLangSwitcher() at the bottom of any HTML body.
 */
function injectLangSwitcher() {
  // Don't double-inject
  if (document.getElementById("langSwitcherWidget")) return;

  const langs = [
    { code: "en", label: "EN", full: "English"  },
    { code: "hi", label: "हि", full: "हिन्दी"   },
    { code: "or", label: "ଓ",  full: "ଓଡ଼ିଆ"    },
    { code: "bn", label: "বা", full: "বাংলা"     },
  ];

  const cur = getLang();

  // Build the widget HTML
  const widget = document.createElement("div");
  widget.id = "langSwitcherWidget";
  widget.style.position = "fixed";
widget.style.top = "120px";
widget.style.right = "20px";
widget.style.zIndex = "99999";
widget.style.cursor = "grab";
  widget.style.cssText = [
    "position:fixed",
    "bottom:80px",
    "left:16px",
    "z-index:999998",
    "display:flex",
    "flex-direction:column",
    "align-items:flex-start",
    "gap:0",
  ].join(";");

  // Toggle button
  const toggle = document.createElement("button");
  toggle.id = "langToggleBtn";
  toggle.setAttribute("data-i18n-aria", "langLabel");
  toggle.style.cssText = [
    "background:linear-gradient(135deg,#1e3a8a,#1d4ed8)",
    "color:white",
    "border:none",
    "border-radius:24px",
    "padding:8px 14px",
    "font-size:13px",
    "font-weight:700",
    "cursor:pointer",
    "box-shadow:0 4px 14px rgba(0,0,0,0.25)",
    "font-family:inherit",
    "display:flex",
    "align-items:center",
    "gap:6px",
  ].join(";");
  toggle.innerHTML = `🌐 <span id="langCurrentLabel">${langs.find(l => l.code === cur)?.label || "EN"}</span>`;

  // Dropdown panel
  const panel = document.createElement("div");
  panel.id = "langDropdown";
  panel.style.cssText = [
    "display:none",
    "flex-direction:column",
    "background:white",
    "border-radius:12px",
    "box-shadow:0 8px 32px rgba(0,0,0,0.18)",
    "overflow:hidden",
    "margin-bottom:6px",
    "min-width:160px",
    "border:1px solid #e2e8f0",
  ].join(";");

  langs.forEach(l => {
    const btn = document.createElement("button");
    btn.style.cssText = [
      "background:" + (l.code === cur ? "#eff6ff" : "white"),
      "color:" + (l.code === cur ? "#1d4ed8" : "#1e293b"),
      "border:none",
      "border-bottom:1px solid #f1f5f9",
      "padding:10px 16px",
      "text-align:left",
      "font-size:14px",
      "font-weight:" + (l.code === cur ? "700" : "400"),
      "cursor:pointer",
      "font-family:inherit",
      "display:flex",
      "align-items:center",
      "gap:10px",
      "transition:background 0.15s",
    ].join(";");
    btn.innerHTML = `<span style="font-size:16px;min-width:22px;">${l.label}</span><span>${l.full}</span>`;
    btn.onmouseenter = () => { if (getLang() !== l.code) btn.style.background = "#f8fafc"; };
    btn.onmouseleave = () => { if (getLang() !== l.code) btn.style.background = "white"; };
    btn.onclick = () => {
      setLang(l.code);
      // Update toggle button label
      document.getElementById("langCurrentLabel").textContent = l.label;
      // Update active state
      panel.querySelectorAll("button").forEach(b => {
        b.style.background = "white";
        b.style.color = "#1e293b";
        b.style.fontWeight = "400";
      });
      btn.style.background = "#eff6ff";
      btn.style.color = "#1d4ed8";
      btn.style.fontWeight = "700";
      panel.style.display = "none";
    };
    panel.appendChild(btn);
  });

  // "More coming soon" row
  const more = document.createElement("div");
  more.style.cssText = "padding:8px 16px;font-size:11px;color:#94a3b8;font-style:italic;background:#f8fafc;";
  more.setAttribute("data-i18n", "langMore");
  more.textContent = t("langMore");
  panel.appendChild(more);

  // Toggle open/close
  toggle.onclick = () => {
    const open = panel.style.display !== "none";
    panel.style.display = open ? "none" : "flex";
  };

  // Close when clicking elsewhere
  document.addEventListener("click", e => {
    if (!widget.contains(e.target)) panel.style.display = "none";
  });

  widget.appendChild(panel);
  widget.appendChild(toggle);
  document.body.appendChild(widget);
  let isDragging = false;
let offsetX, offsetY;

widget.addEventListener("mousedown", startDrag);
widget.addEventListener("touchstart", startDrag);

function startDrag(e) {
  isDragging = true;

  const rect = widget.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
}

document.addEventListener("mousemove", move);
document.addEventListener("touchmove", move);

function move(e) {
  if (!isDragging) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  widget.style.left = (clientX - offsetX) + "px";
  widget.style.top = (clientY - offsetY) + "px";
  widget.style.right = "unset";
}

document.addEventListener("mouseup", () => isDragging = false);
document.addEventListener("touchend", () => isDragging = false);
}

// ─────────────────────────────────────────────────────────────
// AUTO-INIT on DOM ready
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyLang();
  injectLangSwitcher();
  autoTranslateEverything();
  setTimeout(autoTranslateEverything, 300);
});
// 🔥 AUTO GLOBAL TRANSLATION — fast reverse-map, instant switch
let _i18nRevMap = null;

function _buildRevMap() {
  if (_i18nRevMap) return _i18nRevMap;
  _i18nRevMap = {};
  const en = TRANSLATIONS["en"];
  for (const key in en) {
    const v = String(en[key]).trim();
    if (v && !_i18nRevMap[v]) _i18nRevMap[v] = key;
  }
  return _i18nRevMap;
}

 
function autoTranslateEverything() {
  const dict = TRANSLATIONS[getLang()] || TRANSLATIONS["en"];
  const rev  = _buildRevMap();
  document.querySelectorAll("body *").forEach(el => {
    if (["SCRIPT","STYLE","CODE","svg","path"].includes(el.tagName)) return;
    // Text node
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      const txt = el.textContent.trim();
      if (txt && rev[txt] && dict[rev[txt]] !== undefined) el.textContent = dict[rev[txt]];
    }
    // Placeholder
    if (el.placeholder) {
      const ph = el.placeholder.trim();
      if (ph && rev[ph] && dict[rev[ph]] !== undefined) el.placeholder = dict[rev[ph]];
    }
  });
}
// 🔥 FORCE FIX — applyLang patch (handles placeholder also)
(function () {
  const oldApplyLang = window.applyLang;

  window.applyLang = function () {
    // run original function
    if (typeof oldApplyLang === "function") {
      oldApplyLang();
    }

    const currentLang = localStorage.getItem("lang") || "en";

    // ✅ FIX placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");

      el.placeholder =
        TRANSLATIONS[currentLang]?.[key] ||
        TRANSLATIONS.en?.[key] ||
        "";
    });

    // ✅ FIX input value (optional but good)
    document.querySelectorAll("[data-i18n-value]").forEach(el => {
      const key = el.getAttribute("data-i18n-value");

      el.value =
        TRANSLATIONS[currentLang]?.[key] ||
        TRANSLATIONS.en?.[key] ||
        "";
    });
  };
})();
