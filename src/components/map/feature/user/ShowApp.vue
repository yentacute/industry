<script>
export default {
  data: function () {
    return {
      show: false,
      apps: [],
    };
  },
  mounted: function () {
    const vm = this;
    window.addEventListener("click", () => {
      vm.handleClose();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        vm.handleClose();
      }
    });
  },
  methods: {
    handleClose: function () {
      this.show = false;
    },
    handleToggle: function () {
      this.show = !this.show;
    },
  },
};
</script>

<template>
  <div v-if="show" @click.stop="" class="position-absolute p-3" style="
      top: 100%;
      right: 0;
      width: 328px;
      height: 448px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 1px 2px 0 #3c40434d, 0 2px 6px 2px #3c404326;
    ">
    <div class="hover-overflowY-scroll" style="">
      <div class="row">
        <div class="col-4 hover-bg p-2 d-flex flex-column justify-content-center align-items-center cursor-pointer"
          style="border-radius: 10px">
          <i class="ri-donut-chart-line fs-24"></i>
          <b class="text-capitalize ellipsis">App ne</b>
        </div>
      </div>
    </div>
  </div>
</template>
