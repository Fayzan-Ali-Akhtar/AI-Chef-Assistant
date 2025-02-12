import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import RecipeSteps from './RecipeSteps';

function App() {
  // ---------- State ----------
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
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
      const ingredientsString = ingredients.join(', ');
      const backend_url = 'http://localhost:3000/generate'; // Adjust as needed

      const response = await axios.post(backend_url, {
        ingredients: ingredientsString,
      });

      setSteps(response.data); // Assuming response.data is string[]
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
      setLoading(false);
    }
  };

  // ---------- Theming Classes ----------
  // We'll use "min-vh-100" (100% viewport height) and "w-100" (full width)
  // so the background spans the entire screen
  const pageClasses = darkMode
    ? 'bg-dark text-white min-vh-100 w-100'
    : 'bg-light text-dark min-vh-100 w-100';

  return (
    <div className={pageClasses}>
      {/* Container for nice Bootstrap spacing and margins */}
      <Container className="py-5 animate__animated animate__fadeIn">
        {/* Toggle Button */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant={darkMode ? 'light' : 'dark'}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Button>
        </div>

        {/* Main Heading */}
        <h1 className="text-center mb-4 display-4 animate__animated animate__fadeInDown">
          Generative AI Chef
        </h1>
        <p className="text-center fs-5 mb-5">
          Enter ingredients one at a time and press "Get Recipe" to see how you
          can cook them into a delicious dish!
        </p>

        {/* Ingredient Input */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Enter an ingredient"
            aria-label="Enter an ingredient"
            value={newIngredient}
            onChange={handleIngredientChange}
            className={darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}
          />
          <Button variant="primary" onClick={addIngredient}>
            Add Ingredient
          </Button>
        </InputGroup>

        {/* Ingredients List */}
        {ingredients.length > 0 && <h2 className="mb-3">Ingredients</h2>}
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
          <Button variant="success" onClick={handleSubmit} disabled={loading}>
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

        {/* Recipe Steps */}
        <RecipeSteps steps={steps} darkMode={darkMode} />
      </Container>
    </div>
  );
}

export default App;
