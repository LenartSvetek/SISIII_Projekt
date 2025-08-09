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

    let [ selected, setSelected] = useState<Set<any>>(new Set());

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

    useEffect(() => {
        console.log(selected)
    }, [selected]);

    const newItem = () => {
        navigate(location.pathname + "/Create")
    }

    const viewItem = () => {
        if(selected.size == 1)
            selected.forEach((sel) => navigate(location.pathname + `/View/${sel}`))
        
    }

    const editItem = () => {
        if(selected.size == 1)
            selected.forEach((sel) => navigate(location.pathname + `/Modify/${sel}`))
        
    }

    return ( 
    <div className={styles.IndexDetail}>
        <h1>{TableName}</h1>
        <Toolbar>
            <TBButton onClick={newItem}>New item</TBButton>
            <TBButton disabled={selected.size != 1} onClick={viewItem}>View item</TBButton>
            <TBButton disabled={selected.size != 1} onClick={editItem}>Edit item</TBButton>
        </Toolbar>

        <DetailsList 
            Columns={columns}
            Data={data}
            MultiSelect={true}

            onSelectItem={setSelected}
        ></DetailsList>
    </div>
    );
}