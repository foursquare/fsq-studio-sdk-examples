import {FC, useEffect, useRef, useState} from 'react';
import {createMap, Dataset, Layer, MapApi} from '@unfolded/map-sdk';

const cn = (...classNames: (string | undefined | boolean | null)[]): string =>
  classNames.filter(item => !!item).join(' ');

// NOTE: expose icons and other common items (icons, 3d models, colors,...)
// through SDK
const IconOptions = ['car', 'cart', 'heart', 'heart-empty', 'pin', 'home'] as const;
type Icon = (typeof IconOptions)[number];

const MarkerTypeOptions = ['blue', 'green', 'red', 'orange'] as const;

type MarkerType = (typeof MarkerTypeOptions)[number];

const MARKER_TYPE_COLOR_MAP = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  orange: '#ff5733'
} as const satisfies Record<MarkerType, string>;

type Marker = {
  label: string;
  type: MarkerType;
  icon: Icon;
  lat: number;
  lng: number;
};

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);
  const datasetRef = useRef<Dataset | null>(null);
  const layerRef = useRef<Layer | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      // NOTE: loading indicator takes over the entire screen,
      // regardless of the map container size
      // NOTE: entirety of UI assumes full-viewport height (loading indicator,
      // data tables, error/hiccup image and message,...)
      const map = await createMap({
        container: containerRef.current!
      });

      setMap(map);

      // NOTE: this is not working
      map.setMapControlVisibility({
        legend: false,
        'map-draw': false,
        'split-map': false,
        'toggle-3d': false,
        'viewport-json': false,
        annotation: false,
        chart: false
      });

      datasetRef.current = map.addDataset(
        {
          label: 'Markers Data',
          data: []
        },
        {autoCreateLayers: false}
      );

      layerRef.current = map.addLayer({
        label: 'Markers Layer',
        type: 'icon',
        dataId: datasetRef.current.id,
        config: {
          columnMode: 'table'
        },
        fields: {
          latitude: 'lat',
          longitude: 'lng',
          icon: 'icon'
        }
      });
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.eventHandlers.onClick = e => {
      if (e.pickInfo) {
        // clicked on a marker - select
      } else {
        // clicked on an empty space - add a marker
        setMarkers([
          ...markers,
          {
            label: `Marker #${markers.length}`,
            icon: 'pin',
            type: 'orange',
            lat: e.coordinate[0],
            lng: e.coordinate[1]
          }
        ]);
      }
    };
  }, [map, markers]);

  useEffect(() => {
    const layer = layerRef.current;
    const dataset = datasetRef.current;
    if (!map || !dataset || !layer) {
      return;
    }

    datasetRef.current = map.replaceDataset(
      dataset.id,
      {
        id: dataset.id,
        label: dataset.label,
        color: dataset.color,
        data: markers,
        type: 'local'
      },
      {
        strict: false,
        force: true
      }
    );

    // console.log({dataset, markers});
    // console.log(map.getDatasetWithData(dataset.id));

    try {
      map.updateLayer(layer.id, {
        dataId: dataset.id
      });
    } catch (e) {}

    // TODO missing layer
    // TODO missing columns in dataset
    // TODO redundant (?) try/catch
    // TODO hot-reload breaks the app
  }, [markers, map]);

  return (
    <>
      <div id="map-container" ref={containerRef}></div>
      <div id="controls">
        <div className="marker-list">
          {markers.map((marker, idx) => (
            <div
              key={idx}
              className={cn('marker-item', marker === selectedMarker && 'selected')}
              onClick={() => {
                setSelectedMarker(selectedMarker === marker ? null : marker);
              }}
            >
              <select
                value={marker.type}
                onChange={e => {
                  const newMarkers = [...markers];
                  newMarkers[idx] = {
                    ...marker,
                    type: e.target.value as MarkerType
                  };
                  setMarkers(newMarkers);
                }}
                style={{
                  color: MARKER_TYPE_COLOR_MAP[marker.type]
                }}
              >
                {MarkerTypeOptions.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={marker.icon}
                onChange={e => {
                  const newMarkers = [...markers];
                  newMarkers[idx] = {
                    ...marker,
                    icon: e.target.value as Icon
                  };
                  setMarkers(newMarkers);
                }}
              >
                {IconOptions.map(icon => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="marker-label"
                value={marker.label}
                onChange={e => {
                  const newMarkers = [...markers];
                  newMarkers[idx] = {
                    ...marker,
                    label: e.target.value
                  };
                  setMarkers(newMarkers);
                }}
              />
              <div
                className="marker-delete"
                onClick={() => {
                  setMarkers(markers.filter(m => m != marker));
                }}
              >
                🗑️
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
