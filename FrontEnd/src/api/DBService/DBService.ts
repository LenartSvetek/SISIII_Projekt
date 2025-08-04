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
        });
    }

    public async GetTableInfoList() {
        return await this.axios.get("/api/TableInfo")
            .then(TableInfos => {
                console.log(TableInfos);
                return TableInfos.data
            })
            .catch(() => []);
    }

    public async GetTableColumns(TableName: string) {
        return (await (this.axios.get(`/api/TableInfo/columns/${TableName}`))).data;
    }

    public async GetTableData(TableName: string) {
        return (await (this.axios.get(`/api/Table/${TableName}`))).data;
    }

    public async AuthUser() {
        return (await (this.axios.post(`/api/User/auth`))).data;
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