<script setup>
import {ref, reactive, computed} from "vue";
import Layout from "../../../layouts/main.vue";
import http, {BASE_URL} from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import MenuBarContainSearch from "../../../components/manage-data/MenuBarContainSearch.vue";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import Spinner from "../../../components/Spinner.vue";

const notisData = ref([]);
const lstnotisData = ref({});
const memberListChoose = ref([]);
const searchUser = ref('');
const userData = ref({});
const baseURL = ref(BASE_URL);
const checkedMembers = ref([]);
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
const modalAddEdit = ref(false);
const modalDetail = ref(false);
const modalAddMember = ref(false);
const isUpdate = ref(false);
const items = reactive([
  {
    name: "Quản lý thông báo",
    to: "ManageNotificationPage",
  },
]);

const address = ref({
  title: "Thông báo",
  details: [],
});

const getData = async () => {
  const dept = await http.get(`/notification/?search=${option.searchVal}`);
  notisData.value = dept.data.results;
};
getData();

const getUser = async () => {
  const user = await http.get(`/user/?q=${searchUser.value}&type=search`);
  userData.value = user.data.results;
}
getUser();

const showAddEditModal = async (update, id, detail) => {
  update ? (isUpdate.value = true) : (isUpdate.value = false);
  lstnotisData.value = {};
  lstnotisData.value.type = 0;
  if (detail) modalDetail.value = !modalDetail.value;
  else modalAddEdit.value = !modalAddEdit.value;
  if (isUpdate.value || detail) {
    const dept = await http.get(`/notification/${id}`);
    lstnotisData.value = dept.data;
  }
};

const memberList = computed(() => {
  if (!searchUser.value) {
    return userData.value;
  }
  const lowerSearchValue = searchUser.value.toLowerCase();
  return userData.value.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    return fullName.includes(lowerSearchValue);
  });
});

const getListMember = () => {
  const checkedMemberIds = checkedMembers.value;
  memberListChoose.value = userData.value.filter((member) => checkedMemberIds.includes(member.id));
  modalAddMember.value = false;
}

const handleSubmit = async () => {
  loading.form = true;
  let item = new FormData(document.getElementById("manage-notis"));
  if (!isUpdate.value) {
    item.append('type', lstnotisData.value.type);
    let create;
    if (lstnotisData.value.type === 0)
      create = await http.post(`/notification/send-notification-to-users/`, item);
    else {
      const lstUser = [];
      memberListChoose.value.forEach((item) => lstUser.push(`"${item.id}"`));
      item.append('receivers', `[${lstUser}]`);
      create = await http.post(`/notification/`, item);
    }
    if (create.status === 201) {
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
    const update = await http.patch(`/notification/${lstnotisData.value.id}/`, item);
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

const sendToSubcriber = async (id) => {
  const update = await http.post(`/notification/${id}/send-email-to-subscriber/`);
  if (update.status === 200) {
    successToast("Đã gửi thông báo tới người đăng ký");
  } else {
    errorToast("Đã xảy ra lỗi, gửi thất bại");
  }
}

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
      const response = await http.delete(`/notification/${id}/`);
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
              @click="showAddEditModal(0, '')">
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
                v-model="option.searchVal" @keyup="getData()"
                placeholder="Tìm kiếm"
              />
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <Spinner :is-loading="loading.del"/>
        <div data-simplebar class="card-body__custom--scroll">
          <b-card-body
            class="card-body__custom--height"
            v-if="notisData.length"
          >
            <div class="table-responsive h-100">
              <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="5%">#</th>
                  <th width="25%">Tiêu đề</th>
                  <th>Nội dung</th>
                  <th width="12%">Phân loại</th>
                  <th width="12%">Ngày tạo</th>
                  <th width="3%"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in notisData" :key="index">
                  <td class="text-center">
                    {{ index + 1 + (option.currPage - 1) * 10 }}
                  </td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.content }}</td>
                  <td class="text-center">{{ item.type === 0 ? 'Thông báo hệ thống' : 'Thông báo cá nhân' }}</td>
                  <td class="text-center">{{ new Date(item.created_date).toLocaleDateString('en-GB') }}</td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false">
                        <i class="mdi mdi-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                          <b-link class="dropdown-item" @click="showAddEditModal(0,item.id,true)">
                            <i class="ri-eye-line align-bottom me-2 text-muted"></i>
                            Chi tiết
                          </b-link>
                        </li>
                        <li>
                          <b-link class="dropdown-item" @click="sendToSubcriber(item.id)">
                            <i class="ri-mail-send-line align-bottom me-2 text-muted"></i>
                            Gửi tới người đăng ký
                          </b-link>
                        </li>
                        <li>
                          <b-link class="dropdown-item" @click="showAddEditModal(1, item.id)">
                            <i class="ri-edit-2-line align-bottom me-2 text-muted"></i>
                            Sửa
                          </b-link>
                        </li>
                        <li>
                          <b-link class="dropdown-item" @click="deleteData(item.id)">
                            <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i> Xóa
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
      <b-modal
        v-model="modalAddEdit"
        hide-footer
        body-class="p-0"
        header-class="p-3"
        modal-class="zoomIn"
        class="v-modal-custom"
        content-class="overflow-hidden"
        centered
        :title="isUpdate ? `Cập nhật thông báo` : `Thêm mới thông báo`">
        <div class="modal-body">
          <form id="manage-notis">
            <div class="mb-3">
              <label for="basiInput" class="form-label">Tiêu đề</label>
              <input type="text" class="form-control" id="basiInput" name="title" v-model="lstnotisData.title">
            </div>
            <div class="mb-3">
              <label for="exampleFormControlTextarea5" class="form-label">Nội dung</label>
              <textarea class="form-control" name="content" id="exampleFormControlTextarea5" rows="5"
                        v-model="lstnotisData.content"></textarea>
            </div>
            <div class="mb-3" v-if="!isUpdate">
              <b-row class="g-4">
                <b-col lg="6" sm="6">
                  <div data-bs-toggle="collapse" data-bs-target="#notisCollapse.show" aria-expanded="false"
                       aria-controls="notisCollapse">
                    <div class="form-check card-radio">
                      <input id="notis01" type="radio" class="form-check-input" value="0"
                             :checked="lstnotisData.type === 0"
                             v-model="lstnotisData.type"/>
                      <label class="form-check-label" for="notis01">
                        <span class="text-muted me-2"><i class="mdi mdi-cog-outline text-muted align-bottom"></i></span>
                        <span class="text-wrap">Thông báo hệ thống</span>
                      </label>
                    </div>
                  </div>
                </b-col>
                <b-col lg="6" sm="6">
                  <div data-bs-toggle="collapse" data-bs-target="#notisCollapse" aria-expanded="true"
                       aria-controls="notisCollapse">
                    <div class="form-check card-radio">
                      <input id="notis02" type="radio" class="form-check-input" value="1"
                             v-model="lstnotisData.type" :checked="lstnotisData.type === 1"/>
                      <label class="form-check-label" for="notis02">
                        <span class="text-muted me-2"><i class="ri-user-2-line align-bottom"></i></span>
                        <span class="text-wrap">Thông báo cá nhân</span>
                      </label>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <div class="collapse" id="notisCollapse" :class="{'show' : lstnotisData.type === 1}">
                <label class="form-label mt-4">Chọn người dùng để gửi thông báo</label>
                <b-card no-body class="p-4 border shadow-none mb-0">
                  <b-row class="gy-2">
                    <b-col md="12">
                      <div class="avatar-group d-flex justify-content-center">
                        <b-link href="javascript: void(0);" v-for="person in memberListChoose" class="avatar-group-item"
                                v-b-tooltip.hover :title="`${person.first_name} ${person.last_name}`">
                          <div class="avatar-xs">
                            <img :src="person.photo ? person.photo : baseURL + `/media/photos/avatar-1.jpg`"
                                 alt="" class="rounded-circle img-fluid avatar-xs"/>
                          </div>
                        </b-link>
                        <div class="avatar-group-item" v-b-tooltip.hover title="Thêm người dùng">
                          <div class="avatar-xs" @click="modalAddMember = !modalAddMember">
                            <div class="avatar-title fs-16 rounded-circle bg-light border text-primary">+</div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                    <b-modal v-model="modalAddMember" hide-footer title="Chọn người dùng" class="v-modal-custom"
                             centered
                             modal-class="zoomIn">
                      <input type="text" class="form-control form-control border mb-2" v-model="searchUser"
                             placeholder="Tìm kiếm người dùng" @keyup="search"/>
                      <div data-simplebar style="height: 225px;">
                        <div class="list-group list-group-flush">
                          <label class="list-group-item d-flex align-items-center ps-0 cursor-pointer"
                                 v-for="member in memberList" :key="member.id">
                            <input class="form-check-input me-3" type="checkbox" :value="member.id"
                                   v-model="checkedMembers"/>
                            <div class="d-flex align-items-center">
                              <div class="flex-shrink-0">
                                <img alt class="avatar-xxs rounded-circle"
                                     :src="member.photo ? member.photo : baseURL + `/media/photos/avatar-1.jpg`"/>
                              </div>
                              <div class="flex-grow-1 ms-2">
                                {{ member.first_name }} {{ member.last_name }}
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div class="modal-footer v-modal-footer">
                        <b-button type="button" variant="success" @click="getListMember">Lưu</b-button>
                      </div>
                    </b-modal>
                  </b-row>
                </b-card>
              </div>
            </div>
            <div class="text-end">
              <b-button type="submit" variant="primary" @click.prevent="handleSubmit">Lưu</b-button>
            </div>
            <Spinner class="position-absolute" :is-loading="loading.form"/>
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
        title="Chi tiết thông báo">
        <div class="modal-body">
          <div class="mb-3">
            <label for="basiInput" class="form-label">Tiêu đề: <span class="fw-semibold">{{ lstnotisData.title }}</span></label>
          </div>
          <div class="mb-3">
            <label for="exampleFormControlTextarea5" class="form-label">Nội dung: </label>
            <p class="text-muted mb-1">{{ lstnotisData.content }}</p>
          </div>
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
