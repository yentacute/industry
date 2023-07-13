<script>
import { inject } from "vue";
import LayoutShare from "./LayoutShare.vue";

export default {
  components: { LayoutShare },
  setup: function () {
    const { show, detailsMap4D } = inject("share-bulding");
    return { show, detailsMap4D };
  },
  methods: {
    handleClose: function () {
      this.show = false;
    },
  },
};
</script>
<template>
  <div v-if="show">
    <LayoutShare>
      <div class="card h-100 pb-2">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Chia sẻ đối tượng 3D</h6>
        </div>
        <div class="card-body overflow-auto"></div>
      </div>
    </LayoutShare>
  </div>
</template>
