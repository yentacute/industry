<template>
  <div class="sidebar" id="sidebar_app">
    <div class='top-sidebar'>
      <img src='/assets/images/header-logo.svg' alt=''/>
      <span>Maps</span>
    </div>

    <div class='main-sidebar'>
      <ul>
        <li
          v-for="tab in tabs"
          v-bind:key='tab.name'
          v-bind:class="['tab-button', {'siderbar--active': currentTab === tab.name}]"
          v-on:click="toggleButton(currentTab, tab.name)">
          <i class="mdi" :class="tab.icon"></i>
          <span>{{ tab.name }}</span>
        </li>
      </ul>
      <div class="sidebar__content">
        <component :is="currentTabComponent" class="active"></component>
        <button class="close-sidebar" v-on:click="closeSideBar">
          <i class="mdi" :class="chevronLeft ? 'mdi-chevron-left' : 'mdi-chevron-right' "></i>
        </button>
      </div>
    </div>
    <canvas ref="canvas" id="grid" width="0"></canvas>
  </div>
</template>

<script>
import '../../assets/scss/frontend/sidebar.scss'
import ProjectComponent from "../../views/map/sidebar/ProjectComponent.vue";
import DatasetComponent from '../../views/map/sidebar/DatasetComponent.vue';
import AnalysesComponent from '../../views/map/sidebar/AnalysesComponent.vue';
import SatelliteComponent from '../../views/map/sidebar/SatelliteComponent.vue';
import ToolkitComponent from '../../views/map/sidebar/ToolkitComponent.vue';
import SettingsComponent from '../../views/map/sidebar/SettingsComponent.vue';

export default {
  name: "SidebarLayout",
  components: {
    'tab-project': ProjectComponent,
    'tab-datasets': DatasetComponent,
    'tab-analyses': AnalysesComponent,
    'tab-satellite': SatelliteComponent,
    'tab-toolkit': ToolkitComponent,
    'tab-settings': SettingsComponent
  },
  data() {
    return {
      currentTab: 'Project',
      isActive: false,
      tabs: [
        {
          name: 'Project',
          icon: 'mdi-map-marker'
        },
        {
          name: 'Datasets',
          icon: 'mdi-checkbox-multiple-blank'
        },
        {
          name: 'Analyses',
          icon: 'mdi-chart-bar'
        },
        {
          name: 'Satellite',
          icon: 'mdi-satellite-uplink'
        },
        {
          name: 'Toolkit',
          icon: 'mdi-cog-sync'
        },
        {
          name: 'Settings',
          icon: 'mdi-cog-sync'
        }
      ],
      footerHeight: null,
      screenWidth: null,
      screenHeight: null,
      step: null,
      canvasElementId: 'grid',
      ctx: null,
      sidebarWrap: null,
      chevronLeft: true
    }
  },


  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase();
    }

  },

  mounted() {

  },

  methods: {
    toggleButton: function (currentTab, tabName) {
      this.currentTab = tabName;
    },

    closeSideBar: function (event) {
      let self = this;
      self.sidebarWrap = document.querySelector('.sidebar__wrap');
      if (self.sidebarWrap.classList.contains('active')) {
        self.chevronLeft = false;
        self.sidebarWrap.classList.remove('active');
        if (screen.width > 801) {
          event.currentTarget.style.left = 35 + 'px';
        } else {
          event.currentTarget.style.bottom = 110 + 'px';
        }
      } else {
        self.chevronLeft = true;
        self.sidebarWrap.classList.add('active');
        if (screen.width > 801) {
          event.currentTarget.style.left = 'auto';
        } else {
          event.currentTarget.style.bottom = 58 + '%';
        }
      }
    }
  },


}
</script>