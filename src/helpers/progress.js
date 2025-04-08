import { getCurrentInstance } from "vue";

function getProgressInstance() {
    return window.$Progress || getCurrentInstance()?.appContext.config.globalProperties.$Progress;
}

// Inisialisasi global jika belum ada
if (!window.$Progress) {
    window.$Progress = null;
}

export function setProgressInstance(progress) {
    window.$Progress = progress;
}

// Pastikan `getProgressInstance` diekspor dengan benar
export { getProgressInstance };

export default {
    start() {
        getProgressInstance()?.start();
    },
    finish() {
        getProgressInstance()?.finish();
    },
    fail() {
        getProgressInstance()?.fail();
    },
    increase(value = 10) {
        getProgressInstance()?.increase(value);
    },
    decrease(value = 10) {
        getProgressInstance()?.decrease(value);
    },
    set(value = 50) {
        getProgressInstance()?.set(value);
    },
};
