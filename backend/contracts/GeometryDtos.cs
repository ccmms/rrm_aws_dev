namespace rrm_reborn.contracts;

public sealed record Vec3Dto(double X, double Y, double Z);


public sealed record BoundingBoxDto(Vec3Dto Min, Vec3Dto Max);

