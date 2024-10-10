import * as crypto from 'crypto';

import { inMemoryStore } from './store.js';


export const getUsers = (req, res) => {
    const allUsers = inMemoryStore.getAllUsers();
    res.status(200).json(allUsers);
};

export const getUserByEmail = (req, res) => {
    const user = inMemoryStore.getUser(req.params.email);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).end();
    }
};

export const createUser = (req, res) => {
    const email = req.body.email;
    if (!email) {
        res.status(400).json({ error: 'email is required' });
        return;
    }

    if (inMemoryStore.getUser(email)) {
        res.status(409).json({ error: 'user already exists' });
        return;
    }

    const uuid = crypto.randomUUID();

    inMemoryStore.addUser(req.body.email, uuid);
    res.status(201).json({ email: req.body.email, sub: uuid });
};
