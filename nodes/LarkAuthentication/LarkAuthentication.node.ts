import {
	IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
	NodeConnectionType
} from 'n8n-workflow';


export class LarkAuthentication implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Lark Authentication',
    name: 'larkAuthentication',
    group: ['transform'],
    version: 1,
    description: 'Get Custom app Tenant access token from Lark API',
    defaults: {
      name: 'Lark Authentication',
    },
    inputs: ['main'],
    outputs: ['main'],
		credentials: [],
    properties: [
      {
        displayName: 'App ID',
        name: 'app_id',
        type: 'string',
        default: '',
        placeholder: 'Enter your App ID',
        description: 'The Custom App ID for authentication (Example: cli_slkdjalasdkjasd)',
      },
      {
        displayName: 'App Secret',
        name: 'app_secret',
        type: 'string',
        default: '',
        placeholder: 'Enter your App Secret',
        description: 'The Custom App Secret for authentication (Example: dskLLdkasdjlasdKK)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // Get parameters
        const appId = this.getNodeParameter('app_id', i) as string;
        const appSecret = this.getNodeParameter('app_secret', i) as string;

        // Prepare request payload
        const body = {
          app_id: appId,
          app_secret: appSecret,
        };

        // Make HTTP POST request to Lark API
        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: 'https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal',
          body,
          json: true, // Automatically stringifies and parses JSON
        });

        // Push the response to return data
        returnData.push({ json: response });
      } catch (error) {
        // Handle errors and push them as NodeApiError
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw new NodeApiError(this.getNode(), error);
      }
    }

    return [returnData];
  }
}
