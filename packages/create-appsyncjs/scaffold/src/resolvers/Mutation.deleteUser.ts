import { deleteItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx: any) {
  const { id } = ctx.args as { id: string };
  return deleteItem({ key: { pk: id }, returnDeleted: true });
}

export function response(ctx: any) {
  return ctx.result?.attributes ?? null;
}
