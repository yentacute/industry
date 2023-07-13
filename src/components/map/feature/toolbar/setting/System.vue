<script setup>
import { inject, ref } from "vue";
import {
  pastTime,
  futureTime,
} from "../../../../../common/map/function_map.js";

const methods_map = inject("draw-map");
const data_map = inject("map");

const currentTime = ref(new Date().getFullYear());
const setWeather = (name, title, classIcon, active = false, weather) => {
  return {
    name: name,
    title: title,
    icon: classIcon,
    active: active,
    weather: weather,
  };
};

const WeartherMenu = ref([
  setWeather(
    "Tự động",
    "Hiệu ứng thời gian thực",
    "mdi mdi-weather-sunny",
    true
  ),
  setWeather(
    "Nắng",
    "Hiệu ứng thời tiết có nắng",
    "mdi mdi-weather-sunny",
    false,
    "sunny"
  ),
  setWeather(
    "Mưa",
    "Hiệu ứng thời tiết có mưa rơi",
    "mdi mdi-weather-pouring",
    false,
    "rainy"
  ),
  setWeather(
    "Tuyết",
    "Hiệu ứng thời tiết có tuyết rơi",
    "mdi mdi-weather-snowy",
    false,
    "snowy"
  ),
]);

const handleChangDimeDimension = function () {
  methods_map.SetDateMap(new Date(currentTime.value, 0, 1));
};

const handChangeActive = (weather) => {
  WeartherMenu.value.forEach((item) => {
    if (item.weather === weather) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};

const setWeatherMap = (weather) => {
  handChangeActive(weather);
  data_map.map.value.setWeather(weather);
};
</script>

<template>
  <div class="tab-content text-muted mt-3">
    <div class="tab-pane d-flex flex-column gap-3">
      <div
        class="card-body m-t-10"
        style="box-shadow: rgb(102, 102, 102) 0px 0px 2px; border-radius: 3px"
      >
        <div class="">
          <p class="mb-0" style="font-weight: 700; color: black">Thời tiết</p>
          <div
            class="p-3 w-100 d-flex justify-content-center gap-4 align-content-center"
          >
            <button
              v-for="(item, index) in WeartherMenu"
              :key="index"
              :title="item.title"
              :class="{ 'border-danger': item.active }"
              @click="setWeatherMap(item.weather)"
              class="btn btn-light"
            >
              <i :class="item.icon" class="fs-16"></i>
            </button>
          </div>
        </div>
      </div>
      <div
        class="card-body m-t-10 w-100"
        style="box-shadow: rgb(102, 102, 102) 0px 0px 2px; border-radius: 3px"
      >
        <div class="d-flex justify-content-between">
          <div class="w-100">
            <p class="mb-0" style="font-weight: 700; color: black">
              Chiều thời gian 4D
            </p>
            <div
              class="w-100 text-center row"
              style="margin: 20px 20px 20px -12px"
            >
              <span class="col-12">{{ currentTime }}</span>
              <div class="align-items-center d-flex justify-content-center">
                {{ pastTime }}
                <input
                  type="range"
                  :min="pastTime"
                  :max="futureTime"
                  v-model="currentTime"
                  @change="handleChangDimeDimension"
                />
                {{ futureTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
