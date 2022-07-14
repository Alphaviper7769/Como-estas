import { createContext } from 'react';

export const AuthContext = createContext({
    admin: false, // admin is an employer
    userId: null,
    token: null,
    login: () => {},
    logout: () => {}
}); 