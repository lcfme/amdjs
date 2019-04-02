import util = require("./util");
import Mod = require("./mod");
declare function config(opts: any): void;
declare function amd(deps: any, cb?: any, name?: string): void;
declare namespace amd {
    var config: typeof config;
    var util: typeof util;
    var Mods: {
        [k: string]: Mod;
    };
}
export = amd;
