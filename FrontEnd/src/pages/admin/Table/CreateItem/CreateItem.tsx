import React, { Suspense, useEffect, useState } from "react";
import { ICreateItemProps } from "./ICreateItemTypes";
import { useParams } from "react-router";

import styles from "./CreateItem.module.scss";
import { useDBService } from "@/contexts/DBContext";
import { ITableInfoColumn } from "@/types/TableInfo/ITableInfo";

import { Button, Field, Input, Select, Textarea } from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";


export default function CreateItem() {
    let dbService = useDBService();

    let { TableName, Operation, Id } = useParams();

    let [ fields, setFields ] = useState<ITableInfoColumn[]>([]);
    let [ data, setData] = useState({});
    let [ fieldElements, setFieldElements ] = useState([]);

    if(["Create", "View", "Modify"].indexOf(Operation) == -1) 
        return <h4>Operation does not exist</h4>

    if(Operation == "Create" && Id) return <h4>You are specifing Id when creating don't do that</h4>

    useEffect(() => {
        const getFields = async () => {
            setFields(await dbService.GetTableColumns(TableName));
        }

        getFields();
    }, [TableName]);

    useEffect(() => {
        const getData = async () => {
            setData(await dbService.GetTableData(TableName));
        }
        if(Id)
            getData();
    }, [Id]);

    useEffect(() => {
        const prepareFields = async () => {
            setFieldElements(await Promise.all(fields.filter(item => !item.IsPrimaryKey).map(constructField)))
        }

        prepareFields();
    }, [fields])

    useEffect(() => {
        console.log(fields, data, Id);
    }, [fields, data]);

    const constructField = async (item: ITableInfoColumn, index: number, arr: ITableInfoColumn[]) => {
        switch(item.DataType) {
            case "STRING":
                return <>
                    <Field label={item.ColumnName}>
                        {
                            item.MaxLength && item.MaxLength < 256 &&
                            <Input></Input> ||
                            <Textarea resize={"vertical"}></Textarea>
                        }
                    </Field>
                </>;
            case "LOOKUP":
                let response = await dbService.GetTableData(item.ReferencesTable, ["Id", item.ReferencesTableValue]);
                return <>
                    <Field label={item.ColumnName}>
                        <Select>
                            <option selected disabled>-- izberi opcijo --</option>
                            {
                                response && response.map((res, i) => {
                                    return <option key={`Field_${item.Id}_${res["Id"]}`} value={res["Id"]}>{res[item.ReferencesTableValue]}</option>
                                })
                            }
                        </Select>
                    </Field>
                </>
            case "DATE":
                return <>
                    <Field label={`${item.ColumnName}`}>
                        <DatePicker></DatePicker>
                    </Field>
                </>
        }


        return null;
    };

    return ( 
    <div className={styles.CreateItem}>
        <h1>{TableName}: {Operation}</h1>
        {
            fieldElements
        }
        
        {
            ["Create", "Modify"].indexOf(Operation) != -1 &&
            <Button>Save</Button>
        }
        
    </div>
    );
}