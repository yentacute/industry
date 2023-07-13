<script>
import {ref} from 'vue';
import {successToast, errorToast} from '../../../../../helpers/api/toastStyle';
import apiRequest from '../../../../../helpers/api/folderApi'
import {provide, toRefs} from "vue";
import {methods_map, data} from "../../../../../state/map_control/data_map.js";
import MapIotLink from "../../../../../components/map/MapIotLink.vue";
import {useTileLayerStore} from "../../../../../state/map_control/publicLayer.js";
import GetLocationMe from "../../../feature/map_control/GetLocationMe.vue"
import {TextSearchAPIMap4D} from "../../../../../common/map/function_map.js"

let temTimeOut;
export default {
  props: {},
  data: function () {
    return {
      title: "",
      content: "",
      email: "",
      phoneNumber: "",
      img: null,
      video: null,
      isUrgent: false,
      store: null,
      draw: {
        marker: null,
        location: {}
      },
      search: "",
      lstPlace: {},
      isShow: false,
      isSearch: false,
    }
  },
  setup() {
    provide("map", {
      ...toRefs(data),
    });
    provide("draw-map", {
      ...methods_map,
    });
  },
  components: {MapIotLink, GetLocationMe},
  mounted: function () {
    this.store = useTileLayerStore();
    this.draw.location = this.store.locationSelected;
    this.draw.marker = new map4d.Marker({
      position: this.draw.location,
      draggable: true
    })
  },
  methods: {
    mapMounted: function () {
      // Thêm marker vào bản đồ
      const vm = this
      setTimeout(() => {
        vm.draw.marker.setMap(data.map)
      }, 300)
      data.map.addListener("dragEnd", (args) => {
        vm.draw.location = args.location;
      }, {marker: true})
    },
    handlerSearchMap4d: function () {
      if (!this.search) {
        return;
      }
      const vm = this;
      clearTimeout(temTimeOut);
      temTimeOut = setTimeout(async () => {
        await TextSearchAPIMap4D(vm.search).then((res) => {
          if (res?.length) {
            this.isShow = true;
            vm.lstPlace = res;
          }
        });
      }, 650);
    },
    handleChoosePlace: function (item) {
      this.isShow = false;
      this.search = item.name;
      this.draw.marker.setMap(null);
      this.draw.marker = new map4d.Marker({
        position: item.location,
        draggable: true,
      })

      this.draw.marker.setMap(data.map)
      data.map.panTo(item.location)
    },
    toggleFeedbackModal: function () {
      this.$emit('toggleFeedbackObjectModal')
    },
    sendFeedback: async function () {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      const formData = new FormData()
      formData.append('image', this.img)
      formData.append('video', this.video)
      formData.append('title', this.title)
      formData.append('description', this.content)
      formData.append('email', this.email)
      formData.append('phone_number', this.phoneNumber)
      formData.append('due_date', formattedDate)
      formData.append('location', `[${this.draw.location.lat}, ${this.draw.location.lng}]`)
      formData.append('is_urgent', this.isUrgent)
      try {
        await apiRequest.post('/sipm-base/feedback/', formData);
        successToast("Gửi phản ánh đối tượng thành công!")
        this.$emit('toggleFeedbackObjectModal')
      } catch (err) {
        errorToast(err.response.data)
      }

    },
    changeMedia: function (event, mediaType) {
      if (mediaType == 'img') {
        this.img = event.target.files[0];
      } else {
        this.video = event.target.files[0];
      }
    },
    handleEmitLocationMe: function (loction) {
      this.draw.location.lat = loction.latitude;
      this.draw.location.lng = loction.longitude;
    }
  },
};
</script>

<template>
  <div class="modal fade bs-example-modal-lg show" tabindex="-1" aria-labelledby="myLargeModalLabel"
       style="display: block;" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myLargeModalLabel">Phản ánh thông tin đối tượng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  @click="toggleFeedbackModal()"></button>
        </div>
        <div class="modal-body">
          <label for="titleObjectFeedback">Tiêu đề phản ánh: </label>
          <input type="text" class="form-control" id="titleObjectFeedback" v-model="title"
                 placeholder="Sai vị trí so với thực tế">
          <p></p>
          <label for="contentObjectFeedback">Nội dung: </label>
          <textarea type="text" class="form-control" id="contentObjectFeedback" col="5" v-model="content"
                    placeholder="Sai vị trí so với thực tế …"></textarea>
          <p></p>

          <b-card no-body class="shadow-none border">
            <div class="p-2">
              <div data-input-flag>
                <input type="text" class="form-control rounded-end flag-input" v-model="search" placeholder="Tìm kiếm"
                       @keyup="handlerSearchMap4d" @focus="handlerSearchMap4d"
                       data-bs-toggle="dropdown" aria-expanded="false"/>
                <div class="dropdown-menu w-100">
                  <ul class="list-unstyled dropdown-menu-list mb-0" v-if="search && isShow">
                    <li class="dropdown-item d-flex align-items-center" v-for="item in lstPlace" :key="item.id"
                        @click="handleChoosePlace(item)">
                      <i class="mdi mdi-map-marker-radius-outline text-primary fs-14 me-3"></i>
                      <span class="text-dark"><span class="fw-semibold">
                        {{ item.name }}</span>, {{ item.address.slice(0, 65) }}
                        {{ item.address.length > 65 ? '...' : '' }}
                      </span>
                    </li>
                  </ul>
                  <div v-else-if="search && !isShow">
                    <ul class="list-unstyled dropdown-menu-list mb-0">
                      <li class="dropdown-item d-flex align-items-center">
                        <i class="mdi mdi-map-marker-remove-outline text-danger fs-14 me-3"></i>
                        <span class="text-dark">Không tìm thấy địa điểm nào</span>
                      </li>
                    </ul>
                  </div>
                  <div class="d-flex align-items-center px-3" v-else>
                    <i class="mdi mdi-marker text-muted fs-14 me-3"></i>
                    <span class="text-muted">Nhập địa điểm cần tìm</span>
                  </div>
                </div>
              </div>
              <div class="w-100 mt-2" style="height: 230px">
                <map-iot-link @map-moundted="mapMounted"></map-iot-link>
                <GetLocationMe class="position-absolute" @location-me="handleEmitLocationMe"
                               style="right: 15px;bottom: 5%;"></GetLocationMe>
              </div>
            </div>
          </b-card>
          <label for="emailObjectFeedback">Email: </label>
          <input type="text" class="form-control" id="emailObjectFeedback" v-model="email"
                 placeholder="feedback.object@gmail.com">
          <p></p>

          <label for="phoneNumberObjectFeedback">Số điện thoại (tùy chọn): </label>
          <input type="text" class="form-control" id="phoneNumberObjectFeedback" v-model="phoneNumber"
                 placeholder="0965.xxx.xxx">
          <p></p>

          <label for="imageObjectFeedback">Ảnh (tùy chọn): </label>
          <input type="file" class="form-control" id="imageObjectFeedback" accept=".jpg, .png"
                 @change="($event) => changeMedia($event, 'img')">
          <p></p>

          <label for="videoObjectFeedback">Video (tùy chọn): </label>
          <input type="file" class="form-control" id="videoObjectFeedback"
                 @change="($event) => changeMedia($event, 'video')">
          <p></p>
          <input type="checkbox" v-model="isUrgent" id="isUrgentFeedback"> <label for="isUrgentFeedback">Khẩn cấp
        </label>
          <p></p>
          <button class="btn btn-primary" @click="sendFeedback()">Gửi phản ánh</button>
        </div>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</template>

