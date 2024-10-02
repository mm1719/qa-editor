# 目錄結構
```plaintext
qa-editor/
├── node_modules/
├── public/
│   ├── js/
│   │   └── app.js
│   ├── index.html
│   └── styles.css
├── .gitignore
├── example.txt             # 範例文字檔
├── package-lock.json
├── package.json
├── README.md
├── server.ts
└── tsconfig.json
```

# 安裝和運行
1. clone 到本地:
```git clone https://github.com/mm1719/qa-editor.git```
2. 安裝與啟動:
```
cd qa-editor
npm install
npx ts-node server.ts
```

# 加入欲修改的JSON檔
1. 校園小幫手英文QA -> QA**_filter -> 複製第一欄的內容到記事本
2. 儲存後將其加入到 qa-editor (跟 `example.txt` 同目錄)