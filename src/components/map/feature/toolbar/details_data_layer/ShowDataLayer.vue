<script setup>
import { defineProps, ref, inject, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useTileLayerStore, useActivityStore } from "../../../../../state/map_control/publicLayer.js"
import ModalShareObject from "./ModalShareObject.vue";
import ModalFeedbackObject from "./ModalFeedbackObject.vue";
import ModalActivity from "./ModalActivity.vue"

const activityStore = useActivityStore()
const tileLayerStore = useTileLayerStore();
const rouer = useRouter()

const data_direct = inject("direct");

const props = defineProps({
  detailLayer: {
    type: Object,
    default: function () {
      return {};
    },
  },
});

const show = ref(false);
const showShareModal = ref(false)
const showFeedbackModal = ref(false)
const showActivityModal = ref(false)

const handleClickToggleShow = function () {
  show.value = !show.value;
};

const handleClickDetailLayer = function () {
  if (props.detailLayer.detail.status === 'err') return;

  if (show.value) {
    tileLayerStore.addLayerDetailDraw(props.detailLayer)
  }
  else {
    tileLayerStore.removeLayerDetailDraw(props.detailLayer)
  }
};

const getObjValue = function (obj, fieldName) {
  return obj[`${fieldName}`] ? obj[`${fieldName}`] : "nan"
}

const toggleShareObjectModal = function () {
  showShareModal.value = !showShareModal.value
}

const toggleFeedbackObjectModal = function () {
  showFeedbackModal.value = !showFeedbackModal.value
}

const toggleDirectToObject = function () {
  console.log(tileLayerStore.objectLocation)
  data_direct.destination = tileLayerStore.objectLocation;
  rouer.replace({ name: "MapDirect" })
}

const toggleDetailObjectActivity = function (recordId=null) {
  if (recordId !== null)
  {
    activityStore.recordId = recordId
    // Lấy thông tin hoạt động của đối tượng
  }
  showActivityModal.value = !showActivityModal.value
}

</script>

<template>
  <div class="w-100"  v-if="props.detailLayer.detail.status !== 'err'">
    <div class="card h-100 overflow-hidden" style="margin-bottom: 12px; border: 1px solid #299cdb">
      <div :class="{ 'text-bg-light': !show }" class="card-head px-2 head-show text-bg-primary" @click="{
        handleClickToggleShow();
                                                                                  // Xử lý thêm sự kiện click thì highlight lớp đang xem chi tiết lên
                                                                                  handleClickDetailLayer()
      }">
        <h6 :class="{ 'text-white': show }" class="card-title mb-0 ellipsis fs-14">
          {{ props.detailLayer.name_display }}
        </h6>
        <i class="ri-arrow-down-s-line fs-18" style="transition: all linear 0.3s" :class="{ rotage: !show }"></i>
      </div>
      <div class="card-body" v-if="show">
        <ul v-if="props.detailLayer.detail.status === 'err'">
          <li>
            <span>{{ props.detailLayer.detail.msg }}</span>
          </li>
        </ul>
        <ul v-else>
          <table>
            <tr>
              <td>
                <button class="btn btn-sm btn-primary" @click="toggleDirectToObject">Chỉ đường</button>
              </td>
              <td>
                <button class="btn btn-sm btn-success" @click="toggleShareObjectModal">Chia sẻ</button>
                <button style="margin-left: 20px;" class="btn btn-sm btn-danger p-l-5"
                  @click="toggleFeedbackObjectModal">Phản ánh</button>
              </td>
            </tr>
            <tr v-for="(field, fieldIndex) in props.detailLayer.detail.data.fields" :key="field">
              <td v-if="field.name !== 'geom'">
                <b>{{ field.verbose_name ? field.verbose_name : field.name }}:</b>
              </td>
              <td v-if="field.name !== 'geom'">
                {{ getObjValue(props.detailLayer.detail.data.record, field.name) }}
              </td>
            </tr>
            <tr>
              <td>Hoạt động:</td>
              <td><a href="javascript:void(0)" @click="toggleDetailObjectActivity(props.detailLayer.detail.data.record['id'])">Xem chi tiết</a></td>
            </tr>
          </table>
        </ul>
      </div>
      <Teleport to="body">
        <div v-if="showShareModal">
          <ModalShareObject @toggleShareObjectModal="toggleShareObjectModal"></ModalShareObject>
        </div>
        <div v-if="showFeedbackModal">
          <ModalFeedbackObject @toggleFeedbackObjectModal="toggleFeedbackObjectModal"></ModalFeedbackObject>
        </div>
        <div v-if="showActivityModal">
          <ModalActivity @toggleActivityModal="toggleDetailObjectActivity">

          </ModalActivity>
        </div>
      </Teleport>
    </div>
  </div>
</template>


<style scoped>
.head-show {
  line-height: 38px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.rotage {
  transform: rotate(180deg);
}
</style>
