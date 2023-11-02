import { FC, useEffect, useRef } from "react";
import { createMap } from "@unfolded/map-sdk";
// import { createMap } from "http://localhost:8090/index.js";
import { editorContent } from "./editor-content";

export const App: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const map = await createMap({
        container: containerRef.current!,
      });

      map.addAnnotation({
        id: "my-annotation",
        kind: "POINT",
        isVisible: true,
        autoSize: true,
        autoSizeY: true,
        anchorPoint: [-120.913995, 36.007],
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
