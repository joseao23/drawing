# 會計抽籤系統 (Drawing System)

多啦A夢風格的抽籤應用，使用 React + TypeScript + Vite 建置。

## 快速開始

```bash
# 安裝套件
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器會在 http://localhost:3000 啟動。

## Scripts

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 建置生產版本到 `dist/` |
| `npm run preview` | 預覽生產版本 |

## 專案結構

```
├── App.tsx           # 主應用元件
├── index.tsx         # React 入口點
├── index.html        # HTML 模板
├── components/       # React 元件
├── constants.ts      # 常數定義
├── types.ts          # TypeScript 類型定義
├── vite.config.ts    # Vite 設定
└── .github/workflows/
    └── deploy.yml    # GitHub Actions 部署設定
```

部署完成後，應用會在 `https://<username>.github.io/drawing/` 上線。

## 技術棧

- **React 19** - UI 框架
- **TypeScript** - 類型安全
- **Vite** - 建置工具
- **Tailwind CSS** - 樣式（via CDN）
