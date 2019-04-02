import mkErr = require("./error");
import util = require("./util");
import Mod = require("./mod");

function config(opts: any) {
  if (!opts) {
    return;
  }
  if (opts.hostUrl && typeof opts.hostUrl === "string") {
    util.UrlHelper.setHostUrl(opts.hostUrl);
  }
  if (opts.relativeUrl && typeof opts.relativeUrl === "string") {
    util.UrlHelper.setRelativeUrl(opts.relativeUrl);
  }
}

function amd(deps: any, cb?: any, name?: string) {
  if (typeof deps === "function" && cb === undefined) {
    cb = deps;
    deps = [];
  }
  if (!Array.isArray(deps)) {
    mkErr();
  }
  // If you wannt concat many js files to one file,
  // It is nessery to have the ability to set custom name for Mod.
  // But It hasn't been implemented.
  const url = document.currentScript
    ? (document.currentScript as HTMLScriptElement).src
    : Math.random()
        .toString(32)
        .substr(2);
  const mod = Mod.getMod(url, undefined, name);
  mod.onAmd(deps, cb);
}

amd.config = config;
amd.util = util;
amd.Mods = Mod.Mods;
export = amd;
