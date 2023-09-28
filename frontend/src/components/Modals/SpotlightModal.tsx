import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextModalProps, modals } from '@mantine/modals';
import { useDebouncedState } from '@mantine/hooks';

import { Button, createStyles, Group, LoadingOverlay, Modal, rem, ScrollArea, ScrollAreaAutosizeProps, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { ActionsList } from '../Spotlight/SpotlightActionList';
import { useSearchReviews } from '@/reviews/useSearchReviews';
import { isMobile } from 'react-device-detect';

const useStyles = createStyles((theme) => ({
    content: {
        position: 'relative',
        overflow: 'hidden',
    },
    searchInput: {
        border: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,

        '&, &:focus-within': {
            borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        },
    },
}));

function SpotlightScrollArea(props: ScrollAreaAutosizeProps) {
    return <ScrollArea.Autosize mah="calc(100vh - 18rem)" {...props} />;
}

const openSpotlight = () => {
    modals.openContextModal({
        modal: 'spotlight',
        overlayProps: {
            opacity: 0.55,
            blur: 3,
        },
        p: 0,
        m: 0,
        withCloseButton: false,
        fullScreen: window.innerWidth <= 900,
        radius: '4px',
        styles: {
            root: {
                '& .mantine-Paper-root': {
                    minWidth: '800px',
                },
                '@media (max-width: 900px)': {
                    '& .mantine-Paper-root': {
                        minWidth: '100%',
                    },
                },
            },
            content: {
                position: 'relative',
                overflow: 'hidden',
            },
        },
        scrollAreaComponent: Modal.NativeScrollArea,
        innerProps: {
            size: 800,
        },
    });
};

const SpotlightModal = ({ context, id }: ContextModalProps) => {
    const [query, setQuery] = useState('');
    const [internalLoading, setInternalLoading] = useState(false);
    const navigate = useNavigate();
    const { classes } = useStyles();
    const [hovered, setHovered] = useState(-1);
    const [IMEOpen, setIMEOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useDebouncedState('', 450);
    useEffect(() => {
        setDebouncedQuery(query);
    }, [query]);
    const { isFetching, data } = useSearchReviews(debouncedQuery);

    useEffect(() => {
        if (!isFetching) {
            setInternalLoading(false);
        }
    }, [isFetching]);

    const resetHovered = () => setHovered(-1);
    const handleClose = () => {
        resetHovered();
        context.closeModal(id);
    };

    const groupedActions = data ? (debouncedQuery.length > 0 ? data.reviews : []) : [];

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (IMEOpen) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                setHovered((current) => (current < groupedActions.length - 1 ? current + 1 : 0));
                break;
            }

            case 'ArrowUp': {
                event.preventDefault();
                setHovered((current) => (current > 0 ? current - 1 : groupedActions.length - 1));
                break;
            }

            case 'Enter': {
                event.preventDefault();
                const action = groupedActions[hovered];
                navigate(`courses/${action._id}`);
                handleClose();
                break;
            }

            case 'Escape': {
                event.preventDefault();
                handleClose();
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!internalLoading) {
            setInternalLoading(true);
        }
        if (hovered === -1) {
            setHovered(0);
        }
        setQuery(event.currentTarget.value);
    };

    const rightInputSection = isMobile ? (
        <Button size="xs" h={20} w={40} p={0} m={0} variant="outline" onClick={() => context.closeModal(id)}>
            close
        </Button>
    ) : (
        <Button size="xs" h={20} w={30} p={0} m={0} variant="outline" onClick={() => context.closeModal(id)}>
            esc
        </Button>
    );
    return (
        <>
            <TextInput data-testid="cypress-global-search-input" size="lg" value={query} onChange={handleInputChange} classNames={{ input: classes.searchInput }} onKeyDown={handleInputKeyDown} onCompositionStart={() => setIMEOpen(true)} onCompositionEnd={() => setIMEOpen(false)} placeholder={'Search'} rightSection={rightInputSection} icon={<IconSearch />} />
            <Group
                data-testid="cypress-global-search-footer"
                position="apart"
                px={15}
                py="xs"
                sx={(theme) => ({
                    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                })}
            >
                <Text size="xs" color="dimmed">
                    TUM-RATING © 2023
                </Text>
            </Group>
            <SpotlightScrollArea>
                <LoadingOverlay visible={internalLoading} overlayOpacity={1} />
                <ActionsList
                    nothingFoundMessage={'Nothing found'}
                    hovered={hovered}
                    query={query}
                    actions={groupedActions}
                    onActionTrigger={(action) => {
                        navigate(`courses/${action._id}`);
                        context.closeModal(id);
                    }}
                    close={() => context.closeModal(id)}
                />
            </SpotlightScrollArea>
        </>
    );
};

export { SpotlightModal, openSpotlight };
