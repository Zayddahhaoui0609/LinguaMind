// LinguaMind core logic
console.log('LinguaMind script loaded');

// Global variables
let languageSelect, levelSelect, generateBtn, wordsGrid, flashcardsBtn, quizBtn, practiceBtn;
let flashcardModal, flashcardBody, flipCardBtn, prevCardBtn, nextCardBtn;
let quizModal, quizQuestionEl, quizOptionsEl, quizFeedbackEl, quizNextBtn, quizStreakEl;
let todayWords = [];
let currentCardIdx = 0;
let showingFront = true;
let quizQuestions = [];
let quizIdx = 0;
let quizScore = 0;
let streakCount = 0;
let isQuizOver = false;

// This will hold all language data after being fetched
let languageData = {};

document.addEventListener('DOMContentLoaded', async () => {
    // --- UI Element Initialization ---
    languageSelect = document.getElementById('languageSelect');
    levelSelect = document.getElementById('levelSelect');
    generateBtn = document.getElementById('generateBtn');
    wordsGrid = document.getElementById('wordsGrid');
    flashcardsBtn = document.getElementById('flashcardsBtn');
    quizBtn = document.getElementById('quizBtn');
    practiceBtn = document.getElementById('practiceBtn');
    flashcardModal = new bootstrap.Modal(document.getElementById('flashcardModal'));
    flashcardBody = document.getElementById('flashcardBody');
    flipCardBtn = document.getElementById('flipCard');
    prevCardBtn = document.getElementById('prevCard');
    nextCardBtn = document.getElementById('nextCard');
    quizModal = new bootstrap.Modal(document.getElementById('quizModal'));
    quizQuestionEl = document.getElementById('quizQuestion');
    quizOptionsEl = document.getElementById('quizOptions');
    quizFeedbackEl = document.getElementById('quizFeedback');
    quizNextBtn = document.getElementById('quizNext');
    quizStreakEl = document.getElementById('quizStreak');

    // --- Article Quiz Elements ---
    const quizTypeModal = new bootstrap.Modal(document.getElementById('quizTypeModal'));
    const startTranslationQuizBtn = document.getElementById('startTranslationQuiz');
    const startArticleQuizBtn = document.getElementById('startArticleQuiz');
    const articleWordEl = document.getElementById('articleWord');
    const articleOptions = document.querySelectorAll('#articleOptions .option');
    const articleFeedbackEl = document.getElementById('articleFeedback');
    const articleNextBtn = document.getElementById('articleNextBtn');
    const articleModal = new bootstrap.Modal(document.getElementById('articleQuizModal'));
    let germanWords = [];
    let currentArticle = '';

    // --- Fetch Language Data ---
    try {
        console.log('Fetching language data...');
        wordsGrid.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
        const response = await fetch('/languageData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        languageData = await response.json();
        console.log('Language data loaded successfully:', Object.keys(languageData));
        
        // Now that data is loaded, populate German words for the article quiz
        const germanData = languageData.german;
        if (germanData && Array.isArray(germanData)) {
            germanWords = germanData.filter(w => /^(der|die|das) /.test(w.word));
            console.log(`Successfully prepared ${germanWords.length} German words for article quiz.`);
        } else {
            console.error('No German words found or data is in wrong format.');
        }
        
        // Initial load of words for the selected language
        refreshWords();

    } catch (error) {
        console.error('Failed to load language data:', error);
        if (wordsGrid) {
            wordsGrid.innerHTML = '<p class="text-danger">Error: Could not load language data. Please try refreshing the page.</p>';
        }
    }

    // --- Event Listeners ---
    if (languageSelect) languageSelect.addEventListener('change', refreshWords);
    if (levelSelect) levelSelect.addEventListener('change', refreshWords);
    if (generateBtn) generateBtn.addEventListener('click', refreshWords);

    // Flashcard listeners
    if (flashcardsBtn) {
        flashcardsBtn.addEventListener('click', () => {
            if (!todayWords.length) return;
            flashcardModal?.show();
            currentCardIdx = 0;
            showingFront = true;
            updateFlashcard();
        });
    }
    if (flipCardBtn) flipCardBtn.addEventListener('click', () => {
        showingFront = !showingFront;
        updateFlashcard();
    });
    if (prevCardBtn) prevCardBtn.addEventListener('click', () => {
        currentCardIdx = (currentCardIdx - 1 + todayWords.length) % todayWords.length;
        showingFront = true;
        updateFlashcard();
    });
    if (nextCardBtn) nextCardBtn.addEventListener('click', () => {
        currentCardIdx = (currentCardIdx + 1) % todayWords.length;
        showingFront = true;
        updateFlashcard();
    });

    // Quiz listeners
    // Global click to clear active cards when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.word-card-item')) {
            document.querySelectorAll('.word-card-item.card-active').forEach(el => {
                el.classList.remove('card-active');
                el.querySelector('.example')?.classList.remove('example-visible');
            });
        }
    });

    if (quizBtn) {
        quizBtn.addEventListener('click', () => {
            if (languageSelect.value === 'german') {
                quizTypeModal.show();
            } else {
                startQuiz();
                quizModal.show();
            }
        });
    }
    if (startTranslationQuizBtn) startTranslationQuizBtn.addEventListener('click', () => {
        quizTypeModal.hide();
        startQuiz();
        quizModal.show();
    });
        if (quizNextBtn) quizNextBtn.addEventListener('click', () => {
        if (isQuizOver) {
            quizModal.hide();
            return;
        }

        quizIdx++;
        if (quizIdx < quizQuestions.length) {
            renderQuizQuestion();
        } else {
            showQuizResult();
        }
    });

    // Article Quiz listeners
    if (startArticleQuizBtn) startArticleQuizBtn.addEventListener('click', () => {
        quizTypeModal.hide();
        startArticleRound();
        articleModal.show();
    });
    articleOptions.forEach(opt => {
        opt.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', opt.textContent));
        opt.addEventListener('click', () => {
            if (articleNextBtn.disabled) checkArticleAnswer(opt.textContent);
        });
    });
    articleWordEl.addEventListener('dragover', e => {
        e.preventDefault();
        articleWordEl.classList.add('drag-over');
    });
    articleWordEl.addEventListener('dragleave', () => articleWordEl.classList.remove('drag-over'));
    articleWordEl.addEventListener('drop', e => {
        e.preventDefault();
        articleWordEl.classList.remove('drag-over');
        const chosen = e.dataTransfer.getData('text/plain');
        checkArticleAnswer(chosen);
    });
    if (articleNextBtn) articleNextBtn.addEventListener('click', startArticleRound);

    function startArticleRound() {
        articleFeedbackEl.textContent = '';
        articleNextBtn.disabled = true;
        let pool = todayWords.filter(w => /^(der|die|das) /.test(w.word));
        if (!pool.length) {
            const level = levelSelect.value.toUpperCase();
            pool = germanWords.filter(w => /^(der|die|das) /.test(w.word) && (level === 'ALL' || (w.level || '').toUpperCase() === level));
            if (!pool.length) pool = germanWords.filter(w => /^(der|die|das) /.test(w.word));
        }
        if (!pool.length) {
            articleWordEl.textContent = "No article words available.";
            return;
        }
        const { word } = pool[Math.floor(Math.random() * pool.length)];
        const [article, base] = word.split(' ');
        currentArticle = article;
        articleWordEl.textContent = base;
        articleOptions.forEach(opt => {
            opt.classList.remove('bg-danger', 'bg-primary');
            opt.setAttribute('draggable', 'true');
        });
    }

    function checkArticleAnswer(choice) {
        if (choice === currentArticle) {
            articleFeedbackEl.textContent = 'Correct!';
            articleFeedbackEl.className = 'text-success';
        } else {
            articleFeedbackEl.textContent = `Incorrect. It was \"${currentArticle}\"`;
            articleFeedbackEl.className = 'text-danger';
        }
        articleNextBtn.disabled = false;
    }
});

async function refreshWords() {
    if (!languageSelect || !levelSelect) return;
    const lang = languageSelect.value;
    const level = levelSelect.value;
    todayWords = await getRandomWords(lang, level);
    renderWordsGrid(todayWords);
    // Enable buttons if words are loaded
    if (todayWords.length > 0 && todayWords[0].word !== 'Error') {
        flashcardsBtn.disabled = false;
        quizBtn.disabled = false;
    } else {
        flashcardsBtn.disabled = true;
        quizBtn.disabled = true;
    }
}

function renderWordsGrid(words) {
    if (!wordsGrid) return;
    wordsGrid.innerHTML = '';
    if (!words || words.length === 0 || words[0].word === 'Error') {
        wordsGrid.innerHTML = '<p>No words found for this language/level combination.</p>';
        return;
    }
    words.forEach((word, idx) => {
        const col = document.createElement('div');
        col.className = 'col-6 mb-3';
        col.innerHTML = `
            <div class="border rounded p-3 word-card-item" data-index="${idx}">
                <h5 class="fw-bold m-0">${word.word}</h5>
                <p class="text-muted mb-0">${word.translation}</p>
                <div class="example">
                    <p class="mb-2">${word.example || 'No example yet'}</p>
                    <p class="mb-0">${word.example_translation || 'لا يوجد مثال بعد'}</p>
                </div>
            </div>`;

        const inner = col.querySelector('.word-card-item');
        inner.addEventListener('click', (e) => {
            e.stopPropagation();
            // deactivate other active cards
            document.querySelectorAll('.word-card-item.card-active').forEach(el => {
                if (el !== inner) {
                    el.classList.remove('card-active');
                    el.querySelector('.example')?.classList.remove('example-visible');
                }
            });

            // toggle current card
            inner.classList.toggle('card-active');
            inner.querySelector('.example')?.classList.toggle('example-visible');
        });

        wordsGrid.appendChild(col);
    });
}

// Simplified function to get words from the pre-loaded data
async function getRandomWords(langKey, level) {
    const list = languageData[langKey.toLowerCase()];
    if (!list || !Array.isArray(list)) {
        console.error(`No data for language: ${langKey}`);
        return [{ word: 'Error', translation: 'Could not load words', level: 'N/A' }];
    }

    let pool = [...list];
    if (level && level.toLowerCase() !== 'all') {
        const target = level.toUpperCase();
        const filtered = pool.filter(item => (item.level || '').toUpperCase().trim() === target);
        if (filtered.length > 0) {
            pool = filtered;
        }
    }

    if (pool.length === 0) {
        return [];
    }

    // Remove duplicates and shuffle
    const uniquePool = Array.from(new Set(pool.map(w => JSON.stringify(w)))).map(s => JSON.parse(s));
    const shuffled = uniquePool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

function updateFlashcard() {
    if (!todayWords.length || !flashcardBody) return;
    const word = todayWords[currentCardIdx];

    // Create flip card container on first run
    if (!flashcardBody.querySelector('#flashcardCard')) {
        flashcardBody.innerHTML = `
            <div id="flashcardCard" class="w-100" style="max-width:400px;margin:auto;">
                <div class="flash-inner">
                    <div class="flash-face flash-front"></div>
                    <div class="flash-face flash-back"></div>
                </div>
            </div>`;
    }

    const frontEl = flashcardBody.querySelector('.flash-front');
    const backEl = flashcardBody.querySelector('.flash-back');
    if (frontEl) frontEl.textContent = word.word;
    if (backEl) backEl.textContent = word.translation;

    const inner = flashcardBody.querySelector('.flash-inner');
    if (inner) {
        if (showingFront) inner.classList.remove('flipped');
        else inner.classList.add('flipped');
    }

    updateFlashcardProgress();
}

function updateFlashcardProgress() {
    const progressDotsEl = document.getElementById('progressDots');
    const progressTextEl = document.getElementById('progressText');

    if (!progressDotsEl || !progressTextEl || !todayWords.length) return;

    progressDotsEl.innerHTML = ''; // Clear old dots

    // Create new dots
    todayWords.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentCardIdx) {
            dot.classList.add('current');
        } else if (i < currentCardIdx) {
            dot.classList.add('visited');
        }
        progressDotsEl.appendChild(dot);
    });

    // Update text
    progressTextEl.textContent = `${currentCardIdx + 1} / ${todayWords.length}`;
}

function startQuiz() {
    if (!todayWords.length) return;
    isQuizOver = false;
    quizNextBtn.textContent = 'Next';
    quizScore = 0;
    quizIdx = 0;
    streakCount = 0;
    const container = document.getElementById('streak-emojis-container');
    if (container) container.innerHTML = ''; // Clear emojis
    quizQuestions = generateQuizQuestions(todayWords);
    renderQuizQuestion();
}

function generateQuizQuestions(words) {
    return words.map(word => {
        const wrongAnswers = words
            .filter(w => w.word !== word.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => w.translation);
        const options = [word.translation, ...wrongAnswers].sort(() => 0.5 - Math.random());
        return {
            question: word.word,
            options: options,
            answer: word.translation
        };
    });
}

function updateQuizProgress() {
    const progressDotsEl = document.getElementById('quizProgressDots');
    const progressTextEl = document.getElementById('quizProgressText');

    if (!progressDotsEl || !progressTextEl || !quizQuestions.length) return;

    progressDotsEl.innerHTML = ''; // Clear old dots

    quizQuestions.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i < quizIdx) {
            dot.classList.add('visited');
        } else if (i === quizIdx) {
            dot.classList.add('current');
        }
        progressDotsEl.appendChild(dot);
    });

    progressTextEl.textContent = `${quizIdx + 1} / ${quizQuestions.length}`;
}

function renderQuizQuestion() {
    if (!quizQuestionEl || !quizOptionsEl || !quizFeedbackEl || !quizNextBtn) return;
    const q = quizQuestions[quizIdx];
    quizQuestionEl.textContent = `What is the translation of "${q.question}"?`;
    quizOptionsEl.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn'; // Use new base class
        btn.textContent = opt;
        btn.onclick = () => checkQuizAnswer(btn, opt, q.answer);
        quizOptionsEl.appendChild(btn);
    });
    quizFeedbackEl.textContent = '';
    quizFeedbackEl.className = '';
    quizNextBtn.style.display = 'none';
    quizNextBtn.disabled = true;
    updateQuizProgress();
}

function checkQuizAnswer(selectedBtn, selected, correct) {
    if (!quizFeedbackEl || !quizNextBtn) return;
    const buttons = quizOptionsEl.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        }
    });

    if (selected === correct) {
        quizFeedbackEl.textContent = 'Correct!';
        quizFeedbackEl.className = 'text-success';
        quizScore++;
        streakCount++;
        triggerStreakEffect(streakCount);
    } else {
        selectedBtn.classList.add('incorrect');
        quizFeedbackEl.textContent = `Wrong! The correct answer is "${correct}".`;
        quizFeedbackEl.className = 'text-danger';
        streakCount = 0;
    }
    quizNextBtn.style.display = 'block';
    quizNextBtn.disabled = false;
}

function triggerStreakEffect(streak) {
    const container = document.getElementById('streak-emojis-container');
    if (!container) return;

    let emojis = [];
    if (streak >= 9) emojis = ['🔥', '🧠', '💡'];
    else if (streak >= 6) emojis = ['🔥', '🧠'];
    else if (streak >= 3) emojis = ['🔥'];

    if (emojis.length === 0) return;

    // Clear previous emojis before adding new ones
    container.innerHTML = '';

    for (let i = 0; i < 15; i++) { // Create 15 emojis for a nice burst
        const emojiChar = emojis[i % emojis.length];
        const emojiEl = document.createElement('div');
        emojiEl.className = 'streak-emoji';
        emojiEl.textContent = emojiChar;
        emojiEl.style.left = `${Math.random() * 90 + 5}%`;
        emojiEl.style.top = `${Math.random() * 80 + 10}%`;
        emojiEl.style.animationDelay = `${Math.random() * 0.5}s`;
        container.appendChild(emojiEl);

        // Remove the emoji after the animation is complete
        setTimeout(() => emojiEl.remove(), 6000);
    }
}

function showQuizResult() {
    if (!quizQuestionEl || !quizOptionsEl || !quizFeedbackEl || !quizNextBtn) return;
    isQuizOver = true;
    quizQuestionEl.textContent = 'Quiz Complete!';
    quizOptionsEl.innerHTML = `<p class="h4">You scored ${quizScore} out of ${quizQuestions.length}.</p>`;
    quizFeedbackEl.textContent = '';
    quizNextBtn.textContent = 'Close';
    quizNextBtn.style.display = 'block'; // Ensure it's visible
    
    // Clear progress indicators
    const progressDotsEl = document.getElementById('quizProgressDots');
    const progressTextEl = document.getElementById('quizProgressText');
    if(progressDotsEl) progressDotsEl.innerHTML = '';
    if(progressTextEl) progressTextEl.textContent = '';

    const container = document.getElementById('streak-emojis-container');
    if (container) container.innerHTML = ''; // Clear emojis at the end
}
