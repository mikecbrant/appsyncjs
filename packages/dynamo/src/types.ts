export type DynamoKey = Record<string, DynamoKeyField>;

// DynamoDB primary and secondary index keys must be
// string, number, or base64-encoding binary data
// we treat base64 as string for typing
export type DynamoKeyField = string | number;
