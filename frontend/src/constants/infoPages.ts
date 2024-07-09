import {IconAlien, IconAddressBook, IconScript, IconStars} from '@tabler/icons-react';

import {getPath, Paths} from '@/routes/paths.ts';

const INFO_PAGES = [
    {
        title: 'Home',
        icon: IconStars,
        path: '/',
    },
    {
        title: 'About Us',
        icon: IconAlien,
        path: getPath(Paths.about),
    },
    {
        title: 'Feedback',
        icon: IconAddressBook,
        path: getPath(Paths.feedback),
    },
    {
        title: 'Privacy Policy',
        icon: IconScript,
        path: getPath(Paths.privacyPolicy),
    },
    {
        title: 'Terms of Service',
        icon: IconScript,
        path: getPath(Paths.termsOfService),
    },
];

export {INFO_PAGES};
