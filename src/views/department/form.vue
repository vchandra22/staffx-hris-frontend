<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { required, maxLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useDepartmentStore } from "@/state/pinia";
import InputField from "@/components/widgets/Input";
import { showSuccessToast, showErrorToast } from "@/helpers/alert";
import type { IDepartment } from "@/types/Department";

const departmentStore = useDepartmentStore();
const emits = defineEmits(["refresh", "close"]);

const props = defineProps<{
    department: IDepartment | null;
}>();

const formModel = reactive<IDepartment>({
    id: 0,
    name: "",
    description: "",
});

const rules = {
    name: {
        required,
        maxLength: maxLength(100)
    },
    description: {
        maxLength: maxLength(255)
    },
};

const v$ = useVuelidate(rules, formModel);

watch(() => props.department, (newDepartment) => {
    if (newDepartment) {
        formModel.id = newDepartment.id;
        formModel.name = newDepartment.name;
        formModel.description = newDepartment.description || "";
    } else {
        formModel.id = 0;
        formModel.name = "";
        formModel.description = "";
    }
}, { immediate: true });

const saveDepartment = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        showErrorToast("Periksa kembali inputan Anda.");
        return;
    }
    try {
        if (formModel.id) {
            await departmentStore.updateDepartment(formModel);
            showSuccessToast("Department updated successfully!");
        } else {
            await departmentStore.createDepartment(formModel);
            showSuccessToast("Department added successfully!");
        }
        emits("refresh");
        emits("close");
    } catch (error) {
        console.error(error);
        showErrorToast("Terjadi kesalahan saat menyimpan department.");
    }
};

defineExpose({
    saveDepartment
});
</script>

<template>
    <div class="space-y-4">
        <div class="mb-4">
            <InputField
                v-model="formModel.name"
                label="Nama Department"
                type="text"
                placeholder="Masukkan Nama Department"
                required
            />
            <div v-if="v$.name.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.name.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.description"
                label="Description"
                type="textarea"
                placeholder="Masukkan deskripsi department"
                required
            />
            <div v-if="v$.description.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.description.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>
    </div>
</template>
