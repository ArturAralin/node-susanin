declare module 'express-object-router' {
  import {
    Router,
    Request,
    Response,
    NextFunction
  } from 'express';

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
    routePrefix: string | null;
    routesPath: string;
    middlewaresSequence: MiddlewaresSequence;
    onValidationError: (error: Error) => any;
    onReply: (data: any) => any;
  }

  export function createRoute (config: Configuration): Router;
  export const methods: Methods;
}
