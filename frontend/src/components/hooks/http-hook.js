import { useCallback, useRef, useState, useEffect } from 'react'

export const useHttp = () => {
    // page loading when http requests are made
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    // to store all pennding http requests
    // useRef is used to retain data after the page re-renders
    const httpRequests = useRef([]);
    // callback returns a function which is our hook
    const httpRequest = useCallback(async (url, method='GET', body=null, headers={}) => {
        setLoading(true);
    
        // to get signal that contains information whether we encoutered an error and it aborted with it's reason
        const abortController = new AbortController();
        // push it to the existing array of requests
        httpRequests.current.push(abortController);

        try {
            const response = await fetch(url, { method, body, headers, signal: abortController.signal });
            const res = await response.json();
            // remove the current request from the array
            httpRequests.current = httpRequests.current.filter(req => req !== abortController);

            // check for ok status returned from the server
            if(!response.ok) {
                throw new Error(res.message);
            }

            setLoading(false);
            return res;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    }, []);

    // remove error message... usually used for flushing errors on refreshing page
    const clearError = () => { setError(null) };

    // abort controller for every pending http request on every page render.... component calling in our case
    useEffect(() => {
        return () => {
            httpRequests.current.forEach(req => req.abort());
        };
    }, []);

    return { loading, error, clearError, httpRequest };
};