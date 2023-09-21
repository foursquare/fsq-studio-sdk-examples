import {FC, useEffect, useMemo, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';
import {SampleDataItem, fetchSampleData} from './sample-data';

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);
  const [sampleData, setSampleData] = useState<[SampleDataItem] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setSampleData(await fetchSampleData());
    };

    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!
      });
      setMap(map);
    };

    initMap();
    loadData();
  }, []);

  useEffect(() => {
    if (map && sampleData && sampleData.length > 0) {
      map.addDataset(sampleData[0], {autoCreateLayers: false});
      map.addLayer({
        type: 'grid',
        dataId: 'earthquakes',
        fields: {
          lat: 'Latitude',
          lng: 'Longitude'
        },
        config: {
          visConfig: {
            worldUnitSize: 26,
            elevationScale: 90,
            enable3d: true
          }
        }
      });
      map.setMapConfig({
        version: 'v1',
        config: {
          mapState: {
            pitch: 50,
            bearing: 24,
            mapViewMode: 'MODE_3D'
          }
        }
      });
      map.setView({
        latitude: 36.7045671093519,
        longitude: -122.47582941779496,
        zoom: 5.920306814575524
      });
    }
  }, [map, sampleData]);

  const handlers = useMemo(() => {
    if (!sampleData) {
      console.log('Data not yet loaded.');
      return null;
    }

    if (!map) {
      console.log('Map not yet initialized.');
      return null;
    }

    return {
      addEffectLightShadow: () => {
        map.addEffect({
          type: 'light-and-shadow',
          parameters: {
            timeMode: 'pick',
            timestamp: 1695250260000
          }
        });
      },
      addEffectHexagonalPixelate: () => {
        map.addEffect({
          type: 'hexagonal-pixelate',
          parameters: {
            scale: 8.5
          }
        });
      },
      addEffectHueSaturation: () => {
        map.addEffect({
          type: 'hue-saturation',
          parameters: {
            hue: 0.6,
            saturation: 0.4
          }
        });
      }
    };
  }, [map, sampleData]);

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      {!!handlers && (
        <div className="controls">
          {/* Buttons for various effect operations */}
          <button onClick={handlers.addEffectLightShadow}>Light and Shadow</button>
          <button onClick={handlers.addEffectHexagonalPixelate}>Hexagonal Pixelate</button>
          <button onClick={handlers.addEffectHueSaturation}>Hue and Saturation</button>
        </div>
      )}
    </>
  );
};
