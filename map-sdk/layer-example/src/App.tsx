import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';
import earthquakes from './data/earthquakes.json';

export const AppWithCustomUI: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!
      });

      setMap(map);

      map.addDataset(
        {
          label: 'California Earthquakes',
          data: earthquakes
        },
        {
          autoCreateLayers: false,
          centerMap: true
        }
      );
    };

    initMap();
  }, []);

  const handleAddLayer = useCallback(() => {
    if (!map) {
      return;
    }

    map.addLayer({
      type: 'point',
      dataId: map.getDatasets()[0]?.id,
      label: 'Earthquake',
      isVisible: true,
      fields: {
        lat: 'Latitude',
        lng: 'Longitude'
      },
      config: {
        visualChannels: {
          colorField: {
            type: 'real',
            name: 'Magnitude'
          }
        }
      }
    });
  }, [map]);

  const handleUpdateLayer = useCallback(() => {
    if (!map) {
      return;
    }

    // Bug? This changes the layer type to a heatmap, but doesn't seem to correctly configure it.

    map.updateLayer(map.getLayers()[0]?.id, {
      type: 'heatmap'
    });
  }, [map]);

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      <div className="controls">
        <button
          onClick={() => {
            handleAddLayer();
          }}
        >
          Add layer
        </button>
        <button
          onClick={() => {
            handleUpdateLayer();
          }}
        >
          Update Layer
        </button>
      </div>
    </>
  );
};
