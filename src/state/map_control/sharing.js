import { defineStore } from "pinia";
import { ref } from "vue";
import { Buffer } from 'buffer';
import { useProjectViewStore, useTileLayerStore } from "./publicLayer";


export const useSharingStore = defineStore("sharingStore", () => {
    const sharingObj = ref({
        "type": "",
        "layers": [],
        "detail": {
            "location": {
                "lat": "",
                "lng": ""
            },
            "projectId": ""
        }
    })

    const resetSharingObj = function () {
        sharingObj.value = ref({
            "type": "",
            "layers": [],
            "detail": {
                "location": {
                    "lat": "",
                    "lng": ""
                }
            },
            "projectId": ""
        })
    }


    /**
     * layersActive = ['id_layer', 'id_layer']
     * infoLocation = { lat: toa_do_lat, lng: toa_do_lng }
     */
    const setSharingObj = function (layersActive, infoLocation, type = null, projectId = "") {
        sharingObj.value.type = type
        sharingObj.value.layers = layersActive
        sharingObj.value.detail.location = infoLocation
        sharingObj.value.detail.projectId = projectId
    }

    const getEncryptSharingObject = function () {
        const sharingObjStr = JSON.stringify(sharingObj.value)
        const buffer = Buffer.from(sharingObjStr)
        const base64SharingStr = buffer.toString('base64');
        console.log(base64SharingStr)
        return base64SharingStr
    }


    // Lấy về link chia sẻ đổi tượng hiện tại đang xem chi tiết
    const getEncryptCurrentObjectSharing = function () {

        // Lấy thông tin đối tượng và các lớp đang được bật tại store tileLayerStore
        const tileLayerStore = useTileLayerStore()

        const locationObject = {
            lat: tileLayerStore.objectLocation.lat,
            lng: tileLayerStore.objectLocation.lng
        }
        const listLayersId = tileLayerStore.layersShowTile.map((layer) => layer.id)

        setSharingObj(listLayersId, locationObject, "layer")
        const base64Sharing = getEncryptSharingObject()
        return base64Sharing
    }

    const getEncryptCurrentProjectSharing = function () {
        // Lấy thông tin đối tượng và các lớp đang được bật tại store tileLayerStore
        const projectViewStore = useProjectViewStore()
        
        const projectId = projectViewStore.currentProject.exactly.id
        setSharingObj(null, null, "project", projectId)
        const base64Sharing = getEncryptSharingObject()
        return base64Sharing
    }


    const getDecryptionSharingObject = function (encryptStr) {
        const buffer = Buffer.from(encryptStr, 'base64');
        const decryptionStr = buffer.toString()

        const jsonPare = JSON.parse(decryptionStr)

        return jsonPare
    }

    return {
        resetSharingObj,
        setSharingObj,
        getEncryptCurrentObjectSharing,
        getEncryptSharingObject,
        getDecryptionSharingObject,
        getEncryptCurrentProjectSharing
    }
})