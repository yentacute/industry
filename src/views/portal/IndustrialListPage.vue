<script>
import Layout from "../../layouts/main.vue";
import http from "../../helpers/api/axiosHttp";

export default {
  components: {
    Layout
  },
  data() {
    return {
      industrialData: {},
      isLength: false,
    }
  },
  async created() {
    const res = await http.get(`/industrial-area`);
    this.industrialData = res.data;
  },
  methods: {
    showFullDescription(item) {
      if (item.showFullDescription) {
        return item.description;
      }
      return `${item.description.slice(0, 250)}...`;
    },
    toggleDescription(item) {
      item.showFullDescription = !item.showFullDescription;
    },
  }
}
</script>

<template>
  <Layout pageLayout="landing" isSticky isLight>
    <section class="section nft-hero" style="padding: 12em 0 84px">
      <div class="bg-overlay opacity-25"></div>
      <div class="port">
        <img src="@/assets/images/triangle_mask_bottom.png" alt="">
      </div>
    </section>
    <section class="section pt-4">
      <b-container>
        <b-card no-body class="shadow-none border card-height-100" v-for="item in industrialData" :key="item.id">
          <b-card-body class="pb-0">
            <b-row>
              <b-col lg="4">
                <img :src="item.photo ? item.photo : `/img/img-1.0763e22f.jpg`" class="rounded img-fluid" alt=""
                     style="height: 288px">
              </b-col>
              <b-col lg="8">
                <b-card no-body class="shadow-none mb-0">
                  <h4 class="text-success fw-medium fs-20 mb-3"> {{ item.name }} </h4>
                  <div class="table-responsive table-card mb-2">
                    <table class="table table-borderless mb-0" id="table__indus--content">
                      <tbody>
                      <tr>
                        <td class="fw-medium text-primary" id="col__width--custom">
                          <i class="ri-map-pin-fill me-1 align-bottom"></i> Địa chỉ
                        </td>
                        <td width="1%">:</td>
                        <td class="text-muted">{{ item.address }}</td>
                      </tr>
                      <tr>
                        <td class="fw-medium text-primary">
                          <i class=" ri-phone-fill me-1 align-bottom"></i> Điện thoại
                        </td>
                        <td>:</td>
                        <td class="text-muted"> {{ item.phone }}</td>
                      </tr>
                      <tr>
                        <td class="fw-medium text-primary">
                          <i class="mdi mdi-office-building-cog-outline me-1 align-bottom"></i> Đơn vị phụ trách
                        </td>
                        <td>:</td>
                        <td class="text-muted">{{ item.curator }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <h6 class="fw-medium text-info fs-14 mb-1">Thông tin giới thiệu :</h6>
                  <p id="description__content" class="text-muted">
                    {{ item.description.length > 0 ? showFullDescription(item) : 'Chưa có giới thiệu' }}
                    <span v-if="item.description.length > 250"
                          class="link-success text-decoration-underline cursor-pointer fst-italic ms-2"
                          @click="toggleDescription(item)">
                    {{ item.showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
                    </span>
                  </p>
                  <b-card-footer class="px-0">
                    <b-link href="#!" class="btn btn-soft-danger">
                      Đi đến <i class="ri-arrow-right-line align-bottom ms-1"></i></b-link>
                  </b-card-footer>
                </b-card>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-container>
    </section>
  </Layout>
</template>

<style scoped>
#table__indus--content tr td {
  padding-top: 8px;
  padding-bottom: 8px;
}

#description__content {
  min-height: 58.5px;
}

#col__width--custom {
  width: 20%;
}

@media (max-width: 768px) {
  #col__width--custom {
    width: 50%;
  }
}
</style>