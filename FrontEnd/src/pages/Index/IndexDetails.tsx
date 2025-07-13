import React from "react";
import { useParams } from "react-router";

import styles from "./IndexDetails.module.scss";
import Toolbar from "@/components/Toolbar/Toolbar";
import TBButton from "@/components/Toolbar/Controlls/TBButton";
import Seperator from "@/components/Toolbar/Controlls/TBSeperator";
import DetailsList from "@/components/DetailsList/DetailsList";

export default function IndexDetails() {
    let { TableName } = useParams();

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
        Columns={
            [
                {
                    DisplayName: "Title al neki",
                    FieldName: "Title",
                    ValueType: "string"
                },
                {
                    DisplayName: "Description",
                    FieldName: "Description",
                    ValueType: "string"
                },
                {
                    DisplayName: "Telephone",
                    FieldName: "Telephone",
                    ValueType: "string"
                }
            ]
        }
        Data={
            [
                {
                    Title: "bo kar bo",
                    Description: "Pa treba ne ",
                    Telephone: "040345778"
                },
                {
                    Title: "bo kar bo",
                    Description: "Pa treba ne ",
                    Telephone: "040345778"
                },
                {
                    Title: "bo kar bo",
                    Description: "Pa treba ne ",
                    Telephone: "040345778"
                }
            ]
        }
        ></DetailsList>
    </div>
    );
}