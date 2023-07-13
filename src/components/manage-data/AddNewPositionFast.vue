<template>
  <!-- :validation-schema="schema"
    :initial-values="formValues" -->
  <Form @submit="submitFormObject3dFast" id="formData">
    <div class="row">
      <div class="col-12">
        <div class="">
          <p>Vui lòng tải lên đối tượng mới</p>
          <div class="my-3">
            <label for="formFile-img" class="form-label"
              >Dữ liệu đối tượng file img
              <span class="text-danger">*</span>
            </label>
            <Field
              type="file"
              id="formFile-img"
              accept=".jpg, .png"
              class="form-control"
              @change="changeImg($event)"
              name="shape_img"
            />
            <ErrorMessage name="shape_img" class="error-message" />
          </div>
          <!---->
          <div class="my-3">
            <label for="formFile-geojson" class="form-label"
              >Dữ liệu đối tượng file Object
              <span class="text-danger">*</span>
            </label>
            <input
              type="file"
              id="formFile-geojson"
              name="shape_file"
              class="form-control"
              @change="changeFile($event)"
            />
            <ErrorMessage name="shape_file" class="error-message" />
          </div>
          <!---->
        </div>

        <label for="inputname3d" class="form-label">Tên Lớp 3D</label>
        <Field
          name="inputname3d"
          type="text"
          class="form-control mb-3"
          placeholder="name"
          id="inputlat"
          v-model="object3D.name"
        />
        <ErrorMessage name="inputname3d" />
      </div>
      <div class="btn-save d-flex">
        <!-- <button
            type="button"
            class="btn btn-danger btn-md mx-2"
          >
            Huỷ
          </button> -->
        <button type="submit" class="btn btn-success btn-md">Preview</button>
      </div>
    </div>
  </Form>
</template>
<script setup>
import { useFolderStore } from "../../state/folder";
// import ModalCommon from "../ModalCommon.vue";
import { Field, ErrorMessage, Form } from "vee-validate";
// import * as yup from "yup";
// import SearchMap from "../SearchMap.vue";
import { useMapStore } from "../../state/map";
import { reactive, ref, onMounted } from "vue";
// import Map3dOject from "../map/Map3dOject.vue";
import { useCommonStore } from "../../state/common";
import { useObjectStore } from "../../state/object3d";
import { defineEmits, defineProps } from "vue";
import API from "../../helpers/api/useAxios";
import apiRequest from "../../helpers/api/folderApi";

// import MapAddForm from "../map/MapAddForm.vue";
const store = useFolderStore();
const emits = defineEmits(["myEvent"]);
const map = useMapStore();
const common = useCommonStore();
const { getAllObject, allObject } = useObjectStore();
const geomEl = ref(null);
const dataModel = reactive({});
const props = defineProps({
  slug: {
    type: String,
    default: "sipm-base",
  },
  nameKCN: {
    type: String,
    default: "KHU CÔNG NGHIỆP",
  },
});
console.log(3444, props);
function changeFile(event) {
  object3D.shape_file = event.target.files[0];
}
function changeImg(event) {
  object3D.shape_img = event.target.files[0];
}
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
});
const updateApiobject3D = async () => {
  try {
    const newForm = new FormData();
    newForm.append("name", object3D.name);
    newForm.append("texture", object3D.shape_file);
    newForm.append("obj", object3D.shape_img);
    newForm.append("type", 2);
    newForm.append("app_name", object3D.app_name);
    const response = await apiRequest.post("/object3d/", newForm);
    emits("dataPosition", response.data.id);
  } catch (error) {
    console.log(error);
  }
};
// updateApiobject3D();
const submitFormObject3dFast = () => {
  console.log(123);
  updateApiobject3D();
};

onMounted(() => {});
</script>
