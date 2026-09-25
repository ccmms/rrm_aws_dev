import * as THREE from "three";
import type { MeshData } from "../../../core/geometry/rendering_types";


export class SurfaceLayer
{
    private readonly scene = new THREE.Scene;
    private readonly meshes = new Map<string, THREE.Mesh>();

    constructor(scene: THREE.Scene)
    {
        this.scene = scene;
    }


    add(surface: MeshData): void
    {
        if (this.meshes.has(surface.id))
        {
            return;
        }

        const geometry = createGeometry(surface);
        const material = createMaterial(surface);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { id: surface.id, type: "surface" };
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.meshes.set(surface.id, mesh);
        this.scene.add(mesh);
    }


    remove(id: string): void
    {
        const mesh = this.meshes.get(id);
        if (!mesh) { return; }

        this.scene.remove(mesh);

        mesh.geometry.dispose();
        if (Array.isArray(mesh.material))
        {
            mesh.material.forEach(m => m.dispose());
        }
        else
        {
            mesh.material.dispose();        
        }

        this.meshes.delete(id);
    }


    dispose(): void
    {
        for (const id of [...this.meshes.keys()] )
        {
            this.remove(id);
        }
    }

};


function createGeometry(meshData: MeshData): THREE.BufferGeometry
{
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(meshData.vertices, 3));

    if (meshData.indices)
    {
        geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
    }

    if (meshData.normals)
    {
        geometry.setAttribute("normal", new THREE.BufferAttribute(meshData.normals, 3));
    }
    else
    {
        geometry.computeVertexNormals();
    }

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return geometry;
}


function createMaterial(meshData: MeshData): THREE.MeshStandardMaterial
{
    return new THREE.MeshStandardMaterial(
        {
            color: meshData.color,
            opacity: 1.0,
            transparent: false,
            side: THREE.DoubleSide,
            roughness: 0.72,
            metalness: 0.0,
            flatShading: false,
            dithering: true
        });
}
