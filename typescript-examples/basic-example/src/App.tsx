import { FC, useEffect, useRef, useState } from "react";
import { createMap, MapApi } from "@foursquare/map-sdk";

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapApi | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        token: "TODO",
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
