export const CATEGORY_CONFIG = {
  goods_preorder: {
    key: "goods_preorder",
    label: "굿즈 프리오더 수령",
    sheetEnvKey: "GOODS_PREORDER_SHEET_NAME",
    sheetColumn: "goods_preorder_received",
    searchFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] },
      { key: "birthday", label: "생일", aliases: ["birthday", "birth", "생일"] }
    ],
    infoFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] },
      { key: "birthday", label: "생일", aliases: ["birthday", "birth", "생일"] }
    ],
    goodsFields: [
      { key: "농구", label: "농구", aliases: ["농구"] },
      { key: "야구W", label: "야구(W)", aliases: ["야구(W)", "야구W"] },
      { key: "야구B", label: "야구(B)", aliases: ["야구(B)", "야구B"] },
      { key: "하키", label: "하키", aliases: ["하키"] },
      { key: "티셔츠1", label: "티셔츠1", aliases: ["티셔츠1"] },
      { key: "티셔츠2", label: "티셔츠2", aliases: ["티셔츠2"] },
      { key: "슬로건", label: "슬로건", aliases: ["슬로건"] },
      { key: "반다나", label: "반다나", aliases: ["반다나"] },
      { key: "타투1", label: "타투1", aliases: ["타투1"] },
      { key: "타투2", label: "타투2", aliases: ["타투2"] },
      { key: "스티커1", label: "스티커1", aliases: ["스티커1"] },
      { key: "스티커2", label: "스티커2", aliases: ["스티커2"] },
      { key: "카라비너1", label: "카라비너1", aliases: ["카라비너1"] },
      { key: "카라비너2", label: "카라비너2", aliases: ["카라비너2"] },
      { key: "카라비너3", label: "카라비너3", aliases: ["카라비너3"] },
      { key: "카라비너4", label: "카라비너4", aliases: ["카라비너4"] },
      { key: "데님백", label: "데님백", aliases: ["데님백"] }
    ]
  },
  wristband_day1: {
    key: "wristband_day1",
    label: "팔찌 1일차 수령",
    sheetEnvKey: "WRISTBAND_DAY1_SHEET_NAME",
    sheetColumn: "wristband_day1_received",
    searchFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "student_id", label: "학번", aliases: ["student_id", "studentId", "학번"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] }
    ],
    infoFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "student_id", label: "학번", aliases: ["student_id", "studentId", "학번"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] }
    ]
  },
  wristband_day2: {
    key: "wristband_day2",
    label: "팔찌 2일차 수령",
    sheetEnvKey: "WRISTBAND_DAY2_SHEET_NAME",
    sheetColumn: "wristband_day2_received",
    searchFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "student_id", label: "학번", aliases: ["student_id", "studentId", "학번"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] }
    ],
    infoFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "student_id", label: "학번", aliases: ["student_id", "studentId", "학번"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] }
    ]
  },
  wristband_day3: {
    key: "wristband_day3",
    label: "팔찌 3일차 수령",
    sheetEnvKey: "WRISTBAND_DAY3_SHEET_NAME",
    sheetColumn: "wristband_day3_received",
    searchFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "student_id", label: "학번", aliases: ["student_id", "studentId", "학번"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] }
    ],
    infoFields: [
      { key: "name", label: "이름", aliases: ["name", "이름"] },
      { key: "student_id", label: "학번", aliases: ["student_id", "studentId", "학번"] },
      { key: "phone", label: "연락처", aliases: ["phone", "연락처", "전화번호"] }
    ]
  }
};

for (const key of ["wristband_day1", "wristband_day2", "wristband_day3"]) {
  CATEGORY_CONFIG[key].infoFields.push(
    { key: "status", label: "status", aliases: ["status", "Status", "STATUS"], columnIndex: 2 },
    { key: "major", label: "major", aliases: ["major", "Major", "MAJOR"], columnIndex: 3 }
  );
}
