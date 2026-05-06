# 수령 명단 확인 웹

Vercel에 배포해서 여러 운영진이 동시에 사용할 수 있는 명단 확인 웹입니다.

## 구조

- 메인 홈에서 4개 명단 중 하나 선택
- 굿즈 프리오더 수령: 이름 / 연락처 / 생일 검색
- 팔찌 1일차, 2일차, 3일차 수령: 이름 / 학번 / 연락처 검색
- 수령 확인 버튼 클릭 시 Google Sheets 해당 탭의 해당 열에 `O` 기록

## 중요한 점

굿즈와 팔찌가 서로 다른 시트 탭 이름이어도 됩니다.
지금 코드는 카테고리마다 다른 탭을 읽고, 같은 탭에 다시 `O`를 기록하도록 되어 있습니다.

## 환경변수

아래 값을 Vercel에 넣어주세요.

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOODS_PREORDER_SHEET_NAME=
WRISTBAND_DAY1_SHEET_NAME=
WRISTBAND_DAY2_SHEET_NAME=
WRISTBAND_DAY3_SHEET_NAME=
```

예시:

```text
GOODS_PREORDER_SHEET_NAME=굿즈 프리오더 수령
WRISTBAND_DAY1_SHEET_NAME=팔찌 1일차 수령
WRISTBAND_DAY2_SHEET_NAME=팔찌 2일차 수령
WRISTBAND_DAY3_SHEET_NAME=팔찌 3일차 수령
```

## 권장 시트 헤더

굿즈 탭:

```text
name | phone | birthday | note | 농구 | 야구(W) | 야구(B) | 하키 | 티셔츠1 | 티셔츠2 | 슬로건 | 반다나 | 타투1 | 타투2 | 스티커1 | 스티커2 | 카라비너1 | 카라비너2 | 카라비너3 | 카라비너4 | 데님백 | goods_preorder_received
```

팔찌 1일차 탭:

```text
name | student_id | phone | wristband_day1_received
```

팔찌 2일차 탭:

```text
name | student_id | phone | wristband_day2_received
```

팔찌 3일차 탭:

```text
name | student_id | phone | wristband_day3_received
```

## 설정 순서

1. Google Cloud에서 `Google Sheets API`를 켭니다.
2. 서비스 계정을 만들고 JSON 키를 발급받습니다.
3. 스프레드시트를 서비스 계정 이메일에 편집 권한으로 공유합니다.
4. 스프레드시트 ID와 각 탭 이름을 Vercel 환경변수에 넣습니다.
5. Vercel로 배포합니다.
