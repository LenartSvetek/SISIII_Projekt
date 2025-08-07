import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import styles from "./CreateItem.module.scss";
import { useDBService } from "@/contexts/DBContext";
import { ITableInfoColumn } from "@/types/TableInfo/ITableInfo";

import { Button, Field, Input, Select, Switch, Textarea } from "@fluentui/react-components";
import { DatePicker } from "@fluentui/react-datepicker-compat";


export default function CreateItem() {
    let dbService = useDBService();

    let navigate = useNavigate();

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
    }, [fields, data])



    useEffect(() => {
        console.log(fields, data, Id);
    }, [fields, data]);

    const setValue = (ev : React.ChangeEvent) => {
        let input = ev.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        
        setData(prev => ({
            ...prev,
            // @ts-ignore
            [input.name]: input.type && input.type == "checkbox"? input.checked : input.value
        }));
    }

    const setDateValue = (date : Date, column : ITableInfoColumn) => {
        const newData = {
            ...data,
            [column.ColumnName]: date.toISOString()
        };

        setData(newData);
    }

    const constructField = async (item: ITableInfoColumn, index: number, arr: ITableInfoColumn[]) => {
        switch(item.DataType) {
            case "STRING":
                return <>
                    <Field label={item.ColumnName}>
                        {
                            item.MaxLength && item.MaxLength < 256 &&
                            <Input name={item.ColumnName} data-type={"STRING"} value={data[item.ColumnName] || item.DefaultValue || ""} onChange={setValue} required={!item.IsNullable}></Input> ||
                            <Textarea name={item.ColumnName} data-type={"STRING"} resize={"vertical"} value={data[item.ColumnName] || item.DefaultValue || ""} onChange={setValue} required={!item.IsNullable}></Textarea>
                        }
                    </Field>
                </>;
            case "LOOKUP":
                let response = await dbService.GetTableData(item.ReferencesTable, ["Id", item.ReferencesTableValue]);
                console.log(data[item.ColumnName], response);
                return <>
                    <Field label={item.ColumnName}>
                        <Select name={item.ColumnName} data-type={"LOOKUP"} value={data[item.ColumnName] || item.DefaultValue || "-1"} onChange={setValue} required={!item.IsNullable}>
                            <option value={"-1"} disabled>-- izberi opcijo --</option>
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
                        <DatePicker name={item.ColumnName} data-type={"DATE"} value={data[item.ColumnName] && new Date(data[item.ColumnName]) || item.DefaultValue && new Date(item.DefaultValue) || new Date()} onSelectDate={(date) => setDateValue(date, item)} required={!item.IsNullable}></DatePicker>
                    </Field>
                </>
            case "BOOL":
                return <>
                    <Field>
                        <Switch name={item.ColumnName} data-type={"BOOL"} label={item.ColumnName} value={data[item.ColumnName] || item.DefaultValue == "0" || false} onChange={setValue} required={!item.IsNullable}/>
                    </Field>
                </>
            case "ENUM":
                let choices = item.Choices.split(",");
                return <>
                    <Field label={item.ColumnName}>
                        <Select name={item.ColumnName} data-type={"ENUM"} value={data[item.ColumnName] || item.DefaultValue || "-1"} onChange={setValue} required={!item.IsNullable}>
                            <option value={"-1"} disabled>-- izberi opcijo --</option>
                            {
                                choices && choices.map((choice, i) => {
                                    return <option key={`Field_${item.Id}_${i}`} value={i}>{choice}</option>
                                })
                            }
                        </Select>
                    </Field>
                </>
        }


        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
        console.log('Form submitted:', data);
        let select = Object.getOwnPropertyNames(data);
        console.log(select);
        let valuesList = [];
        valuesList.push(select.map((sel) => data[sel]));
        console.log(valuesList);

        if(await dbService.CreateTableItem(TableName, select, valuesList)) navigate(`/admin/${TableName}`);
    };

    return ( 
    <div className={styles.CreateItem}>
        <h1>{TableName}: {Operation}</h1>
        <form onSubmit={handleSubmit}>
        {
            fieldElements
        }
        {
            ["Create", "Modify"].indexOf(Operation) != -1 &&
            <Button style={{marginTop: 15}} type="submit">Save</Button>
        }
        </form>
        
    </div>
    );
}