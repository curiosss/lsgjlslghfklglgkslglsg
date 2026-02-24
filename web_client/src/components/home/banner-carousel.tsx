'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Banner } from '@/types';

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const router = useRouter();

  const handleClick = (banner: Banner) => {
    if (banner.link_type === 'product' && banner.link_value) router.push(`/product/${banner.link_value}`);
    else if (banner.link_type === 'category' && banner.link_value) router.push(`/products?category_id=${banner.link_value}`);
    else if (banner.link_type === 'brand' && banner.link_value) router.push(`/products?brand_id=${banner.link_value}`);
  };

  return (
    <Swiper
      className="w-full overflow-hidden rounded-xl"
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={banners.length > 1}
    >
      {banners.map((b, idx) => (
        <SwiperSlide
          key={b.id}
          onClick={() => handleClick(b)}
          className={b.link_type ? 'cursor-pointer' : ''}
        >
          <div className="relative h-[200px] w-full md:h-[400px]">
            <Image
              src={b.image_url}
              alt=""
              fill
              className="object-cover"
              priority={idx === 0}
              sizes="100vw"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
