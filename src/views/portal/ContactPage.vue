<script>
import Layout from "../../layouts/main.vue";
import {usePost} from "../../helpers/api/api";
import {errorToast, successToast} from "../../helpers/api/toastStyle";

export default {
  components: {
    Layout
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        title: '',
        content: '',
      },
      attemptSubmit: false,
      validEmail: false,
    }
  },
  computed: {
    missingFullName: function () {
      return this.form.name === '';
    },
    missingEmail: function () {
      return this.form.email === '';
    },
    missingTitle: function () {
      return this.form.title === '';
    },
    missingContent: function () {
      return this.form.content === '';
    },
  },
  mounted() {
  },
  methods: {
    handleSubmit(event) {
      this.attemptSubmit = true;
      if (this.missingFullName || this.missingEmail || this.missingTitle || this.missingContent)
        event.preventDefault();
      else {
        let item = new FormData();
        item.append('mail_to', `['${this.form.email}']`);
        item.append('subject', '[SMART INDUSTRIAL PARK] Cảm ơn góp ý của bạn');
        item.append('body', `<p>Xin chào <b>${this.form.name}</b>,</p>
                            <p> Góp ý của bạn đã được ghi nhận. Chúng tôi sẽ xem xét và phản hồi bạn sớm nhất có thể.
                            <br>Mọi góp ý của bạn là cơ sở để phát triển hệ thống của chúng tôi</p>
                            <p>Cảm ơn và trân trọng ./</p>`);
        usePost('send-mail', item).then(data => {
          this.statusCode = data.status;
          return data.json();
        }).then(res => {
          if (this.statusCode === 201) {
            successToast("Đã gửi thông tin thành công!");
            this.form.name = '';
            this.form.email = '';
            this.form.title = '';
            this.form.content = '';
            this.attemptSubmit = false;
          } else if (this.statusCode === 400 && Object.values(res).includes("Email không hợp lệ")) {
            this.validEmail = true;
            event.preventDefault();
          } else {
            errorToast("Có lỗi xảy ra. Gửi thông tin thất bại!");
          }
        })
      }
    }
  },
  watch: {
    'form.name': function (value) {
      this.attemptSubmit = false;
    },
    'form.email': function (value) {
      this.attemptSubmit = false;
    },
    'form.title': function (value) {
      this.attemptSubmit = false;
    },
    'form.content': function (value) {
      this.attemptSubmit = false;
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <Layout pageLayout="landing" isSticky isLight>
    <section class="section nft-hero" style="padding: 12em 0 84px">
      <div class="bg-overlay opacity-25"></div>
      <div class="port">
        <img src="@/assets/images/triangle_mask_bottom.png" alt="">
      </div>
    </section>
    <section class="section bg-white pt-3" id="contact">
      <b-container>
        <b-row class="justify-content-center">
          <b-col lg="8">
            <div class="text-center mb-5">
              <h2 class="mb-4 fw-semibold">Liên hệ với chúng tôi</h2>
            </div>
          </b-col>
        </b-row>

        <b-row class="gy-4">
          <b-col lg="4">
            <div>
              <form>
                <b-row>
                  <b-col lg="12">
                    <div class="mb-3">
                      <label for="name" class="form-label fs-13">Họ và tên <span class="text-danger">*</span></label>
                      <input name="name" id="name" type="text" v-model="form.name" placeholder="Nhập tên của bạn"
                             class="form-control bg-light" :class="{ 'is-invalid': attemptSubmit && missingFullName}">
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingFullName">
                        Vui lòng nhập tên của bạn.
                      </div>
                    </div>
                  </b-col>
                  <b-col lg="12">
                    <div class="mb-3">
                      <label for="email" class="form-label fs-13">Email<span class="text-danger">*</span></label>
                      <input name="email" id="email" type="email" v-model="form.email" placeholder="Nhập email của bạn"
                             class="form-control bg-light"
                             :class="{ 'is-invalid': attemptSubmit && missingEmail || attemptSubmit && validEmail}">
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingEmail">
                        Vui lòng nhập email của bạn.
                      </div>
                      <div class="invalid-feedback d-block" v-else-if="attemptSubmit && validEmail">
                        Email không hợp lệ.
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col lg="12">
                    <div class="mb-3">
                      <label for="subject" class="form-label fs-13">Tiêu đề <span class="text-danger">*</span></label>
                      <input type="text" class="form-control bg-light " v-model="form.title"
                             placeholder="Nhập tiêu đề.."
                             name="subject" id="subject" :class="{ 'is-invalid': attemptSubmit && missingTitle}"/>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingEmail">
                        Vui lòng nhập tiêu đề.
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col lg="12">
                    <div class="mb-3">
                      <label for="comments" class="form-label fs-13">Nội dung <span class="text-danger">*</span></label>
                      <textarea name="comments" id="comments" rows="3" v-model="form.content" placeholder="Nội dung..."
                                class="form-control bg-light"
                                :class="{ 'is-invalid': attemptSubmit && missingContent}"></textarea>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingContent">
                        Vui lòng nhập nội dung.
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col lg="12" class="text-end">
                    <b-button variant="success" type="submit" @click.prevent="handleSubmit">Gửi phản hồi</b-button>
                  </b-col>
                </b-row>
              </form>
            </div>
          </b-col>
          <b-col lg="8">
            <iframe class="w-100 h-100"
                    src="https://map.map4d.vn/embed/map?camera=21.596352,105.841978,17.50,60.0,-30.0,d"
                    title="map4d"></iframe>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </Layout>
</template>