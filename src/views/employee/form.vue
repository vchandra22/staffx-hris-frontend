<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { required, maxLength, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useEmployeeStore, useDepartmentStore, usePositionStore } from "@/state/pinia";
import InputField from "@/components/widgets/Input";
import { showSuccessToast, showErrorToast } from "@/helpers/alert";
import type { IEmployee } from "@/types/Employee";
import type { IDepartment } from "@/types/Department";
import type { IPosition } from "@/types/Position";
import Select from "@/components/widgets/Select";
import Datepicker from "@/components/widgets/DatePicker";

const employeeStore = useEmployeeStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();
const emits = defineEmits(["refresh", "close"]);

const props = defineProps<{
    employee: IEmployee | null;
}>();

const departments = ref<IDepartment[]>([]);
const positions = ref<IPosition[]>([]);

const formModel = reactive({
    id: "",
    user: {
        name: "",
        email: "",
    },
    birth_place: "",
    birth_date: "",
    address: "",
    department_id: "",
    position_id: "",
    hire_date: "",
    salary: 0,
});

const rules = {
    user: {
        name: {
            required,
            maxLength: maxLength(100)
        },
        email: {
            required,
            maxLength: maxLength(100)
        }
    },
    birth_place: {
        required,
        maxLength: maxLength(100)
    },
    birth_date: {
        required
    },
    address: {
        required,
        maxLength: maxLength(255)
    },
    department_id: {
        required
    },
    position_id: {
        required
    },
    hire_date: {
        required
    },
    salary: {
        required,
        numeric
    }
};

const v$ = useVuelidate(rules, formModel);

const fetchDepartments = async () => {
    await departmentStore.getDepartments();
    departments.value = departmentStore.departments || [];
};

const fetchPositions = async () => {
    await positionStore.getPositions();
    positions.value = positionStore.positions || [];
};

watch(() => props.employee, (newEmployee) => {
    if (newEmployee) {
        formModel.id = newEmployee.id;
        formModel.user.name = newEmployee.user?.name || "";
        formModel.user.email = newEmployee.user?.email || "";
        formModel.birth_place = newEmployee.birth_place || "";
        formModel.birth_date = newEmployee.birth_date || "";
        formModel.address = newEmployee.address || "";
        formModel.department_id = newEmployee.department?.id || "";
        formModel.position_id = newEmployee.position?.id || "";
        formModel.hire_date = newEmployee.hire_date || "";
        formModel.salary = newEmployee.salary || 0;
    } else {
        formModel.id = "";
        formModel.user.name = "";
        formModel.user.email = "";
        formModel.birth_place = "";
        formModel.birth_date = "";
        formModel.address = "";
        formModel.department_id = "";
        formModel.position_id = "";
        formModel.hire_date = "";
        formModel.salary = 0;
    }
}, { immediate: true });

const saveEmployee = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        showErrorToast("Periksa kembali inputan Anda.");
        return;
    }
    try {
        if (formModel.id) {
            await employeeStore.updateEmployee(formModel);
            showSuccessToast("Employee updated successfully!");
        } else {
            await employeeStore.createEmployee(formModel);
            showSuccessToast("Employee added successfully!");
        }
        emits("refresh");
        emits("close");
    } catch (error) {
        console.error(error);
        showErrorToast("Terjadi kesalahan saat menyimpan employee.");
    }
};

onMounted(() => {
    fetchDepartments();
    fetchPositions();
});

defineExpose({
    saveEmployee
});
</script>

<template>
    <div class="space-y-4">
        <div class="mb-4">
            <InputField
                v-model="formModel.user.name"
                label="Nama"
                type="text"
                placeholder="Masukkan Nama"
                required
            />
            <div v-if="v$.user.name.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.user.name.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.user.email"
                label="Email"
                type="email"
                placeholder="Masukkan Email"
                required
            />
            <div v-if="v$.user.email.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.user.email.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.birth_place"
                label="Tempat Lahir"
                type="text"
                placeholder="Masukkan Tempat Lahir"
                required
            />
            <div v-if="v$.birth_place.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.birth_place.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.birth_date"
                label="Tanggal Lahir"
                type="date"
                placeholder="Masukkan Tanggal Lahir"
                required
            />
            <div v-if="v$.birth_date.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.birth_date.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.address"
                label="Alamat"
                type="textarea"
                placeholder="Masukkan Alamat"
                required
            />
            <div v-if="v$.address.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.address.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <Select
                v-model="formModel.department_id"
                :options="departments.map(dept => ({ value: dept.id, label: dept.name }))"
                placeholder="Select Department"
                :errors="v$.department_id.$errors.map(err => err.$message)"
                required
            />
            <div v-if="v$.department_id.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.department_id.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>

            <Select
                v-model="formModel.position_id"
                :options="positions.map(pos => ({ value: pos.id, label: pos.name }))"
                placeholder="Select Position"
                :errors="v$.position_id.$errors.map(err => err.$message)"
                required
            />
            <div v-if="v$.position_id.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.position_id.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <Datepicker
                v-model="formModel.hire_date"
                label="Tanggal Bergabung"
                placeholder="Masukkan Tanggal Bergabung"
                :errors="v$.hire_date.$error ? v$.hire_date.$errors.map(e => e.$message) : []"
            />
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.salary"
                label="Gaji"
                type="number"
                placeholder="Masukkan Gaji"
                required
            />
            <div v-if="v$.salary.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.salary.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>
    </div>
</template>
