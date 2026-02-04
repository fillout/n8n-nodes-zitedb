import {
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes
} from "n8n-workflow";

export class FriendGrid implements INodeType {
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

        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Record',
                        value: 'record',
                    },
                    {
                        name: 'Table',
                        value: 'table',
                    }
                ],
                default: 'record'
            }
        ],

        async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        }
    }