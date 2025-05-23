<script setup>
import {useLeaveTypeStore} from "@/state/pinia/leaveType";
import {onMounted, ref} from "vue";
import Layout from "@/layouts/main.vue";
import Modal from "@/components/widgets/Modal.vue";
import Button from "@/components/widgets/Button";
import InputField from "@/components/widgets/Input";
import FormLeaveType from "@/views/leave_type/form.vue";
import {showDeleteConfirmationDialog, showSuccessToast} from "@/helpers/alert";

const leaveTypeStore = useLeaveTypeStore();
const rows = ref([]);
const leaveTypeModalRef = ref(null);
const selectedLeaveType = ref(null);
const leaveTypeModalTitle = ref("");

const getLeaveTypes = async () => {
    await leaveTypeStore.getLeaveTypes();
    rows.value = leaveTypeStore.leaveTypes || [];
};

const searchData = async () => {
    await leaveTypeStore.changePage(1);
};

const paginate = async (page) => {
    await leaveTypeStore.changePage(page);
    await getLeaveTypes();
};

const openLeaveTypeModal = (mode, id = null) => {
    leaveTypeModalRef.value?.openModal();
    if (mode === "edit" && id) {
        selectedLeaveType.value = rows.value.find((lt) => lt.id === id);
        leaveTypeModalTitle.value = "Update Leave Type";
    } else {
        selectedLeaveType.value = null;
        leaveTypeModalTitle.value = "Create New Leave Type";
    }
};

const formLeaveTypeRef = ref(null);
const submitLeaveTypeModal = () => {
    if (formLeaveTypeRef.value) {
        formLeaveTypeRef.value.saveLeaveType();
    }
};

const closeLeaveTypeModal = () => {
    leaveTypeModalRef.value.closeModal();
};

const deleteLeaveType = async (id) => {
    const confirmed = await showDeleteConfirmationDialog();
    if (confirmed) {
        try {
            await leaveTypeStore.deleteLeaveType(id);
            showSuccessToast("Leave Type berhasil dihapus");
            await getLeaveTypes();
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(() => {
    getLeaveTypes();
});
</script>

<template>
    <Layout>
        <template #title>Leave Type Data</template>
        <h6 class="font-sans antialiased font-regular text-lg text-primary md:text-xl lg:text-3xl text-current">
            List Leave Type
        </h6>
        <div class="w-full mx-auto p-4 rounded-sm bg-white dark:bg-gray-900">
            <div class="w-full p-4">
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                         data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="leaveTypeStore.searchQuery" placeholder="Search..." name="search"
                                        v-debounce:500="searchData"/>
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <Button @click="openLeaveTypeModal('add')" variant="solid" color="primary">
                            Create New Leave Type
                        </Button>
                        <Modal ref="leaveTypeModalRef" size="full">
                            <template #title>
                                <h1 class="text-xl md:text-3xl font-regular mb-2">{{ leaveTypeModalTitle }}</h1>
                            </template>
                            <template #body>
                                <FormLeaveType ref="formLeaveTypeRef" :leaveType="selectedLeaveType"
                                             @refresh="getLeaveTypes" @close="closeLeaveTypeModal"/>
                            </template>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <Button @click="closeLeaveTypeModal" variant="outline" color="secondary">
                                        Close
                                    </Button>
                                    <Button @click="submitLeaveTypeModal" variant="solid" color="primary">
                                        Submit
                                    </Button>
                                </div>
                            </template>
                        </Modal>
                    </div>
                </div>
                <div class="mt-4 w-full overflow-hidden rounded-sm border border-gray-200">
                    <table class="w-full">
                        <thead
                            class="border-b border-gray-200 bg-white text-sm font-medium text-secondary dark:bg-gray-900">
                        <tr>
                            <th class="px-2.5 py-2 text-start font-medium">Name</th>
                            <th class="px-2.5 py-2 text-start font-medium">Description</th>
                            <th class="px-2.5 py-2 text-start font-medium">Annual Allowance</th>
                            <th class="px-2.5 py-2 text-start font-medium">Requires Approval</th>
                            <th class="px-2.5 py-2 text-start font-medium">Minimum Notice Days</th>
                            <th class="px-2.5 py-2 text-start font-medium">Maximum Days/Request</th>
                            <th class="px-2.5 py-2 text-start font-medium">Carried Forward</th>
                            <th class="px-2.5 py-2 text-start font-medium">Carry Forward Max Days</th>
                            <th class="px-2.5 py-2 text-start font-medium">Requires Attachment</th>
                            <th class="px-2.5 py-2 text-start font-medium">Half Day Allowed</th>
                            <th class="px-2.5 py-2 text-end font-medium">Action</th>
                        </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                        <template v-if="leaveTypeStore.totalData > 0">
                            <tr class="border-b border-gray-200 last:border-0"
                                v-for="row in leaveTypeStore.leaveTypes"
                                :key="row.id">
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current">
                                        {{ row.name }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-gray-500">
                                        {{ row.description }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.annual_allowance }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.requires_approval ? "Yes" : "No" }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.minimum_notice_days }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.maximum_days_per_request }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.carried_forward ? "Yes" : "No" }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.carry_forward_max_days }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.requires_attachment ? "Yes" : "No" }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.half_day_allowed ? "Yes" : "No" }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <div class="flex gap-2 justify-end">
                                        <Button @click="openLeaveTypeModal('edit', row.id)" variant="outline"
                                                color="secondary">
                                            Edit
                                        </Button>
                                        <Button @click="deleteLeaveType(row.id)" variant="outline" color="error">
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-else>
                            <td colspan="12" class="border-b border-gray-200 last:border-0 ps-2 py-2 text-center">
                                No results.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between border-gray-200 py-4">
                    <small class="font-sans antialiased text-sm text-current">
                        Page {{ leaveTypeStore.totalPage != 0 ? leaveTypeStore.current : leaveTypeStore.totalPage }}
                        of {{ leaveTypeStore.totalPage }}
                    </small>
                    <div class="flex gap-2">
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="leaveTypeStore.current === 1"
                            @click="paginate(leaveTypeStore.current - 1)">Previous
                        </button>
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="leaveTypeStore.current >=
                                Math.ceil(leaveTypeStore.totalData / leaveTypeStore.perpage)
                                " @click="paginate(leaveTypeStore.current + 1)">Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
