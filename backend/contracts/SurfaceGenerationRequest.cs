namespace rrm_reborn.contracts;

public sealed record SurfaceGenerationRequest(BoundingBoxDto BoundingBox, string Axix, List<SurfaceGenerationCurveInputDto> Curves);


public sealed record SurfaceGenerationCurveInputDto(string CurveId, string CrosssSectionId, double Depth, List<Vec3Dto> Points3D);