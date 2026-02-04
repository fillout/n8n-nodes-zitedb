import type {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { ziteApiRequest } from "../shared/transport";

type Base = {
  id: string;
  name: string;
};

export async function getBases(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = (await ziteApiRequest.call(this, "GET", "/bases")) as
    | Base[]
    | { bases?: Base[] };

  const bases: Base[] = Array.isArray(response) ? response : response.bases || [];

  const results: INodeListSearchItems[] = bases
    .filter((base) => !filter || base.name.toLowerCase().includes(filter.toLowerCase()))
    .map((base) => ({
      name: base.name,
      value: base.id,
    }));

  return { results };
}