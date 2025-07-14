import React, { useEffect, useState } from "react";
import styles from "./DetailLists.module.scss";
import { IColumn, IDetailsListProps, config } from "./IDetailsListProps";
import DragButton from "../DragButton/DragButton";

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

    let onColResize = (ev : MouseEvent, btn : HTMLButtonElement) => {
        let index = 0;
        for(let col of listColumns) {
            console.log(btn.value, col.FieldName);
            if(btn.value == col.FieldName) break;
            index++;
        }
        console.log(btn.parentElement.getBoundingClientRect().left, ev.layerX)

        let width = ev.pageX - btn.parentElement.getBoundingClientRect().left;
        
        width = width > config.FinalMinWidth? width : config.FinalMinWidth;
        console.log(width)

        let newList = [...listColumns];

        newList[index].Width = width;

        setListColumns(newList);
    }

    return (
        <div className={styles.DetailsList}>
            <div>
                {
                    listColumns.map((col, index) => <>
                        <div className={styles.Header} style={
                            (index != listColumns.length - 1)?
                            { width: col.Width || config.Width, minWidth: col.Width || config.Width} :
                            { width: "100%", minWidth: config.Width}
                        }>
                            <h3>{col.DisplayName}</h3>
                            {
                                (col.IsResizable || config.IsResizable) &&
                                <DragButton value={col.FieldName} OnDrag={onColResize}></DragButton>
                            
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
                                    { width: col.Width || config.Width, minWidth: col.Width || config.Width} :
                                    { width: "100%", minWidth: config.Width}
                                }>
                                    <div className={styles.contentCell}>{item[col.FieldName]}</div>
                                </div>
                            </>)
                        }
                    </div>
                </>)
            }
        </div>
    )
}