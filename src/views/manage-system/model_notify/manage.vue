<script setup>
import { ref, reactive } from "vue";
import Layout from "../../../layouts/main.vue";
import http from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import { errorToast, successToast } from "../../../helpers/api/toastStyle";
import Spinner from "../../../components/Spinner.vue";
import flatPickr from "vue-flatpickr-component";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const notisData = ref([]);
const lstnotisData = ref({});
const editorCustom = reactive({
  editor: ClassicEditor,
});
const ckeditor = CKEditor.component;
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  searchVal: "",
});
const loading = reactive({
  form: false,
  del: false,
});
const birthConfig = reactive({
  altFormat: "d/m/Y",
  altInput: true,
  dateFormat: "d/m/Y",
});
const dateFilter = reactive({
  start: "",
  end: "",
});
const modalAddEdit = ref(false);
const modalDetail = ref(false);
const isUpdate = ref(false);
const items = reactive([
  {
    name: "Quản lý mẫu thông báo",
    to: "ManageModelNotificationPage",
  },
]);

const address = ref({
  title: "Mẫu thông báo",
  details: [],
});

const getData = async () => {
  let urlAPI = `/mail-model/?q=${option.searchVal}`;
  if (dateFilter.start) urlAPI += `&start_date=${dateFilter.start}`;
  if (dateFilter.end) urlAPI += `&end_date=${dateFilter.end}`;
  const dept = await http.get(urlAPI);
  notisData.value = dept.data;
};
getData();

const showAddEditModal = async (update, id, detail) => {
  // imputFile.value.value = null;
  update ? (isUpdate.value = true) : (isUpdate.value = false);
  lstnotisData.value = {};
  if (detail) modalDetail.value = !modalDetail.value;
  else modalAddEdit.value = !modalAddEdit.value;
  if (isUpdate.value || detail) {
    const dept = await http.get(`/mail-model/${id}`);
    lstnotisData.value = dept.data;
  }
};

const manageNotis = ref(null);
const handleSubmit = async () => {
  loading.form = true;
  let item = new FormData(manageNotis.value);
  item.append("body", lstnotisData.value.body);
  item.append("title", lstnotisData.value.title);
  if (!isUpdate.value) {
    const create = await http.post(`/mail-model/`, item);
    if (create.data?.id) {
      successToast("Đã thêm mới thành công");
      loading.form = false;
      modalAddEdit.value = false;
      getData();
    } else {
      errorToast("Đã xảy ra lỗi, thêm mới thất bại");
      loading.form = false;
      modalAddEdit.value = false;
    }
  } else {
    const update = await http.patch(
      `/mail-model/${lstnotisData.value.id}/`,
      item
    );
    if (update.status === 200) {
      successToast("Đã cập nhật thành công");
      loading.form = false;
      modalAddEdit.value = false;
      getData();
    } else {
      errorToast("Đã xảy ra lỗi, cập nhật thất bại");
      loading.form = false;
      modalAddEdit.value = false;
    }
  }
};

function deleteData(id) {
  Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Không",
    confirmButtonText: "Đồng ý",
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading.del = true;
      const response = await http.delete(`/mail-model/${id}/`);
      if (response.status === 200) {
        loading.del = false;
        Swal.fire({
          title: "Đã xoá thông báo!",
          icon: "success",
        });
        getData();
      } else {
        loading.del = false;
        Swal.fire({
          title: "Lỗi kiểm tra lại !",
          icon: "error",
        });
      }
    }
  });
}

const setDefaultTemplate = async (id) => {
  const setDefault = await http.post(`/mail-model/${id}/mark-as-template/`);
  if (setDefault.status === 200) {
    getData();
    successToast(`Đã thay đổi mẫu thông báo mặc định`);
  } else errorToast(`Thay đổi thất bại`);
};
</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="thong-bao" systemMenu>
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <router-link
              type="button"
              class="btn btn-light"
              to="#"
              @click="showAddEditModal(0, '')"
            >
              <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
            </router-link>
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="3"></b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <flatPickr
              :config="birthConfig"
              v-model="dateFilter.start"
              placeholder="Từ ngày"
              @on-change="getData"
              class="form-control flatpickr-input"
            />
          </b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <flatPickr
              :config="birthConfig"
              v-model="dateFilter.end"
              placeholder="Đến ngày"
              @on-change="getData"
              class="form-control flatpickr-input"
            />
          </b-col>
          <b-col xl="3">
            <div class="search-box">
              <input
                type="text"
                class="form-control search w-100"
                v-model="option.searchVal"
                @keyup="getData()"
                placeholder="Tìm kiếm"
              />
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>
      <!--      <MenuBarContainSearch>
              <template #input_search>
                <b-col sm>
                  <div class="d-flex justify-content-end">
                    <div class="search-box">
                      <input type="text" class="form-control search" placeholder="Tìm kiếm"/>
                      <i class="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </b-col>
              </template>
            </MenuBarContainSearch>-->
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <Spinner :is-loading="loading.del" />
        <div data-simplebar class="card-body__custom--scroll">
          <b-card-body
            class="card-body__custom--height"
            v-if="notisData?.length"
          >
            <div class="table-responsive h-100">
              <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                  <tr>
                    <th width="3%">#</th>
                    <th width="30%">Tên mẫu thông báo</th>
                    <th>Tiêu đề thư</th>
                    <th width="10%">Mẫu mặc định</th>
                    <th width="10%">Ngày khởi tạo</th>
                    <th width="3%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in notisData" :key="index">
                    <td class="text-center">
                      {{ index + 1 + (option.currPage - 1) * 10 }}
                    </td>
                    <td>{{ item.name_template }}</td>
                    <td v-html="item.title"></td>
                    <td class="text-center">
                      <span
                        v-if="item.is_default_template"
                        class="badge text-uppercase w-badge badge-soft-success"
                        >Mặc định</span
                      >
                    </td>
                    <td class="text-center">
                      {{
                        new Date(item.created_date).toLocaleDateString("en-GB")
                      }}
                    </td>
                    <td>
                      <div class="dropdown">
                        <button
                          class="btn btn-soft-secondary btn-sm dropdown"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i class="mdi mdi-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li>
                            <b-link
                              class="dropdown-item"
                              @click="showAddEditModal(0, item.id, true)"
                            >
                              <i
                                class="ri-eye-line align-bottom me-2 text-muted"
                              ></i>
                              Chi tiết
                            </b-link>
                          </li>
                          <li v-if="!item.is_default_template">
                            <b-link
                              class="dropdown-item"
                              @click="setDefaultTemplate(item.id)"
                            >
                              <i
                                class="ri-honour-line align-bottom me-2 text-muted"
                              ></i>
                              Đặt mẫu mặc định
                            </b-link>
                          </li>
                          <li>
                            <b-link
                              class="dropdown-item"
                              @click="showAddEditModal(1, item.id)"
                            >
                              <i
                                class="ri-edit-2-line align-bottom me-2 text-muted"
                              ></i>
                              Sửa
                            </b-link>
                          </li>
                          <li>
                            <b-link
                              class="dropdown-item"
                              @click="deleteData(item.id)"
                            >
                              <i
                                class="ri-delete-bin-line align-bottom me-2 text-muted"
                              ></i>
                              Xóa
                            </b-link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-card-body>
          <b-card-body class="card-body__custom--height" v-else>
            <p>Không có dữ liệu!</p>
          </b-card-body>
        </div>
        <b-card-footer class="pt-0 border-0">
          <div class="d-flex justify-content-end">
            <ul class="pagination pagination-sm pagination-separated">
              <li class="page-item disabled">
                <b-link href="#" class="page-link">Trước</b-link>
              </li>
              <li class="page-item active">
                <b-link href="#" class="page-link">1</b-link>
              </li>
              <li class="page-item">
                <b-link href="#" class="page-link">Sau</b-link>
              </li>
            </ul>
          </div>
        </b-card-footer>
      </b-card>
    </div>
    <b-modal
      v-model="modalAddEdit"
      hide-footer
      body-class="p-0"
      header-class="p-3"
      modal-class="zoomIn"
      class="v-modal-custom"
      content-class="overflow-hidden"
      centered
      :title="isUpdate ? `Cập nhật thông báo` : `Thêm mới thông báo`"
    >
      <div class="modal-body">
        <form ref="manageNotis">
          <div class="mb-3">
            <label for="basiInput" class="form-label">Tên mẫu thông báo</label>
            <input
              type="text"
              class="form-control"
              name="name_template"
              v-model="lstnotisData.name_template"
            />
          </div>
          <div class="mb-3">
            <label for="basiInput" class="form-label">Tiêu đề thư</label>
            <div class="ckeditor-classic">
              <ckeditor
                v-model="lstnotisData.title"
                :editor="editorCustom.editor"
              ></ckeditor>
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleFormControlTextarea5" class="form-label"
              >Nội dung</label
            >
            <div class="ckeditor-classic">
              <ckeditor
                v-model="lstnotisData.body"
                :editor="editorCustom.editor"
              ></ckeditor>
            </div>
          </div>
          <!--            <div class="mb-3">
                          <label for="exampleFormControlTextarea5" class="form-label"
                            >Tệp đính kèm</label
                          >
                          <input
                            type="file"
                            ref="imputFile"
                            name="file_attachment"
                            class="form-control"
                          />
                        </div>-->
          <div class="text-end">
            <b-button
              type="submit"
              variant="primary"
              @click.prevent="handleSubmit"
              >Lưu
            </b-button>
          </div>
          <Spinner class="position-absolute" :is-loading="loading.form" />
        </form>
      </div>
    </b-modal>
    <b-modal
      v-model="modalDetail"
      hide-footer
      body-class="p-0"
      header-class="p-3"
      modal-class="zoomIn"
      class="v-modal-custom"
      content-class="overflow-hidden"
      centered
      title="Chi tiết thông báo"
    >
      <div class="modal-body">
        <div class="mb-3">
          <label for="basiInput" class="form-label"
            >Tên mẫu thông báo:
            <span class="fw-semibold">{{
              lstnotisData.name_template
            }}</span></label
          >
        </div>
        <div class="mb-3">
          <label class="form-label">Tiêu đề thư:</label>
          <div v-html="lstnotisData.title"></div>
        </div>
        <div class="mb-3">
          <label class="form-label">Nội dung: </label>
          <div v-html="lstnotisData.body"></div>
        </div>
      </div>
    </b-modal>
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
