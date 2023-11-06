import { MantineProvider } from '@mantine/core';
import { RoutesApp } from './routes';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query/client.ts';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TableScrollProvider } from '@/context';

export default function App() {
    // const colorSchemeManager = localStorageColorSchemeManager({ key: 'tum-rating-color-scheme' });
    return (
        <MantineProvider
            // colorSchemeManager={colorSchemeManager}
            defaultColorScheme="light"
            theme={{
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <Notifications />
                <TableScrollProvider>
                    <RoutesApp />
                </TableScrollProvider>
            </QueryClientProvider>
        </MantineProvider>
    );
}
