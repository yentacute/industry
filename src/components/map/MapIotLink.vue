<template>
  <div
    style="width: 100%; height: 100%; position: relative"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @click.prevent="handleClickMapGetLocation"
    @touchend.prevent="handleTouchMapGetLocation"
    @touchstart="startDrag"
  >
    <div ref="map4D" class="h-100 w-100"></div>
  </div>
</template>

<script>
import { inject, toRefs, onUnmounted } from "vue";
import { map_options } from "../../common/map/function_map.js";
import {
  methods_map,
  data as data_map,
} from "../../state/map_control/data_map.js";

// Các hàm fitbounds, decode sẽ viết trong function_map

export default {
  props: {
    viewObject: {
      type: Object,
      default: function () {
        return { building: true, mapbuilding: false };
      },
    },
    optionCustommap: {
      type: Object,
      default: function () {
        return {
          textSucces: false,
          map_options: {},
        };
      },
    },
  },
  setup: function () {
    const data = inject("map") ?? data_map;

    const {
      map,
      location,
      listLocations,
      building,
      references,
      referencesList,
    } = toRefs(data);

    const methodMap = inject("draw-map") ?? methods_map;

    onUnmounted(() => {
      // map.value.destroy();
    });

    return {
      map,
      location,
      listLocations,
      building,
      references,
      referencesList,
      ...methodMap,
    };
  },

  data: function () {
    return {
      view: {
        dragging: {
          mouseDownClientX: 0,
          mouseUpClientX: 0,
          mouseDownClientY: 0,
          mouseUpClientY: 0,
        },
        dotBuilding: false,
        mobile: false,
        buldingHaveDataLocal: 0,
      },
    };
  },
  mounted: function () {
    this.$nextTick(() => {
      this.initMapRun();
    });
  },
  methods: {
    startDrag(e) {
      this.view.dragging.mouseDownClientX =
        e?.clientX ?? e.changedTouches["0"].clientX;
      this.view.dragging.mouseDownClientY =
        e?.clientY ?? e.changedTouches["0"].clientY;
      this.building.mapbuilding = null;
      this.view.dotBuilding = false;
    },
    stopDrag(e) {
      this.view.dragging.mouseUpClientX =
        e?.clientX ?? e.changedTouches["0"].clientX;
      this.view.dragging.mouseUpClientY =
        e?.clientY ?? e.changedTouches["0"].clientY;
    },
    handleClickMapGetLocation: function () {
      const vm = this;
      let validation1 =
        vm.view.dragging.mouseDownClientX === vm.view.dragging.mouseUpClientX;
      let validation2 =
        vm.view.dragging.mouseDownClientY === vm.view.dragging.mouseUpClientY;
      if (validation1 && validation2) {
        vm.$emit("click-map-iotlink", vm.location);
      }
    },
    handleTouchMapGetLocation: function () {
      const vm = this;
      vm.view.dotBuilding = true;
      vm.view.mobile = true;
      vm.$emit("click-map-iotlink", vm.location);
    },
    initMapRun: async function () {
      if (typeof map4d === "undefined") {
        setTimeout(() => {
          this.initMapRun();
        }, 300);
      } else {
        if (this.optionCustommap.textSucces) {
          this.initMap(this.$refs.map4D, this.optionCustommap.map_options);
          return;
        }
        await this.initMap(this.$refs.map4D, map_options);
        this.$emit("map-moundted");
      }
    },
  },
  computed: {
    lengtListIcon: function () {
      // const vm = this;
      function dataIcon(title, classIcon, handle) {
        return {
          title: title,
          class: classIcon,
          event: handle,
        };
      }

      let lengthTemp = [
        dataIcon("Chia sẻ", "ri-share-fill", "share"),
        dataIcon("Chỉ đường", "ri-direction-fill", "direct"),
        dataIcon("Xem chi tiết", "ri-lightbulb-line", "view-details"),
      ];
      // if (!vm.view.buldingHaveDataLocal) return lengthTemp;
      // if (vm.building.mapbuilding?.detailsApi?.images?.length) {
      //   lengthTemp.push(dataIcon("Hình ảnh", "ri-image-2-fill ", "images"));
      // }
      // if (vm.building.mapbuilding?.detailsApi?.videos?.length) {
      //   lengthTemp.push(dataIcon("Video", "ri-movie-fill", "videos"));
      // }
      // if (vm.building.mapbuilding?.detailsApi?.virtual_reality.length) {
      //   lengthTemp.push(dataIcon("vr-360", "mdi mdi-virtual-reality", ""));
      // }
      return lengthTemp;
    },
  },
};
</script>
