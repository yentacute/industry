<template>
  <Layout pageLayout="map">
    <div id="map4d" class="h-100 w-100 position-absolute" style="z-index: -99; left: 0"></div>
    <div class="wb-button-container print-none">
      <div title="Basemap" class="wb-button" data-bs-toggle="collapse" data-bs-target="#collapseMapType"
           aria-expanded="true" aria-controls="collapseMapType" @click="onCloseSearch"><i
        class="mdi mdi-map-legend"></i></div>
      <div title="Home" class="wb-button"><i class="mdi mdi-home"></i></div>
      <div title="Search Location" class="wb-button" data-bs-toggle="collapse" data-bs-target="#collapseSearch"
           aria-expanded="false" aria-controls="collapseSearch" @click="onCloseMapType"><i class="mdi mdi-magnify"></i>
      </div>
      <div class="wb-button" @click="onGetCurrentURL">
        <i title="Share" class="mdi mdi-share-variant"></i>
      </div>
      <div class="wb-button ng-star-inserted" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTable"
           aria-controls="offcanvasTable">
        <i title="Table" class="ri-table-2"></i>
      </div>
    </div>
    <div class="collapse collapse-horizontal collapse__topleft" id="collapseMapType" v-outside="onCloseMapType">
      <ul class="card mb-0 mapType">
        <li v-for="(typeMap, index) in widget" :key="index">
          <input type="radio" :id="typeMap.checkMode" @change="onChangeTypeMap($event,typeMap)" checked name="type-map"
                 :value="typeMap.mapMode">
          <label :for="typeMap.checkMode"><img :src="typeMap.img" alt=""
                                               class="avatar-sm rounded cursor-pointer"></label>
        </li>
      </ul>
    </div>
    <div class="collapse collapse-horizontal collapse__topleft" id="collapseSearch">
      <div class="search-box ms-2 searchMap">
        <input type="text" class="form-control" placeholder="Tìm kiếm...">
        <i class="ri-search-line search-icon"></i>
      </div>
    </div>
    <b-modal v-model="modalShareMap" hide-footer title="Chia sẻ" modal-class="zoomIn"
             size="xl" class="v-modal-custom" centered>
      <ul class="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3" role="tablist">
        <li class="nav-item">
          <b-link class="nav-link active" data-bs-toggle="tab" href="#duong-dan" role="tab">
            Đường dẫn
          </b-link>
        </li>
        <li class="nav-item">
          <b-link class="nav-link" data-bs-toggle="tab" href="#ma-nhung" role="tab">
            Mã nhúng
          </b-link>
        </li>
      </ul>
      <div class="tab-content text-muted">
        <div class="tab-pane active" id="duong-dan" role="tabpanel">
          <div class="form-icon right mb-5">
            <input type="text" id="id_duong_dan" class="form-control form-control-icon" :value="current_url.duong_dan"
                   placeholder="Đường dẫn" readonly>
            <i title="Sao chép liên kết" class="mdi mdi-content-copy cursor-pointer fs-15"
               @click="onCopyInputText('id_duong_dan')"></i>
          </div>
          <p class="text-center text-muted my-3">Chia sẻ qua mạng xã hội</p>
          <div class="bg-light p-4">
            <div class="row my-3">
              <div class="col"></div>
              <div class="col d-flex justify-content-center">
                <div class="avatar-sm">
                  <div class="avatar-title bg-light">
                    <img src="../../../assets/images/icon/facebook_icon.png" alt=""
                         class="avatar-sm object-cover cursor-pointer">
                  </div>
                </div>
              </div>
              <div class="col d-flex justify-content-center">
                <div class="avatar-sm">
                  <div class="avatar-title bg-light">
                    <img src="../../../assets/images/icon/twitter_icon.png" alt=""
                         class="avatar-sm object-cover cursor-pointer">
                  </div>
                </div>
              </div>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="tab-pane" id="ma-nhung" role="tabpanel">
          <div class="form-icon right">
            <input type="text" id="id_ma_nhung" class="form-control form-control-icon" :value="current_url.ma_nhung"
                   placeholder="Mã nhúng" readonly>
            <i title="Sao chép mã nhúng" class="mdi mdi-content-copy cursor-pointer fs-15"
               @click="onCopyInputText('id_ma_nhung')"></i>
          </div>
          <iframe style="height: 400px;" class="w-100 mt-2"
                  src="https://map.map4d.vn/embed/map?camera=21.509041,105.838530,17.75,59.0,62.9,d"
                  title="map4d"></iframe>
        </div>
      </div>
    </b-modal>
    <vm-offsetCanvasTable></vm-offsetCanvasTable>
  </Layout>
</template>

<script>
import '../../../assets/css/map.css';
import OffsetCanvasTable from "./OffsetCanvasTable";
import Layout from "../../../layouts/main.vue";

const outside = {
  beforeMount(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value(event, el)
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },

  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}

export default {
  name: 'MapComponent',
  components: {
    Layout,
    'vm-offsetCanvasTable': OffsetCanvasTable,
  },
  directives: {
    outside
  },
  data() {
    return {
      map: null,
      widget: [
        {
          mapMode: 4,
          img: '../src/assets/images/maptype/satellite.png',
          checkMode: 'rd-satellite',
        },
        {
          mapMode: 3,
          img: '../src/assets/images/maptype/raster.png',
          checkMode: 'rd-raster',
        },
        {
          mapMode: 2,
          img: '../src/assets/images/maptype/roadMap.png',
          checkMode: 'rd-roadmap',
        },
        {
          mapMode: 1,
          img: '../src/assets/images/maptype/map3d.png',
          checkMode: 'rd-map3d',
        },

      ],
      mapObj: null,
      current_url: {
        duong_dan: '',
        ma_nhung: '',
      },
      modalShareMap: false
    }
  },
  created() {
    this.mapObj = map4d;
  },
  mounted: function () {
    this.initMap();
    /*window.history.pushState('', '', '/map?21.02105,108.5165515,0,0,r');
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    });*/
  },
  methods: {
    initMap() {
      let options = {
        center: {lat: 21.509688, lng: 105.837060},
        zoom: 17.50,
        mapType: 'map3d',
        controls: false,
        bearing: 65.6,
        tilt: 62.0,
      }
      this.map = new this.mapObj.Map(document.getElementById("map4d"), options);
    },
    onCloseMapType() {
      document.querySelector('#collapseMapType').classList.remove('show');
    },
    onCloseSearch() {
      document.querySelector('#collapseSearch').classList.remove('show');
    },
    onChangeTypeMap(event, typ) {
      switch (typ.mapMode) {
        case 1:
          this.map.setMapType(this.mapObj.MapType.map3d);
          break;
        case 2:
          this.map.setMapType(this.mapObj.MapType.roadmap);
          break;
        case 3:
          this.map.setMapType(this.mapObj.MapType.raster);
          break;
        case 4:
          this.map.setMapType(this.mapObj.MapType.satellite);
          break;
        default:

      }
    },
    onGetCurrentURL() {
      this.modalShareMap = !this.modalShareMap
      this.current_url.duong_dan = window.location.origin;
      this.current_url.ma_nhung = `<iframe src=\"${this.current_url.duong_dan}\" title=\"iframe-map4d\"></iframe>`;
    },

    onCopyInputText(inputID) {
      var copyText = document.getElementById(inputID);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText.value);
      alert("Đã sao chép");
    },
  }
}
</script>