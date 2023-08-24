import {FC, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setMap] = useState<MapApi | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!
      });

      setMap(map);

      // here you add map.thing()
    };

    initMap();
  }, []);

  return <div id="map-container" ref={containerRef}></div>;
};
