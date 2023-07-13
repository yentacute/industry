import { defineStore } from "pinia";
import { ref } from "vue";
import { Buffer } from 'buffer';
import { useProjectViewStore, useTileLayerStore } from "./publicLayer";


export const useHandleMapLoadStore = defineStore("handleMapLoadStore", () => {
    const sharingLoadObject = ref(null)

    const set = function (sharingLoad = null) {
        sharingLoadObject.value = sharingLoad
    }

    const loadSharingObject = function () {
        const tileLayerStore = useTileLayerStore()
        if (sharingLoadObject.value?.type == "layer") {
            sharingLoadObject.value.layers.forEach(layerId => {
                tileLayerStore.addLayerIdToOverLay(layerId)
            })
            tileLayerStore.getLayerDetailByLocation(sharingLoadObject.value.detail.location)
        }
        else if (sharingLoadObject.value?.type == "project") {
            const projectStore = useProjectViewStore()
            const projectId = sharingLoadObject.value.detail.projectId
            // Xử lý khi chia sẻ đối tượng dự án
            projectStore.getDetailProject(projectId).then(data => {
                projectStore.isShowDetail = true;
            })
        }

    }
    return {
        sharingLoadObject,
        set,
        loadSharingObject
    }
})