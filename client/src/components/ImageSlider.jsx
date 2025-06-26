import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

function ImageSlider({ images }) {
  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={20}
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        allowTouchMove={true}
        freeMode={true}
        effect={EffectCoverflow}
        className="!overflow-visible"
        breakpoints={{
          320: {
            spaceBetween: 10,
          },
          768: {
            spaceBetween: 12,
          },
          1024: {
            spaceBetween: 15,
          },
        }}
      >
        {images.concat(images).map((src, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div className="flex-shrink-0">
              <img
                src={src}
                alt={`slide-${index}`}
                className="h-32 w-48 md:h-36 md:w-57 object-cover rounded-md shadow-sm"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ImageSlider;