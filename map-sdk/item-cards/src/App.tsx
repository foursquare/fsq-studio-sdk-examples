import {FC, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';

// TODO generic Dataset<T>
const citiesDataset = {
  label: 'Sample Dataset',
  data: [
    {name: 'Beglrade', latitude: 44.8125, longitude: 20.4612},
    {name: 'San Francisco', latitude: 37.7749, longitude: -122.4194},
    {name: 'New York', latitude: 40.7128, longitude: -74.006}
  ]
};

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);
  const [selectionInfo, setSelectionInfo] = useState<null | {
    idx: number;
    latOffset: number;
    lngOffset: number;
  }>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!
      });

      setMap(map);

      map.addDataset(citiesDataset, {
        autoCreateLayers: true,
        centerMap: true
      });

      const cfg = map.getMapConfig();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cfg as any).config.visState.interactionConfig.tooltip.enabled = false;
      map.setMapConfig(cfg);
      console.log(cfg);
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.eventHandlers.onHover = e => {
      if (e.pickInfo && e.pickInfo.rowIndex !== selectionInfo?.idx) {
        setSelectionInfo({
          idx: e.pickInfo.rowIndex,
          latOffset: e.position[0],
          lngOffset: e.position[1]
        });
      } else {
        setSelectionInfo(null);
      }
    };

    map.eventHandlers.onViewUpdate = e => {
      // TODO
    };
  }, [map]);

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      {selectionInfo && (
        <div
          id="item-card"
          style={{
            left: selectionInfo.latOffset,
            top: selectionInfo.lngOffset
          }}
        >
          {citiesDataset.data[selectionInfo.idx].name}
        </div>
      )}
    </>
  );
};
