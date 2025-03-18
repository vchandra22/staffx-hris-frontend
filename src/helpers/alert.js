import { toast } from "vue-sonner";
import { createApp, ref } from "vue";

// Function to show a success toast
export const showSuccessToast = (title, text = "") => {
  toast.success(title, {
    description: text,
    position: "top-right",
    duration: 3000,
    class: "bg-green-500 text-white border-none shadow-lg",

  });
};

// Function to show an error toast
export const showErrorToast = (title, text = "") => {
  toast.error(title, {
    description: text,
    position: "top-right",
    duration: 3000,
    class: "bg-red-600 text-white border-none shadow-lg",
  });
};

// Function to show a delete confirmation dialog using custom modal component
export const showDeleteConfirmationDialog = async (
  title = "Apakah yakin menghapus data ini?",
  text = "Data yang dihapus tidak bisa dikembalikan!",
  confirmButtonText = "Hapus",
  cancelButtonText = "Batal"
) => {
  return new Promise((resolve) => {
    const modalApp = createApp({
      setup() {
        const isModalOpen = ref(true);

        const confirm = () => {
          isModalOpen.value = false;
          resolve(true);
          modalApp.unmount();
        };

        const cancel = () => {
          isModalOpen.value = false;
          resolve(false);
          modalApp.unmount();
        };

        return {
          isModalOpen,
          confirm,
          cancel,
          title,
          text,
          confirmButtonText,
          cancelButtonText,
        };
      },
      template: `
        <div v-if="isModalOpen" class="fixed inset-0 bg-slate-950/50 flex justify-center items-center z-[9999]">
          <div class="bg-white rounded-xl shadow-2xl shadow-slate-950/5 w-4/12 p-6 text-center">
            <h2 class="text-xl font-semibold text-red-600">{{ title }}</h2>
            <p class=" text-base text-gray-700 mt-2">{{ text }}</p>
            <div class="mt-4 flex justify-center gap-4">
              <button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-300 ease-in border rounded-md shadow-sm outline-none bg-transparent border-transparent hover:bg-gray-200/50 hover:border-gray-400/30 disabled:opacity-50 disabled:pointer-events-none" @click="cancel">{{ cancelButtonText }}</button>
              <button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 transition-all duration-300 ease-in border rounded-md shadow-sm outline-none bg-transparent border-transparent hover:bg-red-100 hover:border-red-400/50 disabled:opacity-50 disabled:pointer-events-none" @click="confirm">{{ confirmButtonText }}</button>
            </div>
          </div>
        </div>
      `,
    });

    const modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);
    modalApp.mount(modalContainer);
  });
};

// Function to show a confirmation dialog using custom modal component
export const showConfirmationDialog = async (title, text) => {
  return new Promise((resolve) => {
    const modalApp = createApp({
      setup() {
        const isModalOpen = ref(true);

        const confirm = () => {
          isModalOpen.value = false;
          resolve(true);
          modalApp.unmount();
        };

        const cancel = () => {
          isModalOpen.value = false;
          resolve(false);
          modalApp.unmount();
        };

        return {
          isModalOpen,
          confirm,
          cancel,
          title,
          text,
        };
      },
      template: `
        <div v-if="isModalOpen" class="fixed inset-0 bg-slate-950/50 flex justify-center items-center z-[9999]">
          <div class="bg-white rounded-xl shadow-2xl shadow-slate-950/5 w-4/12 p-6 text-center">
            <h2 class="text-xl font-semibold text-blue-600">{{ title }}</h2>
            <p class=" text-base text-gray-700 mt-2">{{ text }}</p>
            <div class="mt-4 flex justify-center gap-4">
              <button class="inline-flex items-center justify-center border border-gray-800 text-gray-800 bg-transparent align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md hover:bg-gray-100" @click="cancel">Cancel</button>
              <button class="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-blue-600 border-blue-600 text-white hover:bg-blue-500 hover:border-blue-500" @click="confirm">Yes, proceed</button>
            </div>
          </div>
        </div>
      `,
    });

    const modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);
    modalApp.mount(modalContainer);
  });
};
