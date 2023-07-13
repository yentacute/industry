<template>
  <Form @submit="submitFormObject3d" :validation-schema="schema" id="formData">
    <!-- :initial-values="formValues" -->
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

        <label for="inputname3d" class="form-label"
          >Tên Lớp 3D <span class="text-danger">*</span></label
        >
        <Field
          name="inputname3d"
          type="text"
          class="form-control mb-3"
          placeholder="name"
          id="inputlat"
          v-model="object3D.name"
        />
        <ErrorMessage name="inputname3d" />

        <!-- <div v-if="fixForm"> -->
          <!-- <label for="inputlat" class="form-label"
            >Vĩ độ <span class="text-danger">*</span></label
          >
          <Field
            name="lat"
            type="number"
            step="0.000001"
            class="form-control mb-3"
            placeholder="lat"
            id="inputlat"
            v-model="object3D.position.lat"
          />
          <ErrorMessage name="lat" />
          <label for="inputlgn" class="form-label"
            >Kinh độ <span class="text-danger">*</span></label
          >
          <Field
            name="lng"
            type="number"
            step="0.000001"
            class="form-control mb-3"
            placeholder="lng"
            id="inputlgn"
            v-model="object3D.position.lng"
          />
          <ErrorMessage name="lng" />
          <label for="inputbearing" class="form-label"
            >Nghiêng <span class="text-danger">*</span></label
          >
          <Field
            name="bearing"
            type="number"
            step="0.000001"
            class="form-control mb-3"
            placeholder="bearing"
            id="inputbearing"
            v-model="object3D.bearing"
          />
          <ErrorMessage name="bearing" />
          <label for="inputscale" class="form-label"
            >Scale <span class="text-danger">*</span></label
          >
          <Field
            name="scale"
            type="number"
            step="0.000001"
            class="form-control mb-3"
            placeholder="scale"
            id="inputscale"
            v-model="object3D.scale"
          />
          <ErrorMessage name="scale" /> -->
        <!-- </div> -->
      </div>
      <div>
        <MapAdd3D />
      </div>
      <div class="btn-save d-flex">
        <!-- <button
          type="button"
          class="btn btn-danger btn-md mx-2"
        >
          Huỷ
        </button> -->
        <button type="submit" class="btn btn-success btn-md">Tạo lớp 3D</button>
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
import { reactive, ref, onMounted,  } from "vue";
// import MapAdd3D from "../map/MapAdd3D.vue";
import { useCommonStore } from "../../state/common";
import { useObjectStore } from "../../state/object3d";
import { defineEmits, defineProps } from "vue";
import apiRequest from "../../helpers/api/folderApi";
import { successToast, errorToast } from "../../helpers/api/toastStyle";
import MapAdd3D from "../../components/map/MapAdd3D.vue";

// import Map3DPopup from "../map/Map3DPopup.vue";
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
  fixForm: {
    type: Boolean,
  },
});
console.log(3444, props);
function changeFile(event) {
  object3D.shape_file = event.target.files[0];
}
function changeImg(event) {
  object3D.shape_img = event.target.files[0];
}

const schema = {
  // shape_img(value) {
  //   if (value) {
  //     const tailfile = value.name.split(".")[1];
  //     if (value.name && tailfile === "jpg") {
  //       return true;
  //     }
  //     return "Mời nhập file ";
  //   }
  // },
};
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
    newForm.append(
      "meta_object3d",
      JSON.stringify({
        position: { lat: object3D.position.lat, lng: object3D.position.lng },
        bearing: object3D.bearing,
        scale: object3D.scale,
        height: object3D.height,
        growUp: true,
      })
    );
    newForm.append("type", 2);
    newForm.append("app_name", object3D.app_name);
    const response = await apiRequest.post("/object3d/", newForm);
    console.log(123, response);
    successToast("Tạo lớp thành công");
    emits("dataPosition", response.data.id);
  } catch (error) {
    console.log(error);
    errorToast("Đã xảy ra lỗi, mời kiểm tra lại");
  }
};
// updateApiobject3D();
const submitFormObject3d = () => {
  console.log(123);
  updateApiobject3D();
  // emits("dataPosition", object3D);
  console.log(1231, store.apiDatabase, object3D);
};

onMounted(() => {});
</script>
