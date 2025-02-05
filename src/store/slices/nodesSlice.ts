import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {resetState} from "../actions";
import cloneDeep from "lodash/cloneDeep";

interface NodeData {
    id: string;
    position: { x: number; y: number };
    data: {
        label: string;
        color: string;
        fontSize: number | string;
    };
}

interface NodesState {
    nodes: NodeData[];
}

const initialState: NodesState = {
    nodes: [
        {
            id: '1',
            position: { x: 330.8293230129311, y: 50 },
            data: {
                label: 'Node 1',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '2',
            position: { x: 150, y: 150 },
            data: {
                label: 'Node 2',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '3',
            position: { x: 488.27088374019036, y: 150 },
            data: {
                label: 'Node 3',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '4',
            position: { x: 45.214843749999986, y: 242.7490234375 },
            data: {
                label: 'Node 4',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '5',
            position: { x: 239.99237114528836, y: 240.72311104466405 },
            data: {
                label: 'Node 5',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '6',
            position: { x: 407.2843925008175, y: 240.43227906495247 },
            data: {
                label: 'Node 6',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '7',
            position: { x: 612.0306320909631, y: 239.91744698216405 },
            data: {
                label: 'Node 7',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '8',
            position: { x: -2.3193359374999982, y: 354.833984375 },
            data: {
                label: 'Node 8',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '9',
            position: { x: 180, y: 350 },
            data: {
                label: 'Node 9',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
        {
            id: '10',
            position: { x: 323.1187700777352, y: 421.2263669609099 },
            data: {
                label: 'Node 10',
                color: '#FFFFFF',
                fontSize: 14,
            },
        },
    ],
};

const nodesSlice = createSlice({
    name: "nodes",
    initialState,
    reducers: {
        setNodes(state, action: PayloadAction<NodeData[]>) {
            state.nodes = cloneDeep(action.payload);
        },
        updateNode(state, action: PayloadAction<{ id: string; label?: string; color?: string; fontSize?: number }>) {
            const { id, label, color, fontSize } = action.payload;
            const node = state.nodes.find((n) => n.id === id);
            if (node) {
                if (label !== undefined) node.data.label = label;
                if (color !== undefined) node.data.color = color;
                if (fontSize !== undefined) node.data.fontSize = fontSize;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(resetState, () => initialState);
    },
});

export const { setNodes, updateNode } = nodesSlice.actions;
export default nodesSlice.reducer;
