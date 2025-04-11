import { defineStore } from "pinia";
import axios from "axios";
import type { IUser } from "@/types/User";

export const useUserStore = defineStore("user", {
    state: () => ({
        apiUrl: import.meta.env.VITE_APP_APIURL,
        users: [] as IUser[],
        user: null as IUser | null,
        response: {
            status: null,
            message: null,
            error: [],
        },
        modalAction: {
            action: "",
            modal_title: "",
            modal_button: "",
        },
        totalData: 0,
        totalPage: 0,
        current: 1,
        perpage: 10,
        searchQuery: "",
    }),
    actions: {
        openForm(newAction, user) {
            this.modalAction.action = newAction;
            this.user = user;
        },
        async getUsers() {
            try {
                const url = `${this.apiUrl}/v1/users?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const usersDataList = res.data.data.list;
                this.users = usersDataList;
                this.totalData = res.data.data.meta.total;
                this.totalPage = Math.ceil(this.totalData / this.perpage);
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                };
            }
            
        },
        async changePage(newPage) {
            this.current = newPage;
            await this.getUsers();
        },
        async searchUsers(query) {
            this.searchQuery = query;
            this.current = 1;
            await this.getUsers();
        },
        async register(users : IUser) {
            try {
                const res = await axios.post(`${this.apiUrl}/v1/users`, users);
                this.response = {
                    status: res.status,
                    message: res.data.message,
                };
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response.data.errors,
                };
            }
            
        },
        async updateUser(users : IUser) {
            try {
                const res = await axios.put(`${this.apiUrl}/v1/users/${users.id}`, users);
                this.response = {
                    status: res.status,
                    message: res.data.message,
                };
            } catch (error) {
                this.response = {
                    status: error.status,
                    message: error.message,
                    error: error.response.data.errors,
                };
            } finally {
                this.getUsers();
            }
        },

        async addUsers(users : IUser) {
            try {
                const res = await axios.post(`${this.apiUrl}/v1/users`, users);
                this.response = {
                    status: res.status,
                    message: res.data.message
                };
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response.data.errors,
                };
            } finally {
                this.getUsers();
            }
        },
        async deleteUser(id) {
            try {
                const res = await axios.delete(`${this.apiUrl}/v1/users/${id}`);
                this.response = {
                    status: res.status,
                    message: res.data.message,
                };
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response.data.errors,
                };
            } finally {
                this.getUsers();
            }
        },
        resetState() {
            this.users = [];
            this.user = null;
            this.response = {
                status: null,
                message: null,
                error: [],
            };
            this.modalAction = {
                action: "",
                modal_title: "",
                modal_button: "",
            };
            this.totalData = 0;
            this.totalPage = 0;
            this.current = 1;
            this.searchQuery = "";
        },
    },
});
