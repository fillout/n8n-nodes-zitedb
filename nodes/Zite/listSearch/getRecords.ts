import type {
  IDataObject,
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { ziteApiRequest } from "../shared/transport";

type ZiteRecord = {
  id: string;
  fields?: Record<string, IDataObject | string | number | boolean | null>;
};

export async function getRecords(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const baseId = this.getCurrentNodeParameter("baseId", { extractValue: true }) as string;
  const tableId = this.getCurrentNodeParameter("tableId", { extractValue: true }) as string;

  if (!baseId || !tableId) {
    return { results: [] };
  }

  const response = (await ziteApiRequest.call(
    this,
    "GET",
    `/bases/${baseId}/tables/${tableId}/records`,
    undefined,
    {
      limit: 100,
    },
  )) as { records?: ZiteRecord[] };

  const records: ZiteRecord[] = response.records || [];

  const results: INodeListSearchItems[] = records.map((record) => {
    // Get first field value as label, or use ID
    const firstFieldValue = record.fields ? Object.values(record.fields)[0] : null;
    const label = typeof firstFieldValue === "string" ? firstFieldValue : record.id;

    return {
      name: label,
      value: record.id,
    };
  });

  return { results };
}