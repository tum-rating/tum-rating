import { Button, Combobox, Flex, Text, ThemeIcon } from '@mantine/core';
import { IconSearchOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/auth/useUser.tsx';
import { getPath, Paths } from '@/routes/paths.ts';

interface ComboboxEmptyProps {
    value: string;
}

export const ComboboxEmpty = (props: ComboboxEmptyProps) => {
    const { value } = props;
    const { data: user } = useUser();
    const navigate = useNavigate();

    return (
        <Combobox.Empty>
            <Flex direction="column" align="center" py="xl" gap="md">
                <ThemeIcon variant="light" size="64">
                    <IconSearchOff width={44} height={44} />
                </ThemeIcon>
                <Text size="sm">No matching courses for <Text display="inline" fw="700">"{value}"</Text></Text>
                {user ? (
                    <Button
                        size="sm"
                        onClick={() => {
                            navigate(getPath(Paths.addCourse));
                        }}
                        // variant="subtle"
                    >
                        Add Course Proposal
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            navigate(getPath(Paths.signIn));
                        }}
                        size="sm"
                        // variant="subtle"
                    >
                        Sign In to Add Course Proposal
                    </Button>
                )}
            </Flex>
        </Combobox.Empty>
    );
};
