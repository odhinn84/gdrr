export default function TableRowsSkeleton({ idx, col }:
    { idx: number, col: number }) {
    return (
        <tr key={idx}>
            {Array.from({ length: col }, (_, idx) => idx).map((idx) => {
                return (
                    <td key={idx}>
                        <div className="skeleton h-4 w-full"></div>
                    </td>
                )
            })}
        </tr>
    )
}