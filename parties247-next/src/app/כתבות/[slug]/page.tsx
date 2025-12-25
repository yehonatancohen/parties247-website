export default function HebrewArticlePage({ params }: { params: { slug: string } }) {
  return (
    <main className="prose prose-invert mx-auto p-6">
      <h1>כתבה: {decodeURIComponent(params.slug)}</h1>
      <p>תוכן הכתבה יוצג כאן.</p>
    </main>
  );
}
