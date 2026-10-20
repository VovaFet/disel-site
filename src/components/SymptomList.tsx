// Fault signs from the sheet, one per line. "Title. Explanation" shows the first sentence (or the part
// before a colon) as a bold title with the rest under it; a line with one sentence is all title.
function split(line: string): { title: string; note: string } {
  const m = /[.:]\s/.exec(line);
  if (!m) return { title: line.replace(/[.:]$/, ""), note: "" };
  const note = line.slice(m.index + 2).trim();
  return { title: line.slice(0, m.index), note: note.charAt(0).toUpperCase() + note.slice(1) };
}

export function SymptomList({ items }: { items: string[] }) {
  return (
    <ul className="symptoms">
      {items.map((line) => {
        const { title, note } = split(line);
        return (
          <li key={line}>
            <strong>{title}</strong>
            {note && <span>{note}</span>}
          </li>
        );
      })}
    </ul>
  );
}
