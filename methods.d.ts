declare module 'express-object-router/methods' {
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

  declare const methods: Methods;
  
  export default methods;
}
