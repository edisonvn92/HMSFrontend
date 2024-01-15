declare global {
  namespace appChannel {
    function postMessage(s: string): void;
  }
  interface Window {
    receiveMessage: any;
    setToken: any;
  }
}

export {};
