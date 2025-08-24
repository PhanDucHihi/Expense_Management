"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

const banners = [
  { id: 1, src: "/banners/banner1.jpg", alt: "Banner 1" },
  { id: 2, src: "/banners/banner2.jpg", alt: "Banner 2" },
  { id: 3, src: "/banners/banner3.jpg", alt: "Banner 3" },
];

export default function BannerSlider() {
  return (
    <div className="w-full mx-auto">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000 }}
        loop
        pagination={{ clickable: true }}
        navigation
        spaceBetween={20}
        className="rounded-2xl shadow-md"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Image
              src={banner.src}
              alt={banner.alt}
              width={1200}
              height={400}
              className="w-full h-[300px] object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
