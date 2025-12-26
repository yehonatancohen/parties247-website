export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <main className="prose prose-invert mx-auto p-6">
      <h1>כתבה:</h1>
      <p>תוכן הכתבה יתעדכן בהמשך.</p>
    </main>
  );
}
