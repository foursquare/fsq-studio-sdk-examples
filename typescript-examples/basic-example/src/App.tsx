import { FC, useEffect, useRef, useState } from "react";
import { createMap, MapApi } from "@foursquare/map-sdk";

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        // This is an API Key that only works for these examples.
        // Provide your own Map SDK API Key instead.
        // For more details, see: https://docs.foursquare.com/developer/docs/studio-map-sdk-authentication
        apiKey: "fsq3CYDP77ybwoo1KtkJigGRj6g0uYyhWVw25jM+zN6ovbI=",
        container: containerRef.current!,
      });

      setMap(map);
    };

    initMap();
  }, []);

  useEffect(() => {
    map && console.log(map.getMapConfig());
  }, [map]);

  return <div id="map-container" ref={containerRef}></div>;
};
