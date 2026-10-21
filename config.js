/*
  إعدادات الموقع:
  1) بعد نشر Google Apps Script، ضع رابط Web App في appsScriptUrl.
  2) اكتب رقم واتساب بصيغة دولية من دون + أو مسافات، مثال السودان: 2499XXXXXXXX.
  3) يمكنك تغيير التاريخ/الأسماء/المكان هنا.
*/
window.WEDDING_CONFIG = {
  groomName: "الهادي الزين حمد النيل",
  brideName: "شخص ما",
  dateISO: "2027-01-01T18:00:00+02:00",
  dateArabic: "الجمعة، 1 يناير 2027",
  dateEnglish: "Friday, January 1, 2027",
  venueArabic: "صالة الإحسان — الدويم",
  venueEnglish: "Al-Ihsan Hall — Al-Duwaym, Sudan",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("صالة الإحسان الدويم السودان"),
  whatsappNumber: "+249903837519",
  
appsScriptUrl: "https://script.google.com/macros/s/AKfycbx4ROa9jk8ZfKGiNJJLtTtHGG80-sMUbj8Rsm5dotngp3fDiOyLD3lzr29_OEu6PJd_1g/exec",
  
  groomPhotoUrl: "",
  bridePhotoUrl: ""
};
