import type { INodeProperties } from "n8n-workflow";

const showOnlyForTableGetAll = {
  operation: ["getAll"],
  resource: ["table"],
};

export const tableGetAllDescription: INodeProperties[] = [
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
      show: showOnlyForTableGetAll,
    },
    description: "The base to get tables from",
  },
];
