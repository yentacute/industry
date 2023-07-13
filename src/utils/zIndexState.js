import { reactive, watch, toRefs } from "vue";
import { useRoute } from "vue-router";

export default class ZIndexState {
  constructor(path = "") {
    const route = useRoute();
    this.state = reactive({
      zIndex: 1,
    });
    watch(
      () => route.path,
      (newValue) => {
        this.state.zIndex = 1;
        if (newValue.includes(path)) {
          this.state.zIndex = 3;
        }
      }
    );
  }

  getState() {
    return toRefs(this.state);
  }
}
