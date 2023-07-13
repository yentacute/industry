<script>
import ModalCommon from "../ModalCommon.vue";
import { reactive, ref } from "vue";
import apiRequest from "../../helpers/api/folderApi";
import { successToast, errorToast } from "../../helpers/api/toastStyle";
import API from "../../helpers/api/useAxios.js";

const setMenuAddType = (name, classIcon, handle = () => {}, active = false) => {
  return { name: name, icon: classIcon, active: active, handle: handle };
};

export default {
  props: {
    slug: {
      type: String,
      default: "sipm-base",
    },
    nameKCN: {
      type: String,
      default: "KHU CÔNG NGHIỆP",
    },
  },
  setup(props) {
    const object3D = reactive({
      shape_file: null,
      shape_img: null,
      name: "",
      texture: "",
      obj: "",
      position: {
        lat: "",
        lng: "",
      },
      bearing: "",
      scale: "",
      height: 1,
      growUp: true,
      app_name: props.slug,
      id_map4d: "",
    });
    const dataImg = ref();
    const dataObj = ref();
    const submitForm3DAddData = async () => {
      try {
        const newForm = new FormData();
        newForm.append("name", object3D.name);
        newForm.append("texture", object3D.shape_img);
        newForm.append("obj", object3D.shape_file);
        newForm.append("type", 2);
        newForm.append("app_name", object3D.app_name);
        const response = await apiRequest.post("/object3d/", newForm);
        console.log(123, response);
        dataObj.value = response.data.obj;
        dataImg.value = response.data.texture;
        successToast("Tạo lớp thành công");
        return response.data;
        // emits("dataPosition", response.data.id);
      } catch (error) {
        console.log(error);
        errorToast("Đã xảy ra lỗi, mời kiểm tra lại");
      }
    };
    function changeFile(event) {
      object3D.shape_file = event.target.files[0];
    }
    function changeImg(event) {
      object3D.shape_img = event.target.files[0];
    }
    return {
      submitForm3DAddData,
      object3D,
      changeFile,
      changeImg,
    };
  },
  data: function () {
    return {
      show: false,
      map: null,
      clickMap: {
        building: null,
      },
      location: null,
      building: null,
      typeAdd: "new-file",
      tenplateObj: [],
      MENU: [
        setMenuAddType(
          "Tạo đối tượng mới",
          "ri-file-add-fill",
          () => {
            this.typeAdd = "new-file";
          },
          true
        ),
        setMenuAddType("Mẫu có sẵn", "ri-pin-distance-fill", () => {
          this.typeAdd = "chose-libraly";
        }),
        setMenuAddType("Đồng bộ từ bản đồ", "ri-pin-distance-fill", () => {
          this.typeAdd = "asyn-map";
        }),
        setMenuAddType(
          "Vẽ đối tượng trên bản đồ",
          "ri-pin-distance-fill",
          () => {
            this.typeAdd = "draw-building";
          }
        ),
      ],
      drawMap: {
        coordinates: [],
        height: 100,
      },
    };
  },
  mounted: async function () {
    const res = await API().get(`object3d-library`);
    this.tenplateObj = res.results;
  },
  components: { ModalCommon },
  methods: {
    handleSetView: function () {
      this.show = true;
      const vm = this;
      setTimeout(() => {
        if (vm.map) return;
        vm.innitMap();
      }, 400);
    },
    handleClose: function () {
      this.show = false;
    },
    handleChangeActive: function (menu) {
      menu.handle();
      this.MENU.forEach((item) => {
        if (item.name === menu.name) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    },
    innitMap: function () {
      let options = {
        center: { lat: 10.336505, lng: 106.368963 },
        controls: false,
        mapType: "map3d",
        zoom: 19,
        tilt: 62.5,
      };
      this.map = new map4d.Map(document.getElementById("mapCustom"), options);
      const vm = this;
      this.map.addListener(
        "click",
        function (args) {
          console.log(12312, args);
          vm.clickMap.building = args.building;
        },
        {
          mapbuilding: true,
          building: true,
        }
      );
      this.map.addListener(
        "click",
        function (args) {
          vm.location = args.location;
        },
        {}
      );
    },
    creatNewBuildingMap: function (name, model, texture, scale, bearing) {
      const vm = this;
      const options = {
        name: name,
        position: vm.map.getCamera().target,
        model: model,
        texture: texture,
        // model:
        //   "https://sw-hcm-1.vinadata.vn/v1/AUTH_d0ecabcbdcd74f6aa6ac9a5da528eb78/sdk/models/5d26e774bb542caaf439e605.obj",
        // texture:
        //   "https://sw-hcm-1.vinadata.vn/v1/AUTH_d0ecabcbdcd74f6aa6ac9a5da528eb78/sdk/textures/5d26e775bb542caaf439e607.png",
      };
      if (scale) {
        options.scale = scale;
      }
      if (bearing) {
        options.bearing = bearing;
      }
      // Tạo đối tượng Building là một cây cầu từ BuildingOptions với model và texture
      let building = new map4d.Building(options);
      // Thêm building vào bản đồ
      building.setMap(this.map);
      this.object3D.position = vm.map.getCamera().target;
      this.object3D.bearing = vm.map.getCamera().bearing;
      this.object3D.scale = 1;
      return building;
    },
    handleSubmitM: async function () {
      const vm = this;
      const res = await this.submitForm3DAddData();
      vm.building = vm.creatNewBuildingMap(
        res.name,
        `${res.obj}`,
        `${res.texture}`
      );
    },
    setNewBuilding: function (type, clickIcon = "") {
      const vm = this;
      if (!vm.building) return;
      switch (type) {
        case "location":
          if (clickIcon === "+lat") {
            vm.object3D.position.lat += 0.000001;
          } else if (clickIcon === "-lat") {
            vm.object3D.position.lat -= 0.000001;
          } else if (clickIcon === "+lng") {
            vm.object3D.position.lng += 0.000001;
          } else if (clickIcon === "-lng") {
            vm.object3D.position.lng -= 0.000001;
          }
          var position = {
            lat: vm.object3D.position.lat,
            lng: vm.object3D.position.lng,
          };
          vm.building.setPosition(position);
          vm.map.panTo(position);
          break;
        case "bearing":
          if (vm.object3D.bearing <= 0) break;
          if (clickIcon === "+") {
            vm.object3D.bearing = vm.object3D.bearing + 0.01;
          } else if (clickIcon === "-") {
            vm.object3D.bearing = vm.object3D.bearing - 0.01;
          }
          vm.building.setBearing(vm.object3D.bearing);
          break;
        case "scale":
          if (clickIcon === "+") {
            vm.object3D.scale = parseFloat(vm.object3D.scale) + 0.001;
          } else if (clickIcon === "-") {
            vm.object3D.scale = parseFloat(vm.object3D.scale) - 0.001;
          }
          vm.building.setScale(vm.object3D.scale);
          break;
        default:
      }
    },
    handleChangTemplate: function ($e) {
      if (this.building) this.building.setMap(null);
      const INDEXOBJ = parseInt($e.target.value);
      const res = this.tenplateObj[INDEXOBJ];
      if (!this.object3D.name) {
        this.object3D.name = res.name;
      }
      this.building = this.creatNewBuildingMap(
        res.name,
        `${res.obj}`,
        `${res.texture}`
      );
    },
    handleClickMap: function () {
      const vm = this;
      switch (this.typeAdd) {
        case "new-file":
          return;
        // break;
        case "chose-libraly":
          return;
        // break;
        case "asyn-map":
          vm.object3D.name = vm.clickMap.building.name;
          vm.object3D.id_map4d = vm.clickMap.building.id;
          break;
        case "draw-building":
          if (!vm.location) return;
          if (
            vm.drawMap.coordinates
              .map((item) => `${item[0]}, ${item[1]}`)
              .includes(`${vm.location.lat}, ${vm.location.lng}`)
          )
            return;
          vm.drawMap.coordinates = [
            ...vm.drawMap.coordinates,
            [vm.location.lat, vm.location.lng],
          ];
          if (vm.drawMap.coordinates.length < 2) return;
          vm.handleSetBuilDraw();
          break;
        default:
      }
    },
    handleSetBuilDraw: function () {
      if (this.building) this.building.setMap(null);
      const vm = this;
      vm.building = new map4d.Building({
        name: vm.object3D.name ?? "demo",
        position: vm.map.getCamera().target,
        coordinates: [...vm.drawMap.coordinates],
        height: vm.drawMap.height,
      });
      this.object3D.position = vm.map.getCamera().target;
      this.object3D.bearing = vm.map.getCamera().bearing;
      this.object3D.scale = 1;
      // Thêm building vào bản đồ
      vm.building.setMap(vm.map);
    },
    handleDeleteCoordinates: function (i_index) {
      this.drawMap.coordinates = this.drawMap.coordinates.filter(
        (item, index) => index != i_index
      );
      this.handleSetBuilDraw();
    },
  },
};
</script>

<template>
  <ModalCommon id-name="AddForm3D" size="xxl" title="Thêm mới đối tượng 3D">
    <div v-if="show" class="main-card h-100">
      <div class="card h-100">
        <!-- <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Thêm mới đối tượng 3D</h6>
        </div> -->
        <div class="card-body pt-0 h-100" style="overflow-y: auto">
          <ul
            class="nav nav-tabs nav-tabs-custom nav-primary nav-justified border-bottom-nav py-2"
          >
            <li
              v-for="item in MENU"
              :key="item.name"
              class="nav-item cursor-pointer"
              role="presentation"
            >
              <a
                @click="handleChangeActive(item)"
                :class="{ active: item.active }"
                class="nav-link fw-semibold d-flex align-items-center justify-content-center icon-nav"
                ><i class="ri-file-add-fill"></i>
                <span class="d-none d-md-inline-block mx-1 ellipsis">{{
                  item.name
                }}</span></a
              >
            </li>
          </ul>
          <div class="row">
            <div class="col-12 col-md-5">
              <div class="my-3">
                <label for="formFile-img" class="form-label"
                  >Tên đối tượng 3D <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  v-model="object3D.name"
                  class="form-control"
                />
              </div>
              <div class="mb-3 ms-3" v-if="typeAdd == 'new-file'">
                <p>Vui lòng tải lên đối tượng mới</p>
                <div class="my-3">
                  <label for="formFile-img" class="form-label"
                    >Dữ liệu đối tượng file img
                    <span class="text-danger">*</span></label
                  >
                  <input
                    @change="changeImg"
                    type="file"
                    accept=".jpg, .png"
                    class="form-control"
                  />
                </div>
                <div class="my-3">
                  <label for="formFile-geojson" class="form-label"
                    >Dữ liệu đối tượng file Object
                    <span class="text-danger">*</span></label
                  >
                  <input
                    @change="changeFile"
                    type="file"
                    class="form-control"
                  />
                </div>
                <div class="btn btn-primary mt-3" @click="handleSubmitM">
                  Xem trước
                </div>
              </div>
              <div v-else-if="typeAdd == 'chose-libraly'">
                <select class="form-control" @change="handleChangTemplate">
                  <option selected>Vui lòng chọn mẫu</option>
                  <option
                    v-for="(item, index) in tenplateObj"
                    :value="index"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div v-else-if="typeAdd == 'asyn-map'">Đồng bộ từ map</div>
              <div v-else-if="typeAdd == 'draw-building'">
                <div class="my-3">
                  <label for="formFile-img" class="form-label"
                    >Độ cao <span class="text-danger">*</span></label
                  >
                  <input
                    type="number"
                    v-model="drawMap.height"
                    class="form-control"
                    @change="handleSetBuilDraw"
                  />
                </div>
                <div v-if="!drawMap.coordinates.length">
                  Click vào bản đồ để vẽ đối tượng
                </div>
                <div class="h-100 w-100">
                  <div
                    v-for="(item, index) in drawMap.coordinates"
                    :key="index"
                    class="d-flex align-items-center gap-2 p-2 border mb-2 position-relative"
                  >
                    <b class="fs-14">Điểm {{ index + 1 }}:</b
                    ><span>{{ `${item[0]}, ${item[1]}` }}</span>
                    <div
                      @click="handleDeleteCoordinates(index)"
                      class="d-flex justify-content-center align-items-center position-absolute hover-bg"
                      style="top: 6px; bottom: 6px; right: 2px"
                    >
                      <i
                        class="ri-delete-bin-fill text-danger fs-16 cursor-pointer"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="my-3 ms-0 row"
                v-if="building && typeAdd != 'asyn-map'"
              >
                <div class="col-6">
                  <label for="formFile-geojson" class="form-label">Vĩ độ</label>
                  <div class="w-100 position-relative">
                    <input
                      @change="setNewBuilding('location')"
                      v-model="object3D.position.lat"
                      type="number"
                      step="0.000001"
                      required="required"
                      class="form-control"
                    />
                    <i
                      @click="setNewBuilding('location', '+lat')"
                      class="ri-arrow-up-s-fill position-absolute cursor-pointer"
                      style="right: 10px; top: 0px; height: 18px; width: 8px"
                    ></i>
                    <i
                      @click="setNewBuilding('location', '-lat')"
                      class="ri-arrow-down-s-fill position-absolute cursor-pointer"
                      style="right: 10px; bottom: 0px; height: 18px; width: 8px"
                    ></i>
                  </div>
                </div>
                <div class="col-6">
                  <label for="formFile-geojson" class="form-label"
                    >Kinh độ</label
                  >
                  <div class="w-100 position-relative">
                    <input
                      @change="setNewBuilding('location')"
                      v-model="object3D.position.lng"
                      type="number"
                      step="0.000001"
                      required="required"
                      class="form-control"
                    />
                    <i
                      @click="setNewBuilding('location', '+lng')"
                      class="ri-arrow-up-s-fill position-absolute cursor-pointer"
                      style="right: 10px; top: 0px; height: 18px; width: 8px"
                    ></i>
                    <i
                      @click="setNewBuilding('location', '-lng')"
                      class="ri-arrow-down-s-fill position-absolute cursor-pointer"
                      style="right: 10px; bottom: 0px; height: 18px; width: 8px"
                    ></i>
                  </div>
                </div>
                <div class="col-6 mt-3">
                  <label for="formFile-geojson" class="form-label"
                    >Nghiêng</label
                  >
                  <div class="w-100 position-relative">
                    <input
                      @change="setNewBuilding('bearing')"
                      v-model="object3D.bearing"
                      type="number"
                      min="0"
                      step="0.01"
                      class="form-control"
                    />
                    <i
                      @click="setNewBuilding('bearing', '+')"
                      class="ri-arrow-up-s-fill position-absolute cursor-pointer"
                      style="right: 10px; top: 0px; height: 18px; width: 8px"
                    ></i>
                    <i
                      @click="setNewBuilding('bearing', '-')"
                      class="ri-arrow-down-s-fill position-absolute cursor-pointer"
                      style="right: 10px; bottom: 0px; height: 18px; width: 8px"
                    ></i>
                  </div>
                </div>
                <div class="col-6 mt-3">
                  <label for="formFile-geojson" class="form-label">Scale</label>
                  <div class="w-100 position-relative">
                    <input
                      @change="setNewBuilding('scale')"
                      v-model="object3D.scale"
                      type="number"
                      min="0"
                      max="1"
                      step="0.001"
                      class="form-control"
                    />
                    <i
                      @click="setNewBuilding('scale', '+')"
                      class="ri-arrow-up-s-fill position-absolute cursor-pointer"
                      style="right: 10px; top: 0px; height: 18px; width: 8px"
                    ></i>
                    <i
                      @click="setNewBuilding('scale', '-')"
                      class="ri-arrow-down-s-fill position-absolute cursor-pointer"
                      style="right: 10px; bottom: 0px; height: 18px; width: 8px"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-12 col-md-7"
              id="mapCustom"
              style="height: 550px"
              @click="handleClickMap"
            ></div>
          </div>
        </div>
      </div>
      <button class="btn btn-success" @click="handleSubmitM" @dragstart.prevent>
        Lưu lại đối tượng 3D
      </button>
    </div>
  </ModalCommon>
</template>
