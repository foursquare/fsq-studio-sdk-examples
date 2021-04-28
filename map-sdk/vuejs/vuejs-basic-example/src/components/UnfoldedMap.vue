<template>
  <div id="vue-container">
    <div class="overlay-container">
      <h4>Embedding an Unfolded Map using the Map SDK with Vue.js</h4>
      <div v-if='!isLoaded' id="loader"></div>
      <div v-if='isLoaded' id="button-container">
        <button class="btn btn-primary btn-lg btn-square" @click="goTo('sf')">SAN FRANCISCO</button>
        <button class="btn btn-primary btn-lg btn-square" @click="goTo('la')">LOS ANGELES</button>
        <button class="btn btn-primary btn-lg btn-square" @click="goTo('ny')">NEW YORK</button>
        <button class="btn btn-primary btn-lg btn-square" @click="getLayers()">GET LAYERS</button>
        <div id="sdk-layers" v-if='layers.length'>
          <label class='toggle-label'>Toggle layer visibility</label>
          <div class="checkbox-group" v-for="layer in layers" :key="layer.id">
            <label class="switch">
              <input type="checkbox" :id="layer.id" :checked="layer.isVisible" @change="setLayerVisibility(layer.id)" />
              <span class="slider round"></span>
            </label>
            <label class="switch-label">
              <div>{{layer.label}}</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {createMap, getLayers, setLayerVisibility, setViewState} from '@unfolded/map-sdk';

export default {
  name: 'UnfoldedMap',
  data: function() {
    return {
      mapInstance: null,
      isLoaded: false,
      layers: []
    }
  },
  created() {
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
  },
  methods: {
    getLayers: function() {
      getLayers(this.mapInstance).then((layers) => {
        console.log(layers);
        this.layers = layers;
      });
    },
    setLayerVisibility: function(id) {
      const index = this.layers.findIndex(layer => layer.id === id),
            layer = this.layers[index],
            layerId = layer.id,
            isVisible = !layer.isVisible;
      setLayerVisibility(this.mapInstance, layerId, isVisible).then(layer => this.layers[index] = layer);
    },
    goTo: function(location) {
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
      }
      this._setViewState(viewStateConfig);
    },
    _setViewState: function(config) {
      setViewState(
        this.mapInstance,
        config
      ).then(data => console.log(data));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.overlay-container {
  position: absolute;
  width: 20%;
  left: 0;
  top: 80px;
  margin: 16px;
  padding: 16px;
  background: rgb(250, 250, 250);

  h3 {
    text-transform: uppercase;
  }
  h4 {
    font-weight: 400;
    color: hsla(0,0%,0%,0.9);
  }
  #button-container {
    display: grid;
    grid-auto-rows: auto;
    grid-gap: 8px;

    button {
      font-family: 'Graphik Web Semibold';
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 2px;
      padding: 8px 24px;
      border: none;
      -webkit-border-radius: 2px;
      -webkit-background-clip: padding-box;
      -moz-border-radius: 2px;
      -moz-background-clip: padding;
      border-radius: 2px;
      background-clip: padding-box;
      -webkit-transition: color 0.2s linear, background-color 0.2s linear;
      transition: color 0.2s linear, background-color 0.2s linear;
      background-color: #3498db;
      &:hover {
        background-color: #217dbb;
        color: #fff;
        cursor: pointer;
      }
    }
    .checkbox-group {
      
      .switch-label {
        line-height: 34px;
        vertical-align: top;
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        margin: 0px 12px 12px 0px;

        input { 
          opacity: 0;
          width: 0;
          height: 0;

          &:checked + .slider {
            background-color: #3498db;
          }
          &:focus + .slider {
            box-shadow: 0 0 1px #3498db;
          }
          &:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
          }
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 34px;

          &:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
          }
        }
      }
    }
    #sdk-layers{
      display: block;

      .toggle-label {
        border-top: 1px solid #000;
        display: inline-block;
        width: 100%;
        margin: 12px 0 12px 0;
        padding-top: 12px;
      }
    }
    .message {
      border-top: 1px solid hsla(0,0%,0%,0.6);
      padding-top: 12px;
    }
    #results {
      overflow-x: auto;
    }
  }
  #loader {
    margin: 0 auto;
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>
