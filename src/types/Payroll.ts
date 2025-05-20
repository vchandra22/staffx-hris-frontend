import { IEmployee } from './Employee';

export interface IPayroll {
    id: string;
    employee: IEmployee;
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
