import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import styles from "./AdminLayout.module.scss";
import LeftPanel from "@/components/Layout/LeftPanel/LeftPanel";
import { useUPS } from "@/contexts/UserProfileContext";

export default function AdminLayout() {
    let location = useLocation();
    let navigate = useNavigate();
    let profileService = useUPS();

    useEffect(() => {
        const checkAuth = async () => {
            if (!await profileService.IsAuth() && location.pathname !== "/admin/login") {
                navigate("/admin/login");
            }
        };

        checkAuth();
    }, [[location.pathname, navigate, profileService]])

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