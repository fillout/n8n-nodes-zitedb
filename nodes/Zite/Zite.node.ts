import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes
} from "n8n-workflow";
import { tableDescription } from "./resources/table";
import { recordDescription } from "./resources/record";
import { getBases } from "./listSearch/getBases";
import { getTables } from "./listSearch/getTables";
import { getFields } from "./listSearch/getFields";
import { getRecords } from "./listSearch/getRecords";

export class Zite implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Zite Database",
        name: "zite",
        icon: "file:zite-icon.svg",
        group: ["transform"],
        version: 1,
        description: "Interact with databases in Zite",
        defaults: {
            name: "Zite Database"
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: "ziteApi",
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: "={{$credentials?.baseUrl}}",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
        properties: [
            {
                displayName: "Resource",
                name: "resource",
                type: "options",
                noDataExpression: true,
                options: [
                    {
                        name: "Record",
                        value: "record",
                    },
                    {
                        name: "Table",
                        value: "table",
                    }
                ],
                default: "record"
            },
            ...tableDescription,
            ...recordDescription,
        ],
    }

    methods = {
        listSearch: {
            getBases,
            getTables,
            getFields,
            getRecords,
        },
    }
}
