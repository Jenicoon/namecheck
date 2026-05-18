import { CATEGORY_CONFIG } from "../lib/config.js";
import { assertSheetEnv, loadRows } from "../lib/sheets.js";

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

function validateCategory(category) {
  const config = CATEGORY_CONFIG[category];
  if (!config) {
    throw new Error("Invalid category");
  }
  return config;
}

function getFieldValue(row, fieldConfig) {
  for (const alias of fieldConfig.aliases || []) {
    if (row[alias] !== undefined && row[alias] !== "") {
      return row[alias];
    }
  }
  return "";
}

function hasMeaningfulValue(value) {
  const normalized = String(value || "").trim();
  return normalized !== "" && normalized !== "0";
}

function isMarked(value) {
  return String(value || "").trim().toUpperCase() === "O";
}

function buildRecord(row, categoryConfig) {
  const received = isMarked(row[categoryConfig.sheetColumn]);
  const rawNote = row.note || row.NOTE || row.Note || "";
  const rawTwotwo = row.twotwo || row.TWOTWO || row.TwoTwo || "";
  const info = {};

  for (const field of categoryConfig.infoFields || []) {
    info[field.key] = getFieldValue(row, field);
  }

  const goods = (categoryConfig.goodsFields || [])
    .map((field) => ({
      key: field.key,
      label: field.label,
      value: getFieldValue(row, field)
    }))
    .filter((item) => hasMeaningfulValue(item.value));

  return {
    rowNumber: row.__rowNumber,
    info,
    note: isMarked(rawNote) ? "" : rawNote,
    tattooSticker: isMarked(rawNote),
    extraOrder: isMarked(rawTwotwo),
    goods,
    received
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    assertSheetEnv();

    const category = String(req.query.category || "");
    const categoryConfig = validateCategory(category);
    const filters = (categoryConfig.searchFields || [])
      .map((field) => ({
        ...field,
        query: String(req.query[field.key] || "")
      }))
      .filter((field) => normalizeValue(field.query));

    if (!filters.length) {
      return sendJson(res, 400, { error: "검색어를 입력해주세요." });
    }

    const rows = await loadRows(categoryConfig.sheetEnvKey);
    const matches = rows
      .filter((row) =>
        filters.every((field) => normalizeValue(getFieldValue(row, field)) === normalizeValue(field.query))
      )
      .map((row) => buildRecord(row, categoryConfig));

    return sendJson(res, 200, {
      category: categoryConfig,
      count: matches.length,
      records: matches
    });
  } catch (error) {
    console.error("Failed to load records", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    });

    return sendJson(res, 500, {
      error: error.message || "명단을 불러오지 못했습니다."
    });
  }
}
