import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { useDepartmentStore } from "./pinia/department";
import { usePositionStore } from "./pinia/position";
import { useEmployeeStore } from "./pinia/employee";
import { usePayrollStore } from "./pinia/payroll";
import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export {
    useAuthStore,
    useUserStore,
    useDepartmentStore,
    usePositionStore,
    useEmployeeStore,
    usePayrollStore,
};
