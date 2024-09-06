import {Flex} from '@mantine/core';
import {MRT_Row} from 'mantine-react-table';
import {HTMLAttributes} from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';


import {Review} from '@/admin/types.ts';

interface ReviewExpansionProps extends HTMLAttributes<HTMLElement> {
    courseId: string;
    row?: MRT_Row<Review>;
}

const ReviewExpansion = ({courseId, row, ...rest}: ReviewExpansionProps) => {

    return (
        <Flex wrap={{base: 'wrap', sm: 'nowrap'}} className={classes.expansionContainer} gap="md" w="100vw" {...rest}>
           not implemented
        </Flex>
    );
};

export {ReviewExpansion};
