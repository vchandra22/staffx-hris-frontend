<script setup>
import { useUserStore } from "@/state/pinia";
import { ref, onMounted, reactive, computed } from "vue";
import Layout from "@/layouts/main.vue";
import Modal from "@/components/widgets/Modal.vue";
import ImageCropper from "@/components/widgets/cropper";
import InputField from "@/components/widgets/input";
import Button from "@/components/widgets/button"
import { required, email, minLength } from "@vuelidate/validators"; // Import Validator
import {
    showSuccessToast,
    showErrorToast,
    showDeleteConfirmationDialog,
} from "@/helpers/alert.js";
import useVuelidate from "@vuelidate/core";

const rows = ref([]);
const userStore = useUserStore();

const getUsers = async () => {
    await userStore.getUsers();
    if (userStore.users) {
        rows.value = userStore.users || [];
    } else {
        rows.value = [];
    }
};
const searchData = async () => {
    await userStore.changePage(1);
    await getUsers();
};
const paginate = async (page) => {
    await userStore.changePage(page);
    await getUsers();
};

onMounted(() => {
    getUsers();
});

// ** Aturan Validasi **
const rules = {
    name: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) }, // Min 6 karakter
};

const imageUrl = ref("");
const croppedImageUrl = ref("");
const formModel = reactive({
    id: "",
    name: "",
    email: "",
    password: "",
    photo: "",
});
const userModalRef = ref(null);
var userModalTitle = ref(false);
const openUserModal = (mode, id = null) => {
    userModalRef.value.openModal();
    if (mode === "edit" && id) {
        const user = rows.value.find((user) => user.id === id);
        if (user) {
            formModel.id = user.id;
            formModel.name = user.name;
            formModel.email = user.email;
            formModel.password = ""; // Password should be handled securely
            userModalTitle.value = "Ubah User";
            imageUrl.value = user.photo_url;
        }
    } else {
        formModel.id = "";
        formModel.name = "";
        formModel.email = "";
        formModel.password = "";
        formModel.photo = "";
        userModalTitle.value = "Tambah User";
        imageUrl.value = "";
    }
};

// Fungsi untuk menutup modal dari luar komponen modal
const closeUserModal = () => {
    userModalRef.value.closeModal();
};
// Fungsi untuk menutup modal dari luar komponen modal
const afterCloseUserModal = () => {
};

const statusCode = computed(() => userStore.response.status);
const errorList = computed(() => userStore.response?.error || {});
const errorMessage = computed(() => userStore.response?.message || "");
const v$ = useVuelidate(rules, formModel);

const saveUser = async () => {

    const isValid = await v$.value.$validate(); // Cek validasi
    if (!isValid) {
        showErrorToast("Periksa kembali inputan Anda.");
        return;
    }
    try {
        if (formModel.id) {
            await userStore.updateUser(formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to add user", errorMessage.value);
            } else {
                await getUsers(); // Refresh the user list after deletion
                closeUserModal();
                showSuccessToast("User Edited successfully!");
            }
        } else {
            await userStore.addUsers(formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to add user", errorMessage.value);
            } else {
                await getUsers(); // Refresh the user list after deletion
                closeUserModal();
                showSuccessToast("User added successfully!");
            }
        }
    } catch (error) {
        console.error(error);
        showErrorToast("Failed to add user", errorMessage.value);
    }
};
const deleteUser = async (id) => {
    // Tampilkan dialog konfirmasi
    const confirmed = await showDeleteConfirmationDialog();

    // Jika konfirmasi
    if (confirmed) {
        try {
            await userStore.deleteUser(id);
            showSuccessToast("User berhasil dihapus");
            await getUsers(); // Refresh the user list after deletion
        } catch (error) {
            showErrorToast("Terjadi kesalahan saat menghapus user");
        }
    }
};

const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
];
</script>

<template>
    <Layout>
        <template #title>User Data </template>
        <div class="w-full mx-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
            <div class="w-full">
                <div class="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <h6 class="font-sans antialiased font-bold text-base md:text-lg lg:text-xl text-current">
                            List User
                        </h6>
                        <p class="font-sans antialiased text-base text-current mt-1">lihat informasi untuk semua user
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div class="flex data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row gap-2"
                        data-orientation="horizontal">
                        <div class="relative w-full md:w-72">
                            <InputField v-model="userStore.searchQuery" placeholder="Search..." name="search"
                                @input="searchData" />
                        </div>
                    </div>
                    <div class="w-full md:w-72 flex justify-end">
                        <!-- Tombol trigger modal -->
                        <Button @click="openUserModal('add')" variant="solid" color="primary">
                            Tambah User
                        </Button>

                        <!-- Modal -->
                        <Modal ref="userModalRef" @close="afterCloseUserModal">
                            <!-- Slot Judul -->
                            <template #title>
                                <h1 class="text-xl text-slate-800 font-bold">{{ userModalTitle }}</h1>
                            </template>

                            <!-- Slot Body -->
                            <template #body>
                                <!-- Input Foto -->
                                <div class="mb-4">
                                    <label class="text-sm text-slate-800 font-bold mb-2">Foto</label>
                                    <ImageCropper :imageUrl="imageUrl" :aspectRatio="16 / 9" :inputAspectRatio="true"
                                        uploadText="Letakkan foto disini atau klik untuk mengunggah"
                                        @update:imageUrl="imageUrl = $event"
                                        @update:croppedImageUrl="croppedImageUrl = $event; formModel.photo = $event;" />
                                    <div v-if="errorList?.photo" class="text-red-500 text-xs">
                                        <span v-for="(err, index) in errorList.photo" :key="index">
                                            {{ err }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Input Nama -->
                                <div class="mb-4">
                                    <InputField v-model="formModel.name" label="Nama" type="text"
                                        placeholder="Masukkan Nama" name="name" :errors="errorList?.name" />

                                    <div v-if="v$.name.$error" class="text-red-500 text-xs">
                                        <span v-for="(err, index) in v$.name.$errors" :key="index">
                                            {{ err.$message }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Input Email -->
                                <div class="mb-4">
                                    <InputField v-model="formModel.email" label="Email" type="email"
                                        placeholder="Masukkan Email" name="email" :errors="errorList?.email" />

                                    <div v-if="v$.email.$error" class="text-red-500 text-xs">
                                        <span v-for="(err, index) in v$.email.$errors" :key="index">
                                            {{ err.$message }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Input Password -->
                                <div class="mb-4">
                                    <InputField v-model="formModel.password" label="Password" type="password"
                                        placeholder="Masukkan Password" name="password" :errors="errorList?.password" />

                                    <div v-if="v$.password.$error" class="text-red-500 text-xs">
                                        <span v-for="(err, index) in v$.password.$errors" :key="index">
                                            {{ err.$message }}
                                        </span>
                                    </div>
                                </div>
                            </template>

                            <!-- Slot Footer (Tombol Simpan) -->
                            <template #footer>
                                <Button @click="closeUserModal" variant="outline" color="secondary">
                                    Close
                                </Button>

                                <Button @click="saveUser" variant="solid" color="primary">
                                    Submit
                                </Button>
                            </template>
                        </Modal>


                    </div>
                </div>
                <div class="mt-4 w-full overflow-hidden rounded-lg border border-gray-200">
                    <table class="w-full">
                        <thead
                            class="border-b border-gray-200 bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-900">
                            <tr>
                                <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                        class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">User</small>
                                </th>
                                <th class="cursor-pointer px-2.5 py-2 text-start font-medium"><small
                                        class="font-sans antialiased text-sm text-current flex items-center justify-between gap-2 opacity-70">
                                    </small></th>
                            </tr>
                        </thead>
                        <tbody class="group text-sm text-gray-800 dark:text-white">
                            <template v-if="userStore.totalData > 0">
                                <tr class="border-b border-gray-200 last:border-0" v-for="row in userStore.users"
                                    :key="row.id">
                                    <td class="p-3">
                                        <div class="flex items-center gap-3"><img :src="row.photo_url"
                                                alt="John Michael"
                                                class="inline-block object-cover object-center data-[shape=square]:rounded-none data-[shape=circular]:rounded-full data-[shape=rounded]:rounded-[current] w-8 h-8 rounded"
                                                data-shape="circular" />
                                            <div class="flex flex-col"><small
                                                    class="font-sans antialiased text-sm text-current">
                                                    {{ row.name }}
                                                </small>
                                                <small class="font-sans antialiased text-sm text-current opacity-70">
                                                    {{ row.email }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-3">
                                        <div class="flex gap-2 justify-end">
                                            <!-- Tombol Edit -->
                                            <Button @click="openUserModal('edit', row.id)" variant="outline"
                                                color="secondary">
                                                Edit
                                            </Button>

                                            <!-- Tombol Delete -->
                                            <Button @click="deleteUser(row.id)" variant="outline" color="error">
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <tr v-else>
                                <td class="border-b border-gray-200 last:border-0 ps-2 py-2">
                                    No results.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between border-gray-200 py-4"><small
                        class="font-sans antialiased text-sm text-current">Page {{ userStore.totalPage != 0 ?
                            userStore.current
                            : userStore.totalPage }} of {{
                            userStore.totalPage }}</small>
                    <div class="flex gap-2"><button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="userStore.current === 1"
                            @click="paginate(userStore.current - 1)">Previous</button><button
                            class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-1.5 px-3 shadow-sm hover:shadow bg-transparent border-gray-200 text-gray-800 hover:bg-gray-200"
                            data-shape="default" data-width="default" :disabled="userStore.current >=
                                Math.ceil(userStore.totalData / userStore.perpage)
                                " @click="paginate(userStore.current + 1)">Next</button></div>
                </div>
            </div>

        </div>
    </Layout>
</template>
