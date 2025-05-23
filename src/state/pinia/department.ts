import {defineStore} from "pinia";
import axios from "axios";
import type {IDepartment} from "../../types/Department";

export const useDepartmentStore = defineStore("department", {
    state: () => ({
        apiUrl: import.meta.env.VITE_APP_APIURL,
        departments: [] as IDepartment[],
        department: null as IDepartment | null,
        response: {
            status: null as number | null,
            message: null as string | null,
            error: [] as any[],
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
        openForm(newAction: string, department: IDepartment | null) {
            this.modalAction.action = newAction;
            this.department = department;
        },
        async getDepartments() {
            try {
                const url = `${this.apiUrl}/v1/departments?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const departmentsDataList = res.data.data.list;
                this.departments = departmentsDataList;
                this.totalData = res.data.data.meta.total;
                this.totalPage = Math.ceil(this.totalData / this.perpage);
            } catch (error: any) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response?.data?.errors || [],
                };
            }
        },
        async changePage(newPage: number) {
            this.current = newPage;
            await this.getDepartments();
        },
        async searchDepartments(query: string) {
            this.searchQuery = query;
            this.current = 1;
            await this.getDepartments();
        },
        async createDepartment(department: IDepartment) {
            try {
                const res = await axios.post(`${this.apiUrl}/v1/departments`, department);
                this.response = {
                    status: res.status,
                    message: res.data.message,
                    error: [],
                };
                return true;
            } catch (error: any) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response?.data?.errors || [],
                };
                return false;
            } finally {
                await this.getDepartments();
            }
        },
        async updateDepartment(department: IDepartment) {
            try {
                const res = await axios.put(`${this.apiUrl}/v1/departments/${department.id}`, department);
                this.response = {
                    status: res.status,
                    message: res.data.message,
                    error: [],
                };
                return true;
            } catch (error: any) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response?.data?.errors || [],
                };
                return false;
            } finally {
                await this.getDepartments();
            }
        },
        async deleteDepartment(id: number) {
            try {
                const res = await axios.delete(`${this.apiUrl}/v1/departments/${id}`);
                this.response = {
                    status: res.status,
                    message: res.data.message,
                    error: [],
                };
            } catch (error: any) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    error: error.response?.data?.errors || [],
                };
            } finally {
                await this.getDepartments();
            }
        },
        resetState() {
            this.departments = [];
            this.department = null;
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
