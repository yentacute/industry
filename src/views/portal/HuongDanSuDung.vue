<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../layouts/main.vue';
import http from "../../helpers/api/axiosHttp";
import {CheckCircleIcon} from "@zhuowenli/vue-feather-icons";

const items = reactive([
  {
    name: "Hướng dẫn sử dụng",
    to: "#",
  },
]);
</script>
<template>
  <Layout :items="items" chooseMenu="huong-dan" systemMenu>
    <b-row class="justify-content-center">
      <b-col col lg="12">
        <b-card no-body>
          <b-card-body class="p-4">
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Tương tác với bản đồ</h5>
                <p class="text-muted">Trong phần này, cho phép người dùng tương tác trực tiếp với bản đồ.</p>
                <h6 class="fw-semibold text-secondary">1. Di chuyển bản đồ</h6>
                <p class="text-muted ms-3">Người dùng kéo thả chuột trái trên bản đồ để thực hiện di chuyển.</p>
                <h6 class="fw-semibold text-secondary">2. Phóng to, thu nhỏ bản đồ</h6>
                <p class="text-muted ms-3">Người dùng sử dụng con lăn chuột để thực hiện phóng to, thu nhỏ bản đồ</p>
                <h6 class="fw-semibold text-secondary">3. Thay đổi góc nghiêng bản đồ</h6>
                <p class="text-muted ms-3">Người dùng kết hợp kéo thả cả chuột trái và chuột phải theo hướng lên xuống
                  để thực hiện thay đổi góc nghiêng trên bản đồ</p>
                <h6 class="fw-semibold text-secondary">4. Thay đổi góc xoay bản đồ</h6>
                <p class="text-muted ms-3">Người dùng kết hợp kéo thả cả chuột trái và chuột phải theo hướng trái phải
                  để thực hiện thay đổi góc xoay trên bản đồ
                </p>
                <h6 class="fw-semibold text-secondary">5. Thay đổi chế độ nền bản đồ</h6>
                <p class="text-muted ms-3">Người dùng chọn biểu tượng bản đồ nhỏ ở góc dưới cùng bên phải của bản đồ để
                  thực hiện thay đổi nền bản đồ: <b>2D, 3D, Raster, Vệ tinh, chọn bản đồ nền của Google hay OMS</b>
                </p>
                <b-row class="justify-content-center">
                  <b-col md="8">
                    <img src="@/assets/images/1-HDSD/img-1.jpg" alt="" class="img-fluid">
                  </b-col>
                </b-row>
              </div>
            </div>
            <div class="text-end">
              <router-link :to="{name: 'HomePage'}" class="btn btn-danger">Trang chủ</router-link>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </Layout>
</template>