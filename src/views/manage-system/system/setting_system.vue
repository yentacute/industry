<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {successToast, errorToast} from "../../../helpers/api/toastStyle";

const systemData = ref({});
const isActiveEmail = ref(false);
const isShowPass = ref(false)
const items = reactive([
  {
    name: "Hệ thống",
    to: "#",
  },
  {
    name: "Cấu hình hệ thống",
    to: "#",
  },
]);

const address = ref({
  title: 'Hệ thống',
  details: [],
});

const getDetail = async () => {
  const {data} = await http.get(`/config/system/`);
  systemData.value = data.system_config;
  if (systemData.value.is_active_email === 1) isActiveEmail.value = true;
}
getDetail();

const handleSubmit = async () => {
  const object = `{
        "fax": "${systemData.value.fax}",
        "system_email": "${systemData.value.system_email}",
        "system_email_password": "${systemData.value.system_email_password}",
        "is_active_email": ${isActiveEmail.value ? 1 : 0},
        "donvi": "${systemData.value.donvi}",
        "phone": "${systemData.value.phone}",
        "address": "${systemData.value.address}",
        "system_name": "${systemData.value.system_name.toUpperCase()}"
    }`;

  let form = new FormData();
  form.append('system_config', object);
  const update = await http.post(`/config/system/`, form);
  if (update.status === 201)
    successToast("Đã cập nhật thành công");
  else errorToast('Đã xảy ra lỗi cập nhật thất bại');
}
</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="he-thong" systemMenu>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <form>
          <div data-simplebar class="card-body__custom--scroll">
            <b-card-body>
              <b-card no-body class="shadow-none mb-4">
                <div class="p-2">
                  <b-card-header class="p-2">
                    <h5 class="card-title text-info mb-0">Thiết lập hệ thống</h5>
                  </b-card-header>
                  <b-card-body>
                    <b-row class="g-3">
                      <b-col lg="12">
                        <label for="systemNameInput" class="form-label">Tên hệ thống</label>
                        <input type="text" class="form-control" id="systemNameInput" v-model="systemData.system_name">
                      </b-col>
                      <b-col lg="6">
                        <label for="systemEmailInput" class="form-label">Email hệ thống</label>
                        <input type="text" class="form-control" id="systemEmailInput" v-model="systemData.system_email">
                        <div class="form-check form-switch form-switch-info mt-2 mx-1">
                          <input class="form-check-input" type="checkbox" role="switch" id="switchEmail"
                                 v-model="isActiveEmail">
                          <label class="form-check-label text-muted" for="switchEmail">Cho phép thông báo</label>
                        </div>
                      </b-col>
                      <b-col lg="6">
                        <div class="mb-3">
                          <label class="form-label" for="password-input">Mật khẩu email hệ thống</label>
                          <div class="position-relative auth-pass-inputgroup mb-3">
                            <input :type="isShowPass ? 'text' : 'password'" class="form-control pe-5"
                                   v-model="systemData.system_email_password"
                                   placeholder="Nhập mật khẩu email hệ thống" id="password-input">
                            <button @click="isShowPass = !isShowPass"
                              class="btn btn-link btn-md position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button" id="password-addon">
                              <div class="btn-content"><i class="ri-eye-fill align-middle"></i></div>
                            </button>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                  </b-card-body>
                </div>
              </b-card>


              <b-card no-body class="shadow-none mb-4">
                <div class="p-2">
                  <b-card-header class="p-2">
                    <h5 class="card-title text-info mb-0">Thông tin liên hệ</h5>
                  </b-card-header>
                  <b-card-body>
                    <b-row class="g-3">
                      <b-col lg="6">
                        <label for="dviInput" class="form-label">Đơn vị chủ quản</label>
                        <input type="text" class="form-control" id="dviInput" v-model="systemData.donvi">
                      </b-col>
                      <b-col lg="6">
                        <label for="addressInput" class="form-label">Địa chỉ</label>
                        <input type="text" class="form-control" id="addressInput" v-model="systemData.address">
                      </b-col>
                      <b-col lg="6">
                        <label for="phoneInput" class="form-label">Điện thoại</label>
                        <input type="text" class="form-control" id="phoneInput" v-model="systemData.phone">
                      </b-col>
                      <b-col lg="6">
                        <label for="faxInput" class="form-label">Fax</label>
                        <input type="text" class="form-control" id="faxInput" v-model="systemData.fax">
                      </b-col>
                    </b-row>
                  </b-card-body>
                </div>
              </b-card>
            </b-card-body>
          </div>
          <b-card-footer>
            <div class="hstack gap-2">
              <b-button variant="danger" type="reset">Hủy</b-button>
              <b-button variant="success" type="submit" @click.prevent="handleSubmit">Lưu</b-button>
            </div>
          </b-card-footer>
        </form>
      </b-card>
    </div>
  </Layout>
</template>
<style scoped>
.card-body__custom--scroll {
  height: calc(100vh - 180px);
}
</style>