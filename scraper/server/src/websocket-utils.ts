// websocket-utils.ts
import WebSocket from 'ws';
import http from 'http';
import Logger from './server-logger';

export const validateConnection = (req: http.IncomingMessage): boolean => {
    //TODO some validation (or do it via firewall)
    return true;
};

export const handleReconnection = (ws: WebSocket, clientId: string) => {
    ws.on('pong', () => {
        Logger.info(`Received pong from ${clientId}`);
    });

    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        } else {
            clearInterval(interval);
        }
    }, 30000);
};

export const handleTimeout = (ws: WebSocket, clientId: string) => {
    const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
            ws.terminate();
            Logger.warn(`Terminated connection due to timeout: ${clientId}`);
        }
    }, 60000);

    ws.on('pong', () => {
        clearTimeout(timeout);
    });
};