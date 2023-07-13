<script>
import Layout from "../../layouts/main.vue";

export default {
  components: {
    Layout
  },
  mounted() {
  }
}
</script>

<style scoped>
.text-custom {
  color: #f7ca2e;
}

.auth-one-bg {
  background-image: url('@/assets/images/intro_page/bg-1.jpg');
}
</style>

<template>
  <Layout pageLayout="landing" isSticky isLight>
    <section class="section nft-hero">
      <div class="bg-overlay opacity-25"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 col-sm-10">
            <div class="text-center">
              <h1 class="fw-semibold mb-4 lh-base text-white text-uppercase display-custom">Hệ thống quản
                lý Khu công nghiệp Sông Công II <br><span class="text-custom">Tỉnh Thái Nguyên</span></h1>
              <!--              <p class="lead text-white-50 lh-base mb-4 pb-2">Hệ thống là công cụ hỗ trợ đắc lực cho tỉnh
                              trong công tác xây dựng chính quyền số, xã hội số.</p>-->
            </div>
          </div>
        </div>
      </div>

    </section>

    <section class="section bg-light" id="map4d-info">
      <div class="auth-page-content overflow-hidden pt-lg-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="text-center mb-5">
                <h2 class="mb-3 fw-bold text-uppercase lh-base">Nền tảng bản đồ số Map4D</h2>
                <p class="text-muted">Hiện nay tại Việt Nam chưa có nền tảng bản đồ số chính thức. Người
                  dân, doanh nghiệp và Nhà nước đang phải sử dụng nhiều nền tảng bản đồ khác nhau để phục
                  vụ các mục đích khác nhau. Do đó, cần phải có một nền tảng bản đồ dùng chung tại Việt
                  Nam, do người Việt Nam làm chủ</p>
              </div>
            </div><!-- end col -->
          </div><!-- end row -->
          <div class="row">
            <div class="col-lg-12">
              <div class="card overflow-hidden">
                <div class="row g-0">
                  <div class="col-lg-6">
                    <div class="p-lg-5 p-4 auth-one-bg h-100">
                      <div class="bg-overlay opacity-50"></div>
                      <div class="position-relative h-100 d-flex flex-column">

                        <div class="mt-auto">
                          <div class="mb-3">
                            <i class="ri-double-quotes-l display-4 text-success"></i>
                          </div>

                          <div id="qoutescarouselIndicators" class="carousel slide"
                               data-bs-ride="carousel">
                            <div class="carousel-indicators">
                              <button type="button"
                                      data-bs-target="#qoutescarouselIndicators"
                                      data-bs-slide-to="0" class="active"
                                      aria-current="true" aria-label="Slide 1"></button>
                              <button type="button"
                                      data-bs-target="#qoutescarouselIndicators"
                                      data-bs-slide-to="1" aria-label="Slide 2"></button>
                              <button type="button"
                                      data-bs-target="#qoutescarouselIndicators"
                                      data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div class="carousel-inner text-center text-white-50 pb-5">
                              <div class="carousel-item active">
                                <p class="fs-16 fst-italic fw-semibold text-white">Map4D<br>Nền
                                  tảng của các nền tảng</p>
                              </div>
                              <div class="carousel-item">
                                <p class="fs-16 fst-italic fw-semibold text-white">Dữ liệu
                                  và nền tảng công nghệ
                                  phải thuộc về Việt Nam,<br>do người Việt Nam làm chủ</p>
                              </div>
                              <div class="carousel-item">
                                <p class="fs-16 fst-italic fw-semibold text-white">Map4D<br>Giải
                                  pháp thay thế
                                  hoàn hảo Google Maps API tại Việt Nam</p>
                              </div>
                            </div>
                          </div>
                          <!-- end carousel -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- end col -->

                  <div class="col-lg-6">
                    <div class="p-lg-5 p-4">
                      <h2 class="text-primary fw-semibold text-uppercase">Map4D Platform</h2>
                      <div class="px-3">

                        <blockquote class="blockquote fs-14 mb-0 px-3">
                          <p class="text-muted fs-15 fst-italic mt-2">Map4D là nền tảng bản
                            đồ số 2D, 3D, 4D thuần Việt, đầu tiên và duy nhất tại Việt Nam.
                            Map4D
                            cho phép tích hợp dữ liệu và hiển thị tại các thời điểm khác nhau
                            với độ
                            chính xác cao.</p>
                          <p class="text-muted fs-15 fst-italic mt-2">Map4D của IOTLink là nền
                            tảng bản đồ số do chính các kỹ sư Việt Nam thực hiện dưới sự hỗ trợ
                            tư vấn của các
                            chuyên gia công nghệ hàng đầu Microsoft.</p>
                          <p class="text-muted fs-15 fst-italic mt-2">Nền tảng bản đồ Map4D sẵn
                            sàng tích hợp các loại dữ liệu được định dạng tại các hệ tọa độ khác
                            nhau thuộc nhiều lĩnh vực thành cơ sở dữ liệu dùng chung phục vụ cho
                            việc số hóa, chuyển đổi số của các Sở, Ban, Ngành trong quá trình
                            xây dựng Chính phủ điện tử cũng như các dịch vụ liên quan đến bản đồ
                            số như giao nhận vận tải, du lịch, xây dựng...vv.</p>
                        </blockquote>
                      </div>

                    </div>
                  </div>
                  <!-- end col -->
                </div>
                <!-- end row -->
              </div>
              <!-- end card -->
            </div>
            <!-- end col -->

          </div>
          <!-- end row -->
        </div>
        <!-- end container -->
      </div>
      <!-- end auth page content -->
    </section>

    <section class="section" id="tieuchi">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-5">
              <h2 class="mb-3 fw-bold text-uppercase lh-base">Đáp ứng các tiêu chí<br>Nền tảng bản đồ số Quốc
                gia
              </h2>
            </div>
          </div><!-- end col -->
        </div><!-- end row -->
        <div class="row gy-4">
          <div class="col-xxl-8">
            <div class="text-muted">
              <div class="avatar-sm icon-effect mb-4">
                <div class="avatar-title bg-transparent rounded-circle text-success h1">
                  <i class="ri-collage-line fs-36"></i>
                </div>
              </div>
              <h3 class="mb-3 fs-20">Được Bộ TTTT công nhận là nền tảng phục vụ cộng đồng</h3>
              <p class="mb-4 ff-secondary fs-16">Bộ TTTT đã phê duyệt kế hoạch phát triển nền tảng bản đồ số
                quốc gia và
                nền tảng Map4D đảm bảo đáp ứng tuân thủ quy định về bảo mật thông tin cá nhân và lưu trữ dữ
                liệu tại Việt Nam.</p>
              <p class="mb-4 ff-secondary fs-16">Đảm bảo luôn tối ưu hóa, nâng cao chất lượng của nền tảng số
                nhằm đáp
                ứng nhu cầu của đa số người dân và mở rộng triển khai rộng khắp phục vụ người dân trên
                cả nước.</p>

              <div class="row mt-4">
                <div class="col-lg-6 col-sm-6 mt-2">
                  <div class="p-2 border border-dashed rounded">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-2">
                        <div class="avatar-title rounded bg-transparent text-primary fs-24">
                          <i class="ri-lightbulb-flash-line"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h4 class="mb-0 text-primary text-uppercase fw-bold">Tiêu chí cơ bản</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end col -->
                <div class="col-lg-6 col-sm-6 mt-2">
                  <div class="p-2 border border-dashed rounded">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-2">
                        <div class="avatar-title rounded bg-transparent text-primary fs-24">
                          <i class="ri-pencil-ruler-2-line "></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h4 class="mb-0 text-primary text-uppercase fw-bold">Tiêu chí nâng cao</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end col -->
                <div class="col-lg-6 col-sm-6 mt-2">
                  <div class="p-2 border border-dashed rounded">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-2">
                        <div class="avatar-title rounded bg-transparent text-primary fs-24">
                          <i class="ri-base-station-line"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h4 class="mb-0 text-primary text-uppercase fw-bold">Tiêu chí công nghệ</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end col -->
                <div class="col-lg-6 col-sm-6 mt-2 mb-4">
                  <div class="p-2 border border-dashed rounded">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-2">
                        <div class="avatar-title rounded bg-transparent text-primary fs-24">
                          <i class="ri-centos-line"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h4 class="mb-0 text-primary text-uppercase fw-bold">Tiêu chí mở rộng</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end col -->
                <div class="col-xxl-12 mt-5">
                  <blockquote class="blockquote fs-14">
                    <p class="text-danger fw-semibold">Theo <a
                      class="text-info text-decoration-underline"
                      href="https://sotttt.thainguyen.gov.vn/documents/1243573/8516901/20220707111656.pdf/4df7712c-f9d3-4205-91c1-e6b944d41cec">
                      Quyết định Số 1137/QĐ-BTTTT
                    </a> “Phê duyệt
                      kế hoạch thúc đẩy phát triển và sử dụng nền tảng Bản đồ số quốc gia”</p>


                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xxl-4">
            <div class="card bg-info">
              <img src="@/assets/images/intro_page/bg-2.png" alt=""
                   class="img-fluid rounded border-danger mx-auto" style="padding: 2px">
            </div>
          </div>
          <!-- end col -->
        </div>

      </div>
      <!-- end container -->
    </section>

    <section class="section bg-light" id="dichvu">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-5">
              <h2 class="mb-3 fw-bold text-uppercase lh-base">Map4D Service API</h2>
              <p class="text-muted">Nền tảng cung cấp các API dịch vụ và cho phép người dùng và các đơn
                vị phát triển ứng dụng, phần mềm có thể sử dụng để phát
                triển các hệ thống một cách nhanh chóng và hiệu quả cho từng nghiệp vụ
                mong muốn</p>
            </div>
          </div><!-- end col -->
        </div><!-- end row -->
        <!-- end row -->

        <div class="row g-3">
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-stack-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Bản đồ số 3D trên điện thoại (IOS, Android) (Mobile
                  Native 3D Maps (IOS &Android)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-map-2-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Bản đồ số 3D trên web
                  (Web 3D Maps)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-road-map-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Bản đồ số 2D trên điện thoại (IOS, Android) (Mobile
                  Native 2D Maps (IOS & Android)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-map-pin-fill fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Bản đồ số 2D trên web
                  (Web 2D Maps)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-guide-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Dự đoán thời gian di chuyển giữa 2 điểm (Route
                  Estimated time of Arrival)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-find-replace-fill fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Tìm kiếm địa chỉ
                  (Place Search)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->

          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class="ri-earth-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Tìm địa chỉ bằng tọa độ/
                  Chuyển đổi tọa độ sang địa điểm(Place Geocoding)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class=" ri-treasure-map-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Chỉ đường, dẫn đường(Route Direction)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class=" ri-map-pin-range-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Cung cấp khoảng cách và thời gian di chuyển cho một
                  ma trận gồm nhiều điểm (Distance Matrix)</h5>
              </div>
            </div>
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
        <div class="row justify-content-center">
          <div class="col-lg-4">
            <div class="d-flex p-3">
              <div class="flex-shrink-0 me-3">
                <div class="avatar-sm icon-effect">
                  <div class="avatar-title bg-transparent text-success rounded-circle">
                    <i class=" ri-pin-distance-line fs-36"></i>
                  </div>
                </div>
              </div>
              <div class="flex-grow-1">
                <h5 class="text-muted my-3 ff-secondary">Thông tin địa chỉ(Place Detail)</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end container -->
    </section>

    <section class="section" id="ungdung-map4d">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-5">
              <h2 class="mb-3 fw-bold text-uppercase lh-base">Ứng dụng Map4D <br> trong phát triển kinh tế,
                chuyển đổi số
              </h2>
              <p class="text-muted">Map4D có khả năng ứng dụng cho tất cả các
                ngành, từ nhà nước, doanh nghiệp đến cộng đồng</p>
            </div>
          </div><!-- end col -->
        </div><!-- end row -->

        <div class="row g-4">
          <div class="col-xxl-4">
            <div class="card border card-border-secondary h-100">
              <div class="card-header text-center">
                <h4 class="card-title mb-0 text-uppercase fw-bold">Nhà nước </h4>
              </div>
              <div class="card-body">
                <h5 class="mb-4 fw-semibold text-secondary">Sẵn sàng với những giải pháp chuyển đổi số đa
                  lĩnh vực</h5>
                <ul class="list-unstyled text-muted vstack gap-3 ff-secondary mx-3 mt-2">
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Quản lý đất đai
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Xây dựng: Quy hoạch, Hạ tầng đô thị
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Giao thông vận tải
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Du lịch
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Nông nghiệp...
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-xxl-4">
            <div class="card border card-border-secondary h-100">
              <div class="card-header text-center">
                <h4 class="card-title mb-0 text-uppercase fw-bold">Doanh nghiệp </h4>
              </div>
              <div class="card-body">
                <h5 class="mb-4 fw-semibold text-secondary">Nền tảng sáng tạo các giải pháp chuyển đổi số
                  doanh nghiệp</h5>
                <ul class="list-unstyled text-muted vstack gap-3 ff-secondary mx-3 mt-2">
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Địa chỉ số
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Logictics
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Taxi
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Bất động sản
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Du lịch...
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-xxl-4">
            <div class="card border card-border-secondary h-100">
              <div class="card-header text-center">
                <h4 class="card-title mb-0 text-uppercase fw-bold">Cộng đồng </h4>
              </div>
              <div class="card-body">
                <h5 class="mb-4 fw-semibold text-secondary">Các dịch vụ chuyển đổi số cho cuộc sống</h5>
                <ul class="list-unstyled text-muted vstack gap-3 ff-secondary mx-3 mt-2">
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Tra cứu dữ liệu bản đồ: Giao thông, thời tiết
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Tiện ích trên bản đồ
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Thu thập dữ liệu trên bản đồ
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Cảnh báo trên bản đồ
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="d-flex">
                      <div class="flex-shrink-0 text-success me-1">
                        <i class="ri-checkbox-circle-fill fs-15 align-middle"></i>
                      </div>
                      <div class="flex-grow-1">
                        Chia sẻ bản đồ
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>