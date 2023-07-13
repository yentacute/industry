<script setup>
import { defineProps, toRefs, onMounted, onUnmounted } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  handleClose: {
    type: Function,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
});

const { show, name, handleClose } = { ...toRefs(props) };

const handleKeyUp = (event) => {
  if (event.key === "Escape") {
    handleClose.value();
  }
};

onMounted(() => {
  window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<template>
  <div
    v-if="show"
    @mousedown="handleClose"
    class="d-flex justify-content-center position-fixed"
    style="background-color: #ffffffcc; inset: 0; z-index: 2000"
  >
    <div
      class="my-md-5 w-100"
      style="
        max-width: 700px;
        box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
        background-color: #fff;
        border-radius: 8px;
      "
      @mousedown.stop=""
    >
      <div class="card h-100">
        <div class="card-header text-bg-light">
          <div class="d-flex justify-content-between align-items-center">
            <div></div>
            <h5 class="m-0 p-0" style="font-weight: bold">{{ name }}</h5>
            <div
              class="d-flex justify-content-center align-items-center cursor-pointer"
              style="border-radius: 50%; width: 36px; height: 36px"
              @click="handleClose"
              onmouseover="this.style.backgroundColor='#03030320';"
              onmouseout="this.style.backgroundColor=''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="card-body mb-3" style="overflow-y: scroll">
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
