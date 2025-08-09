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
    let [ lookupValues, setLookupValues ] = useState({});

    if(["Create", "View", "Modify"].indexOf(Operation) == -1) 
        return <h4>Operation does not exist</h4>

    if(Operation == "Create" && Id) return <h4>You are specifing Id when creating don't do that</h4>
    if(Operation != "Create" && Id == undefined) return <h4>Please specify id</h4>

    useEffect(() => {
        const getFields = async () => {
            setFields(await dbService.GetTableColumns(TableName));
        }
    
        getFields();
    }, [TableName]);

    useEffect(() => {
        const getData = async () => {
            setData(await dbService.GetTableDataById(TableName, ["*"], Id));
        }

        if(Id)
            getData();
    }, [Id]);

    useEffect(() => {
        const prepareFields = async () => {
            setFieldElements(await Promise.all(fields.filter(item => !item.IsPrimaryKey).map(constructField)))
        }

        prepareFields();
    }, [fields, data, lookupValues])

    useEffect(() => {
        const prepareLookupValues = async () => {
            let lookupValues = {};

            for(let field of fields.filter((val) => val.DataType == "LOOKUP")) {
                let response = await dbService.GetTableData(field.ReferencesTable, ["Id", field.ReferencesTableValue]);
                lookupValues[field.ColumnName] = response;
            }

            setLookupValues(lookupValues);
        }

        prepareLookupValues();
    }, [fields]);

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
            [column.ColumnName]: date.toISOString().replace('T', ' ').replace('Z', '').split('.')[0]
        };

        setData(newData);
    }

    const constructField = (item: ITableInfoColumn, index: number, arr: ITableInfoColumn[]) => {
        switch(item.DataType) {
            case "STRING":
                return <>
                    <Field label={item.ColumnName}>
                        {
                            item.MaxLength && item.MaxLength < 256 &&
                            <Input name={item.ColumnName} data-type={"STRING"} value={data[item.ColumnName] || item.DefaultValue || ""} onChange={setValue} required={!item.IsNullable} readOnly={Operation == "View"}></Input> ||
                            <Textarea name={item.ColumnName} data-type={"STRING"} resize={"vertical"} value={data[item.ColumnName] || item.DefaultValue || ""} onChange={setValue} required={!item.IsNullable} readOnly={Operation == "View"}></Textarea>
                        }
                    </Field>
                </>;
            case "LOOKUP":
                let response = lookupValues[item.ColumnName];
                let val = "";
                if(Operation == "View") {
                    val = response.filter(value => value.Id == data[item.ColumnName])[0].Name;
                }
                return <>

                    <Field label={item.ColumnName}>
                        {
                            Operation == "View" &&
                            <Input name={item.ColumnName} value={val} readOnly={Operation == "View"}></Input>
                            ||
                            <Select name={item.ColumnName} data-type={"LOOKUP"} value={data[item.ColumnName] || item.DefaultValue || "-1"} onChange={setValue} required={!item.IsNullable}>
                                <option value={"-1"} disabled>-- izberi opcijo --</option>
                                {
                                    response && response.map((res, i) => {
                                        return <option key={`Field_${item.Id}_${res["Id"]}`} value={res["Id"]}>{res[item.ReferencesTableValue]}</option>
                                    })
                                }
                            </Select>
                        }
                    </Field>
                </>
            case "DATE":
                return <>
                    <Field label={`${item.ColumnName}`}>
                        <DatePicker name={item.ColumnName} data-type={"DATE"} value={data[item.ColumnName] && new Date(data[item.ColumnName]) || item.DefaultValue && new Date(item.DefaultValue) || new Date()} onSelectDate={(date) => setDateValue(date, item)} required={!item.IsNullable} readOnly={Operation == "View"}></DatePicker>
                    </Field>
                </>
            case "BOOL":
                return <>
                    <Field>
                        <Switch name={item.ColumnName} data-type={"BOOL"} label={item.ColumnName} value={data[item.ColumnName] || item.DefaultValue == "0" || false} onChange={setValue} readOnly={Operation == "View"}/>
                    </Field>
                </>
            case "ENUM":
                let choices = item.Choices.split(",");
                return <>
                    <Field label={item.ColumnName}>
                        {
                            Operation == "View" &&
                            <Input name={item.ColumnName} value={data[item.ColumnName] || item.DefaultValue || ""} readOnly={Operation == "View"}></Input>
                            ||
                            <Select name={item.ColumnName} data-type={"ENUM"} value={data[item.ColumnName] || item.DefaultValue || "-1"} onChange={setValue} required={!item.IsNullable}>
                                <option value={"-1"} disabled>-- izberi opcijo --</option>
                                {
                                    choices && choices.map((choice, i) => {
                                        return <option key={`Field_${item.Id}_${i}`} value={i}>{choice}</option>
                                    })
                                }
                            </Select>
                        }
                    </Field>
                </>
        }


        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
        let select = Object.getOwnPropertyNames(data).filter(sel => sel != "Id");
        let valuesList = [];
        valuesList.push(select.map((sel) => data[sel]));

        if (Operation == "Create" && await dbService.CreateTableItem(TableName, select, valuesList)) navigate(`/admin/${TableName}`);
        else if (Operation == "Modify" && await dbService.UpdateTableItem(TableName, select, valuesList[0], Id)) navigate(`/admin/${TableName}`);
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