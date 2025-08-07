import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import styles from "./IndexDetails.module.scss";
import Toolbar from "@/components/Toolbar/Toolbar";
import TBButton from "@/components/Toolbar/Controlls/TBButton";
import Seperator from "@/components/Toolbar/Controlls/TBSeperator";
import DetailsList from "@/components/DetailsList/DetailsList";
import { useDBService } from "@/contexts/DBContext";
import { IColumn } from "@/components/DetailsList/IDetailsListProps";

export default function IndexDetails() {
    let location = useLocation();
    let navigate = useNavigate();
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

    const newItem = () => {
        navigate(location.pathname + "/Create")
    }

    return ( 
    <div className={styles.IndexDetail}>
        <h1>{TableName}</h1>
        <Toolbar>
            <TBButton onClick={newItem}>New item</TBButton>
            <TBButton>World</TBButton>
            <Seperator></Seperator>
            <TBButton>Yeaa</TBButton>
        </Toolbar>

        <DetailsList 
            Columns={columns}
            Data={data}
            MultiSelect={true}
        ></DetailsList>
    </div>
    );
}