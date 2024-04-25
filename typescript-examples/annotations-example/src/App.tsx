import { FC, useEffect, useRef } from "react";
import { createMap } from "@foursquare/map-sdk";
import { editorContent } from "./editor-content";

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        apiKey: "<your-api-key>",
        container: containerRef.current!,
      });

      map.addAnnotation({
        id: "my-annotation",
        kind: "POINT",
        isVisible: true,
        autoSize: true,
        autoSizeY: true,
        anchorPoint: [-122.4194, 37.7749],
        label: "Richtext annotation",
        editorState: editorContent,
        lineColor: "#C32899",
        lineWidth: 5,
        textWidth: 167.2265625,
        textHeight: 75,
        textVerticalAlign: "bottom",
        armLength: 50,
        angle: -45,
      });
    };

    initMap();
  }, []);

  return <div id="map-container" ref={containerRef}></div>;
};
