export type Vec2 =
    {
        x: number;
        y: number;
    };


export type Vec3 =
    {
        x: number;
        y: number;
        z: number;
    };


export type BoundingBox =
    {
        min: Vec3;
        max: Vec3;
    };


export type Curve2D =
    {
        id: string;
        points2D: Vec2;
        color: string;
        visible: boolean;
        selected: boolean;
    };


export type Surface =
    {
        id: string;
        color: string;
        opacity: number;
        visible: boolean;
        selected: boolean;
    };