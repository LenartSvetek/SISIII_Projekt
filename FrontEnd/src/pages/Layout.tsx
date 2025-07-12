import React from "react";
import { Outlet } from "react-router";

import styles from "./Layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.Layout}>
      <div className={styles.Header}></div>
      <div className={styles.LeftPanel}></div>
      <div className={styles.Content}>
        <Outlet />
      </div>
    </div>
  );
}