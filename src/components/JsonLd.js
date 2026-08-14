// Renders a schema.org JSON-LD block. Server component — the markup ships in
// the initial HTML so crawlers see it without executing JavaScript.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
