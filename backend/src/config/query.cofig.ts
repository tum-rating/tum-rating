import { registerAs } from '@nestjs/config';

export default registerAs('query', () => ({
    maxPageSize:  Number(process.env.QUERY_MAX_PAGE_SIZE)
}));