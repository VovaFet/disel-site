// Apps Script for the leads sheet ("DieselMedic — заявки з сайту"): the Cloudflare Worker (worker/index.ts) posts
// every chat message here, and it becomes a row on the «Заявки» tab. Setup is in docs/deploy.md
// ("Chat form"): paste this into the sheet's Extensions → Apps Script, run setup() once, then
// Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
//
// The web app is open to anyone who knows its address, so it accepts only requests carrying the key that
// setup() keeps in the script properties (the Worker has it as LEADS_SHEET_KEY).

const TAB = 'Заявки';

// Creates the key on the first run and prints it (View → Logs, or the log below the editor)
function setup() {
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('KEY');
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('KEY', key);
  }
  Logger.log('LEADS_SHEET_KEY = ' + key);
}

// A value the sheet must keep as text: one starting with = + - @ would otherwise be read as a formula
const plain = (v) => {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
};

function doPost(e) {
  const key = PropertiesService.getScriptProperties().getProperty('KEY');
  if (!key || e.parameter.key !== key) return ContentService.createTextOutput('forbidden');
  const lead = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActive().getSheetByName(TAB);
  // Дата | Ім'я | Телефон | Повідомлення | Сторінка | Мова | Статус | Коментар
  // The phone always as text, or 0501234567 would lose its leading zero
  sheet.appendRow([new Date(), plain(lead.name), "'" + (lead.phone || ''), plain(lead.message), plain(lead.page),
    plain(lead.lang), lead.test ? 'тест' : '', '']);
  return ContentService.createTextOutput('ok');
}
