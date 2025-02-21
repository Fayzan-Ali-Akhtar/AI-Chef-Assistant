"use client"

import { useState, useRef, useEffect } from "react"
import { Overlay, Popover, Button } from "react-bootstrap"
import { Info } from "lucide-react"

export default function ProjectInfo() {
  const [show, setShow] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShow(!show)
    setTarget(event.currentTarget)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref}>
      <Button onClick={handleClick} variant="outline-light" className="info-button" aria-label="Project Information">
        <Info className="h-5 w-5" />
      </Button>

      <Overlay
        show={show}
        target={target}
        placement="bottom-end"
        container={ref}
        containerPadding={20}
        rootClose={true}
        onHide={() => setShow(false)}
      >
        <Popover id="popover-project-info" className="project-info-popover">
          <Popover.Header as="h3">About This Project</Popover.Header>
          <Popover.Body>
          <p>
            Welcome to Generative AI Chef! This app leverages <strong>Llama 3.3 70B on Groq Cloud</strong> alongside other AI technologies to
            create a unique cooking experience:
          </p>
            <ul>
              <li>
              Powered by <span style={{ color: "#4CAF50", fontWeight: "bold" }}>Llama 3.3 70B on Groq Cloud</span> on a Flask backend
                (hosted on <span style={{ color: "#FF9800", fontWeight: "bold" }}>Hugging Face Spaces</span>)
              </li>
              <li>Generates detailed recipes from your ingredients</li>
              <li>
                Uses <span style={{ color: "#2196F3", fontWeight: "bold" }}>DALL-E</span> to generate visual
                representations for each cooking step
              </li>
              <li>Provides comprehensive cooking instructions and nutritional information</li>
            </ul>
            <p>
              Simply input your available ingredients, and watch as AI transforms them into a complete recipe with
              step-by-step visual guidance!
            </p>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  )
}

