"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const events_1 = require("@osmium/events");
const querystring_1 = require("querystring");
const crypto_1 = __importDefault(require("crypto"));
class SBSocket extends events_1.Events {
    config;
    socket;
    state = { connected: false, authed: false };
    timers = { timeouts: [] };
    EVENTS = {
        AUTH_SUCCESS: 'auth_success',
        AUTH_FAILED: 'auth_failed',
        BALANCE_CHANGE: 'balance_change',
        BUY_ITEM: 'buy_item',
        STATUS_CHANGE: 'status_change'
    };
    constructor(config) {
        super();
        this.config = config;
        this.connect();
    }
    purgeTimers() {
        this.timers.timeouts.forEach(clearTimeout);
        this.timers = { timeouts: [] };
    }
    connect() {
        this.purgeTimers();
        this.state = { connected: false, authed: false };
        this.socket = new ws_1.default(`${this.config.socket?.endpoint}?${(0, querystring_1.stringify)({
            shopid: this.config.botId,
            signature: crypto_1.default.createHash('md5')
                .update(`${this.config.botId}${this.config.token}`)
                .digest('hex')
        })}`);
        this.socket.on('open', () => {
            this.state.connected = true;
            this.emit('connected');
        });
        this.socket.on('message', (msg) => {
            const parsed = this.parse(msg);
            if (parsed.event === this.EVENTS.AUTH_SUCCESS || parsed.event === this.EVENTS.AUTH_FAILED) {
                this.emit(parsed.event);
                switch (parsed.event) {
                    case this.EVENTS.AUTH_SUCCESS:
                        this.state.authed = true;
                        return;
                    case this.EVENTS.AUTH_FAILED:
                        this.state.authed = false;
                        this.timers.timeouts.push(setTimeout(() => {
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
        this.socket.on('close', () => {
            this.emit('disconnected');
            this.connect();
        });
        this.timers.timeouts.push(setTimeout(() => {
            this.connect();
        }, this.config.socket?.options?.reconnectionTimeout || 1000 * 60 * 15));
    }
    parse(data) {
        return JSON.parse(data.toString());
    }
}
exports.SBSocket = SBSocket;
//# sourceMappingURL=socket.js.map