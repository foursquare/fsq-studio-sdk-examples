import {FC, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!
      });
      setMap(map);
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.addEffect({
      type: 'light-and-shadow',
      parameters: {
        shadowIntensity: 0.5,
        shadowColor: [0, 0, 0],
        sunLightColor: [255, 255, 255],
        sunLightIntensity: 1,
        ambientLightColor: [255, 255, 255],
        ambientLightIntensity: 1,
        timeMode: 'current'
      }
    });

    map.addEffect({
      type: 'vignette',
      parameters: {
        radius: 0.5,
        amount: 0.5
      }
    });
  }, [map]);

  return <div id="map-container" ref={containerRef}></div>;
};
