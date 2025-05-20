import {defineStore} from "pinia";
import axios from "axios";
import type { IPosition } from "../../types/Position";

export const usePositionStore = defineStore("position", {
    state: () => ({
        apiUrl: "http://localhost:8000/api",
        positions: [] as IPosition[],
        position: null as IPosition | null,
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
        openForm(newAction: string, position: IPosition | null) {
            this.modalAction.action = newAction;
            this.position = position;
        },
        async getPositions() {
            try {
                const url = `${this.apiUrl}/v1/positions?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const positionsDataList = res.data.data.list;
                this.positions = positionsDataList;
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
            await this.getPositions();
        },
        async searchPositions(query: string) {
            this.searchQuery = query;
            this.current = 1;
            await this.getPositions();
        },
        async createPosition(position: IPosition) {
            try {
                const res = await axios.post(`${this.apiUrl}/v1/positions`, position);
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
                await this.getPositions();
            }
        },
        async updatePosition(position: IPosition) {
            try {
                const res = await axios.put(`${this.apiUrl}/v1/positions/${position.id}`, position);
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
                await this.getPositions();
            }
        },
        async deletePosition(id: string) {
            try {
                const res = await axios.delete(`${this.apiUrl}/v1/positions/${id}`);
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
                await this.getPositions();
            }
        },
        resetState() {
            this.positions = [];
            this.position = null;
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
