export interface SBApiConfig {
    readonly endpoint: string;
    readonly token: string;
    readonly botId: number;
    readonly socket?: SBSocketConfig;
}
export interface SBSocketConfig {
    readonly endpoint: string;
    readonly options?: {
        readonly reconnectionTimeout: number;
    };
}
export interface BaseResponse {
    readonly status: ResponseStatus;
}
export declare type ResponseStatus = 'success' | 'error';
export interface BalanceResponse {
    readonly balance: string;
    readonly balance_in_currencies: Currencies;
    readonly deals_sum: string;
    readonly deals_sum_in_currencies: Currencies;
    readonly withdraw_sum: string;
    readonly withdraw_sum_in_currencies: string;
}
export interface Currencies {
    readonly usd: string;
    readonly rub: string;
    readonly uah: string;
    readonly eur: string;
    readonly cny: string;
    readonly [key: string]: string;
}
export interface DatePayload {
    readonly starting: number;
    readonly ending: number;
}
export interface GamePayload {
    readonly game: 'dota2' | 'csgo';
}
export interface SearchResponse extends BaseResponse {
    readonly items: Item[];
}
export interface Item {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly classid: string;
    readonly instanceid: string;
}
export interface PriceResponse<T> extends BaseResponse {
    readonly last_update: string;
    readonly items: T[];
}
export interface PriceItem {
    readonly name: string;
    readonly price: number;
    readonly classid: string;
    readonly count: number;
}
export declare type OfferStatus = 'creating_trade' | 'waiting_accept' | 'accepted' | 'canceled' | 'timeout' | 'invalid_trade_token' | 'user_not_tradable' | 'trade_create_error';
export interface BuyResponse extends BaseResponse {
    readonly item: Item;
    readonly buy_id: number;
    readonly offer_status: Extract<OfferStatus, 'creating_trade'>;
    readonly balance_debited_sum: number;
}
interface BaseBuyPayload {
    readonly partner: string;
    readonly token: string;
    readonly max_price?: number;
    readonly custom_id?: number;
}
export declare type BuyPayload = {
    readonly id: string;
} & BaseBuyPayload | {
    readonly name: string;
} & GamePayload & BaseBuyPayload;
export interface BuyInfoResponse extends BaseResponse {
    readonly item: {
        readonly id: string;
        readonly name: string;
        readonly price: string;
        readonly classid: string;
        readonly instanceid: string;
    };
    readonly buy_id: string;
    readonly offer_status: OfferStatus;
    readonly steamid: string;
    readonly date: string;
    readonly balance_debited_sum: string;
    readonly tradeofferid: string;
}
export interface HistoryResponse extends BaseResponse {
    readonly items: Omit<BuyInfoResponse, 'status'>[];
    readonly total_count: string;
    readonly has_more: boolean;
}
export interface StatusResponse extends BaseResponse {
    readonly available: boolean;
}
export interface SocketState {
    connected: boolean;
    authed: boolean;
}
export declare type SBSocketEventName = 'auth_success' | 'auth_failed' | 'buy_item' | 'status_change' | 'balance_change';
export interface SBEvent {
    readonly event: SBSocketEventName;
}
export interface AuthSuccess extends SBEvent {
    readonly event: 'auth_success';
    readonly data?: undefined;
}
export interface AuthFailed extends SBEvent {
    readonly event: 'auth_failed';
    readonly data?: undefined;
}
export interface BalanceChange extends SBEvent {
    readonly event: 'balance_change';
    readonly data: {
        readonly balance_value: string;
    };
}
export interface StatusChange extends SBEvent {
    readonly event: 'status_change';
    readonly data: {
        readonly item: {
            readonly id: string;
        };
        readonly buy_id: string;
        readonly offer_status: OfferStatus;
        readonly tradeofferid: string;
    };
}
export declare type SBSocketData = AuthSuccess | AuthFailed | BuyItem | StatusChange | BalanceChange;
export interface BuyItem extends SBEvent {
    readonly event: 'buy_item';
    readonly data: {
        readonly item: {
            readonly id: string;
            readonly name: string;
            readonly price: string;
            readonly classid: string;
            readonly instanceid: string;
        };
        readonly buy_id: string;
        readonly offer_status: Exclude<OfferStatus, 'creating_trade'>;
        readonly balance_debited_sum: string;
    };
}
export {};
