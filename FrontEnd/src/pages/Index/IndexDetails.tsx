import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import styles from "./IndexDetails.module.scss";
import Toolbar from "@/components/Toolbar/Toolbar";
import TBButton from "@/components/Toolbar/Controlls/TBButton";
import Seperator from "@/components/Toolbar/Controlls/TBSeperator";
import DetailsList from "@/components/DetailsList/DetailsList";
import { useDBService } from "@/contexts/DBContext";
import { IColumn } from "@/components/DetailsList/IDetailsListProps";

export default function IndexDetails() {
    let { TableName } = useParams();
    
    const DBService = useDBService();
    let [ columns, setColumns ] = useState<IColumn[]>([]);
    let [ data, setData ] = useState<any[]>([]);


    useEffect(() => {
        DBService.GetTableColumns(TableName).then((TableInfo) => {
            setColumns(TableInfo.map((item) => {
                return {
                    FieldName: item.ColumnName,
                    DisplayName: item.ColumnName,
                    ValueType: item.DataType
                };
            }))
        });

        DBService.GetTableData(TableName).then(setData);
    }, [TableName]);

    return ( 
    <div className={styles.IndexDetail}>
        <h1>{TableName}</h1>
        <Toolbar>
            <TBButton>Hello</TBButton>
            <TBButton>World</TBButton>
            <Seperator></Seperator>
            <TBButton>Yeaa</TBButton>
        </Toolbar>

        <DetailsList 
        Columns={columns}
        Data={data}
        ></DetailsList>
    </div>
    );
}