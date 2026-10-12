// Renders the "rich text lite" format used for long texts in the config:
// blank line = new block, "## " line = heading, block of "- " lines = list, otherwise paragraph.
export function RichText({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n/)
    .flatMap(splitHeading)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="rich">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l) => (
                <li key={l}>{l.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}

// A heading line followed directly by text: "## Title\ntext" -> ["## Title", "text"]
function splitHeading(block: string): string[] {
  const b = block.trim();
  if (!b.startsWith("## ")) return [b];
  const nl = b.indexOf("\n");
  return nl === -1 ? [b] : [b.slice(0, nl), b.slice(nl + 1)];
}
