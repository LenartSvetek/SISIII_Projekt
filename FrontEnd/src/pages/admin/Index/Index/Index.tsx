import React, { useEffect, useState } from 'react';
// @ts-ignore
import reactLogo from '@/assets/react.svg';

import styles from './Index.module.scss'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ITableInfo } from '../../../../api/DBService/IDBServiceProps';
import { useDBService } from '../../../../contexts/DBContext';
import { faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

function Index() {
    const DBService = useDBService();
    
    const [count, setCount] = useState(0);
    const [TableInfoList, setTableInfoList] = useState<ITableInfo[]>([])

    const navigate = useNavigate();

    useEffect(() =>{
        DBService?.GetTableInfoList().then((TableInfos) => {
            setTableInfoList(TableInfos);
        }).catch(console.error);
    }, [])

    let onClick = (ev : React.MouseEvent<HTMLButtonElement>) => {
        navigate(`/admin/${ev.currentTarget.value}`);
    }

    return (
        <div className={styles.App}>
            <div className={styles.KrNeki}>
                {
                    TableInfoList.map((TableInfo, index) => 
                        <button key={`TableInfo_${index}`} value={TableInfo.TableName} onClick={onClick}>
                            <h2>{TableInfo.TableName}</h2>
                            <FontAwesomeIcon icon={TableInfo.TableIcon as any}></FontAwesomeIcon>
                        </button>     
                    )
                }
            </div>
        </div>
    )
}

export default Index;