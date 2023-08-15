import { SetMetadata } from '@nestjs/common';

export const ACCOUNT_KEY = 'accounts';

export const Accounts = (...accounts: string[]) =>
  SetMetadata(ACCOUNT_KEY, accounts);
