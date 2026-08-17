from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# ==========================================
# Translation API
# ==========================================

API_URL = "https://api.mymemory.translated.net/get"


# ==========================================
# Supported Languages
# ==========================================

SUPPORTED_LANGUAGES = {
    # Indian Languages
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

    # International Languages
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
}


# ==========================================
# Home Page
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# Translation Route
# ==========================================

@app.route("/translate", methods=["POST"])
def translate():

    # --------------------------------------
    # Get JSON data from frontend
    # --------------------------------------

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid request."
        }), 400


    # --------------------------------------
    # Get values
    # --------------------------------------

    text = data.get("text", "").strip()

    source = data.get("source", "en")

    target = data.get("target", "hi")


    # --------------------------------------
    # Check empty text
    # --------------------------------------

    if not text:

        return jsonify({
            "success": False,
            "message": "Please enter some text first."
        }), 400


    # --------------------------------------
    # Check language
    # --------------------------------------

    if source not in SUPPORTED_LANGUAGES:

        return jsonify({
            "success": False,
            "message": "Source language is not supported."
        }), 400


    if target not in SUPPORTED_LANGUAGES:

        return jsonify({
            "success": False,
            "message": "Target language is not supported."
        }), 400


    # --------------------------------------
    # Same language
    # --------------------------------------

    if source == target:

        return jsonify({
            "success": True,
            "translation": text
        })


    # --------------------------------------
    # Prepare API request
    # --------------------------------------

    params = {
        "q": text,
        "langpair": f"{source}|{target}"
    }


    print("\n===================================")
    print("TRANSLATION REQUEST")
    print("===================================")
    print("Text:", text)
    print("Source:", source)
    print("Target:", target)
    print("===================================")


    # --------------------------------------
    # Call Translation API
    # --------------------------------------

    try:

        response = requests.get(
            API_URL,
            params=params,
            timeout=8
        )


        print("API Status:", response.status_code)


        response.raise_for_status()


        result = response.json()


        print("API Response received.")


        # ----------------------------------
        # Get translation
        # ----------------------------------

        response_data = result.get(
            "responseData",
            {}
        )


        translated_text = response_data.get(
            "translatedText"
        )


        # ----------------------------------
        # Check translation
        # ----------------------------------

        if not translated_text:

            print("No translation returned.")

            return jsonify({
                "success": False,
                "message": "Translation service did not return a translation."
            }), 502


        print("Translation:", translated_text)
        print("===================================\n")


        # ----------------------------------
        # Send result to frontend
        # ----------------------------------

        return jsonify({
            "success": True,
            "translation": translated_text
        })


    # ======================================
    # Timeout Error
    # ======================================

    except requests.exceptions.Timeout:

        print("ERROR: Translation API timed out.")


        return jsonify({
            "success": False,
            "message": "Translation service is taking too long. Please try again."
        }), 504


    # ======================================
    # Connection / Request Error
    # ======================================

    except requests.exceptions.RequestException as error:

        print("REQUEST ERROR:", error)


        return jsonify({
            "success": False,
            "message": "Unable to connect to translation service."
        }), 502


    # ======================================
    # JSON Error
    # ======================================

    except ValueError as error:

        print("JSON ERROR:", error)


        return jsonify({
            "success": False,
            "message": "Invalid response from translation service."
        }), 502


    # ======================================
    # General Error
    # ======================================

    except Exception as error:

        print("GENERAL ERROR:", error)


        return jsonify({
            "success": False,
            "message": "Something went wrong while translating."
        }), 500


# ==========================================
# Run Application
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )