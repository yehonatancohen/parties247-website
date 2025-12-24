import RouteAppWrapper from "../../../RouteAppWrapper";

type PageParams = {
  pageNumber?: string;
};

export default function AllPartiesPaginatedPage({ params }: { params: PageParams }) {
  const page = params.pageNumber ?? "1";
  return <RouteAppWrapper initialPath={`/all-parties/עמוד/${page}`} />;
}
