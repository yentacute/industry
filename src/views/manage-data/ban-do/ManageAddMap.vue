<script setup>
import { reactive, defineProps } from "vue";
import { errorToast } from "../../../helpers/api/toastStyle";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    default: "sipm-base",
  },
  nameKCN: {
    type: String,
    default: "KHU CÔNG NGHIỆP",
  },
});
const address = {
  title: props.nameKCN,
  details: [
    {
      name: "Quản lý bản đồ",
      to: `${props.slug}ManageMapPage`,
    },
    {
      name: props.update ? "Cập nhật bản đồ" : "Thêm mới bản đồ",
      to: `${props.slug}ManageAddMap`,
    },
  ],
};

const form = reactive({
  name: "",
  description: "",
  is_public: true,
});

const view = reactive({
  disable: false,
});

if (props.update) {
  API()
    .get(`${props.slug}/map/${window.location.pathname.split("/").pop()}/`)
    .then((res) => {
      form.name = res.name;
      form.description = res.description;
      form.is_public = res.is_public;
    });
}

const useNavigate = useRouter();
const createMap = () => {
  view.disable = true;
  API()
    .post(`${props.slug}/map/`, form)
    .then((res) => {
      if (res.id) {
        useNavigate.push({
          name: `${props.slug}MapDetails`,
          params: { mapId: res.id },
        });
      }
      view.disable = false;
    });
};
const updateMap = () => {
  view.disable = true;
  API()
    .patch(
      `${props.slug}/map/${window.location.pathname.split("/").pop()}/`,
      form
    )
    .then((res) => {
      if (res.id) {
        useNavigate.push({
          name: `${props.slug}ManageMapPage`,
        });
      }
      view.disable = false;
    });
};
const handleSubmit = function () {
  if (!form.name) {
    errorToast("Vui lòng không để trống trường Tên");
    return;
  }

  if (props.update) {
    updateMap();
  } else {
    createMap();
  }
};
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ban-do"
    :slug="props.slug"
  >
    <div class="bg-white p-3">
      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input
          type="text"
          class="form-control"
          placeholder="Tên *"
          name="name"
          v-model="form.name"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Mô tả</label>
        <textarea
          class="form-control"
          placeholder="Mô tả vai trò"
          name="description"
          v-model="form.description"
        ></textarea>
      </div>
      <div class="mb-3 d-flex gap-2 align-items-center">
        <input name="is_public" type="checkbox" v-model="form.is_public" />
        <label class="form-label m-0 p-0">Công khai</label>
      </div>
      <div style="text-align: right; z-index: 0">
        <button
          @click="handleSubmit"
          class="btn btn-primary"
          :disabled="view.disable"
        >
          {{ props.update ? "Cập nhật" : "Tạo mới" }}
        </button>
      </div>
    </div>
  </Layout>
</template>
