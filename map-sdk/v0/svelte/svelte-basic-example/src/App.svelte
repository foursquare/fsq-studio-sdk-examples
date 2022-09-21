<script>
  import OverlayMenu from './OverlayMenu.svelte';
  import {UnfoldedMap, setViewState} from '@unfolded/map-sdk';

  let isMapLoaded = false;

  const unfoldedMap = new UnfoldedMap({
    mapUUID: '80c800cc-5805-4416-94a5-bd8105cab7f7',
    embed: true,
    onLoad: () => {
      console.log('%cUnfoldedMapSDK: %cMap has loaded...', 'color: violet;', 'color: yellow;');
      isMapLoaded = true;
    }
  });
</script>

<OverlayMenu {isMapLoaded} {unfoldedMap} />
