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
import Card from "@/components/widgets/Card";
import ImageCropper from "@/components/widgets/Cropper";
import ApexChart from "@/components/widgets/Apexchart";

const currencyFormatter = (val) => `Rp ${val.toLocaleString()}`;
const percentageFormatter = (val) => `${val}%`;
const tooltipFormat = (val, label) => `${label}: ${val}`;

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

const croppedSingleImage = ref("")
const croppedMultipleImages = ref([])
</script>

<template>
    <Layout>
        <div class="">
            Welcome to dashboard
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <!-- Line Chart -->
            <ApexChart type="line" title="Tren Pengunjung" :categories="['Jan', 'Feb', 'Mar', 'Apr']" :series="[
                { name: 'Desktop', data: [30, 40, 35, 50] },
                { name: 'Mobile', data: [20, 30, 25, 45] }
            ]" :yAxisFormatter="currencyFormatter" :tooltipFormatter="tooltipFormat" />

            <!-- Area Chart -->
            <ApexChart type="area" title="Traffic Harian" :categories="['Sen', 'Sel', 'Rab', 'Kam']" :series="[
                { name: 'User Aktif', data: [100, 200, 150, 250] }
            ]" :colors="['#00C49F']" />

            <!-- Column Chart -->
            <ApexChart type="column" title="Penjualan Bulanan" :categories="['Jan', 'Feb', 'Mar']" :series="[
                { name: 'Produk A', data: [400, 700, 500] }
            ]" :yAxisFormatter="currencyFormatter" />

            <!-- Bar Chart -->
            <ApexChart type="bar" title="Skor Siswa" :categories="['Ali', 'Budi', 'Cici']" :series="[
                { name: 'Nilai', data: [85, 90, 78] }
            ]" :yAxisFormatter="val => `${val}/100`" />

            <!-- Pie Chart -->
            <ApexChart type="pie" title="Distribusi Jenis Kelamin" :categories="['Laki-laki', 'Perempuan']"
                :series="[60, 40]" :colors="['#42A5F5', '#EF5350']" />

            <!-- Donut Chart -->
            <ApexChart type="donut" title="Market Share" :categories="['Brand A', 'Brand B', 'Brand C']"
                :series="[40, 35, 25]" :colors="['#008FFB', '#00E396', '#FEB019']" />

            <!-- RadialBar Chart -->
            <ApexChart type="radialBar" title="Progress Target" :categories="['Target Tercapai']" :series="[75]"
                :yAxisFormatter="percentageFormatter" />

            <!-- PolarArea Chart -->
            <ApexChart type="polarArea" title="Skor Departemen" :categories="['HR', 'Tech', 'Sales', 'Marketing']"
                :series="[80, 90, 70, 60]" />

            <!-- Heatmap -->
            <ApexChart type="heatmap" title="Aktivitas Mingguan" :categories="['Sen', 'Sel', 'Rab', 'Kam', 'Jum']"
                :series="[
                    {
                        name: 'Minggu 1',
                        data: [10, 20, 30, 40, 50]
                    },
                    {
                        name: 'Minggu 2',
                        data: [20, 10, 40, 30, 60]
                    }
                ]" :colors="['#FF5722']" />

            <!-- Bubble Chart -->
            <ApexChart type="bubble" title="Distribusi Ukuran Produk" :series="[
                {
                    name: 'Produk A',
                    data: [
                        { x: 10, y: 20, z: 15 },
                        { x: 20, y: 30, z: 20 }
                    ]
                }
            ]" />

            <!-- Candlestick Chart -->
            <ApexChart type="candlestick" title="Harga Saham" :series="[
                {
                    data: [
                        {
                            x: new Date('2023-01-01'),
                            y: [51, 55, 50, 54]
                        },
                        {
                            x: new Date('2023-01-02'),
                            y: [54, 56, 52, 55]
                        }
                    ]
                }
            ]" />

            <!-- Radar Chart -->
            <ApexChart type="radar" title="Kemampuan Tim"
                :categories="['Komunikasi', 'Teknik', 'Problem Solving', 'Leadership']" :series="[
                    {
                        name: 'Tim A',
                        data: [80, 85, 75, 90]
                    },
                    {
                        name: 'Tim B',
                        data: [70, 78, 82, 88]
                    }
                ]" />
        </div>
        <div class="tab-group">
            <div class="tab-container" role="tablist">
                <div class="tab-indicator"></div>
                <a href="#" class="tab-link tab-link-active" data-tab-target="tab1-group">HTML</a>
                <a href="#" class="tab-link" data-tab-target="tab2-group">React</a>
                <a href="#" class="tab-link" data-tab-target="tab3-group">Vue</a>
                <a href="#" class="tab-link" data-tab-target="tab4-group">Angular</a>
                <a href="#" class="tab-link" data-tab-target="tab5-group">Svelte</a>
            </div>

            <div class="tab-content-container">
                <div id="tab1-group" class="tab-content">Konten HTML</div>
                <div id="tab2-group" class="tab-content tab-content-hidden">Konten React</div>
                <div id="tab3-group" class="tab-content tab-content-hidden">Konten Vue</div>
                <div id="tab4-group" class="tab-content tab-content-hidden">Konten Angular</div>
                <div id="tab5-group" class="tab-content tab-content-hidden">Konten Svelte</div>
            </div>
        </div>

        <div data-stepper-container data-initial-step="1" class="stepper-container">
            <div class="stepper">
                <div aria-disabled="false" data-step class="group step"> <!-- Tambahkan `group` di HTML -->
                    <div class="relative">
                        <span class="step-circle">1</span>
                    </div>
                    <div class="step-line"></div>
                </div>
                <div aria-disabled="true" data-step class="group step"> <!-- Tambahkan `group` di HTML -->
                    <div class="relative">
                        <span class="step-circle">2</span>
                    </div>
                    <div class="step-line"></div>
                </div>
                <div aria-disabled="true" data-step class="group step"> <!-- Tambahkan `group` di HTML -->
                    <div class="relative">
                        <span class="step-circle">3</span>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <div data-step-content="1" class="step-content active">
                    <p class="text-xl font-semibold mb-4">Step 1 Content</p>
                    <p class="text-slate-500">This is the content for step 1. Add whatever content you need here.</p>
                </div>
                <div data-step-content="2" class="step-content">
                    <p class="text-xl font-semibold mb-4">Step 2 Content</p>
                    <p class="text-slate-500">This is the content for step 2. Add whatever content you need here.</p>
                </div>
                <div data-step-content="3" class="step-content">
                    <p class="text-xl font-semibold mb-4">Step 3 Content</p>
                    <p class="text-slate-500">This is the content for step 3. Add whatever content you need here.</p>
                </div>
            </div>

            <div class="mt-6 flex w-full justify-between gap-4">
                <button data-stepper-prev class="step-btn">Previous</button>
                <button data-stepper-next class="step-btn">Next</button>
            </div>
        </div>



        <div class="dropdown" data-placement="bottom-start">
            <button data-toggle="dropdown" aria-expanded="false" class="btn-dropdown">
                Open
            </button>
            <div data-role="menu" class="dropdown-menu hidden  ">
                <a href="#" class="dropdown-item">Add Team</a>
                <a href="#" class="dropdown-item">Add Project</a>
                <a href="#" class="dropdown-item">My Profile</a>
            </div>
        </div>


        <div class="">
            <Card class="bg-gray-50 shadow-xl" :headerClass="'bg-blue-100 text-blue-900'" :bodyClass="'text-gray-700'"
                :footerClass="'bg-gray-200 flex justify-between'">

                <template #header>
                    <h5 class="text-lg font-bold">UI/UX Review Check</h5>
                </template>

                <template #body>
                    <p>
                        The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio"
                        where you can enjoy the main night life in Barcelona.
                    </p>
                </template>

                <template #footer>
                    <button
                        class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-400 rounded-md hover:bg-gray-300 transition-all">
                        Close
                    </button>
                    <button
                        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-all">
                        Read More
                    </button>
                </template>
            </Card>

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
            <Button class="me-2" color="secondary" variant="outline" :isLoading="true">Secondary Outline
                Loading</Button>
            <Button class="me-2" color="info" variant="ghost" :isLoading="true">Info Ghost Loading</Button>
        </div>
        <div class="">
            <div class="mb-4 pb-2">

                <!-- Single Image Cropper -->
                <ImageCropper v-model:croppedImageUrl="croppedSingleImage" :aspectRatio="16 / 9"
                    :inputAspectRatio="true" :text="'Letakkan gambar disini atau klik untuk mengunggah'" />
                <div v-if="croppedSingleImage">
                    <p>Result:</p>
                    <img :src="croppedSingleImage" alt="Hasil Crop" class="max-w-md mt-2 border rounded" />
                </div>
            </div>
            <div class="mb-4 pb-2">


                <!-- Multiple Image Cropper -->
                <ImageCropper v-model:croppedImageUrl="croppedMultipleImages" :aspectRatio="16 / 9"
                    :inputAspectRatio="true" :multiple="true"
                    :text="'Letakkan gambar disini atau klik untuk mengunggah secara banyak'" />
                <div v-if="croppedMultipleImages.length">
                    <p>Result:</p>
                    <div class="flex flex-wrap gap-4 mt-2">
                        <img v-for="(img, index) in croppedMultipleImages" :key="index" :src="img" alt="Hasil Crop"
                            class="max-w-xs border rounded" />
                    </div>
                </div>
            </div>

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
