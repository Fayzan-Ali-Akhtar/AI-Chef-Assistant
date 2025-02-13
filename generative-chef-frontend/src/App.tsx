import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Spinner,
  Row,
  Col
} from 'react-bootstrap';
import RecipeSteps from './RecipeSteps';

// ---------- Type Definitions ----------
interface RecipeInstruction {
  step: number;
  title: string;
  details: string[];
}

interface NutritionInfo {
  calories: string;
  protein: string;
  fat: string;
  saturated_fat: string;
  cholesterol: string;
  sodium: string;
  carbohydrates: string;
  fiber: string;
  sugar: string;
}

interface RecipeData {
  recipe_name: string;
  servings: number;
  prep_time: string;
  cook_time: string;
  total_time: string;
  ingredients: string[];
  instructions: RecipeInstruction[];
  tips_and_variations: string[];
  nutrition_info_per_serving: NutritionInfo;
}

function App() {
  // ---------- State ----------
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState<string>('');
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // ---------- Handlers ----------
  const handleIngredientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewIngredient(event.target.value);
  };

  const addIngredient = () => {
    if (newIngredient.trim().length > 0) {
      setIngredients((prev) => [...prev, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (ingredients.length === 0) {
      alert('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    try {
      // Example backend endpoint
      const backendUrl = import.meta.env.VITE_DEPLOYED_BACKEND_URL 
        || 'http://localhost:3000/generate';

      const response = await axios.post<RecipeData>(backendUrl, {
        ingredients: ingredients.join(', '),
      });

      setRecipe(response.data); 
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
      setLoading(false);
    }
  };

  // ---------- Theming Classes ----------
  const pageClasses = darkMode
    ? 'dark-mode-bg text-white min-vh-100 w-100'
    : 'light-mode-bg text-dark min-vh-100 w-100';

  return (
    <div className={`${pageClasses} d-flex flex-column`}>
      {/* Toggle Button (top-right corner) */}
      <div className="d-flex justify-content-end p-3">
        <Button
          variant={darkMode ? 'outline-light' : 'outline-dark'}
          onClick={() => setDarkMode(!darkMode)}
          className="animate__animated animate__fadeIn"
        >
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>
      </div>

      {/* Main Card Container */}
      <Container
        className={`
          main-card 
          p-5 
          ${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'} 
          animate__animated animate__fadeInUp
        `}
      >
        {/* Heading / Intro */}
        <h1 className="text-center mb-4 display-4 animate__animated animate__fadeInDown">
          Generative AI Chef
        </h1>
        <p className="text-center fs-5 mb-5">
          Enter ingredients one at a time and press <strong>"Get Recipe"</strong> to see how
          you can cook them into a delicious dish!
        </p>

        {/* Ingredient Input */}
        <InputGroup className="mb-4">
          <FormControl
            placeholder="Enter an ingredient"
            aria-label="Enter an ingredient"
            value={newIngredient}
            onChange={handleIngredientChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addIngredient();
              }
            }}
            className={
              darkMode
                ? 'bg-dark text-white animate__animated animate__fadeInLeft'
                : 'bg-light text-dark animate__animated animate__fadeInLeft'
            }
          />
          <Button
            variant="primary"
            onClick={addIngredient}
            className="animate__animated animate__fadeInRight"
          >
            Add Ingredient
          </Button>
        </InputGroup>

        {/* Ingredients List */}
        {ingredients.length > 0 && (
          <h2 className="mb-3 animate__animated animate__fadeIn">
            Ingredients
          </h2>
        )}
        <ListGroup className="mb-4">
          {ingredients.map((ingredient, index) => (
            <ListGroup.Item
              key={index}
              className={`
                d-flex justify-content-between align-items-center
                animate__animated animate__fadeIn
                ${darkMode ? 'bg-secondary text-white' : ''}
              `}
            >
              {ingredient}
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Get Recipe Button */}
        <div className="text-center mb-5">
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 fw-bold animate__animated animate__pulse animate__infinite"
          >
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                variant="light"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Get Recipe'
            )}
          </Button>
        </div>

        {/* Once we have a recipe, display its details */}
        {recipe && !loading && (
          <div className="animate__animated animate__fadeIn">
            <h2 className="mb-3">{recipe.recipe_name}</h2>
            <Row className="mb-3">
              <Col>
                <strong>Servings:</strong> {recipe.servings}
              </Col>
              <Col>
                <strong>Prep Time:</strong> {recipe.prep_time}
              </Col>
              <Col>
                <strong>Cook Time:</strong> {recipe.cook_time}
              </Col>
              <Col>
                <strong>Total Time:</strong> {recipe.total_time}
              </Col>
            </Row>

            {/* Show the final ingredient list from the recipe, if needed */}
            <h5>Recipe Ingredients</h5>
            <ListGroup className="mb-3">
              {recipe.ingredients.map((ing, i) => (
                <ListGroup.Item
                  key={i}
                  className={darkMode ? 'bg-secondary text-white' : ''}
                >
                  {ing}
                </ListGroup.Item>
              ))}
            </ListGroup>

            {/* Show tips & variations if present */}
            {recipe.tips_and_variations.length > 0 && (
              <>
                <h5>Tips & Variations</h5>
                <ListGroup className="mb-3">
                  {recipe.tips_and_variations.map((tip, i) => (
                    <ListGroup.Item
                      key={i}
                      className={darkMode ? 'bg-secondary text-white' : ''}
                    >
                      {tip}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            {/* Show nutrition info if present */}
            {recipe.nutrition_info_per_serving && (
              <div className="mb-4">
                <h5>Nutrition (per serving)</h5>
                <p>
                  <strong>Calories:</strong> {recipe.nutrition_info_per_serving.calories} |{' '}
                  <strong>Protein:</strong> {recipe.nutrition_info_per_serving.protein} |{' '}
                  <strong>Fat:</strong> {recipe.nutrition_info_per_serving.fat} |{' '}
                  <strong>Carbs:</strong> {recipe.nutrition_info_per_serving.carbohydrates}
                </p>
              </div>
            )}

            {/* Pass the instructions to the child component for step-by-step display */}
            <RecipeSteps instructions={recipe.instructions} darkMode={darkMode} />
          </div>
        )}
      </Container>

      {/* Footer */}
      <div className="mt-auto text-center pb-3">
        <small>
          &copy; {new Date().getFullYear()} Generative AI Chef
        </small>
      </div>
    </div>
  );
}

export default App;
