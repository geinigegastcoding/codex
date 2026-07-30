type ChartTableColumn<Row> = {
  key: keyof Row
  label: string
  align?: 'left' | 'right'
  format?: (value: Row[keyof Row], row: Row) => string
}

type ChartTableProps<Row extends object> = {
  caption: string
  columns: Array<ChartTableColumn<Row>>
  rows: Row[]
}

export function ChartTable<Row extends object>({ caption, columns, rows }: ChartTableProps<Row>) {
  return (
    <div className="chart-table-wrap">
      <table className="chart-table">
        <caption>{caption}</caption>
        <thead><tr>{columns.map((column) => <th key={String(column.key)} scope="col" className={column.align === 'right' ? 'numeric' : ''}>{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => {
                const value = row[column.key]
                const rendered = column.format ? column.format(value, row) : String(value)
                return columnIndex === 0
                  ? <th key={String(column.key)} scope="row">{rendered}</th>
                  : <td key={String(column.key)} className={column.align === 'right' ? 'numeric' : ''}>{rendered}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
