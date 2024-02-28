import {Button, CSSVariablesResolver, MantineProvider} from '@mantine/core';
import {RoutesApp} from './routes';
import {Notifications} from '@mantine/notifications';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './react-query/client.ts';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {TableScrollProvider} from '@/context';
import buttonClasses from './customStyles/Buttons.module.css'

const resolver: CSSVariablesResolver = () => ({
    variables: {
        "--primary-gradient": `linear-gradient(90deg, var(--mantine-color-indigo-filled) 0%, var(--mantine-color-blue-filled) 100%);`,
        "--green-gradient": `linear-gradient(170deg, var(--mantine-color-teal-filled) 0%, var(--mantine-color-lime-filled) 100%);`
    },
    light: {
        '--primary-layout-gradient': 'linear-gradient(90deg, var(--mantine-color-indigo-filled) 0%, var(--mantine-color-blue-filled) 100%)',
        '--primary-light-gradient': 'linear-gradient(90deg, rgba(145, 167, 255, 0.1) 0%, rgba(77, 171, 247, 0.1) 100%)',
        '--green-light-gradient': 'linear-gradient(170deg, rgb(18 184 134 / 13%) 0%, rgb(130 201 30 / 13%) 100%)'
    },
    dark: {
        '--primary-layout-gradient': 'linear-gradient(90deg, var(--mantine-color-indigo-9) 0%, var(--mantine-color-blue-9) 100%)',
        '--primary-light-gradient': 'linear-gradient(90deg, rgba(145, 167, 255, 0.2) 0%, rgba(77, 171, 247, 0.2) 100%)',
        '--green-light-gradient': 'linear-gradient(170deg, rgb(18 184 134 / 13%) 0%, rgb(130 201 30 / 13%) 100%)'
    },
});

export default function App() {
    return (
        <MantineProvider
            defaultColorScheme="light"
            cssVariablesResolver={resolver}
            theme={{
                fontFamily: 'Inter, sans-serif',
                components: {
                    Button: Button.extend({
                        classNames: buttonClasses,
                    }),
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false}/>
                <Notifications/>
                <TableScrollProvider>
                    <RoutesApp/>
                </TableScrollProvider>
            </QueryClientProvider>
        </MantineProvider>
    );
}
