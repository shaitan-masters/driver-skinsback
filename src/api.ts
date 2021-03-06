import crypto from 'crypto';
import axios, {AxiosInstance} from 'axios';
import {SBSocket} from './socket';
import {
	BalanceResponse,
	BuyInfoResponse,
	BuyPayload,
	BuyResponse,
	DatePayload,
	GamePayload,
	HistoryResponse,
	Item,
	MultiBuyInfoResponse,
	PriceItem,
	PriceResponse,
	SBApiConfig,
	SearchResponse,
	StatusResponse
} from './types';
import {SBApiError} from './error';
import { DEFAULT_GAME, ENDPOINT } from './constants';


export class SBApi {

	protected readonly config: SBApiConfig;
	protected readonly http: AxiosInstance;
	public readonly socket: SBSocket;

	constructor(config: SBApiConfig) {
		this.config = config;
		this.http = this.configureAxios(axios.create());

		if (this.config.socket) {
			this.socket = new SBSocket(this.config);
		}
	}

	protected configureAxios(axios: AxiosInstance): AxiosInstance {
		axios.defaults.baseURL = this.config.endpoint || ENDPOINT;
		axios.interceptors.response.use(response => {
			const data = response.data;
			if ('status' in data && data.status === 'error') throw data;
			
			return data;
		}, (err) => {
			throw err?.response?.data ?? err
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

	protected sign(params: object): string {
		let paramsString: string = '';

		Object.keys(params)
		      .sort()
		      .forEach((key: string): void => {
			      if (key === 'sign') return;
			      if (typeof params[key] === 'object') return;

			      paramsString += '' + key + ':' + params[key] + ';';
		      });

		return crypto.createHmac('sha1', this.config.token).update(paramsString).digest('hex');
	}

	protected buildParams<T extends object>(params: T): T & { sign: string } {
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
	public async status(): Promise<StatusResponse> {
		return this.http.post('', {method: 'status'});
	}

	/**
	 *
	 * @see https://skinsback.com/profile.php?act=api&item=balance
	 * @returns {Promise<BalanceResponse>}
	 */
	public async balance(): Promise<BalanceResponse> {
		return this.http.post('', {method: 'balance'});
	}

	public async prices(payload: GamePayload): Promise<PriceResponse<PriceItem>>;
	public async prices(payload: GamePayload & { full: 1; }): Promise<PriceResponse<Item>>;

	/**
	 *
	 * @see https://skinsback.com/profile.php?act=api&item=market_pricelist
	 * @param payload
	 * @returns {Promise<PriceResponse<Item | PriceItem>>}
	 */
	public async prices(payload: GamePayload | GamePayload & { full: 1; } = DEFAULT_GAME): Promise<PriceResponse<Item | PriceItem>> {
		return this.http.post('', {method: 'market_pricelist', ...payload});
	}

	public async search(payload: GamePayload & { name: string; }): Promise<SearchResponse>;
	public async search(payload: GamePayload & { names: string[]; }): Promise<SearchResponse>;

	/**
	 *
	 * @see https://skinsback.com/profile.php?act=api&item=market_search
	 * @param {GamePayload & { name: string; } | GamePayload & { names: string[]; }} payload
	 * @returns {Promise<SearchResponse>}
	 */
	public async search(payload: GamePayload & { name: string; } | GamePayload & { names: string[]; }): Promise<SearchResponse> {
		return this.http.post('', {method: 'market_search', ...payload, ...payload.game && DEFAULT_GAME});
	}

	/**
	 *
	 * @see https://skinsback.com/profile.php?act=api&item=market_buy
	 * @param {BuyPayload} payload
	 * @returns {Promise<BuyResponse>}
	 */
	public async buy(payload: BuyPayload): Promise<BuyResponse> {
		return this.http.post('', {method: 'market_buy', ...payload});
	}

	public async buyInfo(payload: { buy_id: number; }): Promise<BuyInfoResponse>;
	public async buyInfo(payload: { buy_ids: number[]; }): Promise<MultiBuyInfoResponse>;
	public async buyInfo(payload: { custom_ids: number[]; }): Promise<MultiBuyInfoResponse>;

	/**
	 *
	 * @see https://skinsback.com/profile.php?act=api&item=market_getinfo
	 * @param payload
	 * @description ???????????????? ?? ???????????? ??????????????????? - ???????? ?? ???????????????????????????? buy_ids & custom_ids
	 * @returns {Promise<BuyInfoResponse>}
	 */
	public async buyInfo(payload: { buy_id: number } | { buy_ids: number[] } | { custom_ids: number[] }): Promise<BuyInfoResponse | MultiBuyInfoResponse> {
		return this.http.post('', {method: 'market_getinfo', ...payload});
	}

	/**
	 *
	 * @see https://skinsback.com/profile.php?act=api&item=market_history
	 * @param {payload: DatePayload & { start_from?: number; }} payload
	 * @returns {Promise<HistoryResponse>}
	 */
	public async history(payload: DatePayload & { start_from?: number; }): Promise<HistoryResponse> {
		return this.http.post('', {method: 'market_history', ...payload});
	}
}
