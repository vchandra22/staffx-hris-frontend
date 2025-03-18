<template>
  <!-- Dropzone -->
  <div v-if="!localCroppedImageUrl && !localImageUrl"
    class="flex flex-col justify-center items-center gap-4 bg-white transition-all duration-300 h-52 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer"
    @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop"
    :class="{ 'border-blue-500': isDragging }">
    <label for="dropzoneFile" class="cursor-pointer text-center">
      <div class="text-gray-500 text-lg">
        <div class="mb-3 text-5xl">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <h4>{{ uploadText }}</h4>
      </div>
    </label>
    <input type="file" id="dropzoneFile" class="hidden" @change="onFileChange" />
  </div>

  <!-- Modal Cropper -->
  <Modal ref="cropperModal" @close="afterCloseCropperModal">
    <template #title>
      <h1 class="text-xl text-slate-800 font-bold">Crop Image</h1>
    </template>
    <template #body>
      <vue-cropper v-if="localImageUrl" ref="cropper" :src="localImageUrl" :aspect-ratio="aspectRatio" :view-mode="1"
        :auto-crop-area="1" :background="false" :guides="false" class="w-full" />
    </template>
    <template #footer>
      <button @click="closeCropperModal"
        class="inline-flex items-center justify-center border border-gray-800 text-gray-800 bg-transparent align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md hover:bg-gray-100">
        Close
      </button>
      <button type="button" @click="cropImage"
        class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-slate-800 border-slate-800 text-slate-50 hover:bg-slate-700 hover:border-slate-700">
        Crop
      </button>
    </template>
  </Modal>

  <!-- Tampilkan Gambar yang Ada -->
  <div v-if="localCroppedImageUrl || localImageUrl"
    class="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center">
    <button @click="clearCroppedImage" class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path :d="mdiTrashCan" />
      </svg>
    </button>
    <img :src="localCroppedImageUrl || localImageUrl" alt="Cropped Image" class="max-w-full rounded" />
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import Modal from "@/components/widgets/Modal.vue";
import { mdiTrashCan } from '@mdi/js';

export default {
  name: "ImageCropper",
  components: {
    VueCropper,
    Modal,
  },

  props: {
    imageUrl: String, // Gambar original dari parent (misal dari API)
    croppedImageUrl: String, // Gambar yang sudah dicrop
    aspectRatio: { type: Number, default: 1 },
    uploadText: { type: String, default: "Letakkan gambar disini atau klik untuk mengunggah" },
  },
  
  data() {
    return {
      isDragging: false,
      cropModal: false,
      localImageUrl: null, // Gambar yang akan dicrop
      localCroppedImageUrl: null, // Gambar hasil crop
      mdiTrashCan,
    };
  },

  watch: {
    // Jika `imageUrl` berubah, update `localImageUrl`
    imageUrl: {
      immediate: true, // Langsung dijalankan saat component di-mount
      handler(newVal) {
        if (newVal) {
          this.localImageUrl = newVal;
        }
      },
    },
    localImageUrl(newVal) {
      this.$emit("update:imageUrl", newVal);
    },
    localCroppedImageUrl(newVal) {
      this.$emit("update:croppedImageUrl", newVal);
    },
  },

  mounted() {
    // Inisialisasi gambar jika `imageUrl` tersedia saat komponen pertama kali dipasang
    if (this.imageUrl) {
      this.localImageUrl = this.imageUrl;
    }
  },

  methods: {
    onDragOver() {
      this.isDragging = true;
    },
    onDragLeave() {
      this.isDragging = false;
    },
    onDrop(event) {
      this.isDragging = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.onFileChange({ target: { files: [files[0]] } });
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.localImageUrl = URL.createObjectURL(file);
        this.openCropperModal();
      }
    },
    cropImage() {
      const canvas = this.$refs.cropper.getCroppedCanvas();
      if (canvas) {
        this.localCroppedImageUrl = canvas.toDataURL("image/png");
      }
      this.closeCropperModal();
    },
    clearCroppedImage() {
      this.localCroppedImageUrl = null;
      this.localImageUrl = null;
    },
    openCropperModal() {
      this.$refs.cropperModal.openModal();
    },
    closeCropperModal() {
      this.$refs.cropperModal.closeModal();
    },
    afterCloseCropperModal() {
    },
  },
};
</script>
