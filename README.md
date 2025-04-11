# Venturo Vue Tailwind Material Skeleton

Venturo Vue Tailwind Material Skeleton adalah kerangka kerja untuk membangun aplikasi web menggunakan Vue 3, Tailwind CSS, dan Material Tailwind. Proyek ini menyediakan komponen UI siap pakai serta manajemen state menggunakan Pinia.

## Teknologi yang Digunakan
- **Vue 3** - Framework JavaScript progresif
- **Vite** - Build tool modern dan cepat
- **Tailwind CSS** - Framework CSS utilitas
- **Material Tailwind** - UI library berbasis Material Design untuk Tailwind CSS
- **Pinia** - State management untuk Vue 3

## Persyaratan
- **Node.ts v22.14.0**
- **npm 10.9.2** atau **Yarn**

## Instalasi
1. Clone repository ini:
   ```sh
   git clone https://gitlab.com/venturo-web/venturo-vue-tailwind-skeleton.git
   cd venturo-vue-tailwind-skeleton
   ```
2. Instal dependensi:
   ```sh
   npm install
   ```
   atau
   ```sh
   yarn install
   ```
3. Konfigurasi file `.env`:
   Salin file `.env.example` menjadi `.env`, lalu sesuaikan variabel berikut:
   ```sh
   VITE_APP_APIURL="http://127.0.0.1:8000/api"
   ```
   Sesuaikan dengan backend yang digunakan.

## Menghubungkan ke Backend
Proyek ini menggunakan backend dari Laravel yang dapat ditemukan di repository berikut:
[Venturo Laravel Skeleton](https://gitlab.com/venturo-web/venturo-laravel-skeleton)

## Menjalankan Aplikasi
Untuk menjalankan aplikasi dalam mode pengembangan:
```sh
npm run dev
```
atau
```sh
yarn dev
```

## Struktur Folder
```
VENTURO-VUE-TAILWIND-MATERIAL-SKELETON
├── src
│   ├── assets
│   │   ├── index.css
│   │   ├── logo-venturo.webp
│   ├── components/widgets
│   │   ├── Button.vue
│   │   ├── CkEditor.vue
│   │   ├── Cropper.vue
│   │   ├── DatePicker.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   ├── Quill.vue
│   │   ├── Select.vue
│   ├── core/interceptor
│   │   ├── axios-interceptor.ts
│   ├── helpers/authservice
│   │   ├── auth-header.ts
│   │   ├── user.service.ts
│   ├── helpers
│   │   ├── alert.ts
│   │   ├── progress.ts
│   ├── layouts
│   │   ├── main.vue
│   │   ├── navigation.vue
│   ├── router
│   │   ├── index.ts
│   │   ├── routes.ts
│   ├── state
│   │   ├── pinia
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── pinia.ts
│   ├── views
│   │   ├── auth
│   │   ├── dashboard
│   │   │   ├── index.vue
│   │   ├── user
│   │   ├── utility
│   │   │   ├── 404.vue
│   ├── App.vue
│   ├── authUtils.ts
│   ├── i18n.ts
│   ├── main.ts
├── .env
├── .gitignore
├── Dockerfile
├── Dockerfile.dev
├── Dockerfile.staging
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## Penggunaan Komponen Input
Berikut contoh penggunaan beberapa komponen input yang tersedia dalam proyek ini:
```vue
<script setup>
import Layout from "@/layouts/main.vue";
import Datepicker from "@/components/widgets/DatePicker";
import { ref } from "vue";
import QuillEditor from "@/components/widgets/Quill";
import Select from "@/components/widgets/Select";
import CkEditor from "@/components/widgets/CkEditor";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/Input";

const nama = ref("");
const email = ref("");
const selectedDate = ref(null);
const selectedItem = ref(null);
</script>

<template>
    <Layout>
        <Input v-model="nama" label="Nama Lengkap" placeholder="Masukkan nama Anda" />
        <Input v-model="email" label="Email" placeholder="Masukkan email" :errors="['Email tidak valid']" />
        <Datepicker v-model="selectedDate" label="Pilih Tanggal" placeholder="Pilih tanggal" />
        <Select v-model="selectedItem" label="Pilih Item" :options="[{ value: '1', label: 'Item 1' }, { value: '2', label: 'Item 2' }]" />
        <Button color="primary" variant="solid">Submit</Button>
    </Layout>
</template>
```

## Manajemen State dengan Pinia
Proyek ini menggunakan **Pinia** untuk manajemen state. Berikut contoh store untuk autentikasi:
```js
// src/state/pinia/auth.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || ''
    }),
    actions: {
        async login(credentials) {
            const response = await axios.post('/auth/login', credentials);
            this.token = response.data.token;
            localStorage.setItem('token', this.token);
        },
        logout() {
            this.token = '';
            localStorage.removeItem('token');
        }
    }
});
```

## Informasi Tambahan
- **Docker Support:** Proyek ini memiliki konfigurasi Docker untuk lingkungan pengembangan dan staging.
- **i18n:** Mendukung multiple language menggunakan Vue I18n.
- **Interceptor Axios:** Menggunakan `axios-interceptor.ts` untuk menangani permintaan API secara global.

## Lisensi
Proyek ini dilisensikan di bawah MIT License.

---

Selamat menggunakan **Venturo Vue Tailwind Material Skeleton**! 🚀

