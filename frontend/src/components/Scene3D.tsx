import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function Scene3D()
{
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() =>
    {
        const container = containerRef.current;
        if (!container) { return; }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a211c);

        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x4fae8f, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        let frameId: number;

        function animate()
        {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        animate();

        return () => {
            cancelAnimationFrame(frameId);
            geometry.dispose();
            material.dispose();
            controls.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative' }} >
            <input
                type="color" defaultValue="#1a211c" style={{ position: 'absolute', top: 12, left: 12 }}
                onChange={(e) => {
                    if (sceneRef.current) { sceneRef.current.background = new THREE.Color(e.target.value); }
                }} />
        </div>);
}

export default Scene3D;