<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import LayoutNavbar from "../LayoutNavbar.vue";
import ShowLocations from "./ShowLocations.vue";
import ZIndexState from "../../../../../utils/zIndexState.js";
import { inject, toRefs } from "vue";
import { getAdressMap4d } from "@/common/map/function_map.js";

const setModeVehicle = function (name, classIcon) {
  return { name: name, icon: classIcon };
};

export default {
  setup() {
    const zIndexState = new ZIndexState("direct");
    const methods_direct = inject("methods-direct");
    const methodMap = inject("draw-map");
    const { zIndex } = zIndexState.getState();

    const direct_data = inject("direct");
    const { origin, destination, mode, weighting } = toRefs(direct_data);
    return {
      zIndex,
      origin,
      destination,
      mode,
      weighting,
      ...methods_direct,
      ...methodMap,
    };
  },
  props: {
    checkRoute: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      show: false,
      long: "",
      time: "",
      pointMore: [],
      detailsDirect: [],
      viewDetails: false,
      modeVehicle: [
        setModeVehicle("car", "ri-car-fill"),
        setModeVehicle("motorcycle", "ri-motorbike-fill"),
        setModeVehicle("bike", "ri-riding-line"),
        setModeVehicle("foot", "ri-walk-line"),
        // setModeVehicle("disabilities", "ri-wheelchair-fill"),
      ],
    };
  },
  components: { LayoutNavbar, ShowLocations },
  mounted: function () {},
  methods: {
    setView: function () {
      this.show = true;
      if (!this.checkRoute) {
        this.$router.replace({ name: "MapDirect" });
      }
    },
    handleClose: function () {
      this.show = false;
      if (!this.checkRoute) {
        this.$router.replace({ name: "MapControl" });
      }
    },
    handleSwapLocation: async function () {
      let tem = this.$refs.inputOrigin.search;
      this.$refs.inputOrigin.search = this.$refs.inputDestination.search;
      this.$refs.inputDestination.search = tem;
      tem = { ...this.origin };
      this.origin = { ...this.destination };
      this.destination = { ...tem };
      const direct = await this.Directing(
        [this.origin, this.destination],
        this.mode
      );
      if (!direct) return;
      this.long = direct.long;
      this.time = direct.time;
      this.detailsDirect = direct.details;
    },
    emitDriect: function (direct) {
      if (!direct) return;
      this.long = direct.long;
      this.time = direct.time;
      this.detailsDirect = direct.details;
    },
    handleClickViewDirectDetails: function () {
      this.viewDetails = true;
    },
    setNameOrigin: async function () {
      this.$refs.inputOrigin.search = await getAdressMap4d(this.origin);
    },
    setNameDestination: async function () {
      this.$refs.inputDestination.search = await getAdressMap4d(
        this.destination
      );
    },
    handleSetNewPoint: async function (data, index) {
      this.pointMore[index] = data;
      let temPoint = [];
      this.pointMore.forEach((item) => {
        if (!item?.location) return;
        temPoint = [...temPoint, item.location];
      });
      const direct = await this.Directing(
        [this.origin, this.destination, ...temPoint],
        this.mode
      );
      if (!direct) return;
      this.long = direct.long;
      this.time = direct.time;
      this.detailsDirect = direct.details;
      const arrMaker = [...temPoint];
      arrMaker[arrMaker.length - 1] = this.destination;
      this.MannyMakerMap(
        arrMaker,
        require("@/assets/images/maker/many-maker.png"),
        "",
        false
      );
    },
    handleAddNewPoint: function () {
      this.pointMore = [...this.pointMore, {}];
    },
  },
  watch: {
    show: function (value) {
      if (!value) return;
      const vm = this;
      if (vm.origin) {
        setTimeout(() => {
          vm.setNameOrigin();
        }, 500);
      }
      if (vm.destination) {
        setTimeout(() => {
          vm.setNameDestination();
        }, 500);
      }
    },
    origin: function () {
      if (!this.show) return;
      const vm = this;
      setTimeout(() => {
        vm.setNameOrigin();
      }, 300);
    },
    destination: function () {
      if (!this.show) return;
      const vm = this;
      setTimeout(() => {
        vm.setNameDestination();
      }, 300);
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbar :z-index="zIndex">
      <div class="card h-100">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Chỉ đường</h6>
        </div>
        <div v-if="!viewDetails" class="card-body pt-1">
          <!-- Mode direct -->
          <div class="row justify-content-center">
            <div class="col-sm-10">
              <div class="hstack flex-wrap justify-content-around">
                <div v-for="item in modeVehicle" :key="item.name">
                  <input
                    type="radio"
                    class="btn-check"
                    :id="item.name"
                    :value="item.name"
                    v-model="mode"
                    @change="Directing([origin, destination], mode, weighting)"
                  />
                  <label
                    class="border-0 btn hover-bg rounded-pill text-black-50 w-30px h-30px d-flex justify-content-center align-items-center"
                    :class="{ 'active-mode': mode == item.name }"
                    :for="item.name"
                    ><i class="fs-16" :class="item.icon"></i
                  ></label>
                </div>
              </div>
            </div>
          </div>
          <!-- Input location -->
          <div class="w-100 d-flex gap-2 align-items-center">
            <div
              class="d-flex justify-content-center flex-column align-items-center w-30px"
            >
              <i class="ri-checkbox-blank-circle-line fs-20 text-c-black"></i>
              <i class="bx bx-dots-vertical-rounded fs-20 text-c-black"></i>
              <i
                class="mdi mdi-map-marker-radius-outline fs-20"
                style="color: rgb(228, 112, 104)"
              ></i>
            </div>
            <div class="w-100 d-flex flex-1">
              <div class="w-100 d-flex flex-column gap-3">
                <ShowLocations
                  @driect="emitDriect"
                  ref="inputOrigin"
                  is-origin="true"
                ></ShowLocations>
                <ShowLocations
                  @driect="emitDriect"
                  ref="inputDestination"
                  placeholder="Chọn điểm đến…"
                  is-destination="true"
                ></ShowLocations>
                <template v-if="pointMore.length">
                  <ShowLocations
                    v-for="(item, index) in pointMore"
                    :key="index + 'point more'"
                    :key-index="index"
                    @result="handleSetNewPoint"
                    placeholder="Chọn điểm đến…"
                  ></ShowLocations>
                </template>
                <div
                  v-if="long"
                  class="d-flex gap-2 align-items-center cursor-pointer"
                  @click="handleAddNewPoint"
                >
                  <i class="ri-add-circle-line fs-16"></i>
                  <span class="fs-14 text-black-50">Thêm điểm đến</span>
                </div>
              </div>
            </div>
            <div
              class="d-flex justify-content-center flex-column align-items-center w-30px hover-cricle-bg"
              @click="handleSwapLocation"
            >
              <i class="ri-arrow-up-down-line fs-20 cursor-pointer"></i>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center mt-3">
            <div class="input-group" style="width: calc(100% - 75px)">
              <label class="input-group-text"> Tìm kiếm </label>
              <select
                class="form-select"
                v-model="weighting"
                @change="Directing([origin, destination], mode, weighting)"
              >
                <option value="0">Ngắn nhất</option>
                <option value="1" selected="selected">Nhanh nhất</option>
                <option value="2">Cân bằng</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center mt-3">
            <div style="width: calc(100% - 75px)">
              <table>
                <tr class="fw-semibold">
                  <td style="width: 90px">Khoảng cách:</td>
                  <td>
                    <span>{{ long }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Thời gian:</td>
                  <td>
                    <span>{{ time }}</span>
                  </td>
                </tr>
              </table>
              <span
                v-if="time && long"
                class="mt-2 ps-0 cursor-pointer"
                @click="handleClickViewDirectDetails"
                style="color: #405189"
              >
                Xem chi tiết
              </span>
            </div>
          </div>
          <!-- show resuls -->
        </div>
        <div
          v-else
          class="offcanvas-body pb-1 pt-0 px-0"
          style="overflow-y: scroll"
        >
          <div
            class="d-flex align-items-center p-2 gap-2"
            style="border-bottom: 1px dotted #ccc; background-color: #508ff4"
          >
            <i
              class="mdi mdi-keyboard-backspace fs-22"
              @click="viewDetails = false"
            ></i>
            <div class="ms-2">
              <div style="color: #fff">
                <span>Từ: </span
                >{{ origin.name ?? `${origin.lat}, ${origin.lng}` }}
              </div>
              <div style="color: #fff">
                <span>Đến: </span>
                {{
                  destination.name ?? `${destination.lat}, ${destination.lng}`
                }}
              </div>
            </div>
          </div>
          <div class="mt-2 ps-2" style="font-size: 18px">
            {{ time }}<span style="color: #70757a"> ({{ long }})</span>
          </div>
          <div class="mx-3 my-2 mt-4">
            <h5><b>Vị trí của bạn</b></h5>
            <div
              v-for="(item, index) in detailsDirect"
              :key="index"
              class="d-flex gap-3 mt-3"
            >
              <i
                v-if="item.type === 'finish'"
                style="font-size: 24px"
                class="ri-check-line"
              ></i>
              <i
                v-else-if="item.type === 'turn-right'"
                style="font-size: 24px"
                class="ri-arrow-right-line"
              ></i>
              <i
                v-else-if="item.type === 'turn-left'"
                style="font-size: 24px"
                class="ri-arrow-left-line"
              ></i>
              <i
                v-else-if="item.type === 'keep-left'"
                style="font-size: 24px"
                class="ri-arrow-left-line"
              ></i>
              <i v-else style="font-size: 24px" class="ri-arrow-up-line"></i>
              <div class="w-100">
                <p>{{ item.name }}</p>
                <div class="w-100 d-flex">
                  <span>{{ item.met }}</span>
                  <hr class="w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutNavbar>
  </div>
</template>

<style scoped>
.active-mode {
  background-color: #e8f0fe !important;
  color: #174ea6 !important;
}

.w-30px {
  width: 30px !important;
}

.h-30px {
  height: 30px !important;
}
</style>
