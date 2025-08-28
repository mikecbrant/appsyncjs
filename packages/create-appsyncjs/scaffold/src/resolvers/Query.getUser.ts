import { getItem } from '@mikecbrant/appsyncjs-dynamo';
import type { AppSyncIdentity, AppSyncResolverEvent } from '@aws-appsync/utils';

export function request(ctx: any) {
  const { id } = ctx.args as { id: string };
  return getItem({ key: { pk: id } });
}

export function response(ctx: any) {
  return ctx.result;
}
