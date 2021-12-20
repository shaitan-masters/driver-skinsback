"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SBApiError = void 0;
class SBApiError extends Error {
    message;
    constructor(message) {
        super(message);
    }
    get data() {
        const { error } = JSON.parse(this.message);
        return error;
    }
}
exports.SBApiError = SBApiError;
//# sourceMappingURL=error.js.map