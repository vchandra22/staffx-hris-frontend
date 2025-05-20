<template>
    <div class="flex items-center justify-start bg-slate-50 dark:bg-gray-900 px-4 lg:px-6">
        <nav class="flex gap-6 text-sm font-regular text-secondary">
            <template v-for="(menu, index) in menus" :key="menu.label">
                <!-- Menu utama -->
                <router-link v-if="!menu.submenu" :to="menu.to"
                             class="relative flex items-center gap-1 px-2 py-2 rounded-lg transition h-12 lg:h-[48px]"
                             :class="{ 'font-semibold text-primary': isActiveMenu(menu) }">
                    <span class="absolute bottom-0 right-0 w-full h-1 border-b-[2px] border-primary rounded-t-[10px]"
                          :class="{ 'block': isActiveMenu(menu), 'hidden': !isActiveMenu(menu) }"/>
                    <svg class="h-5 w-5 " fill="currentColor" viewBox="0 0 24 24">
                        <path :d="menu.icon"/>
                    </svg>
                    {{ menu.label }}
                </router-link>

                <!-- Dropdown Menu -->
                <div v-else class="relative" ref="dropdownRefs">
                    <button @click="toggleMenu(menu.label)"
                            class="relative flex items-center gap-1 px-2 py-2 rounded-lg transition h-12 lg:h-[48px]"
                            :class="{ 'font-semibold text-primary': isActiveMenu(menu) }">
                            <span
                                class="absolute bottom-0 right-0 w-full h-1 border-b-[2px] border-primary rounded-t-[10px]"
                                :class="{ 'block': isActiveMenu(menu), 'hidden': !isActiveMenu(menu) }"/>

                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path :d="menu.icon"/>
                        </svg>
                        {{ menu.label }}
                    </button>

                    <!-- Submenu -->
                    <div v-if="openMenu === menu.label"
                         class="absolute left-0 mt-2 bg-white rounded-md shadow-md p-1 z-10">
                        <template v-for="sub in menu.submenu" :key="sub.label">
                            <router-link v-if="!sub.submenu" :to="sub.to"
                                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                         :class="{ 'bg-gray-100': isActiveMenu(sub) }">
                                {{ sub.label }}
                            </router-link>

                            <!-- Nested Submenu -->
                            <div v-else class="relative group">
                                <p class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                                   :class="{ 'bg-gray-100': isActiveMenu(sub) }">
                                    {{ sub.label }}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" class="h-4 w-4 ml-2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                    </svg>
                                </p>
                                <div
                                    class="absolute left-full top-0 mt-0 hidden group-hover:block bg-white rounded-md shadow-md p-1 w-40">
                                    <router-link v-for="nested in sub.submenu" :key="nested.label" :to="nested.to"
                                                 class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                 :class="{ 'bg-gray-100': isActiveMenu(nested) }">
                                        {{ nested.label }}
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </nav>
    </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {mdiAccountGroup, mdiAccountCash, mdiAccountMultiple, mdiDatabase, mdiHome} from "@mdi/js";

// Ambil route aktif
const route = useRoute();

// State untuk dropdown menu
const openMenu = ref(null);
const dropdownRefs = ref([]); // Array untuk banyak dropdown

const toggleMenu = (menuLabel) => {
    openMenu.value = openMenu.value === menuLabel ? null : menuLabel;
};

// Fungsi untuk mengecek apakah menu atau submenu aktif
const isActiveMenu = (menu) => {
    if (menu.to && route.path === menu.to) return true;
    if (menu.submenu) {
        return menu.submenu.some(
            (sub) => sub.to === route.path || (sub.submenu && sub.submenu.some(nested => nested.to === route.path))
        );
    }
    return false;
};

// Event handler untuk menutup dropdown jika klik di luar
const handleClickOutside = (event) => {
    if (!dropdownRefs.value.some((dropdown) => dropdown?.contains(event.target))) {
        openMenu.value = null;
    }
};

// Tambahkan event listener saat komponen dipasang
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

// Hapus event listener saat komponen di-unmount
onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

// Data menu utama
const menus = ref([
    { label: "Dashboard", to: "/dashboard", icon: mdiHome },
    {
        label: "Users",
        icon: mdiAccountGroup,
        submenu: [
            { label: "User List", to: "/user" },
            { label: "Add User", to: "/404" },
            {
                label: "Settings",
                submenu: [
                    { label: "Edit Profile", to: "/404" },
                    { label: "Change Password", to: "/404" },
                    { label: "Upgrade to PRO", to: "/404" },
                ],
            },
        ],
    },
    {
        label: "Data Masters",
        icon: mdiDatabase,
        submenu: [
            { label: "Departments", to: "/departments" },
            { label: "Positions", to: "/positions" },
        ],
    },
    {
        label: "Employees",
        to: "/employees",
        icon: mdiAccountMultiple
    },
    {
        label: "Payroll",
        to: "/payrolls",
        icon: mdiAccountCash
    },
]);
</script>

<style scoped>
/* Styling tambahan */
.group:hover > div {
    display: block;
}
</style>
