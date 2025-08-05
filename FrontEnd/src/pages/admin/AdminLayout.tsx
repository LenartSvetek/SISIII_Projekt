import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import styles from "./AdminLayout.module.scss";
import LeftPanel from "@/components/Layout/LeftPanel/LeftPanel";
import { useUPS } from "@/contexts/UserProfileContext";
import { faSquarePollHorizontal } from "@fortawesome/free-solid-svg-icons";

export default function AdminLayout() {
    const [auth, setAuth] = useState<boolean>(false);

    let location = useLocation();
    let navigate = useNavigate();
    let profileService = useUPS();

    useEffect(() => {
        const checkAuth = async () => {
            if (!await profileService.IsAuth() && location.pathname !== "/admin/login") {
                setAuth(true);
                navigate(`/admin/login?from=${encodeURIComponent(location.pathname)}`);
            }
        };

        checkAuth();
    }, [[location.pathname, navigate, profileService]])

    const logout = async () => {
        if(await profileService.Logout()) {
            navigate("/admin/login");
        }
    }

    if(!auth){
        return null;
    }

    return (
        <div className={styles.Layout}>
            <div className={styles.Header}>
                <button className={styles.logout} onClick={logout}>Odjavi se</button>
            </div>
            <div className={styles.LeftPanel}>
                <LeftPanel />
            </div>
            <div className={styles.Content}>
                <Outlet />
            </div>
        </div>
    );
}