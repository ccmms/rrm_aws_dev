import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { BoundingBox } from "../geometry/geometry_types";


export class CameraController
{
    private controls: OrbitControls;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly renderer: THREE.WebGLRenderer;

    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer)
    {
        this.camera = camera;
        this.renderer = renderer;

        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.screenSpacePanning = true;
    }


    update(): void { this.controls.update(); }


    fitToBoundingBox(bBox: BoundingBox): void
    {
        const center = new THREE.Vector3(
            (bBox.min.x + bBox.max.x) / 2,
            (bBox.min.y + bBox.max.y) / 2,
            (bBox.min.z + bBox.max.z) / 2);

        const size = new THREE.Vector3(
            bBox.max.x - bBox.min.x,
            bBox.max.y - bBox.min.y,
            bBox.max.z - bBox.min.z);

        const maxSize = Math.max(size.x, size.y, size.z)
        const distance = maxSize * 2.2;

        this.camera.position.set(center.x + distance, center.y + distance, center.z + distance);

        this.camera.near = Math.max(distance / 100, 0.001);
        this.camera.far = distance * 100;
        this.camera.updateProjectionMatrix();

        this.controls.target.copy(center);
        this.controls.update();
    }


    dispose(): void
    {
        this.controls.dispose();
    }
}