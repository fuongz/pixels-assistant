import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

const init = context => {
  try {
    const { url }: { url: string } = context;

    console.log('URL:', url);

    // wss://pixels-server.pixels.xyz/{serverId}/{roomId}?sessionId={sessionId}

    // - ServerId:
    //    + SaunaInterior: https://pixels-server.pixels.xyz/game/findroom/SaunaInterior/{serverIntId}?v={currentTimeStamp}
    // - SessionId:
    //    + https://pixels-server.pixels.xyz/matchmake/joinById/{roomId}/{serverId}

    // const ws = new WebSocket(url);

    // ws.onopen = () => {
    //   console.log('ws opened on browser');
    //   ws.send('hello world');
    // };

    // ws.onmessage = message => {
    //   console.log(`message received`, message.data);
    // };
  } catch (err) {
    console.log(err);
  }
};

chrome.webRequest.onCompleted.addListener(init, { urls: ['<all_urls>'], types: ['websocket', 'xmlhttprequest'] });
