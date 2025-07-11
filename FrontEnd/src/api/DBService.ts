import { IDBServiceProps, ITableInfo } from "./IDBServiceProps";

import Axios, { AxiosInstance } from 'axios';

export class DBService {
    private baseUrl: string;
    private axios : AxiosInstance;

    constructor(props: IDBServiceProps) {
        this.baseUrl = props.BaseUrl;
        this.axios = Axios.create({
            baseURL: this.baseUrl,
            timeout: 1000,
        });
    }

    public async GetTableInfo(): Promise<ITableInfo[]> {
        return await this.axios.get("/api/TableInfo")
            .then(TableInfos => {
                console.log(TableInfos);
                return TableInfos.data
            })
            .catch(() =>[]);
    }

}