const sourceText = document.getElementById('source-text');
const targetText = document.getElementById('target-text');
const charCounter = document.getElementById('char-counter');
const translateBtn = document.getElementById('translate-btn');
const errorMessage = document.getElementById('error-message');

const fromLangSelect = document.getElementById('from-language');
const toLangSelect = document.getElementById('to-language');

const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const speakBtn = document.getElementById('speak-btn');
const detectedLangElement = document.getElementById('detected-language');

const maxChars = 5000;

// Language code to full name map
const langCodeToName = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    th: 'Thai',
    vi: 'Vietnamese',
    nl: 'Dutch',
    sv: 'Swedish',
    da: 'Danish',
    no: 'Norwegian',
    fi: 'Finnish',
    pl: 'Polish'
};

// Update character counter
sourceText.addEventListener('input', () => {
    const length = sourceText.value.length;
    charCounter.textContent = `${length} / ${maxChars}`;
    charCounter.style.color = length > maxChars ? '#c62828' : '#666';
});

// Translate
translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    if (!text) {
        showError('Please enter some text to translate.');
        return;
    }

    hideError();
    setLoading(true);

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                from: fromLangSelect.value,
                to: toLangSelect.value
            })
        });

        const data = await response.json();

        if (response.ok && data.translatedText) {
            targetText.value = data.translatedText;

            // Warn if only 100 or fewer characters remain
            if (data.remainingChars !== undefined && data.remainingChars <= 100) {
                showError(`⚠️ Only ${data.remainingChars} characters left this month!`);
                errorMessage.style.background = "#fff3cd";
                errorMessage.style.color = "#856404";
                errorMessage.style.borderLeft = "4px solid #ffc107";
            }

            // ✅ Show detected language name
            if (data.detectedSourceLanguage && fromLangSelect.value === "auto") {
                const code = data.detectedSourceLanguage.trim().toLowerCase();
                const langName = langCodeToName[code] || code.toUpperCase();
                detectedLangElement.textContent = `Detected language: ${langName}`;
                detectedLangElement.style.display = 'block';
            } else {
                detectedLangElement.style.display = 'none';
            }

        } else {
            showError(data.error || 'Translation failed. Try again.');
            detectedLangElement.style.display = 'none';
        }
    } catch (err) {
        showError('Translation failed. Please try again.');
        detectedLangElement.style.display = 'none';
    } finally {
        setLoading(false);
    }
});

// Clear input/output
clearBtn.addEventListener('click', () => {
    sourceText.value = '';
    targetText.value = '';
    charCounter.textContent = '0 / 5000';
    hideError();
    detectedLangElement.style.display = 'none';
});

// Copy translation
copyBtn.addEventListener('click', () => {
    if (!targetText.value) return;
    targetText.select();
    document.execCommand('copy');
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => copyBtn.textContent = '📋 Copy Translation', 2000);
});

// Speak translation
speakBtn.addEventListener('click', () => {
    const text = targetText.value;
    if (!('speechSynthesis' in window) || !text) return;

    const langNameToCode = {
        English: 'en-US',
        Spanish: 'es-ES',
        French: 'fr-FR',
        German: 'de-DE',
        Italian: 'it-IT',
        Portuguese: 'pt-PT',
        Russian: 'ru-RU',
        Japanese: 'ja-JP',
        Korean: 'ko-KR',
        Chinese: 'zh-CN',
        Arabic: 'ar-SA',
        Hindi: 'hi-IN',
        Thai: 'th-TH',
        Vietnamese: 'vi-VN',
        Dutch: 'nl-NL',
        Swedish: 'sv-SE',
        Danish: 'da-DK',
        Norwegian: 'no-NO',
        Finnish: 'fi-FI',
        Polish: 'pl-PL'
    };

    const selectedLangName = toLangSelect.options[toLangSelect.selectedIndex].text;
    const langCode = langNameToCode[selectedLangName] || 'en-US';

    function speakWithVoices() {
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === langCode);

        if (voice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.lang = voice.lang;
            speechSynthesis.speak(utterance);
        } else {
            alert(`Text-to-speech voice not available for: ${selectedLangName}`);
        }
    }

    if (speechSynthesis.getVoices().length > 0) {
        speakWithVoices();
    } else {
        speechSynthesis.onvoiceschanged = speakWithVoices;
    }
});

// Helpers
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
    errorMessage.style.background = '#ffebee';
    errorMessage.style.color = '#c62828';
    errorMessage.style.borderLeft = '4px solid #c62828';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function setLoading(isLoading) {
    translateBtn.classList.toggle('loading', isLoading);
    translateBtn.disabled = isLoading;
}
