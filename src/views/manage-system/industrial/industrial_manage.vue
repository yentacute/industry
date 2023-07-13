<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { setDefaultApp } from "../../../router/admin.js";
import Layout from "../../../layouts/main.vue";
import http from "../../../helpers/api/axiosHttp";
import { BASE_URL } from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import MenuBarContainSearch from "../../../components/manage-data/MenuBarContainSearch.vue";
import { errorToast, successToast } from "../../../helpers/api/toastStyle";
import Spinner from "../../../components/Spinner.vue";

const router = useRouter();
const industrialData = ref([]);
const lstIndustrialData = ref({});
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
const modalAddEditKCN = ref(false);
const isUpdate = ref(false);
const items = reactive([
  {
    name: "Khu công nghiệp",
    to: "#",
  },
  {
    name: "Quản lý khu công nghiệp",
    to: "ManageIndustrialPage",
  },
]);

const address = ref({
  title: "Khu công nghiệp",
  details: [],
});

const getData = async () => {
  const dept = await http.get(`/industrial-area?name=${option.searchVal}`);
  industrialData.value = dept.data;
};
getData();

const showAddEditModal = async (update, id) => {
  update ? (isUpdate.value = true) : (isUpdate.value = false);
  lstIndustrialData.value = {};
  modalAddEditKCN.value = !modalAddEditKCN.value;
  if (isUpdate.value) {
    const dept = await http.get(`/industrial-area/${id}`);
    lstIndustrialData.value = dept.data;
  }
};

const handleSubmit = async () => {
  loading.form = true;
  let item = new FormData(document.getElementById("manage-industrial"));
  if (!isUpdate.value) {
    item.append("app_name", lstIndustrialData.value.name);
    item.append("type", 0);
    const create = await http.post(`/industrial-area`, item);
    if (create.status === 201) {
      setTimeout(async () => {
        const res = new FormData();
        res.append("app_id", create.data.id);
        res.append("type", 1);
        const migrate = await http.post(`/industrial-area`, res);
        if (migrate.status === 201) {
          const ROUTERNEW = setDefaultApp(migrate.data.slug);
          ROUTERNEW.forEach((item) => {
            router.addRoute(item);
          });
          successToast("Đã thêm mới khu công nghiệp");
          loading.form = false;
          modalAddEditKCN.value = false;
          getData();
        } else {
          errorToast("Đã xảy ra lỗi, thêm mới thất bại");
          loading.form = false;
          modalAddEditKCN.value = false;
        }
      }, 2500);
    } else {
      errorToast("Đã xảy ra lỗi, thêm mới thất bại");
      loading.form = false;
      modalAddEditKCN.value = false;
    }
  } else {
    const update = await http.patch(
      `/industrial-area/${lstIndustrialData.value.id}`,
      item
    );
    if (update.status === 202) {
      successToast("Đã cập nhật thành công");
      loading.form = false;
      modalAddEditKCN.value = false;
      getData();
    } else {
      errorToast("Đã xảy ra lỗi, cập nhật thất bại");
      loading.form = false;
      modalAddEditKCN.value = false;
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
      const response = await http.delete(`/industrial-area/${id}`);
      if (response.status === 202) {
        loading.del = false;
        Swal.fire({
          title: "Đã xoá khu công nghiệp!",
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

const onFileChange = (e) => {
  const file = e.target.files[0];
  document.getElementById("img--file__output").src = URL.createObjectURL(file);
};
</script>
<template>
  <Layout
    :items="items"
    :address="address"
    chooseMenu="he-thong"
    systemMenu
  >
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
          <b-col xl="2"></b-col>
          <b-col xl="2"></b-col>
          <b-col xl="3">
            <div class="search-box">
              <input
                type="text"
                class="form-control search w-100"
                v-model="option.searchVal"
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
            v-if="industrialData.length"
          >
            <div class="table-responsive">
              <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                  <tr>
                    <th width="5%">#</th>
                    <th>Tên khu công nghiệp</th>
                    <th>Địa chỉ</th>
                    <th>Điện thoại</th>
                    <th>Đơn vị phụ trách</th>
                    <th width="10%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in industrialData" :key="index">
                    <td class="text-center">
                      {{ index + 1 + (option.currPage - 1) * 10 }}
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.address }}</td>
                    <td class="text-center">{{ item.phone }}</td>
                    <td class="text-center">{{ item.curator }}</td>
                    <td>
                      <ul
                        class="list-inline hstack gap-3 mb-0 d-flex justify-content-center"
                      >
                        <li class="list-inline-item">
                          <b-link
                            class="link-info fs-15"
                            v-b-tooltip.hover
                            title="Xem chi tiết"
                          >
                            <i class="ri-eye-line"></i>
                          </b-link>
                        </li>
                        <li class="list-inline-item">
                          <b-link
                            class="link-success fs-15"
                            v-b-tooltip.hover
                            title="Cập nhật"
                            @click="showAddEditModal(1, item.id)"
                          >
                            <i class="ri-edit-2-line"></i>
                          </b-link>
                        </li>

                        <li class="list-inline-item">
                          <b-link
                            class="link-danger fs-15"
                            @click="deleteData(item.id)"
                            v-b-tooltip.hover
                            title="Xóa"
                          >
                            <i class="ri-delete-bin-line"></i>
                          </b-link>
                        </li>
                      </ul>
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
      <b-modal
        v-model="modalAddEditKCN"
        hide-footer
        body-class="p-0"
        header-class="p-3"
        modal-class="zoomIn"
        class="v-modal-custom"
        content-class="overflow-hidden"
        centered
        size="lg"
        :title="
          isUpdate
            ? `Cập nhật thông tin khu công nghiệp`
            : `Thêm mới khu công nghiệp`
        "
      >
        <div class="modal-body">
          <form id="manage-industrial">
            <div class="d-flex gap-3 mb-2" id="flex--image__input">
              <div class="flex-shrink-0">
                <div
                  class="profile-user position-relative d-inline-block mx-auto"
                >
                  <img
                    :src="
                      lstIndustrialData.photo
                        ? lstIndustrialData.photo
                        : `/img/img-1.0763e22f.jpg`
                    "
                    class="avatar-xl img-thumbnail user-profile-image"
                    id="img--file__output"
                    alt="user-profile-image"
                  />
                  <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                    <input
                      id="img-file-input"
                      name="photo"
                      type="file"
                      @change="onFileChange"
                      class="profile-img-file-input"
                    />
                    <label
                      for="img-file-input"
                      class="profile-photo-edit avatar-xxs"
                    >
                      <span
                        class="avatar-title rounded-circle bg-light text-body"
                      >
                        <i class="ri-camera-fill"></i>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="mb-3">
                  <label for="industrialName" class="form-label mb-1">
                    Tên khu công nghiệp
                    <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="industrialName"
                    v-model="lstIndustrialData.name"
                    name="name"
                    placeholder="Nhập tên khu công nghiệp"
                  />
                </div>
                <div class="mb-3">
                  <label for="phoneInput" class="form-label mb-1"
                    >Điện thoại <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="phoneInput"
                    v-model="lstIndustrialData.phone"
                    name="phone"
                    placeholder="Nhập số điện thoại khu công nghiệp"
                  />
                </div>
                <div>
                  <label for="qlIndusName" class="form-label mb-1">
                    Đơn vị phụ trách <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="qlIndusName"
                    v-model="lstIndustrialData.curator"
                    name="curator"
                    placeholder="Nhập tên khu công nghiệp"
                  />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="addressInput" class="form-label mb-1">Địa chỉ</label>
              <input
                type="text"
                class="form-control"
                id="addressInput"
                v-model="lstIndustrialData.address"
                name="address"
                placeholder="Nhập địa chỉ khu công nghiệp"
              />
            </div>
            <div class="mb-3">
              <label class="form-label mb-1">Mô tả</label>
              <textarea
                class="form-control"
                name="description"
                rows="3"
                v-model="lstIndustrialData.description"
              ></textarea>
            </div>
            <div class="text-end">
              <b-button
                type="submit"
                variant="primary"
                @click.prevent="handleSubmit"
                >Lưu</b-button
              >
            </div>
            <Spinner class="position-absolute" :is-loading="loading.form" />
          </form>
        </div>
      </b-modal>
    </div>
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
