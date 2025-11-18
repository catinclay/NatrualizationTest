// 题库数据（从 questions.js 导入）
let questions = [];
let currentQuestionIndex = -1;

// Coverage 数据管理
let coverage = {}; // { questionNumber: true/false }

// DOM 元素
const questionText = document.getElementById('questionText');
const questionNumber = document.getElementById('questionNumber');
const questionStatus = document.getElementById('questionStatus');
const answerText = document.getElementById('answerText');
const studyNoteText = document.getElementById('studyNoteText');
const answerSection = document.getElementById('answerSection');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const correctBtn = document.getElementById('correctBtn');
const wrongBtn = document.getElementById('wrongBtn');
const correctCountElement = document.getElementById('correctCount');
const totalCountElement = document.getElementById('totalCount');
const coverageBtn = document.getElementById('coverageBtn');
const resetBtn = document.getElementById('resetBtn');
const coverageModal = document.getElementById('coverageModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const coverageList = document.getElementById('coverageList');
const modalCorrectCount = document.getElementById('modalCorrectCount');
const modalTotalCount = document.getElementById('modalTotalCount');
const coveragePercent = document.getElementById('coveragePercent');
const modalContent = document.querySelector('.modal-content');

// 从 localStorage 加载 coverage
function loadCoverage() {
    const saved = localStorage.getItem('questionCoverage');
    if (saved) {
        coverage = JSON.parse(saved);
    }
}

// 保存 coverage 到 localStorage
function saveCoverage() {
    localStorage.setItem('questionCoverage', JSON.stringify(coverage));
}

// 获取已答对题目数量
function getCorrectCount() {
    return Object.values(coverage).filter(v => v === true).length;
}

// 更新统计信息
function updateStats() {
    const correct = getCorrectCount();
    const total = questions.length;
    correctCountElement.textContent = correct;
    totalCountElement.textContent = total;
    modalCorrectCount.textContent = correct;
    modalTotalCount.textContent = total;
    coveragePercent.textContent = total > 0 ? Math.round((correct / total) * 100) : 0;
}

// 获取题目状态文本
function getQuestionStatus(questionNumber) {
    if (coverage[questionNumber] === true) {
        return '✓ 已答对';
    } else if (coverage[questionNumber] === false) {
        return '✗ 未答对';
    }
    return '○ 未复习';
}

// 加载题库
function loadQuestions() {
    // 直接使用从 questions.js 导入的数据
    if (typeof questionsData !== 'undefined' && questionsData.length > 0) {
        questions = questionsData;
        loadCoverage();
        updateStats();
        loadRandomQuestion();
    } else {
        questionText.textContent = '题库数据加载失败，请检查 questions.js 文件';
        console.error('questionsData 未定义或为空');
    }
}

// 加载指定题号的问题
function loadQuestionByNumber(number) {
    const index = questions.findIndex(q => q.number === number);
    if (index !== -1) {
        currentQuestionIndex = index;
        displayQuestion();
        closeCoverageModal();
    }
}

// 显示当前问题
function displayQuestion() {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) return;
    
    const question = questions[currentQuestionIndex];
    
    // 显示问题
    questionText.textContent = question.question;
    questionNumber.textContent = `#${question.number}`;
    questionStatus.textContent = getQuestionStatus(question.number);
    questionStatus.className = 'question-status ' + (coverage[question.number] === true ? 'status-correct' : 
                                                     coverage[question.number] === false ? 'status-wrong' : 'status-pending');
    
    // 隐藏答案
    answerSection.classList.add('hidden');
    showAnswerBtn.classList.remove('hidden');
    correctBtn.classList.add('hidden');
    wrongBtn.classList.add('hidden');
    showAnswerBtn.disabled = false;
    
    // 设置答案和学习笔记（但不显示）
    answerText.textContent = question.answer;
    studyNoteText.textContent = question.studyNote || '暂无学习笔记';
}

// 加载随机问题
function loadRandomQuestion() {
    if (questions.length === 0) return;

    // 随机选择一个问题（避免连续相同）
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === currentQuestionIndex && questions.length > 1);
    
    currentQuestionIndex = newIndex;
    displayQuestion();
}

// 显示答案
function showAnswer() {
    answerSection.classList.remove('hidden');
    showAnswerBtn.classList.add('hidden');
    correctBtn.classList.remove('hidden');
    wrongBtn.classList.remove('hidden');
}

// 标记为答对
function markCorrect() {
    const question = questions[currentQuestionIndex];
    coverage[question.number] = true;
    saveCoverage();
    updateStats();
    updateQuestionStatus();
    loadRandomQuestion();
}

// 标记为答错
function markWrong() {
    const question = questions[currentQuestionIndex];
    coverage[question.number] = false;
    saveCoverage();
    updateStats();
    updateQuestionStatus();
    loadRandomQuestion();
}

// 更新题目状态显示
function updateQuestionStatus() {
    const question = questions[currentQuestionIndex];
    questionStatus.textContent = getQuestionStatus(question.number);
    questionStatus.className = 'question-status ' + (coverage[question.number] === true ? 'status-correct' : 
                                                     coverage[question.number] === false ? 'status-wrong' : 'status-pending');
}

// 显示 coverage 模态框
function showCoverageModal() {
    coverageModal.classList.remove('hidden');
    renderCoverageList();
    updateStats();
}

// 关闭 coverage 模态框
function closeCoverageModal() {
    coverageModal.classList.add('hidden');
}

// 渲染 coverage 列表
function renderCoverageList() {
    coverageList.innerHTML = '';
    
    questions.forEach(question => {
        const item = document.createElement('div');
        item.className = 'coverage-item';
        
        const questionStatus = coverage[question.number];
        if (questionStatus === true) {
            item.classList.add('coverage-correct');
        } else if (questionStatus === false) {
            item.classList.add('coverage-wrong');
        } else {
            item.classList.add('coverage-pending');
        }
        
        const number = question.number;
        const statusText = getQuestionStatus(number);
        
        item.innerHTML = `
            <span class="coverage-number">#${number}</span>
            <span class="coverage-status">${statusText}</span>
            <button class="btn btn-small coverage-jump-btn" data-number="${number}">跳转</button>
        `;
        
        const jumpBtn = item.querySelector('.coverage-jump-btn');
        jumpBtn.addEventListener('click', () => loadQuestionByNumber(number));
        
        coverageList.appendChild(item);
    });
}

// 清空进度
function resetProgress() {
    if (confirm('确定要清空所有复习进度吗？此操作无法撤销。')) {
        coverage = {};
        saveCoverage();
        updateStats();
        updateQuestionStatus();
        renderCoverageList();
        alert('进度已清空！');
    }
}

// 事件监听
showAnswerBtn.addEventListener('click', showAnswer);
correctBtn.addEventListener('click', markCorrect);
wrongBtn.addEventListener('click', markWrong);
coverageBtn.addEventListener('click', showCoverageModal);
resetBtn.addEventListener('click', resetProgress);

// 关闭按钮事件（阻止事件冒泡）
closeModalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCoverageModal();
});

// 点击模态框外部关闭
coverageModal.addEventListener('click', (e) => {
    if (e.target === coverageModal) {
        closeCoverageModal();
    }
});

// 阻止模态框内容区域的点击事件冒泡
if (modalContent) {
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// 页面加载时初始化
loadQuestions();
