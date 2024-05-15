import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll } from "vitest";

import '@testing-library/jest-dom/vitest'
import {server} from "./tests/mocks/server";

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: any) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }),
});


beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    cleanup();
});
afterAll(() => server.close());