import os
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS
from dotenv import load_dotenv
import json
from collections import OrderedDict
import requests

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for all routes

# Check if API key is loaded correctly
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("Error: GROQ_API_KEY is not set. Make sure it's in your .env file.")

# Initialize Groq Client
client = Groq(api_key=api_key)

# Model to use
MODEL_ID = "llama-3.3-70b-versatile"  

@app.route("/")
def home():
    return "Hello World"

@app.route("/generate", methods=['POST'])
def generate_from_model():
    """ Generate a recipe using GroqCloud API based on user-provided ingredients. """
    
    data = request.get_json()
    ingredients = data.get("ingredients")

    if not ingredients or not isinstance(ingredients, str):
        return jsonify({"error": "Invalid input. Please provide a comma-separated string of ingredients."}), 400

    ingredients_list = [ingredient.strip() for ingredient in ingredients.split(',')]
    print("Received ingredients:", ingredients_list)

    # Constructing prompt for LLM
    prompt_text = f"""
    You are a professional chef assistant. Your task is to generate a structured JSON object containing a detailed cooking recipe using the following ingredients: {', '.join(ingredients_list)}.
    ### **Instructions:**
    - Follow the exact JSON structure provided below.
    - Do **NOT** include any extra text, explanations, or comments—only return a valid JSON object.
    - Ensure the generated JSON is **well-formatted** and follows the exact structure.
    ### **Example JSON Format (Strictly Follow This):**
    {{
        "recipe_name": "Delicious Dish Name",
        "servings": 4,
        "prep_time": "XX minutes",
        "cook_time": "XX minutes",
        "total_time": "XX minutes",
        "ingredients": [
            "Ingredient 1",
            "Ingredient 2",
            "Ingredient 3",
            "Ingredient 4",
            "Ingredient 5"
        ],
        "instructions": [
            {{
                "step": 1,
                "title": "Step 1 Title",
                "details": [
                    "Step 1 detail line 1.",
                    "Step 1 detail line 2."
                ]
            }},
            {{
                "step": 2,
                "title": "Step 2 Title",
                "details": [
                    "Step 2 detail line 1.",
                    "Step 2 detail line 2."
                ]
            }},
            {{
                "step": 3,
                "title": "Step 3 Title",
                "details": [
                    "Step 3 detail line 1.",
                    "Step 3 detail line 2."
                ]
            }},
            {{
                "step": 4,
                "title": "Step 4 Title",
                "details": [
                    "Step 4 detail line 1.",
                    "Step 4 detail line 2."
                ]
            }},
            {{
                "step": 5,
                "title": "Step 5 Title",
                "details": [
                    "Step 5 detail line 1.",
                    "Step 5 detail line 2."
                ]
            }},
            {{
                "step": 6,
                "title": "Step 6 Title",
                "details": [
                    "Step 6 detail line 1.",
                    "Step 6 detail line 2."
                ]
            }}
        ],
        "tips_and_variations": [
            "Tip 1: Placeholder text for a useful tip.",
            "Tip 2: Placeholder text for another tip.",
            "Tip 3: Placeholder text for a variation suggestion."
        ],
        "nutrition_info_per_serving": {{
            "calories": "XXX",
            "protein": "XXg",
            "fat": "XXg",
            "saturated_fat": "XXg",
            "cholesterol": "XXXmg",
            "sodium": "XXXmg",
            "carbohydrates": "XXg",
            "fiber": "XXg",
            "sugar": "XXg"
        }}
    }}
    Now, generate a JSON object for a recipe using these ingredients: {', '.join(ingredients_list)}.
    Only return a valid JSON object without any extra text.
    """


    try:
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt_text}
            ],
            model=MODEL_ID,
        )

        # Extract generated recipe (which should be in JSON format)
        recipe_text = chat_completion.choices[0].message.content.strip()
        print("Generated Recipe (raw):", recipe_text)

        # Convert text response to JSON while preserving key order
        try:
            recipe_json = json.loads(recipe_text, object_pairs_hook=OrderedDict)  # Preserve order
            json_string = json.dumps(recipe_json, indent=4)  # Convert back to JSON string for proper formatting
            return json_string, 200, {'Content-Type': 'application/json'}  # Send JSON with correct header
        except json.JSONDecodeError:
            print("Error: LLM did not return a valid JSON format.")
            return jsonify({"error": "Invalid JSON format received from AI"}), 500

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "An error occurred while generating the recipe"}), 500

@app.route("/generate-image", methods=["POST"])
def generate_image():
    data = request.get_json()
    step_title = data.get("title")
    if not step_title:
        return jsonify({"error": "No step title provided"}), 400

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        return jsonify({"error": "OpenAI API key not found on server"}), 500

    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}",
    }
    payload = {
        "model": "dall-e-2",  # or "image-alpha-001", or "dall-e-3" if you have access
        "prompt": f"A detailed photo illustrating this cooking step: {step_title}",
        "n": 1,
        "size": "512x512",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        print("image gen response =",response)
        if response.status_code != 200:
            return jsonify({
                "error": "OpenAI API returned an error",
                "status_code": response.status_code,
                "details": response.text
            }), 500

        # Instead of extracting image_url, return the entire data
        print("Image gen response")
        openai_data = response.json()
        print("openai_data =",openai_data)

        # e.g. { "created": 1690584848, "data": [{ "url": "https://..." }], ... }
        return jsonify(openai_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 7860)))