export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-bar" aria-label={`${label}: ${value}%`}>
      <div><span>{label}</span><strong>{value}%</strong></div>
      <div className="progress-bar__track"><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
    </div>
  )
}
