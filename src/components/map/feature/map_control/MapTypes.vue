<script setup>
import { inject, ref, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const data_map = inject("map");
const { map } = toRefs(data_map);
const method_map = inject("draw-map");

const srcImg = ref(null);
const mapTypeCurrent = ref("");

const getMapType = () => {
  if (!map.value) {
    setTimeout(() => {
      getMapType();
    }, 300);
    return;
  }
  mapTypeCurrent.value = map.value.getMapType();
  method_map.setMapType(mapTypeCurrent.value, srcImg.value);
};

const handleClickChangMapType = async () => {
  mapTypeCurrent.value = method_map.changeMapType(
    mapTypeCurrent.value,
    srcImg.value
  );
  router.push({
    query: { camera: await method_map.handleChangeHeToaDo() },
  });
};

onMounted(() => {
  getMapType();
});
</script>
<!-- // osm, ranh giới -->
<template>
  <div class="map-type-wrapper">
    <img
      id="imgBaseMapType"
      ref="srcImg"
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
}
</style>
