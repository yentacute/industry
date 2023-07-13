import { reactive } from "vue";

const data = reactive({
  origin: undefined,
  destination: undefined,
  mode: "car",
  weighting: 1,
});

const methos_change = {
  setOrigin: function (location) {
    data.origin = location;
  },
  setDestination: function (location) {
    data.destination = location;
  },
};

export { data, methos_change };
