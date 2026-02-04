import type { INodeProperties } from "n8n-workflow";

const showOnlyForRecordUpdate = {
  operation: ["update"],
  resource: ["record"],
};

export const recordUpdateDescription: INodeProperties[] = [
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
      show: showOnlyForRecordUpdate,
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
      show: showOnlyForRecordUpdate,
    },
    description: "The table containing the record",
  },
  {
    displayName: "Record",
    name: "recordId",
    type: "resourceLocator",
    default: { mode: "list", value: "" },
    required: true,
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "getRecords",
          searchable: true,
        },
      },
      {
        displayName: "ID",
        name: "id",
        type: "string",
        placeholder: "e.g. recAbc123",
      },
    ],
    displayOptions: {
      show: showOnlyForRecordUpdate,
    },
    description: "The record to update",
  },
  {
    displayName: "Fields",
    name: "fields",
    type: "json",
    typeOptions: {
      alwaysOpenEditWindow: true,
    },
    default: "{}",
    displayOptions: {
      show: showOnlyForRecordUpdate,
    },
    description: 'Record fields to update as JSON object (e.g., {"Name": "Jane", "Email": "jane@example.com"})',
    routing: {
      send: {
        type: "body",
        property: "record",
        value: "={{JSON.parse($value)}}",
      },
    },
  },
];
