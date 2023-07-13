<template>
  <!-- your content here -->
  <div
    @mousedown.stop
    v-if="isContextMenuVisible && location?.lat && location?.lng"
    class="context-menu bg-white position-fixed py-2"
    style="width: 180px; box-shadow: 0px 0px 2px #00000052; border-radius: 4px"
    :style="{
      top: contextMenuPosition.y + 'px',
      left: contextMenuPosition.x + 'px',
    }"
  >
    <ul class="p-0 m-0 d-flex flex-column gap-1" style="list-style-type: none">
      <li class="px-3 py-1 hover-bg">
        <a href="javascript:void(0)" class="ellipsis" @click="showLocation">
          {{
            limitTextShow(location?.lat ?? "undefine", 8) ?? "Không xác định"
          }},
          {{
            limitTextShow(location?.lng ?? "undefine", 8) ?? "Không xác định"
          }}
        </a>
      </li>
      <li class="px-3 py-1 hover-bg">
        <a href="javascript:void(0)" @click="directionsFromHere"
          >Chỉ đường từ đây</a
        >
      </li>
      <li class="px-3 py-1 hover-bg">
        <a href="javascript:void(0)" @click="directionsToHere"
          >Chỉ đường tới đây</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { inject, toRefs } from "vue";
import { limitText } from "../../../../common/common.js";
import {
  successToast,
  errorToast,
} from "../../../../helpers/api/toastStyle.js";
export default {
  setup() {
    const data_map = inject("map");
    const data_direct = inject("direct");
    return { ...data_map, ...toRefs(data_direct) };
  },
  data() {
    return {
      isContextMenuVisible: false,
      contextMenuPosition: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted: function () {
    window.addEventListener("mousedown", () => {
      this.hideContextMenu();
    });
  },
  unmounted: function () {
    window.removeEventListener("mousedown", () => {});
  },
  methods: {
    showContextMenu(event) {
      this.contextMenuPosition.x = event.pageX;
      this.contextMenuPosition.y = event.pageY;
      this.isContextMenuVisible = true;
    },
    hideContextMenu() {
      this.isContextMenuVisible = false;
    },
    showLocation() {
      if (!this.location.lat || !this.location.lng) return;
      navigator.clipboard
        .writeText(`${this.location.lat}, ${this.location.lng}`)
        .then(() => {
          successToast("Đã sao chép toạ độ");
        })
        .catch((error) => {
          errorToast("Lỗi khi sao chép: ", error);
        });
      this.hideContextMenu();
    },
    directionsFromHere() {
      this.origin = this.location;
      this.hideContextMenu();
      this.$emit("direct");
    },
    directionsToHere() {
      this.destination = this.location;
      this.hideContextMenu();
      this.$emit("direct");
    },
    limitTextShow: function (text, size) {
      return limitText(`${text}`, size);
    },
  },
};
</script>
