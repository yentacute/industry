<template>
  <swiper
    class="mySwiper"
    :slidesPerView="1"
    :spaceBetween="30"
    :pagination="{
      clickable: true,
    }"
    :modules="modules"
    navigation
    keyboard
    loop
  >
    <swiper-slide v-for="(item, index) in imgs" :key="index">
      <img
        class="w-100 h-100"
        :src="item?.img"
        style="display: none"
        alt="img"
        @load="($e) => loaded($e)"
      />
      <img
        class="w-100 h-100 loading"
        :src="require('@/assets/images/default/Loading_image.gif')"
        alt="loading"
      />
    </swiper-slide>
  </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Navigation, Pagination, Mousewheel, Keyboard],
    };
  },
  props: {
    imgs: {
      type: Array,
      default: function () {
        return [{ img: require("@/assets/images/background/bg-4.jpg") }];
      },
    },
  },
  methods: {
    loaded: function ($e) {
      // Thay thế hình ảnh loading bằng ảnh chính thức
      $e.target.nextElementSibling.style.display = "none";
      $e.target.style.display = "block";
    },
  },
};
</script>
