import type {
  INodeProperties,
  IExecuteSingleFunctions,
  INodeExecutionData,
  IDataObject,
  IHttpRequestOptions,
} from "n8n-workflow";
import { ziteApiRequest } from "../../shared/transport";
import { recordGetAllDescription } from "./getAll";
import { recordGetByIdDescription } from "./getById";
import { recordGetByFieldDescription } from "./getByField";
import { recordCreateDescription } from "./create";
import { recordUpdateDescription } from "./update";
import { recordDeleteDescription } from "./delete";

const showOnlyForRecords = {
  resource: ["record"],
};

export const recordDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForRecords,
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many records",
        description: "Retrieve a list of records from a table",
        routing: {
          request: {
            method: "GET",
            url: "=/bases/{{$parameter.baseId}}/tables/{{$parameter.tableId}}/records",
          },
          output: {
            postReceive: [
              async function (this: IExecuteSingleFunctions, items: INodeExecutionData[]) {
                const recordsResponse = items[0]?.json as IDataObject;
                const records = (recordsResponse?.records as IDataObject[]) || [];

                return records.map((record) => {
                  // Flatten fields to top level (using field names as keys)
                  return {
                    json: {
                      id: record.id,
                      createdAt: record.createdAt,
                      updatedAt: record.updatedAt,
                      ...((record.fields as IDataObject) || {}),
                    },
                  };
                });
              },
            ],
          },
        },
      },
      {
        name: "Get by ID",
        value: "getById",
        action: "Get record by ID",
        description: "Retrieve a record from a table",
        routing: {
          request: {
            method: "GET",
            url: "=/bases/{{$parameter.baseId}}/tables/{{$parameter.tableId}}/records/{{$parameter.recordId}}",
          },
          output: {
            postReceive: [
              async function (this: IExecuteSingleFunctions, items: INodeExecutionData[]) {
                // Transform each item in the response
                return items.map((item) => {
                  const record = item.json as IDataObject;
                  // Flatten fields to top level (using field names as keys)
                  return {
                    json: {
                      id: record.id,
                      createdAt: record.createdAt,
                      updatedAt: record.updatedAt,
                      ...((record.fields as IDataObject) || {}),
                    },
                  };
                });
              },
            ],
          },
        },
      },
      {
        name: "Get by Field",
        value: "getByField",
        action: "Get record by field value",
        description: "Retrieve a record by searching a field value",
        routing: {
          request: {
            method: "GET",
            url: "=/bases/{{$parameter.baseId}}/tables/{{$parameter.tableId}}/records",
            qs: {
              limit: 1,
            },
          },
          send: {
            preSend: [
              async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
                const searchField = this.getNodeParameter("searchField") as { value: string };
                const searchValue = this.getNodeParameter("searchValue") as string;
                const baseId = this.getNodeParameter("baseId") as { value: string };
                const tableId = this.getNodeParameter("tableId") as { value: string };

                // Fetch fields to get field name from field ID
                const fieldsResponse = await ziteApiRequest.call(
                  this,
                  "GET",
                  `/bases/${baseId.value}/tables/${tableId.value}/fields`,
                );
                const fields = (fieldsResponse?.fields as IDataObject[]) || [];
                const field = fields.find((f) => f.id === searchField.value);

                if (!field) {
                  throw new Error(
                    `Field specified in "Search Field" parameter could not be found. Check that the field ID is correct and exists in the selected table.`,
                  );
                }

                const fieldName = field.name as string;

                // Construct filter
                const filters = {
                  [fieldName]: searchValue,
                };

                // Add filter to query string
                if (!requestOptions.qs) {
                  requestOptions.qs = {};
                }
                requestOptions.qs.filters = JSON.stringify(filters);

                return requestOptions;
              },
            ],
          },
          output: {
            postReceive: [
              async function (this: IExecuteSingleFunctions, items: INodeExecutionData[]) {
                const recordsResponse = items[0]?.json as IDataObject;
                const records = (recordsResponse?.records as IDataObject[]) || [];

                // Return first record (limit is 1) with flattened fields
                return records.map((record) => {
                  return {
                    json: {
                      id: record.id,
                      createdAt: record.createdAt,
                      updatedAt: record.updatedAt,
                      ...((record.fields as IDataObject) || {}),
                    },
                  };
                });
              },
            ],
          },
        },
      },
      {
        name: "Create",
        value: "create",
        action: "Create record",
        description: "Create a new record",
        routing: {
          request: {
            method: "POST",
            url: "=/bases/{{$parameter.baseId}}/tables/{{$parameter.tableId}}/records",
          },
        },
      },
      {
        name: "Update",
        value: "update",
        action: "Update record",
        description: "Update an existing record",
        routing: {
          request: {
            method: "PATCH",
            url: "=/bases/{{$parameter.baseId}}/tables/{{$parameter.tableId}}/records/{{$parameter.recordId}}",
          },
        },
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete record",
        description: "Delete a record permanently",
        routing: {
          request: {
            method: "DELETE",
            url: "=/bases/{{$parameter.baseId}}/tables/{{$parameter.tableId}}/records/{{$parameter.recordId}}",
          },
        },
      },
    ],
    default: "getAll",
  },
  ...recordGetAllDescription,
  ...recordGetByIdDescription,
  ...recordGetByFieldDescription,
  ...recordCreateDescription,
  ...recordUpdateDescription,
  ...recordDeleteDescription,
];
