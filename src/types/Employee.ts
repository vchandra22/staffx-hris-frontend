import { IUser } from './User';
import { IDepartment } from './Department';
import { IPosition } from './Position';

export interface IEmployee {
    id: string;
    user: IUser;
    email: IUser;
    phone_number: IUser;
    birth_place: string;
    birth_date: string;
    address: string;
    department: IDepartment;
    position: IPosition;
    hire_date: string;
    salary: number;
    created_at: string;
    updated_at: string;
}
