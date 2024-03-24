import {Text, Flex} from "@mantine/core";

import {useUser} from "@/auth/useUser.tsx";

const Admin = () => {
    const user = useUser();
    return (
        <Flex direction="column">
            <h1>Admin Page</h1>
                {Object.entries(user).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <Text>{key} :</Text>
                            <Text maw={200} truncate>{JSON.stringify(value)}</Text>
                        </div>
                    );
                })}
        </Flex>
    );
}

export {Admin};