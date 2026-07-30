type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <p>{eyebrow}</p>
      <div>
        <h2>{title}</h2>
        <span>{description}</span>
      </div>
    </header>
  )
}
