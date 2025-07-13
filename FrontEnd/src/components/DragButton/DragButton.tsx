import React from "react";
import { IDragButtonProps } from "./IDragButtonProps";

export default function DragButton(props : IDragButtonProps) {
    return <button style={props.styles} className={props.className}></button>
}