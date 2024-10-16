import {Toggle} from "@/admin/types.ts";
import {endpoints, useMutationWithAuth} from "@/api";

import * as userLocalStorage from '@/auth/user.localstore.ts';

async function addToggle(token: string, toggle: Toggle) {
    const endpoint = endpoints.toggles
    if (!toggle) return;
    console.log(token)
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(toggle)
    })

    const data = await response.json();
    console.log(data)
    if (!response.ok) {
        throw new Error(data.message)
    }

    return data
}


interface AddToggleInput extends Toggle {
}

export function useAddToggle() {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (toggle: AddToggleInput) => addToggle(token, toggle),
        onMutate: (toggle) => {
            console.log('onMutate', toggle)
        },
        onSuccess: (data, toggle) => {
            console.log('onSuccess', data, toggle)
        },
        onError: (error, toggle) => {
            console.log('onError', error, toggle)
        },
    })
}