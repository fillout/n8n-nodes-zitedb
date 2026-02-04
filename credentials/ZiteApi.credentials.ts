import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class ZiteApi implements ICredentialType {
  name = "ziteApi";
  displayName = "Zite Database API";
  documentationUrl = "https://build.fillout.com/home/settings/developer";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
    },
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "options",
      options: [
        {
          name: "https://tables.fillout.com/api/v1",
          value: "https://tables.fillout.com/api/v1",
        },
        {
          name: "https://eu-tables.fillout.com/api/v1",
          value: "https://eu-tables.fillout.com/api/v1",
        },
      ],
      default: "https://tables.fillout.com/api/v1",
      description: "This may be different if your Zite account data is stored in another region",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: '={{"Bearer " + $credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "={{$credentials?.baseUrl}}",
      url: "/test",
    },
  };
}
