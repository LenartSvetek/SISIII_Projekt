import React, { createContext, useContext } from 'react';
import { UserProfileService } from '@/api/UPService/UserProfileService';

const UPContext = createContext<UserProfileService | null>(null);

export const UserProfileProvider = ({ children }) => {

    // @ts-ignore
    const service = new UserProfileService();

    return (
        <UPContext.Provider value={service}>
            {children}
        </UPContext.Provider>
    );
};

export const useUPS = () => useContext(UPContext);