import RouteAppWrapper from "../../RouteAppWrapper";

type ArticleParams = {
  slug: string;
};

export default function ArticlePage({ params }: { params: ArticleParams }) {
  return <RouteAppWrapper initialPath={`/כתבות/${params.slug}`} />;
}
