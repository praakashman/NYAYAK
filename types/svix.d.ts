// Type definitions for svix 1.0
declare module "svix" {
  export type VerifyHeaders = { [key: string]: string };

  export class Webhook {
    constructor(secret?: string);
    verify(payload: string, headers?: VerifyHeaders): any;
  }
}
