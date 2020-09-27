const timeoutPromise = (callback: Function, interval: number) => () =>
  new Promise(resolve => setTimeout(() => callback(resolve), interval));

export default timeoutPromise;
