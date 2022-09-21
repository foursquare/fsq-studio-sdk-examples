import {Component} from '@angular/core';
import {createMap, DatasetCreationProps, Layer, MapApi, View} from '@unfolded/map-sdk';
import locationData from '../data/cities.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-basic-example';
  mapInstance: MapApi | null = null;
  isLoaded = false;
  layers: Layer[] = [];
  layerResult: string = '';

  constructor() {
    const loadMap = async () => {
      this.mapInstance = await createMap({});

      const mapElement = document.getElementById('map');
      mapElement && this.mapInstance.addToDOM(mapElement);
      this.isLoaded = true;

      const dataset: DatasetCreationProps = {
        id: 'test-dataset-01',
        label: 'Cities',
        color: [194, 29, 29],
        data: locationData
      };

      this.mapInstance && this.mapInstance.addDataset(dataset);
    };
    loadMap();
  }

  getLayers() {
    if (this.mapInstance) {
      this.layers = this.mapInstance.getLayers();
      this.layerResult = JSON.stringify(this.layers, null, 2);
    }
  }

  setLayerVisibility(id: string) {
    if (this.mapInstance && this.layers.length) {
      const index = this.layers.findIndex(layer => layer.id === id),
        layer = this.layers[index],
        layerId = layer.id,
        isVisible = !layer.isVisible;

      this.layers[index] = this.mapInstance.updateLayer(layerId, {isVisible});
    }
  }

  goTo(location: string) {
    let viewStateConfig: Partial<View> = {
      longitude: 0,
      latitude: 0,
      zoom: 0
    };
    switch (location) {
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
          latitude: 40.73061,
          zoom: 6
        };
        break;
      case 'london':
        viewStateConfig = {
          longitude: 0.1276,
          latitude: 51.5072,
          zoom: 6
        };
        break;
    }
    this._setViewState(viewStateConfig);
  }

  _setViewState(viewStateConfig: Partial<View>) {
    this.mapInstance && this.mapInstance.setView(viewStateConfig);
  }
}
