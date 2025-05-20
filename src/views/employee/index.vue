<script setup>
import {useEmployeeStore} from "@/state/pinia";
import {onMounted, ref} from "vue";
import Layout from "@/layouts/main.vue";
import Modal from "@/components/widgets/Modal.vue";
import Button from "@/components/widgets/Button";
import InputField from "@/components/widgets/Input";
import FormEmployee from "@/views/employee/form.vue";
import {showDeleteConfirmationDialog, showSuccessToast} from "@/helpers/alert";

const employeeStore = useEmployeeStore();
const rows = ref([]);
const employeeModalRef = ref(null);
const selectedEmployee = ref(null);
const employeeModalTitle = ref("");

const getEmployees = async () => {
    await employeeStore.getEmployees();
    rows.value = employeeStore.employees || [];
};

const searchData = async () => {
    await employeeStore.changePage(1);
};

const paginate = async (page) => {
    await employeeStore.changePage(page);
    await getEmployees();
};

const openEmployeeModal = (mode, id = null) => {
    employeeModalRef.value.openModal();
    if (mode === "edit" && id) {
        selectedEmployee.value = rows.value.find((emp) => emp.id === id);
        employeeModalTitle.value = "Update Employee";
    } else {
        selectedEmployee.value = null;
        employeeModalTitle.value = "Create New Employee";
    }
};

const formEmployeeRef = ref(null);
const submitEmployeeModal = () => {
    if (formEmployeeRef.value) {
        formEmployeeRef.value.saveEmployee();
    }
};

const closeEmployeeModal = () => {
    employeeModalRef.value.closeModal();
};

const deleteEmployee = async (id) => {
    const confirmed = await showDeleteConfirmationDialog();
    if (confirmed) {
        try {
            await employeeStore.deleteEmployee(id);
            showSuccessToast("Employee berhasil dihapus");
            await getEmployees();
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(() => {
    getEmployees();
});
</script>

<template>
    <Layout>
        <template #title>Employee Data</template>
        <h6 class="font-sans antialiased font-regular text-lg text-primary md:text-xl lg:text-3xl text-current">
            List Employee
        </h6>
        <div class="w-full mx-auto p-4 rounded-sm bg-white dark:bg-gray-900">
            <div class="w-full p-4">
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                         data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="employeeStore.searchQuery" placeholder="Search..." name="search"
                                        v-debounce:500="searchData"/>
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <!-- Tombol trigger modal -->
                        <Button @click="openEmployeeModal('add')" variant="solid" color="primary">
                            Create New Employee
                        </Button>
                        <!-- Modal Form -->
                        <Modal ref="employeeModalRef" size="full">
                            <template #title>
                                <h1 class="text-xl md:text-3xl font-regular mb-2">{{ employeeModalTitle }}</h1>
                            </template>
                            <template #body>
                                <FormEmployee ref="formEmployeeRef" :employee="selectedEmployee"
                                              @refresh="getEmployees" @close="closeEmployeeModal"/>
                            </template>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <Button @click="closeEmployeeModal" variant="outline" color="secondary">
                                        Close
                                    </Button>
                                    <Button @click="submitEmployeeModal" variant="solid" color="primary">
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
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Name</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Phone</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Birth Place</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Address</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Department</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Position</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Hire Date</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Salary</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Action</small></th>
                        </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                        <template v-if="employeeStore.totalData > 0">
                            <tr class="border-b border-gray-200 last:border-0"
                                v-for="row in employeeStore.employees"
                                :key="row.id">
                                <td class="p-3">
                                    <div class="flex items-center gap-3">
                                        <div class="flex flex-col">
                                            <small class="font-sans antialiased text-sm text-current">
                                                {{ row.user?.name || '-' }}
                                            </small>
                                            <small class="font-sans antialiased text-sm text-gray-500">
                                                {{ row.user?.email || '-' }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.user?.phone_number || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <div class="flex flex-col">
                                        <small class="font-sans antialiased text-sm text-current">
                                            {{ row?.birth_place || '-' }}
                                        </small>
                                        <small class="font-sans antialiased text-sm text-gray-500">
                                            {{ row?.birth_date || '-' }}
                                        </small>
                                    </div>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row?.address || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.department?.name || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.position?.name || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.hire_date || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.salary || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <div class="flex gap-2 justify-end">
                                        <!-- Tombol Edit -->
                                        <Button @click="openEmployeeModal('edit', row.id)" variant="outline"
                                                color="secondary">
                                            Edit
                                        </Button>

                                        <!-- Tombol Delete -->
                                        <Button @click="deleteEmployee(row.id)" variant="outline" color="error">
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <tr v-else>
                            <td colspan="4" class="border-b border-gray-200 last:border-0 ps-2 py-2 text-center">
                                No results.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between border-gray-200 py-4">
                    <small class="font-sans antialiased text-sm text-current">
                        Page {{ employeeStore.totalPage != 0 ? employeeStore.current : employeeStore.totalPage }}
                        of {{ employeeStore.totalPage }}
                    </small>
                    <div class="flex gap-2">
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="employeeStore.current === 1"
                            @click="paginate(employeeStore.current - 1)">Previous
                        </button>
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="employeeStore.current >=
                                Math.ceil(employeeStore.totalData / employeeStore.perpage)
                                " @click="paginate(employeeStore.current + 1)">Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
