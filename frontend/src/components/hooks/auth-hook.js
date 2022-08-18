import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

// hook to login and logout users
export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpiration, setTokenExpiration] = useState();
    const [userId, setId] = useState();
    const [admin, setAdmin] = useState(false);

    const login = useCallback((id, admin, token, expirationDate) => {
        setAdmin(admin);
        setToken(token);
        setId(id);
        // sessions -> lasts 4 hours
        const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 4); //4 hours
        setTokenExpiration(tokenExpiration);
        // storing the data in the browser to access it later
        localStorage.setItem(
            'userCV',
            JSON.stringify({
                userId: id,
                admin: admin,
                token: token,
                expiration: tokenExpiration.toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {
        setAdmin(false);
        setId(null);
        setToken(null);
        setTokenExpiration(null);
        localStorage.removeItem('userCV');
    }, []);

    useEffect(() => {
        // checking whether session time is remaining
        if (token && tokenExpiration) {
            const remainingTime = tokenExpiration.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
          } else {
            clearTimeout(logoutTimer);
          }
    }, [token, login, tokenExpiration, admin, userId]);

    useEffect(() => {
        // log the user in if session is not over
        const storedData = JSON.parse(localStorage.getItem('userCV'));
        if(storedData && storedData.token && (new Date(storedData.expiration) > new Date())) {
            login(storedData.userId, storedData.admin, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);
    
    return { userId, admin, token, login, logout };
};