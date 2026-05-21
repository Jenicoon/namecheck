import { google } from "googleapis";

const REQUIRED_ENV_VARS = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID"
];

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function assertSheetEnv() {
  REQUIRED_ENV_VARS.forEach(getEnv);
}

function createSheetsClient() {
  const email = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

function getSpreadsheetId() {
  return getEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
}

function getSheetName(sheetEnvKey) {
  const directValue = process.env[sheetEnvKey];
  if (directValue) {
    return directValue;
  }

  // Backward compatibility for older setups that used one shared sheet env var.
  if (sheetEnvKey === "GOODS_PREORDER_SHEET_NAME" && process.env.GOOGLE_SHEETS_SHEET_NAME) {
    return process.env.GOOGLE_SHEETS_SHEET_NAME;
  }

  throw new Error(`Missing environment variable: ${sheetEnvKey}`);
}

export async function loadRows(sheetEnvKey) {
  const sheets = createSheetsClient();
  const range = `${getSheetName(sheetEnvKey)}!A:ZZ`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range
  });

  const values = response.data.values || [];
  if (values.length === 0) {
    return [];
  }

  const [headers, ...rows] = values;
  return rows.map((row, index) => {
    const record = {};
    headers.forEach((header, headerIndex) => {
      record[header] = row[headerIndex] || "";
    });
    record.__columns = row;
    record.__rowNumber = index + 2;
    return record;
  });
}

function getColumnLetter(columnIndex) {
  let result = "";
  let current = columnIndex + 1;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    current = Math.floor((current - 1) / 26);
  }

  return result;
}

export async function markReceived({ rowNumber, columnName, sheetEnvKey, value = "O" }) {
  const sheets = createSheetsClient();
  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${getSheetName(sheetEnvKey)}!1:1`
  });

  const headers = headerResponse.data.values?.[0] || [];
  const columnIndex = headers.indexOf(columnName);
  if (columnIndex === -1) {
    throw new Error(`Sheet column not found: ${columnName}`);
  }

  const cell = `${getSheetName(sheetEnvKey)}!${getColumnLetter(columnIndex)}${rowNumber}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: cell,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[value]]
    }
  });
}
