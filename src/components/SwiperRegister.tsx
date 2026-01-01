"use client";

import { useEffect } from "react";

export default function SwiperRegister() {
  useEffect(() => {
    // registers <swiper-container> and <swiper-slide>
    import("swiper/element/bundle").then(({ register }) => register());
  }, []);

  return null;
}
