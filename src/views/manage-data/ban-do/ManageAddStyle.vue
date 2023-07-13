<script setup>
import { reactive, ref, defineProps } from "vue";
import { errorToast } from "../../../helpers/api/toastStyle";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";
import { useRouter } from "vue-router";

const form = reactive({
  name: "",
  description: "",
  file_style: undefined,
});

const view = reactive({
  disable: false,
});

if (props.update) {
  API()
    .get(
      `${props.slug}/style-geomap/${window.location.pathname.split("/").pop()}/`
    )
    .then((res) => {
      form.name = res.name;
      form.description = res.description;
      form.file_style = res.file_style;
    });
}

const props = defineProps({
  slug: {
    type: String,
    default: "sipm-base",
  },
  update: {
    type: Boolean,
    default: false,
  },
  nameKCN: {
    type: String,
    default: "KHU CÔNG NGHIỆP",
  },
});
const address = {
  title: props.nameKCN,
  details: [
    { name: "Quản lý styles", to: `${props.slug}ManageMapStylesPage` },
    {
      name: props.update ? "Cập nhật style" : "Thêm mới style",
      to: `${props.slug}ManageAddStyle`,
    },
  ],
};
const fileStyle = ref(null);

const useNavigate = useRouter();

const handleChangeFile = function ($e) {
  form.file_style = $e.target.files[0];
};

const createStyle = (data_style) => {
  view.disable = true;
  API()
    .post(`${props.slug}/style-geomap/`, data_style)
    .then((res) => {
      if (res.id) {
        useNavigate.push({
          name: `${props.slug}ManageMapStylesPage`,
        });
      }
      view.disable = false;
    });
};
const updateStyle = (data_style) => {
  view.disable = true;
  API()
    .patch(
      `${props.slug}/style-geomap/${window.location.pathname
        .split("/")
        .pop()}/`,
      data_style
    )
    .then((res) => {
      if (res.id) {
        useNavigate.push({
          name: `${props.slug}ManageMapStylesPage`,
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
  if (!form.file_style) {
    errorToast("Vui lòng tải lên file");
    return;
  }

  const data_style = new FormData();
  data_style.append("name", form.name);
  data_style.append("description", form.description);
  data_style.append("file_style", form.file_style);

  if (props.update) {
    updateStyle(data_style);
    return;
  }
  createStyle(data_style);
};
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ban-do"
    :slug="slug"
  >
    <div class="bg-white p-3">
      <div class="mb-3">
        <label class="form-label">Tên <span class="text-danger">*</span></label>
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
      <div class="mb-3">
        <label class="form-label">Dữ liệu style file sld</label>
        <div v-if="props.update" class="form-control">
          <a>{{ form.file_style }}</a>
        </div>

        <div :class="{ 'ms-3': props.update }">
          <label v-if="props.update" class="form-label mt-2 text-black-50"
            ><i>Chọn file để cập nhật</i></label
          >
          <input
            class="form-control"
            ref="fileStyle"
            name="file_style"
            type="file"
            accept=".sld"
            @change="($e) => handleChangeFile($e)"
          />
        </div>
      </div>
      <div style="text-align: right">
        <button
          @click="handleSubmit"
          class="btn btn-primary"
          :disabled="view.disable"
        >
          {{ props.update ? "Cập nhật" : "Thêm mới" }}
        </button>
      </div>
    </div>
  </Layout>
</template>
