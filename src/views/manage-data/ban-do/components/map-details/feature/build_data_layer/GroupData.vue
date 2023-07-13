<script setup>
import Swal from "sweetalert2";
import { ref, reactive, defineProps } from "vue";
import LayerMap from "./LayerMap.vue";
import API from "../../../../../../../helpers/api/useAxios.js";
import SelectCustomT from "../../../../../../../components/custom/SelectCustomT.vue";
import { errorToast } from "../../../../../../../helpers/api/toastStyle";
import { limitText } from "@/common/common.js";

// const IDMAP = location.pathname.split("/").pop();
const SLUG = location.pathname.split("/")[1];

const props = defineProps({
  groupLayer: {
    type: Object,
    default: function () {
      return {
        id: "",
        name: "Tên nhóm",
      };
    },
  },
  changeGroup: {
    type: Function,
  },
  layersCanAdd: {
    type: Array,
  },
});

const listNewLayer = ref([]);
const isLoading = ref(false);
const SelectFrom = ref(null);

const handleEmitDataStlyes = (data) => {
  listNewLayer.value = [...data];
};

const editGroup = reactive({
  editName: false,
  name: "",
});

const showDetails = ref(false);
const refInput = ref(null);
const addLayers = reactive({
  active: false,
  layer: [],
});

// Hiện thẻ input đổi tên nhóm lớp dữ liệu
const handleClickEditName = () => {
  editGroup.editName = true;
  handleClickToogleShowDetails();
  editGroup.name = props.groupLayer.name;
  setTimeout(() => {
    refInput.value.focus();
  }, 300);
};

// huỷ bỏ đổi tên nhhóm lớp dữ liệu
const handleClickCancleEdit = () => {
  editGroup.editName = false;
};

// show các lớp dữ liệu trong nhóm lớp dữ liệu
const handleClickToogleShowDetails = () => {
  showDetails.value = !showDetails.value;
};

// set trạng thái, popup form thêm layẻ
const handleAddLayerInMap = () => {
  handleClickToogleShowDetails();
  addLayers.active = true;
};

// Tạo mới 1 layer trong 1 nhóm lớp dữ liệu
const createLayerInMap = async (layerId) => {
  const data = {
    group_layer_display: props.groupLayer.id,
    layer: layerId,
  };
  props.changeGroup(
    "layer_map_add_new",
    await API().post(`/${SLUG}/layer-map/`, data)
  );
};
// hàm thêm layer vào map khi click
const handleClickCreateMultipLayerInMap = async () => {
  isLoading.value = true;
  for (let item of listNewLayer.value) {
    await createLayerInMap(item.id);
  }
  isLoading.value = false;
  addLayers.active = false;
  props.changeGroup("add_layer_group", listNewLayer.value);
  listNewLayer.value = [];
  SelectFrom.value.valueChosed = [];
};

// Nhấn enter thì đổi tên nhóm lớp, ko thành công => báo lỗi
const handleKeyupEnterChangeNameGroup = () => {
  const data = {
    name: editGroup.name,
  };
  API()
    .patch(`/${SLUG}/group-layer-map/${props.groupLayer.id}/`, data)
    .then((res) => {
      editGroup.editName = false;
      if (res.id) {
        props.changeGroup("update_name", res);
        return;
      }
      errorToast(
        "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
      );
    });
};

// Xoá 1 nhóm lớp dữ liệu
const handleClickDeleteGroup = () => {
  handleClickToogleShowDetails();
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
      .remove(`/${SLUG}/group-layer-map/${props.groupLayer.id}/`)
      .then((res) => {
        if (res?.instance?.id) {
          props.changeGroup("delete_group", res.instance);
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
  <div>
    <div
      @click="handleClickToogleShowDetails"
      class="nav-link fs-13 mb-0 border mt-2 bg-white cursor-pointer p-1"
      :class="{ 'bg-show': showDetails }"
    >
      <div class="d-flex align-items-center">
        <div class="d-flex w-100">
          <div
            class="flex-shrink-0 d-flex justify-content-center align-items-center ps-1"
          >
            <div class="avatar-xs">
              <div class="avatar-title rounded bg-soft-warning text-warning">
                <i class="ri-gallery-line fs-17"></i>
              </div>
            </div>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="mb-0 fs-12 text-muted">Nhóm dữ liệu</p>
            <input
              ref="refInput"
              v-if="editGroup.editName"
              type="text"
              v-model="editGroup.name"
              placeholder="Nhập tên nhóm"
              class="form-control text-dark fs-13 border-0 p-0 fw-semibold"
              @blur="handleClickCancleEdit"
              @click.stop=""
              @keyup.enter="handleKeyupEnterChangeNameGroup"
            />
            <span class="fw-semibold" :title="props.groupLayer.name" v-else>
              {{ limitText(props.groupLayer.name, 18) }}
            </span>
          </div>
        </div>
        <button
          type="button"
          @click.stop=""
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          class="text-reset dropdown-btn mx-1 border-0 bg-transparent justify-content-end"
        >
          <i class="mdi mdi-dots-vertical fs-14 align-middle"></i>
        </button>
        <div class="dropdown-menu dropdown-menu-end">
          <a
            href="javascript:void(0)"
            class="dropdown-item"
            @click="handleAddLayerInMap"
            ><i class="ri-file-add-line align-bottom text-muted me-2 fs-13"></i>
            Thêm lớp dữ liệu
          </a>
          <a
            href="javascript:void(0)"
            class="dropdown-item"
            @click="handleClickEditName"
            ><i class="ri-edit-line align-bottom text-muted me-2 fs-13"></i>Đổi
            tên
          </a>
          <a
            href="javascript:void(0)"
            class="dropdown-item text-danger"
            @click="handleClickDeleteGroup"
            ><i
              class="ri-delete-bin-line align-bottom me-2 fs-13 text-danger"
            ></i>
            Xóa nhóm dữ liệu
          </a>
        </div>
      </div>
      <div v-if="showDetails" class="ps-2">
        <template v-if="props.groupLayer?.layers.length">
          <LayerMap
            v-for="item in props.groupLayer.layers"
            :key="item.id"
            :layer="item"
            :change-layer="props.changeGroup"
          ></LayerMap>
          <div
            v-if="isLoading"
            class="w-100 my-2 d-flex justify-content-center align-items-center"
          >
            <div style="width: 32px; height: 32px">
              <div class="spin-loading"></div>
            </div></div
        ></template>
        <template v-else>
          <div class="py-2 px-3 mt-2 bg-white border">
            <span>Nhóm dữ liệu trống</span>
          </div>
        </template>
      </div>
    </div>
    <!-- add Group -->
    <b-modal
      title="Thêm mới lớp dữ liệu"
      v-model="addLayers.active"
      hide-footer
      class="v-modal-custom"
      centered
    >
      <div class="modal-body p-0">
        <form action="javascript:void(0)">
          <!-- <div class="mb-2">
            <label for="customer-name" class="col-form-label"
              >Tên lớp dữ liệu:</label
            ><input
              type="text"
              name="name_group"
              v-model="addLayers.name"
              class="form-control"
              required
            />
          </div> -->
          <div class="mb-0">
            <label for="message-text" class="col-form-label">
              Vui lòng chọn những lớp bạn cần:
            </label>
            <SelectCustomT
              ref="SelectFrom"
              :options="props.layersCanAdd"
              @data="handleEmitDataStlyes"
              placeholder="Chọn các lớp cho bản đồ"
            ></SelectCustomT>
          </div>
          <div class="modal-footer v-modal-footer">
            <button
              class="btn btn-light btn-md"
              type="button"
              @click="addLayers.active = false"
            >
              <!---->
              <div class="btn-content">Huỷ bỏ</div></button
            ><button class="btn btn-primary btn-md" type="submit">
              <!---->
              <div
                class="btn-content"
                @click="handleClickCreateMultipLayerInMap"
              >
                Thêm mới
              </div>
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>
<style scoped>
.bg-show {
  background-color: #f8f9f9 !important;
}
</style>
