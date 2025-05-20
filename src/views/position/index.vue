<script setup>
import {usePositionStore} from "@/state/pinia";
import {onMounted, ref} from "vue";
import Layout from "@/layouts/main.vue";
import Modal from "@/components/widgets/Modal.vue";
import Button from "@/components/widgets/Button";
import InputField from "@/components/widgets/Input";
import FormPosition from "@/views/position/form.vue";
import {showDeleteConfirmationDialog, showSuccessToast} from "@/helpers/alert";

const positionStore = usePositionStore();
const rows = ref([]);
const positionModalRef = ref(null);
const selectedPosition = ref(null);
const positionModalTitle = ref("");

const getPositions = async () => {
    await positionStore.getPositions();
    rows.value = positionStore.positions || [];
};

const searchData = async () => {
    await positionStore.changePage(1);
};

const paginate = async (page) => {
    await positionStore.changePage(page);
    await getPositions();
};

const openPositionModal = (mode, id = null) => {
    positionModalRef.value.openModal();
    if (mode === "edit" && id) {
        selectedPosition.value = rows.value.find((pos) => pos.id === id);
        positionModalTitle.value = "Update Position";
    } else {
        selectedPosition.value = null;
        positionModalTitle.value = "Create New Position";
    }
};

const formPositionRef = ref(null);
const submitPositionModal = () => {
    if (formPositionRef.value) {
        formPositionRef.value.savePosition();
    }
};

const closePositionModal = () => {
    positionModalRef.value.closeModal();
};

const deletePosition = async (id) => {
    const confirmed = await showDeleteConfirmationDialog();
    if (confirmed) {
        try {
            await positionStore.deletePosition(id);
            showSuccessToast("Position deleted successfully");
            await getPositions();
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(() => {
    getPositions();
});
</script>

<template>
    <Layout>
        <template #title>Position Data</template>
        <div>
            <h6 class="font-sans antialiased font-regular text-lg text-primary md:text-xl lg:text-3xl text-current">
                List Positions
            </h6>
        </div>
        <div class="w-full mx-auto p-4 rounded-sm bg-white dark:bg-gray-900">
            <div class="w-full p-4">
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                         data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="positionStore.searchQuery" placeholder="Search..." name="search"
                                        v-debounce:500="searchData"/>
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <Button @click="openPositionModal('add')" variant="solid" color="primary">
                            Create New Position
                        </Button>
                        <Modal ref="positionModalRef">
                            <template #title>
                                <h1 class="text-xl md:text-3xl font-regular mb-2">{{ positionModalTitle }}</h1>
                            </template>
                            <template #body>
                                <FormPosition ref="formPositionRef" :position="selectedPosition"
                                              @refresh="getPositions" @close="closePositionModal"/>
                            </template>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <Button @click="closePositionModal" variant="outline" color="secondary">
                                        Close
                                    </Button>
                                    <Button @click="submitPositionModal" variant="solid" color="primary">
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
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">Description</small>
                            </th>
                            <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">
                            </small></th>
                        </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                        <template v-if="positionStore.totalData > 0">
                            <tr class="border-b border-gray-200 last:border-0"
                                v-for="row in positionStore.positions"
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
                                        <Button @click="openPositionModal('edit', row.id)" variant="outline"
                                                color="secondary">
                                            Edit
                                        </Button>
                                        <Button @click="deletePosition(row.id)" variant="outline" color="error">
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
                        Page {{ positionStore.totalPage != 0 ? positionStore.current : positionStore.totalPage }}
                        of {{ positionStore.totalPage }}
                    </small>
                    <div class="flex gap-2">
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="positionStore.current === 1"
                            @click="paginate(positionStore.current - 1)">Previous
                        </button>
                        <button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="positionStore.current >=
                                Math.ceil(positionStore.totalData / positionStore.perpage)
                                " @click="paginate(positionStore.current + 1)">Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
