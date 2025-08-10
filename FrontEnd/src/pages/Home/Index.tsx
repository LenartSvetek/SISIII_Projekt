import React, { useEffect, useState } from 'react';
// @ts-ignore
import reactLogo from '@/assets/react.svg';

import styles from './Index.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDBService } from '@/contexts/DBContext';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Button, Field, Input } from '@fluentui/react-components';

function Index() {
    let dbService = useDBService();

    let [ spots, setSpots ] = useState([]);
    let [ spotSelected, setSelectedSpot ] = useState("");

    let [ startDate, setStartDate ] = useState<Date>(null);
    let [ endDate, setEndDate ] = useState<Date>(null);
    let [ reservedSpots, setReservedSpots ] = useState<Set<string>>(new Set());

    useEffect(() => {
        const getSpots = async () => {
            if(startDate && endDate){
                setSpots(await dbService.GetTableData("CamperSpot"));
                let startISO = startDate.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
                let endISO = endDate.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
                let filter = `StartDate > '${startISO}' and EndDate < '${endISO}'`;
                setReservedSpots(new Set((await dbService.GetTableData("Reservation", ["SpotId"], filter)).map((item) => item.SpotId)));
            }
        };

        getSpots();
    }, [startDate, endDate]);

    useEffect(() => {
        console.log("Reserved spots: ", reservedSpots);
    }, [reservedSpots]);

    const onSpotSelect = (spotId) => {
        if(!reservedSpots.has(spotId))
            setSelectedSpot(spotId);
    }

    const handleSubmit = (ev : React.FormEvent) => {
        ev.preventDefault();

        console.log("YOOO");
    };

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
                                    <Input></Input>
                                </Field>
                            </div>
                            <div className={styles['form-md-6']}>
                                <Field required label={"Email"}>
                                    <Input></Input>
                                </Field>
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <div className={styles['form-md-3']}>
                                <Field required label={"Country code"}>
                                    <Input></Input>
                                </Field>
                            </div>
                            <div className={styles['form-md-9']}>
                                <Field required label={"Registration table"}>
                                    <Input style={{width: "100%"}}></Input>
                                </Field>
                            </div>
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

export default Index;