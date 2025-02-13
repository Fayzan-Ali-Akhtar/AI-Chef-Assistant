import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import OpenAI from 'openai';

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

      try {
        // 1) Initialize the OpenAI client
        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', 
        });

        // 2) Generate images SEQUENTIALLY to avoid rate limit issues
        const newImages: Array<string | null> = [];

        for (let i = 0; i < instructions.length; i++) {
          const instr = instructions[i];
          const prompt = `A detailed photo illustrating this cooking step: ${instr.title}\n\nUse as little detail rewriting as possible.`;

          // Each request: model, prompt, size
          const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: '512x512', // can be 1024x1024 or other sizes
          });

          if (response.data?.length && response.data[0].url) {
            newImages[i] = response.data[0].url;
          } else {
            newImages[i] = null;
          }

          // Optionally add a short delay (e.g., 1 second) between requests
          // to reduce chance of 429
          await new Promise((res) => setTimeout(res, 1000));
        }

        setImages(newImages);
      } catch (error) {
        console.error('Error fetching images from OpenAI:', error);
      } finally {
        setLoading(false);
      }
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
