import { GamePayload, OfferStatus } from './types';
export declare const OFFER_STATUSES: {
    readonly [key in Uppercase<OfferStatus>]: OfferStatus;
};
export declare const ENDPOINT: string;
export declare const WS_ENDPOINT: string;
export declare const DEFAULT_GAME: GamePayload;
