# 🇺🇸 入籍考試複習工具

一個基於網頁的入籍考試複習工具，支援隨機出題、答案隱藏和行動端適配。

## ✨ 功能特點

- 🎲 **隨機出題**：每次載入隨機顯示問題，避免重複
- 🔒 **答案隱藏**：先思考再查看答案，提高學習效果
- 📚 **學習筆記**：每道題都配有詳細的學習筆記
- 📱 **響應式設計**：完美適配手機、平板和桌面設備
- 📊 **練習統計**：記錄已練習題目數量

## 🚀 使用方法

### 本地使用

1. 克隆或下載此倉庫
2. 直接在瀏覽器中打開 `index.html` 檔案
3. 開始練習！

### GitHub Pages 部署

1. 將此倉庫推送到 GitHub
2. 進入倉庫的 **Settings** → **Pages**
3. 選擇 **Source** 為 `main` 分支（或你的主分支）
4. 點擊 **Save**
5. 等待幾分鐘後，訪問 `https://你的用戶名.github.io/倉庫名/`

## 📝 添加題目

編輯 `question_database.txt` 檔案，按照以下格式添加題目：

```
Q: 你的問題
A: 答案
StudyNote: 學習筆記內容

Q: 下一個問題
A: 答案
StudyNote: 學習筆記內容
```

## 📁 專案結構

```
NatrualizationTest/
├── index.html              # 主頁面
├── style.css               # 樣式檔案
├── script.js               # JavaScript 邏輯
├── question_database.txt    # 題庫檔案
└── README.md               # 專案說明
```

## 🛠️ 技術棧

- HTML5
- CSS3 (響應式設計)
- JavaScript (原生，無需框架)

## 📄 許可證

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**祝您考試順利！** 💪

