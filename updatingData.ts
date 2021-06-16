export type Rotation = {
    type: 'rotation',
    targetId: number;
    angularVelocity: number;
    anchor: {
        x: number;
        y: number;
    };
};

export type UpdatingDataList = Array<Rotation>;

export const updatingDataList: UpdatingDataList = [
    {
        type: 'rotation',
        targetId: 1,
        angularVelocity: (2 * Math.PI * 2) / 60 / 10,
        anchor: {
            x: 150,
            y: 150,
        },
    },
];
