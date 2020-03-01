import { getServiceName } from './utilities-path';

export interface IApiEndpointResponse {
  statusCode: number;
  body: string;
  headers: any;
}

export const ApiEndpoint = (successStatusCode: number = 200) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    descriptor.value = wrapApiEndpoint(descriptor.value, successStatusCode);
    return descriptor;
  };
};

function wrapApiEndpoint(method: Function, successStatusCode: number) {  
  return async function (this: Function, ...args: any[]) {
    let serviceName = getServiceName(__filename, __dirname);
    console.log('serviceName', serviceName);
    try {
      let result = await method.call(this, ...args);
      let body: any;
      let statusCode: number;      
      if (result.hasOwnProperty('body')) {
        body = result.body;
      } else {
        body = result;
      }
      if (result.hasOwnProperty('statusCode')) {
        statusCode = result.statusCode;
      } else {
        statusCode = successStatusCode;
      }
     
      return createEndpointResponse(body, statusCode);
    } catch (error) {
      let body: any = error.message;      
      let statusCode = 500;     
      return createEndpointResponse(body, statusCode);
    }
  };
}


function createEndpointResponse (body: any, status: number) {
  let defaultHeaders: any = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Expose-Headers': 'Link,Total-Count'
  };
  
  let response: IApiEndpointResponse = {
    statusCode: status,
    body: JSON.stringify(body),
    headers: defaultHeaders
  };
  return response;
}
