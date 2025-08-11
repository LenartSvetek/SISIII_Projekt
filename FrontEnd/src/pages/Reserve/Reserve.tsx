import React, { useEffect, useState } from 'react';
// @ts-ignore
import reactLogo from '@/assets/react.svg';

import styles from './Reserve.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDBService } from '@/contexts/DBContext';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Button, Field, Input } from '@fluentui/react-components';

function Reserve() {
    let dbService = useDBService();

    let [ spots, setSpots ] = useState([]);
    let [ spotSelected, setSelectedSpot ] = useState("");

    let [ startDate, setStartDate ] = useState<Date>(null);
    let [ endDate, setEndDate ] = useState<Date>(null);
    let [ reservedSpots, setReservedSpots ] = useState<Set<string>>(new Set());
    let [ data, setData] = useState({});

    let [ statusMessage, setStatusMessage ] = useState("");
    let [ status, setStatus ] = useState(null)

    useEffect(() => {
        const getSpots = async () => {
            if(startDate && endDate){
                setSpots(await dbService.GetTableData("CamperSpot"));
                let startISO = startDate.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
                let endISO = endDate.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
                let filter = `StartDate < '${endISO}' and EndDate > '${startISO}'`;
                setReservedSpots(new Set((await dbService.GetTableData("Reservation", ["SpotId"], filter)).map((item) => item.SpotId)));
            }
        };

        getSpots();
    }, [startDate, endDate]);


    const onSpotSelect = (spotId) => {
        if(!reservedSpots.has(spotId))
            setSelectedSpot(spotId);
    }

    const handleSubmit = async (ev : React.FormEvent) => {
        ev.preventDefault();

        if(!startDate) {
            setStatusMessage("Prosimo vnesite kdaj boste prispeli do nas");
            setStatus("Informative");
        } 
        else if(!endDate) {
            setStatusMessage("Prosimo vnesite do kdaj boste ostali pri nas");
            setStatus("Informative");
        }
        else if(spotSelected.trim() == "") {
            setStatusMessage("Prosimo izberite svoje parkirno mesto");
            setStatus("Informative");
        }

        if(!startDate || !endDate || spotSelected.trim() == "") return;
        let user = (await dbService.GetTableData("UserInfo", ["Id"], `Email = '${data["Email"]}'`));
        let userId = "";
        if(user.length > 0) {
            userId = user[0]["Id"];
        }
        else {
            await dbService.CreateTableItem("UserInfo", ["Name", "Email", "Temporary"], [[data["FullName"], data["Email"], 1]]);
            user = (await dbService.GetTableData("UserInfo", ["Id"], `Email = '${data["Email"]}'`));
            userId = user[0]["Id"];
        }
        
        if((await dbService.GetTableData("Reservation", ["Id"], `EndDate > '${new Date()}' and UserId = '${userId}'`)).length >= 3) {
            setStatusMessage("Na enkrat so veljavne lahko le 3 reservacije naenkrat!");
            setStatus("Warning");
            return;
        }

        let startISO = startDate.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
        let endISO = endDate.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
        await dbService.CreateTableItem("Reservation", 
            ["UserID", "SpotID", "StartDate", "EndDate", "LicencePlate"], 
            [[userId, spotSelected, startISO, endISO, data["Code"] + data["Licence"]]]
        );

        let filter = `StartDate < '${endISO}' and EndDate > '${startISO}'`;
        setReservedSpots(new Set((await dbService.GetTableData("Reservation", ["SpotId"], filter)).map((item) => item.SpotId)));
        setSelectedSpot("");
    };

    const setValue = (ev : React.ChangeEvent) => {
        let input = ev.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        
        setData(prev => ({
            ...prev,
            // @ts-ignore
            [input.name]: input.type && input.type == "checkbox"? input.checked : input.value
        }));
    }

    return (
        <div className={styles.home}>
            <div className={styles.float}>
                <div className={styles.reserve}>
                    <h1>Reserve</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles['form-group']}>
                            <div className={styles['form-md-6']}>
                                <Field required label="Od kdaj">
                                    <DatePicker minDate={new Date()} maxDate={endDate} onSelectDate={setStartDate}></DatePicker>
                                </Field>
                            </div>
                            <div className={styles['form-md-6']}>
                                <Field required label={"Do kdaj"}>
                                    <DatePicker minDate={startDate || new Date()} onSelectDate={setEndDate}></DatePicker>
                                </Field>
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <div className={styles['form-md-6']}>
                                <Field required label={"Ime in priimek"}>
                                    <Input name="FullName" value={data["FullName"] || ""} onChange={setValue}></Input>
                                </Field>
                            </div>
                            <div className={styles['form-md-6']}>
                                <Field required label={"Email"}>
                                    <Input name="Email" value={data["Email"] || ""} onChange={setValue}></Input>
                                </Field>
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <div className={styles['form-md-3']}>
                                <Field required label={"Country code"}>
                                    <Input name="Code" value={data["Code"] || ""} onChange={setValue}></Input>
                                </Field>
                            </div>
                            <div className={styles['form-md-9']}>
                                <Field required label={"Registration table"}>
                                    <Input name="Licence" value={data["Licence"] || ""} onChange={setValue}></Input>
                                </Field>
                            </div>
                        </div>
                        <div className={styles.status}>
                            {
                                status &&
                                <div className={`${styles.statusBox} ${styles[status]}`}>
                                    <div className={styles['status-icon']}>
                                        {
                                            status == "Warning" &&
                                            // @ts-ignore
                                            <FontAwesomeIcon icon={"fa-solid fa-exclamation"} size='2x' color='red'></FontAwesomeIcon>
                                        }
                                        {
                                            status == "Informative" &&
                                            // @ts-ignore
                                            <FontAwesomeIcon icon={"fa-solid fa-info"} size='2x' color='darkblue'></FontAwesomeIcon>
                                        }
                                    </div>
                                    { statusMessage }
                                </div>
                            }
                            
                        </div>
                        <button type='submit'>Poslji</button>
                        
                    </form>
                </div>
                <div>
                    <svg width={350} height={350} className={styles.map}>
                        {
                            spots.map((spot, i) => {
                                let mapHeight = 350;
                                let col = Math.floor((i * 30 + i * 10 + 20 + 30) / mapHeight);
                                let rows = Math.floor((mapHeight - 20) / 40);
                                let x = 10 + col *  85;
                                let y = 10 + (i - col * rows) * 40;

                                return <>
                                    <clipPath id={`clippath-${spot.Id}`}>
                                        <rect width={65} height={20} x={x} y={y}></rect>
                                    </clipPath>
                                    <rect width={75} height={30} className={`${styles.spot} ${(spotSelected == spot.Id)? styles.selected : ""} ${reservedSpots.has(spot.Id)? styles.taken : ""}`} x={x} y={y} onClick={() => onSpotSelect(spot.Id)}></rect>
                                    <text x={x + 5} y={y + 17.5} clipPath={`url(#clippath-${spot.Id})`} className={styles.spotText} onClick={() => onSpotSelect(spot.Id)}>{spot.Name}</text>
                                </>
                            })
                        }
                    </svg>
                </div>
            </div>            
        </div>
    )
}

export default Reserve;