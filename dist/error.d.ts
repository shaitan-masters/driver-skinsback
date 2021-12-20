export declare class SBApiError extends Error {
    readonly message: string;
    constructor(message: string);
    get data(): any;
}
