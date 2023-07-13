<template>
    <div class="tab__details">
      <b-card no-body>
        <b-card-body>
          <div class="tab-content text-muted h-100">
            <TabDetailActivities v-if="store.dataStructure" />
          </div>
        </b-card-body>
      </b-card>
    </div>
  </template>
  
  <script setup>
  import { defineProps, onMounted, ref, reactive, computed, watch, provide, toRefs } from 'vue';
  import { Field, ErrorMessage, Form } from 'vee-validate';
  import { useFolderStore } from '../../state/folder';
  import apiRequest from '../../helpers/api/folderApi';
  import Swal from 'sweetalert2';
  import MapIotLinkVue from '../map/MapIotLink.vue';
  import { data, methods_map } from '../../state/map_control/data_map';
  import { useCommonStore } from '../../state/common';
  import { useMapStore } from '../../state/map';
  import { successToast, errorToast } from '../../helpers/api/toastStyle';
  import TabDetailActivities from './TabDetailActivities.vue';
  import { useActivitiesStore } from '../../state/activities'
  
  const store = useFolderStore();
  const common = useCommonStore();
  const map = useMapStore();
  const activitiesStore = useActivitiesStore();
  const isDataTab = ref(false);
  const currentId = ref(store.modelId)
  const storeData = ref({});
  
  provide("map", {
    ...toRefs(data),
  });
  provide("draw-map", {
    ...methods_map,
  });
  
  const getDataStructure = async (id) => {
    const { data } = await apiRequest.get(`/${store.slug}/layer/${id}/`);
    store.dataStructure = data;
    console.log(store.dataStructure);
    storeData.value = data;
    store.tableData = data.construct.fields;
    store.nameDisplay = storeData.value.name_display;
    store.tags = storeData.value.tags;
    store.description = storeData.value.description;
    store.apiDatabase = data?.data_model;
    store.wmsInfo = data?.wms_info;
    activitiesStore.modelName = data.model;
  };
  
  const addEventTidle = () => {
    if (!data?.map) {
      setTimeout(() => {
        addEventTidle()
      }, 300)
      return
    }
    data.map.addListener(
      "idle",
      (args) => {
        // reloadLayerOnMoveMap();
      },
      {}
    );
  }
   
  
  watch(() => store.modelId, async (newValue) => {
    currentId.value = newValue;
    await getDataStructure(newValue);
    store.getDatabase(store.apiDatabase);
    addEventTidle();
  });
  onMounted(async () => {
    await getDataStructure(currentId.value);
    store.getDatabase(store.apiDatabase);
    document.querySelectorAll('.nav__menu--bar-tabs .nav-item').forEach(item => {
      item.addEventListener('click', function () {
        if (item.getAttribute('data-type') !== 'database') {
          isDataTab.value = false;
        }
        if (item.getAttribute('data-type') !== 'general') {
          store.isInfoTab = false;
        }
      })
    })
  
  });
  
  
  </script>