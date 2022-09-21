<script>
  export let mapInstance;
  let layers = [];
  let layerResult = '';

  const getLayers = () => {
    layers = mapInstance.getLayers();
    console.log(layers);
    layerResult = JSON.stringify(layers, null, 2);
  };

  const setLayerVisibility = id => {
    const index = layers.findIndex(layer => layer.id === id),
      layer = layers[index],
      layerId = layer.id,
      isVisible = !layer.isVisible;

    layers[index] = mapInstance.updateLayer(layerId, {isVisible});
  };

  const goTo = location => {
    let viewStateConfig = {
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
    mapInstance.setView(viewStateConfig);
  };
</script>

<div class="sidemenu">
  <div class="header">
    <img class="logo-image" alt="company-logo" src="/images/your-company-logo-here.png" />
  </div>
  {#if !mapInstance}
    <div id="loader" />
  {:else}
    <div id="content">
      <h2>Demo Application</h2>
      <span class="subtitle"
        >Built by <a href="https://docs.unfolded.ai/map-sdk" target="_blank">Unfolded Map SDK</a
        ></span
      >
      <p class="description">
        Demonstrating the possiblities of customizing Unfolded Studio using the Map SDK with <a
          href="https://svelte.dev/"
          target="_blank">Svelte</a
        >.
      </p>
      <p class="description-small">
        The Unfolded Map SDK can be used directly in a standard HTML + JavaScript web page using the
        JavaScript version of the Map SDK. The Map SDK enables you to use Unfolded maps as a
        controllable UI component.
      </p>
      <div class="content-section">
        <span class="section-label">Viewport controls</span>
        <div class="location-container">
          <button id="move_button_sf" on:click={() => goTo('sf')}>San Francisco</button>
          <button id="move_button_ny" on:click={() => goTo('ny')}>New York</button>
          <button id="move_button_la" on:click={() => goTo('la')}>Los Angeles</button>
          <button id="move_button_london" on:click={() => goTo('london')}>London</button>
        </div>
      </div>
      <div class="content-section">
        <span class="section-label">Layer controls</span>
        <button id="get-layers" on:click={getLayers}>GET LAYERS</button>
        <div id="layers-container">
          {#each layers as layer}
            <div
              class="layer {layer.isVisible ? 'selected' : ''}"
              on:click={() => setLayerVisibility(layer.id)}
            >
              <div class="layer-preview">
                <img src="/images/layer-icon.svg" alt="layer-icon" />
              </div>
              <div class="layer-description">
                <span class="layer-name">{layer.label}</span>
                <span class="layer-text">Click to toggle layer visibility</span>
              </div>
            </div>
          {/each}
        </div>
        <details open>
          <summary>JSON response</summary>
          <pre id="results">{layerResult}</pre>
        </details>
      </div>
    </div>
  {/if}
  <div class="footer">
    <img alt="unfolded-logo" src="https://cdn.unfolded.ai/statics/unfolded-logo-black.png" />
  </div>
</div>

<style lang="scss">
  .sidemenu {
    position: absolute;
    display: grid;
    grid-template-rows: auto 1fr auto;
    border: 1px solid #b3b3b3;
    border-radius: 20px;
    overflow: hidden;
    max-height: 80%;
    width: 360px;
    left: 60px;
    top: 0;
    margin: 100px 28px;
    background: white;
    opacity: 1;
    .header {
      padding: 20px;
      height: 52px;
      background-color: white;
      .logo-image {
        height: 52px;
      }
    }
    #content {
      overflow-y: auto;
      padding: 0px 20px 20px 20px;
      h2 {
        margin: 0px;
      }
      .subtitle {
        font-size: 12px;
        color: #1d48e8;
      }
      .description {
        font-size: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #1d48e8;
      }
      .description-small {
        font-size: 12px;
        color: #333;
      }
      .content-section {
        .section-label {
          font-size: 12px;
          border-bottom: 1px solid #1d48e8;
          width: 100%;
          display: inline-block;
          padding-bottom: 8px;
          margin: 16px 0px 16px 0px;
        }
        .location-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 8px;
        }
        button {
          font-family: 'Graphik Web Semibold';
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 8px;
          width: 100%;
          letter-spacing: 2px;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background-clip: padding-box;
          transition: color 0.2s linear, background-color 0.2s linear;
          background-color: #3498db80;
          &:hover {
            background-color: #217dbb;
            color: #fff;
            cursor: pointer;
          }
        }
        #layers-container {
          margin-top: 20px;
          .layer {
            display: grid;
            grid-template-columns: auto 1fr;
            border: 2px solid #b3b3b3;
            margin-bottom: 12px;
            overflow: hidden;
            &:hover {
              cursor: pointer;
              border: 2px solid #1d48e8;
            }
            &.selected {
              border: 2px solid #1d48e8;
              background-color: rgba(86, 171, 232, 0.3);
            }
            .layer-preview {
              width: 60px;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .layer-description {
              display: grid;
              grid-template-rows: auto auto;
              margin: 8px;
              cursor: pointer;
              .layer-name {
                cursor: pointer;
                font-size: 14px;
                user-select: none;
              }
              .layer-text {
                cursor: pointer;
                font-size: 12px;
                color: #333;
                user-select: none;
              }
            }
          }
        }
        summary {
          margin-top: 8px;
          font-size: 14px;
          cursor: pointer;
        }
        pre {
          white-space: pre-wrap;
          background-color: #ececec;
        }
        input {
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 16px;
        }
      }
    }
    .footer {
      padding: 20px;
      height: 24px;
      img {
        width: 100px;
        float: right;
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
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
