export = function makeError(msg?: string) {
  throw new Error(msg || "Oops. Please help me debug ^_^");
};
