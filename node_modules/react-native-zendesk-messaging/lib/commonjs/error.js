"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZendeskMessagingError = void 0;
class ZendeskMessagingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ZendeskMessagingError';
  }
}
exports.ZendeskMessagingError = ZendeskMessagingError;
//# sourceMappingURL=error.js.map