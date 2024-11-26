
console.log("hello world")
const quizTitle = document.getElementById('quiz-title');
const quizContainer = document.getElementById('quiz');
const displayAllButton = document.getElementById('display-all-answers');
const displayScoreButton = document.getElementById('display-score');
const backToTopButton = document.getElementById('back-to-top');
const quizListCo = document.getElementById('quiz-list-co');
const quizListCe = document.getElementById('quiz-list-ce');
const questionNavList = document.getElementById('question-nav-list');
const scoreDisplay = document.getElementById('score-display');
const scoreSpan = document.getElementById('score');
const maxScoreSpan = document.getElementById('max-score');
const progressBar = document.getElementById('progress-bar');
const timeLeft = document.getElementById('time-left');
const startTimerButton = document.getElementById('start-timer');
const pauseTimerButton = document.getElementById('pause-timer');
const stopTimerButton = document.getElementById('stop-timer');
let areAllAnswersVisible = false;
let quizCategory = { CO: "Orale", CE: "Écrite" }
let quizzes = {
    //"TCF Canada Compréhension Orale Série 151, Réussir 03"
    CO: [
        { tcfId: 148, ruId: 1 },
        { tcfId: 149, ruId: 2 },
        { tcfId: 151, ruId: 3 },
        { tcfId: 152, ruId: 4 },
        { tcfId: 155, ruId: 5 },
        { tcfId: 150, ruId: 6 },
        { tcfId: 156, ruId: 7 },
        { tcfId: 157, ruId: 8 },
        { tcfId: 161, ruId: 9 },
        { tcfId: 162, ruId: 10 },
        { tcfId: 171, ruId: 11 },
        { tcfId: 172, ruId: 12 },
        { tcfId: 176, ruId: 13 },
        { tcfId: 163, ruId: 14 },
        { tcfId: 178, ruId: 15 },
        { tcfId: 179, ruId: 16 },
        { tcfId: 175, ruId: 17 },
        { tcfId: 154, ruId: 18 },
        { tcfId: 167, ruId: 19 },
        { tcfId: 180, ruId: 20 },
        { tcfId: 165, ruId: 21 },
        { tcfId: 158, ruId: 22 },
        { tcfId: 183, ruId: 23 },
        { tcfId: 166, ruId: 24 },
        { tcfId: 159, ruId: 25 },
        { tcfId: 181, ruId: 26 },
        { tcfId: 186, ruId: 27 },
        { tcfId: 185, ruId: 28 },
        { tcfId: 177, ruId: 29 },
        { tcfId: 169, ruId: 30 },
        { tcfId: 188, ruId: 31 },
        { tcfId: 153, ruId: 32 },
        { tcfId: 164, ruId: 33 },
        { tcfId: 170, ruId: 34 },
        { tcfId: 160, ruId: 35 },
        { tcfId: 168, ruId: 36 },
        { tcfId: "all", ruId: "All" },
        { tcfId: "all-01", ruId: "01" },
        { tcfId: "all-02", ruId: "02" },
        { tcfId: "all-03", ruId: "03" },
        { tcfId: "all-04", ruId: "04" },
        { tcfId: "all-05", ruId: "05" },
        { tcfId: "all-06", ruId: "06" },
        { tcfId: "all-07", ruId: "07" },
        { tcfId: "all-08", ruId: "08" },
        { tcfId: "all-09", ruId: "09" },
    ], // Sample quiz IDs for CO
    CE: [
        { tcfId: 149, ruId: 1 },
        { tcfId: 150, ruId: 2 },
        { tcfId: 152, ruId: 3 },
        { tcfId: 153, ruId: 4 },
        { tcfId: 154, ruId: 5 },
        { tcfId: 155, ruId: 6 },
        { tcfId: 162, ruId: 7 },
        { tcfId: 151, ruId: 8 },
        { tcfId: 156, ruId: 9 },
        { tcfId: 157, ruId: 10 },
        { tcfId: 148, ruId: 11 },
        { tcfId: 163, ruId: 12 },
        { tcfId: 165, ruId: 13 },
        { tcfId: 166, ruId: 14 },
        { tcfId: 158, ruId: 15 },
        { tcfId: 160, ruId: 16 },
        { tcfId: 172, ruId: 17 },
        { tcfId: 171, ruId: 18 },
        { tcfId: 175, ruId: 19 },
        { tcfId: 176, ruId: 20 },
        { tcfId: 178, ruId: 21 },
        { tcfId: 179, ruId: 22 },
        { tcfId: 161, ruId: 23 },
        { tcfId: 177, ruId: 24 },
        { tcfId: 181, ruId: 25 },
        { tcfId: 167, ruId: 26 },
        { tcfId: 180, ruId: 27 },
        { tcfId: 182, ruId: 28 },
        { tcfId: 183, ruId: 29 },
        { tcfId: 184, ruId: 30 },
        { tcfId: 186, ruId: 31 },
        { tcfId: 185, ruId: 32 },
        { tcfId: 159, ruId: 33 },
        { tcfId: 169, ruId: 34 },
        { tcfId: 187, ruId: 35 },
        { tcfId: 188, ruId: 36 },
        { tcfId: 168, ruId: 37 },
        { tcfId: 173, ruId: 38 },
        { tcfId: "all", ruId: "All" },
        { tcfId: "all-01", ruId: "01" },
        { tcfId: "all-02", ruId: "02" },
        { tcfId: "all-03", ruId: "03" },
        { tcfId: "all-04", ruId: "04" },
        { tcfId: "all-05", ruId: "05" },
        { tcfId: "all-06", ruId: "06" },
        { tcfId: "all-07", ruId: "07" },
        { tcfId: "all-08", ruId: "08" },
        { tcfId: "all-09", ruId: "09" },
    ] // Sample quiz IDs for CE
};
let qLevel = ["A1", "A2", "B1", "B2", "C1", "C2"];
let quizList = {
    CO: quizListCo,
    CE: quizListCe
};
let currentQuizData = [];
let userAnswers = []; // To track user answers for scorings
let audioElements = [];
let currentIndex = 0; // Track the current audio index
let isPaused = false; // Track whether playback is paused
let currentAudio = null; // Keep reference to the current playing audio
let curQ = -1;

function goQuestion(index) {
    if (curQ != index) {
        qlists = questionNavList.childNodes;
        if (0 <= curQ && curQ < qlists.length) {
            qlists[curQ].classList.remove("btn-cur");
        }
        qlists[index].classList.add("btn-cur");
        curQ = index;
    }
}

function correctQuestion(index) {
    qlists = questionNavList.childNodes;
    qlists[index].classList.remove("btn-wrong");
    qlists[index].classList.add("btn-correct");
}

function wrongQuestion(index) {
    qlists = questionNavList.childNodes;
    qlists[index].classList.remove("btn-correct");
    qlists[index].classList.add("btn-wrong");
}

function resetQuestion(index) {
    qlists = questionNavList.childNodes;
    qlists[index].classList.remove("btn-correct", "btn-wrong");
}

function playSequentially(index = currentIndex) {
    if (index < audioElements.length) {
        currentIndex = index; // Update the current index
        currentAudio = audioElements[index]; // Get the current audio
        if (Array.isArray(currentAudio)) {
            currentAudio = currentAudio[0];
        }

        document.getElementById("play-button").innerHTML = "Play " + (index + 1) + "/" + audioElements.length;
        // Play the current audio
        currentAudio.play();

        // When it ends, move to the next one
        currentAudio.addEventListener("ended", onAudioEnded);
        goQuestion(index);
    }
}

// Event listener for when audio ends
function onAudioEnded() {
    currentAudio.removeEventListener("ended", onAudioEnded); // Clean up event
    playSequentially(currentIndex + 1); // Play the next audio
}

function playStop() {
    if (currentAudio) {
        currentAudio.pause(); // Pause the current audio
        currentAudio.currentTime = 0; // Reset the playback position to the beginning
    }
    currentAudio = null; // Reset the currentAudio reference to null
    currentIndex = 0; // Reset the sequence to start from the first audio
    isPaused = false; // Reset the paused state
    document.getElementById("play-button").innerHTML = "Play";
}

// Play Button Handler
document.getElementById("play-button").addEventListener("click", () => {
    if (isPaused && currentAudio) {
        // Resume playback if paused
        isPaused = false;
        currentAudio.play();
    } else {
        // Start playback from the beginning or current index
        playSequentially(currentIndex);
    }
});

// Pause Button Handler
document.getElementById("pause-button").addEventListener("click", () => {
    if (currentAudio) {
        isPaused = true;
        currentAudio.pause(); // Pause the current audio
    }
});

// Stop Button Handler
document.getElementById("stop-button").addEventListener("click", () => {
    playStop()
});

function displayQuizList(category) {
    quizList[category].innerHTML = '';
    quizzes[category].forEach((quizId, index) => {
        const quizButton = document.createElement('button');
        quizButton.classList.add('btn');
        quizButton.innerText = `${quizId.tcfId}-${String(quizId.ruId).padStart(2, '0')}`;
        quizButton.addEventListener('click', () => loadQuiz(category, index));
        quizList[category].appendChild(quizButton);
    });
}

function loadQuiz(category, quizIndex) {
    const quizId = quizzes[category][quizIndex]
    const url = host + `/${category}/${quizId.tcfId}.json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            quizTitle.innerHTML = `TCF Canada Compréhension ${quizCategory[category]} Série ${quizId.tcfId}, Réussir ${String(quizId.ruId).padStart(2, '0')}`;
            currentQuizData = data;
            userAnswers = Array(data.length).fill(null); // Reset user answers
            renderQuiz(category, data);
            updateScoreDisplay(); // Update score display
        })
        .catch(error => console.error('Error loading quiz:', error));
}

function renderQuiz(category, data) {
    quizContainer.innerHTML = '';
    questionNavList.innerHTML = '';

    textDisplay = category == 'CO' ? 'none' : 'block';

    audioElements = [];
    playStop();

    data.forEach((questionData, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('quiz-container', 'question');
        questionElement.id = `question-${index}`;

        const questionNumber = document.createElement('h2');
        questionNumber.innerText = `Question ${questionData.id}`;
        questionElement.appendChild(questionNumber);

        const questionStat = document.createElement('div');
        questionStat.classList.add('question-stat');
        questionElement.appendChild(questionStat);

        if (Object.hasOwn(questionData, 'testIds')) {
            const questionOcc = document.createElement('p');
            questionOcc.classList.add("question-occ");
            questionOcc.innerHTML = questionData.testIds.map(id => "<span>" + id + "</span>").join(" ");
            questionStat.appendChild(questionOcc);
        }

        if (Object.hasOwn(questionData, 'id_avg')) {
            const questionLevel = document.createElement('p');
            const level = qLevel[getLevelForQuestion(questionData.id_avg)]
            questionLevel.classList.add("question-level", "question-level-" + level)
            questionLevel.innerText = level
            questionStat.appendChild(questionLevel);
        }

        if (category == 'CO') {
            if (Array.isArray(questionData.audio)) {
                let audios = [];
                for (i in questionData.audio) {
                    const audio = document.createElement('audio');
                    audio.preload = 'none';
                    audio.controls = true;
                    audio.src = host + questionData.audio[i];
                    questionElement.appendChild(audio);
                    audios.push(audio);
                }
                audioElements.push(audios);
            } else {
                const audio = document.createElement('audio');
                audio.preload = 'none';
                audio.controls = true;
                audio.src = host + questionData.audio;
                questionElement.appendChild(audio);
                audioElements.push(audio);
            }

            if (Object.hasOwn(questionData, 'audioAI')) {
                const textElement = document.createElement('p');
                textElement.innerHTML = "AI generated audio"
                questionElement.appendChild(textElement);

                if (Array.isArray(questionData.audioAI)) {
                    for (i in questionData.audioAI) {
                        const audio = document.createElement('audio');
                        audio.preload = 'none';
                        audio.controls = true;
                        audio.src = host + questionData.audioAI[i];
                        questionElement.appendChild(audio);
                    }
                } else {
                    const audio = document.createElement('audio');
                    audio.preload = 'none';
                    audio.controls = true;
                    audio.src = host + questionData.audioAI;
                    questionElement.appendChild(audio);
                }
            }

            if (Object.hasOwn(questionData, 'img')) {
                const img = document.createElement('img');
                img.src = host + questionData.img;
                questionElement.appendChild(img);
            }

            const displayText = document.createElement('a');
            displayText.classList.add('link');
            displayText.innerText = 'Display the text';
            displayText.addEventListener('click', () => toggleTextDisplay(displayText, index));
            questionElement.appendChild(displayText);
        }

        const textElement = document.createElement('p');
        textElement.classList.add('quiz-text');
        textElement.innerHTML = marked.parse(questionData.text || '');
        textElement.style.display = textDisplay;
        questionElement.appendChild(textElement);

        if (category == 'CE') {
            const questionText = document.createElement('h3');
            questionText.classList.add('quiz-question');
            questionText.innerText = questionData.query;
            questionText.style.display = textDisplay;
            questionElement.appendChild(questionText);
        }

        const displayButton = document.createElement('a');
        displayButton.classList.add('link', 'quiz-display-answer');
        displayButton.innerText = 'Display Answer';
        displayButton.addEventListener('click', () => toggleAnswerDisplay(displayButton, index));
        questionElement.appendChild(displayButton);

        const optionsList = document.createElement('ul');
        optionsList.classList.add('quiz-options');
        questionData.options.forEach((option, optionIndex) => {
            const listItem = document.createElement('li');
            listItem.id = `option-${index}-${optionIndex}`;

            const label = document.createElement('label');
            label.innerText = String.fromCharCode('A'.charCodeAt(0) + optionIndex) + '. ' + option;

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `quiz-${index}`;
            radioInput.value = optionIndex;

            radioInput.addEventListener('change', () => {
                userAnswers[index] = parseInt(radioInput.value); // Track user answer
            });

            label.prepend(radioInput);
            listItem.appendChild(label);
            optionsList.appendChild(listItem);
        });

        questionElement.appendChild(optionsList);

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        questionElement.appendChild(resultDiv);

        quizContainer.appendChild(questionElement);

        // Add question navigator link
        const questionNavItem = document.createElement('a');
        questionNavItem.classList.add('btn')
        questionNavItem.href = `#question-${index}`;
        questionNavItem.innerText = `${questionData.id}`;
        questionNavList.appendChild(questionNavItem);

        // scroll to a question
        questionNavItem.addEventListener('click', function (event) {
            event.preventDefault();
            const targetPosition = questionElement.getBoundingClientRect().top + window.scrollY - 100;

            window.scrollTo({
                top: targetPosition,
                behavior: 'instant'
            });

            goQuestion(index);

            if (category == 'CO') {
                playStop();
                currentIndex = index;
            }
        });
    });

    goQuestion(0);

    // Render LaTeX using MathJax
    MathJax.typesetPromise().then(() => {
        console.log('MathJax typesetting complete.');
    }).catch((err) => console.log('MathJax typesetting failed:', err));
}

function toggleTextDisplay(displayText, questionIndex) {
    const questionElement = document.querySelector(`.quiz-container:nth-child(${questionIndex + 1})`);
    const quizText = questionElement.querySelector('.quiz-text');
    const quizQuestion = questionElement.querySelector('.quiz-question');

    if (quizText.style.display === 'none') {
        quizText.style.display = 'block';
        // quizQuestion.style.display = 'block';
        displayText.innerText = 'Hide the Text';
    } else {
        quizText.style.display = 'none';
        // quizQuestion.style.display = 'none';
        displayText.innerText = 'Display the Text';
    }
}

function toggleAnswerDisplay(displayButton, questionIndex) {
    const questionElement = document.querySelector(`.quiz-container:nth-child(${questionIndex + 1})`);
    const resultDiv = questionElement.querySelector('.result');
    const correctAnswerIndex = currentQuizData[questionIndex].answer;

    if (resultDiv.style.display === 'none' || resultDiv.style.display === '') {
        // Show the correct answer
        questionElement.querySelectorAll('ul.quiz-options li').forEach((li, optionIndex) => {
            const selectedOption = document.querySelector(`input[name="quiz-${questionIndex}"]:checked`);
            if (optionIndex === correctAnswerIndex) {
                console.log(optionIndex, correctAnswerIndex);
                li.classList.add('correct');
                if (selectedOption && parseInt(selectedOption.value) === optionIndex) {
                    correctQuestion(questionIndex);
                }
            } else {
                if (selectedOption && parseInt(selectedOption.value) === optionIndex) {
                    li.classList.add('wrong');
                    wrongQuestion(questionIndex);
                }
            }
        });
        resultDiv.style.display = 'block';
        displayButton.innerText = 'Hide Answer';
    } else {
        // Hide the correct answer
        questionElement.querySelectorAll('ul li').forEach((li) => {
            li.classList.remove('correct', 'wrong');
            resetQuestion(questionIndex);
        });
        resultDiv.style.display = 'none';
        displayButton.innerText = 'Display Answer';
    }
}

function calculateScore() {
    let totalScore = 0;
    let maxScore = 0;

    currentQuizData.forEach((questionData, index) => {
        const userAnswer = userAnswers[index];
        const points = getPointsForQuestion(questionData.id_avg || questionData.id);

        if (userAnswer !== null) {
            const correctAnswerIndex = questionData.answer;

            if (userAnswer === correctAnswerIndex) {
                totalScore += points;
            }
        }

        maxScore += points; // Add points for each question to max score
    });

    return { totalScore, maxScore };
}

function getPointsForQuestion(questionId) {
    if (questionId >= 1 && questionId <= 4) return 3;
    if (questionId >= 5 && questionId <= 10) return 9;
    if (questionId >= 11 && questionId <= 19) return 15;
    if (questionId >= 20 && questionId <= 29) return 21;
    if (questionId >= 30 && questionId <= 35) return 26;
    if (questionId >= 36 && questionId <= 39) return 33;
    return 0;
}

function getLevelForQuestion(questionId) {
    if (questionId < 5) return 0;
    if (questionId < 11) return 1;
    if (questionId < 20) return 2;
    if (questionId < 30) return 3;
    if (questionId < 36) return 4;
    return 5;
}

function updateScoreDisplay() {
    const { totalScore, maxScore } = calculateScore();
    scoreSpan.innerText = totalScore;
    maxScoreSpan.innerText = maxScore;
}

displayScoreButton.addEventListener('click', () => updateScoreDisplay());

displayAllButton.addEventListener('click', () => {
    areAllAnswersVisible = !areAllAnswersVisible;
    const resultDivs = document.querySelectorAll('.result');
    resultDivs.forEach((resultDiv, index) => {
        const questionElement = resultDiv.closest('.quiz-container');
        const displayButton = questionElement.querySelector('.quiz-display-answer');
        console.log(displayButton);
        const correctAnswerIndex = currentQuizData[index].answer;

        if (areAllAnswersVisible) {
            questionElement.querySelectorAll('ul.quiz-options li').forEach((li, optionIndex) => {
                const selectedOption = document.querySelector(`input[name="quiz-${index}"]:checked`);
                if (optionIndex === correctAnswerIndex) {
                    li.classList.add('correct');
                    if (selectedOption && parseInt(selectedOption.value) === optionIndex) {
                        correctQuestion(index);
                    }
                } else {
                    if (selectedOption && parseInt(selectedOption.value) === optionIndex) {
                        li.classList.add('wrong');
                        wrongQuestion(index);
                    }
                }
            });
            resultDiv.style.display = 'block';
            displayButton.innerText = 'Hide Answer';
            displayAllButton.innerText = 'Hide All Answer';
        } else {
            questionElement.querySelectorAll('ul.quiz-options li').forEach((li) => {
                li.classList.remove('correct', 'wrong');
                resetQuestion(index)
            });
            resultDiv.style.display = 'none';
            displayButton.innerText = 'Display Answer';
            displayAllButton.innerText = 'Display All Answer';
        }
    });
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Load the initial quiz list for CO
displayQuizList('CO');
displayQuizList('CE');

// Timer Logic
// Timer Logic
const totalDuration = 3600; // 1 hour in seconds
let remainingTime = totalDuration;
let timerInterval;

function updateTimer() {
    const percentage = ((totalDuration - remainingTime) / totalDuration) * 100;
    progressBar.style.width = `${percentage}%`;

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timeLeft.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (remainingTime > 0) {
        remainingTime--;
    } else {
        clearInterval(timerInterval);
        alert("Time's up!");
    }
}

startTimerButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
});

pauseTimerButton.addEventListener('click', () => {
    clearInterval(timerInterval);
});

stopTimerButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    remainingTime = totalDuration;
    updateTimer();
});

//updateTimer();

// setup latex rendering
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'] // removed 'code' entry
    },
    svg: {
        fontCache: 'global'
    },
    options: {
        renderActions: {
            addMenu: [0, '', '']
        }
    },
    startup: {
        typeset: false
    }
};

// Set up the Marked.js custom renderer
const renderer = new marked.Renderer();

// Override the default image renderer for audio
renderer.image = ({ href, title, text }) => {
    console.log(typeof href, href)
    if (href.endsWith('.mp3') || href.endsWith('.wav')) {
        return `<audio controls ${title ? `title="${title}"` : ''}>
              <source src="${href}" type="audio/${href.split('.').pop()}">
              Your browser does not support the audio element.
            </audio>`;
    }
    // Fallback to the default behavior for non-audio images
    return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''}>`;
};

// Configure Marked.js
marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
});

