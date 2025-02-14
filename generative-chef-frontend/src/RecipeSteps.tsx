"use client"

import { useEffect, useState } from "react"
import { Spinner } from "react-bootstrap"

interface RecipeInstruction {
  step: number
  title: string
  details: string[]
}

interface RecipeStepsProps {
  instructions: RecipeInstruction[]
  onImageProgress?: (progress: number) => void
}

function RecipeSteps({ instructions, onImageProgress }: RecipeStepsProps) {
  const [images, setImages] = useState<Array<string | null>>(new Array(instructions.length).fill(null))
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (instructions.length === 0) return

    const fetchImages = async () => {
      setLoading(true)
      const BASE_URL = import.meta.env.VITE_DEPLOYED_BACKEND_URL || "https://sprojvln-flask-ai-chef.hf.space"
      const newImages: Array<string | null> = []

      for (let i = 0; i < instructions.length; i++) {
        const instr = instructions[i]
        const stepTitle = instr.title

        try {
          const url = `${BASE_URL}-image`
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: stepTitle }),
          })

          if (!response.ok) {
            console.error(`Failed to fetch image for step ${instr.step}:`, response.statusText)
            newImages[i] = null
          } else {
            const data = await response.json()
            if (data.data && data.data[0] && data.data[0].url) {
              newImages[i] = data.data[0].url
            } else {
              newImages[i] = null
            }
          }

          // Update progress
          onImageProgress?.(i + 1)
        } catch (error) {
          console.error(`Error fetching image for step ${instr.step}:`, error)
          newImages[i] = null
          // Still update progress even on error
          onImageProgress?.(i + 1)
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      setImages(newImages)
      setLoading(false)
    }

    fetchImages()
  }, [instructions, onImageProgress])

  return (
    <div className="recipe-steps">
      <h3 className="section-title">Instructions</h3>
      <div className="steps-container">
        {instructions.map((instr, index) => (
          <div key={instr.step} className="step-card">
            <div className="step-number">Step {instr.step}</div>
            <h4 className="mb-3 text-white fw-semibold">{instr.title}</h4>
            <div className="step-details">
              {instr.details.map((detail, i) => (
                <p key={i} className="mb-2 text-light">
                  {detail}
                </p>
              ))}
            </div>

            <div className="text-center mt-4">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Spinner animation="border" size="sm" />
                  <p className="mb-0 text-light">Generating visualization... ✨</p>
                </div>
              ) : images[index] ? (
                <div className="image-container">
                  <img
                    src={images[index]! || "/placeholder.svg"}
                    alt={`Visualization for step ${instr.step}`}
                    className="recipe-image"
                  />
                </div>
              ) : (
                <div className="image-container">
                  <img src="https://via.placeholder.com/300" alt="Placeholder" className="recipe-image" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeSteps

