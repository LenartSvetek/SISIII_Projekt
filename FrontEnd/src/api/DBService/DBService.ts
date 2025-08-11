import { IDBServiceProps, ITableInfo } from "./IDBServiceProps";

import Axios, { AxiosInstance } from 'axios';

export class DBService {
    private baseUrl: string;
    private axios: AxiosInstance;

    constructor(props: IDBServiceProps) {
        this.baseUrl = props.BaseUrl;
        this.axios = Axios.create({
            baseURL: this.baseUrl,
            timeout: 1000,
            withCredentials: true
        });
    }

    public async GetTableInfoList() {
        return await this.axios.get("/api/TableInfo")
            .then(TableInfos => {
                return TableInfos.data
            })
            .catch(() => []);
    }

    public async GetTableColumns(TableName: string) {
        return (await (this.axios.get(`/api/TableInfo/columns/${TableName}`))).data;
    }

    public async GetTableData(TableName: string, Select: string[] = ['*'], filter = "") : Promise<any[]>
    {
        return (await (this.axios.get(`/api/Table/${TableName}?select=${Select.map(encodeURIComponent).join(",")}&filter=${filter}`))).data;
    }

    public async GetTableDataById(TableName: string, Select: string[] = ['*'], Id = "-1") {
        return (await (this.axios.get(`/api/Table/getById/${TableName}?select=${Select.map(encodeURIComponent).join(",")}&id=${Id}`))).data[0];
    }

    public async CreateTableItem(TableName: string, Select: string[], ValuesList: string[][]){
        return (await this.axios.post(`/api/Table/${TableName}`, {
            select: Select,
            valuesList: ValuesList
        })).data.affectedRows > 0;
    }

    public async UpdateTableItem(TableName: string, Select: string[], ValuesList: string[], Id: string){
        return (await this.axios.post(`/api/Table/${TableName}`, {
            select: Select,
            valuesList: ValuesList,
            id: Id
        })).data.affectedRows > 0;
    }

    public async DeleteTableItems(TableName: string, ItemIds: string[]){
        return (await this.axios.delete(`/api/Table/${TableName}`, {
            data: {
                itemIds: ItemIds
            }
        })).data.affectedRows > 0;
    }

    public async AuthUser() {
        return (await (this.axios.post(`/api/User/auth`))).data;
    }

    public async LoginUser(username : string, password : string) {
        return (await (this.axios.post(`/api/User/login`, {username, password}))).data;
    }

    public async Logout() {
        return (await (this.axios.post(`/api/User/logout`))).data;
    }

    public static mysqlTypeToJsType(mysqlType) {
        const type = mysqlType.toLowerCase();

        if (type.includes('int')) return 'number';
        if (type.includes('decimal') || type.includes('float') || type.includes('double')) return 'number';
        if (type.includes('char') || type.includes('text') || type.includes('enum') || type.includes('set')) return 'string';
        if (type.includes('date') || type.includes('time') || type.includes('year')) return 'Date';
        if (type.includes('blob') || type.includes('binary')) return 'Buffer';
        if (type.includes('boolean') || type.includes('tinyint(1)')) return 'boolean';

        return 'any';
    }
}