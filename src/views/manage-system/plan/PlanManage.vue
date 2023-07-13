<script setup>
import Swal from "sweetalert2";
import { onMounted, ref, defineProps, reactive } from "vue";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";
import { errorToast, successToast } from "../../../helpers/api/toastStyle";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import flatPickr from "vue-flatpickr-component";
import ModalShowMapAddPointVue from "./ModalShowMapAddPoint.vue";
import Pagination from "../../../components/Pagination.vue";

const dataPlan = ref([]);
const dataUser = ref([]);
const dataPlanExcustor = ref();
const dataPlanDetail = ref({
  id: "",
  name: "",
  description: "",
  executor: "",
  planType: "12312",
  file: null,
  startDate: "",
  dateEnd: "",
  status: "",
});
const dataPlanType = ref([]);
const search = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  name: "",
  startDate: "",
  endDate: "",
  planType: "",
  executor: "",
});
const dataCreatePlan = reactive({
  name: "",
  description: "",
  executor: "",
  planType: "",
  file: null,
  startDate: "",
  dateEnd: "",
  locations: [],
});
const isAddPlan = ref(false);
const isUpdatePlan = ref(false);
const isExcustorPlan = ref(false);
const isSeenPlan = ref(false);
const dataPageSize = ref(1);
const totalObject = ref();

const dataStatusPlan = ref({
  waiting: "",
  doing: "",
  complete: "",
  expire: "",
  cancel: "",
});

const getPlan = async () => {
  try {
    let urlUser = `/plan/?page=${search.currPage}&type=search`;
    if (search.name !== "") {
      urlUser += `&name=${search.name}`;
    }
    if (search.planType !== "") {
      urlUser += `&plan_type=${search.planType}`;
    }
    if (search.executor !== "") {
      urlUser += `&executor=${search.executor}`;
    }
    if (search.startDate !== "")
      urlUser += `&start_date=${formatDate(search.startDate)}`;
    if (search.endDate !== "")
      urlUser += `&end_date=${formatDate(search.endDate)}`;
    await API()
      .get(`${props.slug}${urlUser}`)
      .then((res) => {
        console.log(123, res);
        dataPlan.value = res.results.results;
        dataStatusPlan.value.waiting = res.results.status_count[0];
        dataStatusPlan.value.doing = res.results.status_count[1];
        dataStatusPlan.value.complete = res.results.status_count[2];
        dataStatusPlan.value.expire = res.results.status_count[3];
        dataStatusPlan.value.cancel = res.results.status_count[4];
        dataPageSize.value = res.page_size - 2;
        totalObject.value = res.total_objects;
      });
  } catch (error) {
    console.log(error);
  }
};
getPlan();
const pageChanged = (val) => {
  search.currPage = val;
  getPlan();
};
const getUser = async () => {
  try {
    await API()
      .get(`/user`)
      .then((res) => {
        dataUser.value = res.results;
      });
  } catch (error) {
    console.log(error);
  }
};
getUser();
const getPlanDetail = async (id) => {
  try {
    await API()
      .get(`${props.slug}/plan/${id}/`)
      .then((res) => {
        dataPlanDetail.value.id = id;
        dataPlanDetail.value.name = res?.name;
        dataPlanDetail.value.description = res?.description;
        dataPlanDetail.value.executor = res.executor?.id;
        dataPlanDetail.value.planType = res?.plan_type.id;
        dataPlanDetail.value.startDate = res?.start_date;
        dataPlanDetail.value.dateEnd = res?.end_date;
        dataPlanDetail.value.status = res?.status;
      });
  } catch (error) {
    console.log(error);
  }
};
const getSeenPlan = (id) => {
  isSeenPlan.value = true;
  getPlanDetail(id);
};
const chuyenDoiNgay = (dateString) => {
  var date = new Date(dateString);
  var ngay = date.getDate();
  var thang = date.getMonth() + 1;
  var nam = date.getFullYear();
  return ngay + "/" + thang + "/" + nam;
};

const goToDetailPlan = (id) => {
  getPlanDetail(id);
  isUpdatePlan.value = true;
};
const getTypePlan = async () => {
  try {
    await API()
      .get(`${props.slug}/type-of-plan/`)
      .then((res) => {
        dataPlanType.value = res.results;
        console.log(4444, dataPlanType.value);
      });
  } catch (error) {
    console.log(error);
  }
};
getTypePlan();
const deletePlan = async (id) => {
  try {
    await API()
      .remove(`${props.slug}/plan/${id}/`)
      .then(() => {
        successToast("Xóa thánh công");
        getPlan();
      });
  } catch (error) {
    console.log(error);
  }
};
getTypePlan();

// UPdate Excustor

const idExcustorDetail = ref({
  id: "",
  executor: "",
});
const goToExcustorDetailPlan = (item) => {
  idExcustorDetail.value.id = item.id;
  isExcustorPlan.value = true;
  // dataPlanExcustor.value = item.executor;
  // updateExcustorPlan(id);
};
const updateExcustorPlan = async (id) => {
  try {
    await API().post(`${props.slug}/plan/${id}/update-executor/`, {
      executor: dataPlanExcustor.value,
    });
    successToast("Đã cập nhật thành công!");
    isExcustorPlan.value = false;
    getPlan();
  } catch (error) {
    isExcustorPlan.value = false;
    errorToast("Cập nhật thất bại!");
  }
};
const handleSubmitExcustor = () => {
  updateExcustorPlan(idExcustorDetail.value.id);
};
const resetFilter = () => {
  search.name = "";
  search.executor = "";
  search.planType = "";
  search.startDate = "";
  search.endDate = "";
  getPlan();
};
const searchFilter = () => {
  getPlan();
};
const handleSubmit = async () => {
  const response = await API().post(`${props.slug}/plan/create`, {
    name: dataCreatePlan.name,
    description: dataCreatePlan.description,
    executor: dataCreatePlan.executor,
    plan_type: dataCreatePlan.planType,
    status: dataCreatePlan.status,
    // file: dataCreatePlan.file,
    start_date: dataCreatePlan.startDate,
    end_date: dataCreatePlan.dateEnd,
    locations: dataCreatePlan.locations,
  });
  if (response.success == true) {
    successToast("Đã cập nhật thành công!");
    isAddPlan.value = false;
    getPlan();
  } else {
    isAddPlan.value = false;
    errorToast("Cập nhật thất bại!");
  }
};

// goToExceptPlan
const goToExceptPlan = async (id) => {
  await API()
    .post(`${props.slug}/plan/${id}/mask-as-complete/`)
    .then((res) => {
      if (res.response.status == 400) {
        errorToast(`${res.response.data.Error}`);
      } else {
        successToast("Duyệt kế hoạch thành công!");
      }
    });
  // getPlan();
};
const goToCancePlan = async (id) => {
  await API()
    .post(`${props.slug}/plan/${id}/mask-as-cancel/`)
    .then((res) => {
      // console.log(1213, res);
      successToast("Hủy kế hoạch thành công!");
      getPlan();
    });
  // try {
  //   const res = await API().post(`${props.slug}/plan/${id}/mask-as-cancel/`);
  //   successToast("Hủy kế hoạch thành công!");
  //   getPlan();
  // } catch (error) {
  //   errorToast(`${error}`);
  // }
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
  details: [{ name: "Quản lý kế hoạch", to: "ManagePlanPage" }],
});
function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
const gotToAddPlan = () => {
  isAddPlan.value = true;
};
// const pathUpdatePlan = () => {};
const handleSubmitDetail = async () => {
  try {
    const res = await API().patch(
      `${props.slug}/plan/${dataPlanDetail.value.id}/`,
      {
        name: dataPlanDetail.value.name,
        description: dataPlanDetail.value.description,
        executor: dataPlanDetail.value.executor,
        status: dataPlanDetail.value.status,
        plan_type: dataPlanDetail.value.planType,
        start_date: chuyenDoiNgay(dataPlanDetail.value.startDate),
        end_date: chuyenDoiNgay(dataPlanDetail.value.dateEnd),
      }
    );
    console.log(123, res);
    successToast("Đã cập nhật thành công!");
    isUpdatePlan.value = false;
    getPlan();
  } catch (error) {
    isUpdatePlan.value = false;
    errorToast("Cập nhật thất bại!");
    console.log(123123);
  }
};

// point
const isPointPlan = ref(false);
const goToPointPlan = (id) => {
  isPointPlan.value = true;
};
const arrayStatus = [
  { label: "Đang chờ", val: 0 },
  { label: "Đang thực hiện", val: 1 },
  { label: "Hoàn thành", val: 2 },
  { label: "Đã quá hạn", val: 3 },
  { label: "Huỷ kế hoạch", val: 4 },
];
const resolveStatus = (status) => {
  if (status === 0) return { label: "Đang chờ", variant: "success" };
  if (status === 1) return { label: "Đang thực hiện", variant: "danger" };
  if (status === 2) return { label: "Hoàn thành", variant: "danger" };
  if (status === 3) return { label: "Đã quá hạn", variant: "danger" };
  if (status === 4) return { label: "Huỷ kế hoạch", variant: "danger" };
  return { label: "Lỗi", variant: "danger" };
};
const findValByTypePlan = (val) => {
  const filteredArray = dataPlanType.value.filter((item) => item.id === val);

  if (filteredArray.length > 0) {
    return filteredArray[0].name;
  }

  return null;
};
const findValByDataUser = (val) => {
  const filteredArray = dataUser.value.filter((item) => item.id === val);

  if (filteredArray.length > 0) {
    return filteredArray[0].username;
  }

  return null;
};
const layNgayTrongChuoi = (chuoiThoiGian) => {
  if (chuoiThoiGian == null) return "";
  var date = new Date(chuoiThoiGian);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

//Thêm map
const modalShowMap = ref(null);
const handleClickShowMapAddPoint = () => {
  modalShowMap.value.handleSetView();
};
const handleEmitPoint = (points) => {
  dataCreatePlan.locations = [...points];
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
      <div class="manage-database">
        <FolderHeaderBar>
          <template #add_button>
            <b-row class="pt-3">
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <label>{{ $t("Tên kế hoạch") }}</label>
                <b-form-input
                  class="form-control search w-100"
                  v-model="search.name"
                  placeholder="Nhập tên kế hoạch"
                />
              </b-col>
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <label>{{ $t("Người thực hiện") }}</label>
                <select
                  class="form-select form-control-icon"
                  v-model="search.executor"
                  placeholder="chọn"
                >
                  <option value="" selected disabled>
                    Chọn người thực hiện
                  </option>
                  <option
                    v-for="item in dataUser"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.username }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <b-form-group :label="$t('Ngày bắt đầu')" label-for="fromDate">
                  <flat-pickr
                    :config="birthConfig"
                    v-model="search.startDate"
                    placeholder="YYYY-MM-DD"
                    class="form-control flatpickr-input"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <b-form-group :label="$t('Ngày kết thúc')" label-for="fromDate">
                  <flat-pickr
                    :config="birthConfig"
                    v-model="search.endDate"
                    placeholder="YYYY-MM-DD"
                    class="form-control flatpickr-input"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <label>{{ $t("Loại kế hoạch") }}</label>
                <select
                  class="form-select form-control-icon"
                  v-model="search.planType"
                  placeholder="chọn"
                >
                  <option value="" selected>Chọn loại kế hoạch</option>
                  <option
                    v-for="item in dataPlanType"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
              <b-col
                cols="12"
                class="d-flex align-items-end justify-content-end"
              >
                <b-button variant="outline-primary" @click="resetFilter()">
                  <feather-icon icon="RefreshCwIcon" /> {{ $t("Làm mới") }}
                </b-button>
                <b-button
                  variant="primary"
                  class="ml-2"
                  style="margin-left: 16px"
                  @click="searchFilter()"
                >
                  <feather-icon icon="SearchIcon" /> {{ $t("Tìm kiếm") }}
                </b-button>
              </b-col>
            </b-row>
          </template>
        </FolderHeaderBar>
        <!--      <MenuBarContainSearch>
      </MenuBarContainSearch>-->
      </div>
      <div style="padding: 16px; background: white; padding-bottom: 0px">
        <h4 style="margin-bottom: 8px">Hiển thị trạng thái theo thời gian</h4>
        <div style="display: flex; justify-content: flex-start; gap: 4px">
          <button type="button" class="btn btn-primary">
            Đang chờ: {{ dataStatusPlan.waiting }}
          </button>
          <button type="button" class="btn btn-secondary">
            Đang thực hiện: {{ dataStatusPlan.doing }}
          </button>
          <button type="button" class="btn btn-success">
            Hoàn thành: {{ dataStatusPlan.complete }}
          </button>
          <button type="button" class="btn btn-danger">
            Quá hạn: {{ dataStatusPlan.expire }}
          </button>
          <button type="button" class="btn btn-warning">
            Hủy : {{ dataStatusPlan.cancel }}
          </button>
        </div>
      </div>

      <div class="card mb-0" style="overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <div class="m-2">
            <b-row>
              <b-col cols="12">
                <div class="d-flex align-items-center justify-content-end">
                  <b-button @click="gotToAddPlan" class="btn btn-light">
                    <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </div>
          <template v-if="dataPlan.length">
            <table class="table align-middle table-striped table-bordered">
              <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="5%">#</th>
                  <th width="10%">Tên kế hoạch</th>
                  <th>Mô tả</th>
                  <th width="10%">Loại kế hoạch</th>
                  <th width="15%">Người thực thi</th>
                  <th width="10%">Ngày hoàn thành</th>
                  <th width="10%">Ngày bắt đầu</th>
                  <th width="10%">Ngày kết thúc</th>
                  <th width="10%">Trạng thái</th>
                  <th width="5%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataPlan" :key="index">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td style="cursor: pointer" @click="getSeenPlan(item.id)">
                    {{ item.name }}
                  </td>
                  <td style="cursor: pointer" @click="getSeenPlan(item.id)">
                    {{ item.plan_type?.name }}
                  </td>
                  <td style="cursor: pointer" @click="getSeenPlan(item.id)">
                    {{ item.description }}
                  </td>
                  <td style="cursor: pointer" @click="getSeenPlan(item.id)">
                    {{ item.executor?.username }}
                  </td>
                  <td>
                    {{ layNgayTrongChuoi(item.complete_date) }}
                  </td>
                  <td>
                    {{ item.start_date }}
                  </td>
                  <td>
                    {{ item.end_date }}
                  </td>
                  <td>
                    {{ resolveStatus(item.status).label }}
                  </td>
                  <td>
                    <ul
                      class="list-inline hstack gap-2 mb-0 d-flex justify-content-center"
                    >
                      <!-- <li
                        v-if="item.status == 2"
                        class="list-inline-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        aria-label="12312"
                      >
                        <button class="btn btn-soft-danger btn-sm">
                          <i class="ri-external-link-fill"></i>
                        </button>
                      </li>
                      <li
                        v-if="item.status == 3"
                        class="list-inline-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        aria-label="Remove"
                      >
                        <button class="btn btn-soft-danger btn-sm">
                          <i class="ri-external-link-fill"></i>
                        </button>
                      </li> -->
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
                            <li
                              v-if="
                                (item.status == 0 || item.status == 1) &&
                                item.complete_date == ''
                              "
                            >
                              <div
                                @click="goToExcustorDetailPlan(item)"
                                class="dropdown-item cursor-pointer"
                              >
                                <i
                                  class="ri-pencil-fill align-bottom me-2 text-muted"
                                ></i>
                                Sửa người thực hiện
                              </div>
                            </li>
                            <li v-if="item.status == 0 || item.status == 1">
                              <div
                                class="dropdown-item cursor-pointer"
                                @click="goToDetailPlan(item.id)"
                              >
                                <i
                                  class="ri-quill-pen-fill align-bottom me-2 text-muted"
                                ></i>
                                Sửa
                              </div>
                            </li>
                            <li
                              v-if="
                                item.status == 1 && item.complete_date !== ''
                              "
                            >
                              <div
                                class="dropdown-item cursor-pointer"
                                @click="goToExceptPlan(item.id)"
                              >
                                <i
                                  class="ri-uninstall-fill align-bottom me-2 text-muted"
                                ></i>
                                Duyệt kế hoạch
                              </div>
                            </li>
                            <li v-if="item.status == 0 || item.status == 1">
                              <div
                                class="dropdown-item cursor-pointer"
                                @click="goToCancePlan(item.id)"
                              >
                                <i
                                  class="ri-file-zip-fill align-bottom me-2 text-muted"
                                ></i>
                                Hủy kế hoạch
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

        <div class="d-flex justify-content-end my-3">
          <div class="pagination-wrap hstack gap-2">
            <!-- {{ totalObject }} -->
            <Pagination
              :page-size="dataPageSize"
              :total="totalObject"
              :callback="pageChanged"
            ></Pagination>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="isAddPlan"
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

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Người thực hiện</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataCreatePlan.executor"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="" disabled>Chọn người thực hiện</option>
                  <option
                    v-for="item in dataUser"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.username }}
                  </option>
                </select>
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Loại kế hoach</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataCreatePlan.planType"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="" disabled>Chọn loại kế hoạch</option>
                  <option
                    v-for="item in dataPlanType"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>
          <!-- <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1">File</label>
                <input
                  type="file"
                  class="form-control"
                  id="addressInput"
                  name="file"
                  @change="handleImgSelected($event, index)"
                />
              </b-col>
            </b-col>
          </b-card-body> -->
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Ngày bắt đầu</label
                >
                <flat-pickr
                  :config="birthConfig"
                  v-model="dataCreatePlan.startDate"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                  name="start_date"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Ngày kết thúc</label
                >

                <flat-pickr
                  :config="birthConfig"
                  v-model="dataCreatePlan.dateEnd"
                  placeholder="YYYY-MM-DD"
                  :disabledDates="disabledDates"
                  class="form-control flatpickr-input"
                  name="end_date"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-body class="p-0 mx-3">
            <b-col>
              <b-col class="mb-3">
                <p v-if="dataCreatePlan.locations.length">
                  Có {{ dataCreatePlan.locations.length }} điểm tuần tra
                </p>
                <p v-else>Chưa có điểm tuần tra nào</p>
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-footer
            class="d-flex justify-content-between align-items-center"
          >
            <div class="hstack gap-2">
              <b-button
                variant="primary"
                type="reset"
                @click="handleClickShowMapAddPoint"
              >
                Thêm điểm tuần tra
              </b-button>
            </div>
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
      v-model="isUpdatePlan"
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

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Người thực hiện</label
                >
                <!-- <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  name="executor"
                  v-model="dataPlanDetail.executor"
                /> -->
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanDetail.executor"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="">Bỏ chọn người thực hiện</option>
                  <option
                    v-for="item in dataUser"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.username }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Loại kế hoach</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanDetail.planType"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="" disabled>Chọn loại kế hoạch</option>
                  <option
                    v-for="item in dataPlanType"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>
          <!-- 
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Trạng thái</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanDetail.status"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="" disabled>Chọn trạng thái</option>
                  <option
                    v-for="item in arrayStatus"
                    :key="item.val"
                    :value="item.val"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </b-col>
            </b-col>
          </b-card-body> -->
          <!-- <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1">File</label>
                <input
                  type="file"
                  class="form-control"
                  id="addressInput"
                  name="file"
                  @change="handleImgSelected($event, index)"
                />
              </b-col>
            </b-col>
          </b-card-body> -->
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Ngày bắt đầu</label
                >
                <flat-pickr
                  :config="birthConfig"
                  v-model="dataPlanDetail.startDate"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                  name="start_date"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Ngày kết thúc</label
                >

                <flat-pickr
                  :config="birthConfig"
                  v-model="dataPlanDetail.dateEnd"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                  name="end_date"
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
      v-model="isPointPlan"
      id="point-plan"
      hide-footer
      body-class="p-0"
      header-class="p-3 m-2"
      modal-class="zoomIn"
      class="v-modal-custom w-[600px]"
      title="Chi tiết/cập nhập kế hoạch "
      content-class="border-0 overflow-hidden"
      centered
      size="lg"
    >
      <form id="point-plan">
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

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Người thực hiện</label
                >
                <!-- <input
                  type="text"
                  class="form-control"
                  id="addressInput"
                  name="executor"
                  v-model="dataPlanDetail.executor"
                /> -->
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanDetail.executor"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="">Bỏ chọn người thực hiện</option>
                  <option
                    v-for="item in dataUser"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.username }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Loại kế hoach</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanDetail.planType"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="" disabled>Chọn loại kế hoạch</option>
                  <option
                    v-for="item in dataPlanType"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Trạng thái</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanDetail.status"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="" disabled>Chọn trạng thái</option>
                  <option
                    v-for="item in arrayStatus"
                    :key="item.val"
                    :value="item.val"
                  >
                    {{ item.label }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>
          <!-- <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1">File</label>
                <input
                  type="file"
                  class="form-control"
                  id="addressInput"
                  name="file"
                  @change="handleImgSelected($event, index)"
                />
              </b-col>
            </b-col>
          </b-card-body> -->
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Ngày bắt đầu</label
                >
                <flat-pickr
                  :config="birthConfig"
                  v-model="dataPlanDetail.startDate"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                  name="start_date"
                />
              </b-col>
            </b-col>
          </b-card-body>
          <b-card-body class="p-0 mx-3">
            <b-col id="right--col__content">
              <b-col class="mb-3">
                <label for="addressInput" class="form-label mb-1"
                  >Ngày kết thúc</label
                >

                <flat-pickr
                  :config="birthConfig"
                  v-model="dataPlanDetail.dateEnd"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                  name="end_date"
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
      v-model="isExcustorPlan"
      id="update-Plan1"
      hide-footer
      body-class="p-0"
      header-class="p-3 m-2"
      modal-class="zoomIn"
      class="v-modal-custom w-[600px]"
      title="Thay đổi người thực hiện"
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
                  >Người thực hiện</label
                >
                <select
                  class="form-select form-control-icon"
                  v-model="dataPlanExcustor"
                  placeholder="chọn"
                  name="plan_type"
                >
                  <option value="">Bỏ chọn người thực hiện</option>
                  <option
                    v-for="item in dataUser"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.username }}
                  </option>
                  <!-- <option value="">Người dùng</option> -->
                </select>
              </b-col>
            </b-col>
          </b-card-body>

          <b-card-footer>
            <div class="hstack gap-2">
              <b-button
                variant="danger"
                type="reset"
                @click="goToCancerExcustor"
                >Hủy</b-button
              >
              <b-button
                variant="success"
                type="submit"
                @click.prevent="handleSubmitExcustor"
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
                    <td class="fw-medium" scope="row">Mô tả</td>
                    <td id="emp">{{ dataPlanDetail.description }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Người thực hiện</td>
                    <td>{{ findValByDataUser(dataPlanDetail.executor) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Loại kế hoạch</td>
                    <td>{{ findValByTypePlan(dataPlanDetail.planType) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Trạng thái</td>
                    <td>{{ resolveStatus(dataPlanDetail.status).label }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Ngày bắt đầu</td>
                    <td>{{ dataPlanDetail.startDate }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Ngày kết thúc</td>
                    <td>{{ dataPlanDetail.dateEnd }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </Layout>
  <ModalShowMapAddPointVue
    ref="modalShowMap"
    @result-point="handleEmitPoint"
  ></ModalShowMapAddPointVue>
</template>
<style scoped></style>
