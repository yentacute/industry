<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {useRoute, useRouter} from 'vue-router';
import {successToast, errorToast} from "../../../helpers/api/toastStyle";

let isUpdate = false;
const route = useRoute();
const router = useRouter();
const policyData = ref([]);
const policyDataChoosed = ref([]);
const policyDetail = ref({});
const permissionData = ref({});
const isAddRole = ref(true);
const idRole = ref('');
const listRole = reactive({
  post: [],
  UI: []
});
const modalAddUpdt = ref(false)
const itemPermissions = ref([]);

if (route.params.id) isUpdate = true;
const items = reactive([
  {
    name: 'Người dùng',
    to: '#'
  },
  {
    name: "Quản lý phân quyền",
    to: "ManageRolePage",
  },
  {
    name: isUpdate ? 'Cập nhật' : 'Thêm mới',
    to: '#'
  },
]);

const address = ref({
  title: 'Người dùng',
  details: [],
});

const getData = async () => {
  const permissions = await http.get(`/permissions`);
  listRole.UI = permissions.data.result;
  for (let index = 0; index < listRole.UI.length; index++) {
    const element = listRole.UI[index];
    const elementPermission = element.permissions;
    if (elementPermission.every(r => listRole.post.includes(r.id))) {
      itemPermissions.value.push(element.id)
    }

  }
}
getData();
const checkAll = (items, event) => {
  if (event.target.checked) {
    for (let i = 0; i < items.length; i++) {
      listRole.post.push(items[i].id);
    }
  } else {
    for (let i = 0; i < items.length; i++) {
      listRole.post.splice(listRole.post.indexOf(items[i].id), 1);
    }
  }
};

const toggleShow = (event) => {
  event.currentTarget.nextElementSibling.classList.toggle('show')
}

const changeItem = (id, arr1, arr2) => {
  const index = arr1.findIndex((element) => element.id === id);
  const elementToUpdate = arr1[index];
  arr1.splice(index, 1);
  arr2.push(elementToUpdate);
};

const getPolicy = async () => {
  const policy = await http.get(`/policy/`);
  policyData.value = policy.data.results;
  if (isUpdate) {
    const role = await http.get(`/role/${route.params.id}`);
    permissionData.value = role.data;
    permissionData.value.policies.forEach((item) => {
      changeItem(item.id, policyData.value, policyDataChoosed.value)
    })
  }
}
getPolicy();

const getDetailPolicy = async (id) => {
  const {data} = await http.get(`/policy/${id}/`);
  policyDetail.value = data;
}

const handleAddUpdt = (item) => {
  modalAddUpdt.value = true;
  idRole.value = item;
}

const handleSubmit = async () => {
  const form = new FormData();
  form.append('name', permissionData.value.name);
  form.append('policies', JSON.stringify(policyDataChoosed.value));
  if (isUpdate) {
    const updateData = await http.put(`/role/${route.params.id}/`, form);
    if (updateData.status === 200)
      successToast('Đã cập nhật thành công');
    else errorToast('Cập nhật thất bại');
  } else {
    const createData = await http.post(`/role/`, form);
    if (createData.status === 201)
      successToast('Đã thêm mới thành công');
    else errorToast('Thêm mới thất bại');
  }
}

</script>

<template>
  <Layout :items="items" :address="address" chooseMenu="nguoi-dung" systemMenu>
    <div class="page-main__content" ref="containerContent">
      <form>
        <b-card no-body class="mb-2">
          <b-card-header class="d-flex">
            <h5 class="card-title flex-grow-1">{{ isUpdate ? 'Cập nhật phân quyền' : 'Thêm mới phân quyền' }}</h5>
            <router-link :to="{name: 'ManageRolePage'}" type="button" v-b-tooltip.hover title="Đóng"
                         class="flex-shrink-0 btn btn-ghost-primary btn-close flex-shrink-0"></router-link>
          </b-card-header>
          <b-card-body style="height: calc(100vh - 240px)">
            <b-row class="g-4">
              <b-col lg="6" class="border-end" id="role--left__content">
                <div class="mb-3">
                  <label for="fnameInput" class="form-label mb-1">Tên phân quyền <span
                      class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="fnameInput" placeholder="Nhập tên phân quyền"
                         v-model="permissionData.name"
                         name="first_name">
                </div>
                <div class="mb-3">
                  <label for="lnameInput" class="form-label mb-1">Mã phân quyền</label>
                  <input type="text" class="form-control bg-light" id="lnameInput" readonly
                         v-model="permissionData.slug"
                         placeholder="Mã phân quyền sẽ được hệ thống tự khởi tạo" name="first_name">
                </div>
                <div class="mb-3">
                  <label class="form-label mb-1">Mô tả</label>
                  <textarea class="form-control" id="introInput" rows="4" v-model="permissionData.description"
                            name="introduce" placeholder="Nhập thông tin mô tả"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label mb-1">Chức năng đã chọn</label>
                  <b-card no-body class="shadow-none border card-border-info">
                    <div data-simplebar style="height: 275px">
                      <b-card-body class="px-2" v-if="policyDataChoosed.length > 0">
                        <div class="list-group list-group-flush">
                          <div
                              class="list-group-item list-group-item-action d-flex justify-content-between cursor-pointer"
                              v-for="polic in policyDataChoosed">
                            <div class="flex-lg-shrink-1 d-flex align-items-center">
                              <i class="ri-indeterminate-circle-fill text-danger me-3 align-bottom fs-16"
                                 @click="changeItem(polic.id,policyDataChoosed,policyData)">
                              </i>
                              <span class="mb-0">{{ polic.name }}</span>
                            </div>
                            <div class="flex-grow-0">
                              <ul class="list-inline hstack gap-3 mb-0 d-flex justify-content-center">
                                <li class="list-inline-item">
                                  <div class="link-info fs-15" v-b-tooltip.hover
                                       title="Xem chi tiết">
                                    <i class="ri-eye-line"></i></div>
                                </li>
                                <li class="list-inline-item">
                                  <div class="link-success fs-15 cursor-pointer" v-b-tooltip.hover title="Cập nhật"
                                       @click="handleAddUpdt(polic.id)">
                                    <i class="ri-edit-2-line"></i></div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </b-card-body>
                      <b-card-body class="px-2" v-else>
                        <p class="text-muted mb-0">Chưa có chức năng nào được chọn</p>
                      </b-card-body>
                    </div>
                  </b-card>
                </div>
              </b-col>
              <b-col lg="6">
                <h6 class="fs-14">Danh sách chức năng</h6>
                <div class="px-2">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item list-group-item-action d-flex justify-content-between cursor-pointer"
                         v-for="policy in policyData">
                      <div class="flex-lg-shrink-1 d-flex align-items-center">
                        <i class="ri-add-circle-fill text-primary me-3 align-bottom fs-16"
                           @click="changeItem(policy.id,policyData,policyDataChoosed)"></i>
                        <span class="mb-0">{{ policy.name }}</span>
                      </div>
                      <div class="flex-grow-0">
                        <ul class="list-inline hstack gap-3 mb-0 d-flex justify-content-center">
                          <li class="list-inline-item">
                            <div class="link-info fs-15" v-b-tooltip.hover
                                 title="Xem chi tiết">
                              <i class="ri-eye-line"></i></div>
                          </li>
                          <li class="list-inline-item">
                            <div class="link-success fs-15 cursor-pointer" v-b-tooltip.hover title="Cập nhật"
                                 @click="handleAddUpdt(policy.id)">
                              <i class="ri-edit-2-line"></i></div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="list-group-item list-group-item-action fw-semibold text-info cursor-pointer"
                         @click="handleAddUpdt">
                      <i class="mdi mdi-plus "></i> Thêm chức năng
                    </div>
                  </div>

                  <b-modal v-model="modalAddUpdt" hide-footer body-class="p-0" header-class="p-3"
                           modal-class="zoomIn" class="v-modal-custom" content-class="overflow-hidden" centered
                           size="lg" title="Thêm quyền">
                    <div data-simplebar style="max-height: 275px">
                      <div class="role-group">
                        <ul class="list-group list-group-flush border-dashed">
                          <li v-for="item in listRole.UI" :key="item.id" class="list-group-item">
                            <div class="accordion" :id="`default-accordion-example-` + item.id">
                              <div class="accordion-item">
                                <h2 class="accordion-header" :id="`heading-` + item.id" @click="toggleShow($event)">
                                  <div class="flex-grow-1 permission__folder accordion-button collapsed"
                                       :data-bs-toggle="`collapse-` + item.id"
                                       :data-bs-target="`#collapseOne-` + item.id"
                                       aria-expanded="false" :aria-controls="`collapseOne-` + item.id">
                                    <i class="ri-folder-2-fill align-bottom text-warning fs-16"></i>
                                    <label :for="'toggle-'+item.id" class="form-check-label fw-normal mb-0 ps-2"
                                           v-html="item.title">
                                    </label>
                                  </div>
                                </h2>
                                <div :id="`#collapseOne-` + item.id" class="accordion-collapse collapse"
                                     :aria-labelledby="`heading-` + item.id"
                                     :data-bs-parent="`#default-accordion-example-` + item.id">
                                  <div class="accordion-body">
                                    <div class="form-check form-check-outline form-check-warning mb-3">
                                      <input v-if="itemPermissions.includes(item.id) " class="form-check-input"
                                             type="checkbox" @click="checkAll(item.permissions, $event)" checked>
                                      <input v-else class="form-check-input" type="checkbox"
                                             @click="checkAll(item.permissions, $event)">
                                      <label class="form-check-label">
                                        Chọn tất cả
                                      </label>
                                    </div>
                                    <div class="form-check form-check-outline form-check-warning mb-3"
                                         v-for="item_check in item.permissions">
                                      <input class="form-check-input" type="checkbox" :value="item_check.id"
                                             :id="item_check.id" v-model="listRole.post">
                                      <label class="form-check-label" :for="item_check.id" v-html="item_check.name">
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </b-modal>
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
    </div>
  </Layout>
</template>

<style scoped>
@media (max-width: 991px) {
  #role--left__content {
    border: none !important;
  }
}
</style>