import React, { useEffect, useState } from "react";
import styles from "./DetailLists.module.scss";
import { IColumn, IDetailsListProps, config } from "./IDetailsListProps";

export default function DetailsList(props : IDetailsListProps){
    let [ gridTemplateColumns, setGridTemplateColumns ] = useState("");
    let [ listColumns, setListColumns ] = useState<IColumn[]>(props.Columns);
    let [ data, setData ] = useState([]);

    let calculateGridTempCol = () => {
        let gTempColumns = [];
        for(let column of listColumns){
            gTempColumns.push((column.Width || config.Width) + "px");
        }
        setGridTemplateColumns(gTempColumns.join(" "));
    };

    useEffect(() => {
        setListColumns(props.Columns);
        setData(props.Data);
        calculateGridTempCol();
    }, [props])

    return (
        <div className={styles.DetailsList}>
            <div>
                {
                    listColumns.map((col, index) => <>
                        <div className={styles.Header} style={
                            (index != listColumns.length - 1)?
                            { width: col.Width || config.Width} :
                            { width: "100%", minWidth: col.Width || config.Width}
                        }>
                            <h3>{col.DisplayName}</h3>
                            {
                                (col.IsResizable || config.IsResizable) &&
                                <button onDrag={console.log} className={styles.resizeBar}></button>
                            
                            }
                        </div>
                    </>)
                }
            </div>
            {
                data.map((item) => <>
                    <div>
                        {
                            listColumns.map((col, index) => <>
                                <div style={
                                    (index != listColumns.length - 1)?
                                    { width: col.Width || config.Width} :
                                    { width: "100%", minWidth: col.Width || config.Width}
                                }>
                                    {item[col.FieldName]}
                                </div>
                            </>)
                        }
                    </div>
                </>)
            }
        </div>
    )
}