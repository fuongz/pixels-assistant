import { useEffect, useState } from 'react';

const fetcher = (url: string, body = null, method = 'POST') => {
  return fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'sec-ch-ua': '"Not(A:Brand";v="24", "Chromium";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    referrer: 'https://play.pixels.xyz/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: body ? JSON.stringify(body) : null,
    method,
    mode: 'cors',
    credentials: 'omit',
  }).then(res => res.json());
};

interface Player {
  username: string;
  _id: string;
  trustScore: number;

  lastAuthenticated: string;
  lastSavedAt: number;
  lastShortValidation: number;

  coinInventory: Array<{
    balance: number;
    currencyId: 'cur_pixel' | 'cur_coins' | string;
  }>;

  location: {
    mapId: string;
    x: string;
    y: string;
  };
}

interface PixelsMap {
  id: string;
  name: string;
  ownerAddress: string;
  tenantKey: string;
  type: string;
  labels: Array<string>;
}

export default function App() {
  const [sessionId, setSessionId] = useState<string>();
  const [sessionToken, setSessionToken] = useState<string>();
  const [player, setPlayer] = useState<Player>();
  const [currentMap, setCurrentMap] = useState<PixelsMap>();
  const [worldId, setWorldId] = useState<number>();
  const [apiVersion, setApiVersion] = useState<string>('6.6');

  // WSS
  const [wssRoomInfo, setWssRoomInfo] = useState();

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sessionId) initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (player) initCurrentMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    if (currentMap) findRoom();
  }, [currentMap]);

  async function initData() {
    const pixelsSession = await cookieStore.get('pixels-session');
    if (pixelsSession) setSessionId(pixelsSession.value);
    const apiVer = await fetcher('https://play.pixels.xyz/api/ver');
    if (apiVer) {
      setApiVersion(apiVer.version);
    }
  }

  async function initialize() {
    const userData = await fetcher('https://pixels-server.pixels.xyz/v1/auth/initialize', {
      authToken: sessionId,
      mapId: '',
      tenant: 'pixels',
      walletProvider: 'ronin',
      ver: apiVersion,
    });

    console.log(userData);
    if (userData && userData?.player && userData?.sessionToken) {
      setPlayer(userData?.player);
      setSessionToken(userData?.sessionToken);
    }
  }

  async function initCurrentMap() {
    const mapData = await fetcher(
      `https://pixels-server.pixels.xyz/v1/map/${player.location.mapId}?v=${Date.now()}`,
      null,
      'GET',
    );

    if (mapData) {
      console.log('Map loaded:', mapData);
      setCurrentMap(mapData);
    }
  }

  async function findRoom() {
    setTimeout(async () => {
      const worldId = parseInt(
        [...document.querySelectorAll('div.clickable')]
          .filter(e => e.textContent.includes('World'))
          .map(e => e.textContent)?.[0]
          .replace(/^\D+/g, ''),
      );
      if (worldId) {
        setWorldId(worldId);
        const roomData = await fetcher(
          `https://pixels-server.pixels.xyz/game/findroom/${currentMap.id}/${worldId}?v=${Date.now()}`,
          null,
          'GET',
        );
        if (roomData) {
          console.log('[WSS] Room Loaded:', roomData);
          setWssRoomInfo(roomData);

          const matchMake = await fetcher(
            `https://pixels-server.pixels.xyz/matchmake/joinById/${roomData.roomId}/${roomData.server}`,
            {
              mapId: currentMap.id,
              token: sessionToken,
              isGuest: false,
              cryptoWallet: {},
              username: player.username,
              playerId: player._id,
              world: worldId,
              ver: apiVersion,
              avatar: '',
              lastSavedAt: player.lastSavedAt,
            },
          );

          if (matchMake) {
            console.log('[wss] matchMake:', matchMake);
          }
        }
      }
    }, 2000);
  }

  return (
    <div className="absolute z-100">
      <UserBanner player={player} />
    </div>
  );
}

const UserBanner: React.FC<{ player: Player }> = ({ player }: { player: Player }) => {
  return (
    !!player && (
      <>
        <p></p>
      </>
    )
  );
};
