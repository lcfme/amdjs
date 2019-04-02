import { EventEmitter } from "./util";
declare enum ModStatus {
    unload = 0,
    loading = 1,
    loaded = 2,
    success = 3,
    fail = 4
}
declare class Mod extends EventEmitter {
    static Mods: {
        [k: string]: Mod;
    };
    static getMod(url: string, parent?: Mod, name?: string): Mod;
    url: string;
    name: string;
    parent?: Mod;
    deps: Array<string>;
    depsMod: Array<Mod>;
    exports: any;
    cb: Function | void;
    status: ModStatus;
    constructor(url: string, parent?: Mod, name?: string);
    onAmd(deps: Array<string>, cb?: Function): void;
    onLoaded(): void;
    verifyDepsLoaded(): boolean;
    createScriptTag(): void;
}
export = Mod;
