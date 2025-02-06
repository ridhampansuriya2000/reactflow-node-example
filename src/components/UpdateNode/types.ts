export interface NodeData {
    id: string;
    position: { x: number; y: number };
    data: {
        label: string;
        color: string;
        fontSize: number | string;
    };
    style?: {
        backgroundColor?: string;
        fontSize?: number | string;
    };
}