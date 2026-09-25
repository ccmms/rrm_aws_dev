import { callAPI } from "../../auth";
import type { MeshData } from "../../core/geometry/rendering_types";
import type { ApiMeshDto, ApiSurfaceGenerationResponse } from "./surface_api_types";

export async function generateSurface() : Promise<MeshData>
{
    const response = await callAPI<ApiSurfaceGenerationResponse>("generate", "POST");
    return mapApiMeshToMeshData(response.mesh);
}


function mapApiMeshToMeshData(apiMesh: ApiMeshDto): MeshData
{
    return {

        id: apiMesh.id,
        vertices: new Float32Array(apiMesh.vertices),
        indices: new Uint32Array(apiMesh.indices),
        normals: apiMesh.normals ? new Float32Array(apiMesh.normals) 
            : undefined,
        color: "#2563eb",
        boundingBox: apiMesh.bounds
    };
}