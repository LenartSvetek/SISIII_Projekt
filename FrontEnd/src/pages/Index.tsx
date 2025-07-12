import React, { useEffect, useState } from 'react';
// @ts-ignore
import reactLogo from '@/assets/react.svg';

import styles from './Index.module.scss'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ITableInfo } from '../api/IDBServiceProps';
import { useDBService } from '../contexts/DBContext';
import { faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';

function Index() {
    const DBService = useDBService();
    
    const [count, setCount] = useState(0);
    const [TableInfoList, setTableInfoList] = useState<ITableInfo[]>([])

    useEffect(() =>{
        DBService?.GetTableInfoList().then((TableInfos) => {
            setTableInfoList(TableInfos);
        }).catch(console.error);
    }, [])

    let onClick = (ev : React.MouseEvent<HTMLButtonElement>) => {
        DBService?.GetTableInfo(ev.currentTarget.value).then(console.log).catch(console.error);
    }

    return (
        <div className={styles.App}>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className={styles.KrNeki}>
                {
                    TableInfoList.map((TableInfo) => 
                        <button value={TableInfo.TableName} onClick={onClick}>
                            <h2>{TableInfo.TableName}</h2>
                            <FontAwesomeIcon icon={TableInfo.TableIcon as any}></FontAwesomeIcon>
                        </button>     
                    )
                }
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    )
}

export default Index
