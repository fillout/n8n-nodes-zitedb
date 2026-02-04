import type { INodeProperties } from "n8n-workflow";

const showOnlyForRecordCreate = {
  operation: ["create"],
  resource: ["record"],
};

export const recordCreateDescription: INodeProperties[] = [
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
      show: showOnlyForRecordCreate,
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
      show: showOnlyForRecordCreate,
    },
    description: "The table to create a record in",
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
      show: showOnlyForRecordCreate,
    },
    description: 'Record fields as JSON object (e.g., {"Name": "John", "Email": "john@example.com"})',
    routing: {
      send: {
        type: "body",
        property: "record",
        value: "={{JSON.parse($value)}}",
      },
    },
  },
];
