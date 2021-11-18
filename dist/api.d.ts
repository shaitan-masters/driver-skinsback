import { AxiosInstance } from 'axios';
import { SBSocket } from './socket';
import { BalanceResponse, BuyInfoResponse, BuyPayload, BuyResponse, DatePayload, GamePayload, HistoryResponse, Item, MultiBuyInfoResponse, PriceItem, PriceResponse, SBApiConfig, SearchResponse, StatusResponse } from './types';
export declare class SBApi {
    protected readonly config: SBApiConfig;
    protected readonly http: AxiosInstance;
    readonly socket: SBSocket;
    constructor(config: SBApiConfig);
    protected configureAxios(axios: AxiosInstance): AxiosInstance;
    protected sign(params: object): string;
    protected buildParams<T extends object>(params: T): T & {
        sign: string;
    };
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=status
     * @returns {Promise<StatusResponse>}
     */
    status(): Promise<StatusResponse>;
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=balance
     * @returns {Promise<BalanceResponse>}
     */
    balance(): Promise<BalanceResponse>;
    prices(payload: GamePayload): Promise<PriceResponse<PriceItem>>;
    prices(payload: GamePayload & {
        full: 1;
    }): Promise<PriceResponse<Item>>;
    search(payload: GamePayload & {
        name: string;
    }): Promise<SearchResponse>;
    search(payload: GamePayload & {
        names: string[];
    }): Promise<SearchResponse>;
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_buy
     * @param {BuyPayload} payload
     * @returns {Promise<BuyResponse>}
     */
    buy(payload: BuyPayload): Promise<BuyResponse>;
    buyInfo(payload: {
        buy_id: number;
    }): Promise<BuyInfoResponse>;
    buyInfo(payload: {
        buy_ids: number[];
    }): Promise<MultiBuyInfoResponse>;
    buyInfo(payload: {
        custom_ids: number[];
    }): Promise<MultiBuyInfoResponse>;
    /**
     *
     * @see https://skinsback.com/profile.php?act=api&item=market_history
     * @param {payload: DatePayload & { start_from?: number; }} payload
     * @returns {Promise<HistoryResponse>}
     */
    history(payload: DatePayload & {
        start_from?: number;
    }): Promise<HistoryResponse>;
}
