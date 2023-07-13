<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../layouts/main.vue';
import http from "../../helpers/api/axiosHttp";
import {CheckCircleIcon} from "@zhuowenli/vue-feather-icons";

const items = reactive([
  {
    name: "Điều khoản sử dụng",
    to: "#",
  },
]);
</script>
<template>
  <Layout :items="items" chooseMenu="dieu-khoan-chinh-sach" systemMenu>
    <b-row class="justify-content-center">
      <b-col col lg="10">
        <b-card no-body>
          <div class="bg-soft-warning position-relative">
            <b-card-body class="p-5">
              <div class="text-center">
                <h3>ĐIỀU KHOẢN SỬ DỤNG</h3>
                <p class="mb-0 text-muted">Cập nhật lần cuối: 22 - 06 - 2023</p>
              </div>
            </b-card-body>
            <div class="shape">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                   xmlns:svgjs="http://svgjs.com/svgjs" width="1440" height="60" preserveAspectRatio="none"
                   viewBox="0 0 1440 60">
                <g mask="url(&quot;#SvgjsMask1001&quot;)" fill="none">
                  <path d="M 0,4 C 144,13 432,48 720,49 C 1008,50 1296,17 1440,9L1440 60L0 60z"
                        style="fill: var(--vz-card-bg-custom);"></path>
                </g>
                <defs>
                  <mask id="SvgjsMask1001">
                    <rect width="1440" height="60" fill="#ffffff"></rect>
                  </mask>
                </defs>
              </svg>
            </div>
          </div>
          <b-card-body class="p-4">
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Điều khoản chung</h5>
                <p class="text-muted">Trang web này được điều hành bởi <b>Ban quản lý các Khu công nghiệp Thái
                  Nguyên</b>.
                  Xin vui lòng đọc kỹ các điều kiện & điều khoản trước khi sử dụng hoặc đăng ký trên trang web này.
                  Bạn phải hoàn toàn đồng ý với các điều kiện và điều khoản này nếu muốn sử dụng trang web.
                  Nếu bạn không đồng ý với bất kỳ phần nào trong các điều kiện và điều khoản này, bạn sẽ không thể sử
                  dụng trang web này dưới bất kỳ hình thức nào.</p>
                <p class="text-muted">Lưu ý rằng trang web này được xây dựng nhằm phục vụ truy cập trên phạm vi toàn cầu
                  đối với người sử dụng.</p>
                <p class="text-muted">Những thông tin trên trang web này được áp dụng cho người sử dụng trên phạm vi
                  toàn cầu.</p>
                <p class="text-muted">Chúng tôi có quyền từ chối truy cập vào trang web này bất cứ lúc nào mà không cần
                  phải thông báo trước.</p>
              </div>
            </div>

            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Luật điều chỉnh</h5>
                <p class="text-muted mb-1">Việc truy cập vào trang web này có điều kiện theo sự đồng ý của bạn rằng toàn
                  bộ những thông tin trên trang web và toàn bộ các vấn đề phát sinh giữa bạn và chúng tôi sẽ được điều
                  chỉnh bởi pháp luật Việt Nam và rằng mọi tranh chấp phát sinh giữa bạn và chúng tôi sẽ căn cứ vào
                  quyền hạn xét xử của các tòa án Việt Nam.</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Nghĩa vụ của người sử dụng trang web</h5>
                <p class="text-muted">Khi sử dụng trang web này, xin vui lòng đồng ý rằng:</p>
                <ul class="list-unstyled ps-3">
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Bạn bảo
                    đảm rằng mọi thông tin mà bạn cung cấp về chính bạn và về bất cứ ai khác là hoàn toàn chính xác.
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Không
                    được sử dụng trang web này để thực hiện hành vi đăng ký sai trái, gian lận.
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Nghiêm
                    cấm mọi hành vi phát tán tài liệu mang tính đe dọa, phỉ báng, khiêu dâm, chính trị hoặc phân biệt
                    chủng tộc hoặc bất kỳ tài liệu bất hợp pháp hoặc khiêu khích nào khác thông qua trang web này.
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Bạn
                    không được sửa đổi, sao chép, truyền tải, phân phối, bán, phát tán, hoặc cấp phép trang web này và
                    bất kỳ phần nội dung nào của nó dưới bất kỳ hình thức nào trừ trường hợp bạn sao chép thông tin từ
                    trang web này để sử dụng cho cá nhân bạn và mang tính phi thương mại.
                  </li>
                </ul>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Trường hợp bất khả kháng</h5>
                <p class="text-muted"><b>Ban quản lý các Khu công nghiệp Thái Nguyên</b> được miễn trừ trách nhiệm trong
                  quá
                  trình truy cập không được nếu xảy ra các trường hợp bất khả kháng do thời tiết, thiên tai, dịch bệnh,
                  đình công, bạo động, chiến tranh hoặc do máy bay, xe lửa, tàu xe điện bị trì hoãn hay bị hủy do thời
                  tiết hoặc do kỹ thuật…</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Khiếu nại và đòi bồi thường</h5>
                <p class="text-muted">Nếu khách hàng có khiếu nại đến <b>Ban quản lý các Khu công nghiệp Thái Nguyên</b>,
                  trước
                  hết khách hàng phải thông báo cho nhân viên <b>Ban quản lý các Khu công nghiệp Thái Nguyên</b> càng
                  sớm càng tốt để
                  khắc phục vấn đề khiếu nại đó. Nếu không hài lòng, khách hàng có thể liên hệ với hotline của <b>Ban
                    quản lý các Khu công nghiệp Thái Nguyên</b> để có cơ hội khắc phục vấn đề đó.</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Bản quyền và thương hiệu</h5>
                <p class="text-muted">Bản quyền trong nội dung của trang web này thuộc về <b>Ban quản lý các Khu công
                  nghiệp Thái Nguyên</b>. Chúng tôi bảo lưu bản quyền và có toàn bộ quyền sở hữu đối với trang web này
                  và toàn
                  bộ nội dung của nó. Bạn không có quyền và không được cấp phép sử dụng thương hiệu của <b>Ban quản lý
                    các Khu công nghiệp Thái Nguyên</b></p>
              </div>
            </div>

            <div class="text-end">
              <router-link :to="{name: 'HomePage'}" class="btn btn-primary">Trang chủ</router-link>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </Layout>
</template>