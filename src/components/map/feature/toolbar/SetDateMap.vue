<script>
import { inject } from "vue";
import { pastTime, futureTime } from "../../../../common/map/function_map.js";

export default {
  setup: function () {
    const methods_map = inject("draw-map");
    return { ...methods_map };
  },
  data: function () {
    return {
      show: false,
      pastTime: pastTime,
      futureTime: futureTime,
      year: new Date().getFullYear(),
    };
  },
  methods: {
    handleToogle: function () {
      this.show = !this.show;
    },
    handleChangDimeDimension: function () {
      this.SetDateMap(new Date(this.year, 0, 1));
    },
  },
};
</script>

<template>
  <div
    v-if="show"
    class="position-absolute text-bg-light"
    style="
      bottom: 70px;
      left: 50%;
      right: 0;
      transform: translateX(-50%);
      border-radius: 4px;
      box-shadow: 0 3px 1px -2px #00000033, 0 2px 2px 0 #00000024,
        0 1px 5px 0 #0000001f;
      height: 32px;
      padding: 40px 10px 0px 10px;
      display: flex;
      align-items: end;
      justify-content: center;
      width: 216px;
    "
  >
    <div class="d-flex gap-2 justify-content-center align-items-center">
      <span class="fw-bold">{{ pastTime }}</span>
      <div class="w-100 position-relative">
        <span
          class="position-absolute fw-bold"
          style="top: -18px; left: 50%; transform: translateX(-50%)"
          >{{ year }}</span
        >
        <input
          v-model="year"
          class="w-100 h-100"
          type="range"
          :min="pastTime"
          :max="futureTime"
          @change="handleChangDimeDimension"
        />
      </div>
      <span class="fw-bold">{{ futureTime }}</span>
    </div>
  </div>
</template>
