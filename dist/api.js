"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBApi = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const socket_1 = require("./socket");
const constants_1 = require("./constants");
class SBApi {
    config;
    http;
    socket;
    constructor(config) {
        this.config = config;
        this.http = this.configureAxios(axios_1.default);
        if (this.config.socket) {
            this.socket = new socket_1.SBSocket(this.config);
        }
    }
    configureAxios(axios) {
        axios.defaults.baseURL = this.config.endpoint || constants_1.ENDPOINT;
        axios.interceptors.response.use(response => {
            const data = response.data;
            if ('status' in data && data.status === 'error')
                throw data;
            return data;
        });
        axios.interceptors.request.use(request => {
            request.data = this.buildParams({
                ...request.data,
                shopid: this.config.shopId
            });
            return request;
        });
        return axios;
    }
    sign(params) {
        let paramsString = '';
        Object.keys(params)
            .sort()
            .forEach((key) => {
            if (key === 'sign')
                return;
            if (typeof params[key] === 'object')
                return;
            paramsString += '' + key + ':' + params[key] + ';';
        });
        return crypto_1.default.createHmac('sha1', this.config.token).update(paramsString).digest('hex');
    }
    buildParams(params) {
        return {
            ...params,
            sign: this.sign(params)
        };
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=status
     * @returns {Promise<StatusResponse>}
     */
    async status() {
        return this.http.post('', { method: 'status' });
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=balance
     * @returns {Promise<BalanceResponse>}
     */
    async balance() {
        return this.http.post('', { method: 'balance' });
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_pricelist
     * @param payload
     * @returns {Promise<PriceResponse<Item | PriceItem>>}
     */
    async prices(payload = constants_1.DEFAULT_GAME) {
        return this.http.post('', { method: 'market_pricelist', ...payload });
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_search
     * @param {GamePayload & { name: string; } | GamePayload & { names: string[]; }} payload
     * @returns {Promise<SearchResponse>}
     */
    async search(payload) {
        return this.http.post('', { method: 'market_search', ...payload, ...payload.game && constants_1.DEFAULT_GAME });
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_buy
     * @param {BuyPayload} payload
     * @returns {Promise<BuyResponse>}
     */
    async buy(payload) {
        return this.http.post('', { method: 'market_buy', ...payload });
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_getinfo
     * @param payload
     * @description Написать в службу поддержки? - дичь с множественными buy_ids & custom_ids
     * @returns {Promise<BuyInfoResponse>}
     */
    async buyInfo(payload) {
        return this.http.post('', { method: 'market_getinfo', ...payload });
    }
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_history
     * @param {payload: DatePayload & { start_from?: number; }} payload
     * @returns {Promise<HistoryResponse>}
     */
    async history(payload) {
        return this.http.post('', { method: 'market_history', ...payload });
    }
}
exports.SBApi = SBApi;
//# sourceMappingURL=api.js.map