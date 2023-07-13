<script setup>
import { ref, defineProps, reactive } from "vue";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";
import { errorToast, successToast } from "../../../helpers/api/toastStyle";

const dataPlanDetail = ref({
  id: "",
  name: "",
  description: "",
  executor: "",
  planType: "12312",
  file: null,
  startDate: "",
  dateEnd: "",
});
const dataPlanType = ref([]);
const dataCreatePlan = reactive({
  name: "",
  description: "",
  executor: "",
  planType: "",
  file: null,
  startDate: "",
  dateEnd: "",
});
const isAddTypePlan = ref(false);
const isUpdateTypePlan = ref(false);
const isSeenPlan = ref(false);

const getPlanDetail = async (id) => {
  try {
    await API()
      .get(`${props.slug}/type-of-plan/${id}/`)
      .then((res) => {
        dataPlanDetail.value.id = id;
        dataPlanDetail.value.name = res?.name;
        dataPlanDetail.value.description = res?.description;
      });
  } catch (error) {
    console.log(error);
  }
};
const getSeenPlan = (id) => {
  isSeenPlan.value = true;
  getPlanDetail(id);
};

const goToDetailTypePlan = (id) => {
  getPlanDetail(id);
  isUpdateTypePlan.value = true;
};
const getTypePlan = async () => {
  try {
    await API()
      .get(`${props.slug}/type-of-plan/`)
      .then((res) => {
        dataPlanType.value = res.results;
      });
  } catch (error) {
    console.log(error);
  }
};
getTypePlan();
const deletePlan = async (id) => {
  try {
    await API()
      .remove(`${props.slug}/type-of-plan/${id}/`)
      .then(() => {
        successToast("Xóa thánh công");
        getTypePlan();
      });
  } catch (error) {
    console.log(error);
  }
};
getTypePlan();
const handleSubmit = async () => {
  await API().post(`${props.slug}/type-of-plan/`, {
    name: dataCreatePlan.name,
    description: dataCreatePlan.description,
  });
  successToast("Đã cập nhật thành công!");
  isAddTypePlan.value = false;
  getTypePlan();
};

const handleClickDeletePlan = (item) => {
  deletePlan(item.id);
};
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
const address = reactive({
  title: props.nameKCN,
  details: [{ name: "Quản lý loại kế hoạch", to: "ManagePlanPage" }],
});

const gotToAddTypePlan = () => {
  isAddTypePlan.value = true;
};
const handleSubmitDetail = async () => {
  try {
    const res = await API().patch(
      `${props.slug}/type-of-plan/${dataPlanDetail.value.id}/`,
      {
        name: dataPlanDetail.value.name,
        description: dataPlanDetail.value.description,
      }
    );
    console.log(123, res);
    successToast("Đã cập nhật thành công!");
    isUpdateTypePlan.value = false;
    getTypePlan();
  } catch (error) {
    isUpdateTypePlan.value = false;
    errorToast("Cập nhật thất bại!");
  }
};
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ke-hoach"
    :slug="props.slug"
  >
    <div class="d-flex justify-content-between flex-column">
      <div class="card mb-0" style="overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <div class="m-2">
            <b-row>
              <b-col cols="12">
                <div class="d-flex align-items-center justify-content-end">
                  <b-button @click="gotToAddTypePlan" class="btn btn-light">
                    <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </div>
          <template v-if="dataPlanType.length">
            <table class="table align-middle table-striped table-bordered">
              <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="5%">#</th>
                  <th width="25%">Tên kế hoạch</th>
                  <th>Mô tả</th>
                  <th width="5%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataPlanType" :key="index">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td style="cursor: pointer" @click="getSeenPlan(item.id)">
                    {{ item.name }}
                  </td>
                  <td style="cursor: pointer" @click="getSeenPlan(item.id)">
                    {{ item.description }}
                  </td>
                  <td>
                    <ul
                      class="list-inline hstack gap-2 mb-0 d-flex justify-content-center"
                    >
                      <li class="list-inline-item">
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
                              <div
                                class="dropdown-item cursor-pointer"
                                @click="goToDetailTypePlan(item.id)"
                              >
                                <i
                                  class="ri-quill-pen-fill align-bottom me-2 text-muted"
                                ></i>
                                Sửa
                              </div>
                            </li>
                            <li @click="handleClickDeletePlan(item)">
                              <b-link class="dropdown-item text-danger">
                                <i
                                  class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                ></i>
                                Xóa
                              </b-link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else>
            <p>Không có dữ liệu!</p>
          </template>
        </div>
        <div class="d-flex justify-content-end p-3">
          <div class="pagination-wrap hstack gap-2" style="display: flex">
            <b-link class="page-item pagination-prev" href="#"> Trước</b-link>
            <ul class="pagination listjs-pagination mb-0">
              <li class="active">
                <b-link class="page" href="#" data-i="1" data-page="8"
                  >1</b-link
                >
              </li>
              <li>
                <b-link class="page" href="#" data-i="1" data-page="8"
                  >2</b-link
                >
              </li>
            </ul>
            <b-link class="page-item pagination-next" href="#"> Sau</b-link>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="isAddTypePlan"
      id="add-Plan"
      hide-footer
      body-class="p-0"
      header-class="p-3 m-2"
      modal-class="zoomIn"
      class="v-modal-custom w-[600px]"
      title="Thêm kế hoạch "
      content-class="border-0 overflow-hidden"
      centered
      size="xl"
    >
      <form id="user-manage">
        <b-card no-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Tên kế hoạch</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  name="name"
                  v-model="dataCreatePlan.name"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1">Mô tả</label>
                <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  name="description"
                  v-model="dataCreatePlan.description"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-footer>
            <div class="hstack gap-2">
              <b-button variant="danger" type="reset" @click="goToCancer"
                >Hủy</b-button
              >
              <b-button
                variant="success"
                type="submit"
                @click.prevent="handleSubmit"
                >Lưu</b-button
              >
            </div>
          </b-card-footer>
        </b-card>
      </form>
    </b-modal>
    <b-modal
      v-model="isUpdateTypePlan"
      id="update-Plan1"
      hide-footer
      body-class="p-0"
      header-class="p-3 m-2"
      modal-class="zoomIn"
      class="v-modal-custom w-[600px]"
      title="Cập nhập kế hoạch "
      content-class="border-0 overflow-hidden"
      centered
      size="lg"
    >
      <form id="update-plan">
        <b-card no-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Tên kế hoạch</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  name="name"
                  v-model="dataPlanDetail.name"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1">Mô tả</label>
                <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  name="description"
                  v-model="dataPlanDetail.description"
                />
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-footer>
            <div class="hstack gap-2">
              <b-button variant="danger" type="reset" @click="goToCancer"
                >Hủy</b-button
              >
              <b-button
                variant="success"
                type="submit"
                @click.prevent="handleSubmitDetail"
                >Lưu</b-button
              >
            </div>
          </b-card-footer>
        </b-card>
      </form>
    </b-modal>
    <b-modal
      v-model="isSeenPlan"
      hide-footer
      body-class="p-0"
      header-class="p-3"
      modal-class="zoomIn"
      class="v-modal-custom"
      title="Chi tiết Kế hoạch"
      content-class="border-0 overflow-hidden"
      centered
    >
      <div class="profile-offcanvas">
        <div class="card shadow-none">
          <div class="card-body pt-0">
            <div class="table-responsive table-card mb-3">
              <table class="table mb-0">
                <tbody id="info__detail">
                  <tr>
                    <td class="fw-medium" width="40%" scope="row">
                      Tên kế hoạch:
                    </td>
                    <td>{{ dataPlanDetail.name }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Mô tả:</td>
                    <td id="emp">{{ dataPlanDetail.description }}</td>
                  </tr>
                  <!-- <tr>
                    <td class="fw-medium" scope="row">Người thực hiện</td>
                    <td>{{ dataPlanDetail.executor }}</td>
                  </tr> -->
                  <!-- <tr>
                    <td class="fw-medium" scope="row">Điện thoại</td>
                    <td>{{ userDetail.phone }}</td>
                  </tr> -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>
<style scoped></style>
