import { debounce } from "lodash";

export default {
  mounted(el, binding) {
    if (typeof binding.value !== "function") {
      console.warn("v-debounce hanya menerima fungsi sebagai parameter.");
      return;
    }

    const delay = binding.arg ? parseInt(binding.arg) : 500;
    el.oninput = debounce(binding.value, delay);
  },
};
