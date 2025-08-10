import React, { useState } from "react";
import styles from "./Index.module.scss";
import { Field, Input } from "@fluentui/react-components";
import { useNavigate } from "react-router";
import { useDBService } from "@/contexts/DBContext";
import { useUPS } from "@/contexts/UserProfileContext";

export default function Index() {
    let navigate = useNavigate();
    let dbService = useDBService();

    let [ data, setData ] = useState({});
    let upservice = useUPS();


    const setValue = (ev : React.ChangeEvent) => {
        let input = ev.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        
        setData(prev => ({
            ...prev,
            // @ts-ignore
            [input.name]: input.type && input.type == "checkbox"? input.checked : input.value
        }));
    }

    const handleSubmit = async (ev : React.FormEvent) => {
        ev.preventDefault();

        if(!data["Email"] || !data["Code"]) return;
        if((await dbService.GetTableData("UserInfo", ["Id"], `Email = '${data["Email"]}' and Password = '${data["Code"]}'`)).length > 0) {
            upservice.Email = data["Email"];
            upservice.Code = data["Code"];
            navigate("/View")
        }
    }

    return <>
        <div className={styles.home}>
            <div className={styles.float}>
                <h1>Welcome</h1>
                <form onSubmit={handleSubmit}>
                    <Field required label={"Email"}>
                        <Input name="Email" value={data["Email"] || ""} onChange={setValue}></Input>
                    </Field>
                    <Field required label={"Koda"}>
                        <Input name="Code" value={data["Code"] || ""} onChange={setValue}></Input>
                    </Field>
                    <button type="submit">Prijavi se</button>
                    <button onClick={() => navigate("/Reserve")}>Reserviraj</button>
                </form>
            </div>
        </div>
    </>
}