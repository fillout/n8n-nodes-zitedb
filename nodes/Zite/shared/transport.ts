import type {
    IHookFunctions,
    IExecuteFunctions,
    IExecuteSingleFunctions,
    ILoadOptionsFunctions,
    IHttpRequestMethods,
    IDataObject,
    IHttpRequestOptions,
} from 'n8n-workflow';

export async function ziteApiRequest(
    this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject | undefined = undefined,
    qs: IDataObject = {},
): Promise<any> {
    const { baseUrl } = await this.getCredentials("ziteApi");

    const options: IHttpRequestOptions = {
        method,
        url: baseUrl + endpoint,
        body,
        qs,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    return this.helpers.httpRequestWithAuthentication.call(this, 'ziteApi', options);
}

export function transformRecord(record: IDataObject): IDataObject {
    return {
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        ...((record.fields as IDataObject) || {}),
    };
}
