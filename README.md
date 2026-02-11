# AI_kinolights

키노라이츠 스타일 OTT 통합 검색/추천 웹앱 예시입니다.

## 로컬 실행

```bash
npm install
npm run sync:data
npm run dev
```

## 데이터베이스(정적 JSON)

- `public/db/content.json` 파일을 앱의 로컬 DB처럼 사용합니다.
- `npm run sync:data`를 실행하면 웹 API에서 실제 작품 데이터를 수집해 JSON DB를 갱신합니다.
- 수집 분류: 영화 / 드라마 / 예능 / 신작(`isNew` 플래그)

## GitHub Pages 배포

- Source: **GitHub Actions**
- `main` 브랜치 push 시 `.github/workflows/deploy-pages.yml`이 빌드 및 배포를 수행합니다.
- URL 형식: `https://<username>.github.io/AI_kinolights/`
