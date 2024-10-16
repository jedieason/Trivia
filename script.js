let questions = [];
let currentQuestion = {};
let acceptingAnswers = true;
let selectedOption = null;
let correct = 0;
let wrong = 0;
let selectedJson = null; // 初始為 null
let isTestCompleted = false; // Flag to track test completion

// 初始化測驗
async function initQuiz() {
    await loadQuestions();
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'flex';
    loadNewQuestion();
}

// 加載題目
async function loadQuestions() {
    try {
        const response = await fetch(selectedJson);
        questions = await response.json();
    } catch (error) {
        console.error('Failed to load the question.', error);
    }
}

// 洗牌函數
function shuffle(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i +1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadNewQuestion() {
    // 重置狀態
    acceptingAnswers = true;
    selectedOption = null;
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('confirm-btn').disabled = false;
    document.getElementById('confirm-btn').style.display = 'block';
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });

    if (questions.length === 0) {
        // 沒有更多題目，結束測驗
        showEndScreen();
        return;
    }

    // 獲取隨機題目
    shuffle(questions);
    currentQuestion = questions.pop(); // 取出一題

    // 更新題目文本
    document.getElementById('question').innerText = currentQuestion.question;

    // 原始選項對應標籤
    const optionLabels = ['A', 'B', 'C', 'D', 'E'];
    const optionEntries = Object.entries(currentQuestion.options);
    shuffle(optionEntries);

    // 正確構建 labelMapping
    let labelMapping = {};
    for (let i = 0; i < optionEntries.length; i++) {
        const [originalLabel, _] = optionEntries[i];
        labelMapping[originalLabel] = optionLabels[i];
    }

    // 更新選項
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    let newOptions = {};
    let newAnswer = '';
    for (let i = 0; i < optionEntries.length; i++) {
        const [label, text] = optionEntries[i];
        const newLabel = optionLabels[i];
        newOptions[newLabel] = text;

        const button = document.createElement('button');
        button.classList.add('option-button');
        button.dataset.option = newLabel;
        button.innerText = `${newLabel}: ${text}`;
        button.addEventListener('click', selectOption);
        optionsContainer.appendChild(button);

        if (label === currentQuestion.answer) {
            newAnswer = newLabel;
        }
    }

    // 更新題目的選項和答案
    currentQuestion.options = newOptions;
    currentQuestion.answer = newAnswer;

    // 更新詳解中的選項標籤
    currentQuestion.explanation = updateExplanationOptions(currentQuestion.explanation, labelMapping);
}

// 更新詳解中的選項標籤
function updateExplanationOptions(explanation, labelMapping) {
    // 找到所有括號內的選項標籤
    if (!explanation) {
        return 'There is no detailed explanation for this question.';
    }
    return explanation.replace(/\((A|B|C|D|E)\)/g, function(match, label) {
        // 替換為洗牌後的選項標籤
        let newLabel = labelMapping[label] || label;
        return `(${newLabel})`;
    });
}

// 選擇選項
function selectOption(event) {
    if (!acceptingAnswers) return;
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    selectedOption = event.currentTarget.dataset.option;
}

// 取得模態窗口和確認按鈕元素
const customAlert = document.getElementById('customAlert');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalMessage = document.getElementById('modal-message'); // 新增

// 設置模態窗口的訊息
function setModalMessage(message) {
    modalMessage.innerText = message;
}

// 顯示自訂模態窗口
function showCustomAlert(message) {
    setModalMessage(message);
    customAlert.style.display = 'flex';
}

// 隱藏自訂模態窗口
function hideCustomAlert() {
    customAlert.style.display = 'none';
}

// 修改確認按鈕的事件監聽器
modalConfirmBtn.addEventListener('click', () => {
    hideCustomAlert();
    if (isTestCompleted) {
        location.reload(); // Reload the page if the test is completed
    }
});

// 修改 confirmAnswer 函數以使用自訂模態窗口
function confirmAnswer() {
    if (!selectedOption) {
        showCustomAlert('Choose something!');
        return;
    }

    acceptingAnswers = false;
    document.getElementById('confirm-btn').disabled = true;

    const selectedBtn = document.querySelector(`.option-button[data-option='${selectedOption}']`);

    if (selectedOption === currentQuestion.answer) {
        selectedBtn.classList.add('correct');
        updateCorrect();
    } else {
        selectedBtn.classList.add('incorrect');
        // 高亮正確答案
        const correctBtn = document.querySelector(`.option-button[data-option='${currentQuestion.answer}']`);
        correctBtn.classList.add('correct');
        updateWrong();
    }

    // 顯示解釋
    document.getElementById('explanation-text').innerText = currentQuestion.explanation;
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('confirm-btn').style.display = 'none';
}

// 更新答對數
function updateCorrect() {
    correct += 1;
    document.getElementById('correct').innerText = correct;
}

// 更新答錯數
function updateWrong() {
    wrong += 1;
    document.getElementById('wrong').innerText = wrong;
}

// 顯示結束畫面
function showEndScreen() {
    isTestCompleted = true; // Indicate that the test has been completed
    showCustomAlert(`Test completed!\nCorrect: ${correct}, Incorrect: ${wrong}.`);
}

function copyQuestion() {
    // Ensure there is a current question loaded
    if (!currentQuestion.question) {
        alert('No question to copy.');
        return;
    }

    // Build the formatted text
    let textToCopy = '';
    // Include the question
    textToCopy += 'Question:\n' + currentQuestion.question + '\n';
    // Include options, marking the correct one
    // textToCopy += 'Options:\n';
    for (let [optionKey, optionText] of Object.entries(currentQuestion.options)) {
        if (optionKey === currentQuestion.answer) {
            // Mark the correct option
            textToCopy += optionKey + ': ' + optionText + ' (Correct)\n';
        } else {
            textToCopy += optionKey + ': ' + optionText + '\n';
        }
    }
    // Include the explanation
    textToCopy += '\nExplanation:\n' + (currentQuestion.explanation || 'No explanation provided.');

    navigator.clipboard.writeText(textToCopy).then(function() {
        // Optional: Provide feedback to the user
        showCustomAlert('Question copied to clipboard!');
    }, function(err) {
        // Fallback in case of an error
        alert('Could not copy text: ' + err);
    });
}



// 事件監聽器
document.getElementById('startGame').addEventListener('click', () => {
    if (!selectedJson) {
        showCustomAlert('Please select a question bank first!');
        return;
    }
    initQuiz();
});
document.getElementById('confirm-btn').addEventListener('click', confirmAnswer);
document.getElementById('next-btn').addEventListener('click', loadNewQuestion);
document.getElementById('copy-btn').addEventListener('click', copyQuestion);

// 按鍵按下事件（可選）
document.addEventListener('keydown', function(event) {
    if (acceptingAnswers && ['A', 'B', 'C', 'D', 'E'].includes(event.key.toUpperCase())) {
        const optionButton = document.querySelector(`.option-button[data-option='${event.key.toUpperCase()}']`);
        if (optionButton) {
            optionButton.click();
        }
    } else if (event.key === 'Enter') {
        if (acceptingAnswers) {
            confirmAnswer();
        } else {
            loadNewQuestion();
        }
    }
});

// 新增選擇按鈕的功能
const selectButtons = document.querySelectorAll('.select-button');
selectButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 移除其他按鈕的選中狀態
        selectButtons.forEach(btn => btn.classList.remove('selected'));
        // 添加選中狀態到當前按鈕
        button.classList.add('selected');
        // 設定要載入的 JSON 檔案
        selectedJson = button.dataset.json;
    });
});

// 切換模式
const modeToggle = document.getElementById('modeToggle');
const modeToggleHeader = document.getElementById('modeToggle-header');
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const img = modeToggle.querySelector('img');
    if (document.body.classList.contains('dark-mode')) {
        img.src = 'Images/sun.svg'; // Change to sun icon
    } else {
        img.src = 'Images/moon.svg'; // Change to moon icon
    }
});

modeToggleHeader.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const img = modeToggleHeader.querySelector('img');
    if (document.body.classList.contains('dark-mode')) {
        img.src = 'Images/sun.svg'; // Change to sun icon
    } else {
        img.src = 'Images/moon.svg'; // Change to moon icon
    }
});
document.querySelector('.language-button:nth-child(3)').addEventListener('click', function() {
            document.querySelector('.start-title').textContent = '生物化學';
            document.querySelector('#startGame').textContent = '開始';
            document.querySelector('.quiz-title').textContent = '生物化學';
            document.querySelector('.progress-text').textContent = '錯誤';
            document.querySelector('.progress-text:nth-child(2)').textContent = '錯誤';
            document.querySelector('.progress-text:nth-child(1)').textContent = '正確';
            document.querySelector('#confirm-btn').textContent = '確認';
            document.querySelector('#copy-btn').textContent = '複製';
            document.querySelector('#next-btn').textContent = '下一題';
            document.querySelector('#modal-message').textContent = '選一下啦！';
            document.querySelector('#modalConfirmBtn').textContent = '朕知道了';
        });

        // Add event listener for the English button
        document.querySelector('.language-button:nth-child(1)').addEventListener('click', function() {
            document.querySelector('.start-title').textContent = 'Biochemistry';
            document.querySelector('#startGame').textContent = 'Start';
            document.querySelector('.quiz-title').textContent = 'Biochemistry';
            document.querySelector('#wrongArea .progress-text').textContent = 'Wrong'; // 修改這行
            document.querySelector('#correctArea .progress-text').textContent = 'Correct'; // 新增這行
            document.querySelector('#confirm-btn').textContent = 'Confirm';
            document.querySelector('#copy-btn').textContent = 'Copy';
            document.querySelector('#next-btn').textContent = 'Next';
            document.querySelector('#modal-message').textContent = 'Choose something';
            document.querySelector('#modalConfirmBtn').textContent = 'Got it!';
        });

// 為兩個 profile pic 添加點擊事件
document.getElementById('userButton').addEventListener('click', toggleExpand);
document.getElementById('userButton-homepage').addEventListener('click', toggleExpand);
document.getElementById('signOutButton').addEventListener('click', toggleExpand);

function toggleExpand(event) {
    const frame = event.currentTarget.nextElementSibling;
    const logoutButton = frame.querySelector('.logout-button');
    
    if (!frame.classList.contains('expanded') && !frame.classList.contains('till-button-expanded')) {
        frame.classList.add('expanded');
        logoutButton.classList.add('show-logout');
        setTimeout(() => {
            frame.classList.remove('expanded');
            frame.classList.add('till-button-expanded');
        }, 300);
    } else {
        if (frame.classList.contains('till-button-expanded')) {
            frame.classList.remove('till-button-expanded');
            frame.classList.add('expanded');
            logoutButton.classList.remove('show-logout');
            setTimeout(() => {
                frame.classList.remove('expanded');
            }, 300);
        } else {
            frame.classList.remove('expanded');
            logoutButton.classList.remove('show-logout');
        }
    }
}
