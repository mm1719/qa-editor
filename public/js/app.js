let conversations = [];
let currentPage = 1;
let currentQuestionIndex = 0;

// 顯示特定頁面
function showPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page${pageNumber}`).classList.add('active');
}

// 顯示訊息框
function showMessage(message) {
    const messageBox = document.getElementById('messageBox');
    messageBox.innerText = message;
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 1000);
}

// 點擊 "Load File" 之後載入檔案
document.getElementById('loadFile').addEventListener('click', () => {
    const filename = document.getElementById('filename').value;

    if (!filename) {
        alert('Please enter a filename.');
        return;
    }

    fetch(`/load?filename=${filename}`)
        .then(response => response.json())
        .then(data => {
            conversations = data;
            currentQuestionIndex = 0; // 重置為第一個問題
            loadQuestion();
            showPage(2); // 跳到第二頁顯示第一個問題
        })
        .catch(error => {
            console.error('Error loading file:', error);
        });
});

// 載入當前問題
function loadQuestion() {
    const question = conversations[currentQuestionIndex];
    document.getElementById('questionTitle').innerText = `Question ${currentQuestionIndex + 1}`;
    document.getElementById('questionContent').innerHTML = question.messages.map((msg, index) => `
        <div>
            <strong>${msg.role}:</strong> ${msg.role === 'assistant' 
            ? `<textarea data-index="${index}" class="assistantInput">${msg.content}</textarea>`
            : `<textarea data-index="${index}" class="questionInput">${msg.content}</textarea>`}
        </div>
    `).join('');
}

function saveChanges() {
    const filename = document.getElementById('filename').value;

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, updatedConversations: conversations }),
    }).then(response => {
        if (response.ok) {
            showMessage('Changes saved successfully.');
        } else {
            alert('Failed to save changes.');
        }
    }).catch(error => {
        console.error('Error saving changes:', error);
    });
}

// 點擊 "Next" 進入下一個問題
document.getElementById('nextQuestion').addEventListener('click', () => {
    saveChanges();
    
    const inputs = document.querySelectorAll('.assistantInput');
    inputs.forEach(input => {
        const index = parseInt(input.dataset.index);
        conversations[currentQuestionIndex].messages[index].content = input.value;
    });

    currentQuestionIndex++;
    
    if (currentQuestionIndex < conversations.length) {
        loadQuestion(); // 載入下一個問題
    } else {
        showPage('Save'); // 跳到最後一頁保存
    }
});

// 點擊 "Prev" 進入上一個問題
document.getElementById('previousQuestion').addEventListener('click', () => {
    saveChanges();
    
    const inputs = document.querySelectorAll('.assistantInput');
    inputs.forEach(input => {
        const index = parseInt(input.dataset.index);
        conversations[currentQuestionIndex].messages[index].content = input.value;
    });

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(); // 載入上一個問題
    }
});

// 點擊 "Go Back" 回到上一個問題（在 Save Changes 頁面）
document.getElementById('previousSave').addEventListener('click', () => {
    currentQuestionIndex = conversations.length - 1; // 回到最後一個問題
    loadQuestion();
    showPage(2); // 回到問題頁面
});

// 點擊 "Save Changes" 儲存修改
document.getElementById('saveChanges').addEventListener('click', () => {
    saveChanges();
});

// 點擊 "New File" 返回第一頁
document.getElementById('backToFirstPage').addEventListener('click', () => {
    showPage(1); // 顯示第一頁
});