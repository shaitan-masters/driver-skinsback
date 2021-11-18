import {GamePayload, OfferStatus} from './types';

export const OFFER_STATUSES: { readonly [key in Uppercase<OfferStatus>]: OfferStatus; } = {
	CREATING_TRADE     : 'creating_trade',
	WAITING_ACCEPT     : 'waiting_accept',
	ACCEPTED           : 'accepted',
	CANCELED           : 'canceled',
	TIMEOUT            : 'timeout',
	INVALID_TRADE_TOKEN: 'invalid_trade_token',
	USER_NOT_TRADABLE  : 'user_not_tradable',
	TRADE_CREATE_ERROR : 'trade_create_error'
};

export const ENDPOINT: string = 'https://skinsback.com/api.php';
export const WS_ENDPOINT: string = 'ws://185.71.65.202:7777';
export const DEFAULT_GAME: GamePayload = {game: 'csgo'};
