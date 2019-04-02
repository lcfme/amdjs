import mkErr = require("./error");

/**
 * EventEmitter
 */

interface Listener {
  fn: Function;
  context: Object;
}

export class EventEmitter {
  listeners: { [k: string]: Array<Listener> } = {};
  on(name: string, listener: Function, context?: Object) {
    if (typeof name !== "string" || typeof listener !== "function") {
      mkErr();
    }
    if (!Array.isArray(this.listeners[name])) {
      this.listeners[name] = [];
    }
    const listeners = this.listeners[name];
    listeners.push({
      fn: listener,
      context: context
    });
    return this;
  }
  emit(name: string, ...args: Array<any>) {
    if (typeof name !== "string") {
      mkErr();
    }
    const listeners = this.listeners[name];
    if (!listeners || !Array.isArray(listeners) || !listeners.length) {
      return false;
    }
    // make a copy of listeners to avoid the listener
    // which will never be called
    // if you call off when a listener is being emitted.
    const emitListeners = listeners.slice();
    for (let i = 0; i < emitListeners.length; i++) {
      try {
        const listener = emitListeners[i];
        listener.fn.call(listener.context, ...args);
      } catch (err) {}
    }
    return true;
  }
  off(name: string, listener: Function) {
    if (typeof name !== "string" || typeof listener !== "function") {
      mkErr();
    }
    const listeners = this.listeners[name];
    if (!listeners || !Array.isArray(listeners) || !listeners.length) {
      return this;
    }
    for (let i = listeners.length; i--; ) {
      if (listeners[i].fn === listener) {
        listeners.splice(i, 1);
      }
    }
    if (!listeners.length) {
      delete this.listeners[name];
    }
    return this;
  }
  removeAllListeners() {
    for (let k in this.listeners) {
      delete this.listeners[k];
    }
  }

  // this method may raise bug when e.once and call e.off. the listener cannot be removed.
  once(name: string, listener: Function, context?: Object) {
    const tempListener = (...args: any) => {
      listener.call(context, ...args);
      this.off(name, tempListener);
    };
    return this.on(name, tempListener);
  }
}

enum UrlType {
  isHost,
  isCompelete,
  isRelative
}

function ensureSlashAtTheEnd(input: string = "") {
  if (input.charAt(input.length - 1) !== "/") {
    input += "/";
  }
  return input;
}

function ensureJsAtTheEnd(input: string = "") {
  if (!/\.js$/.test(input)) {
    input = input + ".js";
  }
  return input;
}

export class UrlHelper {
  static splitter = /(?<!\/)\/(?!\/)/;
  static relativeUrl: string = UrlHelper.dirname();
  static hostUrl: string = UrlHelper.hostname();
  static dirname() {
    const arr = this.split(location.href);
    arr.pop();
    let str = ensureSlashAtTheEnd(arr.join("/"));
    return str;
  }
  static hostname() {
    let str = ensureSlashAtTheEnd(this.split(location.href)[0]);
    return str;
  }
  static split(input: string = "") {
    return input.split(this.splitter);
  }
  static setHostUrl(input: string = "") {
    this.hostUrl = ensureSlashAtTheEnd(this.toUrl(input));
  }
  static setRelativeUrl(input: string = "") {
    this.relativeUrl = ensureSlashAtTheEnd(this.toUrl(input));
  }
  static toUrl(input: string = "") {
    let urlType: UrlType;
    if (input.charAt(0) === "/") {
      urlType = UrlType.isHost;
      input = input.slice(1);
      if (input.charAt(0) === "/") {
        input = input.slice(1);
      }
    } else if (/^\w+:/.test(input)) {
      urlType = UrlType.isCompelete;
    } else {
      urlType = UrlType.isRelative;
    }

    switch (urlType) {
      case UrlType.isHost:
        input = this.hostUrl + input;
        break;
      case UrlType.isRelative:
        input = this.relativeUrl + input;
        break;
      default:
    }

    const arr = this.split(input);
    const r: Array<string> = [];

    for (let i = 0; i < arr.length; i++) {
      switch (arr[i]) {
        case "..":
          if (r.length > 1) {
            r.pop();
          }
          break;
        case ".":
          break;
        default:
          r.push(arr[i]);
      }
    }

    return r.join("/");
  }
  static toJS(input: string = "") {
    return ensureJsAtTheEnd(this.toUrl(input));
  }
}
