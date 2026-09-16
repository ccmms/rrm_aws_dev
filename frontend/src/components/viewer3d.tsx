import * as THREE from "three";
import { useEffect, useRef } from "react";
import { Scene3DClass } from "./scene3d";


export function Viewer3D()
{
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<Scene3DClass | null>(null);

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

    return (<div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative' }} >
                <input type="color" defaultValue="#1a211c" style={{ position: 'absolute', top: 12, left: 12 }}
                    onChange={(e) =>
                    {
                        if (sceneRef.current)
                        {
                            sceneRef.current.setBackgroundColor(new THREE.Color(e.target.value));
                        }
                    }}/>  
            </div>);


}