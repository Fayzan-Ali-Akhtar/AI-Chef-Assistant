import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Container, Button, InputGroup, FormControl, ListGroup, Spinner, Row, Col, Toast } from "react-bootstrap"
import RecipeSteps from "./RecipeSteps"
import LiquidProgress from "./components/LiquidProgress"
import { FaGithub } from "react-icons/fa"

// Types remain the same...
type RecipeData = {
  recipe_name: string
  servings: string
  prep_time: string
  cook_time: string
  total_time: string
  ingredients: string[]
  instructions: string[]
  tips_and_variations: string[]
  nutrition_info_per_serving?: {
    calories: string
    protein: string
    fat: string
    carbohydrates: string
  }
}

function App() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState<string>("")
  const [recipe, setRecipe] = useState<RecipeData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [recipeProgress, setRecipeProgress] = useState<number>(0)

  const contributors = [
    { name: "Fayzan Ali Akhtar", github: "https://github.com/Fayzan-Ali-Akhtar" },
    { name: "Ahmad Faraz", github: "https://github.com/ahmed-fz11" },
    { name: "Muhammad Zaeem Rizwan", github: "https://github.com/Zaimr49" },
    { name: "Muhammad Musa Zulfiqar", github: "https://github.com/m-musaz" },
    { name: "Hasan Hameed", github: "https://github.com/hasanhd555" },
  ]

  const handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewIngredient(event.target.value)
  }

  const addIngredient = () => {
    if (newIngredient.trim().length > 0) {
      setIngredients((prev) => [...prev, newIngredient.trim()])
      setNewIngredient("")
      setToastMessage("Ingredient added successfully!")
      setShowToast(true)
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
    setToastMessage("Ingredient removed!")
    setShowToast(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (ingredients.length === 0) {
      setToastMessage("Please add at least one ingredient")
      setShowToast(true)
      return
    }

    setLoading(true)
    setRecipeProgress(0)

    // Simulate recipe generation progress
    const recipeProgressInterval = setInterval(() => {
      setRecipeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(recipeProgressInterval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    try {
      const backendUrl = import.meta.env.VITE_DEPLOYED_BACKEND_URL || "http://localhost:3000/generate"
      const response = await axios.post<RecipeData>(backendUrl, {
        ingredients: ingredients.join(", "),
      })

      clearInterval(recipeProgressInterval)
      setRecipeProgress(100)
      setRecipe(response.data)

      setLoading(false)
    } catch (error) {
      clearInterval(recipeProgressInterval)
      console.error("Failed to fetch recipes", error)
      setToastMessage("Failed to generate recipe. Please try again.")
      setShowToast(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 py-2 px-2 py-md-4 px-md-4">
      <Container fluid="sm">
        <div className="main-card">
          <h1 className="app-title">✨ Generative AI Chef</h1>
          <p className="app-description">
            Enter ingredients one at a time and press <strong>"Get Recipe"</strong> to see how you can cook them into a
            delicious dish!
          </p>

          <InputGroup className="mb-4 gap-2">
            <FormControl
              placeholder="Enter an ingredient..."
              value={newIngredient}
              onChange={handleIngredientChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addIngredient()
                }
              }}
            />
            <Button variant="primary" onClick={addIngredient} className="w-100 w-md-auto">
              Add Ingredient
            </Button>
          </InputGroup>

          {ingredients.length > 0 && (
            <>
              <h2 className="section-title">Your Ingredients</h2>
              <ListGroup className="mb-4">
                {ingredients.map((ingredient, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2"
                  >
                    <span className="text-center text-md-start">{ingredient}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="w-100 w-md-auto"
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          <div className="text-center mb-5">
            <Button variant="success" onClick={handleSubmit} disabled={loading} className="get-recipe-btn">
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Generating Recipe... ✨
                </>
              ) : (
                "Get Recipe"
              )}
            </Button>

            {loading && <LiquidProgress progress={recipeProgress} label="Generating Recipe..." />}
          </div>

          {recipe && !loading && (
            <div className="recipe-card">
              <h2 className="section-title">{recipe.recipe_name}</h2>

              <div className="recipe-info">
                <div className="info-item">
                  <div className="info-label">Servings</div>
                  <div className="info-value">{recipe.servings}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Prep Time</div>
                  <div className="info-value">{recipe.prep_time}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Cook Time</div>
                  <div className="info-value">{recipe.cook_time}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Total Time</div>
                  <div className="info-value">{recipe.total_time}</div>
                </div>
              </div>

              <h3 className="section-title">Recipe Ingredients</h3>
              <ListGroup className="mb-4">
                {recipe.ingredients.map((ing, i) => (
                  <ListGroup.Item key={i}>{ing}</ListGroup.Item>
                ))}
              </ListGroup>

              {recipe.tips_and_variations.length > 0 && (
                <>
                  <h3 className="section-title">Tips & Variations</h3>
                  <ListGroup className="mb-4">
                    {recipe.tips_and_variations.map((tip, i) => (
                      <ListGroup.Item key={i}>{tip}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              )}

              {recipe.nutrition_info_per_serving && (
                <div className="recipe-card mb-4">
                  <h3 className="section-title">Nutrition (per serving)</h3>
                  <Row className="g-3">
                    <Col xs={12} sm={6} md={3}>
                      <div className="info-item">
                        <div className="info-label">Calories</div>
                        <div className="info-value">{recipe.nutrition_info_per_serving.calories}</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <div className="info-item">
                        <div className="info-label">Protein</div>
                        <div className="info-value">{recipe.nutrition_info_per_serving.protein}</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <div className="info-item">
                        <div className="info-label">Fat</div>
                        <div className="info-value">{recipe.nutrition_info_per_serving.fat}</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <div className="info-item">
                        <div className="info-label">Carbs</div>
                        <div className="info-value">{recipe.nutrition_info_per_serving.carbohydrates}</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              <RecipeSteps instructions={recipe.instructions} />
            </div>
          )}
        </div>
      </Container>

      {/* GitHub Contributors Section */}
      <footer className="text-center mt-5">
        <h5>👨‍💻 Made with ❤️ by Our Team</h5>
        <ul className="list-unstyled">
          {contributors.map((contributor, index) => (
            <li key={index} className="my-2">
              <a
                href={contributor.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: "18px", color: "#333" }}
              >
                <FaGithub size={22} /> {/* GitHub Icon */}
                {contributor.name}
              </a>
            </li>
          ))}
        </ul>
      </footer>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        className="position-fixed bottom-0 end-0 m-3"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  )
}

export default App

