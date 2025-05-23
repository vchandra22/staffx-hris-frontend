import { defineStore } from "pinia";
import axios from "axios";
import type { ILeaveType } from "../../types/LeaveType";

export const useLeaveTypeStore = defineStore("leaveType", {
    state: () => ({
        apiUrl: import.meta.env.VITE_APP_APIURL,
        leaveTypes: [] as ILeaveType[],
        leaveType: null as ILeaveType | null,
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
        openForm(newAction: string, leaveType: ILeaveType | null) {
            this.modalAction.action = newAction;
            this.leaveType = leaveType;
        },
        async getLeaveTypes() {
            try {
                const url = `${this.apiUrl}/v1/leave-types?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const leaveTypesDataList = res.data.data.list;
                this.leaveTypes = leaveTypesDataList;
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
            await this.getLeaveTypes();
        },
        async searchLeaveTypes(query: string) {
            this.searchQuery = query;
            this.current = 1;
            await this.getLeaveTypes();
        },
        async createLeaveType(leaveType: ILeaveType) {
            try {
                const res = await axios.post(`${this.apiUrl}/v1/leave-types`, leaveType);
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
                await this.getLeaveTypes();
            }
        },
        async updateLeaveType(leaveType: ILeaveType) {
            try {
                const res = await axios.put(`${this.apiUrl}/v1/leave-types/${leaveType.id}`, leaveType);
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
                await this.getLeaveTypes();
            }
        },
        async deleteLeaveType(id: string) {
            try {
                const res = await axios.delete(`${this.apiUrl}/v1/leave-types/${id}`);
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
                await this.getLeaveTypes();
            }
        },
        resetState() {
            this.leaveTypes = [];
            this.leaveType = null;
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
