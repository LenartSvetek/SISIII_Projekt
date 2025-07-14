import React, { CSSProperties } from "react";

export interface IDragButtonProps{
    OnDrag ?: (ev : (MouseEvent), btn : HTMLButtonElement) => void;
    className ?: string;
    styles ?: CSSProperties;
    value ?: string;
}