<script setup>
import Layout from "@/layouts/main.vue";
import Datepicker from "@/components/widgets/DatePicker";
import { ref, onMounted } from "vue";
import QuillEditor from "@/components/widgets/Quill";
import Select from "@/components/widgets/Select";
const errorMessages = ref([]); // Simpan error jika ada
import CkEditor from "@/components/widgets/CkEditor";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/Input";


const selectedItem = ref(null); // Untuk single select
const selectedItems = ref([]); // Untuk multi select
const makanan = ref([
    { value: "rendang", label: "Rendang" },
    { value: "soto", label: "Soto" },
    { value: "sate", label: "Sate" },
    { value: "rawon", label: "Rawon" },
    { value: "ayam geprek", label: "Ayam geprek" },
]);

const contentQuill = ref(""); // Menyimpan teks editor
const selectedRange = ref([]);
const selectedDate = ref(null);
const contentCk = ref("");
const editorConfig = {
    toolbar: ["italic", "link", "|", "undo", "redo"],
    placeholder: "Tulis deskripsi di sini...",
};

const nama = ref("");
const deskripsi = ref("");
const setuju = ref(false);
const hobi = ref([]);
const kota = ref("");
const gender = ref("");
const password = ref("");
const email = ref("");

</script>

<template>
    <Layout>
        <div class="">
            Welcome to dashboard
        </div>
        <div>
            <Button class="me-2" color="primary" variant="solid">Primary Solid</Button>
            <Button class="me-2" color="secondary" variant="solid">Secondary Solid</Button>
            <Button class="me-2" color="info" variant="solid">Info Solid</Button>
            <Button class="me-2" color="success" variant="solid">Success Solid</Button>
            <Button class="me-2" color="warning" variant="solid">Warning Solid</Button>
            <Button class="me-2" color="error" variant="solid">Error Solid</Button>
        </div>
        <div>
            <Button class="me-2" color="primary" variant="outline">Primary Outline</Button>
            <Button class="me-2" color="secondary" variant="outline">Secondary Outline</Button>
            <Button class="me-2" color="info" variant="outline">Info Outline</Button>
            <Button class="me-2" color="success" variant="outline">Success Outline</Button>
            <Button class="me-2" color="warning" variant="outline">Warning Outline</Button>
            <Button class="me-2" color="error" variant="outline">Error Outline</Button>

        </div>
        <div>
            <Button class="me-2" color="primary" variant="ghost">Primary Ghost</Button>
            <Button class="me-2" color="secondary" variant="ghost">Secondary Ghost</Button>
            <Button class="me-2" color="info" variant="ghost">Info Ghost</Button>
            <Button class="me-2" color="success" variant="ghost">Success Ghost</Button>
            <Button class="me-2" color="warning" variant="ghost">Warning Ghost</Button>
            <Button class="me-2" color="error" variant="ghost">Error Ghost</Button>

        </div>
        <div>
            <Button class="me-2" color="primary" variant="solid" :isLoading="true">Primary Solid Loading</Button>
            <Button class="me-2" color="secondary" variant="outline" :isLoading="true">Secondary Outline Loading</Button>
            <Button class="me-2" color="info" variant="ghost" :isLoading="true">Info Ghost Loading</Button>
        </div>
        <div class="">
            <!-- Input Teks -->
            <div class="mb-4 pb-2">
                <Input v-model="nama" label="Nama Lengkap" placeholder="Masukkan nama Anda" />
                <p class="mt-2">Input: {{ nama }}</p>
            </div>

            <!-- Input Textarea -->
            <div class="mb-4 pb-2">
                <Input v-model="deskripsi" type="textarea" label="Deskripsi" placeholder="Tulis sesuatu..." />
                <p class="mt-2">Input: {{ deskripsi }}</p>
            </div>


            <div class="mb-4 pb-2">
                <!-- Input Checkbox (Single) -->
                <Input type="checkbox" label="Setuju dengan syarat dan ketentuan" v-model="setuju" />
                <p class="mt-2">Selected: {{ setuju }}</p>
            </div>
            <div class="mb-4 pb-2">
                <!-- Input Checkbox (Multiple) -->
                <Input type="checkbox" label="Pilih Hobi" :options="[
                    { label: 'Membaca', value: 'membaca' },
                    { label: 'Menulis', value: 'menulis' },
                    { label: 'Berenang', value: 'berenang' }
                ]" v-model="hobi" />
                <p class="mt-2">Selected: {{ hobi }}</p>
            </div>
            <div class="mb-4 pb-2">
                <!-- Input Select (Dropdown) -->
                <Input type="select" label="Pilih Kota" :options="[
                    { label: 'Jakarta', value: 'jakarta' },
                    { label: 'Bandung', value: 'bandung' },
                    { label: 'Surabaya', value: 'surabaya' }
                ]" v-model="kota" />
                <p class="mt-2">Selected: {{ kota }}</p>
            </div>
            <div class="mb-4 pb-2">
                <!-- Input Radio -->
                <Input type="radio" label="Jenis Kelamin" :options="[
                    { label: 'Laki-laki', value: 'L' },
                    { label: 'Perempuan', value: 'P' }
                ]" v-model="gender" />
                <p class="mt-2">Selected: {{ gender }}</p>
            </div>
            <!-- Input Password -->
            <div class="mb-4 pb-2">
                <Input v-model="password" type="password" label="Password" placeholder="Masukkan password" />
                <p class="mt-2">Input: ****** (disembunyikan)</p>
            </div>

            <!-- Input dengan Error -->
            <div class="mb-4 pb-2">
                <Input v-model="email" label="Email" placeholder="Masukkan email" :errors="['Email tidak valid']" />
                <p class="mt-2">Input: {{ email }}</p>
            </div>
        </div>
        <div class="">
            <div class="mb-4 pb-2">
                <Datepicker v-model="selectedDate" label="Pilih Tanggal" placeholder="Pilih tanggal" />
                <p class="mt-2 text-sm">Tanggal yang dipilih: {{ selectedDate }}</p>
            </div>
            <div class="mb-4 pb-2">
                <Datepicker v-model="selectedRange" label="Pilih Rentang Tanggal" placeholder="Pilih rentang tanggal"
                    :range="true" />
                <p class="mt-2 text-sm">Rentang yang dipilih: {{ selectedRange }}</p>
            </div>
            <div class="mb-4 pb-2">
                <Select v-model="selectedItem" label="Pilih Makanan" placeholder="Pilih negara..." :options="makanan" />
                <p class="mt-4">Selected: {{ selectedItem }}</p>
            </div>
            <div class="mb-4 pb-2">
                <Select v-model="selectedItems" label="Pilih Banyak Makanan" placeholder="Pilih banyak negara..."
                    :options="makanan" multiple />
                <p class="mt-4">Selected: {{ selectedItems }}</p>
            </div>
            <div class="mb-4 pb-2">
                <QuillEditor v-model="contentQuill" label="Deskripsi" placeholder="Tulis sesuatu..."
                    :errors="errorMessages" />
                <div v-html="contentQuill" class="border p-4"></div>
            </div>
            <div class="mb-4 pb-2">
                <CkEditor v-model="contentCk" label="Deskripsi" :editorConfig="editorConfig" />
                <div v-html="contentCk" class="border p-4"></div>
            </div>
        </div>
    </Layout>
</template>
