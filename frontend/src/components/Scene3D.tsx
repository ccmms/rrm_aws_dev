import * as THREE from "three";
import { CameraController } from "../core/renderer/camera_controller";
import type { BoundingBox } from "../core/geometry/geometry_types";


export class Scene3DClass
{
    private scene?: THREE.Scene;
    private camera?: THREE.PerspectiveCamera;
    private renderer?: THREE.WebGLRenderer;
    private cameraController?: CameraController;
    private boundingBox?: BoundingBox;
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

        this.boundingBox = { min: { x: -10, y: -20, z: -30 }, max: { x: 10, y: 20, z: 30 }};
        this.cameraController = new CameraController(this.camera, this.renderer);
        this.cameraController.fitToBoundingBox(this.boundingBox);

        this.addLights();
        this.addAxis();

        this.startRenderLoop();
    }


    setBackgroundColor(color: THREE.Color): void
    {
        if (!this.scene) { return; }
        this.scene.background = color;
    }


    dispose(): void
    {
        if (this.frameId !== undefined)
        {
            cancelAnimationFrame(this.frameId);
            this.frameId = undefined;
        }

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
}