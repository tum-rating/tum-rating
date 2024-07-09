import {Anchor, Breadcrumbs, Container} from '@mantine/core';
import {PropsWithChildren, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {HEADER_HEIGHT} from '@/constants';
import {getPath, Paths} from '@/routes/paths.ts';

function prependAdminAndConvertToCamelCase(str: string) {
    let words = str.split('-');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return 'admin' + words.join('');
}

export const AdminCollectionDetailsWrapper = ({children}: PropsWithChildren) => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = location.pathname;
        const tempBreadcrumbs = path
            .split('/')
            .filter((part) => part !== 'admin' && part.length)
            .map((el) => {
                return {
                    title: el,
                    href: getPath(Paths[prependAdminAndConvertToCamelCase(el)]),
                };
            });
        setBreadcrumbs(tempBreadcrumbs);
    }, [location]);

    return (
        <Container
            style={{
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                overflowY: 'auto',
            }}
        >
            <Breadcrumbs my="sm">
                {breadcrumbs.map((breadcrumb, index) => {
                    return (
                        <Anchor
                            key={breadcrumb.title}
                            onClick={(e) => {
                                e.preventDefault();
                                if (index === breadcrumbs.length - 1) {
                                    navigate('#');
                                } else {
                                    navigate(breadcrumb.href);
                                }
                            }}
                            fz="sm"
                            fw="500"
                            truncate
                            underline="hover"
                            href="#"
                        >
                            {breadcrumb.title}
                        </Anchor>
                    );
                })}
            </Breadcrumbs>
            {children}
        </Container>
    );
};
