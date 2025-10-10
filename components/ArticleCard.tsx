import Link from "next/link";
import type { ArticleDetails } from "@/data/models";

interface Props {
  article: ArticleDetails;
}

export const ArticleCard = ({ article }: Props) => (
  <article className="card-link">
    <h3>
      <Link href={`/כתבות/${article.slug}`}>{article.title}</Link>
    </h3>
    <p>{article.excerpt}</p>
    <Link href={`/כתבות/${article.slug}`}>המשך קריאה</Link>
  </article>
);
