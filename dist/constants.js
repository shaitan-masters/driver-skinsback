"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GAME = exports.WS_ENDPOINT = exports.ENDPOINT = exports.OFFER_STATUSES = void 0;
exports.OFFER_STATUSES = {
    CREATING_TRADE: 'creating_trade',
    WAITING_ACCEPT: 'waiting_accept',
    ACCEPTED: 'accepted',
    CANCELED: 'canceled',
    TIMEOUT: 'timeout',
    INVALID_TRADE_TOKEN: 'invalid_trade_token',
    USER_NOT_TRADABLE: 'user_not_tradable',
    TRADE_CREATE_ERROR: 'trade_create_error'
};
exports.ENDPOINT = 'https://skinsback.com/api.php';
exports.WS_ENDPOINT = 'ws://185.71.65.202:7777';
exports.DEFAULT_GAME = { game: 'csgo' };
//# sourceMappingURL=constants.js.map