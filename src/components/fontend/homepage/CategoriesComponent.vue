<template>
  <section class="categories__container nft-hero">
    <div class="bg-overlay" style="opacity: .35;"></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-12 col-sm-10">
          <div class="text-center">
            <h2 class="fw-semibold" style="color: #f7ca2e;">CÁC HẠNG MỤC ĐẦU TƯ</h2>
          </div>
        </div>
      </div>
    </div>

    <swiper
      :modules="modules"
      :slides-per-view="slidePerView"
      :space-between="20"
      navigation
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item1.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item2.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item1.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item2.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item1.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item2.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item1.jpg" alt="">
        </a>
      </swiper-slide>
      <swiper-slide>
        <a href="#" class="category-item">
          <img src="@/assets/images/item2.jpg" alt="">
        </a>
      </swiper-slide>
    </swiper>

    <a href="#" class="btn btn-info btn-lg">Xem chi tiết</a>
  </section>
</template>

<script>
// Import Swiper Vue.js components
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Navigation, A11y} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import {ref} from 'vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const onSwiper = (swiper) => {
      /*console.log(swiper);*/
    };
    const onSlideChange = () => {
      console.log('slide change');
    };

    const slidePerView = ref(0);

    if (screen.width > 800) {
      slidePerView.value = 4;
    } else if (screen.width > 1024) {
      slidePerView.value = 6;
    } else {
      slidePerView.value = 2;
    }

    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation, A11y],
      slidePerView
    };
  },
};
</script>

<style lang="scss">
.categories__container {
  padding: 120px 30px;
  background-image: url(@/assets/images/background/bg-2.jpg);
  background-repeat: no-repeat;
  background-position: 50% 0.5px;
  position: relative;
  background-attachment: fixed;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    border-top: 1px solid var(--vz-border-color);
    background-image: url('@/assets/images/triangle_mask_top.png');
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 96px;
    background-repeat: no-repeat;
  }

  &::after {
    content: '';
    position: absolute;
    background-image: url('@/assets/images/triangle_mask_bottom.png');
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 96px;
    background-repeat: no-repeat;
  }

  h2 {
    color: var(--vz-white);
    font-size: 2rem;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .swiper {
    max-width: 1140px;
    margin: 120px auto 60px;

    .category-item {
      display: inline-block;
      width: auto;

      img {
        border-radius: 50%;
      }
    }


  }

}

</style>