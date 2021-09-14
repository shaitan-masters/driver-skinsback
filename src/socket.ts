import WS from 'ws';
import { Events } from '@osmium/events';
import { stringify } from 'querystring';
import crypto from 'crypto';
import {
    SBApiConfig,
    SBSocketData,
    SocketState,
    SBSocketEventName
} from './types';


export class SBSocket extends Events {

    protected readonly config: SBApiConfig;
    protected socket: WS;
    protected state: SocketState = { connected: false, authed: false };
    protected timers: { timeouts: NodeJS.Timeout[] } = { timeouts: [] };

    public EVENTS: { [event in 'AUTH_SUCCESS'
        | 'AUTH_FAILED'
        | 'BALANCE_CHANGE'
        | 'BUY_ITEM'
        | 'STATUS_CHANGE']: SBSocketEventName; } = {
            AUTH_SUCCESS: 'auth_success',
            AUTH_FAILED: 'auth_failed',
            BALANCE_CHANGE: 'balance_change',
            BUY_ITEM: 'buy_item',
            STATUS_CHANGE: 'status_change'
        };

    constructor(config: SBApiConfig) {
        super();
        this.config = config;

        this.connect();
    }

    protected purgeTimers(): void {
        this.timers.timeouts.forEach(clearTimeout);
        this.timers = { timeouts: [] };
    }

    protected connect(): void {
        this.purgeTimers();
        this.state = { connected: false, authed: false };

        this.socket = new WS(`${this.config.socket?.endpoint}?${stringify({
            shopid: this.config.botId,
            signature: crypto.createHash('md5')
                .update(`${this.config.botId}${this.config.token}`)
                .digest('hex')
        })}`);

        this.socket.on('open', (): void => {
            this.state.connected = true;
            this.emit('connected');
        });

        this.socket.on('message', (msg: WS.Data): void => {
            const parsed = this.parse(msg);

            if (parsed.event === this.EVENTS.AUTH_SUCCESS || parsed.event === this.EVENTS.AUTH_FAILED) {
                this.emit(parsed.event);
                switch (parsed.event) {
                    case this.EVENTS.AUTH_SUCCESS:
                        this.state.authed = true;
                        return;
                    case this.EVENTS.AUTH_FAILED:
                        this.state.authed = false;
                        this.timers.timeouts.push(setTimeout((): void => {
                            this.emit('reconnecting');
                            this.connect();
                        }, this.config.socket?.options?.reconnectionTimeout || 5000));
                        return;
                    default:
                        return;
                }
            }

            parsed.data && this.emit(parsed.event, parsed.data);
        });

        this.socket.on('close', (): void => {
            this.emit('disconnected');
            this.connect();
        });

        this.timers.timeouts.push(setTimeout((): void => {
            this.connect();
        }, this.config.socket?.options?.reconnectionTimeout || 1000 * 60 * 15));
    }

    protected parse(data: WS.Data): SBSocketData {
        return JSON.parse(data.toString());
    }
}
