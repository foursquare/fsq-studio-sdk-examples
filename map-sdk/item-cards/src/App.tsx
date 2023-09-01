import {FC, useCallback, useEffect, useRef, useState} from 'react';
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

      // here you add map.thing()
    };

    initMap();
  }, []);

  return <div id="map-container" ref={containerRef}></div>;
};

export const AppWithCustomUI: FC = () => {
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

  const logLayers = useCallback(() => {
    if (!map) {
      return;
    }

    const layers = map.getLayers();
    console.log(layers);
  }, [map]);

  const addSampleLayer = useCallback(() => {
    if (!map) {
      return;
    }

    const sampleDataset = {
      id: 'my-sample-dataset',
      label: 'Sample Dataset',
      data: [
        {latitude: 44.8125, longitude: 20.4612}, // Belgrade
        {latitude: 37.7749, longitude: -122.4194}, // San Francisco
        {latitude: 40.7128, longitude: -74.006} // New York
      ]
    };

    map.addDataset(sampleDataset, {
      autoCreateLayers: true,
      centerMap: true
    });
  }, [map]);

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      <div className="controls">
        <button
          onClick={() => {
            logLayers();
          }}
        >
          log layers
        </button>

        <button
          onClick={() => {
            addSampleLayer();
          }}
        >
          add sample layer
        </button>
      </div>
    </>
  );
};
