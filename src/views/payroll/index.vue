<script setup>
import {usePayrollStore} from "@/state/pinia/payroll";
import {onMounted, ref} from "vue";
import Layout from "@/layouts/main.vue";
import Modal from "@/components/widgets/Modal.vue";
import Button from "@/components/widgets/Button";
import InputField from "@/components/widgets/Input";
import FormPayroll from "@/views/payroll/form.vue";
import {showDeleteConfirmationDialog, showSuccessToast} from "@/helpers/alert";

const payrollStore = usePayrollStore();
const rows = ref([]);
const payrollModalRef = ref(null);
const selectedPayroll = ref(null);
const payrollModalTitle = ref("");

const getPayrolls = async () => {
    await payrollStore.getPayrolls();
    rows.value = payrollStore.payrolls || [];
};

const searchData = async () => {
    await payrollStore.changePage(1);
};

const paginate = async (page) => {
    await payrollStore.changePage(page);
    await getPayrolls();
};

const openPayrollModal = (mode, id = null) => {
    payrollModalRef.value.openModal();
    if (mode === "edit" && id) {
        selectedPayroll.value = rows.value.find((p) => p.id === id);
        payrollModalTitle.value = "Update Payroll";
    } else {
        selectedPayroll.value = null;
        payrollModalTitle.value = "Create New Payroll";
    }
};

const formPayrollRef = ref(null);
const submitPayrollModal = () => {
    if (formPayrollRef.value) {
        formPayrollRef.value.savePayroll();
    }
};

const closePayrollModal = () => {
    payrollModalRef.value.closeModal();
};

const deletePayroll = async (id) => {
    const confirmed = await showDeleteConfirmationDialog();
    if (confirmed) {
        try {
            await payrollStore.deletePayroll(id);
            showSuccessToast("Payroll deleted successfully");
            await getPayrolls();
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(() => {
    getPayrolls();
});
</script>

<template>
    <Layout>
        <template #title>Payroll Data</template>
        <h6 class="font-sans antialiased font-regular text-lg text-primary md:text-xl lg:text-3xl text-current">
            List Payroll
        </h6>
        <div class="w-full mx-auto p-4 rounded-sm bg-white dark:bg-gray-900">
            <div class="w-full p-4">
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                         data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="payrollStore.searchQuery" placeholder="Search..." name="search"
                                        v-debounce:500="searchData"/>
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <Button @click="openPayrollModal('add')" variant="solid" color="primary">
                            Create New Payroll
                        </Button>
                        <Modal ref="payrollModalRef" size="full">
                            <template #title>
                                <h1 class="text-xl md:text-3xl font-regular mb-2">{{ payrollModalTitle }}</h1>
                            </template>
                            <template #body>
                                <FormPayroll ref="formPayrollRef" :payroll="selectedPayroll"
                                             @refresh="getPayrolls" @close="closePayrollModal"/>
                            </template>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <Button @click="closePayrollModal" variant="outline" color="secondary">
                                        Close
                                    </Button>
                                    <Button @click="submitPayrollModal" variant="solid" color="primary">
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
                            <th class="px-2.5 py-2 text-start font-medium">Employee</th>
                            <th class="px-2.5 py-2 text-start font-medium">Department</th>
                            <th class="px-2.5 py-2 text-start font-medium">Position</th>
                            <th class="px-2.5 py-2 text-start font-medium">Base Salary</th>
                            <th class="px-2.5 py-2 text-start font-medium">Overtime</th>
                            <th class="px-2.5 py-2 text-start font-medium">Deductions</th>
                            <th class="px-2.5 py-2 text-start font-medium">Net Salary</th>
                            <th class="px-2.5 py-2 text-start font-medium">Period</th>
                            <th class="px-2.5 py-2 text-start font-medium">Created At</th>
<!--                            <th class="px-2.5 py-2 text-end font-medium">Action</th>-->
                        </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                        <template v-if="payrollStore.totalData > 0">
                            <tr class="border-b border-gray-200 last:border-0"
                                v-for="row in payrollStore.payrolls"
                                :key="row.id">
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current">
                                        {{ row.employee?.name || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-gray-500">
                                        {{ row.employee?.department?.name || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-gray-500">
                                        {{ row.employee?.position?.name || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.salary_details.base_salary?.toLocaleString() || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.salary_details.overtime?.pay?.toLocaleString() || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.salary_details.deductions?.toLocaleString() || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.salary_details.net_salary?.toLocaleString() || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.period || '-' }}
                                    </small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.created_at || '-' }}
                                    </small>
                                </td>
<!--                                <td class="p-3">-->
<!--                                    <div class="flex gap-2 justify-end">-->
<!--                                        <Button @click="openPayrollModal('edit', row.id)" variant="outline"-->
<!--                                                color="secondary">-->
<!--                                            Edit-->
<!--                                        </Button>-->
<!--                                        <Button @click="deletePayroll(row.id)" variant="outline" color="error">-->
<!--                                            Delete-->
<!--                                        </Button>-->
<!--                                    </div>-->
<!--                                </td>-->
                            </tr>
                        </template>
                        <tr v-else>
                            <td colspan="7" class="border-b border-gray-200 last:border-0 ps-2 py-2 text-center">
                                No results.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between border-gray-200 py-4">
                    <small class="font-sans antialiased text-sm text-current">
                        Page {{ payrollStore.totalPage != 0 ? payrollStore.current : payrollStore.totalPage }}
                        of {{ payrollStore.totalPage }}
                    </small>
                    <div class="flex gap-2">
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="payrollStore.current === 1"
                            @click="paginate(payrollStore.current - 1)">Previous
                        </button>
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="payrollStore.current >=
                                Math.ceil(payrollStore.totalData / payrollStore.perpage)
                                " @click="paginate(payrollStore.current + 1)">Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
