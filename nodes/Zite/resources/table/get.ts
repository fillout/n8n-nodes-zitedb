import type { INodeProperties } from "n8n-workflow";

const showOnlyForTableGet = {
  operation: ["get"],
  resource: ["table"],
};

export const tableGetDescription: INodeProperties[] = [
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
    displayOptions: {
      show: showOnlyForTableGet,
    },
    description: "The base containing the table",
  },
  {
    displayName: "Table",
    name: "tableId",
    type: "resourceLocator",
    default: { mode: "list", value: "" },
    required: true,
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
      {
        displayName: "Name",
        name: "name",
        type: "string",
        placeholder: "e.g. Users",
      },
    ],
    displayOptions: {
      show: showOnlyForTableGet,
    },
    description: "The table to get",
  },
];
