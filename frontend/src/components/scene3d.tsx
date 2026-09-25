import * as THREE from "three";
import type { BoundingBox } from "../core/geometry/geometry_types";
import { BoundingBoxRenderer } from "../rendering/three/overlays/boundingbox_renderer";
import { CameraController } from "../rendering/three/camera/camera_controller";
import type { MeshData } from "../core/geometry/rendering_types";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SurfaceLayer } from "../rendering/three/layers/surface_renderer";


export class Scene3DClass
{
    private scene?: THREE.Scene;
    private camera?: THREE.PerspectiveCamera;
    private renderer?: THREE.WebGLRenderer;
    private cameraController?: CameraController;
    private boundingBoxRenderer?: BoundingBoxRenderer;
    private surfaceLayer?: SurfaceLayer;
    private resizeObserver?: ResizeObserver;
    private frameId?: number;
    private environmentTexture?: THREE.Texture;

    initialize(container: HTMLElement): void
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#020617");

        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 1000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        container.appendChild(this.renderer.domElement);

        this.createEnvironment();

        this.cameraController = new CameraController(this.camera, this.renderer);
        this.boundingBoxRenderer = new BoundingBoxRenderer(this.scene);

        this.setBoundingBox({ min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } });
        this.addLights();
        this.addAxis();

        this.surfaceLayer = new SurfaceLayer(this.scene);

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


    addSurface(mesh: MeshData): void
    {
        this.surfaceLayer?.add(mesh);

    }


    removeSurface(id: string): void
    {
        this.surfaceLayer?.remove(id);

    }


    updateSurfaceRenderer(): SurfaceLayer | undefined
    {
        return this.surfaceLayer?? undefined;
    }


    dispose(): void
    {
        if (this.frameId !== undefined)
        {
            cancelAnimationFrame(this.frameId);
            this.frameId = undefined;
        }

        this.resizeObserver?.disconnect();
        this.surfaceLayer?.dispose();
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

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.4);
        directionalLight.position.set(3.5, 5.0, 2.5);
        directionalLight.target.position.set(0.0, 0.0, 0.0);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);

        directionalLight.shadow.mapSize.set(2048, 2048);

        const shadowCamera = directionalLight.shadow.camera;
        shadowCamera.left = -2.5;
        shadowCamera.right = 2.5;
        shadowCamera.top = 2.5;
        shadowCamera.bottom = -2.5;

        shadowCamera.near = 0.1;
        shadowCamera.far = 15;

        directionalLight.shadow.bias = -0.0002;
        directionalLight.shadow.normalBias = 0.015;

        directionalLight.shadow.radius = 2;

        const fillLight = new THREE.DirectionalLight(0xdce8ff, 0.55);
        fillLight.position.set(-4.0, 2.5, -3.0);
        fillLight.target.position.set(0.0, 0.0, 0.0);

        this.scene.add(fillLight);
        this.scene.add(fillLight.target);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.75);
        fillLight.position.set(-2.5, 3.5, 4.5);
        fillLight.target.position.set(0.0, 0.0, 0.0);

        this.scene.add(rimLight);
        this.scene.add(rimLight.target);
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


    private createEnvironment(): void
    {
        if (!this.renderer || !this.scene)
        {
            return;
        }

        const environment = new RoomEnvironment();

        const pmremGenerator =
            new THREE.PMREMGenerator(this.renderer);

        this.environmentTexture =
            pmremGenerator.fromScene(environment).texture;

        this.scene.environment =
            this.environmentTexture;

        this.scene.environmentIntensity = 0.8;

        environment.dispose();
        pmremGenerator.dispose();
    }
}