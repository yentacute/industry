<script setup>
import { ref } from "vue";
import { useTileLayerStore } from "@/state/map_control/publicLayer.js";
const tileLayerStore = useTileLayerStore();
const checkDE = (de) => {
  for (let key in de) {
    if (de[key].length) return false;
  }
  return true;
};
const checkDragOpacity = ref(false);
const startDrag = (item, index, $e) => {
  $e.dataTransfer.setData("index", index);
};
const handleDrop = (item, index, $e) => {
  const indexDrag = $e.dataTransfer.getData("index");
  let tem = tileLayerStore.layersShowTile[index];
  tileLayerStore.layersShowTile[index] =
    tileLayerStore.layersShowTile[indexDrag];
  tileLayerStore.layersShowTile[indexDrag] = tem;
  tileLayerStore.changePositionLayer();
};
const handleDelete = (layerRemove) => {
  tileLayerStore.removeLayerOverlay(layerRemove);
};

const getColor = function (type, style) {
  let color = "";
  switch (type) {
    case "points":
      color = style.symbol.fill_color;
      break;
    case "lines":
      color = style.stroke_color;
      break;
    case "rasters":
      // color = style.color_map[1].color;
      break;
    case "polygons":
      color = style.fill_color;
      break;
    default:
  }
  return color;
};
</script>

<template>
  <div>
    <div v-if="!tileLayerStore.layersShowTile.length">
      <p class="p-2">Vui lòng bật lớp dữ liệu</p>
    </div>
    <template v-else>
      <div
        :draggable="!checkDragOpacity"
        @drop="(e) => handleDrop(item, index, e)"
        @dragover.prevent
        @dragenter.prevent
        @dragstart="(e) => startDrag(item, index, e)"
        style="border: 1px solid #299cdb; border-radius: 4px"
        class="mb-2 p-1"
        v-for="(item, index) in tileLayerStore.layersShowTile"
        :key="index"
      >
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="fs-14 offcanvas-title fw-bold">
            {{ item.name_display ?? "name layer" }}
          </h5>
          <ul
            class="list-inline card-toolbar-menu d-flex align-items-center mb-0"
          >
            <li class="list-inline-item">
              <div
                class="dropdown ms-sm-3 bg-transparent d-flex align-items-center gap-2"
              >
                <a
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  class="align-middle"
                  ><i class="mdi mdi-circle-opacity align-middle"></i
                ></a>
                <a href="#" class="align-middle" @click="handleDelete(item)"
                  ><i class="ri-delete-bin-fill align-bottom text-danger"></i
                ></a>
                <div
                  class="dropdown-menu dropdown-menu-start bg-transparent"
                  style="box-shadow: 0px 0px 0px 0px !important"
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    style="padding: 0px 5px !important; height: 4px"
                    @mousedown="checkDragOpacity = true"
                    @mouseup="checkDragOpacity = false"
                    @change="
                      (event) =>
                        tileLayerStore.changeOpacityLayer(
                          item,
                          event.target.value
                        )
                    "
                  />
                </div>
              </div>
            </li>
            <li></li>
          </ul>
        </div>
        <template v-if="checkDE(item.description_style)">
          <p class="mb-0 p-2 py-1">Không có chú thích nào!</p>
        </template>
        <div v-for="(value, key) in item.description_style" :key="key">
          <template v-if="value.length">
            <div
              class="ps-3 py-1 border list-group-item nested-3 list-layer-custom"
            >
              <!-- <i class="ri-drag-move-fill align-bottom handle"></i> -->
              <div class="d-flex justify-content-between align-items-center">
                <div
                  class="flex-grow-1"
                  style="overflow-wrap: break-word !important"
                >
                  <div>
                    <!-- <h6 class="mb-0">{{ key }} &nbsp;</h6> -->
                  </div>
                </div>
                <div class="flex-shrink-0"></div>
              </div>
              <div class="mt-2 row">
                <div
                  v-for="(de, deIndex) in value"
                  :key="deIndex"
                  class="col-4"
                >
                  <span :title="de.name" class="text-muted ellipsis">
                    <i
                      class="mdi mdi-checkbox-blank-circle fs-14 align-middle me-2"
                      :style="{ color: getColor(key, de) }"
                    ></i>
                    {{ de.name }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
