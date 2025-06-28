document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const statusText = document.getElementById('status-text');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const workTimeInput = document.getElementById('work-time');
    const breakTimeInput = document.getElementById('break-time');
    const applySettingsBtn = document.getElementById('apply-settings');
    const notificationSound = document.getElementById('notification-sound');

    // タイマーの状態
    let timer;
    let isRunning = false;
    let isPaused = false;
    let isWorkTime = true;
    let totalSeconds = 25 * 60; // デフォルト：25分
    let workTime = 25; // 分
    let breakTime = 5; // 分

    // 時間を表示する関数
    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }

    // タイマーをスタートする関数
    function startTimer() {
        if (isRunning && !isPaused) return;
        
        if (isPaused) {
            isPaused = false;
        } else {
            isRunning = true;
        }
        
        timer = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timer);
                notificationSound.play();
                
                // 作業時間とブレイク時間を切り替え
                isWorkTime = !isWorkTime;
                
                if (isWorkTime) {
                    statusText.textContent = '作業時間';
                    totalSeconds = workTime * 60;
                    document.body.classList.remove('break-mode');
                    document.body.classList.add('work-mode');
                } else {
                    statusText.textContent = '休憩時間';
                    totalSeconds = breakTime * 60;
                    document.body.classList.remove('work-mode');
                    document.body.classList.add('break-mode');
                }
                
                updateDisplay();
                startTimer(); // 自動的に次のサイクルを開始
            } else {
                totalSeconds--;
                updateDisplay();
            }
        }, 1000);
    }

    // タイマーを一時停止する関数
    function pauseTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isPaused = true;
    }

    // タイマーをリセットする関数
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = false;
        isWorkTime = true;
        
        totalSeconds = workTime * 60;
        statusText.textContent = '作業時間';
        document.body.classList.remove('break-mode');
        document.body.classList.add('work-mode');
        
        updateDisplay();
    }

    // 設定を適用する関数
    function applySettings() {
        const newWorkTime = parseInt(workTimeInput.value);
        const newBreakTime = parseInt(breakTimeInput.value);
        
        if (newWorkTime > 0 && newBreakTime > 0) {
            workTime = newWorkTime;
            breakTime = newBreakTime;
            
            // タイマーが実行中でなければ、表示を更新
            if (!isRunning || (isRunning && isWorkTime)) {
                totalSeconds = workTime * 60;
                updateDisplay();
            }
        }
    }

    // イベントリスナーの設定
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    applySettingsBtn.addEventListener('click', applySettings);

    // 初期表示の設定
    document.body.classList.add('work-mode');
    updateDisplay();
});

// 通知音が見つからない場合のエラーハンドリング
document.getElementById('notification-sound').addEventListener('error', () => {
    console.warn('通知音の読み込みに失敗しました。通知音なしで動作します。');
});
