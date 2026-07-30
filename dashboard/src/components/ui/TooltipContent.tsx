type TooltipItem = {
  name: string
  value: string | number
  color: string
}

type TooltipContentProps = {
  label: string
  items: TooltipItem[]
}

export function TooltipContent({ label, items }: TooltipContentProps) {
  return (
    <div className="chart-tooltip">
      <span>{label}</span>
      {items.map((item) => (
        <div key={item.name}>
          <i style={{ backgroundColor: item.color }} />
          <strong>{item.value}</strong>
          <small>{item.name}</small>
        </div>
      ))}
    </div>
  )
}
