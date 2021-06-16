export type Circle = {
    type: 'circle';
    center: {
        x: number;
        y: number;
    };
    radius: number;
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}

export type Text = {
    type: 'text';
    align: 'left' | 'center' | 'right';
    position: {
        x: number;
        y: number;
    };
    fontSize: number;
    content: string;
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}

export type DataList = Array<Circle | Text>;

export const dataList: DataList = [
    {
        type: "circle",
        center: {
            x: 150,
            y: 150,
        },
        radius: 100,
        color: {
            r: 255,
            g: 0,
            b: 0,
            a: 1,
        },
    },
    {
        type: "text",
        align: 'right',
        fontSize: 10,
        position: {
            x: 250,
            y: 150,
        },
        content: "hello world",
        color: {
            r: 0,
            g: 255,
            b: 0,
            a: 1,
        },
    },
];
