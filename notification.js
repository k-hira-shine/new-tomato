// 通知音を生成して保存するスクリプト
document.addEventListener('DOMContentLoaded', () => {
    // AudioContextを作成
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 音の長さ（秒）
    const duration = 1.0;
    
    // 通知音を生成する関数
    function generateNotificationSound() {
        // オシレーターを作成
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // オシレーターの設定
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5音
        oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime + 0.2); // D5音
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.4); // E5音
        
        // 音量の設定
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        // 接続
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 再生
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // 通知音テスト用ボタンを作成
    const testButton = document.createElement('button');
    testButton.textContent = '通知音テスト';
    testButton.style.marginTop = '10px';
    testButton.style.backgroundColor = '#9b59b6';
    
    // ボタンクリック時に通知音を再生
    testButton.addEventListener('click', generateNotificationSound);
    
    // 設定セクションにボタンを追加
    const settingsDiv = document.querySelector('.settings');
    settingsDiv.appendChild(testButton);
    
    // notification.mp3が見つからない場合、このスクリプトの通知音を使用
    const notificationSound = document.getElementById('notification-sound');
    notificationSound.addEventListener('error', () => {
        console.log('通知音ファイルが見つからないため、代替の通知音を使用します');
        
        // notification-soundのonplayイベントを上書き
        notificationSound.onplay = () => {
            generateNotificationSound();
        };
    });
});
