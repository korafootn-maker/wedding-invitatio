(() => {
  const cfg = window.WEDDING_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  $("groomName").textContent = cfg.groomName || "اسم العريس";
  $("brideName").textContent = cfg.brideName || "اسم العروس";
  $("dateText").textContent = cfg.dateArabic || "تاريخ الحفل";
  $("venueText").textContent = cfg.venueArabic || "مكان الحفل";
  $("mapLink").href = cfg.mapUrl || "https://maps.google.com";
  if (cfg.groomPhotoUrl) $("groomPhoto").src = cfg.groomPhotoUrl;
  if (cfg.bridePhotoUrl) $("bridePhoto").src = cfg.bridePhotoUrl;

  let language = "ar";
  const originalTexts = new Map();
  document.querySelectorAll("[data-ar][data-en]").forEach(el => originalTexts.set(el, el.textContent));
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-ar][data-en]").forEach(el => el.textContent = el.dataset[next]);
    $("dateText").textContent = next === "ar" ? (cfg.dateArabic || "") : (cfg.dateEnglish || "");
    $("venueText").textContent = next === "ar" ? (cfg.venueArabic || "") : (cfg.venueEnglish || "");
    $("langToggle").textContent = next === "ar" ? "English" : "العربية";
  }
  $("langToggle").addEventListener("click", () => setLanguage(language === "ar" ? "en" : "ar"));

  const targetDate = new Date(cfg.dateISO || "2027-01-01T18:00:00+02:00").getTime();
  function tick() {
    let diff = Math.max(0, targetDate - Date.now());
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    $("days").textContent = d; $("hours").textContent = h;
    $("minutes").textContent = m; $("seconds").textContent = s;
  }
  tick(); setInterval(tick, 1000);

  function previewUpload(inputId, imageId) {
    $(inputId).addEventListener("change", event => {
      const file = event.target.files && event.target.files[0];
      if (file && file.type.startsWith("image/")) $(imageId).src = URL.createObjectURL(file);
    });
  }
  previewUpload("groomUpload", "groomPhoto");
  previewUpload("brideUpload", "bridePhoto");

  function makeMessage(data) {
    return `Wedding RSVP / تأكيد حضور\\nName / الاسم: ${data.guestName}\\nAttendance / الحضور: ${data.attendance}\\nGuests / العدد: ${data.guests}\\nNote / الرسالة: ${data.note || "-"}\\nCouple: ${cfg.groomName} & ${cfg.brideName}`;
  }
  $("rsvpForm").addEventListener("submit", async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const status = $("formStatus");
    status.textContent = "جارٍ إرسال الرد… / Sending…";
    let sheetSaved = false;
    if (cfg.appsScriptUrl) {
      try {
        // Apps Script Web App must be deployed with access appropriate for guests.
        await fetch(cfg.appsScriptUrl, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({...data, submittedAt: new Date().toISOString(), groom: cfg.groomName, bride: cfg.brideName})
        });
        sheetSaved = true; // no-cors prevents reading the response; verify in the Sheet during testing.
      } catch (err) {
        console.error(err);
      }
    }
    const message = makeMessage(data);
    let whatsappReady = false;
    if (cfg.whatsappNumber) {
      $("whatsappLink").href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(message)}`;
      $("whatsappLink").style.display = "inline-block";
      whatsappReady = true;
      window.open($("whatsappLink").href, "_blank", "noopener");
    }
    if (sheetSaved && whatsappReady) status.textContent = "تم إرسال الطلب لمحاولة الحفظ وفتح واتساب. تحقّق من ظهور الرد في الجدول. / Submitted; verify the Sheet and WhatsApp.";
    else if (sheetSaved) status.textContent = "تم إرسال الطلب لمحاولة الحفظ. تحقّق من Google Sheets للتأكد. / Sent; verify Google Sheets.";
    else if (whatsappReady) status.textContent = "فُتح واتساب لإرسال التأكيد. لم يُحفظ الرد في Sheets لأن الربط غير مكتمل. / WhatsApp opened; Sheets is not connected.";
    else status.textContent = "النموذج تجريبي حالياً. أرسل التأكيد عبر واتساب بعد إعداد رقم المضيف، أو أكمل ربط Google Sheets. / Demo only: configure WhatsApp or Sheets.";
  });

  $("whatsappLink").addEventListener("click", event => {
    if (!cfg.whatsappNumber) {
      event.preventDefault();
      $("formStatus").textContent = "أضف رقم واتساب المضيف في config.js بصيغة دولية لتفعيل الرابط.";
    }
  });
  $("shareBtn").addEventListener("click", async () => {
    const shareData = {title: "دعوة زفاف", text: `دعوة زفاف ${cfg.groomName} و${cfg.brideName}`, url: location.href};
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) { await navigator.clipboard.writeText(location.href); $("formStatus").textContent = "تم نسخ رابط الدعوة."; }
      else window.prompt("انسخ رابط الدعوة:", location.href);
    } catch (_) {}
  });
  // Start Arabic regardless of browser locale.
  setLanguage("ar");
})();
