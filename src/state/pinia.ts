import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export { useAuthStore, useUserStore };
