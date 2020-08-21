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

  switch (endPoint) {
    case '/rosetta/v1/network/list': {
      schema = 'rosetta-network/rosetta-network-list-request.schema.json';
    }
    case '/rosetta/v1/network/options': {
      schema = 'rosetta-network/rosetta-network-options-request.schema.json';
    }
    case '/rosetta/v1/network/status': {
      schema = 'rosetta-network/rosetta-network-status-request.schema.json';
    }
    case '/rosetta/v1/account/balance': {
      schema = 'rosetta-account/rosetta-account-balance-request.schema.json';
    }
    case '/rosetta/v1/block': {
      schema = 'rosetta-block/rosetta-block-request.schema.json';
    }
    case '/rosetta/v1/block/transaction': {
      schema = 'rosetta-block/rosetta-block-transaction-request.schema.json';
    }
    case '/rosetta/v1/mempool': {
      schema = 'rosetta-mempool-transactions/rosetta-mempool-transaction-list-request.schema.json';
    }
    case '/rosetta/v1/mempool/transaction': {
      schema = 'rosetta-mempool-transactions/rosetta-mempool-transaction-request.schema.json';
    }
  }
  const schemaPath = require.resolve(base_path + schema);

  await validate(schemaPath, data);
}
