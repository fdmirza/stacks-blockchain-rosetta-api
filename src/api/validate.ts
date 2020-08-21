import * as Ajv from 'ajv';
import * as RefParser from '@apidevtools/json-schema-ref-parser';
import { logger } from '../helpers';

export async function validate(schemaFilePath: string, data: any) {
  if (process.env.NODE_ENV !== 'development') return;

  const schemaDef = await RefParser.dereference(schemaFilePath);
  const ajv = new Ajv({ schemaId: 'auto' });
  const valid = await ajv.validate(schemaDef, data);
  if (!valid) {
    logger.warn(`Schema validation:\n\n ${JSON.stringify(ajv.errors, null, 2)}`);
  }
}

export async function validateRequest(endPoint: string, data: any) {
  const base_path = '@blockstack/stacks-blockchain-api-types/api/';
  let schema: string = '';
  console.log("validateRequest", endPoint, data)
  switch (endPoint) {
    case '/rosetta/v1/network/list':
      schema = 'rosetta-network/rosetta-network-list-request.schema.json';
      break;
    case '/rosetta/v1/network/options':
      schema = 'rosetta-network/rosetta-network-options-request.schema.json';
      break;
    case '/rosetta/v1/network/status':
      schema = 'rosetta-network/rosetta-network-status-request.schema.json';
      break;
    default:
      return { valid: true }
  }
  console.log(base_path + schema)
  const schemaPath = require.resolve(base_path + schema);
  const schemaDef = await RefParser.dereference(schemaPath);
  const ajv = new Ajv({ schemaId: 'auto' });
  const isValid = await ajv.validate(schemaDef, data);

  if (!isValid) {
    return { valid: isValid, error: ajv.errors };
  } else {
    return { valid: isValid }
  }


}