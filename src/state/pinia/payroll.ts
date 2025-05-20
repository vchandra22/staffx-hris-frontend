import { defineStore } from "pinia";
import axios from "axios";
import { IPayroll } from "../../types/Payroll";

export const usePayrollStore = defineStore("payroll", {
    state: () => ({
        apiUrl: import.meta.env.VITE_APP_APIURL,
        payrolls: [] as IPayroll[],
        payroll: null as IPayroll | null,
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
        openForm(newAction: string, payroll: IPayroll | null) {
            this.modalAction.action = newAction;
            this.payroll = payroll;
        },
        async getPayrolls() {
            try {
                const url = `${this.apiUrl}/v1/payrolls?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const payrollsDataList = res.data.data.list;
                this.payrolls = payrollsDataList;
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
            await this.getPayrolls();
        },
        async searchPayrolls(query: string) {
            this.searchQuery = query;
            this.current = 1;
            await this.getPayrolls();
        },
        async createPayroll(payroll: IPayroll) {
            try {
                const res = await axios.post(`${this.apiUrl}/v1/payrolls`, payroll);
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
                await this.getPayrolls();
            }
        },
        async updatePayroll(payroll: IPayroll) {
            try {
                const res = await axios.put(`${this.apiUrl}/v1/payrolls/${payroll.id}`, payroll);
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
                await this.getPayrolls();
            }
        },
        async deletePayroll(id: string) {
            try {
                const res = await axios.delete(`${this.apiUrl}/v1/payrolls/${id}`);
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
                await this.getPayrolls();
            }
        },
        resetState() {
            this.payrolls = [];
            this.payroll = null;
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
