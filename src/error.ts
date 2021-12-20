
export class SBApiError extends Error {

	readonly message: string;

	constructor(message: string) {
		super(message);
	}

	public get data() {
		const {error} = JSON.parse(this.message);
		return error;
	}
}
