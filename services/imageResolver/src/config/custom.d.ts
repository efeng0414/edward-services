declare type mixed = {} | string | number | boolean | undefined | null;

declare module "url-exists-deep";
declare namespace Express {
  export interface Request {
    role?: string;
    firebaseUserId?: string;
    pgSettings?: {
      [key: string]: mixed;
    };
  }
}
