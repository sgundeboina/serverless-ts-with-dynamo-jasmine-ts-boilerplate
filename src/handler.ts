import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import { Context } from 'aws-lambda';
import { ApiEndpoint } from '../shared/api-endpoint.decorator';
import { getServiceName } from '../shared/utilities-path';

export const hello = async (event: any, context: Context) => {

  let serviceName = getServiceName(__filename, __dirname, hello.name);
  console.log('serviceName', serviceName);

  const helloHandlerInstance = container.resolve(HelloHandler);
  return helloHandlerInstance.handle(event);
};

@singleton()
export class HelloHandler {
  constructor() { }

  @ApiEndpoint()
  handle(event: any) {    
    return 'Hello World!';
  }
}