import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {createMap, MapApi} from '@unfolded/map-sdk';
import californiaCities from './data/california-cities.json';
import arizonaCities from './data/arizona-cities.json';

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
  const [datasetAdded, setDatasetAdded] = useState(false);
  const [jsonPopupVisible, setJsonPopupVisible] = useState(false);
  const [datasetData, setDatasetData] = useState<any>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!
      });

      setMap(map);
    };

    initMap();
  }, []);

  // Function to get the dataset ID
  // (in this example it is always the first/only dataset on the map)
  const getDatasetId = (): string | null => {
    if (!map) {
      return null;
    }

    const datasets = map.getDatasets();

    if (datasets.length === 1) {
      return datasets[0].id;
    } else {
      console.log('There are no datasets or multiple datasets on the map.');
      return null;
    }
  };

  // Function to handle dataset update logic
  const updateDataset = (datasetId: string, updateFunction: (dataset: any) => void) => {
    if (!map) {
      return;
    }

    const datasetToUpdate = map.getDatasetById(datasetId);

    if (datasetToUpdate) {
      updateFunction(datasetToUpdate);
      map.updateDataset(datasetId, datasetToUpdate);
    }
  };

  // Add a dataset to the map
  const handleAddDataset = useCallback(() => {
    if (!map || datasetAdded) {
      return;
    }

    setDatasetAdded(true);
    console.log('Dataset added.');

    map.addDataset({
      id: 'california-cities',
      label: 'California Cities',
      data: californiaCities
    });
  }, [datasetAdded, map]);

  // Update a dataset's studio metadata, including its label and color
  // (viewable in Studio's sidebar)
  const handleUpdateDataset = useCallback(() => {
    const datasetId = getDatasetId();

    if (datasetId) {
      updateDataset(datasetId, dataset => {
        dataset.label += ' updated';
        dataset.color = [
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256)
        ];
      });

      console.log('Dataset color and label updated.');
    }
  }, [map]);

  // Replace the dataset for one with the exact same schema
  // In this example, replace toggles between california/arizona cities
  const handleReplaceDataset = useCallback(() => {
    let datasets = map?.getDatasets();

    if (!datasets || datasets.length !== 1) {
      console.log('There are no datasets or multiple datasets on the map.');
      return;
    }

    if (map.getDatasetById('california-cities')) {
      map.replaceDataset('california-cities', {
        id: 'arizona-cities',
        label: 'Arizona Cities',
        data: arizonaCities
      });
    } else {
      map.replaceDataset('arizona-cities', {
        id: 'california-cities',
        label: 'California Cities',
        data: californiaCities
      });
    }

    datasets = map.getDatasets();

    console.log('Dataset replaced, changed to', datasets[0].label + '.');
  }, [map]);

  // Get the dataset on the map and display it in a window
  const handleGetDataset = useCallback(() => {
    const datasetId = getDatasetId();

    if (datasetId) {
      const datasetData = map.getDatasetWithData(datasetId);
      setDatasetData(datasetData);
      console.log('Opening Dataset:', datasetId);
      setJsonPopupVisible(true);
    }
  }, [map]);

  // Remove the dataset from the map, if it exists
  const handleRemoveDataset = useCallback(() => {
    const datasetId = getDatasetId();

    if (datasetId) {
      map.removeDataset(datasetId);
      setDatasetAdded(false);
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
        <button onClick={handleAddDataset} disabled={datasetAdded}>
          Add Dataset
        </button>
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
