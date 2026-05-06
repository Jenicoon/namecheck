const categories = [
  {
    key: "goods_preorder",
    title: "굿즈 프리오더 수령",
    description: "이름, 연락처, 생일로 검색하고 신청한 굿즈 품목을 한 번에 확인합니다.",
    fields: [
      { key: "name", label: "이름", placeholder: "예: 홍길동" },
      { key: "phone", label: "연락처", placeholder: "예: 01012345678" },
      { key: "birthday", label: "생일", placeholder: "예: 0101 또는 2001-01-01" }
    ],
    type: "goods"
  },
  {
    key: "wristband_day1",
    title: "팔찌 1일차 수령",
    description: "이름, 학번, 연락처로 검색하고 수령 여부만 빠르게 체크합니다.",
    fields: [
      { key: "name", label: "이름", placeholder: "예: 홍길동" },
      { key: "student_id", label: "학번", placeholder: "예: 20260001" },
      { key: "phone", label: "연락처", placeholder: "예: 01012345678" }
    ],
    type: "wristband"
  },
  {
    key: "wristband_day2",
    title: "팔찌 2일차 수령",
    description: "이름, 학번, 연락처로 검색하고 수령 여부만 빠르게 체크합니다.",
    fields: [
      { key: "name", label: "이름", placeholder: "예: 홍길동" },
      { key: "student_id", label: "학번", placeholder: "예: 20260001" },
      { key: "phone", label: "연락처", placeholder: "예: 01012345678" }
    ],
    type: "wristband"
  },
  {
    key: "wristband_day3",
    title: "팔찌 3일차 수령",
    description: "이름, 학번, 연락처로 검색하고 수령 여부만 빠르게 체크합니다.",
    fields: [
      { key: "name", label: "이름", placeholder: "예: 홍길동" },
      { key: "student_id", label: "학번", placeholder: "예: 20260001" },
      { key: "phone", label: "연락처", placeholder: "예: 01012345678" }
    ],
    type: "wristband"
  }
];

const state = {
  activeCategory: null,
  results: []
};

const categoryGrid = document.querySelector("#categoryGrid");
const homeView = document.querySelector("#homeView");
const categoryView = document.querySelector("#categoryView");
const activeCategoryTitle = document.querySelector("#activeCategoryTitle");
const backButton = document.querySelector("#backButton");
const searchForm = document.querySelector("#searchForm");
const searchFields = document.querySelector("#searchFields");
const searchGuide = document.querySelector("#searchGuide");
const statusBox = document.querySelector("#statusBox");
const resultCount = document.querySelector("#resultCount");
const resultsList = document.querySelector("#resultsList");

function setStatus(message) {
  statusBox.textContent = message;
}

function setResultCount(message) {
  resultCount.textContent = message;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCategories() {
  categoryGrid.innerHTML = categories
    .map(
      (category) => `
        <button class="category-card" type="button" data-category="${category.key}">
          <p class="eyebrow">CHECK-IN</p>
          <h3>${category.title}</h3>
          <p>${category.description}</p>
          <span class="card-pill">명단 열기</span>
        </button>
      `
    )
    .join("");
}

function resetResults() {
  state.results = [];
  resultsList.className = "results-list empty-state";
  resultsList.textContent = "검색 결과가 여기에 표시됩니다.";
  setResultCount("아직 검색하지 않았습니다.");
}

function showHome() {
  state.activeCategory = null;
  homeView.classList.add("is-active");
  categoryView.classList.remove("is-active");
  searchFields.innerHTML = "";
  searchGuide.textContent = "카테고리를 선택하면 검색 칸이 바뀝니다.";
  setStatus("카테고리를 선택하면 해당 명단 검색 화면으로 이동합니다.");
  resetResults();
}

function renderSearchFields(category) {
  searchFields.innerHTML = category.fields
    .map(
      (field) => `
        <label>
          <span>${field.label}</span>
          <input
            type="text"
            name="${field.key}"
            autocomplete="off"
            placeholder="${field.placeholder}"
          />
        </label>
      `
    )
    .join("");
}

function showCategory(categoryKey) {
  const category = categories.find((item) => item.key === categoryKey);
  if (!category) {
    return;
  }

  state.activeCategory = category;
  homeView.classList.remove("is-active");
  categoryView.classList.add("is-active");
  activeCategoryTitle.textContent = category.title;
  renderSearchFields(category);
  searchGuide.textContent = `${category.fields.map((field) => field.label).join(", ")} 중 하나 이상 입력해서 검색해주세요.`;
  setStatus("검색 조건을 입력한 뒤 검색 버튼을 눌러주세요.");
  resetResults();

  const firstInput = searchFields.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
}

function renderGoodsList(goods) {
  if (!goods.length) {
    return '<div class="goods-empty">신청된 굿즈 항목이 없습니다.</div>';
  }

  return `
    <div class="goods-grid">
      ${goods
        .map(
          (item) => `
            <div class="goods-chip">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(item.value)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderInfo(record) {
  const infoEntries = Object.entries(record.info || {}).filter(([, value]) => value);
  return infoEntries
    .map(([key, value]) => {
      const labelMap = {
        name: "이름",
        student_id: "학번",
        phone: "연락처",
        birthday: "생일"
      };
      return `<span>${labelMap[key] || key} ${escapeHtml(value)}</span>`;
    })
    .join("");
}

function renderResults(records) {
  state.results = records;

  if (!records.length) {
    resultsList.className = "results-list empty-state";
    resultsList.textContent = "일치하는 명단이 없습니다.";
    setResultCount("0명 찾음");
    return;
  }

  resultsList.className = "results-list";
  setResultCount(`${records.length}명 찾음`);
  resultsList.innerHTML = records
    .map(
      (record) => `
        <article class="result-card result-card-${state.activeCategory.type}">
          <div class="result-main">
            <div class="result-topline">
              <div class="state-pill ${record.received ? "done" : "pending"}">
                ${record.received ? "수령 완료" : "수령 전"}
              </div>
              <h4 class="person-name">${escapeHtml(record.info?.name || "이름 없음")}</h4>
            </div>
            <div class="person-meta">
              ${renderInfo(record)}
            </div>
            ${
              state.activeCategory.type === "goods"
                ? renderGoodsList(record.goods || [])
                : ""
            }
            ${
              record.note
                ? `<p class="record-note">${escapeHtml(record.note)}</p>`
                : ""
            }
          </div>
          <div class="result-side">
            <button
              class="action-button"
              type="button"
              data-row-number="${record.rowNumber}"
              ${record.received ? "disabled" : ""}
            >
              ${record.received ? "확인됨" : "수령 확인"}
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function getSearchValues() {
  const formData = new FormData(searchForm);
  const values = {};
  if (!state.activeCategory) {
    return values;
  }

  for (const field of state.activeCategory.fields) {
    values[field.key] = String(formData.get(field.key) || "").trim();
  }

  return values;
}

async function searchRecords(filters) {
  const params = new URLSearchParams({ category: state.activeCategory.key });
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const response = await fetch(`./api/records?${params.toString()}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "검색 중 오류가 발생했습니다.");
  }

  return payload.records;
}

async function markReceived(rowNumber) {
  const response = await fetch("./api/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      category: state.activeCategory.key,
      rowNumber
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "수령 확인 저장에 실패했습니다.");
  }
}

categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) {
    return;
  }
  showCategory(button.dataset.category);
});

backButton.addEventListener("click", showHome);

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!state.activeCategory) {
    return;
  }

  const filters = getSearchValues();
  const hasValue = Object.values(filters).some(Boolean);
  if (!hasValue) {
    setStatus("검색 조건을 하나 이상 입력해주세요.");
    return;
  }

  setStatus("명단을 검색하고 있습니다...");
  resultsList.className = "results-list empty-state";
  resultsList.textContent = "검색 중입니다.";

  try {
    const records = await searchRecords(filters);
    renderResults(records);
    setStatus(records.length ? "검색이 완료되었습니다." : "일치하는 명단이 없습니다.");
  } catch (error) {
    resultsList.className = "results-list empty-state";
    resultsList.textContent = "오류가 발생했습니다.";
    setStatus(error.message);
    setResultCount("검색 실패");
  }
});

resultsList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-row-number]");
  if (!button) {
    return;
  }

  const rowNumber = Number(button.dataset.rowNumber);
  button.disabled = true;
  button.textContent = "저장 중...";

  try {
    await markReceived(rowNumber);
    state.results = state.results.map((record) =>
      record.rowNumber === rowNumber ? { ...record, received: true } : record
    );
    renderResults(state.results);
    setStatus("수령 확인이 저장되었습니다.");
  } catch (error) {
    button.disabled = false;
    button.textContent = "수령 확인";
    setStatus(error.message);
  }
});

renderCategories();
showHome();
