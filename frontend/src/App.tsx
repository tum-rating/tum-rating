import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {RoutesApp} from './routes';
import {useState} from 'react';
import {Notifications} from '@mantine/notifications';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './react-query/client';
import {SpotlightProvider} from "@mantine/spotlight";

function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
                theme={{
                    globalStyles: () => ({
                        body: {
                            height: '100vh',
                            overflow: 'hidden',
                        },
                        "#root": {
                            height: '100%',
                        },
                    }),
                    colorScheme,
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <SpotlightProvider shortcut={['mod + P', 'mod + K', '/']} actions={[]}>
                    <QueryClientProvider client={queryClient}>
                        <Notifications/>
                        <RoutesApp/>
                    </QueryClientProvider>
                </SpotlightProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

export default App;
