using rrm_reborn.contracts;
namespace rrm_reborn.services;


public static class SurfaceGenerationService
{
    public static MeshDto GenerateSurfaceMesh()
    {
        const int rows = 40;
        const int cols = 40;

        var vertices = new List<float>();
        var indices = new List<int>();

        BoundingBoxDto boundingBox = new BoundingBoxDto(Min: new Vec3Dto(0, 0, 0.3), Max: new Vec3Dto(1, 1, 0.7));
        var sizeX = boundingBox.Max.X - boundingBox.Min.X;
        var sizeY = boundingBox.Max.Y - boundingBox.Min.Y;
        var sizeZ = boundingBox.Max.Z - boundingBox.Min.Z;

        for (var row = 0; row < rows; row++)
        { 
            var v = (double) row / (rows - 1);

            for (var col = 0; col < cols; col++)
            {
                var u = (double)col / (cols - 1);

                var x = boundingBox.Min.X + u * sizeX;
                var y = boundingBox.Min.Y + v * sizeY;

                var wave1 = Math.Sin(u * Math.PI * 4) * 0.08;
                var wave2 = Math.Cos(v * Math.PI * 3) * 0.06;
                var twist = Math.Sin((u + v) * Math.PI * 2) * 0.04;

                var normalizedZ = 0.5 + wave1 + wave2 + twist;
                var z = boundingBox.Min.Z + normalizedZ  * sizeZ;

                vertices.Add((float)x);
                vertices.Add((float)y);
                vertices.Add((float)z);
            }
        }

        for (var row = 0; row < rows - 1; row++)
        {
            for (var col = 0; col < cols - 1; col++)
            {
                var a = row * cols + col;
                var b = row * cols + col + 1;
                var c = (row + 1) * cols + col;
                var d = (row + 1) * cols + col + 1;

                indices.Add(a);
                indices.Add(c);
                indices.Add(b);

                indices.Add(b);
                indices.Add(c);
                indices.Add(d);
            }
        }

        var bounds = CalculateBounds(vertices);

        return new MeshDto(Id: Guid.NewGuid().ToString(), Vertices: vertices.ToArray(),
            Indices: indices.ToArray(), Normals: null, Bounds: bounds);

    }


    private static BoundingBoxDto CalculateBounds(List<float> vertices)
    {
        if (vertices.Count == 0)
        {
            var zero = new Vec3Dto(0, 0, 0);
            return new BoundingBoxDto(zero, zero);
        }

        var minX = vertices[0];
        var minY = vertices[1];
        var minZ = vertices[2];

        var maxX = vertices[0];
        var maxY = vertices[1];
        var maxZ = vertices[2];

        for (var i = 3; i < vertices.Count; i+=3)
        {
            var x = vertices[i];
            var y = vertices[i + 1];
            var z = vertices[i + 2];

            minX = Math.Min(minX, x);
            minY = Math.Min(minY, y);
            minZ = Math.Min(minZ, z);

            maxX = Math.Max(maxX, x);
            maxY = Math.Max(maxY, y);
            maxZ = Math.Max(maxZ, z);
        }

        return new BoundingBoxDto(Min: new Vec3Dto(minX, minY, minZ), Max: new Vec3Dto(maxX, maxY, maxZ));
    }


    public static MeshDto GenerateTerrainMesh()
    {
        const int rows = 40;
        const int cols = 40;

        const double minX = -1.0;
        const double maxX =  1.0;

        const double minZ = -1.0;
        const double maxZ =  1.0;

        var vertices = new List<float>();
        var indices = new List<int>();

        for (int zIndex = 0; zIndex <= rows; zIndex++)
        {
            double z = minZ + (maxZ - minZ) * zIndex / rows;

            for (int xIndex = 0; xIndex <= cols; xIndex++)
            {
                double x = minX +
                           (maxX - minX) * xIndex / cols;

                double y = CalculateHeight(x, z);

                vertices.Add((float)x);
                vertices.Add((float)y);
                vertices.Add((float)z);
            }
        }


        int verticesPerRow = cols + 1;

        for (int z = 0; z < rows; z++)
        {
            for (int x = 0; x < cols; x++)
            {
                int bottomLeft = z * verticesPerRow + x;
                int bottomRight = bottomLeft + 1;

                int topLeft = (z + 1) * verticesPerRow + x;
                int topRight = topLeft + 1;

                indices.Add(bottomLeft);
                indices.Add(topLeft);
                indices.Add(bottomRight);

                indices.Add(bottomRight);
                indices.Add(topLeft);
                indices.Add(topRight);
            }
        }

        var bounds = CalculateBounds(vertices);

        return new MeshDto(Id: Guid.NewGuid().ToString(), Vertices: vertices.ToArray(),
            Indices: indices.ToArray(), Normals: null, Bounds: bounds);

    }


    private static double CalculateHeight(double x, double z)
    {
        double waves = 0.10 * Math.Sin(x * 5.0) * Math.Cos(z * 4.0);

        double hill1 = 0.45 * Math.Exp(-3.0 *
                (Math.Pow(x + 0.35, 2) + Math.Pow(z - 0.15, 2)));
        double hill2 = 0.25 * Math.Exp(-6.0 *
                (Math.Pow(x - 0.45, 2) + Math.Pow(z + 0.35, 2)));
        double valley = -0.20 * Math.Exp(-8.0 * 
                (Math.Pow(x - 0.05, 2) + Math.Pow(z - 0.45, 2)));
        double slope = 0.08 * x - 0.05 * z;

        double y = waves + hill1 + hill2 + valley + slope;
        return Math.Clamp(y, -1.0, 1.0);
    }
}
