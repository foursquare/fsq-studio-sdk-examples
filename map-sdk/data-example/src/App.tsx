import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';
import {fetchSampleData} from './sample-data';

export const AppWithCustomUI: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);
  const [jsonPopupVisible, setJsonPopupVisible] = useState(false);
  const [datasetData, setDatasetData] = useState<any>(null);
  const [data, setData] = useState<[any, any] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setData(await fetchSampleData());
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

  // Add a dataset to the map
  const handleAddDataset = useCallback(() => {
    if (!data) {
      console.log('Data not yet loaded.');
      return;
    }

    if (!map) {
      console.log('Map not yet initialized.');
      return;
    }

    if (map.getDatasets().length > 0) {
      console.log('Dataset already added to the map. (Example is limited to one dataset).');
      return;
    }

    map.addDataset({
      id: 'california-cities',
      label: 'California Cities',
      data: data[0]
    });

    console.log('Dataset added.');
  }, [map, data]);

  // Update a dataset's studio metadata, including its label and color
  // (viewable in Studio's sidebar)
  const handleUpdateDataset = useCallback(() => {
    if (!data) {
      console.log('Data not yet loaded.');
      return;
    }

    if (!map) {
      console.log('Map not yet initialized.');
      return;
    }

    const datasetId = map.getDatasets()[0]?.id ?? null;
    if (datasetId == null) {
      console.log('No dataset to update');
      return;
    }

    if (datasetId) {
      const updatedLabel = 'Updated Dataset';
      const updatedColor = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ] as [number, number, number];

      map.updateDataset(datasetId, {
        label: updatedLabel,
        color: updatedColor
      });

      console.log('Dataset color and label updated.');
    }
  }, [map, data]);

  // Replace the dataset for one with the exact same schema
  // In this example, replace toggles between california/arizona cities
  const handleReplaceDataset = useCallback(() => {
    if (!data) {
      console.log('Data not yet loaded.');
      return;
    }

    if (!map) {
      console.log('Map not yet initialized.');
      return;
    }

    let datasets = map?.getDatasets();

    if (!datasets || datasets.length !== 1) {
      console.log('There are no datasets or multiple datasets on the map.');
      return;
    }

    if (map.getDatasetById('california-cities')) {
      map.replaceDataset('california-cities', {
        id: 'arizona-cities',
        label: 'Arizona Cities',
        data: data[1]
      });
    } else {
      map.replaceDataset('arizona-cities', {
        id: 'california-cities',
        label: 'California Cities',
        data: data[0]
      });
    }

    datasets = map.getDatasets();

    console.log('Dataset replaced, changed to', datasets[0].label + '.');
  }, [map, data]);

  // Get the dataset on the map and display it in a window
  const handleGetDataset = useCallback(() => {
    if (!map) {
      console.log('Map not yet initialized.');
      return;
    }

    const datasetId = map.getDatasets()[0]?.id ?? null;
    if (datasetId == null) {
      console.log('No dataset to get');
      return;
    }

    if (datasetId) {
      const datasetData = map.getDatasetWithData(datasetId);
      setDatasetData(datasetData);
      console.log('Opening Dataset:', datasetId);
      setJsonPopupVisible(true);
    }
  }, [map]);

  // Remove the dataset from the map, if it exists
  const handleRemoveDataset = useCallback(() => {
    if (!map) {
      console.log('Map not yet initialized.');
      return;
    }

    const datasetId = map.getDatasets()[0]?.id ?? null;
    if (datasetId == null) {
      console.log('No dataset to remove');
      return;
    }
    if (datasetId) {
      map.removeDataset(datasetId);
      console.log('Removed dataset:', datasetId);
    }
  }, [map]);

  // Close the JSON pop-up from getDatasetWithData() example
  const handleCloseJsonPopup = () => {
    setJsonPopupVisible(false);
  };

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      <div className="controls">
        {/* Buttons for various dataset operations */}
        <button onClick={handleAddDataset}>Add Dataset</button>
        <button onClick={handleUpdateDataset}>Update Dataset</button>
        <button onClick={handleReplaceDataset}>Replace Dataset</button>
        <button onClick={handleGetDataset}>Get Dataset</button>
        <button onClick={handleRemoveDataset}>Remove Dataset</button>
      </div>

      {/* JSON popup */}
      {jsonPopupVisible && (
        <div className="json-popup">
          <div className="json-popup-content">
            <button onClick={handleCloseJsonPopup}>Close</button>
            <pre>{JSON.stringify(datasetData, null, 2)}</pre>
          </div>
        </div>
      )}
    </>
  );
};
