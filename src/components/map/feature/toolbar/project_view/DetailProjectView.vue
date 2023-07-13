<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong Head -->

<script>
import LayoutRightNavBarVue from "../LayoutRightNavBar.vue";
import { useProjectViewStore, useActivityStore } from "../../../../../state/map_control/publicLayer.js";
import { ref } from "vue";
import ModalActivity from "./ModalActivity.vue"
import ModalShareProject from "./ModalShareProject.vue";



export default {
  data: function () {
    return {
      show: true,
      showShareModal: false,
      showActivityModal: false,
      activityStore: useActivityStore()
    };
  },
  setup: function () {
    const projectStore = useProjectViewStore();
    return { projectStore };
  },
  components: { LayoutRightNavBarVue, ModalActivity, ModalShareProject },
  mounted: function () { },
  methods: {
    setView: function () {
      this.$router.push({ name: "MapDetailProjectView" });
    },
    handleClose: function () {
      this.$router.push({ name: "MapControl" });
      this.projectStore.isShowDetail = !this.projectStore.isShowDetail
      if (this.projectStore.isShowDetail) {
        this.projectStore.clearAllDrawProject()
      }
    },
    toggleDetailProject: function (project) {
      this.projectStore.projects.results.forEach(element => {
        if (element.id == project.id) element.active = true
        else element.active = false
      });
      this.projectStore.getDetailProject(project.id).then(data => this.projectStore.isShowDetail = true)
    },
    toggleShareObjectModal: function () {
      this.showShareModal = !this.showShareModal
    },
    toggleDetailObjectActivity: function (recordId) {
      if (recordId !== null) {
        console.log(recordId)
        this.activityStore.recordId = recordId
        // Lấy thông tin hoạt động của đối tượng
      }
      this.showActivityModal = !this.showActivityModal
    }
  }
}
</script>

<template>
  <div v-if="projectStore.isShowDetail">
    <LayoutRightNavBarVue>
      <div class="card h-100">
        <div class="card-header py-2 mt-1">
          <button type="button" class="btn-close float-end fs-12 ms-2" @click="handleClose"></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Chi tiết dự án</h6>
        </div>
        <div class="card-body hover-overflowY-scroll">
          <table>
            <tr>
              <td><button class="btn btn-sm btn-success" @click="toggleShareObjectModal">Chia sẻ</button></td>
              <td></td>
            </tr>
            <tr v-for="(value, key) in projectStore.currentProject.exactly" :key="key">
              <td v-if="key !== 'geom' && key !== 'id'">
                <b>{{ key }}</b>
              </td>
              <td v-if="key !== 'geom' && key !== 'id'">
                {{ value }}
              </td>
            </tr>
            <tr>
              <td>Hoạt động:</td>
              <td><a href="javascript:void(0)"
                  @click="toggleDetailObjectActivity(projectStore.currentProject.exactly.id)">Xem chi tiết</a></td>
            </tr>
          </table>
          <p></p>
          Các dự án lân cận (bán kính 20km):
          <a href="javascript:void(0)" class="d-block" v-for="(item, index) in projectStore.currentProject.vicinity"
            :key="index" @click="toggleDetailProject(item)"> {{ index + 1 }}. {{ item.ten }}</a>
        </div>
      </div>
      <Teleport to="body">
        <div v-if="showShareModal">
          <ModalShareProject @toggleShareObjectModal="toggleShareObjectModal"></ModalShareProject>
        </div>
        <div v-if="showActivityModal">
          <ModalActivity @toggleActivityModal="toggleDetailObjectActivity">

          </ModalActivity>
        </div>
      </Teleport>
    </LayoutRightNavBarVue>
  </div>
</template>
