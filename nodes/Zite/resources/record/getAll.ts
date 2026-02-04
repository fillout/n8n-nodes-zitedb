import type { INodeProperties } from "n8n-workflow";

const showOnlyForRecordGetAll = {
  operation: ["getAll"],
  resource: ["record"],
};

export const recordGetAllDescription: INodeProperties[] = [
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
      show: showOnlyForRecordGetAll,
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
    ],
    displayOptions: {
      show: showOnlyForRecordGetAll,
    },
    description: "The table to get records from",
  },
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    displayOptions: {
      show: showOnlyForRecordGetAll,
    },
    default: false,
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: showOnlyForRecordGetAll,
      hide: {
        returnAll: [true],
      },
    },
    default: 50,
    description: "Max number of results to return",
    routing: {
      send: {
        type: "query",
        property: "limit",
      },
    },
  },
];
