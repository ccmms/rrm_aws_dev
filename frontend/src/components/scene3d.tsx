import * as THREE from "three";
import { CameraController } from "../core/renderer/camera_controller";
import type { BoundingBox } from "../core/geometry/geometry_types";
import { BoundingBoxRenderer } from "../core/renderer/boundingbox_renderer";


export class Scene3DClass
{
    private scene?: THREE.Scene;
    private camera?: THREE.PerspectiveCamera;
    private renderer?: THREE.WebGLRenderer;
    private cameraController?: CameraController;
    private boundingBoxRenderer?: BoundingBoxRenderer;
    private resizeObserver?: ResizeObserver;
    private frameId?: number;

    initialize(container: HTMLElement): void
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#020617");

        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 1000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);

        this.cameraController = new CameraController(this.camera, this.renderer);
        this.boundingBoxRenderer = new BoundingBoxRenderer(this.scene);

        this.setBoundingBox({ min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } });
        this.addLights();
        this.addAxis();

        this.resizeObserver = new ResizeObserver(() => { this.resize(container); });
        this.resizeObserver.observe(container);

        this.startRenderLoop();
    }


    setBackgroundColor(color: THREE.Color): void
    {
        if (!this.scene) { return; }
        this.scene.background = color;
    }


    setBoundingBox(bBox: BoundingBox): void
    {
        this.boundingBoxRenderer?.setBoundingBox(bBox);
        this.cameraController?.fitToBoundingBox(bBox);
    }


    setBoundingBoxVisisble(visible: boolean): void
    {
        this.boundingBoxRenderer?.setVisible(visible);
    }


    dispose(): void
    {
        if (this.frameId !== undefined)
        {
            cancelAnimationFrame(this.frameId);
            this.frameId = undefined;
        }

        this.resizeObserver?.disconnect();
        this.boundingBoxRenderer?.dispose();
        this.cameraController?.dispose(); 
        this.renderer?.dispose();

        const canvas = this.renderer?.domElement;
        canvas?.parentElement?.removeChild(canvas);

        this.scene = undefined;
        this.camera = undefined;
        this.renderer = undefined;
    }


    private startRenderLoop(): void
    {
        const render = () =>
        {
            this.frameId = requestAnimationFrame(render);
            if (!this.scene || !this.camera || !this.renderer) { return; }

            this.cameraController?.update();
            this.renderer.render(this.scene, this.camera);
        };

        render();
    }


    private addAxis(): void
    {
        if (!this.scene) { return; }

        const axes = new THREE.AxesHelper(1.25);
        this.scene.add(axes);
    }


    private addLights(): void
    {
        if (!this.scene) { return; }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }


    private resize(container: HTMLElement): void
    {
        if (!this.camera || !this.renderer) { return; }

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) { return; }

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

    }
}