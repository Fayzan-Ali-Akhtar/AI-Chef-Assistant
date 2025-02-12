import { useEffect, useState } from 'react';
// import axios from 'axios';
import { Spinner } from 'react-bootstrap';

interface RecipeStepsProps {
  steps: string[];
  darkMode: boolean;
}

function RecipeSteps({ steps, darkMode }: RecipeStepsProps) {
  const [images, setImages] = useState<Array<string | null>>(
    new Array(steps.length).fill(null)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    // If there are no steps, no need to fetch images
    if (steps.length === 0) return;

    const fetchImages = async () => {
      if (retryCount >= 3) {
        console.error('Failed to fetch images after 3 attempts.');
        return;
      }
      setLoading(true);

      try {
        // Example: using environment variables for Hugging Face
        // For Vite, you might use import.meta.env.VITE_HUGGINGFACE_API_KEY
        // const HF_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;
        // const HF_MODEL_URL = process.env.REACT_APP_HUGGINGFACE_MODEL_URL;

        // const promises = steps.map((step) =>
        //   axios.post(HF_MODEL_URL as string, {
        //     inputs: step
        //   }, {
        //     headers: {
        //       Authorization: `Bearer ${HF_API_KEY}`
        //     },
        //     responseType: 'arraybuffer'
        //   }).then((response) => {
        //     const base64 = btoa(
        //       new Uint8Array(response.data).reduce(
        //         (data, byte) => data + String.fromCharCode(byte),
        //         ''
        //       )
        //     );
        //     return `data:image/jpeg;base64,${base64}`;
        //   })
        // );

        // const imageUrls = await Promise.all(promises);
        // setImages(imageUrls);
      } catch (error) {
        console.error('Failed to fetch images', error);
        setRetryCount((prev) => prev + 1);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [steps, retryCount]);

  return (
    <div>
      {steps.length > 0 && <h2 className="mb-4">Recipe Steps</h2>}
      {steps.map((step, index) => (
        <div
          key={index}
          className={`
            card mt-3 border border-muted 
            animate__animated animate__fadeInUp 
            ${darkMode ? 'bg-secondary text-white' : ''}
          `}
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="card-body text-center">
            <h3 className="card-title">Step {index + 1}</h3>
            <p className="card-text fs-5">{step}</p>

            {loading ? (
              <>
                <p>Loading Image...</p>
                <Spinner animation="border" variant="primary" />
              </>
            ) : (
              <img
                src={images[index] || 'https://via.placeholder.com/350x200'}
                alt={`Visualization for step ${index + 1}`}
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: '350px' }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeSteps;
