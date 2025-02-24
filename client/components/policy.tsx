import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Policy = () => {
    const location = useLocation();
    const policy = new URLSearchParams(location.search).get('policy'); // Get the 'text' parameter from the URL

    useEffect(() => {
        // Remove the 'text' query parameter from the URL after rendering it
        if (policy) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, [policy]);

    return <div>{policy}</div>;
};

export default Policy;
