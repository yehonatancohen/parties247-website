import RouteAppWrapper from "../RouteAppWrapper";

type CatchAllParams = {
  slug?: string[];
};

export default function CatchAllPage({ params }: { params: CatchAllParams }) {
  const slugPath = params.slug?.join("/") ?? "";
  const initialPath = slugPath ? `/${slugPath}` : "/";

  return <RouteAppWrapper initialPath={initialPath} />;
}
