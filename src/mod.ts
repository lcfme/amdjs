import { EventEmitter, UrlHelper } from "./util";
import mkErr = require("./error");

enum ModStatus {
  unload,
  loading,
  loaded,
  success,
  fail
}

const ModEvent = {
  loading: "loading",
  loaded: "loaded",
  success: "success",
  fail: "fail"
};

class Mod extends EventEmitter {
  static Mods: { [k: string]: Mod } = {};
  static getMod(url: string, parent?: Mod, name?: string) {
    name = name || url;
    if (!name || typeof name !== "string") {
      mkErr();
    }
    if (this.Mods[name]) {
      return this.Mods[name];
    } else {
      return new Mod(url, parent, name);
    }
  }
  url: string;
  name: string;
  parent?: Mod;
  deps: Array<string>;
  depsMod: Array<Mod>;
  exports: any;
  cb: Function | void;
  status: ModStatus = ModStatus.unload;
  constructor(url: string, parent?: Mod, name?: string) {
    super();
    name = name || url;
    if (Mod.Mods[name]) {
      return this;
    }
    Mod.Mods[name] = this;
    this.name = name;
    this.url = url;
    this.parent = parent;
  }
  onAmd(deps: Array<string>, cb?: Function) {
    this.status = ModStatus.loaded;
    this.cb = cb;
    this.deps = deps.map(input => {
      return UrlHelper.toJS(input);
    });
    this.depsMod = this.deps.map(dep => {
      const mod = Mod.getMod(dep, this);
      if (mod.status === ModStatus.unload) {
        mod.createScriptTag();
      }
      mod.once(ModEvent.success, this.verifyDepsLoaded, this);
      return mod;
    });
    this.verifyDepsLoaded();
  }
  onLoaded() {
    if (this.status === ModStatus.success) {
      return;
    }
    this.status = ModStatus.success;
    try {
      if (!this.cb) {
        this.exports = undefined;
      } else {
        this.exports = this.cb.call(
          this,
          ...this.depsMod.map(dep => dep.exports)
        );
        this.emit(ModEvent.success, this);
      }
    } catch (err) {
      this.emit(ModEvent.fail, this);
      throw err;
    } finally {
      this.removeAllListeners();
    }
  }
  verifyDepsLoaded() {
    for (let i = this.depsMod.length; i--; ) {
      if (this.depsMod[i].status !== ModStatus.success) {
        return false;
      }
    }
    this.onLoaded();
  }
  createScriptTag() {
    this.status = ModStatus.loading;
    this.emit(ModEvent.loading, this);
    const script = document.createElement("script");
    script.src = this.url;
    (document.body || document.documentElement).appendChild(script);
  }
}

export = Mod;
