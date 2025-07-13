import React from "react";
import { ITBButtonProps } from "./ITBButtonProps";
import styles from "./TBButton.module.scss";

export default function TBButton(props : ITBButtonProps){
    return (
        <button {...props} className={`${styles.TBButton} ${props.className}`}></button>
    );
}