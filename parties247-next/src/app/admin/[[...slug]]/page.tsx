import RouteAppWrapper from "../../RouteAppWrapper";

type AdminParams = {
  slug?: string[];
};

export default function AdminCatchAllPage({ params }: { params: AdminParams }) {
  const slugPath = params.slug?.join("/") ?? "";
  const initialPath = slugPath ? `/admin/${slugPath}` : "/admin";

  return <RouteAppWrapper initialPath={initialPath} />;
}
