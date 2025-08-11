import DetailsList from "@/components/DetailsList/DetailsList";
import { useDBService } from "@/contexts/DBContext";
import { useUPS } from "@/contexts/UserProfileContext";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./View.module.scss";
import { Button } from "@fluentui/react-components";



export default function View() {
    let DBService = useDBService();
    let [ data, setData ] = useState([]);
    let [ userId, setUserId ] = useState("");
    let navigate = useNavigate();
    let dbService = useDBService();
    let upservice = useUPS();

    let [ selected, setSelected] = useState<Set<any>>(new Set());

    useEffect(() => {
        const checkAuth = async () => {
            let user = await dbService.GetTableData("UserInfo", ["Id"], `Email = '${upservice.Email}' and Password = '${upservice.Code}'`);
            if((user).length == 0) {
                navigate("/")
            }
            let userId = user[0]["Id"];
            setUserId(userId);
            
            let todayISO = (new Date()).toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
            setData(await dbService.GetTableData("Reservation", ["Id","StartDate", "EndDate", "Status", "LicencePlate"], `EndDate > '${todayISO}' and UserID = '${userId}'`));
        }    
    
        checkAuth();
    }, [upservice.Email, upservice.Code]);

    const deleteItem = async () => {
        if(selected.size > 0) {
            await DBService.DeleteTableItems("Reservation", Array.from(selected));
            setSelected(new Set());
            let todayISO = (new Date()).toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
            setData(await dbService.GetTableData("Reservation", ["Id","StartDate", "EndDate", "Status", "LicencePlate"], `EndDate > '${todayISO}' and UserID = '${userId}'`));
        }
    }

    return <>
        <div className={styles.home}>
            <div className={styles.float}>
                <div>
                    <Button disabled={selected.size == 0} onClick={deleteItem}>Delete</Button>
                </div>
                <DetailsList
                    Columns={
                        [
                            {
                                DisplayName: "Start Date",
                                FieldName: "StartDate",
                                ValueType: "date"
                            },
                            {
                                DisplayName: "End Date",
                                FieldName: "EndDate",
                                ValueType: "date"
                            },
                            {
                                DisplayName: "Status",
                                FieldName: "Status",
                                ValueType: "string"
                            },
                            {
                                DisplayName: "Licence Plate",
                                FieldName: "LicencePlate",
                                ValueType: "string"
                            },
                        ]
                    }
                    Data={data}
                    MultiSelect={true}
                    onSelectItem={setSelected}
                >
                </DetailsList>
            </div>
        </div>
    </>;
}