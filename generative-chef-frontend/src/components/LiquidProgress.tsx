import type React from "react"

interface LiquidProgressProps {
  progress: number
  total?: number
  label: string
}

const LiquidProgress: React.FC<LiquidProgressProps> = ({ progress, total, label }) => {
  const percentage = total ? (progress / total) * 100 : progress

  return (
    <div>
      <div className="progress-label">
        <span>{label}</span>
        {total && (
          <span>
            {progress} / {total}
          </span>
        )}
      </div>
      <div className="liquid-progress-container">
        <div className="liquid-progress-bar" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default LiquidProgress

