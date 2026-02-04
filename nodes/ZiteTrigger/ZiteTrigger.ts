import {
    IWebhookFunctions,
    IHookFunctions,
    IDataObject,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    NodeConnectionTypes
} from "n8n-workflow";
import { ziteApiRequest } from "../Zite/shared/transport";
import { transformRecord } from "../Zite/shared/transport";
import { getBases } from "../Zite/listSearch/getBases";
import { getTables } from "../Zite/listSearch/getTables";
import { getFields } from "../Zite/listSearch/getFields";
import { getRecords } from "../Zite/listSearch/getRecords";

export class ZiteTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Zite Trigger",
        name: "ziteTrigger",
        icon: "file:zitelogo.png",
        group: ["trigger"],
        version: 1,
        description: "Triggers when events occur in Zite (records, tables, or fields)",
        defaults: {
            name: "Zite Trigger",
        },
        inputs: [],
        outputs: [NodeConnectionTypes.Main],
        webhooks: [
            {
                name: "default",
                httpMethod: "POST",
                responseMode: "onReceived",
                path: "zite-trigger",
            },
        ],
        properties: [
            {
                displayName: "Event Type",
                name: "eventType",
                type: "options",
                required: true,
                options: [
                    {
                        name: "New Record",
                        value: "record.created",
                    },
                    {
                        name: "Updated Record",
                        value: "record.updated",
                    },
                    {
                        name: "Deleted Record",
                        value: "record.deleted",
                    },
                    {
                        name: "New Table",
                        value: "table.created",
                    },
                    {
                        name: "Updated Table",
                        value: "table.updated",
                    },
                    {
                        name: "Deleted Table",
                        value: "table.deleted",
                    },
                    {
                        name: "New Field",
                        value: "field.created",
                    },
                    {
                        name: "Updated Field",
                        value: "field.updated",
                    },
                    {
                        name: "Deleted Field",
                        value: "field.deleted",
                    },
                ],
                default: "record.created",
                description: "The type of event to listen for",
            },
            {
                displayName: "Base",
                name: "baseId",
                type: "resourceLocator",
                default: { mode: "list", value: "" },
                required: true,
                modes: [
                    {
                        displayName: "From List",
                        name: "list",
                        type: "list",
                        typeOptions: {
                            searchListMethod: "getBases",
                        },
                    },
                    {
                        displayName: "ID",
                        name: "id",
                        type: "string",
                        placeholder: "e.g. baseAbc123",
                    },
                ],
                description: "The base to watch for events",
            },
            {
                displayName: "Table",
                name: "tableId",
                type: "resourceLocator",
                default: { mode: "list", value: "" },
                required: false,
                displayOptions: {
                    show: {
                        eventType: [
                            "record.created",
                            "record.updated",
                            "record.deleted",
                            "field.created",
                            "field.updated",
                            "field.deleted",
                        ],
                    },
                },
                modes: [
                    {
                        displayName: "From List",
                        name: "list",
                        type: "list",
                        typeOptions: {
                            searchListMethod: "getTables",
                            searchable: true,
                        },
                    },
                    {
                        displayName: "ID",
                        name: "id",
                        type: "string",
                        placeholder: "e.g. tblAbc123",
                    },
                ],
                description: "The table to watch for events (required for record and field events)",
            },
        ],
        credentials: [{ name: "ziteApi", required: true }],
    };

    methods = {
        listSearch: {
            getBases,
            getTables,
            getFields,
            getRecords,
        },
    };

    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData("node");
                const webhookId = webhookData.webhookId as string | undefined;
                return !!webhookId;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl("default");
                const baseId = this.getNodeParameter("baseId") as { value: string };
                const eventType = this.getNodeParameter("eventType") as string;

                if (!webhookUrl) {
                    throw new Error(
                        "Webhook URL could not be generated. Ensure the workflow is saved and activated, then try again.",
                    );
                }

                const body: IDataObject = {
                    events: [eventType],
                    url: webhookUrl,
                    source: "n8n",
                    baseId: baseId.value,
                };

                // Add tableId for record and field events
                if (eventType.startsWith("record.") || eventType.startsWith("field.")) {
                    const tableId = this.getNodeParameter("tableId") as { value: string };
                    body.tableId = tableId.value;
                }

                const response = (await ziteApiRequest.call(
                    this,
                    "POST",
                    `/api/v1/bases/${baseId.value}/webhooks`,
                    body,
                )) as IDataObject;

                // Handle different possible response structures
                const webhookId =
                    (response.id as string | undefined) ||
                    ((response.data as IDataObject | undefined)?.id as string | undefined);

                if (!webhookId) {
                    throw new Error(
                        `Webhook could not be created. The API response did not include a webhook ID. Check your API credentials and base ID, then try again.`,
                    );
                }

                const webhookData = this.getWorkflowStaticData("node");
                webhookData.webhookId = webhookId;
                webhookData.eventType = eventType;

                return true;
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData("node");
                const webhookId = webhookData.webhookId as string | undefined;

                if (!webhookId) {
                    return true;
                }

                const baseId = this.getNodeParameter("baseId") as { value: string };

                try {
                    await ziteApiRequest.call(
                        this,
                        "DELETE",
                        `/api/v1/bases/${baseId.value}/webhooks/${webhookId}`,
                    );
                } catch (error) {
                    return false;
                }

                delete webhookData.webhookId;
                delete webhookData.eventType;
                return true;
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const req = this.getRequestObject();
        const body = req.body as IDataObject;
        const webhookData = this.getWorkflowStaticData("node");
        const eventType = (webhookData.eventType as string) || "record.created";

        let returnData: IDataObject[] = [];

        if (eventType.startsWith("record.")) {
            if (eventType === "record.deleted") {
                const recordIds = ((body.data as IDataObject)?.recordIds as string[]) || [];
                const timestamp = body.timestamp as string;
                returnData = recordIds.map((id) => ({
                    id,
                    deletedAt: timestamp,
                    tableId: (body.data as IDataObject)?.tableId,
                }));
            } else {
                const records = ((body.data as IDataObject)?.records as IDataObject[]) || [];
                returnData = records.map((record) => transformRecord(record));
            }
        } else if (eventType.startsWith("table.")) {
            if (eventType === "table.deleted") {
                const tableId = (body.data as IDataObject)?.tableId as string;
                const timestamp = body.timestamp as string;
                if (tableId) {
                    returnData = [
                        {
                            id: tableId,
                            deletedAt: timestamp,
                        },
                    ];
                }
            } else {
                const table = (body.data as IDataObject)?.table as IDataObject;
                if (table) {
                    returnData = [
                        {
                            id: table.id,
                            name: table.name,
                        },
                    ];
                }
            }
        } else if (eventType.startsWith("field.")) {
            if (eventType === "field.deleted") {
                const fieldId = (body.data as IDataObject)?.fieldId as string;
                const tableId = (body.data as IDataObject)?.tableId as string;
                const timestamp = body.timestamp as string;
                if (fieldId) {
                    returnData = [
                        {
                            id: fieldId,
                            tableId,
                            deletedAt: timestamp,
                        },
                    ];
                }
            } else if (eventType === "field.updated") {
                const field = (body.data as IDataObject)?.field as IDataObject;
                const previousField = (body.data as IDataObject)?.previousField as IDataObject;
                if (field) {
                    returnData = [
                        {
                            id: field.id,
                            name: field.name,
                            type: field.type,
                            previousName: previousField?.name,
                            previousType: previousField?.type,
                            tableId: (body.data as IDataObject)?.tableId,
                            updatedAt: body.timestamp,
                        },
                    ];
                }
            } else {
                const field = (body.data as IDataObject)?.field as IDataObject;
                if (field) {
                    returnData = [
                        {
                            id: field.id,
                            name: field.name,
                            type: field.type,
                            tableId: (body.data as IDataObject)?.tableId,
                            createdAt: body.timestamp,
                        },
                    ];
                }
            }
        }

        return {
            workflowData: [this.helpers.returnJsonArray(returnData)],
        };
    }
}
