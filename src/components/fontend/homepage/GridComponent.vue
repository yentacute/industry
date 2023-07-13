<template>
  <section class="grid__info">
    <div class="grid__info-content page-width">
      <div class="grid__item">
        <div class="grid__item-left">
          <img src="@/assets/images/green-icon-01.png" alt="">
        </div>
        <div class="grid__item-right text-center">
          <h3 class="ff-secondary fw-semibold display-4 text-primary">
            <count-to :startVal='0' :endVal='listCount.total_project ? listCount.total_project : 0' :duration='3000'></count-to>
          </h3>
          <h5 class="fw-semibold text-muted text-uppercase my-4"><i
              class="mdi mdi-table-multiple me-2 align-bottom text-primary"></i> Dự án </h5>
        </div>
      </div>
      <div class="grid__item">
        <div class="grid__item-left">
          <img src="@/assets/images/green-icon-02.png" alt="">
        </div>
        <div class="grid__item-right text-center">
          <h3 class="ff-secondary fw-semibold display-4 text-danger">
            <count-to :startVal='0' :endVal='listCount.total_infrastructure ? listCount.total_infrastructure : 0' :duration='3000'></count-to>
          </h3>
          <h5 class="fw-semibold text-muted text-uppercase my-4"><i class="ri-stack-line me-2 align-bottom text-danger"></i>
            Lớp hạ tầng kỹ thuật </h5>
        </div>
      </div>
      <div class="grid__item">
        <div class="grid__item-left">
          <img src="@/assets/images/green-icon-03.png" alt="">
        </div>
        <div class="grid__item-right text-center">
          <h3 class="ff-secondary fw-semibold display-4 text-info">
            <count-to :startVal='0' :endVal='listCount.total_map ? listCount.total_map : 0' :duration='3000'></count-to>
          </h3>
          <h5 class="fw-semibold text-muted text-uppercase my-4"><i class="ri-road-map-line me-2 align-bottom text-info"></i> Bản đồ
          </h5>
          
        </div>
      </div>
      <div class="grid__item">
        <div class="grid__item-left">
          <img src="@/assets/images/green-icon-04.png" alt="">
        </div>
        <div class="grid__item-right text-center">
          <h3 class="ff-secondary fw-semibold display-4 text-success">
            <count-to :startVal='0' :endVal='listCount.total_layer ? listCount.total_layer : 0' :duration='3000'></count-to>
          </h3>
          <h5 class="fw-semibold text-muted text-uppercase my-4"><i class="ri-map-2-fill me-2 align-bottom text-success"></i> Lớp
            bản đồ </h5>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import '@/assets/scss/frontend/grid_component.scss';
import {CountTo} from "vue3-count-to";
import {ref, onMounted} from 'vue';
import http from "../../../helpers/api/axiosHttp";

export default {
  components: {
    CountTo,
  },
  setup() {
    const listCount = ref({});
    const getList = async () => {
      const {data} = await http.get(`/sipm-base/doash-board`);
      listCount.value = data;
    }
    onMounted(() => {
      getList();
    })

    return {listCount, getList}
  }
}
</script>