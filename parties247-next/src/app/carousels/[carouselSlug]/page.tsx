import RouteAppWrapper from "../../RouteAppWrapper";

type CarouselParams = {
  carouselSlug: string;
};

export default function CarouselPage({ params }: { params: CarouselParams }) {
  return <RouteAppWrapper initialPath={`/carousels/${params.carouselSlug}`} />;
}
