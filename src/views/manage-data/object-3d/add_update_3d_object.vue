<script>
import {reactive, ref} from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../../app.config";
import http from "../../../helpers/api/axiosHttp";
import {useRoute, useRouter} from 'vue-router';
import {errorToast, successToast} from "../../../helpers/api/toastStyle";

export default {
  setup() {
    const objectData = ref({});
    const isUpdate = ref(false);
    const route = useRoute();
    const router = useRouter();
    if (route.params.id) isUpdate.value = true;
    const address = ref({
      title: 'Đối tượng 3D',
      details: [{name: "Quản lý đối tượng 3D", to: `#`}, {name: isUpdate.value ? "Cập nhật" : "Thêm mới", to: "#"}],
    });
    if (isUpdate.value) {
      const getDetail = async () => {
        const item = await http.get(`/object3d/${route.params.id}/`);
        objectData.value = item.data;
        console.log(objectData.value.iframe);
      }
      getDetail();
    }
    const handleSubmit = async () => {
      const textureElement = document.getElementById("formFile-img");
      const objElement = document.getElementById("formFile-geojson");
      let item = new FormData(document.getElementById("object-manage"));
      if (textureElement.files.length > 0)
        item.append("texture", textureElement.files[0]);
      if (objElement.files.length > 0)
        item.append("obj", objElement.files[0]);
        item.append('type', 2);
        item.append('is_sync', false);
        item.append('description', objectData.value.description);
        item.append('iframe', objectData.value.iframe);
      if (!isUpdate.value) {
        const response = await http.post(`/object3d/`, item);
        if (response.status === 201) {
          successToast("Đã thêm mới thành công!");
          router.push({name: `ManageObjectPage`});
        } else {
          errorToast("Thêm mới thất bại!")
        }
      } else {
        const response = await http.patch(`/object3d/${route.params.id}/`, item);
        if (response.status === 200) {
          successToast("Đã cập nhật thành công!");
        } else {
          errorToast("Cập nhật thất bại!")
        }
      }
    }

    const onFileChange = (e) => {
      const file = e.target.files[0];
      document.getElementById('img--file__output').src = URL.createObjectURL(file);
    }
    return {
      objectData, isUpdate, route, router, address, handleSubmit, onFileChange
    };
  },
  data() {
    return {
      editor: ClassicEditor,
    };
  },
  components: {
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
  },
};
</script>

<template>
  <Layout :address="address" :items="address.details" chooseMenu="doi-tuong-3d">
    <b-row>
      <b-col lg="12">
        <form id="object-manage">
          <b-card no-body>
            <b-card-header class="d-flex">
              <h5 class="card-title flex-grow-1">{{ isUpdate ? 'Cập nhật đối tượng 3D' : 'Thêm mới đối tượng 3D' }}</h5>
              <router-link :to="{name: `ManageObjectPage` }" type="button" v-b-tooltip.hover title="Đóng"
                           class="flex-shrink-0 btn btn-ghost-primary btn-close flex-shrink-0"></router-link>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col xl="6">
                  <div class="mb-3">
                    <label for="industrialName" class="form-label mb-1">
                      Tên đối tượng <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="industrialName" name="name"
                           v-model="objectData.name" placeholder="Nhập tên đối tượng">
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1">Mô tả ngắn</label>
                    <textarea class="form-control" name="description_short" rows="5"
                              v-model="objectData.description_short"></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1">Iframe</label>
                    <textarea class="form-control" name="iframe" rows="5"
                              v-model="objectData.iframe"></textarea>
                  </div>
                  <label class="form-label mb-1">Mô tả đối tượng</label>
                  <div class="ckeditor-classic">
                    <ckeditor v-model="objectData.description" :editor="editor"></ckeditor>
                  </div>
                </b-col>
                <b-col xl="6">
                  <ul class="nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3" role="tablist">
                    <li class="nav-item">
                      <b-link class="nav-link text-start fw-semibold active" data-bs-toggle="tab" href="#profile1"
                              role="tab">
                        <i class="ri-file-add-fill"></i>
                        <span class="d-none d-md-inline-block mx-1">Tải đối tượng mới</span>
                      </b-link>
                    </li>
                  </ul>
                  <div class="tab-content text-muted mb-3">
                    <div class="tab-pane active" id="profile1" role="tabpanel">
                      <div class="mb-3">
                        <label for="formFile-img" class="form-label">
                          Dữ liệu đối tượng file img <span class="text-danger">*</span>
                        </label>
                        <input type="file" id="formFile-img" accept=".jpg, .png"
                               class="form-control">
                      </div> <!---->
                      <div class="mb-3">
                        <label for="formFile-geojson" class="form-label">
                          Dữ liệu đối tượng file Object
                          <span class="text-danger">*</span>
                        </label>
                        <input type="file" id="formFile-geojson" class="form-control">
                      </div> <!---->
                      <button class="btn btn-primary mb-3">Xem trước</button>
                      <!-- <b-row class="mb-3">
                        <b-col md-6>
                          <label class="form-label mb-1">Vĩ độ</label>
                          <div class="w-100 position-relative">
                            <input type="number" step="0.000001" required="required" class="form-control"/>
                          </div>
                        </b-col>
                        <b-col md="6">
                          <label class="form-label mb-1">Kinh độ</label>
                          <div class="w-100 position-relative">
                            <input type="number" step="0.000001" required="required" class="form-control"/>
                          </div>
                        </b-col>
                        <b-col md="6" class="mt-3">
                          <label class="form-label mb-1">Nghiêng</label>
                          <div class="w-100 position-relative">
                            <input type="number" min="0" step="0.01" class="form-control"/>
                          </div>
                        </b-col>
                        <b-col md="6" class="mt-3">
                          <label class="form-label mb-1">Scale</label>
                          <div class="w-100 position-relative">
                            <input type="number" min="0" step="0.001" id="" class="form-control"/>
                          </div>
                        </b-col>
                      </b-row> -->
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-body>
            <b-card-footer>
              <div class="hstack gap-2">
                <b-button variant="danger" type="reset">Hủy</b-button>
                <b-button variant="success" type="submit" @click.prevent="handleSubmit">Lưu</b-button>
              </div>
            </b-card-footer>
          </b-card>
        </form>
      </b-col>
    </b-row>
  </Layout>
</template>
<style scoped>
#img--file__output {
  width: 15rem;
  height: 13rem;
}

#flex--image__input {
  align-items: end;
}

@media (max-width: 991px) {
  #flex--image__input {
    align-items: center;
    flex-direction: column;
  }

  #flex--image__input .flex-grow-1 {
    width: 100%;
  }
}
</style>
