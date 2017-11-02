declare module 'express-object-router' {
  import {
    Router,
    Request,
    Response,
    NextFunction,
  } from 'express';

  import {
    Schema,
  } from 'joi';

  interface Methods {
    GET: symbol;
    PUT: symbol;
    POST: symbol;
    DELETE: symbol;
    HEAD: symbol;
    CONNECT: symbol;
    OPTIONS: symbol;
    TRACE: symbol;
    PATCH: symbol;
  }

  interface MiddlewaresSequenceArgs {
    PARAMS_VALIDATION: symbol,
    QUERY_VALIDATION: symbol,
    BODY_VALIDATION: symbol,
    ROUTER_MIDDLEWARES: symbol,
  }

  type Middleware = (req: Request, res: Response, next: NextFunction) => any;
  type MiddlewaresSequence = (args: MiddlewaresSequenceArgs) => (symbol | Middleware)[];

  interface Configuration {
    routesPath: string;
    routePrefix?: string | null;
    extraControllerProps?: string[]; 
    middlewaresSequence?: MiddlewaresSequence;
    onValidationError?: (error: Error) => any;
    onReply?: (data: any) => any;
  }

  interface ControllerParams {
    reply(data: any): void;
    error: NextFunction;
    headers: { [key: string]: string };
    params: { [key: string]: string };
    body: { [key: string]: string };
    query: { [key: string]: string };
    [key: string]: any;
  }

  interface RouteValidation {
    query?: Schema;
    params?: Schema;
    body?: Schema;
  }
  export interface Route {
    method: symbol;
    path: string;
    controller: (params: ControllerParams) => void | Promise<any>;
    middlewares?: Middleware[];
    validation: RouteValidation;
  }

  export function createRoute (config: Configuration): Router;
  export const methods: Methods;
}
