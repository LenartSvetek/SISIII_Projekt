import React, { useEffect, useRef, useState } from "react";
import { IDragButtonProps } from "./IDragButtonProps";

export default function DragButton(props : IDragButtonProps) {
    let btnRef = useRef<HTMLButtonElement>();

    let [ isDragging, setDragging ] = useState(false);

    let onClick = (() => {
        setDragging(true);
    })

    let onMouseUp = (() => setDragging(false));

    let onDrag = (ev) => {
        props.OnDrag(ev, btnRef.current);
    }

    useEffect(() => {
        if(props.OnDrag) {
            if(isDragging) {
                document.body.addEventListener("mousemove", onDrag);
                document.body.addEventListener("mouseup", onMouseUp);
            } else {
                document.body.removeEventListener("mouseover", onDrag);
                document.body.removeEventListener("mouseup", onMouseUp)
            }

            return () => {
                document.body.removeEventListener("mousemove", onDrag);
                document.body.removeEventListener("mouseup", onMouseUp);
            };
        }
    }, [isDragging])

    return <button ref={btnRef} value={props.value} style={props.styles} onMouseDown={onClick.bind(this)} className={props.className}></button>
}