import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CoursesTable } from '../CoursesTable';

import { TableScrollProvider } from '@/context';
import { render } from 'tests/unit/utils/render.tsx';

describe('CoursesTable', () => {
    let queryClient: QueryClient;
    beforeEach(() => {
        queryClient = new QueryClient();
    });
    it('should render without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableScrollProvider>
                    <CoursesTable />
                </TableScrollProvider>
            </QueryClientProvider>,
        );
    });
});
