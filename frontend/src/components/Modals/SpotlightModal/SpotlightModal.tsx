import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextModalProps, modals } from '@mantine/modals';
import { useDebouncedState } from '@mantine/hooks';

import { Button, Group, LoadingOverlay, ScrollArea, ScrollAreaAutosizeProps, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { ActionsList } from '@/components/Spotlight/SpotlightActionList';
import { useSearchReviews } from '@/reviews/useSearchReviews.tsx';
import { isMobile } from 'react-device-detect';
import classes from './SpotlightModal.module.css';

function SpotlightScrollArea(props: ScrollAreaAutosizeProps) {
    return <ScrollArea.Autosize mah="calc(100vh - 18rem)" {...props} />;
}

interface SpotlightModalProps extends ContextModalProps {
    isMobile?: boolean;
}

const openSpotlight = ({isMobile,...props}:SpotlightModalProps) => {
    modals.openContextModal({
        modal: 'spotlight',
        withCloseButton: false,
        innerProps: {},
        size: 'lg',
        m: 0,
        p: 0,
        radius: isMobile ? 0 : 4,
        fullScreen: isMobile,
        overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
        },
        ...props
    });
};

const SpotlightModal = ({ context, id }: ContextModalProps) => {
    const [query, setQuery] = useState('');
    const [internalLoading, setInternalLoading] = useState(false);
    const navigate = useNavigate();
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

    const resetHovered = () => setHovered(isMobile ? -3 : -1);
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
            <TextInput data-testid="cypress-global-search-input" size="lg" value={query} onChange={handleInputChange} classNames={{ input: classes.searchInput }} onKeyDown={handleInputKeyDown} onCompositionStart={() => setIMEOpen(true)} onCompositionEnd={() => setIMEOpen(false)} placeholder={'Search'} rightSection={rightInputSection} leftSection={<IconSearch />} />
            <Group data-testid="cypress-global-search-footer" px={15} py="xs">
                <Text size="xs" c="dimmed">
                    TUM-RATING © 2023
                </Text>
            </Group>
            <SpotlightScrollArea>
                <LoadingOverlay visible={internalLoading} />
                <ActionsList
                    nothingFoundMessage={'Nothing found'}
                    hovered={isMobile ? null : hovered}
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
