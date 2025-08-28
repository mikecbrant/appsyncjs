import { putItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx: any) {
  const { input } = ctx.args as { input: { id: string; email: string; name: string } };
  const { id, email, name } = input;
  const now = new Date().toISOString();
  return putItem({
    key: { pk: id },
    item: { id, email, name, createdAt: now, updatedAt: now },
  });
}

export function response(ctx: any) {
  // Return the input as a convenience; DynamoDB PutItem without ReturnValues doesn't return the item
  return { ...ctx.args.input };
}
