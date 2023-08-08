// @flow

import {Autocomplete, Center} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";

export const Home = () => {
    return (
        <Center>
            <Autocomplete
                placeholder="Search"
                icon={<IconSearch size="1rem" stroke={1.5} />}
                data={['tum-1','tum2','tum3','tum4','tum56']}
            />
        </Center>

    );
};