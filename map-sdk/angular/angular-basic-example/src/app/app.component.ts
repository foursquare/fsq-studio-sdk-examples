import { Component } from '@angular/core';
import {createMap, getLayers, Layer, setLayerVisibility, setViewState, ViewState} from '@unfolded/map-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-basic-example';
  mapInstance;
  isLoaded = false;
  layers: Layer[] = [];
  
  constructor() {
    this.mapInstance = createMap({
      mapUrl: 'https://studio.unfolded.ai/public/80c800cc-5805-4416-94a5-bd8105cab7f7',
      appendToDocument: true,
      embed: true,
      width: window.innerWidth,
      height: window.innerHeight,
      onLoad: () => { 
        console.log('%cUnfoldedMapSDK: %cMap has loaded...', 'color: violet;', 'color: yellow;');
        this.isLoaded = true;
      }
    });
  }
  
  getLayers() {
    getLayers(this.mapInstance).then((layers) => {
      console.log(layers);
      this.layers = layers;
    });
  }
  
  setLayerVisibility(id: string) {
    const index = this.layers.findIndex(layer => layer.id === id),
          layer = this.layers[index],
          layerId = layer.id,
          isVisible = !layer.isVisible;
    
    setLayerVisibility(this.mapInstance, layerId, isVisible).then(layer => this.layers[index] = layer);
  }
  
  goTo(location: string) {
    let viewStateConfig: ViewState = {
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
    }
    this._setViewState(viewStateConfig);
  }
  
  _setViewState(viewStateConfig: ViewState) {
    setViewState(
      this.mapInstance,
      viewStateConfig
    ).then(data => console.log(data));
  }
}
