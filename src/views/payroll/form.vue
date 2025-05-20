<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { required, numeric, minValue } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { usePayrollStore } from "@/state/pinia/payroll";
import { useEmployeeStore } from "@/state/pinia";
import InputField from "@/components/widgets/Input";
import Select from "@/components/widgets/Select";
import { showSuccessToast, showErrorToast } from "@/helpers/alert";

const payrollStore = usePayrollStore();
const employeeStore = useEmployeeStore();
const emits = defineEmits(["refresh", "close"]);

const props = defineProps<{
    payroll: any | null;
}>();

const employees = ref([]);

const formModel = reactive({
    id: "",
    employee_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    base_salary: 0,
    overtime_hours: 0,
    overtime_rate: 0,
    deductions: 0,
});

const rules = {
    employee_id: { required },
    month: { required, numeric, minValue: minValue(1) },
    year: { required, numeric, minValue: minValue(2000) },
    base_salary: { required, numeric },
    overtime_hours: { required, numeric },
    overtime_rate: { required, numeric },
    deductions: { required, numeric },
};

const v$ = useVuelidate(rules, formModel);

const fetchEmployees = async () => {
    await employeeStore.getEmployees();
    employees.value = employeeStore.employees || [];
};

watch(() => props.payroll, (newPayroll) => {
    if (newPayroll) {
        formModel.id = newPayroll.id;
        formModel.employee_id = newPayroll.employee?.id || "";
        formModel.month = newPayroll.month || new Date().getMonth() + 1;
        formModel.year = newPayroll.year || new Date().getFullYear();
        formModel.base_salary = newPayroll.salary_details?.base_salary || 0;
        formModel.overtime_hours = newPayroll.salary_details?.overtime?.hours || 0;
        formModel.overtime_rate = newPayroll.salary_details?.overtime?.rate || 0;
        formModel.deductions = newPayroll.salary_details?.deductions || 0;
    } else {
        formModel.id = "";
        formModel.employee_id = "";
        formModel.month = new Date().getMonth() + 1;
        formModel.year = new Date().getFullYear();
        formModel.base_salary = 0;
        formModel.overtime_hours = 0;
        formModel.overtime_rate = 0;
        formModel.deductions = 0;
    }
}, { immediate: true });

const savePayroll = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        showErrorToast("Periksa kembali inputan Anda.");
        return;
    }
    try {
        const body = {
            employee_id: formModel.employee_id,
            month: formModel.month,
            year: formModel.year,
            base_salary: formModel.base_salary,
            overtime_hours: formModel.overtime_hours,
            overtime_rate: formModel.overtime_rate,
            deductions: formModel.deductions
        };
        if (formModel.id) {
            await payrollStore.updatePayroll({ ...body, id: formModel.id });
            showSuccessToast("Payroll updated successfully!");
        } else {
            await payrollStore.createPayroll(body);
            showSuccessToast("Payroll added successfully!");
        }
        emits("refresh");
        emits("close");
    } catch (error) {
        console.error(error);
        showErrorToast("Terjadi kesalahan saat menyimpan payroll.");
    }
};

onMounted(() => {
    fetchEmployees();
});

defineExpose({
    savePayroll
});
</script>

<template>
    <div class="space-y-4">
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <Select
                v-model="formModel.employee_id"
                :options="employees.map(emp => ({ value: emp.id, label: emp.user?.name || emp.name }))"
                placeholder="Select Employee"
                :errors="v$.employee_id.$errors.map(err => err.$message)"
                required
            />
            <div v-if="v$.employee_id.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.employee_id.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>
        <div class="mb-4 flex gap-4">
            <div class="w-1/2">
                <InputField
                    v-model="formModel.month"
                    label="Month"
                    type="number"
                    min="1"
                    max="12"
                    required
                />
                <div v-if="v$.month.$error" class="text-red-500 text-xs mt-1">
                    <span v-for="(err, index) in v$.month.$errors" :key="index">
                        {{ err.$message }}
                    </span>
                </div>
            </div>
            <div class="w-1/2">
                <InputField
                    v-model="formModel.year"
                    label="Year"
                    type="number"
                    min="2000"
                    required
                />
                <div v-if="v$.year.$error" class="text-red-500 text-xs mt-1">
                    <span v-for="(err, index) in v$.year.$errors" :key="index">
                        {{ err.$message }}
                    </span>
                </div>
            </div>
        </div>
        <div class="mb-4">
            <InputField
                v-model="formModel.base_salary"
                label="Base Salary"
                type="number"
                required
            />
            <div v-if="v$.base_salary.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.base_salary.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>
        <div class="mb-4 flex gap-4">
            <div class="w-1/2">
                <InputField
                    v-model="formModel.overtime_hours"
                    label="Overtime Hours"
                    type="number"
                    required
                />
                <div v-if="v$.overtime_hours.$error" class="text-red-500 text-xs mt-1">
                    <span v-for="(err, index) in v$.overtime_hours.$errors" :key="index">
                        {{ err.$message }}
                    </span>
                </div>
            </div>
            <div class="w-1/2">
                <InputField
                    v-model="formModel.overtime_rate"
                    label="Overtime Rate"
                    type="number"
                    required
                />
                <div v-if="v$.overtime_rate.$error" class="text-red-500 text-xs mt-1">
                    <span v-for="(err, index) in v$.overtime_rate.$errors" :key="index">
                        {{ err.$message }}
                    </span>
                </div>
            </div>
        </div>
        <div class="mb-4">
            <InputField
                v-model="formModel.deductions"
                label="Deductions"
                type="number"
                required
            />
            <div v-if="v$.deductions.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.deductions.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
