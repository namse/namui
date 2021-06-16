export type Circle = {
    type: 'circle';
    center: {
        x: number;
        y: number;
    };
    radius: number;
}

export type DataList = Array<Circle>;

export const dataList: DataList = [
    {
        type: "circle",
        center: {
            x: 50,
            y: 50,
        },
        radius: 20,
    },
];
