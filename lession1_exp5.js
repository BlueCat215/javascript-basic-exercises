const obj = {
  value: 42,
  normalFn: function () {
    return this.value;
  },
  arrowFn: () => {
    return this.value;
  },
};
console.log(`gia tri trong nomalfuction: ${obj.normalFn()}`);
console.log(`gia tri trong arrowfuction: ${obj.arrowFn()}`);