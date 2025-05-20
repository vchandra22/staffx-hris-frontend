import { defineStore } from "pinia";
import axios from "axios";
import { IEmployee } from "../../types/Employee";

export const useEmployeeStore = defineStore("employee", {
    state: () => ({
        apiUrl: import.meta.env.VITE_APP_APIURL,
        employees: [] as IEmployee[],
        employee: null as IEmployee | null,
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
        openForm(newAction: string, employee: IEmployee | null) {
            this.modalAction.action = newAction;
            this.employee = employee;
        },
        async getEmployees() {
            try {
                const url = `${this.apiUrl}/v1/employees?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const employeesDataList = res.data.data.list;
                this.employees = employeesDataList;
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
            await this.getEmployees();
        },
        async searchEmployees(query: string) {
            this.searchQuery = query;
            this.current = 1;
            await this.getEmployees();
        },
        async createEmployee(employee: IEmployee) {
            try {
                // Restructure the data to match the API's expectations
                const employeeData = {
                    name: employee.user?.name,
                    email: employee.user?.email,
                    password: employee.user?.password || null,
                    photo: employee.user?.photo || null,
                    role_id: employee.user?.id || null,
                    phone: employee.user?.phone || null,
                    birth_place: employee.birth_place,
                    birth_date: employee.birth_date,
                    address: employee.address,
                    department_id: employee.department_id || employee.department?.id,
                    position_id: employee.position_id || employee.position?.id,
                    hire_date: employee.hire_date,
                    salary: employee.salary
                };

                const res = await axios.post(`${this.apiUrl}/v1/employees`, employeeData);
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
                await this.getEmployees();
            }
        },
        async updateEmployee(employee: IEmployee) {
            try {
                // Restructure the data to match the API's expectations
                const employeeData = {
                    name: employee.user?.name,
                    email: employee.user?.email,
                    password: employee.user?.password || null,
                    photo: employee.user?.photo || null,
                    role_id: employee.user?.id || null,
                    phone: employee.user?.phone || null,
                    birth_place: employee.birth_place,
                    birth_date: employee.birth_date,
                    address: employee.address,
                    department_id: employee.department_id || employee.department?.id,
                    position_id: employee.position_id || employee.position?.id,
                    hire_date: employee.hire_date,
                    salary: employee.salary
                };

                const res = await axios.put(`${this.apiUrl}/v1/employees/${employee.id}`, employeeData);
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
                await this.getEmployees();
            }
        },
        async deleteEmployee(id: string) {
            try {
                const res = await axios.delete(`${this.apiUrl}/v1/employees/${id}`);
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
                await this.getEmployees();
            }
        },
        resetState() {
            this.employees = [];
            this.employee = null;
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
