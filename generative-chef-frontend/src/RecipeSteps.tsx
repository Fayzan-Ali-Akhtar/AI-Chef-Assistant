import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

interface RecipeInstruction {
  step: number;
  title: string;
  details: string[];
}

interface RecipeStepsProps {
  instructions: RecipeInstruction[];
  darkMode: boolean;
}

function RecipeSteps({ instructions, darkMode }: RecipeStepsProps) {
  const [images, setImages] = useState<Array<string | null>>(
    new Array(instructions.length).fill(null)
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (instructions.length === 0) return;

    const fetchImages = async () => {
      setLoading(true);

      // Your Hugging Face Spaces or local backend
      const BASE_URL = import.meta.env.VITE_DEPLOYED_BACKEND_URL 
        || "https://sprojvln-flask-ai-chef.hf.space";

      const newImages: Array<string | null> = [];

      for (let i = 0; i < instructions.length; i++) {
        const instr = instructions[i];
        const stepTitle = instr.title;

        try {
          // Call /generate-image with the step title
          const url = `${BASE_URL}-image`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: stepTitle }),
          });

          if (!response.ok) {
            console.error(`Failed to fetch image for step ${instr.step}:`, response.statusText);
            newImages[i] = null;
          } else {
            // Now we get the entire OpenAI response
            const data = await response.json();
            
            // Debugging: see the entire response
            console.log("OpenAI full response for step", instr.step, data);
            
            // If the data has "data" array with a "url" inside:
            // For DALL·E: data.data[0].url
            if (data.data && data.data[0] && data.data[0].url) {
              newImages[i] = data.data[0].url;
            } else {
              newImages[i] = null;
            }
          }
        } catch (error) {
          console.error(`Error fetching image for step ${instr.step}:`, error);
          newImages[i] = null;
        }

        // Optional short delay between steps
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setImages(newImages);
      setLoading(false);
    };

    fetchImages();
  }, [instructions]);

  return (
    <div>
      <h3 className="mb-4">Instructions</h3>
      {instructions.map((instr, index) => (
        <div
          key={instr.step}
          className={`
            card mt-3 border border-muted 
            animate__animated animate__fadeInUp 
            ${darkMode ? 'bg-secondary text-white' : ''}
          `}
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="card-body">
            <h4 className="card-title">
              Step {instr.step}: {instr.title}
            </h4>
            {instr.details.map((detail, i) => (
              <p key={i} className="card-text fs-6 mb-1">
                {detail}
              </p>
            ))}

            <div className="text-center mt-3">
              {loading ? (
                <>
                  <p>Generating Image...</p>
                  <Spinner animation="border" variant="primary" />
                </>
              ) : images[index] ? (
                <img
                  src={images[index]!}
                  alt={`Visualization for step ${instr.step}`}
                  className="img-fluid mx-auto d-block"
                  style={{ maxWidth: '300px', borderRadius: '8px' }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/300"
                  alt="Placeholder"
                  className="img-fluid mx-auto d-block"
                  style={{ maxWidth: '300px', borderRadius: '8px' }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeSteps;
