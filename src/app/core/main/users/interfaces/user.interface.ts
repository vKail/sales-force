// Generated by https://quicktype.io

export interface IUser {
    id:         number;
    dni:        string;
    firstName:  string;
    lastName:   string;
    gender:     string;
    email:      string;
    address:    string;
    phone:      string;
    birthDate:  Date;
    locationId: number;
    employee:   Employee;
}

export interface Employee {
    id:      number;
    username: string;
    password: string;
    role:     string;
    isActive: boolean;
}
