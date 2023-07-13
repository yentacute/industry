<template>
  <ModalCommon
    size="modal-ld"
    title="Thêm mới"
    :hide-footer="false"
    id-name="AddNewDataForm"
  >
    <Form @submit="submitForm" id="formData">
      <div class="row">
        <div class="col-12">
          <div
            v-for="(item, key) in store.tableData"
            :key="key"
            class="form-group"
          >
            <div
              style="
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
              "
            >
              <div
                v-if="item.name == 'geom'"
                class="btn btn-success"
                style=""
                @click="goModal2d"
              >
                Đối tượng 2D
              </div>
              <div
                v-if="item.name == 'geom'"
                class="btn btn-info"
                @click="handleClickShowFormAdd3d"
                data-bs-toggle="modal"
                data-bs-target="#modalAddForm3D"
              >
                Đối tượng 3D
              </div>
            </div>
            <label class="form-label"> {{ item.name }}</label>
            <div style="position: relative">
              <Field
                v-if="
                  store.getFieldType(item.data_type) === 'textarea' &&
                  item.data_type !== 'json'
                "
                :name="item.name"
                as="textarea"
                :placeholder="item.name"
                class="form-control mb-3"
                id="input-geom"
                v-model="map.inputData"
              />

              <Field
                v-else-if="item.data_type == 'json'"
                :name="item.name"
                :placeholder="item.name"
                class="form-select mb-3"
                v-model="map.inputData"
              >
                {{ allObject.value }}
                <select
                  name=""
                  id=""
                  class="form-select"
                  v-if="allObject && allObject.length"
                >
                  <option
                    v-for="(item, key) in allObject"
                    :value="item.id"
                    :key="key"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </Field>
              <Field
                v-else
                :name="item.name"
                :type="store.getFieldType(item.data_type)"
                class="form-control mb-3"
                :placeholder="item.name"
                :id="`input-` + item.name"
                v-model="dataModel[item.name.toLowerCase()]"
              />
              <!-- <div
                v-if="item.name == 'geom'"
                class="btn btn-success"
                style="position: absolute; top:15%; right:10px ; z-index: 10;"
              >
                2D
              </div> -->
            </div>
            <ErrorMessage :name="item.name" />
          </div>
        </div>
        <div class="col-6">
          <b-card no-body>
            <!-- <b-card-body>
              <ul
                class="nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3"
                role="tablist"
              >
                <li class="nav-item">
                  <b-link
                    class="nav-link active"
                    data-bs-toggle="tab"
                    href="#object2d"
                    role="tab"
                  >
                    Đối tượng 2D
                  </b-link>
                </li>
                <li class="nav-item">
                  <b-link
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#profile1"
                    role="tab"
                  >
                    Đối tượng 3D
                    <FormAdd3DObject ref="popupAdd3d"></FormAdd3DObject>
                  </b-link>
                </li>
              </ul>

              <div class="tab-content text-muted">
                <div class="tab-pane active" id="object2d" role="tabpanel">
                  <div class="d-flex">
                    <div class="flex-grow-1 ms-2">
                      <SearchMap
                        api-url="http://api.map4d.vn/sdk/place/text-search"
                      />
                      <div class="sync-group">
                        <button
                          type="button"
                          class="btn btn-danger w-sm border-top-0 search-btn"
                          @click="map.resetMap()"
                        >
                          Đặt lại
                        </button>
                        <button
                          type="button"
                          class="btn btn-primary w-sm border-top-0 search-btn"
                          @click="map.syncGeom"
                        >
                          Đồng bộ
                        </button>
                      </div>
                      <MapAddForm />
                    </div>
                  </div>
                </div>
                <div class="tab-pane" id="profile1" role="tabpanel">
                  <div class="d-flex">
                    <div class="flex-grow-1 ms-2">
                      <div class="mb-3 ms-3"></div>
                      <div class="my-3 ms-0 row">
                        <AddNewPosition
                          @dataPosition="dataPosition"
                          :fixForm="true"
                        />
                      </div>
                      <div class="my-3 ms-0 row">
                        <Map3dOject />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </b-card-body> -->
          </b-card>
        </div>
        <div class="btn-save d-flex">
          <button
            type="button"
            class="btn btn-danger btn-md mt-5 mx-2"
            data-bs-dismiss="modal"
          >
            Huỷ
          </button>
          <button type="submit" class="btn btn-success btn-md mt-5">Lưu</button>
        </div>
      </div>
    </Form>
  </ModalCommon>
  <b-modal
    v-model="isModal2d"
    hide-footer
    body-class="p-0"
    header-class="p-3"
    modal-class="zoomIn"
    class="v-modal-custom"
    title="Đối tượng 2D"
    content-class="border-0 overflow-hidden"
    centered
  >
    <div class="profile-offcanvas">
      <div class="tab-pane active" id="object2d" role="tabpanel">
        <div class="d-flex">
          <div class="flex-grow-1 ms-2">
            <SearchMap api-url="http://api.map4d.vn/sdk/place/text-search" />
            <div
              class="sync-group d-flex justify-content-between align-items-center"
            >
              <div>
                <select class="form-select" v-model="typeDraw2d">
                  <option value="linestring">linestring</option>
                  <!-- <option value="circle">circle</option> -->
                  <option value="point">point</option>
                  <option value="polygon">polygon</option>
                  <!-- <option value="geometry">geometry</option> -->
                  <option value="rectangle">rectangle</option>
                </select>
              </div>
              <div class="d-flex align-items-center">
                <button
                  type="button"
                  class="btn btn-danger w-sm border-top-0 search-btn"
                  @click="map.resetMap()"
                >
                  Đặt lại
                </button>
                <button
                  type="button"
                  class="btn btn-primary w-sm border-top-0 search-btn"
                  @click="goToSync"
                >
                  Đồng bộ
                </button>
              </div>
            </div>
            <MapAddForm @click="handleClickMap2D" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
  <!-- <b-modal
    v-model="isModal3d"
    hide-footer
    body-class="p-0"
    header-class="p-3"
    modal-class="zoomIn"
    class="v-modal-custom"
    title="Đối tượng 3D"
    content-class="border-0 overflow-hidden"
    centered
  >
    <div class="profile-offcanvas">
      <div class="tab-pane active" id="object2d" role="tabpanel">
        <div class="d-flex">
          <div class="flex-grow-1 ms-2">
            <SearchMap api-url="http://api.map4d.vn/sdk/place/text-search" />
            <div class="sync-group">
              <button
                type="button"
                class="btn btn-danger w-sm border-top-0 search-btn"
                @click=" map.resetMap()"
              >
                Đặt lại
              </button>
              <button
                type="button"
                class="btn btn-primary w-sm border-top-0 search-btn"
                @click="goToSync"
              >
                Đồng bộ
              </button>
            </div>
            <MapAddForm />
          </div>
        </div>
      </div>
    </div>
  </b-modal> -->
  <FormAdd3DObject ref="popupAdd3d"></FormAdd3DObject>
</template>
<script setup>
import FormAdd3DObject from "../map/FormAdd3DObject.vue";
import { useFolderStore } from "../../state/folder";
import ModalCommon from "../ModalCommon.vue";
import { Field, ErrorMessage, Form } from "vee-validate";
// import * as yup from "yup";
import SearchMap from "../SearchMap.vue";
import { useMapStore } from "../../state/map";
import { reactive, ref, onMounted } from "vue";
import Map3dOject from "../map/Map3dOject.vue";
import { useCommonStore } from "../../state/common";
import { useObjectStore } from "../../state/object3d";
import MapAddForm from "../map/MapAddForm.vue";
import AddNewPosition from "./AddNewPosition.vue";

// import { watch } from "fs";
const popupAdd3d = ref(null);
const store = useFolderStore();
const map = useMapStore();
const common = useCommonStore();
const { getAllObject, allObject } = useObjectStore();
const geomEl = ref(null);
const dataModel = reactive({});
const dataPositionMap = ref("");
const typeDraw2d = ref("linestring");
const goModal2d = () => {
  isModal2d.value = true;
};
const goModal3d = () => {
  isModal3d.value = true;
};
const isModal2d = ref(false);
const isModal3d = ref(false);
const goToSync = () => {
  map.syncGeom(typeDraw2d.value);
  isModal2d.value = false;
};
const goToResetAsync = () => {
  map.resetMap();
};
const handleClickShowFormAdd3d = () => {
  popupAdd3d.value.handleSetView();
};
const submitForm = () => {
  dataModel["geom"] = map.geomData;
  store.addNewField(store.apiDatabase, {
    ...dataModel,
    id: dataPositionMap.value,
  });
  console.log(1231, store.apiDatabase, dataModel);
  document.querySelector("#formData").reset();
  map.resetMap();
  store.closeModel();
};
const dataPosition = (data) => {
  console.log(5555, data);
  dataPositionMap.value = data;
  // store.addPositionMap(store.apiDatabase, data);
};

const handleClickMap2D = () => {
  map.handleDrawMap2dManageData(typeDraw2d.value);
};
// const
onMounted(() => {
  getAllObject();
});
</script>
