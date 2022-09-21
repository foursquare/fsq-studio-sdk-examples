<script>
  import OverlayMenu from './OverlayMenu.svelte';
  import {createMap} from '@unfolded/map-sdk';
  import locationData from './data/cities.json';

  let mapInstance = null;
  
  const loadMap = async () => {
    mapInstance = await createMap({container: document.getElementById('map')});
    const dataset = {
      id: 'test-dataset-01',
      label: 'Cities',
      color: [194, 29, 29],
      data: locationData
    };

    mapInstance.addDataset(dataset);
  };
  loadMap();
</script>

<OverlayMenu {mapInstance}  />