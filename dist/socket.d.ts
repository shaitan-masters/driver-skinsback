/// <reference types="node" />
import WS from 'ws';
import { Events } from '@osmium/events';
import { SBApiConfig, SBSocketData, SocketState, SBSocketEventName } from './types';
export declare class SBSocket extends Events {
    protected readonly config: SBApiConfig;
    protected socket: WS;
    protected state: SocketState;
    protected timers: {
        timeouts: NodeJS.Timeout[];
    };
    EVENTS: {
        [event in 'AUTH_SUCCESS' | 'AUTH_FAILED' | 'BALANCE_CHANGE' | 'BUY_ITEM' | 'STATUS_CHANGE']: SBSocketEventName;
    };
    constructor(config: SBApiConfig);
    protected purgeTimers(): void;
    protected connect(): void;
    protected parse(data: WS.Data): SBSocketData;
}
