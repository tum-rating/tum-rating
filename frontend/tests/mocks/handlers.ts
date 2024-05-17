import { http, HttpResponse } from 'msw';

import {user} from "./dataGenerators.ts";

import {endpoints} from "@/api";

export const handlers = [
    http.get(endpoints.user, async () => {
        return HttpResponse.json(user);
    }),
];
