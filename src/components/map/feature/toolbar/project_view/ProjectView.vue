<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import ZIndexState from "../../../../../utils/zIndexState.js";
import LayoutNavbar from "../LayoutNavbar.vue";
import { useProjectViewStore } from "../../../../../state/map_control/publicLayer";
import { useHandleMapLoadStore } from "../../../../../state/map_control/handleMapLoad"

export default {
  data: function () {
    return {
      show: false,
      searchProject: "",
      projectStore: useProjectViewStore(),
      handleLoadMapStore: useHandleMapLoadStore()
    };
  },
  setup() {
    const zIndexState = new ZIndexState("project-view");
    const { zIndex } = zIndexState.getState();
    return { zIndex };
  },
  components: { LayoutNavbar },
  mounted: function () {
    this.projectStore.getAllProjects(this.handleLoadMapStore.loadSharingObject)

  },
  methods: {
    setView: function () {
      this.$router.replace({ name: "MapProjectView" })
      this.show = true;
    },
    handleClose: function () {
      this.show = false;
      this.$router.replace("/ban-do");
      if (!this.projectStore.isShowDetail) {
        this.projectStore.clearAllDrawProject()
      }
    },
    handleSearchProject: function () {
      this.projectStore.searchProjects(this.searchProject)
    },
    toggleDetailProject: function (project) {
      const isActiveThisProject = project.active;
      this.projectStore.projects.results.forEach(element => {
        element.active = false
      });
      if (isActiveThisProject) {
        this.projectStore.getDetailProject(project.id).then(data => {
          this.projectStore.isShowDetail = true;
          project.active = true
        })
      }
      else {
        this.projectStore.clearAllDrawProject()
        this.projectStore.isShowDetail = false;
      }

    }
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbar :z-index="zIndex + 1">
      <div class="card h-100">
        <div class="card-header py-2 mt-1">
          <button type="button" class="btn-close float-end fs-12 ms-2" @click="handleClose"></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Thông tin dự án trên bản đồ hạ tầng kỹ thuật</h6>
        </div>
        <div class="card-body hover-overflowY-scroll pt-1">
          <input type="text" class="form-control" placeholder="Tìm kiếm nhanh dự án" v-model="searchProject"
            @keyup="handleSearchProject">
          <ul>
            <li class="form-check form-switch d-flex gap-3 align-items-center hover-bg"
              v-for="(project, index) in projectStore.projects.results" :key="index"
              style="line-height: 28px; border-radius: 4px">
              <div class="w-100 d-flex align-items-center gap-2">
                <input class="form-check-input" type="checkbox" role="switch" v-model="project.active"
                  :id="project.id + 'projectView'" @change="toggleDetailProject(project)" />
                <label class="form-check-label ellipsis" :for="project.id + 'projectView'">
                  {{ project.ten }}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </LayoutNavbar>
  </div>
</template>
