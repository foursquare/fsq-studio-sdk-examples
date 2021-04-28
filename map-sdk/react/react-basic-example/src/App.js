import {useState, useRef, useEffect} from 'react';
import {createMap, setViewState, getLayers, setLayerVisibility} from '@unfolded/map-sdk';

import './App.scss';

function App() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [layers, setLayers] = useState([]);

  const loadLayers = () => {
    getLayers(map).then((layers) => {
      console.log(layers);
      setLayers(layers);
    });
  }

  const setLayerVisibilityForId = id => {
    const index = layers.findIndex(layer => layer.id === id),
          layer = layers[index],
          layerId = layer.id,
          isVisible = !layer.isVisible;
    setLayerVisibility(map, layerId, isVisible).then(layer => {
      layers[index] = layer;
      const newLayers = [...layers];
      setLayers(newLayers);
    });
  }

  const goTo = location => {
    let viewStateConfig = {
      longitude: 0,
      latitude: 0,
      zoom: 0
    };
    switch(location) {
      case 'sf':
        viewStateConfig = {
          longitude: -122.4194,
          latitude: 37.7749,
          zoom: 6
        };
        break;
      case 'la':
        viewStateConfig = {
          longitude: -118.243683,
          latitude: 34.052235,
          zoom: 6
        };
        break;
      case 'ny':
        viewStateConfig = {
          longitude: -73.935242,
          latitude: 40.730610,
          zoom: 6
        };
        break;
      default:
        break;
    }
    _setViewState(viewStateConfig);
  }

  const _setViewState = config => {
    setViewState(
      map,
      config
    ).then(data => console.log(data));
  }

  return (
    <div className="App">
      <UnfoldedMap setMap={setMap} setIsMapLoaded={setIsMapLoaded} />
      <div className="overlay-container">
        <h4>Embedding an Unfolded Map using the Map SDK with React.js</h4>
        {!isMapLoaded ? 
          <div id="loader"/>
          :
          <div id="button-container">
            <button className="btn btn-primary btn-lg btn-square" onClick={() => goTo('sf')}>SAN FRANCISCO</button>
            <button className="btn btn-primary btn-lg btn-square" onClick={() => goTo('la')}>LOS ANGELES</button>
            <button className="btn btn-primary btn-lg btn-square" onClick={() => goTo('ny')}>NEW YORK</button>
            <button className="btn btn-primary btn-lg btn-square" onClick={() => loadLayers()}>GET LAYERS</button>
            {layers.length > 0 &&
              <div id="sdk-layers" v-if='layers.length'>
              <label className='toggle-label'>Toggle layer visibility</label>
              {layers.map((layer, index) => (
                <div className="checkbox-group" key={index}>
                  <label className="switch">
                    <input type="checkbox" id={layer.id} checked={layer.isVisible} onChange={() => setLayerVisibilityForId(layer.id)} />
                    <span className="slider round"></span>
                  </label>
                  <label className="switch-label">
                    <div>{layer.label}</div>
                  </label>
                </div>
              ))}
            </div>
            }
          </div>
        }
      </div>
    </div>
  );
}

function UnfoldedMap({setMap, setIsMapLoaded}) {
  const mountContainerRef = useRef(null);

  useEffect(() => {
    const mapInstance = createMap({
      mapUrl: 'https://studio.unfolded.ai/public/80c800cc-5805-4416-94a5-bd8105cab7f7',
      appendToDocument: false,
      embed: true,
      width: window.innerWidth,
      height: window.innerHeight,
      onLoad: () => {
        console.log('%cUnfoldedMapSDK: %cMap has loaded...', 'color: violet;', 'color: yellow;');
        setMap(mapInstance);
        setIsMapLoaded(true);
      }
    });
    mountContainerRef.current.appendChild(mapInstance.iframe);

    const resizeMap = () => {
      if (mountContainerRef.current === null) return;
      const iframe = mountContainerRef.current.querySelector('iframe');
      if (iframe === null) return;
      iframe.style.width = `${window.innerWidth}px`;
      iframe.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener('resize', resizeMap);
  }, [setMap, setIsMapLoaded]);

  return (
    <div className="unfolded">
      <div ref={mountContainerRef} />
    </div>
  );
}

export default App;
