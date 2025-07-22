       let playerName = '';
        let gameTimer = 300; 
        let score = 0;
        let hintsRemaining = 5;
        let currentRoom = 1;
        let totalRooms = 5;
        let timerInterval;
        let puzzlesSolved = 0;
        let gameStartTime;

    const puzzleDatabase = {
            1: [
                {
                    emoji: '🔑',
                    title: 'The Ancient Password',
                    description: 'An old stone tablet reads: "The key to freedom is the word ESCAPE followed by the current year."',
                    type: 'text',
                    answer: 'escape2025',
                    hint: '💡 Combine the word ESCAPE with 2025'
                },
                {
                    emoji: '🗝️',
                    title: 'Digital Lock',
                    description: 'Enter the magic word that opens all doors in adventure games...',
                    type: 'text',
                    answer: 'open',
                    hint: '💡 A simple 4-letter word that means "not closed"'
                },
                {
                    emoji: '🚪',
                    title: 'Door Code',
                    description: 'The door requires a 4-digit code. A note says: "One plus one plus one plus one"',
                    type: 'text',
                    answer: '1111',
                    hint: '💡 Four ones written together'
                }
            ],
            2: [
                {
                    emoji: '🧮',
                    title: 'Mathematical Cipher',
                    description: 'Solve this equation: (15 ÷ 3) × 4 + 10 = ?',
                    type: 'number',
                    answer: 30,
                    hint: '💡 Remember order of operations: Division and multiplication first!'
                },
                {
                    emoji: '🔢',
                    title: 'Number Sequence',
                    description: 'What comes next in this sequence: 2, 4, 8, 16, ?',
                    type: 'number',
                    answer: 32,
                    hint: '💡 Each number is double the previous one'
                },
                {
                    emoji: '➕',
                    title: 'Quick Math',
                    description: 'If you have 7 apples and eat 3, then buy 8 more, how many do you have?',
                    type: 'number',
                    answer: 12,
                    hint: '💡 7 - 3 + 8 = ?'
                }
            ],
            3: [
                {
                    emoji: '🌈',
                    title: 'Color Memory',
                    description: 'Enter the first three colors of a rainbow (separated by commas)',
                    type: 'text',
                    answer: 'red,orange,yellow',
                    hint: '💡 Roy G. Biv - Red, Orange, Yellow...'
                },
                {
                    emoji: '🎨',
                    title: 'Primary Colors',
                    description: 'Name the three primary colors (separated by commas)',
                    type: 'text',
                    answer: 'red,blue,yellow',
                    hint: '💡 The basic colors that cannot be created by mixing others'
                },
                {
                    emoji: '🟦',
                    title: 'Color Mix',
                    description: 'What color do you get when you mix blue and yellow?',
                    type: 'text',
                    answer: 'green',
                    hint: '💡 Think about nature and grass'
                }
            ],
            4: [
                {
                    emoji: '🔤',
                    title: 'Word Puzzle',
                    description: 'Unscramble these letters: TCARE',
                    type: 'text',
                    answer: 'trace',
                    hint: '💡 To follow or track something'
                },
                {
                    emoji: '📝',
                    title: 'Letter Count',
                    description: 'How many letters are in the word "ADVENTURE"?',
                    type: 'number',
                    answer: 9,
                    hint: '💡 Count each letter: A-D-V-E-N-T-U-R-E'
                },
                {
                    emoji: '🔠',
                    title: 'Alphabet Position',
                    description: 'What position is the letter M in the alphabet?',
                    type: 'number',
                    answer: 13,
                    hint: '💡 Count from A=1, B=2, C=3...'
                }
            ],
            5: [
                {
                    emoji: '🧩',
                    title: 'Final Challenge',
                    description: 'What has keys but no locks, space but no room, and you can enter but not go inside?',
                    type: 'text',
                    answer: 'keyboard',
                    hint: '💡 You use this to type on a computer'
                },
                {
                    emoji: '🎯',
                    title: 'Logic Puzzle',
                    description: 'I am not alive, but I grow. I do not have lungs, but I need air. What am I?',
                    type: 'text',
                    answer: 'fire',
                    hint: '💡 Hot and bright, needs oxygen to survive'
                },
                {
                    emoji: '🤔',
                    title: 'Brain Teaser',
                    description: 'The more you take away from me, the bigger I become. What am I?',
                    type: 'text',
                    answer: 'hole',
                    hint: '💡 Think about digging...'
                }
            ]
        };

        let currentPuzzles = {};

     
        const initGame = () => {
         
            for (let room = 1; room <= totalRooms; room++) {
                const puzzleOptions = puzzleDatabase[room];
                currentPuzzles[room] = puzzleOptions[Math.floor(Math.random() * puzzleOptions.length)];
            }
            
            generateRooms();
            startTimer();
            updateStats();
            gameStartTime = Date.now();
            console.log(`🎮 ${playerName}'s adventure begins!`);
        };

      
        const generateRooms = () => {
            const container = document.getElementById('roomsContainer');
            container.innerHTML = '';

            for (let roomNum = 1; roomNum <= totalRooms; roomNum++) {
                const puzzle = currentPuzzles[roomNum];
                const roomDiv = document.createElement('div');
                roomDiv.className = `room ${roomNum === 1 ? 'active' : ''}`;
                roomDiv.id = `room${roomNum}`;

                roomDiv.innerHTML = `
                    <h2 class="room-title">🏛️ Chamber ${roomNum} - ${getRoomTheme(roomNum)}</h2>
                    
                    <div class="puzzle" id="puzzle${roomNum}">
                        <span class="puzzle-emoji">${puzzle.emoji}</span>
                        <h3 class="puzzle-title">${puzzle.title}</h3>
                        <p class="puzzle-description">${puzzle.description}</p>
                        <div class="input-group">
                            <input type="${puzzle.type}" id="input${roomNum}" placeholder="Enter your answer..." maxlength="50">
                            <button onclick="checkAnswer(${roomNum})">🔍 Submit Answer</button>
                        </div>
                        <div style="margin-top: 20px; text-align: center;">
                            <button class="hint-button" onclick="showHint(${roomNum})" style="background: linear-gradient(135deg, #ffd700, #ffaa00); color: #333; padding: 10px 20px;">
                                💡 Use Hint (-50 points)
                            </button>
                            <div id="hint${roomNum}" style="display: none; margin-top: 15px; padding: 15px; background: rgba(255, 255, 0, 0.1); border-radius: 8px; font-style: italic;"></div>
                        </div>
                    </div>

                    <div class="room-navigation">
                        ${roomNum > 1 ? `<button onclick="goToRoom(${roomNum - 1})">⬅️ Previous Chamber</button>` : ''}
                        ${roomNum < totalRooms ? `<button id="next${roomNum}" onclick="goToRoom(${roomNum + 1})" disabled>➡️ Next Chamber</button>` : ''}
                        ${roomNum === totalRooms ? `<button id="escapeBtn" onclick="escapeRoom()" disabled>🏃‍♂️ ESCAPE NOW!</button>` : ''}
                    </div>
                `;
                
                container.appendChild(roomDiv);
            }
        };

        const getRoomTheme = (roomNum) => {
            const themes = [
                'The Entrance Hall',
                'The Mathematics Chamber',
                'The Color Laboratory',
                'The Word Sanctum',
                'The Final Vault'
            ];
            return themes[roomNum - 1];
        };

        
        const startGame = () => {
            const nameInput = document.getElementById('playerNameInput').value.trim();
            
            if (!nameInput) {
                showBigMessage('⚠️', 'Please enter your name!', 'We need to know who the brave adventurer is!', 'error');
                return;
            }
            
            playerName = nameInput;
            document.getElementById('playerName').textContent = playerName;
            document.getElementById('welcomeScreen').classList.add('hidden');
            document.getElementById('gameScreen').style.display = 'block';
            
            showBigMessage('🚀', 'Adventure Begins!', `Welcome ${playerName}! Your escape challenge starts now!`, 'info');
            
            setTimeout(() => {
                closeBigMessage();
                initGame();
            }, 2000);
        };

        
        const startTimer = () => {
            timerInterval = setInterval(() => {
                gameTimer--;
                document.getElementById('timer').textContent = gameTimer;
                
                const timerDisplay = document.getElementById('timerDisplay');
                
                if (gameTimer <= 10) {
                    timerDisplay.classList.add('timer-danger');
                } else if (gameTimer <= 20) {
                    timerDisplay.classList.add('timer-warning');
                    timerDisplay.classList.remove('timer-danger');
                } else {
                    timerDisplay.classList.remove('timer-warning', 'timer-danger');
                }
                
                if (gameTimer <= 0) {
                    endGame(false);
                }
            }, 1000);
        };

   
        const checkAnswer = (roomNum) => {
            const input = document.getElementById(`input${roomNum}`);
            const userAnswer = input.value.toLowerCase().trim();
            const correctAnswer = currentPuzzles[roomNum].answer.toString().toLowerCase();
            
            if (userAnswer === correctAnswer) {
                
                solvePuzzle(roomNum);
                const points = 200 - (roomNum * 20);
                score += points;
                
                showBigMessage(
                    '🎉', 
                    'CORRECT!', 
                    `Excellent work, ${playerName}! You earned ${points} points!`, 
                    'success'
                );
                
                input.disabled = true;
                input.style.background = 'rgba(0, 255, 0, 0.2)';
                
                
                if (roomNum < totalRooms) {
                    document.getElementById(`next${roomNum}`).disabled = false;
                } else {
                    document.getElementById('escapeBtn').disabled = false;
                }
                
            } else {
               
                score = Math.max(0, score - 25);
                showBigMessage(
                    '❌', 
                    'INCORRECT!', 
                    `That's not right, ${playerName}. You lost 25 points. Try again!`, 
                    'error'
                );
            }
            updateStats();
        };

     
        const solvePuzzle = (roomNum) => {
            const puzzleElement = document.getElementById(`puzzle${roomNum}`);
            puzzleElement.classList.add('solved');
            puzzlesSolved++;
            
            
            puzzleElement.style.animation = 'pulse 1s ease-in-out';
        };

        
        const showHint = (roomNum) => {
            if (hintsRemaining <= 0) {
                showBigMessage('💔', 'No Hints Left!', `Sorry ${playerName}, you've used all your hints!`, 'error');
                return;
            }
            
            hintsRemaining--;
            score = Math.max(0, score - 50);
            
            const hintElement = document.getElementById(`hint${roomNum}`);
            hintElement.textContent = currentPuzzles[roomNum].hint;
            hintElement.style.display = 'block';
            hintElement.style.animation = 'fadeIn 0.5s ease-in-out';
            
            showBigMessage('💡', 'Hint Revealed!', `Here's your hint, ${playerName}! (-50 points)`, 'info');
            
            updateStats();
        };

    
        const goToRoom = (roomNumber) => {
            if (roomNumber < 1 || roomNumber > totalRooms) return;
            
       
            document.querySelectorAll('.room').forEach(room => room.classList.remove('active'));
            
         
            document.getElementById(`room${roomNumber}`).classList.add('active');
            currentRoom = roomNumber;
            updateStats();
            
            showBigMessage('🚪', `Entering Chamber ${roomNumber}`, `Welcome to ${getRoomTheme(roomNumber)}!`, 'info');
        };

    
        const updateStats = () => {
            document.getElementById('scoreValue').textContent = score;
            document.getElementById('hintsValue').textContent = hintsRemaining;
            document.getElementById('roomValue').textContent = currentRoom;
            document.getElementById('solvedValue').textContent = puzzlesSolved;
            document.getElementById('currentRoomDisplay').textContent = currentRoom;
      
            const progress = (puzzlesSolved / totalRooms) * 100;
            document.getElementById('progressBar').style.width = `${progress}%`;
        };

        
        const showBigMessage = (emoji, title, details, type) => {
            const overlay = document.getElementById('messageOverlay');
            const message = document.getElementById('bigMessage');
            const messageEmoji = document.getElementById('messageEmoji');
            const messageText = document.getElementById('messageText');
            const messageDetails = document.getElementById('messageDetails');
            
            messageEmoji.textContent = emoji;
            messageText.textContent = title;
            messageDetails.textContent = details;
            
            message.className = `big-message ${type}`;
            overlay.classList.remove('hidden');
            
     
            if (type === 'info') {
                setTimeout(closeBigMessage, 3000);
            }
        };

        const closeBigMessage = () => {
            document.getElementById('messageOverlay').classList.add('hidden');
        };

      
        const escapeRoom = () => {
            clearInterval(timerInterval);
            
            const timeBonus = gameTimer * 15;
            const speedBonus = gameTimer > 30 ? 500 : gameTimer > 15 ? 200 : 0;
            const totalScore = score + timeBonus + speedBonus;
            
            const gameTime = Math.round((Date.now() - gameStartTime) / 1000);
            const performanceRating = getPerformanceRating(totalScore, gameTime);
            
            showFinalScore(totalScore, timeBonus, speedBonus, gameTime, performanceRating);
        };

        const endGame = (success) => {
            clearInterval(timerInterval);
            
            if (!success) {
                const gameTime = Math.round((Date.now() - gameStartTime) / 1000);
                showBigMessage(
                    '⏰', 
                    'TIME\'S UP!', 
                    `${playerName}, you ran out of time! You solved ${puzzlesSolved}/${totalRooms} puzzles. Final Score: ${score} points`, 
                    'error'
                );
                
                setTimeout(() => {
                    if (confirm('Would you like to try again with different puzzles?')) {
                        location.reload();
                    }
                }, 3000);
            }
        };

    
        const getPerformanceRating = (totalScore, gameTime) => {
            if (totalScore >= 1000 && gameTime <= 40) return { emoji: '🏆', title: 'LEGENDARY ESCAPE MASTER!', rank: 'S+' };
            if (totalScore >= 800 && gameTime <= 50) return { emoji: '🥇', title: 'ESCAPE CHAMPION!', rank: 'S' };
            if (totalScore >= 600 && gameTime <= 55) return { emoji: '🥈', title: 'SKILLED ADVENTURER!', rank: 'A' };
            if (totalScore >= 400) return { emoji: '🥉', title: 'BRAVE EXPLORER!', rank: 'B' };
            if (totalScore >= 200) return { emoji: '🎖️', title: 'PUZZLE SOLVER!', rank: 'C' };
            return { emoji: '🏃', title: 'LUCKY ESCAPEE!', rank: 'D' };
        };

        
        const showFinalScore = (totalScore, timeBonus, speedBonus, gameTime, performance) => {
            const overlay = document.getElementById('messageOverlay');
            const bigMessage = document.getElementById('bigMessage');
            
            bigMessage.innerHTML = `
                <div class="final-score-screen">
                    <div class="final-emoji">${performance.emoji}</div>
                    <div class="final-title">${performance.title}</div>
                    <h2 style="color: #ff6b35; margin: 20px 0;">🎯 MISSION ACCOMPLISHED!</h2>
                    
                    <div style="font-size: 1.3em; margin: 20px 0; color: #ffd700;">
                        Congratulations <strong>${playerName}</strong>!<br>
                        You successfully escaped all 5 chambers!
                    </div>
                    
                    <div class="score-breakdown">
                        <h3 style="color: #ff6b35; margin-bottom: 20px;">📊 Score Breakdown</h3>
                        <div class="score-item">
                            <span>🧩 Puzzle Points:</span>
                            <span style="color: #00ff00;">+${score - timeBonus - speedBonus}</span>
                        </div>
                        <div class="score-item">
                            <span>⏰ Time Bonus (${gameTimer}s × 15):</span>
                            <span style="color: #00ff00;">+${timeBonus}</span>
                        </div>
                        ${speedBonus > 0 ? `<div class="score-item">
                            <span>⚡ Speed Bonus:</span>
                            <span style="color: #00ff00;">+${speedBonus}</span>
                        </div>` : ''}
                        <div class="score-item score-total">
                            <span>🏆 FINAL SCORE:</span>
                            <span style="color: #ffd700; font-size: 1.2em;">${totalScore}</span>
                        </div>
                        <div style="text-align: center; margin: 15px 0; font-size: 1.1em;">
                            <span style="background: linear-gradient(135deg, #ff6b35, #ffd700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">
                                RANK: ${performance.rank}
                            </span>
                        </div>
                    </div>
                    
                    <div style="background: rgba(139, 69, 19, 0.2); border-radius: 10px; padding: 20px; margin: 20px 0; border: 2px solid #8b4513;">
                        <h4 style="color: #ffd700; margin-bottom: 15px;">📈 Game Statistics</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;">
                            <div>⏱️ Total Time: <strong>${gameTime}s</strong></div>
                            <div>🧩 Puzzles Solved: <strong>${puzzlesSolved}/${totalRooms}</strong></div>
                            <div>💡 Hints Used: <strong>${5 - hintsRemaining}/5</strong></div>
                            <div>🏃 Completion: <strong>100%</strong></div>
                        </div>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <button onclick="location.reload()" style="margin: 10px; padding: 15px 30px; font-size: 1.1em; background: linear-gradient(135deg, #ff6b35, #ff4444);">
                            🔄 Play Again
                        </button>
                        <button onclick="shareScore(${totalScore}, '${performance.rank}')" style="margin: 10px; padding: 15px 30px; font-size: 1.1em; background: linear-gradient(135deg, #00aa00, #00ff00); color: white;">
                            📱 Share Score
                        </button>
                    </div>
                </div>
            `;
            
            bigMessage.className = 'big-message success';
            overlay.classList.remove('hidden');
        };

        
        const shareScore = (totalScore, rank) => {
            const shareText = `🎮 I just escaped all 5 chambers in "Escape the Room"!\n\n🏆 Score: ${totalScore} points\n⭐ Rank: ${rank}\n🎭 Player: ${playerName}\n\nCan you beat my score? 🚀`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Escape the Room - Score',
                    text: shareText,
                    url: window.location.href
                });
            } else {
              
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Score copied to clipboard! Share it with your friends! 📋');
                }).catch(() => {
                    alert(`Your score: ${totalScore} points (Rank: ${rank})\nShare this with your friends!`);
                });
            }
        };

        
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !document.getElementById('messageOverlay').classList.contains('hidden')) {
                closeBigMessage();
                return;
            }
            
            if (e.key === 'Enter') {
                const activeRoom = document.querySelector('.room.active');
                if (activeRoom) {
                    const roomNum = parseInt(activeRoom.id.replace('room', ''));
                    const input = document.getElementById(`input${roomNum}`);
                    if (input && !input.disabled && input.value.trim()) {
                        checkAnswer(roomNum);
                    }
                }
            }
        });


        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id === 'playerNameInput') {
                startGame();
            }
        });


        window.addEventListener('beforeunload', (e) => {
            if (puzzlesSolved > 0 && puzzlesSolved < totalRooms) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your progress will be lost!';
            }
        });

       
        window.addEventListener('load', () => {
            console.log('🔐 Escape the Chamber loaded successfully!');
            document.getElementById('playerNameInput').focus();
        });


        const konamiCode = [];
        const targetSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > targetSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === targetSequence.join(',')) {
                score += 500;
                hintsRemaining += 3;
                showBigMessage('🎊', 'CHEAT CODE ACTIVATED!', 'Konami Code bonus: +500 points & +3 hints!', 'success');
                updateStats();
                konamiCode.length = 0;
            }
        });
   
