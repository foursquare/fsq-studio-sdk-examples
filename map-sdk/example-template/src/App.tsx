import React, {FC, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';

export const App: FC = () => {
  const containerRef = useRef(null);
  const [map, setMap] = useState<MapApi | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap();

      map.addToDOM(containerRef.current!);
      setMap(map);

      // here you add map.thing()
    };

    initMap();
  }, []);

  return (
    <div style={{width: '100vw', height: '100vh', overflow: 'hidden'}} ref={containerRef}></div>
  );
};
