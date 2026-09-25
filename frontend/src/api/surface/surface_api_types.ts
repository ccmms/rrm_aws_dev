import type { BoundingBox } from "../../core/geometry/geometry_types";

export type ApiMeshDto = 
{
    id: string;
    vertices: number[];
    indices: [],
    normals?: number[] | null;
    bounds: BoundingBox;
};


export type ApiSurfaceGenerationStats = 
{
    vertexCount: number;
    triangleCount: number;
    generationTimeMs: number;
    source: string;
};      


export type ApiSurfaceGenerationResponse = 
{
    mesh: ApiMeshDto;
    warnings: string[];
    stats: ApiSurfaceGenerationStats;
};      