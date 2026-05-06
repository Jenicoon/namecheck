import { CATEGORY_CONFIG } from "../lib/config.js";
import { assertSheetEnv, markReceived } from "../lib/sheets.js";

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    assertSheetEnv();

    const { category, rowNumber } = req.body || {};
    const categoryConfig = CATEGORY_CONFIG[category];

    if (!categoryConfig) {
      return sendJson(res, 400, { error: "유효하지 않은 카테고리입니다." });
    }

    if (!rowNumber || Number.isNaN(Number(rowNumber))) {
      return sendJson(res, 400, { error: "유효하지 않은 행 번호입니다." });
    }

    await markReceived({
      rowNumber: Number(rowNumber),
      columnName: categoryConfig.sheetColumn,
      sheetEnvKey: categoryConfig.sheetEnvKey
    });

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 500, {
      error: error.message || "수령 확인 저장에 실패했습니다."
    });
  }
}
