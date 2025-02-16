---
title: Generative AI Chef
description: A dynamic Flask and React application powered by AI to generate recipes, provide step-by-step visual guides, and offer nutritional information.
tags:
  - python
  - flask
  - react
  - AI
  - cooking
  - Grok AI
  - DALL-E
---

# 🍳 Generative AI Chef

Welcome to **Generative AI Chef**, a cutting-edge application that combines the power of **Grok AI** and **DALL-E** to revolutionize your cooking experience. Whether you're a professional chef or a home cook, this app provides personalized recipe suggestions, step-by-step visual guides, and nutritional information to elevate your culinary skills.

## ✨ Features

- 🤖 **AI-Powered Recipe Generation**: Get detailed recipes tailored to your ingredients using **Grok AI**.
- 🖼️ **Step-by-Step Visual Guides**: Utilizes **DALL-E** to generate custom images for each step of the recipe, making it easier to follow along.
- 📊 **Nutritional Information**: Provides comprehensive nutritional details per serving, including calories, protein, fat, and carbohydrates.
- 📚 **Ingredient Management**: Add or remove ingredients dynamically to generate new recipes.
- 🍽️ **Cooking Tips & Variations**: Offers additional tips and variations to enhance your cooking experience.

## 🚀 How to Use

### Frontend (React)

1. **Setup the Environment**:
   - Ensure Node.js is installed on your machine.
   - Install the required dependencies:
     ```
     npm install
     ```

2. **Start the Development Server**:
   - Launch the React application:
     ```
     npm run dev
     ```

3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173` (or the port specified in your environment).

### Backend (Flask)

1. **Setup the Environment**:
   - Ensure Python 3.8+ is installed on your machine.
   - Install the required Python packages:
     ```
     pip install -r requirements.txt
     ```

2. **Start the Flask Server**:
   - Launch the Flask application:
     ```
     python3 main.py
     ```

3. **Access the API**:
   - The backend API will be available at `http://localhost:5000`.

## 🌐 API Endpoints

### Generate a Recipe

- **Endpoint**: `/generate`
- **Method**: POST
- **Content-Type**: `application/json`
- **Body**: Include a JSON object with an `ingredients` key, listing ingredients separated by commas.

  Example request body:
  ```json
  {
    "ingredients": "tomatoes, onions, garlic"
  }

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy Cooking! 🌟
