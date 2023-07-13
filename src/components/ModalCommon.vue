<template>
  <div
    :id="`modal${props.idName}`"
    class="modal fade zoomIn"
    :class="props.size"
    tabindex="-1"
    :aria-labelledby="`modal${props.idName}Label`"
    aria-hidden="true"
    style="display: none"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content modal__content-common">
        <div class="modal-header">
          <h5 class="modal-title" :id="`modal${props.idName}Label`">
            {{ props.title }}
          </h5>
          <button
            type="button"
            class="btn-close modal-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="handleClose"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="props.hideFooter">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Đóng
          </button>
          <button type="button" class="btn btn-primary">Lưu</button>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
  <!-- /.modal -->
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useCommonStore } from "../state/common";
const store = useCommonStore();
const emit = defineEmits(["close"]);
const props = defineProps({
  title: String,
  size: String,
  hideFooter: Boolean,
  idName: String,
});
const handleClose = () => {
  emit("close");
};
</script>

<style>
.modal__content-common {
  min-height: 300px;
}

@media (min-width: 576px) {
  .xxl .modal-dialog {
    max-width: 890px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
