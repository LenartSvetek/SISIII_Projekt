import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { useNavigate, useSearchParams } from "react-router";
import { useUPS } from "@/contexts/UserProfileContext";



export default function Login(props) {
    const UserService = useUPS();
    
    let navigate = useNavigate();

    
    const [searchParams, setSearchParams] = useSearchParams();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        searchParams.forEach(console.log);
    }, [searchParams])

    const login = async () => {
        if(username != "" && password != ""){
            let response = await UserService.Login(username, password);
            if(response) {
                navigate(searchParams.get("from"));
            }
        }
    }

    return (
        <div className={styles.centerDiv}>
            <div className={styles.loginCont}>
                <h3>CRM</h3>
                <h2>Login</h2>
                <div>
                    <input type="text" placeholder="Vnesi ime" value={username} onChange={(ev) => setUsername(ev.currentTarget.value)}></input>
                    <input type="password" placeholder="Vnesi geslo" value={password} onChange={(ev) => setPassword(ev.currentTarget.value)}></input>
                    <button onClick={login}>Prijavi se</button>
                </div>
            </div>
        </div>
    );
} 