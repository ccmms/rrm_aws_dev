namespace rrm_reborn.contracts;

public sealed record SurfaceGenerationResponse(MeshDto Mesh, string[] Warnings, SurfaceGenerationStats Stats);


public sealed record SurfaceGenerationStats(int VertexCount, int TriangleCount, int GenerationTimeMs, string Source);


public sealed record MeshDto(string Id, float[] Vertices, int[] Indices, float[]? Normals, BoundingBoxDto Bounds);

