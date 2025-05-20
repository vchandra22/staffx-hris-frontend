<script setup lang="ts">
import {reactive, watch} from "vue";
import {maxLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {usePositionStore} from "@/state/pinia";
import InputField from "@/components/widgets/Input";
import {showErrorToast, showSuccessToast} from "@/helpers/alert";
import type {IPosition} from "@/types/Position";

const positionStore = usePositionStore();
const emits = defineEmits(["refresh", "close"]);

const props = defineProps<{
    position: IPosition | null;
}>();

const formModel = reactive<IPosition>({
    id: "",
    name: "",
    description: "",
});

const rules = {
    name: {
        required,
        maxLength: maxLength(100)
    },
    description: {
        maxLength: maxLength(500)
    },
};

const v$ = useVuelidate(rules, formModel);

watch(() => props.position, (newPosition) => {
    if (newPosition) {
        formModel.id = newPosition.id;
        formModel.name = newPosition.name;
        formModel.description = newPosition.description || "";
    } else {
        formModel.id = "";
        formModel.name = "";
        formModel.description = "";
    }
}, {immediate: true});

const savePosition = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        showErrorToast("Please check your input.");
        return;
    }
    try {
        if (formModel.id) {
            await positionStore.updatePosition(formModel);
            showSuccessToast("Position updated successfully!");
        } else {
            await positionStore.createPosition(formModel);
            showSuccessToast("Position added successfully!");
        }
        emits("refresh");
        emits("close");
    } catch (error) {
        console.error(error);
        showErrorToast("Error while saving position.");
    }
};

defineExpose({
    savePosition
});
</script>

<template>
    <div class="space-y-4">
        <div class="mb-4">
            <InputField
                v-model="formModel.name"
                label="Position Name"
                type="text"
                placeholder="Internship"
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
                placeholder="Enter position description"
            />
            <div v-if="v$.description.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.description.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>
    </div>
</template>