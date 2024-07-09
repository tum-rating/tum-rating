import { Button, Combobox, Container, Flex, Loader, Text, ThemeIcon } from '@mantine/core';
import { IconSearchOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/auth/useUser.tsx';
import { getPath, Paths } from '@/routes/paths.ts';

interface ComboboxEmptyProps {
    value: string;
    isLoading: boolean;
}

export const ComboboxEmpty = (props: ComboboxEmptyProps) => {
    const { value, isLoading } = props;
    const { data: user } = useUser();
    const navigate = useNavigate();

    return (
        <Combobox.Empty>
            <Flex direction="column" align="center" py="xl" gap="md">
                <ThemeIcon variant="light" size="64">
                    <IconSearchOff width={44} height={44} />
                </ThemeIcon>
                <Container>
                    {' '}
                    <Text size="sm">No matching courses for</Text>
                    {isLoading ? (
                        <Loader size="xs" />
                    ) : (
                        <Text display="inline" fw="700">
                            "{value}"
                        </Text>
                    )}
                </Container>
                {user ? (
                    <Button
                        size="sm"
                        onClick={() => {
                            navigate(getPath(Paths.addCourse));
                        }}
                    >
                        Add Course Proposal
                    </Button>
                ) : (
                    <Button
                        data-testid="sign-in-to-add-course-proposal"
                        onClick={() => {
                            navigate(getPath(Paths.signIn));
                        }}
                        size="sm"
                    >
                        Sign In to Add Course Proposal
                    </Button>
                )}
            </Flex>
        </Combobox.Empty>
    );
};
