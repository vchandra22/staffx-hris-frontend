<template>
    <template v-if="multiple">
      <!-- Dropzone -->
      <div
        class="mt-2 flex flex-col justify-center items-center gap-4 bg-white transition-all duration-300 h-52 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer"
        @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop"
        :class="{ 'border-blue-500': isDragging }">
        <label for="dropzoneFile" class="cursor-pointer text-center">
          <div class="text-gray-500 text-lg">
            <div class="mb-3 text-5xl">
              <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h4>{{ text }}</h4>
          </div>
        </label>
        <input type="file" accept="image/*"  id="dropzoneFile" class="hidden" @change="onFileChange" />
      </div>
  
      <!-- Modal Cropper -->
      <Modal ref="cropperModal" size="xl" @close="afterCloseCropperModal">
        <template #title>
          <h1 class="text-xl text-slate-800 font-bold">Crop Image</h1>
        </template>
        <template #body>
          <div v-if="inputAspectRatio" class="flex gap-2 mb-4">
            <InputField v-model.number="inputAspectX" label="Width" type="number" placeholder="Masukkan lebar"
              name="aspectX" />
            <InputField v-model.number="inputAspectY" label="Height" type="number" placeholder="Masukkan tinggi"
              name="aspectY" />
          </div>
          <vue-cropper v-if="tempImageUrl" ref="cropper" :src="tempImageUrl" :aspect-ratio="computedAspectRatio"
            :view-mode="1" :auto-crop-area="1" :background="false" :guides="false" class="w-full" />
        </template>
        <template #footer>
  
          <Button @click="closeCropperModal" variant="outline" color="secondary">Close</Button>
          <Button @click="cropImage" variant="solid" color="primary">Crop</Button>
        </template>
      </Modal>
  
      <!-- Display Uploaded Images -->
      <div v-if="images.length > 0" class="mt-4 grid grid-cols-5 gap-4">
        <div v-for="(image, index) in images" :key="index" class="relative">
          <img :src="image" alt="Cropped Image" class="max-w-full rounded cursor-pointer" @click="selectImage(image)" />
          <button @click="removeImage(image)"
            class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path :d="mdiTrashCan" />
            </svg>
          </button>
        </div>
      </div>
    </template>
    <template v-if="!multiple">
        <!-- Dropzone -->
        <div v-if="!images.length"
          class="mt-2 flex flex-col justify-center items-center gap-4 bg-white transition-all duration-300 h-52 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer"
          @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop"
          :class="{ 'border-blue-500': isDragging }">
          <label for="dropzoneFile" class="cursor-pointer text-center">
            <div class="text-gray-500 text-lg">
              <div class="mb-3 text-5xl">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <h4>{{ text }}</h4>
            </div>
          </label>
          <input type="file" accept="image/*"  id="dropzoneFile" class="hidden" @change="onFileChange" />
        </div>
  
        <!-- Modal Cropper -->
        <Modal ref="cropperModal" size="xl" @close="afterCloseCropperModal">
          <template #title>
            <h1 class="text-xl text-slate-800 font-bold">Crop Image</h1>
          </template>
          <template #body>
            <!-- Input untuk aspect ratio jika input -->
            <div v-if="inputAspectRatio" class="flex gap-2 mb-4">
              <InputField v-model.number="inputAspectX" label="Width" type="number" placeholder="Masukkan lebar"
                name="aspectX" />
              <InputField v-model.number="inputAspectY" label="Height" type="number" placeholder="Masukkan tinggi"
                name="aspectY" />
            </div>
            <vue-cropper v-if="tempImageUrl" ref="cropper" :src="tempImageUrl" :aspect-ratio="computedAspectRatio"
              :view-mode="1" :auto-crop-area="1" :background="false" :guides="false" class="w-full" />
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
        <div v-if="images.length > 0 "
          class="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center">
          <button @click="removeImage(images[0])"
            class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path :d="mdiTrashCan" />
            </svg>
          </button>
         
          <img :src="images.length ? images[0] : localCroppedImageUrl || localImageUrl" alt="Cropped Image" class="max-w-full rounded" />
        </div>
    </template>
  </template>
  
  <script>
  import VueCropper from "vue-cropperjs";
  import "cropperjs/dist/cropper.css";
  import Modal from "@/components/widgets/Modal.vue";
  import { mdiTrashCan, mdiPlus } from '@mdi/js';
  import InputField from "@/components/widgets/Input";
  import Button from "@/components/widgets/Button";
  
  export default {
    name: "ImageCropper",
    components: { VueCropper, Modal, InputField, Button },
    props: {
      imageUrl: String,
      aspectRatio: { type: Number, default: 1 },
      text: { type: String, default: "Letakkan gambar disini atau klik untuk mengunggah" },
      inputAspectRatio: { type: Boolean, default: false },
      multiple: { type: Boolean, default: false }
    },
    data() {
      return {
        isDragging: false,
        images: [],
        tempImageUrl: null,
        mdiTrashCan,
        mdiPlus,
        inputAspectX: 1,
        inputAspectY: 1
      };
    },
    computed: {
      computedAspectRatio() {
        return this.inputAspectRatio && this.inputAspectX > 0 && this.inputAspectY > 0
          ? this.inputAspectX / this.inputAspectY
          : this.aspectRatio;
      }
    },
    watch: {
      imageUrl: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.tempImageUrl = newVal;
            if (this.multiple) {
              this.images.push(newVal);
            } else {
              this.images = [newVal];
            }
          }
        }
      }
    },
    methods: {
      onDragOver() { this.isDragging = true; },
      onDragLeave() { this.isDragging = false; },
      onDrop(event) {
        this.isDragging = false;
        const files = event.dataTransfer.files;
        if (files.length > 0) {
          this.onFileChange({ target: { files } });
        }
      },
      onFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
          this.tempImageUrl = URL.createObjectURL(files[0]);
          this.openCropperModal();
        }
      },
      cropImage() {
        const canvas = this.$refs.cropper.getCroppedCanvas();
        if (canvas) {
          const croppedData = canvas.toDataURL("image/png");
          this.images.push(croppedData);
          this.$emit("update:croppedImageUrl", this.multiple ? this.images : this.images[0]);
        }
        this.tempImageUrl = null;
        this.closeCropperModal();
      },
      removeImage(image) {
        this.images = this.images.filter(img => img !== image);
        this.$emit("update:croppedImageUrl", this.multiple ? this.images : this.images[0]);
      },
      selectImage(image) {
        this.tempImageUrl = image;
        this.openCropperModal();
      },
      openCropperModal() { this.$refs.cropperModal.openModal(); },
      closeCropperModal() { this.$refs.cropperModal.closeModal(); },
      afterCloseCropperModal() { }
    }
  };
  </script>
  