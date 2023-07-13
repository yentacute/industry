<script setup>
import { defineProps, toRefs } from "vue";
import LayoutForm from "../layout/LayoutForm.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  handleClose: {
    type: Function,
    required: true,
  },
});

const { show, handleClose } = { ...toRefs(props) };
const handleSubmitCreateForm = () => {};
</script>

<template>
  <LayoutForm :show="show" :handle-close="handleClose" name="Thêm bản đồ">
    <div class="mb-3">
      <label for="name" class="form-label">Tên</label>
      <input
        type="text"
        id="name-field"
        class="form-control"
        placeholder="Tên *"
        name="name"
        required=""
      />
    </div>
    <div class="mb-3">
      <label for="phone-field" class="form-label">Mô tả</label>
      <textarea
        id="description-field"
        class="form-control"
        placeholder="Mô tả vai trò"
        name="description"
      ></textarea>
    </div>
    <div style="text-align: right">
      <button @click="handleSubmitCreateForm" class="btn btn-primary">
        Cập nhật
      </button>
    </div>
  </LayoutForm>
</template>
