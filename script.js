
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
        { tcfId: 151, ruId: 3 },
        { tcfId: 152, ruId: 4 },
        { tcfId: 155, ruId: 5 },
        { tcfId: 150, ruId: 6 },
        { tcfId: 156, ruId: 7 },
        { tcfId: 157, ruId: 8 }
    ], // Sample quiz IDs for CO
    CE: [
        { tcfId: 150, ruId: 2 },
        { tcfId: 152, ruId: 3 },
        { tcfId: 153, ruId: 4 },
        { tcfId: 154, ruId: 5 },
        { tcfId: 155, ruId: 6 },
        { tcfId: 162, ruId: 7 },
    ] // Sample quiz IDs for CE
};
let quizList = {
    CO: quizListCo,
    CE: quizListCe
};
let currentQuizData = [];
let userAnswers = []; // To track user answers for scorings


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

    data.forEach((questionData, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('quiz-container', 'question');
        questionElement.id = `question-${index}`;

        const questionNumber = document.createElement('h2');
        questionNumber.innerText = `Question ${questionData.id}`;
        questionElement.appendChild(questionNumber);

        if (category == 'CO') {
            const audio = document.createElement('audio');
            audio.preload = 'none';
            audio.controls = true;
            audio.src = host + questionData.audio;
            questionElement.appendChild(audio);

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
        });
    });

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
        quizQuestion.style.display = 'block';
        displayText.innerText = 'Hide the Text';
    } else {
        quizText.style.display = 'none';
        quizQuestion.style.display = 'none';
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
            if (optionIndex === correctAnswerIndex) {
                li.classList.add('correct');
            } else {
                const selectedOption = document.querySelector(`input[name="quiz-${questionIndex}"]:checked`);
                if (selectedOption && parseInt(selectedOption.value) === optionIndex) {
                    li.classList.add('wrong');
                }
            }
        });
        resultDiv.style.display = 'block';
        displayButton.innerText = 'Hide Answer';
    } else {
        // Hide the correct answer
        questionElement.querySelectorAll('ul li').forEach((li) => {
            li.classList.remove('correct', 'wrong');
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
        const points = getPointsForQuestion(questionData.id);

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
                if (optionIndex === correctAnswerIndex) {
                    li.classList.add('correct');
                } else {
                    const selectedOption = document.querySelector(`input[name="quiz-${index}"]:checked`);
                    if (selectedOption && parseInt(selectedOption.value) === optionIndex) {
                        li.classList.add('wrong');
                    }
                }
            });
            resultDiv.style.display = 'block';
            displayButton.innerText = 'Hide Answer';
            displayAllButton.innerText = 'Hide All Answer';
        } else {
            questionElement.querySelectorAll('ul.quiz-options li').forEach((li) => {
                li.classList.remove('correct', 'wrong');
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

