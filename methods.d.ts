declare module 'node-susanin/methods' {
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

  const methods: Methods;
  
  export default methods;
}
