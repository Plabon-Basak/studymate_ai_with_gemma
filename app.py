import os
import json
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None

load_dotenv()

app = Flask(__name__)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it")

def build_prompt(topic, language, difficulty):
    if language == "Bangla":
        return f"""You are an expert educational tutor. Your task is to create clear, accurate, and structured study material based on the topic provided.

Topic: {topic}
Language: {language}
Difficulty: {difficulty}

Requirements:
1. Explain the topic in natural Bangla. 
2. Keep programming keywords and technical terms in English when appropriate.
3. Adjust explanation to the specified difficulty level.
4. Keep explanations simple and avoid unnecessary complexity.
5. Do not invent facts. Be accurate.
6. Structure your response with these exact headings in the same order:

📘 Explanation
Provide a clear and easy-to-understand explanation.

🔑 Key Concepts
List the most important concepts (bullet points if helpful).

💡 Example
Give a relevant real-life or conceptual example.

💻 Python Code
Include well-formatted Python code if this topic relates to programming. If not programming-related, still provide a small relevant example or note "Not applicable for this topic." but present the section clearly.

📝 Key Points
Give 5-7 important/key points as bullet points.

❓ Quiz
Generate exactly 5 quiz questions. Each question should be clear and appropriate for the difficulty level.

✅ Answers
Provide answers to all 5 quiz questions separately with clear numbering (Q1: ..., A1: ... or question and answer).

Important:
- Use Bangla naturally; do not do awkward word-for-word translations.
- Include examples that help understanding.
- Keep the entire response well-organized and readable.
"""
    else:
        return f"""You are an expert educational tutor. Your task is to create clear, accurate, and structured study material based on the topic provided.

Topic: {topic}
Language: {language}
Difficulty: {difficulty}

Requirements:
1. Explain the topic in clear English.
2. Adjust explanation to the specified difficulty level.
3. Keep explanations simple and avoid unnecessary complexity.
4. Do not invent facts. Be accurate.
5. Structure your response with these exact headings in the same order:

📘 Explanation
Provide a clear and easy-to-understand explanation.

🔑 Key Concepts
List the most important concepts (bullet points if helpful).

💡 Example
Give a relevant real-life or conceptual example.

💻 Python Code
Include well-formatted Python code if this topic relates to programming. If not programming-related, still provide a small relevant example or note "Not applicable for this topic." but present the section clearly.

📝 Key Points
Give 5-7 important/key points as bullet points.

❓ Quiz
Generate exactly 5 quiz questions. Each question should be clear and appropriate for the difficulty level.

✅ Answers
Provide answers to all 5 quiz questions separately with clear numbering (Q1-Q5 with corresponding answers).

Important:
- Use clear examples.
- Include Python code when the topic is programming-related.
- Keep the entire response well-organized and readable.
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json(silent=True) or {}
        topic = (data.get('topic') or '').strip()
        language = (data.get('language') or 'English').strip()
        difficulty = (data.get('difficulty') or 'Beginner').strip()

        if not topic:
            return jsonify({
                "success": False,
                "error": "Please enter a topic."
            }), 400

        valid_languages = ['English', 'Bangla']
        valid_difficulties = ['Beginner', 'Intermediate', 'Advanced']
        if language not in valid_languages:
            language = 'English'
        if difficulty not in valid_difficulties:
            difficulty = 'Beginner'

        if not GOOGLE_API_KEY:
            return jsonify({
                "success": False,
                "error": "Server configuration error. Please check environment variables."
            }), 500

        if genai is None or types is None:
            return jsonify({
                "success": False,
                "error": "Google AI SDK not installed. Please install requirements."
            }), 500

        client = genai.Client(api_key=GOOGLE_API_KEY)
        prompt = build_prompt(topic, language, difficulty)

        try:
            response = client.models.generate_content(
                model=GEMMA_MODEL,
                contents=prompt
            )
            content = response.text if hasattr(response, 'text') else str(response)
        except Exception as api_err:
            return jsonify({
                "success": False,
                "error": "The AI service is temporarily unavailable. Please try again."
            }), 503

        if not content:
            return jsonify({
                "success": False,
                "error": "The AI service returned an empty response. Please try again."
            }), 503

        return jsonify({
            "success": True,
            "content": content
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": "An unexpected error occurred. Please try again."
        }), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
