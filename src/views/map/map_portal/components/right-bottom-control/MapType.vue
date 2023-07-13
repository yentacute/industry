<script setup>
import { inject, ref, onMounted, reactive } from "vue";

// const data_map = inject("map");
// const { map } = toRefs(data_map);
const method_map = inject("draw-map");

const setType = (type, srcImg, active = false) => {
  return { type: type, src: srcImg, active: active };
};

const srcImg = ref(null);
const dataType = reactive({
  type: 0,
  arrType: [
    setType("map3d", require("@/assets/images/maptype/map3d.png")),
    setType("roadmap", require("@/assets/images/maptype/roadmap.png")),
  ],
});

// const getMapType = () => {
//   if (!map.value) {
//     setTimeout(() => {
//       getMapType();
//     }, 300);
//     return;
//   }
//   mapTypeCurrent.value = map.value.getMapType();
//   method_map.setMapType(mapTypeCurrent.value, srcImg.value);
// };

const handleClickChangMapType = async () => {
  const LENGTHARRTYPE = dataType.arrType.length;
  if (dataType.type >= LENGTHARRTYPE - 1) {
    dataType.type = 0;
  } else {
    dataType.type++;
  }
  method_map.setMapType(dataType.arrType[dataType.type].type, srcImg.value);
};

onMounted(() => {
  setTimeout(() => {
    method_map.setMapType(dataType.arrType[dataType.type].type, srcImg.value);
  }, 1000);
});
</script>
<!-- // osm, ranh giới -->
<template>
  <div class="map-type-wrapper">
    <img
      ref="srcImg"
      :src="dataType.arrType[dataType.type].src"
      @click="handleClickChangMapType"
      class="w-100 h-100"
      alt="map-type"
    />
  </div>
</template>

<style scoped>
.map-type-wrapper {
  width: 30px;
  height: 30px;
  box-shadow: 0px 0px 4px #666;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
</style>
