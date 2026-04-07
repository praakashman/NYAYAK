declare module "svix" {
  export type VerifyHeaders = { [key: string]: string };

  export class Webhook {
    constructor(secret?: string);
    verify(payload: string, headers?: VerifyHeaders): any;
  }
}
