import type { INodeProperties } from "n8n-workflow";

const showOnlyForRecordGetByField = {
  operation: ["getByField"],
  resource: ["record"],
};

export const recordGetByFieldDescription: INodeProperties[] = [
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
      show: showOnlyForRecordGetByField,
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
      show: showOnlyForRecordGetByField,
    },
    description: "The table containing the record",
  },
  {
    displayName: "Search Field",
    name: "searchField",
    type: "resourceLocator",
    default: { mode: "list", value: "" },
    required: true,
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "getFields",
          searchable: true,
        },
      },
      {
        displayName: "ID",
        name: "id",
        type: "string",
        placeholder: "e.g. fldAbc123",
      },
    ],
    displayOptions: {
      show: showOnlyForRecordGetByField,
    },
    description: "The field to search by",
  },
  {
    displayName: "Search Value",
    name: "searchValue",
    type: "string",
    default: "",
    required: true,
    displayOptions: {
      show: showOnlyForRecordGetByField,
    },
    placeholder: "e.g. john@example.com",
    description: "The value to search for in the selected field",
  },
];
