import React, { useEffect, useState } from "react";
import styles from "./DetailLists.module.scss";
import { IColumn, IDetailsListProps, DefaultColumnConfig, IDetailListConfig, DefaultDetailListConfig } from "./IDetailsListProps";
import DragButton from "../DragButton/DragButton";

export default function DetailsList(props : IDetailsListProps){
    let [ gridTemplateColumns, setGridTemplateColumns ] = useState("");
    let [ listColumns, setListColumns ] = useState<IColumn[]>(props.Columns);
    let [ data, setData ] = useState([]);
    let [ selected, setSelected] = useState<Set<string>>(new Set());

    let [DLConfig, setDLConfig] = useState<IDetailListConfig>(DefaultDetailListConfig);  

    let calculateGridTempCol = () => {
        let gTempColumns = [];
        for(let column of listColumns){
            gTempColumns.push((column.Width || DefaultColumnConfig.Width) + "px");
        }
        setGridTemplateColumns(gTempColumns.join(" "));
    };

    useEffect(() => {
        let newConf = DLConfig;
        for(let property of Object.getOwnPropertyNames(DefaultDetailListConfig)){
            if(props[property]){
                newConf[property] = props[property];
            }
        }

        setDLConfig(newConf);
        setListColumns(props.Columns);
        setData(props.Data);
        calculateGridTempCol();
    }, [props])

    useEffect(() => {
        setSelected(new Set());
    }, [props.MultiSelect]);

    let onColResize = (ev : MouseEvent, btn : HTMLButtonElement) => {
        let index = 0;
        for(let col of listColumns) {
            if(btn.value == col.FieldName) break;
            index++;
        }

        let width = ev.pageX - btn.parentElement.getBoundingClientRect().left;
        
        width = width > DefaultColumnConfig.FinalMinWidth? width : DefaultColumnConfig.FinalMinWidth;

        let newList = [...listColumns];

        newList[index].Width = width;

        setListColumns(newList);
    }

    let onItemSelect = async (ev : React.ChangeEvent<HTMLInputElement>) => {
        let checked = ev.currentTarget.checked;
        let value = ev.currentTarget.value;
        let tmpSel = new Set(selected);

        if(value != "*"){
            if(props.MultiSelect) {
                if(checked) tmpSel.add(value);
                else tmpSel.delete(value);
            }
            else {
                tmpSel = new Set(value)
            }
        }
        else {
            if(checked) {
                for(let item of data) {
                    tmpSel.add(item.Id);
                }
            }
            else tmpSel = new Set();
        }

        if(props.onSelectItem) props.onSelectItem(tmpSel);

        setSelected(tmpSel);
    }

    return (
        <div className={styles.DetailsList}>
            <div className={styles.header}>
                {
                    DLConfig.MultiSelect &&
                    <div className={styles.checkboxCont}>
                        <input value={"*"} type="checkbox" onChange={onItemSelect} checked={data.length == selected.size}></input>
                    </div>
                }
                {
                    listColumns.map((col, index) => <>
                        <div className={styles.Header} style={
                            (index != listColumns.length - 1)?
                            { width: col.Width || DefaultColumnConfig.Width, minWidth: col.Width || DefaultColumnConfig.Width} :
                            { width: "100%", minWidth: DefaultColumnConfig.Width}
                        }>
                            <h3>{col.DisplayName}</h3>
                            {
                                (col.IsResizable || DefaultColumnConfig.IsResizable) &&
                                <DragButton value={col.FieldName} OnDrag={onColResize}></DragButton>
                            
                            }
                        </div>
                    </>)
                }
            </div>
            {
                data.map((item) => <>
                    <div className={styles.content}>
                        {
                            DLConfig.MultiSelect &&
                            <div className={styles.checkboxCont}>
                                <input value={item.Id} type="checkbox" checked={selected.has(item.Id)} onChange={onItemSelect}></input>
                            </div>
                        }
                        {
                            listColumns.map((col, index) => <>
                                <div style={
                                    (index != listColumns.length - 1)?
                                    { width: col.Width || DefaultColumnConfig.Width, minWidth: col.Width || DefaultColumnConfig.Width} :
                                    { width: "100%", minWidth: DefaultColumnConfig.Width}
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