<script setup>
import { ref, defineProps, reactive, watch } from "vue";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";

const dataPlan = ref([]);

const getPlan = async () => {
  try {
    let urlUser = `/layer/?all`;
    await API()
      .get(`${props.slug}${urlUser}`)
      .then((res) => {
        dataPlan.value = res.results;
        // dataResult.value = JSON.stringify(res.results);
      });
  } catch (error) {
    console.log(error);
  }
};
getPlan();
const getPlanDetail = async () => {
  try {
    let urlUser = `/layer/?all`;
    await API()
      .get(`${props.slug}${urlUser}`)
      .then((res) => {
        // dataPlan.value = res.results;
        dataResult.value = res.results;
      });
  } catch (error) {
    console.log(error);
  }
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
const urlDetail = ref();
const urlDetailTab = ref();
const dataResult = ref();
const currentTab = ref("tab1");
const address = reactive({
  title: props.nameKCN,
  details: [
    { name: "Quản lý trao đổi dữ liệu", to: "ManageDataInformationPage" },
    { name: "Dữ liệu công khai", to: "ManageDataInformationPage" },
  ],
});
const dataPlanDetail = reactive({
  executor: "",
});
// const activeComponent = ref(1);
const toggleActive = () => {
  console.log(123123);
  currentTab.value = "tab2";
};
watch(
  () => {
    if (urlDetail.value) {
      urlDetailTab.value = `https://api-kcntest.gishub.vn/api${urlDetail.value}`;
    }
  },
  {
    immediate: true,
  }
);
const goToCalApi = () => {
  getPlanDetail();
};
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="exchange-data"
    :slug="props.slug"
  >
    <div class="d-flex justify-content-between flex-column">
      <div class="card mb-0" style="overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <div>
            <h5>Dữ liệu công khai</h5>
          </div>
          <div>
            <b-col
              class="mb-3 col-6"
              style="display: flex; justify-content: flex-start; gap: 10px"
            >
              <label for="addressInput" class="form-label mb-1 col-3 my-2"
                >Danh sách dữ liệu
              </label>
              <select
                class="form-select form-control-icon"
                v-model="urlDetail"
                placeholder="chọn"
                name="plan_type"
              >
                <option value="" disabled>Chọn dữ liệu</option>
                <option
                  v-for="item in dataPlan"
                  :key="item.id"
                  :value="item.data_model"
                >
                  <!-- :value="item.id" -->
                  {{ item.name_display }}
                </option>
                <!-- <option value="">Người dùng</option> -->
              </select>
            </b-col>
          </div>
          <div
            style="
              display: flex;
              justify-content: flex-start;
              align-items: center;
              gap: 4px; ;
            "
          >
            <div
              style="padding: 8px; cursor: pointer"
              :class="{ active: currentTab === 'tab1' }"
              @click="currentTab = 'tab1'"
            >
              Mô tả dịch vụ
            </div>
            <div
              style="padding: 8px; cursor: pointer"
              :class="{ active: currentTab === 'tab2' }"
              @click="toggleActive"
            >
              Đặc tả API
            </div>
          </div>
          <div class="tab-content">
            <div
              v-if="currentTab === 'tab1'"
              style="padding;: 8px;margin-top:24px"
            >
              Dịch vụ trả về danh sách các dữ liệu công khai dạng Json
            </div>
            <div
              v-if="currentTab === 'tab2'"
              style="padding;: 8px;margin-top:24px"
            >
              <h4 style="padding-bottom;: 8px">Thông tin dịch vụ</h4>
              <b-col>
                <b-col class="mb-3">
                  <label for="addressInput" class="form-label mb-1"
                    >Mô tả URL</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="addressInput"
                    name="description"
                    v-model="urlDetailTab"
                  />
                </b-col>
              </b-col>
              <b-col>
                <b-col class="mb-3">
                  <label for="addressInput" class="form-label mb-1"
                    >Dạng dữ liệu</label
                  >
                  <select
                    class="form-select form-control-icon"
                    v-model="dataPlanDetail.executor"
                    placeholder="chọn"
                    name="plan_type"
                  >
                    <option value="">Dạng json</option>
                  </select>
                </b-col>
              </b-col>
              <b-col class="mb-3">
                <b-button variant="success" @click="goToCalApi"
                  >Thực hiện truy vấn</b-button
                >
              </b-col>
              <b-col>
                <b-col class="mb-3">
                  <pre
                    class="hljs p-6 language-javascript"
                    style="height: 300px"
                  ><code class="ng-binding language-javascript">{{
                    dataResult
                  }}</code></pre>
                </b-col>
              </b-col>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style scoped>
.active {
  border-bottom: 2px solid #00ff00;
}
</style>
