// Generated by https://quicktype.io

export interface IClient {
    id:         number;
    dni:        string;
    firstName:  string;
    lastName:   string;
    gender:     string;
    address:    string;
    phone:      string;
    email:      string;
    birthDate:  Date;
    locationId: number;
    location:   Location;
    consumer:   Consumer;
    createdAt:  Date;
    updateAt:   Date;
}

export interface Consumer {
    id:         number;
    type:       string;
    isCustomer: boolean;
    createdAt:  Date;
    updateAt:   Date;
    personId:   number;
}

export interface Location {
    id:   number;
    name: string;
}
