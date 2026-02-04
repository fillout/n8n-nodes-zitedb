import type { INodeProperties } from "n8n-workflow";

const showOnlyForRecordGetById = {
  operation: ["getById"],
  resource: ["record"],
};

export const recordGetByIdDescription: INodeProperties[] = [
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
      show: showOnlyForRecordGetById,
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
      show: showOnlyForRecordGetById,
    },
    description: "The table containing the record",
  },
  {
    displayName: "Record ID",
    name: "recordId",
    type: "string",
    default: "",
    required: true,
    displayOptions: {
      show: showOnlyForRecordGetById,
    },
    placeholder: "e.g. recAbc123",
    description: "The ID of the record to retrieve",
  },
];
