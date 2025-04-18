const startButton = document.getElementById('start-btn');
const starterPage = document.getElementById('starter-page');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreText = document.getElementById('score-text');
const restartButton = document.getElementById('restart-btn');
const progressElement = document.getElementById('progress');
const hackAnswerElement = document.getElementById('hack-answer');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Load questions from JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
    });

    startButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    restartButton.addEventListener('click', restartQuiz);
    
    function startQuiz() {
        starterPage.classList.remove('active');
        quizPage.classList.add('active');
        setNextQuestion();
    }
    
    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
            updateProgress();
        } else {
            showResults();
        }
    }
    
    function showQuestion(question) {
        questionElement.innerText = question.question;
        if (question.type === "hack") {
            const input = document.createElement('input');
            input.type = "text";
            input.placeholder = "Unesi odgovor ovdje";
            const submitButton = document.createElement('button');
            submitButton.innerText = "Pošalji";
            submitButton.addEventListener('click', () => checkHackAnswer(input.value, question.correctAnswer));
            answerButtons.appendChild(input);
            answerButtons.appendChild(submitButton);
            questionElement.insertAdjacentHTML('beforeend', `<p class="hint">${question.hint}</p>`);
        } else {
            question.answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer.text;
                button.classList.add('btn');
                button.addEventListener('click', () => selectAnswer(answer.correct, button));
                answerButtons.appendChild(button);
            });
        }
    }
    
    function selectAnswer(isCorrect, selectedButton) {
        if (isCorrect) {
            selectedButton.classList.add('correct');
            score++;
        } else {
            selectedButton.classList.add('incorrect');
        }
        // Disable all buttons after selection
        Array.from(answerButtons.children).forEach(button => {
            button.disabled = true;
        });
        nextButton.classList.remove('hidden');
    }
    
    function checkHackAnswer(userAnswer, correctAnswer) {
        if (userAnswer.trim() === correctAnswer) {
            score++;
            alert("Točno! Odgovor je pronađen.");
        } else {
            alert("Netočno. Pokušajte ponovno.");
        }
        nextButton.classList.remove('hidden');
    }
    
    function resetState() {
        nextButton.classList.add('hidden');
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }
    
    function updateProgress() {
        progressElement.innerText = `Pitanje ${currentQuestionIndex + 1} od ${questions.length}`;
    }
    
    function showResults() {
        quizPage.classList.remove('active');
        resultsPage.classList.add('active');
        scoreText.innerText = `Osvojili ste ${score} od ${questions.length} točnih odgovora!`;
    }
    
    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultsPage.classList.remove('active');
        quizPage.classList.add('active');
        setNextQuestion();
    }

    function updateProgress() {
        const progress = (currentQuestionIndex + 1) / questions.length * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }