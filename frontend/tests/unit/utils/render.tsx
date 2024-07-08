import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import {FeedbackCTAProvider, SearchProvider} from '@/context';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
        <BrowserRouter>
            <MantineProvider>
                <SearchProvider>
                    <FeedbackCTAProvider>
                        {children}
                    </FeedbackCTAProvider>
                </SearchProvider>
            </MantineProvider>
        </BrowserRouter>
    );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
