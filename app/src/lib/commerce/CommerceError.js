export default class CommerceError extends Error {
    constructor(messages = [], ...params) {
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CommerceError);
        }
  
        this.name = 'CommerceError';
        this.messages = messages.map(val => val.Text);
    }
}
