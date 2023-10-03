import {FC, useEffect, useMemo, useRef, useState} from 'react';
import {createMap, LayerType, MapApi} from '@unfolded/map-sdk';
import {SampleDataItem, fetchSampleData} from './sample-data';

const opacityOptions = [0.8, 0.5, 0.15]; // Define the color options

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);
  const [sampleData, setSampleData] = useState<[SampleDataItem] | null>(null);
  const [layerType, setLayerType] = useState<string>('point'); // Added state for layer type
  const [selectedOpacity, setSelectedOpacity] = useState<number>(0.8);

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

  const handlers = useMemo(() => {
    if (!sampleData || !map) {
      console.log('Data or map not yet loaded.'); // Combined error logging
      return null;
    }

    return {
      addLayer: () => {
        if (map.getDatasets().length == 0) {
          console.log('Dataset already added to the map.');
          map.addDataset(sampleData[0], {
            autoCreateLayers: false
          });
        }

        map.addLayer({
          type: layerType as LayerType, // Added dynamic layer type
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
      },
      updateLayer: () => {
        // provide an associated dropdown for color selection
        // Dropdown options: "Global Warming", "Pink Wine", and "Violet Ocean"
        // check if layers exist (button should only be enabled when layers exist)
        // update all layers to new color scheme
        const layerObjects = map.getLayers(); // Assuming this returns an array of layers

        const layerIds = layerObjects.map(layer => layer.id);

        layerIds.forEach(layerId => {
          map.updateLayer(layerId, {
            config: {
              visConfig: {
                opacity: selectedOpacity
              }
            }
          });
        });
      }
    };
  }, [map, sampleData, layerType]); // Added layerType to dependencies

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      {!!handlers && (
        <div className="controls">
          <div className="add-container">
            <select onChange={e => setLayerType(e.target.value)} value={layerType}>
              {/* Add an event handler to set the layer type */}
              <option value="point">Point</option>
              <option value="heatmap">Heatmap</option>
              <option value="cluster">Cluster</option>
            </select>

            <button onClick={handlers.addLayer}>Add Layer</button>
          </div>

          <div className="update-container">
            <select
              onChange={e => setSelectedOpacity(parseFloat(e.target.value))}
              value={selectedOpacity}
            >
              {opacityOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button onClick={handlers.updateLayer}>Update Layer</button>
          </div>

          <button onClick={handlers.getLayer}>Copy Layer to Clipboard</button>
          <button onClick={handlers.removeLayer}>Remove Layer</button>
          <button onClick={handlers.createLayerGroups}>Create Layer Group</button>
          <button onClick={handlers.removeLayerGroups}>Remove Layer Group</button>
        </div>
      )}
    </>
  );
};
