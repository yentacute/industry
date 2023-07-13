<script>
import { inject } from "vue";
import API from "../../../../helpers/api/useAxios";
import { errorToast } from "../../../../helpers/api/toastStyle";
import ShareBuilding from "../../../../views/map/map_portal/components/share/ShareBuilding.vue";

const directiveIconMap = {
  created(el, binding) {
    let temp = binding.value[0];
    let length = binding.value[1];
    el.style.transform = `rotate(calc(${
      temp + 1
    } * 360deg/${length})) translateY(55px)`;
    el.children[0].style.transform = `rotate(calc(${
      temp + 1
    } * -360deg/${length}))`;
  },
  updated(el, binding) {
    let temp = binding.value[0];
    let length = binding.value[1];
    el.style.transform = `rotate(calc(${
      temp + 1
    } * 360deg/${length})) translateY(55px)`;
    el.children[0].style.transform = `rotate(calc(${
      temp + 1
    } * -360deg/${length}))`;
  },
};

export default {
  directives: {
    // enables v-focus in template
    transform: directiveIconMap,
  },
  components: { ShareBuilding },
  setup: function () {
    const data_map = inject("map");
    const data_building = inject("map-building");
    const { show: showNavDetails } = inject("details-bulding");
    const { show: showShareBuilding } = inject("share-bulding");
    const { destination } = inject("direct");
    return {
      data_map,
      data_building,
      showNavDetails,
      showShareBuilding,
      destination,
    };
  },
  data: function () {
    const dataIcon = (title, classIcon, event, handle = () => {}) => {
      return {
        title: title,
        class: classIcon,
        event: event,
        handle: handle,
      };
    };
    return {
      show: false,
      event: null,
      inset: {
        top: 0,
        left: 0,
      },
      lengtListIcon: [
        dataIcon("Chia sẻ", "ri-share-fill", "share", () => {
          this.showShareBuilding = true;
        }),
        dataIcon("Chỉ đường", "ri-direction-fill", "direct", () => {
          this.destination = this.data_map.location.value;
          this.$emit("direct");
        }),
        dataIcon("Xem chi tiết", "ri-lightbulb-line", "view-details", () => {
          this.handleViewDetails();
        }),
      ],
    };
  },
  mounted: async function () {
    const vm = this;
    setTimeout(() => {
      vm.addEventClickBuilding();
    }, 1000);
  },
  methods: {
    handClose: function () {
      this.show = false;
    },
    handleViewDetails: async function () {
      if (!this.data_building.id) return;
      const res = await API().call(
        `https://api-app.map4d.vn/map/object/${this.data_building.id}`
      );
      if (res.code == "ok") {
        this.data_building.details = res.result;
      } else {
        // this.data_building.details = {};
        errorToast("Không timg thấy kết quả phù hợp");
      }
      this.showNavDetails = true;
    },
    handleSetView: function ($e) {
      this.inset.top = `${$e.pageY - 75}px`;
      this.inset.left = `${$e.pageX - 75}px`;
    },
    handleSetBuilding: function (args) {
      this.data_map.location.value = args.location;
      this.show = false;
      this.data_building.id = args.building.id;
      this.data_map.map.value.setSelectedBuildings([args.building.id]);
      const vm = this;
      setTimeout(() => {
        vm.show = true;
      }, 100);
    },
    handleClickFeatureBuilding: function (building) {
      this.handClose();
      building.handle();
    },
    addEventClickBuilding: function () {
      //chọn đối tượng 3D có sẵn từ map4D
      this.data_map.map.value.addListener(
        "click",
        (args) => this.handleSetBuilding(args),
        {
          mapbuilding: true,
        }
      );
      this.data_map.map.value.addListener(
        "click",
        () => {
          this.handClose();
        },
        {}
      );
      this.data_map.map.value.addListener(
        "cameraWillChange",
        () => {
          this.handClose();
        },
        {}
      );
    },
  },
};
</script>

<template>
  <div v-show="show">
    <div
      class="building__view__wrapper"
      :style="{ top: inset.top, left: inset.left }"
    >
      <div class="building__view__container">
        <div class="container__dot--close" title="Đóng" @click="handClose">
          <i style="color: #fff; font-size: 24px" class="ri-close-fill"></i>
        </div>
        <div
          v-for="(item, index) in lengtListIcon"
          :key="index"
          :title="item.title"
          v-transform="[index, lengtListIcon.length]"
          @click="handleClickFeatureBuilding(item)"
          class="position-absolute"
        >
          <div>
            <i
              style="font-size: 26px; color: #0b5ed7"
              class="text-info text-info cursor-pointer"
              :class="item.class"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ShareBuilding></ShareBuilding>
</template>

<style scoped>
/*Xem chi tiết đối tượng 3d trong map4d*/
.building__view__wrapper {
  width: 150px;
  height: 150px;
  position: absolute;
  animation: rotate 0.5s linear;
  background-color: #ffffffc7;
  border-radius: 50%;
  padding: 5px;
}

.building__view__container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.container__dot--close {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  right: 50%;
  background-color: red;
  border-radius: 50%;
  transform: translate(50%, -50%);
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  cursor: pointer;
}

.building__view__wrapper i:hover {
  transform: scale(1.1);
}
</style>
