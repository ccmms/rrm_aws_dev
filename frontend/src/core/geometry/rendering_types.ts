import type { BoundingBox } from "./geometry_types";

export type MeshData =
    {
        id: string;
        vertices: Float32Array;
        indices?: Uint32Array;
        color: string;
        normals?: Float32Array;
        boundingBox: BoundingBox;
    };