<script setup>
import Swal from "sweetalert2";
import { defineProps, reactive, inject, ref } from "vue";
import { limitText } from "@/common/common.js";
import API from "../../../../../../../helpers/api/useAxios.js";
import { errorToast } from "../../../../../../../helpers/api/toastStyle.js";
import SelectCustomT from "../../../../../../../components/custom/SelectCustomT.vue";
import EditOneStyle from "./EditOneStyle.vue";

// const IDMAP = location.pathname.split("/").pop();
const SLUG = location.pathname.split("/")[1];

const data_map = inject("map");
const methods_map = inject("draw-map");
const props = defineProps({
  layer: {
    type: Object,
    default: function () {
      return { name: "Layer" };
    },
  },
  changeLayer: {
    type: Function,
  },
});

const view = reactive({
  style: false,
  layerOverlay: false,
});
const isLoading = ref(false);
const handleClickSetViewStyle = () => {
  view.style = !view.style;
};
const handleShowLayerOverlay = () => {
  if (data_map.references.value.overlay) {
    data_map.references.value.overlay.setMap(null);
  }
  view.layerOverlay = !view.layerOverlay;
  if (!view.layerOverlay) {
    // if(data_map)
    return;
  }
  // methods_map.setMapType("roadmap");
  if (
    !methods_map.overlayTile(
      props.layer.wms_info.layer,
      props.layer.wms_info.workspace
    )
  )
    view.layerOverlay = false;
};

const addStyle = reactive({
  active: false,
  arrStylesApi: [],
  stylesNew: [],
});
API()
  .get(`${SLUG}/style-geomap/?all`)
  .then((res) => {
    if (res?.results) {
      addStyle.arrStylesApi = res.results;
    }
  });

const handleEmitDataStlyes = (data) => {
  addStyle.stylesNew = [...data];
};

// Thêm mới 1 layer style
const addStyleInLayer = (styleId) => {
  const data = {
    type: "update-style",
    style: styleId,
  };
  return API().patch(`/${SLUG}/layer-map/${props.layer.id}/`, data);
};

// Thêm mới các layer style
const handleClickCreateMultipStyleInLayer = () => {
  isLoading.value = true;
  addStyle.stylesNew.forEach((item) => {
    addStyleInLayer(item.id).then((res) => {
      if (res) {
        props.changeLayer("change-style", res);
        isLoading.value = false;
        return;
      }
      errorToast(
        "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
      );
    });
  });
  addStyle.active = false;
};

// const editName = ref(false);
// const handleClickEditName = () => {
//   editName.value = true;
// };
// const handleClickCancleEdit = () => {
//   editName.value = false;
// };
//

const handleDeleteLayer = () => {
  Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Không",
  }).then((result) => {
    if (!result.isConfirmed) {
      return;
    }

    API()
      .remove(`/${SLUG}/layer-map/${props.layer.id}/`)
      .then((res) => {
        if (res?.instance?.id) {
          props.changeLayer("delete_layer", res.instance);
          Swal.fire(
            "Deleted!",
            `Bạn đã xoá nhóm dữ liệu ${res.instance.name}`,
            "success"
          );
          return;
        }
        errorToast(
          "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
        );
      });
  });
};
</script>

<template>
  <div
    @click.stop=""
    class="list-group-item nested-3 bg-transparent py-0 mb-2 border-0"
  >
    <div class="card p-1 text-reset notification-item d-block my-0">
      <!-- el layer -->
      <div class="d-flex align-items-center">
        <div class="flex-grow-1 d-flex">
          <div class="flex-shrink-0">
            <div class="avatar-xs">
              <div class="avatar-title rounded bg-white text-info">
                <i class="ri-map-2-line fs-16"></i>
              </div>
            </div>
          </div>
          <div
            @click="handleClickSetViewStyle"
            class="flex-grow-1 d-flex align-items-center"
          >
            <!-- <input
              v-if="editName"
              type="text"
              placeholder="Nhập tên lớp"
              class="form-control text-dark fs-13 border-0"
              @blur="handleClickCancleEdit"
            /> -->
            <span
              class="ps-2 ms-1 text-muted el"
              :title="props.layer.name_display"
            >
              {{
                limitText(
                  props.layer?.name_display ?? props.layer?.name ?? "Tên Layer",
                  15
                )
              }}
            </span>
          </div>
        </div>
        <div class="d-flex flex-shrink-0">
          <a
            href="javascript:void(0)"
            @click="handleShowLayerOverlay"
            type="button"
            class="text-reset mx-1"
            ><i
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Ẩn/hiện lớp"
              layer_show="false"
              layer_data="upload_diagioihuyen_mvb_s4lifb"
              workspace=""
              class="fs-13 align-middle layer_selected_"
              :class="[view.layerOverlay ? 'ri-eye-fill' : 'ri-eye-off-fill']"
            ></i
          ></a>
          <div class="dropdown">
            <a
              href="javascript:void(0)"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
              class="text-reset dropdown-btn mx-1"
              ><i class="mdi mdi-dots-vertical fs-14 align-middle"></i
            ></a>
            <div class="dropdown-menu dropdown-menu-end">
              <a
                href="javascript:void(0)"
                @click="addStyle.active = true"
                class="dropdown-item"
              >
                <i
                  class="ri-contrast-drop-2-fill align-bottom text-muted me-2 fs-13"
                ></i>
                Thêm style
              </a>
              <a
                href="javascript:void(0)"
                @click="handleDeleteLayer"
                class="dropdown-item text-danger"
              >
                <i
                  class="ri-delete-bin-line align-bottom me-2 fs-13 text-danger"
                ></i>
                Xóa lớp dữ liệu
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- Khi có stlyes -->
      <div
        v-if="isLoading"
        class="w-100 my-2 d-flex justify-content-center align-items-center"
      >
        <div style="width: 32px; height: 32px">
          <div class="spin-loading"></div>
        </div>
      </div>
      <template v-else>
        <div v-if="view.style" class="ms-2 px-1 py-1">
          <!-- <template v-if="props.layer?.style?.length"></template> -->
          <!-- <template v-else> -->
          <div
            class="d-flex justify-content-between my-1 mb-2 px-2 align-content-end div-style-in-layer"
          >
            <span class="text-muted my-0">
              {{ props.layer.style?.name ?? "Chưa có style nào" }}
            </span>
            <EditOneStyle
              v-if="props.layer.style?.name"
              :style-details="props.layer.description_style"
              :layer-group="props.layer"
            ></EditOneStyle>
          </div>
          <!-- </template> -->
          <div v-if="props.layer.style?.id" class="accordion-body pt-2">
            <p class="text-muted my-0">Opacity: {{ props.layer.opacity }}</p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              :value="props.layer.opacity"
              class="form-range"
            />
          </div></div
      ></template>
    </div>
    <!-- modal form thêm styles -->
    <b-modal
      :title="`Thêm mới layer styles liệu ${props.layer.name_display}`"
      v-model="addStyle.active"
      hide-footer
      class="v-modal-custom"
      centered
    >
      <div class="modal-body p-0">
        <form action="javascript:void(0)">
          <div class="mb-0">
            <label for="message-text" class="col-form-label">
              Vui lòng chọn style bạn cần:
            </label>
            <SelectCustomT
              ref="SelectFrom"
              :options="addStyle.arrStylesApi"
              @data="handleEmitDataStlyes"
              placeholder="Chọn style cho lớp dữ liệu"
              :multip="false"
            ></SelectCustomT>
          </div>
          <div class="modal-footer v-modal-footer">
            <button
              class="btn btn-light btn-md"
              type="button"
              @click="addStyle.active = false"
            >
              <!---->
              <div class="btn-content">Huỷ bỏ</div></button
            ><button class="btn btn-primary btn-md" type="submit">
              <!---->
              <div
                class="btn-content"
                @click="handleClickCreateMultipStyleInLayer"
              >
                Xác nhận
              </div>
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>
<style scoped>
.div-style-in-layer {
  border-radius: 4px;
  border-left: 2px dotted #ccc;
  border-bottom: 0.3px solid #b6c5d6;
  padding-bottom: 4px;
}
</style>
