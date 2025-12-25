import Link from "next/link";

export const metadata = {
  title: "חיפוש מסיבות | Parties247",
};

export default function PartyDiscoveryPage() {
  return (
    <main className="prose prose-invert mx-auto p-6">
      <h1>חיפוש מסיבות</h1>
      <p>השתמשו ברשימות הערים והקטגוריות כדי לגלות מסיבות לפי הטעם שלכם.</p>
      <ul>
        <li>
          <Link href="/all-parties">כל המסיבות</Link>
        </li>
        <li>
          <Link href="/weekend-parties">מסיבות סוף שבוע</Link>
        </li>
      </ul>
    </main>
  );
}
