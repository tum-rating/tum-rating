const isTestEnv = process.env.NODE_ENV === 'test';

export const PAGE_SIZE = 100;
export let SEARCH_PAGE_SIZE = isTestEnv ? 35 : 500;
export const TRENDING_PAGE_SIZE = 100;
