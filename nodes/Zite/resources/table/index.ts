import type {
  INodeProperties,
  IExecuteSingleFunctions,
  INodeExecutionData,
  IDataObject,
} from "n8n-workflow";
import { tableGetAllDescription } from "./getAll";
import { tableGetDescription } from "./get";

const showOnlyForTables = {
  resource: ["table"],
};

export const tableDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForTables,
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many tables",
        description: "Retrieve a list of tables from a base",
        routing: {
          request: {
            method: "GET",
            url: "=/api/v1/bases/{{$parameter.baseId}}",
          },
          output: {
            postReceive: [
              async function (this: IExecuteSingleFunctions, items: INodeExecutionData[]) {
                const baseResponse = items[0]?.json as IDataObject;
                const tables = (baseResponse?.tables as IDataObject[]) || [];

                return tables.map((table) => {
                  return {
                    json: table,
                  };
                });
              },
            ],
          },
        },
      },
      {
        name: "Get",
        value: "get",
        action: "Get table",
        description: "Retrieve a table by ID or name",
        routing: {
          request: {
            method: "GET",
            url: "=/api/v1/bases/{{$parameter.baseId}}",
          },
          output: {
            postReceive: [
              async function (this: IExecuteSingleFunctions, items: INodeExecutionData[]) {
                const baseResponse = items[0]?.json as IDataObject;
                const tables = (baseResponse?.tables as IDataObject[]) || [];
                const tableParam = this.getNodeParameter("tableId") as {
                  mode: string;
                  value: string;
                };

                if (!tableParam || !tableParam.value) {
                  return [];
                }

                let table: IDataObject | undefined;

                // Try to find by ID first
                table = tables.find((t) => t.id === tableParam.value);

                // If not found by ID and mode is "name", try finding by name (case-insensitive partial match)
                if (!table && tableParam.mode === "name") {
                  const searchName = tableParam.value.toLowerCase();
                  table = tables.find((t) => {
                    const name = ((t.name as string) || "").toLowerCase();
                    return name.includes(searchName);
                  });
                }

                if (!table) {
                  return [];
                }

                return [
                  {
                    json: table,
                  },
                ];
              },
            ],
          },
        },
      },
    ],
    default: "getAll",
  },
  ...tableGetAllDescription,
  ...tableGetDescription,
];