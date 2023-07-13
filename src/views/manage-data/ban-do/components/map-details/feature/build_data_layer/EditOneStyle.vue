<script>
import API from "../../../../../../../helpers/api/useAxios.js";
import {
  errorToast,
  successToast,
} from "../../../../../../../helpers/api/toastStyle.js";
export default {
  props: {
    styleDetails: {
      type: Object,
      default: function () {
        return {
          lines: [],
          points: [],
          rasters: [],
          polygons: [],
        };
      },
    },
    layerGroup: {
      type: Object,
    },
  },
  data: function () {
    return {
      editStyle: {
        active: false,
      },
      stylePatch: {},
    };
  },
  mounted: function () {
    this.stylePatch = this.styleDetails;
  },
  methods: {
    handleClickEdit: async function () {
      const vm = this;
      const res = API().patch(
        `${location.pathname.split("/")[1]}/layer-map/${vm.layerGroup.id}/`,
        {
          description_style: vm.stylePatch,
        }
      );
      if (res) {
        vm.editStyle.active = false;
        successToast("Đã chỉnh sữa chú thích cho style");
        return;
      }
      errorToast(
        "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
      );
    },
    handleClickCancle: function () {
      this.stylePatch = this.styleDetails;
    },
    getColor: function (type, style) {
      let color = "";
      switch (type) {
        case "points":
          color = style.symbol.fill_color;
          break;
        case "lines":
          color = style.stroke_color;
          break;
        case "rasters":
          color = style.color_map[1].color;
          break;
        case "polygons":
          color = style.fill_color;
          break;
        default:
      }
      return color;
    },
  },
};
</script>

<template>
  <div>
    <i
      @click="editStyle.active = true"
      class="ri-pencil-fill align-bottom px-2 fs-13 hover-bg"
    ></i>
    <!-- modal form sửa styles -->
    <b-modal
      :title="`${layerGroup?.name_display}`"
      v-model="editStyle.active"
      hide-footer
      class="v-modal-custom"
      centered
    >
      <div class="modal-body p-0">
        <div class="mb-0">
          <label for="message-text" class="col-form-label">
            Chỉnh sửa chú thích cho style
            {{ layerGroup.style?.name ?? "style" }}:
          </label>

          <div v-for="(value, key) in stylePatch" :key="key">
            <template v-if="value.length">
              <div
                class="ps-3 py-1 border list-group-item nested-3 list-layer-custom"
              >
                <!-- <i class="ri-drag-move-fill align-bottom handle"></i> -->
                <div class="d-flex justify-content-between align-items-center">
                  <div
                    class="flex-grow-1"
                    style="overflow-wrap: break-word !important"
                  >
                    <div>
                      <h6 class="mb-0">{{ key }} &nbsp;</h6>
                    </div>
                  </div>
                </div>
                <div class="mt-2 row">
                  <div
                    v-for="(de, deIndex) in value"
                    :key="deIndex"
                    class="col-6 d-flex align-items-center mb-2"
                  >
                    <i
                      class="mdi mdi-checkbox-blank-circle fs-14 align-middle me-2"
                      :style="{
                        color: getColor(key, de),
                      }"
                    ></i>
                    <input type="text" v-model="de.name" />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="modal-footer v-modal-footer">
          <button
            class="btn btn-light btn-md"
            type="button"
            @click="editStyle.active = false"
          >
            <!---->
            <div @click="handleClickCancle" class="btn-content">
              Huỷ bỏ
            </div></button
          ><button class="btn btn-primary btn-md" type="submit">
            <!---->
            <div @click="handleClickEdit" class="btn-content">Xác nhận</div>
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
