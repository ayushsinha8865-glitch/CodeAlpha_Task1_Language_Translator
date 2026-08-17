// ==========================================
// AI LANGUAGE TRANSLATOR - CODEALPHA TASK 1
// ==========================================


// ------------------------------------------
// Language List
// ------------------------------------------

const languages = {

    // 🇮🇳 Indian Languages

    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "pa": "Punjabi",
    "ur": "Urdu",
    "mr": "Marathi",
    "gu": "Gujarati",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "or": "Odia",
    "as": "Assamese",
    "sa": "Sanskrit",
    "bh": "Bhojpuri",

    // 🌍 International Languages

    "fr": "French",
    "es": "Spanish",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "nl": "Dutch",
    "ru": "Russian",
    "ar": "Arabic",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean",
    "tr": "Turkish",
    "pl": "Polish",
    "uk": "Ukrainian",
    "vi": "Vietnamese",
    "id": "Indonesian",
    "ms": "Malay",
    "th": "Thai",
    "he": "Hebrew",
    "el": "Greek",
    "ro": "Romanian",
    "cs": "Czech",
    "sv": "Swedish",
    "da": "Danish",
    "fi": "Finnish",
    "no": "Norwegian"
};


// ------------------------------------------
// HTML Elements
// ------------------------------------------

const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const inputText =
    document.getElementById("inputText");

const outputText =
    document.getElementById("outputText");

const translateButton =
    document.getElementById("translateButton");

const swapButton =
    document.getElementById("swapButton");

const micButton =
    document.getElementById("micButton");

const speakButton =
    document.getElementById("speakButton");

const copyButton =
    document.getElementById("copyButton");

const clearButton =
    document.getElementById("clearButton");

const charCount =
    document.getElementById("charCount");

const statusMessage =
    document.getElementById("statusMessage");


// ------------------------------------------
// Status Message Function
// ------------------------------------------

function showStatus(message, type = "") {

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;

    statusMessage.className = "status-message";

    if (type === "success") {

        statusMessage.classList.add(
            "status-success"
        );

    } else if (type === "error") {

        statusMessage.classList.add(
            "status-error"
        );
    }
}


// ------------------------------------------
// Add Languages to Dropdowns
// ------------------------------------------

function loadLanguages() {

    for (const code in languages) {

        const option1 =
            document.createElement("option");

        option1.value = code;

        option1.textContent = languages[code];

        sourceLanguage.appendChild(option1);


        const option2 =
            document.createElement("option");

        option2.value = code;

        option2.textContent = languages[code];

        targetLanguage.appendChild(option2);
    }


    // Default languages

    sourceLanguage.value = "en";

    targetLanguage.value = "hi";
}


loadLanguages();


// ------------------------------------------
// Character Counter
// ------------------------------------------

inputText.addEventListener("input", function () {

    charCount.textContent =
        inputText.value.length;

});


// ------------------------------------------
// Translate Function
// ------------------------------------------

translateButton.addEventListener(
    "click",
    translateText
);


async function translateText() {

    const text =
        inputText.value.trim();

    const source =
        sourceLanguage.value;

    const target =
        targetLanguage.value;


    // Check empty input

    if (!text) {

        showStatus(
            "Please enter some text first.",
            "error"
        );

        return;
    }


    // Show loading

    translateButton.disabled = true;

    translateButton.textContent =
        "Translating...";


    showStatus(
        "Translating your text...",
        ""
    );


    try {

        const response =
            await fetch("/translate", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    text: text,

                    source: source,

                    target: target

                })

            });


        const data =
            await response.json();


        if (data.success) {

            outputText.value =
                data.translation;


            showStatus(
                "Translation completed successfully.",
                "success"
            );

        } else {

            showStatus(
                data.message ||
                "Translation failed.",
                "error"
            );
        }


    } catch (error) {

        console.error(error);

        showStatus(
            "Could not connect to the server.",
            "error"
        );

    } finally {

        translateButton.disabled = false;

        translateButton.textContent =
            "Translate";
    }
}


// ------------------------------------------
// Swap Languages
// ------------------------------------------

swapButton.addEventListener(
    "click",
    function () {

        const oldSource =
            sourceLanguage.value;

        const oldTarget =
            targetLanguage.value;


        sourceLanguage.value =
            oldTarget;

        targetLanguage.value =
            oldSource;


        // Also swap text

        const oldInput =
            inputText.value;

        const oldOutput =
            outputText.value;


        inputText.value =
            oldOutput;

        outputText.value =
            oldInput;


        charCount.textContent =
            inputText.value.length;


        showStatus(
            "Languages swapped.",
            "success"
        );
    }
);


// ------------------------------------------
// Copy Translation
// ------------------------------------------

copyButton.addEventListener(
    "click",
    async function () {

        const text =
            outputText.value.trim();


        if (!text) {

            showStatus(
                "There is no translation to copy.",
                "error"
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(text);

            showStatus(
                "Translation copied to clipboard.",
                "success"
            );

        } catch (error) {

            showStatus(
                "Could not copy the translation.",
                "error"
            );
        }
    }
);


// ------------------------------------------
// Clear Button
// ------------------------------------------

clearButton.addEventListener(
    "click",
    function () {

        inputText.value = "";

        outputText.value = "";

        charCount.textContent = "0";

        statusMessage.textContent = "";

    }
);


// ------------------------------------------
// Voice Input
// ------------------------------------------

// Browser Speech Recognition

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;


    micButton.addEventListener(
        "click",
        startVoiceInput
    );


} else {

    micButton.addEventListener(
        "click",
        function () {

            showStatus(
                "Voice input is not supported by this browser.",
                "error"
            );

        }
    );
}


// ------------------------------------------
// Start Voice Input
// ------------------------------------------

function startVoiceInput() {

    if (!recognition) {
        return;
    }

    const languageCode =
        sourceLanguage.value;


    // Language code -> speech recognition language

    const speechLanguages = {

        // Indian

        "en": "en-IN",
        "hi": "hi-IN",
        "bn": "bn-IN",
        "pa": "pa-IN",
        "ur": "ur-IN",
        "mr": "mr-IN",
        "gu": "gu-IN",
        "ta": "ta-IN",
        "te": "te-IN",
        "kn": "kn-IN",
        "ml": "ml-IN",
        "or": "or-IN",
        "as": "as-IN",
        "sa": "sa-IN",
        "bh": "hi-IN",

        // International

        "fr": "fr-FR",
        "es": "es-ES",
        "de": "de-DE",
        "it": "it-IT",
        "pt": "pt-PT",
        "nl": "nl-NL",
        "ru": "ru-RU",
        "ar": "ar-SA",
        "zh": "zh-CN",
        "ja": "ja-JP",
        "ko": "ko-KR",
        "tr": "tr-TR",
        "pl": "pl-PL",
        "uk": "uk-UA",
        "vi": "vi-VN",
        "id": "id-ID",
        "ms": "ms-MY",
        "th": "th-TH",
        "he": "he-IL",
        "el": "el-GR",
        "ro": "ro-RO",
        "cs": "cs-CZ",
        "sv": "sv-SE",
        "da": "da-DK",
        "fi": "fi-FI",
        "no": "nb-NO"
    };


    recognition.lang =
        speechLanguages[languageCode] ||
        "en-IN";


    try {

        recognition.start();

        micButton.classList.add("recording");

        showStatus(
            "Listening... Please speak now.",
            "success"
        );

    } catch (error) {

        console.log(
            "Speech recognition could not start:",
            error
        );
    }
}


// ------------------------------------------
// Voice Input Result
// ------------------------------------------

if (recognition) {

    recognition.onresult =
        function (event) {

            const transcript =
                event.results[0][0].transcript;


            inputText.value =
                transcript;


            charCount.textContent =
                transcript.length;


            showStatus(
                "Voice input received.",
                "success"
            );
        };


    recognition.onerror = function (event) {

        console.error(
            "Speech recognition error:",
            event.error
        );


        if (event.error === "not-allowed") {

            showStatus(
                "Microphone permission was denied. Please allow microphone access.",
                "error"
            );

        } else if (event.error === "no-speech") {

            showStatus(
                "No speech detected. Please try speaking again.",
                "error"
            );

        } else if (event.error === "network") {

            showStatus(
                "Network error while recognizing speech.",
                "error"
            );

        } else {

            showStatus(
                "Could not recognize your voice. Please try again.",
                "error"
            );
        }
    };


    recognition.onend =
        function () {

            micButton.classList.remove(
                "recording"
            );
        };
}


// ------------------------------------------
// Text to Speech
// ------------------------------------------

const speechLanguageMap = {

    // Indian Languages
    "en": ["en-IN", "en-US"],
    "hi": ["hi-IN"],
    "bn": ["bn-IN", "bn-BD"],
    "pa": ["pa-IN"],
    "ur": ["ur-IN", "ur-PK"],
    "mr": ["mr-IN"],
    "gu": ["gu-IN"],
    "ta": ["ta-IN"],
    "te": ["te-IN"],
    "kn": ["kn-IN"],
    "ml": ["ml-IN"],
    "or": ["or-IN"],
    "as": ["as-IN"],
    "sa": ["sa-IN"],
    "bh": ["hi-IN"],

    // International Languages
    "fr": ["fr-FR", "fr-CA"],
    "es": ["es-ES", "es-MX"],
    "de": ["de-DE"],
    "it": ["it-IT"],
    "pt": ["pt-PT", "pt-BR"],
    "nl": ["nl-NL"],
    "ru": ["ru-RU"],
    "ar": ["ar-SA", "ar-EG"],
    "zh": ["zh-CN", "zh-TW"],
    "ja": ["ja-JP"],
    "ko": ["ko-KR"],
    "tr": ["tr-TR"],
    "pl": ["pl-PL"],
    "uk": ["uk-UA"],
    "vi": ["vi-VN"],
    "id": ["id-ID"],
    "ms": ["ms-MY"],
    "th": ["th-TH"],
    "he": ["he-IL"],
    "el": ["el-GR"],
    "ro": ["ro-RO"],
    "cs": ["cs-CZ"],
    "sv": ["sv-SE"],
    "da": ["da-DK"],
    "fi": ["fi-FI"],
    "no": ["nb-NO"]
};


// ------------------------------------------
// Get Available Browser Voices
// ------------------------------------------

function getAvailableVoices() {

    return window.speechSynthesis.getVoices();
}


// ------------------------------------------
// Find Best Matching Voice
// ------------------------------------------

function findBestVoice(languageCode) {

    const voices = getAvailableVoices();

    const possibleLanguages =
        speechLanguageMap[languageCode] || ["en-IN"];

    // 1. Try exact language match
    for (const lang of possibleLanguages) {

        const exactVoice = voices.find(function (voice) {

            return voice.lang.toLowerCase() ===
                lang.toLowerCase();

        });

        if (exactVoice) {
            return exactVoice;
        }
    }


    // 2. Try base language match
    for (const lang of possibleLanguages) {

        const baseLanguage =
            lang.split("-")[0].toLowerCase();

        const baseVoice = voices.find(function (voice) {

            return voice.lang
                .toLowerCase()
                .startsWith(baseLanguage);

        });

        if (baseVoice) {
            return baseVoice;
        }
    }


    // 3. No matching voice found
    return null;
}


// ------------------------------------------
// Speak Button
// ------------------------------------------

speakButton.addEventListener(
    "click",
    function () {

        const text =
            outputText.value.trim();


        // Check translation
        if (!text) {

            showStatus(
                "There is no translation to speak.",
                "error"
            );

            return;
        }


        // Check browser support
        if (!window.speechSynthesis) {

            showStatus(
                "Text-to-speech is not supported by this browser.",
                "error"
            );

            return;
        }


        // Stop previous speech
        window.speechSynthesis.cancel();


        const target =
            targetLanguage.value;


        const possibleLanguages =
            speechLanguageMap[target] ||
            ["en-IN"];


        const speechLang =
            possibleLanguages[0];


        // Create speech
        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang =
            speechLang;


        // Soft and clear voice
        speech.rate = 0.88;
        speech.pitch = 1.0;
        speech.volume = 1.0;


        // Find proper language voice
        const selectedVoice =
            findBestVoice(target);


        if (selectedVoice) {

            speech.voice =
                selectedVoice;

            speech.lang =
                selectedVoice.lang;

        } else {

            console.warn(
                "No matching voice found for:",
                target,
                possibleLanguages
            );
        }


        // ------------------------------------------
        // Speech Events
        // ------------------------------------------

        speech.onstart = function () {

            showStatus(
                "Playing translation...",
                "success"
            );
        };


        speech.onend = function () {

            showStatus(
                "Finished speaking.",
                "success"
            );
        };


        speech.onerror = function (event) {

            console.error(
                "Speech synthesis error:",
                event
            );

            showStatus(
                "Could not play the selected language voice.",
                "error"
            );
        };


        // Start speaking
        window.speechSynthesis.speak(
            speech
        );
    }
);


// ------------------------------------------
// Load Voices
// ------------------------------------------

function loadSpeechVoices() {

    const voices =
        window.speechSynthesis.getVoices();

    console.log(
        "Available speech voices:",
        voices
    );
}


// Some browsers load voices after page startup
window.speechSynthesis.onvoiceschanged =
    loadSpeechVoices;


// Load immediately as well
loadSpeechVoices();


// =========================================
// PROFESSIONAL SPLASH SCREEN
// =========================================

window.addEventListener(
    "load",
    function () {

        const splash =
            document.getElementById(
                "splash-screen"
            );


        const mainApp =
            document.getElementById(
                "main-app"
            );


        const progressBar =
            document.getElementById(
                "progress-bar"
            );


        const percentage =
            document.getElementById(
                "loading-percent"
            );


        const status =
            document.getElementById(
                "loading-status"
            );


        let progress = 0;


        const loadingMessages = [

            "Starting application...",

            "Loading language engine...",

            "Preparing translation system...",

            "Loading Indian languages...",

            "Loading international languages...",

            "Initializing voice input...",

            "Initializing speech output...",

            "Almost ready..."
        ];


        const progressInterval =
            setInterval(
                function () {

                    progress +=
                        Math.floor(
                            Math.random() * 4
                        ) + 1;


                    if (progress >= 100) {

                        progress = 100;
                    }


                    progressBar.style.width =
                        progress + "%";


                    percentage.textContent =
                        progress + "%";


                    // Change loading message

                    const messageIndex =
                        Math.min(
                            Math.floor(
                                progress / 13
                            ),
                            loadingMessages.length - 1
                        );


                    status.textContent =
                        loadingMessages[
                            messageIndex
                        ];


                    // Finished

                    if (progress >= 100) {

                        clearInterval(
                            progressInterval
                        );


                        status.textContent =
                            "Ready to translate ✨";


                        setTimeout(
                            function () {

                                splash.style.opacity =
                                    "0";


                                splash.style.visibility =
                                    "hidden";


                                mainApp.classList.add(
                                    "show"
                                );


                                setTimeout(
                                    function () {

                                        splash.remove();

                                    },
                                    800
                                );

                            },
                            400
                        );
                    }

                },
                55
            );
    }
);