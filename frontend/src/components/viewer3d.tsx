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
   

    async function handleGenerateSurface()
    {
    }

    useEffect(() => { sceneRef.current?.setBoundingBoxVisisble(showBoundingBox); }, [showBoundingBox]);

   return (
        <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }} >
            <div style={{
                position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: '20px', padding: '9px 14px',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.88)', border: '1px solid rgba(0, 0, 0, 0.18)',                
                borderRadius: '10px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)', zIndex: 10,
                fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px', color: '#4b5563',
                whiteSpace: 'nowrap'}}>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} >
                    <input type="color" defaultValue="#1a211c"
                        onChange={(e) => sceneRef.current?.setBackgroundColor(new THREE.Color(e.target.value))}
                        style={{
                            width: '34px', height: '28px', padding: '2px', border: '1px solid #cbd5e1',
                            borderRadius: '3px', background: '#fff', cursor: 'pointer'}} />
                    <span>Background</span>
                </label>

                <div style={{ width: '1px', height: '22px', background: '#e5e7eb'}} />

                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }} >
                    <input type="checkbox" checked={showBoundingBox} onChange={(e) => setShowBoundingBox(e.target.checked)}
                        style={{ width: '16px', height: '16px', margin: 0, accentColor: '#2563eb', cursor: 'pointer' }} />
                    <span>Bounding Box</span>
                </label>

                < button type = 'button' onClick = { handleGenerateSurface } style={{
                    height: '30px', padding: '0 13px', border: 'none', borderRadius: '6px',
                    background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.1s ease background 0.1s ease box-shadow 0.1s ease'}}
                    onMouseDown={(e) =>
                    {
                        e.currentTarget.style.transform = 'scale(0.94)';
                        e.currentTarget.style.background = '#1d4ed8';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseUp={(e) =>
                    {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) =>
                    {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
                    }}>
                    Generate
                </button>

            </div>
        </div>);
}
