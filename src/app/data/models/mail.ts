export interface IMail {
  mailto: string;
  cc?: Array<string>;
  bcc?: Array<string>;
  subject?: string;
  body: string;
}
