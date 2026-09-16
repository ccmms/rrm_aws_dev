import * as THREE from "three";
import type { BoundingBox } from "../geometry/geometry_types";

export class BoundingBoxRenderer
{
    private bHelper?: THREE.Box3Helper;
    private readonly scene: THREE.Scene;

    constructor(scene: THREE.Scene) { this.scene = scene; }


    setBoundingBox(bBox: BoundingBox): void
    {
        this.dispose();

        const threeBox = new THREE.Box3(
            new THREE.Vector3(bBox.min.x, bBox.min.y, bBox.min.z),
            new THREE.Vector3(bBox.max.x, bBox.max.y, bBox.max.z));

        this.bHelper = new THREE.Box3Helper(threeBox, 0x38bdf8);
        this.scene.add(this.bHelper);
    }


    setVisible(visible: boolean): void
    {
        if (this.bHelper)
        {
            this.bHelper.visible = visible;
        }
    }


    dispose(): void
    {
        if (!this.bHelper) { return; }

        this.scene.remove(this.bHelper);

        this.bHelper.geometry.dispose();
        if (!Array.isArray(this.bHelper.material))
        {
            this.bHelper.material.dispose();
        }

        this.bHelper = undefined;
    }
}