<script setup>
import { ref, reactive } from "vue";
import API from "../../../../../../../helpers/api/useAxios.js";
import GroupData from "./GroupData.vue";
import { errorToast } from "../../../../../../../helpers/api/toastStyle";
import { getDifferentArray } from "@/common/common.js";

const IDMAP = location.pathname.split("/").pop();
const SLUG = location.pathname.split("/")[1];
const isLoading = ref(false);

const layersCanAdd = ref([]);
API()
  .get(`${SLUG}/map/${IDMAP}/layer-can-add/`)
  .then((res) => {
    if (!res) return;
    layersCanAdd.value = res.map((item) => {
      return { ...item, name: item.name_display };
    });
  });

// Nhóm lớp dữ liệu trong map
const dataGroupInMap = ref([]);
API()
  .get(`/${SLUG}/group-layer-map/?map_id=${IDMAP}`)
  .then((res) => {
    dataGroupInMap.value = res.results ?? [];
  });
const reSetDataGroup = (type, value) => {
  switch (type) {
    case "update_name":
      dataGroupInMap.value = dataGroupInMap.value.map((item) =>
        item.id === value.id ? value : item
      );
      break;
    case "delete_group":
      dataGroupInMap.value = dataGroupInMap.value.filter(
        (item) => item.id !== value.id
      );
      break;
    case "add_layer_group":
      layersCanAdd.value = getDifferentArray(layersCanAdd.value, value);
      break;
    case "layer_map_add_new":
      for (let index_group in dataGroupInMap.value) {
        if (
          dataGroupInMap.value[index_group].id !== value.group_layer_display
        ) {
          continue;
        }
        dataGroupInMap.value[index_group].layers = [
          ...dataGroupInMap.value[index_group].layers,
          { ...value, name: value.name_display ?? "Tên layer" },
        ];
        console.log(dataGroupInMap.value[index_group], value);
      }
      break;
    case "delete_layer":
      for (let index_group in dataGroupInMap.value) {
        if (dataGroupInMap.value[index_group].id !== value.group_layer_display)
          continue;
        dataGroupInMap.value[index_group].layers = dataGroupInMap.value[
          index_group
        ].layers.filter((item) => item.id !== value.id);
      }
      break;
    case "change-style":
      for (let index_group in dataGroupInMap.value) {
        if (dataGroupInMap.value[index_group].id !== value.group_layer_display)
          continue;
        for (let index_layer in dataGroupInMap.value[index_group].layers) {
          if (
            dataGroupInMap.value[index_group].layers[index_layer].id !==
            value.id
          )
            continue;
          dataGroupInMap.value[index_group].layers[index_layer] = value;
        }
      }
      break;
  }
};

const addGroup = reactive({
  active: false,
  name: "",
  description: "",
});
const createGroupInMap = () => {
  isLoading.value = true;
  const data = {
    name: addGroup.name,
    map: IDMAP,
    description: addGroup.description,
  };
  API()
    .post(`/${SLUG}/group-layer-map/`, data)
    .then((res) => {
      isLoading.value = false;
      addGroup.active = false;
      if (res.id) {
        dataGroupInMap.value = [...dataGroupInMap.value, res];
        return;
      }
      errorToast(
        "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
      );
    });
};
const handleClickCreateGroupInMap = () => {
  createGroupInMap();
};
</script>

<template>
  <div>
    Buil Styles
    <GroupData
      v-for="item in dataGroupInMap"
      :key="item.id"
      :group-layer="item"
      :change-group="reSetDataGroup"
      :layers-can-add="layersCanAdd"
    ></GroupData>
    <div
      v-if="isLoading"
      class="w-100 mt-3 d-flex justify-content-center align-items-center"
    >
      <div style="width: 32px; height: 32px">
        <div class="spin-loading"></div>
      </div>
    </div>
    <div class="w-100 text-center mt-3">
      (<span
        @click="addGroup.active = true"
        class="text-primary cursor-pointer hover-text-underline"
      >
        Thêm nhóm dữ liệu</span
      >)
    </div>
    <!-- add Group -->
    <b-modal
      title="Thêm mới nhóm dữ liệu"
      v-model="addGroup.active"
      hide-footer
      class="v-modal-custom"
      centered
    >
      <div class="modal-body p-0">
        <div class="mb-2">
          <label for="customer-name" class="col-form-label"
            >Tên nhóm dữ liệu:</label
          ><input
            type="text"
            name="name_group"
            v-model="addGroup.name"
            class="form-control"
            required
          />
        </div>
        <div class="mb-0">
          <label for="message-text" class="col-form-label">Mô tả:</label
          ><textarea
            class="form-control"
            v-model="addGroup.description"
            rows="4"
          ></textarea>
        </div>
        <div class="modal-footer v-modal-footer">
          <button
            class="btn btn-light btn-md"
            type="button"
            @click="addGroup.active = false"
          >
            <!---->
            <div class="btn-content">Huỷ bỏ</div></button
          ><button class="btn btn-primary btn-md" type="submit">
            <!---->
            <div class="btn-content" @click="handleClickCreateGroupInMap">
              Tạo mới
            </div>
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
