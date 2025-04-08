import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "@/state/pinia";
import VueApexCharts from "vue3-apexcharts";
import VueDatePicker from "@vuepic/vue-datepicker";
import VueProgressBar from "@aacassandra/vue3-progressbar";
import "./assets/index.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "@vueform/multiselect/themes/default.css";
import "@vueform/slider/themes/default.css";
import "quill/dist/quill.snow.css";
import vDebounce from "./directives/vDebounce";
import { registerScrollSpy } from "vue3-scroll-spy";
import { vMaska } from "maska";
import { Money3Directive } from "v-money3";
import { initMaterialTailwind } from "@material-tailwind/html";
import { setProgressInstance } from "./helpers/progress";
import { axiosInterceptors } from "./core/interceptor/axios-interceptor"; // Import interceptor

initMaterialTailwind();

// Konfigurasi warna dari CSS root
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue("--bs-primary").trim();
const dangerColor = rootStyles.getPropertyValue("--bs-danger").trim();

const optionsProgressBar = {
    color: "#4CAF50", // Warna hijau untuk progress bar
    failedColor: "#F44336", // Warna merah jika request gagal
    thickness: "4px",
    transition: {
        speed: "0.2s",
        opacity: "0.6s",
        termination: 300,
    },
    autoRevert: true,
    autoFinish: false,
    location: "top",
    inverse: false,
};

const app = createApp(App)
    .use(pinia)
    .use(router)
    .use(VueApexCharts)
    .use(VueProgressBar, optionsProgressBar)
    .use(registerScrollSpy)
    .directive("debounce", vDebounce)
    // .directive('mask', vMask)
    .directive("maska", vMaska)
    .directive("money3", Money3Directive);

    
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");

// Simpan instance progress bar
setProgressInstance(app.config.globalProperties.$Progress);

axiosInterceptors();