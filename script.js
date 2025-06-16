class FlashMathGame {
    constructor() {
        this.numbers = [];
        this.currentIndex = 0;
        this.totalSum = 0;
        this.isPlaying = false;
        this.displayInterval = 0.3;
        this.gameMode = 'normal';
        this.fallenCount = 0;
        this.fallingNumbers = [];
        
        this.initializeElements();
        this.bindEvents();
        this.initializeSettings();
    }
    
    initializeElements() {
        this.screens = {
            initial: document.getElementById('initial-screen'),
            countdown: document.getElementById('countdown-screen'),
            flash: document.getElementById('flash-screen'),
            amadare: document.getElementById('amadare-screen'),
            input: document.getElementById('input-screen'),
            result: document.getElementById('result-screen'),
            settings: document.getElementById('settings-screen')
        };
        
        this.elements = {
            normalModeButton: document.getElementById('normal-mode-button'),
            amadareModeButton: document.getElementById('amadare-mode-button'),
            settingsButton: document.getElementById('settings-button'),
            countdownNumber: document.getElementById('countdown-number'),
            flashNumber: document.getElementById('flash-number'),
            currentNumber: document.getElementById('current-number'),
            fallingArea: document.getElementById('falling-area'),
            fallenCount: document.getElementById('fallen-count'),
            answerInput: document.getElementById('answer-input'),
            submitButton: document.getElementById('submit-button'),
            resultMessage: document.getElementById('result-message'),
            userAnswer: document.getElementById('user-answer'),
            correctAnswer: document.getElementById('correct-answer'),
            playAgainButton: document.getElementById('play-again-button'),
            backToStartButton: document.getElementById('back-to-start-button'),
            intervalSlider: document.getElementById('interval-slider'),
            intervalValue: document.getElementById('interval-value'),
            backFromSettingsButton: document.getElementById('back-from-settings-button')
        };
    }
    
    bindEvents() {
        this.elements.normalModeButton.addEventListener('click', () => this.startGame('normal'));
        this.elements.amadareModeButton.addEventListener('click', () => this.startGame('amadare'));
        this.elements.settingsButton.addEventListener('click', () => this.showSettingsScreen());
        this.elements.submitButton.addEventListener('click', () => this.submitAnswer());
        this.elements.playAgainButton.addEventListener('click', () => this.startGame(this.gameMode));
        this.elements.backToStartButton.addEventListener('click', () => this.showInitialScreen());
        this.elements.backFromSettingsButton.addEventListener('click', () => this.showInitialScreen());
        
        this.elements.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
        
        this.elements.answerInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
        
        this.elements.intervalSlider.addEventListener('input', (e) => {
            this.updateDisplayInterval(parseFloat(e.target.value));
        });
    }
    
    generateRandomNumbers() {
        this.numbers = [];
        this.totalSum = 0;
        
        for (let i = 0; i < 10; i++) {
            const number = Math.floor(Math.random() * 90) + 10;
            this.numbers.push(number);
            this.totalSum += number;
        }
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    }
    
    showInitialScreen() {
        this.showScreen('initial');
        this.resetGame();
    }
    
    resetGame() {
        this.numbers = [];
        this.currentIndex = 0;
        this.totalSum = 0;
        this.isPlaying = false;
        this.fallenCount = 0;
        this.fallingNumbers = [];
        this.elements.answerInput.value = '';
        this.elements.flashNumber.textContent = '';
        this.elements.currentNumber.textContent = '0';
        this.elements.countdownNumber.textContent = '';
        this.elements.fallenCount.textContent = '0';
        this.elements.fallingArea.innerHTML = '';
    }

    async playCountdown() {
        this.showScreen('countdown');
        
        return new Promise((resolve) => {
            let count = 3;
            
            const updateCountdown = () => {
                if (count <= 0) {
                    resolve();
                    return;
                }
                
                this.elements.countdownNumber.textContent = count;
                count--;
                
                setTimeout(updateCountdown, 1000);
            };
            
            updateCountdown();
        });
    }
    
    async startGame(mode = 'normal') {
        if (this.isPlaying) return;
        
        this.gameMode = mode;
        this.isPlaying = true;
        this.generateRandomNumbers();
        this.currentIndex = 0;
        
        await this.playCountdown();
        
        if (mode === 'amadare') {
            this.showScreen('amadare');
            await this.playAmadareSequence();
        } else {
            this.showScreen('flash');
            await this.playFlashSequence();
        }
        
        this.showInputScreen();
    }
    
    async playFlashSequence() {
        return new Promise((resolve) => {
            const displayNumber = () => {
                if (this.currentIndex >= this.numbers.length) {
                    resolve();
                    return;
                }
                
                const number = this.numbers[this.currentIndex];
                this.elements.flashNumber.textContent = number;
                this.elements.flashNumber.classList.add('flash-animation');
                this.elements.currentNumber.textContent = this.currentIndex + 1;
                
                setTimeout(() => {
                    this.elements.flashNumber.classList.remove('flash-animation');
                }, 100);
                
                this.currentIndex++;
                
                setTimeout(displayNumber, this.displayInterval * 1000);
            };
            
            displayNumber();
        });
    }
    
    showInputScreen() {
        this.showScreen('input');
        this.elements.answerInput.focus();
    }
    
    submitAnswer() {
        const userAnswer = parseInt(this.elements.answerInput.value);
        
        if (isNaN(userAnswer)) {
            alert('数字を入力してください');
            return;
        }
        
        this.showResult(userAnswer);
    }
    
    showResult(userAnswer) {
        const isCorrect = userAnswer === this.totalSum;
        
        this.elements.userAnswer.textContent = userAnswer.toLocaleString();
        this.elements.correctAnswer.textContent = this.totalSum.toLocaleString();
        
        if (isCorrect) {
            this.elements.resultMessage.textContent = '正解！';
            this.elements.resultMessage.className = 'result-message correct';
        } else {
            this.elements.resultMessage.textContent = '不正解...';
            this.elements.resultMessage.className = 'result-message incorrect';
        }
        
        this.showScreen('result');
        this.isPlaying = false;
    }
    
    showSettingsScreen() {
        this.showScreen('settings');
    }
    
    initializeSettings() {
        this.elements.intervalSlider.value = this.displayInterval;
        this.elements.intervalValue.textContent = this.displayInterval;
    }
    
    updateDisplayInterval(value) {
        this.displayInterval = value;
        this.elements.intervalValue.textContent = value;
    }
    
    async playAmadareSequence() {
        return new Promise((resolve) => {
            this.fallenCount = 0;
            this.fallingNumbers = [];
            
            let numbersDropped = 0;
            
            const dropNumber = () => {
                if (numbersDropped >= this.numbers.length) {
                    return;
                }
                
                const number = this.numbers[numbersDropped];
                const fallingNumber = this.createFallingNumber(number, numbersDropped);
                this.fallingNumbers.push(fallingNumber);
                
                numbersDropped++;
                
                if (numbersDropped < this.numbers.length) {
                    const nextDropDelay = Math.random() * 1000 + 500;
                    setTimeout(dropNumber, nextDropDelay);
                }
            };
            
            const checkAllLanded = () => {
                if (this.fallenCount >= this.numbers.length) {
                    setTimeout(resolve, 500);
                } else {
                    setTimeout(checkAllLanded, 100);
                }
            };
            
            dropNumber();
            checkAllLanded();
        });
    }
    
    createFallingNumber(number, index) {
        const numberElement = document.createElement('div');
        numberElement.className = 'falling-number';
        numberElement.textContent = number;
        
        const areaWidth = this.elements.fallingArea.offsetWidth;
        const areaHeight = this.elements.fallingArea.offsetHeight;
        
        const startX = Math.random() * (areaWidth - 100) + 50;
        const fallDuration = Math.random() * 3000 + 2000;
        
        numberElement.style.left = startX + 'px';
        numberElement.style.top = '-80px';
        
        this.elements.fallingArea.appendChild(numberElement);
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fallDuration, 1);
            
            const currentY = -80 + (areaHeight + 80) * progress;
            numberElement.style.top = currentY + 'px';
            
            if (progress >= 1) {
                numberElement.classList.add('landed');
                this.fallenCount++;
                this.elements.fallenCount.textContent = this.fallenCount;
                
                setTimeout(() => {
                    if (numberElement.parentNode) {
                        numberElement.parentNode.removeChild(numberElement);
                    }
                }, 300);
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        
        return numberElement;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlashMathGame();
});