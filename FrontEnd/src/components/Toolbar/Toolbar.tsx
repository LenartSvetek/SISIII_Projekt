import React from "react";
import styles from "./Toolbar.module.scss";
import TBButton from "./Controlls/TBButton";
import Seperator from "./Controlls/TBSeperator";

export default function Toolbar(props) {
    return (
        <div>
            <div className={styles.Toolbar}>
                {props.children}
            </div>
        </div>
    );
}