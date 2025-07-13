import { useDBService } from "@/contexts/DBContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import styles from "./LeftPanel.module.scss";
import { ITableInfo } from "@/api/IDBServiceProps";

export default function LeftPanel() {
    const DBService = useDBService();

    const [isFocused, setFocused ] = useState(false);
    const [TableInfoList, setTableInfoList] = useState<ITableInfo[]>([]);

    useEffect(()=>{
        document.body.addEventListener("click", () => setFocused(false));

        DBService.GetTableInfoList().then((TableInfoList) => {
            setTableInfoList(TableInfoList);
        })
    }, []);

    let focus = (ev : React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();

        setFocused(!isFocused);
    }

    let unFocus = (ev : React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();

        setFocused(false);
    }

    return (
        <div className={`${styles.LeftPanel} ${isFocused? styles.focused : ""}`} onClick={focus.bind(this)}>
            <Link to={"/"} onClick={unFocus.bind(this)}><FontAwesomeIcon icon="fa-solid fa-house" /><span>Home</span></Link>
            {
                TableInfoList.map((TableInfo) => 
                    <Link to={`/${TableInfo.TableName}`} onClick={unFocus.bind(this)} about={TableInfo.TableName}><FontAwesomeIcon icon={TableInfo.TableIcon} /><span>{TableInfo.TableName}</span></Link>    
                )
            }
        </div>
    );
};