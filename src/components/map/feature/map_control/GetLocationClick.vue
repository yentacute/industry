<script setup>
import { inject, onMounted, onUnmounted, reactive, watch } from "vue";
import { getAdressMap4d } from "../../../../common/map/function_map";
import { useTileLayerStore } from "../../../../state/map_control/publicLayer";
import { limitText } from "../../../../common/common";

const tileLayerStore = useTileLayerStore();

const state = reactive({
  active: false,
  name: "",
  address: "",
  location: {},
});

const data_map = inject("map");
const methodMap = inject("draw-map");

const handleGetLocationMe = ($e) => {
  $e.stopPropagation();
  if (!data_map.location.value) return;
  state.location = data_map.location.value;
  methodMap.MarkerMap(state.location, true);
  getAdressMap4d(state.location).then((res) => {
    state.address = res;
  });
};

const handleClickChangActive = () => {
  state.active = !state.active;
  tileLayerStore.isGetInfo = !state.active;
  if (state.active) {
    document.body.style.cursor = "default";
  } else {
    document.body.style.cursor = "pointer";
  }
};

const handleClose = () => {
  state.location = null;
  if (data_map.references.value.marker) {
    data_map.references.value.marker.setMap(null);
  }
  try {
    window.removeEventListener("click", handleGetLocationMe);
    window.removeEventListener("touchstart", handleGetLocationMe);
  } catch (err) {
    // console.log(err);
  }
};

onMounted(() => {
  handleClickChangActive();
});
onUnmounted(() => {
  window.removeEventListener("click", handleGetLocationMe);
  window.removeEventListener("touchstart", handleGetLocationMe);
});

watch(
  () => state.active,
  (value) => {
    state.location = {};
    if (value) {
      data_map.location.value = null;
      window.addEventListener("click", handleGetLocationMe);
      window.addEventListener("touchstart", handleGetLocationMe);
      return;
    }
    window.removeEventListener("click", handleGetLocationMe);
    window.removeEventListener("touchstart", handleGetLocationMe);
    if (!data_map.references.value.marker) return;
    data_map.references.value.marker.setMap(null);
  }
);
</script>

<template>
  <div class="map-click-wrapper hover-bg">
    <div
      class="align-items-center d-flex justify-content-center h-100"
      title="Xem thông tin chi tiết về đối tượng"
      @click="handleClickChangActive"
    >
      <i
        class="text-primary cursor-pointer fs-20 hover-text-red"
        :class="[state.active ? 'ri-cursor-line' : 'ri-information-fill']"
      ></i>
    </div>
    <div
      class="d-flex justify-content-between align-items-center about-custom"
      v-if="state.active && state.location?.lat"
      @click.stop
    >
      <img
        src="https://map.map4d.vn/mapAppRoot/imageDefault/avater-default.png"
        style="height: 90px; width: 100px; object-fit: cover"
      />
      <div
        v-if="state.location?.lat"
        class="p-2 d-flex flex-column position-relative"
        style="width: calc(100% - 100px)"
      >
        <div
          @click="handleClose"
          class="position-absolute d-flex align-items-center h-100 hover-cricle-bg justify-content-center px-2"
          style="
            top: -8px;
            right: 0px;
            bottom: 0px;
            max-width: 20px;
            max-height: 20px;
          "
        >
          <i
            class="ri-close-fill text-black-50 cursor-pointer"
            style="font-size: 20px"
          ></i>
        </div>
        <span class="ellipsis"
          >Toạ độ:
          <span>{{ ` ${state.location?.lat}, ${state.location?.lng}` }}</span>
        </span>
        <span
          >Địa chỉ:
          <b>{{ limitText(state.address, 53) }}</b>
        </span>
      </div>
      <div
        class="p-2 d-flex flex-column"
        style="width: calc(100% - 100px)"
        v-else
      >
        Chọn điểm bất kì trên bản đồ
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-click-wrapper {
  width: 30px;
  height: 30px;
  box-shadow: 0px 0px 4px #666;
  background-color: #fff;
  border-radius: 4px;
}
.about-custom {
  position: fixed;
  right: 60px;
  bottom: 10px;
  border-radius: 4px;
  width: 350px;
  height: 90px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 575px) {
  .about-custom {
    bottom: auto;
    top: 125px;
  }
}
</style>
