import { IEmployee } from './Employee';
import { IPosition } from './Position';
import {IDepartment} from "./Department";

export interface IPayroll {
    id: string;
    employee: IEmployee;
    position: IPosition;
    department: IDepartment;
    month: number;
    year: number;
    period: string;
    salary_details: {
        base_salary: number;
        overtime: {
            hours: number;
            rate: number;
            pay: number;
        };
        deductions: number;
        net_salary: number;
    };
    created_at: string;
    updated_at: string;
}
