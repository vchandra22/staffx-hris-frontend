<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { required, maxLength, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useLeaveTypeStore } from "@/state/pinia/leaveType";
import InputField from "@/components/widgets/Input";
import { showSuccessToast, showErrorToast } from "@/helpers/alert";
import { ILeaveType } from "@/types/LeaveType";

const leaveTypeStore = useLeaveTypeStore();
const emits = defineEmits(["refresh", "close"]);

const props = defineProps<{
    leaveType: ILeaveType | null;
}>();

const formModel = reactive({
    id: "",
    name: "",
    description: "",
    annual_allowance: 0,
    requires_approval: false,
    minimum_notice_days: 0,
    maximum_days_per_request: 0,
    carried_forward: false,
    carry_forward_max_days: 0,
    requires_attachment: false,
    half_day_allowed: false,
});

const rules = {
    name: { required, maxLength: maxLength(100) },
    description: { maxLength: maxLength(255) },
    annual_allowance: { required, numeric },
    requires_approval: {},
    minimum_notice_days: { required, numeric },
    maximum_days_per_request: { required, numeric },
    carried_forward: {},
    carry_forward_max_days: { numeric },
    requires_attachment: {},
    half_day_allowed: {},
};

const v$ = useVuelidate(rules, formModel);

watch(() => props.leaveType, (newLeaveType) => {
    if (newLeaveType) {
        formModel.id = newLeaveType.id;
        formModel.name = newLeaveType.name || "";
        formModel.description = newLeaveType.description || "";
        formModel.annual_allowance = newLeaveType.annual_allowance ?? 0;
        formModel.requires_approval = !!newLeaveType.requires_approval;
        formModel.minimum_notice_days = newLeaveType.minimum_notice_days ?? 0;
        formModel.maximum_days_per_request = newLeaveType.maximum_days_per_request ?? 0;
        formModel.carried_forward = !!newLeaveType.carried_forward;
        formModel.carry_forward_max_days = newLeaveType.carry_forward_max_days ?? 0;
        formModel.requires_attachment = !!newLeaveType.requires_attachment;
        formModel.half_day_allowed = !!newLeaveType.half_day_allowed;
    } else {
        formModel.id = "";
        formModel.name = "";
        formModel.description = "";
        formModel.annual_allowance = 0;
        formModel.requires_approval = false;
        formModel.minimum_notice_days = 0;
        formModel.maximum_days_per_request = 0;
        formModel.carried_forward = false;
        formModel.carry_forward_max_days = 0;
        formModel.requires_attachment = false;
        formModel.half_day_allowed = false;
    }
}, { immediate: true });

const saveLeaveType = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) {
        showErrorToast("Periksa kembali inputan Anda.");
        return;
    }
    try {
        if (formModel.id) {
            await leaveTypeStore.updateLeaveType(formModel);
            showSuccessToast("Leave Type updated successfully!");
        } else {
            await leaveTypeStore.createLeaveType(formModel);
            showSuccessToast("Leave Type added successfully!");
        }
        emits("refresh");
        emits("close");
    } catch (error) {
        console.error(error);
        showErrorToast("Terjadi kesalahan saat menyimpan Leave Type.");
    }
};

defineExpose({
    saveLeaveType
});
</script>

<template>
    <div class="space-y-4">
        <div class="mb-4">
            <InputField
                v-model="formModel.name"
                label="Name"
                type="text"
                placeholder="Enter Name"
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
                placeholder="Enter Description"
            />
            <div v-if="v$.description.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.description.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.annual_allowance"
                label="Annual Allowance"
                type="number"
                placeholder="Enter Annual Allowance"
                required
            />
            <div v-if="v$.annual_allowance.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.annual_allowance.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.requires_approval"
                label="Requires Approval"
                type="checkbox"
            />
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.minimum_notice_days"
                label="Minimum Notice Days"
                type="number"
                placeholder="Enter Minimum Notice Days"
                required
            />
            <div v-if="v$.minimum_notice_days.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.minimum_notice_days.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.maximum_days_per_request"
                label="Maximum Days Per Request"
                type="number"
                placeholder="Enter Maximum Days Per Request"
                required
            />
            <div v-if="v$.maximum_days_per_request.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.maximum_days_per_request.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.carried_forward"
                label="Carried Forward"
                type="checkbox"
            />
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.carry_forward_max_days"
                label="Carry Forward Max Days"
                type="number"
                placeholder="Enter Carry Forward Max Days"
            />
            <div v-if="v$.carry_forward_max_days.$error" class="text-red-500 text-xs mt-1">
                <span v-for="(err, index) in v$.carry_forward_max_days.$errors" :key="index">
                    {{ err.$message }}
                </span>
            </div>
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.requires_attachment"
                label="Requires Attachment"
                type="checkbox"
            />
        </div>

        <div class="mb-4">
            <InputField
                v-model="formModel.half_day_allowed"
                label="Half Day Allowed"
                type="checkbox"
            />
        </div>
    </div>
</template>
