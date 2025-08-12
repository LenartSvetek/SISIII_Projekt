import React, { createContext, useContext } from 'react';
import { DBService } from '../api/DBService/DBService';

const DBContext = createContext<DBService | null>(null);

export const DBProvider = ({ children }) => {

    // @ts-ignore
    const service = new DBService({ BaseUrl: import.meta.env.VITE_DB_API_URL && import.meta.env.VITE_DB_API_PORT && import.meta.env.VITE_DB_API_URL + ":" + import.meta.env.VITE_DB_API_PORT || 'https://88.200.63.148:6969/'});

    return (
        <DBContext.Provider value={service}>
            {children}
        </DBContext.Provider>
    );
};

export const useDBService = () => useContext(DBContext);