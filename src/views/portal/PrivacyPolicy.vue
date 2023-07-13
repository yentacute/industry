<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../layouts/main.vue';
import http from "../../helpers/api/axiosHttp";
import {CheckCircleIcon} from "@zhuowenli/vue-feather-icons";

const items = reactive([
  {
    name: "Chính sách bảo mật",
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
                <h3>CHÍNH SÁCH BẢO MẬT</h3>
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
            <p class="text-muted">Chúng tôi hiểu rằng Quý Khách Hàng rất quan tâm đến
              việc những thông tin cá nhân mà Quý Khách Hàng đã tin cậy cung cấp cho <b>Hệ thống quản lý khu công nghiệp
                Sông Công II - Tỉnh Thái Nguyên</b> được
              bảo mật và sử dụng ra sao. Chúng tôi rất trân trọng sự tin tưởng đó và
              cam kết rằng những thông tin này sẽ được Chúng tôi nỗ lực tối đa để bảo
              mật. Chúng tôi đảm bảo sẽ sử dụng thông tin khách hàng một cách hợp lý,
              có cân nhắc để không ngừng cải thiện chất lượng dịch vụ và đem lại cho Quý Khách Hàng những trải nghiệm
              thú vị khi sử dụng các dịch vụ tại trang web chúng tôi.</p>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Thu thập thông tin khách hàng</h5>
                <p class="text-muted">Để sử dụng được các dịch vụ của <b>Hệ thống quản lý khu công nghiệp
                  Sông Công II - Tỉnh Thái Nguyên</b>, Quý khách hàng có thể
                  đăng ký tài khoản và cung cấp một số thông tin như: email, họ tên, số điện thoại, ngày sinh và địa chỉ
                  và một số thông tin khác. Quý khách hàng có thể chọn không cung cấp cho
                  <b>Hệ thống quản lý khu công nghiệp Sông Công II - Tỉnh Thái Nguyên</b> một số thông tin nhất định
                  nhưng khi đó Quý Khách Hàng sẽ
                  không thể hưởng được một số tiện ích mà những tính năng của hệ thống cung cấp.</p>
                <p class="text-muted"><b>Hệ thống quản lý khu công nghiệp Sông Công II - Tỉnh Thái Nguyên</b> cũng lưu
                  trữ bất kỳ thông tin nào Quý Khách Hàng nhập trên website. Những thông tin đó sẽ được sử dụng cho mục
                  đích phản hồi yêu cầu của khách hàng, nâng cao chất lượng hàng hóa dịch vụ và liên lạc với Quý Khách
                  Hàng khi cần.</p>
              </div>
            </div>

            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Sử dụng thông tin</h5>
                <p class="text-muted mb-1">Mục đích của việc thu thập thông tin là nhằm xây dựng
                  <b>Hệ thống quản lý khu công nghiệp Sông Công II - Tỉnh Thái Nguyên</b> trở thành một website mang lại
                  nhiều tiện ích nhất cho khách hàng. Vì thế,
                  việc sử dụng thông tin sẽ phục vụ những hoạt động sau:</p>
                <ul class="list-unstyled ps-3">
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Cung
                    cấp một số tiện ích, dịch vụ hỗ trợ khách hàng
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Nâng
                    cao chất lượng dịch vụ khách hàng
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Giải
                    quyết các vấn đề, tranh chấp phát sinh liên quan đến việc sử dụng website
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Ngăn
                    chặn những hoạt động vi phạm pháp luật Việt Nam
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Chia sẻ
                    thông tin
                  </li>
                </ul>
                <p class="text-muted mb-1"><b>Hệ thống quản lý khu công nghiệp Sông Công II - Tỉnh Thái Nguyên</b> biết
                  rằng thông tin về khách hàng là một phần rất
                  quan trọng trong việc kinh doanh và những thông tin này sẽ không được bán, trao đổi cho một bên thứ ba
                  nào khác. Chúng tôi sẽ không chia sẻ thông tin khách hàng trừ những
                  trường hợp cụ thể sau đây:</p>
                <ul class="list-unstyled ps-3">
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Để bảo
                    vệ <b>Hệ thống quản lý khu công nghiệp Sông Công II - Tỉnh Thái Nguyên</b> và các bên thứ ba khác:
                    Chúng tôi
                    chỉ đưa ra thông tin tài khoản và những thông tin cá nhân khác khi tin chắc rằng việc đưa những
                    thông tin đó là phù hợp với luật pháp, bảo vệ quyền lợi, tài sản của người sử dụng dịch vụ, của
                    Chúng tôi và các bên thứ ba khác.
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Theo
                    yêu cầu pháp lý từ một cơ quan chính phủ hoặc khi Chúng tôi tin
                    rằng việc làm đó là cần thiết và phù hợp nhằm tuân theo các yêu cầu pháp lý
                  </li>
                  <li class="py-1 text-muted"><i class="mdi mdi-circle-medium me-1 text-muted align-middle"></i> Trong
                    những trường hợp còn lại, Chúng tôi sẽ có thông báo cụ thể cho Quý
                    Khách Hàng khi phải tiết lộ thông tin cho một bên thứ ba và thông tin này chỉ được cung cấp khi được
                    sự phản hồi đồng ý từ phía Quý Khách Hàng.
                  </li>
                </ul>
                <p class="text-muted mb-1">Chúng tôi cam kết không bán, chia sẻ thông
                  tin dẫn đến việc làm lộ thông tin cá nhân của khách hàng vì mục đích thương mại vi phạm những cam kết
                  được đặt ra trong quy định Chính sách bảo mật thông tin khách hàng của chúng tôi.</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Chính sách bảo vệ thông tin cá nhân</h5>
                <p class="text-muted">Chính sách bảo mật thông tin cá nhận được dựa theo Điều 68 đến Điều 73, Mục 1 Bảo
                  vệ thông tin cá nhân trong TMĐT (Chương V) quy định tại Nghị định 52/2013/NĐ-CP. Tất cả các thông tin
                  cá nhân đều được lưu trữ trong hệ thống máy chủ của Công ty TNHH Truyền thông và Công nghệ One Office
                  và được sao lưu thường xuyên dữ liệu sử dụng trên website cũng như thông tin cá nhân của khách
                  hàng.</p>
                <p class="text-muted">Thông tin chi tiết của khách hàng như họ tên, tuổi, địa chỉ, số điện thoại và
                  email sẽ được lưu trữ để đảm bảo quyền lợi cho chính khách hàng khi sử dụng dịch vụ trực tuyến. Hệ
                  thống cho phép khách hàng thay đổi thông tin cá nhân khi có nhu cầu.</p>
                <p class="text-muted">Xử lý và khắc phục sự cố ngay khi bị tin tặc đột nhập hoặc tấn công do phát sinh
                  từ môi trường truy cập của người dùng, lỗi phát sinh do đường truyền internet và bởi các phần mềm gián
                  điệp trái pháp luật khác; đồng thời có biện pháp hồi phục lại dữ liệu khi bị tin tặc tấn công, xóa
                  hoặc thay đổi thông tin.</p>
                <p class="text-muted">Cung cấp thông tin cụ thể như email, số hotline khi có khiếu nại của người tiêu
                  dùng liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo.</p>
                <p class="text-muted">Trong trường hợp hệ thống thông tin bị tấn công làm phát sinh nguy cơ mất thông
                  tin của người tiêu đùng, công ty sẽ thông báo cho cơ quan chức năng trong vòng 24 (hai mươi bốn) giờ
                  sau khi phát hiện sự cố.</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="flex-shrink-0 me-3">
                <CheckCircleIcon class="text-success icon-dual-success icon-xs"/>
              </div>
              <div class="flex-grow-1">
                <h5>Bảo mật thông tin khách hàng</h5>
                <p class="text-muted">Một điều quan trọng đối với khách hàng là việc tự bảo vệ bạn trước sự tiếp cận
                  thông tin về mật khẩu khi Quý Khách Hàng dùng chung máy tính với nhiều người. Khi đó, Quý Khách Hàng
                  phải chắc chắn đã thoát khỏi tài khoản sau khi sử dụng dịch vụ <b>Hệ thống quản lý khu công nghiệp Sông Công II - Tỉnh Thái Nguyên</b>.</p>
                <p class="text-muted">Chúng tôi cũng cam kết không cố ý tiết lộ thông
                  tin khách hàng, không bán hoặc chia sẻ thông tin khách hàng của Chúng tôi vì mục đích thương mại vi phạm những cam kết giữa chúng tôi với Quý khách hàng chiếu theo Chính
                  sách bảo mật thông tin khách hàng của Chúng tôi.</p>
                <p class="text-muted">Chúng tôi nhấn mạnh rằng chúng tôi rất quan tâm
                  đến quyền lợi của Quý khách hàng trong việc bảo vệ thông tin cá nhân nên trong trường hợp bạn có góp
                  ý, thắc mắc liên quan đến chính sách bảo mật, vui lòng kiên hệ:</p>
                <p class="text-muted ms-3"><b>Ban quản lý các Khu công nghiệp Thái Nguyên</b></p>
                <p class="text-muted ms-3"><b>Địa chỉ:</b> Phường Bách Quang, Thành phố Sông Công, Tỉnh Thái Nguyên</p>
                <p class="text-muted ms-3"><b>Điện thoại:</b> 02083 845 434 - <b>Fax:</b> 02083 845 434</p>
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