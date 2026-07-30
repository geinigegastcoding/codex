type SegmentedOption<T extends string | number> = {
  label: string
  value: T
}

type SegmentedControlProps<T extends string | number> = {
  label: string
  options: Array<SegmentedOption<T>>
  value: T
  onChange: (value: T) => void
  compact?: boolean
}

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  compact = false,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className={`segmented-control${compact ? ' segmented-control--compact' : ''}`}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
