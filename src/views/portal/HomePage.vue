<script>
import Layout from "../../layouts/main.vue";
import GridComponent from "../../components/fontend/homepage/GridComponent";
import BannerComponent from "../../components/fontend/homepage/BannerComponent";
import OverviewComponent from "../../components/fontend/homepage/OverviewComponent";
import CategoriesComponent from "../../components/fontend/homepage/CategoriesComponent";

export default {

  components: {
    Layout,
    GridComponent,
    BannerComponent,
    OverviewComponent,
    CategoriesComponent
  },
}

</script>

<style lang="scss" scoped>
.display-custom {
  font-size: calc(0.675rem + 1.5vw);
}

.text-custom {
  color: #f7ca2e;
}

@media screen and (min-width: 1200px) {
  .display-custom {
    font-size: 2.15rem;
  }
}

.navbar {
  @media(min-width: 992px) {
    &.is-sticky {
      .user {
        svg {
          path {
            fill: var(--vz-dark);
          }
        }
      }
    }
  }
}

.page-content {
  padding: 0;
}

.container-fluid {
  margin: 0;
}

</style>

<template>
  <Layout pageLayout="landing" isSticky isLight>
    <section class="section nft-hero">
      <div class="bg-overlay" style="opacity: .5;"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 col-sm-10">
            <div class="text-center">
              <h1 class="fw-semibold mb-4 lh-base text-white text-uppercase display-custom">Hệ thống quản
                lý Khu công nghiệp Sông Công II
                <br><span class="text-custom">Tỉnh Thái Nguyên</span></h1>
            </div>
          </div>
        </div>
      </div>
      <div class="port">
        <img src="@/assets/images/triangle_mask_bottom.png" alt="">
      </div>
    </section>
    <GridComponent/>

    <BannerComponent/>

    <OverviewComponent/>
    <CategoriesComponent/>

  </Layout>
</template>