<script>
import { reactive, toRefs } from "vue";
import LayoutWidget from "./LayoutWidget.vue";
export default {
  setup: function () {
    const state = reactive({
      arrVr: [],
    });

    setTimeout(() => {
      state.arrVr = [
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
        { name: "Vr", img: require("@/assets/images/logo/logo_sipm.png") },
      ];
    }, 500);

    return toRefs(state);
  },
  components: {
    LayoutWidget,
  },
};
</script>

<template>
  <LayoutWidget>
    <div
      v-for="(item, index) in arrVr"
      :key="index"
      class="widget position-relative"
    >
      <img
        class="w-100 h-100"
        style="object-fit: cover"
        :src="item.img"
        :alt="item.name"
      />
      <div class="position-absolute clippath"></div>
    </div>
  </LayoutWidget>
</template>

<style scoped>
.widget {
  background-color: #fff;
  width: 210px;
  height: 118px;
  border-radius: 4px;
  animation: zoom-in-zoom-out 1.5s ease infinite;
  margin-bottom: 15px;
}
.clippath {
  inset: 0;
  border: 3px solid #ffdc00;
  animation: clippath 3s linear infinite;
}
@keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.02, 1.02);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes clippath {
  0%,
  100% {
    clip-path: inset(0 0 95% 0);
  }

  25% {
    clip-path: inset(0 95% 0 0);
  }
  50% {
    clip-path: inset(95% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 95%);
  }
}
</style>
