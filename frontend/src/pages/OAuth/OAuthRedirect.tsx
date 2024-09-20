import {Box} from '@mantine/core';
import {RouteLoader} from '@/components/Loaders';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';


// TODO refactor form MVP state
export const OAuthRedirect = () => {
    const [eventFired, setEventFired] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // tu jest double render przez co 2 requesty ida kiedy react jest w development mode
        // przez co 2gi da fail bo code jest jednorazowego uzytku

        const queryParams = new URLSearchParams(location.search);
        console.log('queryParas', queryParams);

        fetch('http://localhost:3000/api/v1/auth/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                redirectURL: `${location.pathname}${location.search}`,
            }),
        });
    }, [location, eventFired]);

    return (
        // <PageWrapper>
            <Box p="xl" className="children-animation">
                <RouteLoader />
            </Box>
        // </PageWrapper>
    );
};
