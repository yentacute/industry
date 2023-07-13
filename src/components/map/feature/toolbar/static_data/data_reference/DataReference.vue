<script>
import SelectCustomT from "../../../../../../components/custom/SelectCustomT.vue";
import { warningToast } from "../../../../../../helpers/api/toastStyle";
import { useStaticData2d } from "../../../../../../state/map_control/staticData";
import HttpRequest from "../../../../../../utils/api"
import { getMap4dDraw } from "../../../../../../utils/gisFunctionState";
import { data as mapMain } from "../../../../../../state/map_control/data_map";
import { fitBounds } from "../../../../../../common/map/function_map";
export default {
    data: function () {
        return {
            zoomToDraw: null,
            isReferenced: false,
            show: false,
            seletedReferenceId: "",
            seletedReference: {
                object: {},
                intersectDraw: null
            },
            intersects: [
                // {
                //     isIntersect: false,
                //     mapDraw: [],
                //     featuresCollection: {},
                //     acreageIntersect: 0,
                //     object: null
                // }
            ],
            seletedReferences: [
                // {
                //     object: {},
                //     intersectDraw: null
                // }
            ],
            staticData2d: useStaticData2d()
        };
    },
    setup: function () {
        return {};
    },
    components: { SelectCustomT },
    mounted: function () {
        this.staticData2d.loadDataFromLocalStorage();
        console.log(this.staticData2d.listData2dObject)
    },
    methods: {
        handleClickToggleShow: function () {
            this.show = !this.show
        },
        handleChangeSelectedReferenceId: function () {
            this.seletedReference.object = this.staticData2d.getDetail(this.seletedReferenceId)
        },
        handleSelectedReferences: function (data) {
            this.seletedReferences = []
            data.forEach(d => {
                const el = {
                    object: d,
                    mapDraw: null
                }
                this.seletedReferences.push(el)
            })
        },
        handleReference: function () {

            const poly1 = this.staticData2d.getPolygon(this.seletedReference.object)
            const poly1Draw = getMap4dDraw("Polygon", poly1)
            this.seletedReference.intersectDraw = poly1Draw
            this.seletedReference.intersectDraw.setMap(mapMain.map)

            this.seletedReferences.forEach(reference => {
                const obj = reference.object
                const poly2 = this.staticData2d.getPolygon(obj)
                const poly2Draw = getMap4dDraw("Polygon", poly2)
                reference.intersectDraw = poly2Draw
                reference.intersectDraw.setMap(mapMain.map)

                const formData = new FormData()

                formData.append("polygon1", JSON.stringify(poly1[0]))
                formData.append("polygon2", JSON.stringify(poly2[0]))
                HttpRequest.post('/intersects', formData).then(response => {
                    const { data } = response
                    if (data.is_intersect) {
                        const thisIntersect = {
                            isIntersect: true,
                            featuresCollection: data.featuresCollection,
                            mapDraw: [],
                            acreageIntersects: [],
                            object: reference.object,
                            intersectDraw: poly2Draw
                        }
                        thisIntersect.featuresCollection.features.forEach(feature => {
                            let cuDraw = null
                            const geom = feature.geometry.coordinates
                            cuDraw = getMap4dDraw("Polygon", geom)
                            thisIntersect.mapDraw.push(cuDraw)
                            cuDraw.setMap(mapMain.map)
                            const acreageIntersect = this.calculat(geom)
                            thisIntersect.acreageIntersects.push(acreageIntersect)
                        })

                        this.intersects.push(thisIntersect)
                    }
                    else {
                        this.intersects.push({
                            isIntersect: false,
                            object: reference.object
                        })
                    }
                })
            })
            this.isReferenced = !this.isReferenced
        },
        handleDrawMap: function () {

        },
        calculat: function (path) {
            try {
                let Measure = new map4d.Measure(path[0]);
                return Math.round(100 * Measure.area) / 100;
            }
            catch {
                return 241144
            }
        },
        fitBoundIntersect: function (feature) {
            if (this.zoomToDraw) this.zoomToDraw.setMap(null)
            const cuDraw = getMap4dDraw("Polygon", feature.geometry.coordinates, 0.9)
            this.zoomToDraw = cuDraw
            this.zoomToDraw.setMap(mapMain.map)
            fitBounds(feature.geometry.coordinates[0], mapMain.map)
        },
        resetDrawAll: function () {
            this.isReferenced = !this.isReferenced
            this.intersects.forEach(intersect => {
                if (intersect.isIntersect) {
                    intersect.intersectDraw.setMap(null)
                    intersect.mapDraw.forEach(draw => {
                        draw.setMap(null)
                    })
                }
            })
            this.intersects = []
            if (this.seletedReference.intersectDraw) this.seletedReference.intersectDraw.setMap(null)
            this.seletedReferences.forEach(selected => {
                if (selected.mapDraw) selected.setMap(null)
                if (selected.intersectDraw) selected.intersectDraw.setMap(null)
            })
            this.seletedReferences = []
            if (this.zoomToDraw) this.zoomToDraw.setMap(null)
        }
    },
};
</script>

<template>
    <div class="w-100">
        <div class="card h-100" style="margin-bottom: 12px; border: 1px solid #299cdb">
            <div :class="{ 'text-bg-light': !show }" class="card-head px-2 head-show text-bg-primary"
                @click="handleClickToggleShow">
                <h6 :class="{ 'text-white': show }" class="card-title mb-0 ellipsis fs-14">
                    Tham chiếu dữ liệu
                </h6>
                <i class="ri-arrow-down-s-line fs-18" style="transition: all linear 0.3s" :class="{ rotage: !show }"></i>
            </div>
            <div class="card-body" v-if="show">
                <div>
                    <label for="originPoly" class="form-label">Lớp tham chiếu:</label>
                    <select class="form-control" id="originPoly" placeholder="Được dùng để quản lý"
                        @change="handleChangeSelectedReferenceId" v-model="seletedReferenceId">
                        <option :value="obj.id" v-for="obj in staticData2d.listData2dObject">{{ obj.name }}</option>
                    </select>
                </div>
                <div>
                    <label for="message-text" class="col-form-label">
                        Danh sách lớp được tham chiếu:
                    </label>
                    <SelectCustomT ref="SelectFrom" :options="staticData2d.listData2dObject"
                        @data="handleSelectedReferences" placeholder="Chọn các lớp được tham chiếu"></SelectCustomT>
                </div>
                <p></p>
                <button v-if="!isReferenced" type="button" class="btn btn-secondary waves-effect waves-light w-100" @click="handleReference">Tham
                    chiếu</button>
                    <button v-if="isReferenced" type="button" class="btn btn-danger waves-effect waves-light w-100" @click="resetDrawAll">Hủy Tham
                    chiếu</button>
                <p></p>
                <div v-for="(intersect, index) in intersects">
                    <label class="col-form-label">
                        Tham chiếu lớp: <b>{{ seletedReference.object.name }}</b> x <b>{{ intersect.object.name }}</b>
                    </label>
                    <p v-if="!intersect.isIntersect">Không có xếp chồng giữa 2 lớp!</p>
                    <p v-if="intersect.isIntersect">
                    <p v-for="(feature, featureIndex) in intersect.featuresCollection.features">
                        <b>Vị trí xếp chồng {{ featureIndex + 1 }}</b> <br>
                        <b>- Diện tích xếp chồng: </b> {{ intersect.acreageIntersects[featureIndex] }} m <br>
                        <b>- Xem xếp chồng: </b> <button type="btn" class="btn btn-sm btn-success"
                            @click="fitBoundIntersect(feature)"> Xem </button>
                    </p>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.head-show {
    line-height: 38px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.rotage {
    transform: rotate(180deg);
}
</style>
