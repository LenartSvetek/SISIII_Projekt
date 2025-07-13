import React, { CSSProperties } from "react";

export interface IDragButtonProps{
    OnDrag : (ev) => void;
    className : string;
    styles : CSSProperties;
}