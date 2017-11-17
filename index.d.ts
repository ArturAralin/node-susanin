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

  interface AnyProps {
    [key: string]: any;
  }

  interface MiddlewaresSequenceArgs {
    PARAMS_VALIDATION: symbol,
    QUERY_VALIDATION: symbol,
    BODY_VALIDATION: symbol,
    ROUTER_MIDDLEWARES: symbol,
  }

  type ErrorFn = (error: any) => void;
  type PassFn = () => void;
  type SetToReqFn = (key: string, value: any) => void;

  interface ModernMiddlewareProps {
    req: Request;
    res: Response;
    next: NextFunction;
    headers: AnyProps;
    error: ErrorFn;
    pass: PassFn;
    setToReq: SetToReqFn;
    props: AnyProps;
  }

  type ModernMiddlewareFn = (params: ModernMiddlewareProps) => any;
  type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => any;
  type Middleware = ModernMiddlewareFn | ExpressMiddleware;
  type MiddlewaresSequence = (args: MiddlewaresSequenceArgs) => (symbol | Middleware)[];

  interface ObjectWithJoiValidation {
    [key: string]: Schema;
  }
  interface RouteValidation {
    query?: Schema | ObjectWithJoiValidation;
    params?: Schema | ObjectWithJoiValidation;
    body?: Schema | ObjectWithJoiValidation;
  }

  interface Configuration {
    routesPaths: string[];
    pathsRelateTo: string;
    routePrefix?: string | null;
    extraControllerProps?: string[]; 
    middlewaresSequence?: MiddlewaresSequence;
    onValidationError?: (error: Error) => any;
    onReply?: (data: any) => any;
    defaultValidation?: RouteValidation;
  }

  interface ControllerParams {
    req: Request;
    res: Response;
    next: NextFunction;
    reply(data: any): void;
    error: ErrorFn;
    headers: AnyProps;
    params: AnyProps;
    body: AnyProps;
    query: AnyProps;
    [key: string]: any;
  }

  export interface Route {
    method: symbol;
    path: string;
    controller: (params: ControllerParams) => void | Promise<any>;
    middlewares?: Middleware[];
    validation: RouteValidation;
  }

  export function createRouter (config: Configuration): Router;
}
