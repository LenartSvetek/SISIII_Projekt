import React from "react";
import { Outlet } from "react-router";

import styles from "./Layout.module.scss";
import LeftPanel from "@/components/Layout/LeftPanel/LeftPanel";

export default function Layout() {
    return (
        <div className={styles.Layout}>
            <div className={styles.Header}></div>
            <div className={styles.LeftPanel}>
                <LeftPanel />
            </div>
            <div className={styles.Content}>
                <Outlet />
            </div>
        </div>
    );
}