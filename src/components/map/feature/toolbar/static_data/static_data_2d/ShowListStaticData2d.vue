<script>
import { useStaticData2d } from "../../../../../../state/map_control/staticData";

export default {
  data: function () {
    return {
      showMenuMore: false,
      add2D: {
        opacity: 1,
        show: false,
      },
    };
  },
  setup: function () {
    const staticData2d = useStaticData2d();
    const zoomTo2dObject = (object2d) => {
      console.log(object2d);
      staticData2d.zoomTo2dObject(object2d);
    };

    const removeFeatureShow = (object2d) => {
      staticData2d.remove2dObject(object2d);
    };

    const toggleShowFeature = (object2d) => {
      if (object2d.is_active) {
        // Add Feature
        staticData2d.addFeatureShow(object2d);
      } else {
        // Remove feature
        staticData2d.removeFeatureShow(object2d);
      }
    };

    return {
      staticData2d,
      zoomTo2dObject,
      toggleShowFeature,
      removeFeatureShow,
    };
  },
  components: {},
  mounted: function () {
    this.staticData2d.loadDataFromLocalStorage();
    window.addEventListener("click", this.handleCloseOpacity);
  },
  unmounted: function () {
    window.removeEventListener("click", this.handleCloseOpacity);
  },
  methods: {
    handleClickToggleShow: function () {
      this.show = !this.show;
    },
    handleCloseOpacity: function () {
      this.add2D.show = false;
    },
    handleOpenOpacity: function () {
      setTimeout(() => {
        this.add2D.show = true;
      }, 200);
    },
    handleChangOpacity: function (object2d) {
      this.staticData2d.changeOpacityFeature(this.add2D.opacity, object2d);
    },
  },
};
</script>

<template>
  <div>
    <div>
      <label class="form-label">Danh sách dữ liệu 2D</label>
    </div>
    <div>
      <ul v-if="staticData2d.listData2dObject.length">
        <li
          class="form-check form-switch d-flex gap-3 align-items-center hover-bg"
          v-for="(object2d, index) in staticData2d.listData2dObject"
          :key="object2d"
          style="line-height: 28px; border-radius: 4px"
        >
          <div class="w-100 d-flex align-items-center gap-2">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              v-model="object2d.is_active"
              @change="toggleShowFeature(object2d)"
              :id="'layer-feature-public-2d' + index"
            />
            <label
              class="form-check-label ellipsis"
              :for="'layer-feature-public-2d' + index"
            >
              {{ object2d.name }}
            </label>
          </div>
          <div
            class="position-relative d-flex align-items-center justify-content-center"
            style="width: 48px"
          >
            <i
              class="ri-information-line text-muted fs-16 align-middle me-1 cursor-pointer"
            ></i>
            <div class="dropdown">
              <button
                class="btn btn-soft-secondary btn-sm dropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  class="ri-more-2-fill text-muted fs-16 align-middle me-1 cursor-pointer"
                ></i>
              </button>
              <div
                v-if="add2D.show"
                @click.stop
                class="dropdown ms-sm-3 bg-transparent"
              >
                <div
                  style="
                    box-shadow: 0px 0px 0px 0px !important;
                    position: absolute;
                    inset: -28px 0px auto auto;
                    margin: 0px;
                    transform: translate(0px, 20px);
                  "
                  data-popper-placement="bottom-end"
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    v-model="add2D.opacity"
                    @change="handleChangOpacity(object2d)"
                    style="padding: 0px 5px !important; height: 4px"
                  />
                </div>
              </div>
              <ul
                class="dropdown-menu dropdown-menu-end"
                data-popper-placement="bottom-end"
                style="
                  position: absolute;
                  inset: 0px 0px auto auto;
                  margin: 0px;
                  transform: translate(0px, 29px);
                "
              >
                <li class="cursor-pointer px-3 ms-1" @click="handleOpenOpacity">
                  <a
                    href="#"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                    class="align-middle show"
                    ><i class="mdi mdi-circle-opacity align-middle"></i>
                    Chỉnh sửa
                  </a>
                </li>
                <li class="cursor-pointer" @click="zoomTo2dObject(object2d)">
                  <a
                    on-click="javascript:void(0)"
                    class="dropdown-item"
                    target="_self"
                    ><i class="mdi mdi-map-search-outline"></i>
                    Phóng tới
                  </a>
                </li>
                <li class="cursor-pointer" @click="removeFeatureShow(object2d)">
                  <a
                    on-click="javascript:void(0)"
                    class="dropdown-item text-danger"
                    target="_self"
                    ><i class="ri-delete-bin-line"></i>
                    Gỡ lớp đối tượng
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div v-else>Chưa có dữ liệu nào được tải lên!</div>
    </div>
  </div>
</template>

<style scoped></style>
