import type {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { ziteApiRequest } from "../shared/transport";

type Field = {
  id: string;
  name: string;
  type: string;
};

export async function getFields(
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
    `/bases/${baseId}/tables/${tableId}/fields`,
  )) as { fields?: Field[] };

  const fields: Field[] = response.fields || [];

  const results: INodeListSearchItems[] = fields
    .filter((field) => !filter || field.name.toLowerCase().includes(filter.toLowerCase()))
    .map((field) => ({
      name: field.name,
      value: field.id,
    }));

  return { results };
}