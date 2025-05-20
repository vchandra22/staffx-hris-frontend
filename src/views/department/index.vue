<script setup>
import {useDepartmentStore} from "@/state/pinia";
import {onMounted, ref} from "vue";
import Layout from "@/layouts/main.vue";
import Modal from "@/components/widgets/Modal.vue";
import Button from "@/components/widgets/Button";
import InputField from "@/components/widgets/Input";
import FormDepartment from "@/views/department/form.vue";
import {showDeleteConfirmationDialog, showSuccessToast} from "@/helpers/alert";

const departmentStore = useDepartmentStore();
const rows = ref([]);
const departmentModalRef = ref(null);
const selectedDepartment = ref(null);
const departmentModalTitle = ref("");

const getDepartments = async () => {
    await departmentStore.getDepartments();
    rows.value = departmentStore.departments || [];
};

const searchData = async () => {
    await departmentStore.changePage(1);
};

const paginate = async (page) => {
    await departmentStore.changePage(page);
    await getDepartments();
};

const openDepartmentModal = (mode, id = null) => {
    departmentModalRef.value.openModal();
    if (mode === "edit" && id) {
        selectedDepartment.value = rows.value.find((dept) => dept.id === id);
        departmentModalTitle.value = "Update Department";
    } else {
        selectedDepartment.value = null;
        departmentModalTitle.value = "Create New Department";
    }
};

const formDepartmentRef = ref(null);
const submitDepartmentModal = () => {
    if (formDepartmentRef.value) {
        formDepartmentRef.value.saveDepartment();
    }
};

const closeDepartmentModal = () => {
    departmentModalRef.value.closeModal();
};

const deleteDepartment = async (id) => {
    const confirmed = await showDeleteConfirmationDialog();
    if (confirmed) {
        try {
            await departmentStore.deleteDepartment(id);
            showSuccessToast("Department berhasil dihapus");
            await getDepartments();
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(() => {
    getDepartments();
});
</script>

<template>
    <Layout>
        <template #title>Department Data</template>
        <h6 class="font-sans antialiased font-regular text-lg text-primary md:text-xl lg:text-3xl text-current">
            List Department
        </h6>
        <div class="w-full mx-auto p-4 rounded-sm bg-white dark:bg-gray-900">
            <div class="w-full p-4">
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                         data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="departmentStore.searchQuery" placeholder="Search..." name="search"
                                        v-debounce:500="searchData"/>
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <!-- Tombol trigger modal -->
                        <Button @click="openDepartmentModal('add')" variant="solid" color="primary">
                            Create New Department
                        </Button>
                        <!-- Modal Form -->
                        <Modal ref="departmentModalRef">
                            <template #title>
                                <h1 class="text-xl md:text-3xl font-regular mb-2">{{ departmentModalTitle }}</h1>
                            </template>
                            <template #body>
                                <FormDepartment ref="formDepartmentRef" :department="selectedDepartment"
                                                @refresh="getDepartments" @close="closeDepartmentModal"/>
                            </template>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <Button @click="closeDepartmentModal" variant="outline" color="secondary">
                                        Close
                                    </Button>
                                    <Button @click="submitDepartmentModal" variant="solid" color="primary">
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
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Nama</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Deskripsi</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">
                            </small></th>
                        </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                        <template v-if="departmentStore.totalData > 0">
                            <tr class="border-b border-gray-200 last:border-0"
                                v-for="row in departmentStore.departments"
                                :key="row.id">
                                <td class="p-3">
                                    <div class="flex items-center gap-3">
                                        <div class="flex flex-col">
                                            <small class="font-sans antialiased text-sm text-current">
                                                {{ row.name }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-3">
                                    <small class="font-sans antialiased text-sm text-current opacity-70">
                                        {{ row.description || '-' }}</small>
                                </td>
                                <td class="p-3">
                                    <div class="flex gap-2 justify-end">
                                        <!-- Tombol Edit -->
                                        <Button @click="openDepartmentModal('edit', row.id)" variant="outline"
                                                color="secondary">
                                            Edit
                                        </Button>

                                        <!-- Tombol Delete -->
                                        <Button @click="deleteDepartment(row.id)" variant="outline" color="error">
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <tr v-else>
                            <td colspan="3" class="border-b border-gray-200 last:border-0 ps-2 py-2 text-center">
                                No results.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between border-gray-200 py-4">
                    <small class="font-sans antialiased text-sm text-current">
                        Page {{ departmentStore.totalPage != 0 ? departmentStore.current : departmentStore.totalPage }}
                        of {{ departmentStore.totalPage }}
                    </small>
                    <div class="flex gap-2">
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="departmentStore.current === 1"
                            @click="paginate(departmentStore.current - 1)">Previous
                        </button>
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="departmentStore.current >=
                                Math.ceil(departmentStore.totalData / departmentStore.perpage)
                                " @click="paginate(departmentStore.current + 1)">Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
