import type {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { ziteApiRequest } from "../shared/transport";

type Table = {
  id: string;
  name: string;
};

export async function getTables(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const baseId = this.getCurrentNodeParameter("baseId", { extractValue: true }) as string;

  if (!baseId) {
    return { results: [] };
  }

  const response = (await ziteApiRequest.call(
    this,
    "GET",
    `/bases/${baseId}`,
  )) as { tables?: Table[] };

  const base = response;
  const tables: Table[] = base?.tables || [];

  const results: INodeListSearchItems[] = tables
    .filter((table) => !filter || table.name.toLowerCase().includes(filter.toLowerCase()))
    .map((table) => ({
      name: table.name,
      value: table.id,
    }));

  return { results };
}