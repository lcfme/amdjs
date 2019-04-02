/**
 * EventEmitter
 */
interface Listener {
    fn: Function;
    context: Object;
}
export declare class EventEmitter {
    listeners: {
        [k: string]: Array<Listener>;
    };
    on(name: string, listener: Function, context?: Object): this;
    emit(name: string, ...args: Array<any>): boolean;
    off(name: string, listener: Function): this;
    removeAllListeners(): void;
    once(name: string, listener: Function, context?: Object): this;
}
export declare class UrlHelper {
    static splitter: RegExp;
    static relativeUrl: string;
    static hostUrl: string;
    static dirname(): string;
    static hostname(): string;
    static split(input?: string): string[];
    static setHostUrl(input?: string): void;
    static setRelativeUrl(input?: string): void;
    static toUrl(input?: string): string;
    static toJS(input?: string): string;
}
export {};
