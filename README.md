# 🇺🇸 入籍考试复习工具

一个基于网页的入籍考试复习工具，支持随机出题、答案隐藏和移动端适配。

## ✨ 功能特点

- 🎲 **随机出题**：每次加载随机显示问题，避免重复
- 🔒 **答案隐藏**：先思考再查看答案，提高学习效果
- 📚 **学习笔记**：每道题都配有详细的学习笔记
- 📱 **响应式设计**：完美适配手机、平板和桌面设备
- 📊 **练习统计**：记录已练习题目数量

## 🚀 使用方法

### 本地使用

1. 克隆或下载此仓库
2. 直接在浏览器中打开 `index.html` 文件
3. 开始练习！

### GitHub Pages 部署

1. 将此仓库推送到 GitHub
2. 进入仓库的 **Settings** → **Pages**
3. 选择 **Source** 为 `main` 分支（或你的主分支）
4. 点击 **Save**
5. 等待几分钟后，访问 `https://你的用户名.github.io/仓库名/`

## 📝 添加题目

编辑 `question_database.txt` 文件，按照以下格式添加题目：

```
Q: 你的问题
A: 答案
StudyNote: 学习笔记内容

Q: 下一个问题
A: 答案
StudyNote: 学习笔记内容
```

## 📁 项目结构

```
NatrualizationTest/
├── index.html              # 主页面
├── style.css               # 样式文件
├── script.js               # JavaScript 逻辑
├── question_database.txt    # 题库文件
└── README.md               # 项目说明
```

## 🛠️ 技术栈

- HTML5
- CSS3 (响应式设计)
- JavaScript (原生，无需框架)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**祝您考试顺利！** 💪

