import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Scene3DClass } from "./scene3d";


export function Viewer3D()
{
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<Scene3DClass | null>(null);
    const [showBoundingBox, setShowBoundingBox] = useState(true);

    useEffect(() =>
    {
        if (!containerRef.current) { return; }

        const scene = new Scene3DClass();
        scene.initialize(containerRef.current);
        sceneRef.current = scene;

        return () =>
        {
            scene.dispose();
            sceneRef.current = null;
        }
    }, []);


    useEffect(() => { sceneRef.current?.setBoundingBoxVisisble(showBoundingBox); }, [showBoundingBox]);

    return (<div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative' }} >
                <label>
                    <input type="color" defaultValue="#1a211c" 
                onChange={(e) => sceneRef.current?.setBackgroundColor(new THREE.Color(e.target.value))} />
                {" "} Background{" "} 
                </label>
                <label>
                    <input type="checkbox" checked={showBoundingBox} onChange={(e) => setShowBoundingBox(e.target.checked)} />
                    {" "} Bounding Box
                </label>
            </div>);
}
