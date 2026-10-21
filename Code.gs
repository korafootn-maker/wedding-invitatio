/**
 * Google Apps Script endpoint for wedding RSVPs.
 * Setup:
 * 1. Create a Google Sheet and add a tab named RSVPs.
 * 2. In Extensions > Apps Script, paste this code.
 * 3. Set SHEET_ID below to the ID in the Sheet URL.
 * 4. Deploy > New deployment > Web app. Execute as: Me.
 *    Who has access: Anyone (if this option is available and appropriate).
 * 5. Copy the Web app URL into config.js as appsScriptUrl.
 *
 * Privacy: responses contain guest names and should be shared only with trusted organizers.
 */
const SHEET_ID = "PASTE_GOOGLE_SHEET_ID_HERE";
const TAB_NAME = "RSVPs";

function doGet() {
  return ContentService.createTextOutput("Wedding RSVP endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME)
      || SpreadsheetApp.openById(SHEET_ID).insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp (UTC)", "Guest name", "Attendance", "Guest count", "Message", "Groom", "Bride"]);
      sheet.setFrozenRows(1);
    }
    const clean = value => String(value == null ? "" : value).slice(0, 1000);
    sheet.appendRow([
      new Date(),
      clean(payload.guestName),
      clean(payload.attendance),
      clean(payload.guests),
      clean(payload.note),
      clean(payload.groom),
      clean(payload.bride)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: String(error)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
