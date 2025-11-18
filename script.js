// 題庫數據（從 questions.js 導入）
let questions = [];
let currentQuestionIndex = -1;

// Coverage 數據管理
let coverage = {}; // { questionNumber: true/false }

// DOM 元素
const questionText = document.getElementById('questionText');
const questionNumber = document.getElementById('questionNumber');
const questionStatus = document.getElementById('questionStatus');
const answerText = document.getElementById('answerText');
const studyNoteText = document.getElementById('studyNoteText');
const answerSection = document.getElementById('answerSection');
const answerContent = document.getElementById('answerContent');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const correctBtn = document.getElementById('correctBtn');
const wrongBtn = document.getElementById('wrongBtn');
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');
const totalCountElement = document.getElementById('totalCount');
const coverageBtn = document.getElementById('coverageBtn');
const resetBtn = document.getElementById('resetBtn');
const coverageModal = document.getElementById('coverageModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const coverageList = document.getElementById('coverageList');
const modalCorrectCount = document.getElementById('modalCorrectCount');
const modalWrongCount = document.getElementById('modalWrongCount');
const modalTotalCount = document.getElementById('modalTotalCount');
const coveragePercent = document.getElementById('coveragePercent');
const modalContent = document.querySelector('.modal-content');
const jumpToSelectedBtn = document.getElementById('jumpToSelectedBtn');

// 選中的題號
let selectedQuestionNumber = null;

// 從 localStorage 載入 coverage
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

// 獲取已答對題目數量
function getCorrectCount() {
    return Object.values(coverage).filter(v => v === true).length;
}

// 獲取已答錯題目數量
function getWrongCount() {
    return Object.values(coverage).filter(v => v === false).length;
}

// 更新統計資訊
function updateStats() {
    const correct = getCorrectCount();
    const wrong = getWrongCount();
    const total = questions.length;
    correctCountElement.textContent = correct;
    if (wrongCountElement) {
        wrongCountElement.textContent = wrong;
    }
    totalCountElement.textContent = total;
    modalCorrectCount.textContent = correct;
    if (modalWrongCount) {
        modalWrongCount.textContent = wrong;
    }
    modalTotalCount.textContent = total;
    coveragePercent.textContent = total > 0 ? Math.round((correct / total) * 100) : 0;
}

// 獲取題目狀態文字
function getQuestionStatus(questionNumber) {
    if (coverage[questionNumber] === true) {
        return '✓ 已答對';
    } else if (coverage[questionNumber] === false) {
        return '✗ 未答對';
    }
    return '○ 未複習';
}

// 獲取題目狀態圖標
function getQuestionStatusIcon(questionNumber) {
    if (coverage[questionNumber] === true) {
        return '✓';
    } else if (coverage[questionNumber] === false) {
        return '✗';
    }
    return '○';
}

// 載入題庫
function loadQuestions() {
    // 直接使用從 questions.js 導入的數據
    if (typeof questionsData !== 'undefined' && questionsData.length > 0) {
        questions = questionsData;
        loadCoverage();
        updateStats();
        loadRandomQuestion();
    } else {
        questionText.textContent = '題庫數據載入失敗，請檢查 questions.js 檔案';
        console.error('questionsData 未定義或為空');
    }
}

// 載入指定題號的問題
function loadQuestionByNumber(number) {
    const index = questions.findIndex(q => q.number === number);
    if (index !== -1) {
        currentQuestionIndex = index;
        displayQuestion();
        closeCoverageModal();
    }
}

// 顯示當前問題
function displayQuestion() {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) return;
    
    const question = questions[currentQuestionIndex];
    
    // 顯示問題
    questionText.textContent = question.question;
    questionNumber.textContent = `#${question.number}`;
    questionStatus.textContent = getQuestionStatus(question.number);
    questionStatus.className = 'question-status ' + (coverage[question.number] === true ? 'status-correct' : 
                                                     coverage[question.number] === false ? 'status-wrong' : 'status-pending');
    
    // 隱藏答案內容
    answerContent.classList.remove('visible');
    showAnswerBtn.classList.remove('hidden');
    correctBtn.classList.add('hidden');
    wrongBtn.classList.add('hidden');
    showAnswerBtn.disabled = false;
    
    // 設置答案和學習筆記（但不顯示）
    answerText.textContent = question.answer;
    studyNoteText.textContent = question.studyNote || '暫無學習筆記';
}

// 載入隨機問題
function loadRandomQuestion() {
    if (questions.length === 0) return;

    // 隨機選擇一個問題（避免連續相同）
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === currentQuestionIndex && questions.length > 1);
    
    currentQuestionIndex = newIndex;
    displayQuestion();
}

// 顯示答案
function showAnswer() {
    answerContent.classList.add('visible');
    showAnswerBtn.classList.add('hidden');
    correctBtn.classList.remove('hidden');
    wrongBtn.classList.remove('hidden');
}

// 標記為答對
function markCorrect() {
    const question = questions[currentQuestionIndex];
    coverage[question.number] = true;
    saveCoverage();
    updateStats();
    updateQuestionStatus();
    loadRandomQuestion();
}

// 標記為答錯
function markWrong() {
    const question = questions[currentQuestionIndex];
    coverage[question.number] = false;
    saveCoverage();
    updateStats();
    updateQuestionStatus();
    loadRandomQuestion();
}

// 更新題目狀態顯示
function updateQuestionStatus() {
    const question = questions[currentQuestionIndex];
    questionStatus.textContent = getQuestionStatus(question.number);
    questionStatus.className = 'question-status ' + (coverage[question.number] === true ? 'status-correct' : 
                                                     coverage[question.number] === false ? 'status-wrong' : 'status-pending');
}

// 顯示 coverage 模態框
function showCoverageModal() {
    coverageModal.classList.remove('hidden');
    renderCoverageList();
    updateStats();
}

// 關閉 coverage 模態框
function closeCoverageModal() {
    coverageModal.classList.add('hidden');
    selectedQuestionNumber = null;
    jumpToSelectedBtn.disabled = true;
}

// 渲染 coverage 列表
function renderCoverageList() {
    coverageList.innerHTML = '';
    selectedQuestionNumber = null;
    jumpToSelectedBtn.disabled = true;
    
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
        const statusIcon = getQuestionStatusIcon(number);
        
        item.innerHTML = `
            <span class="coverage-icon">${statusIcon}</span>
            <span class="coverage-number">#${number}</span>
        `;
        
        // 點擊選中題目
        item.addEventListener('click', () => {
            // 移除其他項目的選中狀態
            document.querySelectorAll('.coverage-item').forEach(i => {
                i.classList.remove('selected');
            });
            
            // 添加選中狀態
            item.classList.add('selected');
            selectedQuestionNumber = number;
            jumpToSelectedBtn.disabled = false;
        });
        
        coverageList.appendChild(item);
    });
}

// 清空進度
function resetProgress() {
    if (confirm('確定要清空所有複習進度嗎？此操作無法撤銷。')) {
        coverage = {};
        saveCoverage();
        updateStats();
        updateQuestionStatus();
        renderCoverageList();
        alert('進度已清空！');
    }
}

// 跳轉到選中的題目
function jumpToSelected() {
    if (selectedQuestionNumber) {
        loadQuestionByNumber(selectedQuestionNumber);
    }
}

// 事件監聽
showAnswerBtn.addEventListener('click', showAnswer);
correctBtn.addEventListener('click', markCorrect);
wrongBtn.addEventListener('click', markWrong);
coverageBtn.addEventListener('click', showCoverageModal);
resetBtn.addEventListener('click', resetProgress);
jumpToSelectedBtn.addEventListener('click', jumpToSelected);

// 關閉按鈕事件（阻止事件冒泡）
closeModalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCoverageModal();
});

// 點擊模態框外部關閉
coverageModal.addEventListener('click', (e) => {
    if (e.target === coverageModal) {
        closeCoverageModal();
    }
});

// 阻止模態框內容區域的點擊事件冒泡
if (modalContent) {
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// 頁面載入時初始化
loadQuestions();
