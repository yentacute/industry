<template>
  <section class="banner__container nft-hero">
    <div class="bg-overlay" style="opacity: .35;"></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-12 col-sm-10">
          <div class="text-center">
            <h2 class="fw-semibold" style="color: #f7ca2e;">CƠ SỞ HẠ TẦNG CỦA KHU CÔNG NGHIỆP SÔNG CÔNG II</h2>
            <p>Đến nay, dù cơ sở hạ tầng của KCN chưa hoàn thành 100%, tuy nhiên không ít diện tích đã được các chủ đầu
              tư đăng ký. Trong số 16 dự án có 09 dự án FDI, 07 dự án DDI, tổng số vốn đăng ký 1,3 tỷ USD và 750 tỷ
              đồng, tỷ lệ lấp đầy đạt 100%.</p>
          </div>
        </div>
      </div>
    </div>
    <a href="" class="btn btn-success btn-lg px-5">Liên hệ</a>
  </section>
</template>

<script>
</script>

<style lang="scss" scoped>
.banner__container {
  background-image: url('@/assets/images/background/bg-3.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 120px 30px;
  position: relative;
  background-position: 50% 0.00502813px;
  text-align: center;

  @media(min-width: 992px) {
    padding: 300px 0;
  }

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    border-top: 1px solid var(--vz-border-color);
    background-image: url('@/assets/images/triangle_mask_top.png');
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 96px;
    background-repeat: no-repeat;
  }

  &::after {
    content: '';
    position: absolute;
    background-image: url('@/assets/images/triangle_mask_bottom.png');
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 96px;
    background-repeat: no-repeat;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--vz-white);
    max-width: 1140px;
    margin: 0 auto 12px;
    line-height: calc(2.5rem * 1.33);
  }

  p {
    max-width: 1140px;
    margin: 0 auto;
    color: var(--vz-white);
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}

</style>