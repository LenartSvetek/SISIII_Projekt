import { useDBService } from "@/contexts/DBContext";
import { useUPS } from "@/contexts/UserProfileContext";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function View() {
    let [ data, setData ] = useState([]);
    let navigate = useNavigate();
    let dbService = useDBService();
    let upservice = useUPS();

    useEffect(() => {
        const checkAuth = async () => {
            let user = await dbService.GetTableData("UserInfo", ["Id"], `Email = '${upservice.Email}' and Password = '${upservice.Code}'`);
            if((user).length == 0) {
                navigate("/")
            }
            let userId = user[0]["Id"];
            
            let todayISO = (new Date()).toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
            setData(await dbService.GetTableData("Reservation", ["StartDate", "EndDate", "Status", "LicencePlate"], `EndDate > '${todayISO}' and UserID = '${userId}'`));
        }    
    
        checkAuth();
    }, [upservice.Email, upservice.Code])

    return <>
        <table>
            <thead>
                <tr>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Status</th>
                    <th>Licence plate</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item) => {
                        console.log(item);
                        return <>
                            <tr>
                                <td>{new Date(item.StartDate).toString()}</td>
                                <td>{new Date(item.EndDate).toString()}</td>
                                <td>{item.Status}</td>
                                <td>{item.LicencePlate}</td>
                            </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}