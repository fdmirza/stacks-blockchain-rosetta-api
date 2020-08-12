import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import * as Bluebird from 'bluebird';
import { DataStore, DbTx } from '../../../datastore/common';
import {
  getTxFromDataStore,
  parseTxTypeStrings,
  parseDbMempoolTx,
} from '../../controllers/db-controller';
import { waiter, has0xPrefix, logError } from '../../../helpers';
import { parseLimitQuery, parsePagingQueryInput } from '../../pagination';
import { validate } from '../../validate';
import {
  TransactionType,
  TransactionResults,
  MempoolTransactionListResponse,
  RosettaMempoolTransactionListResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { Operation, getOperations } from '../../operations';

const MAX_MEMPOOL_TXS_PER_REQUEST = 200;
const parseMempoolTxQueryLimit = parseLimitQuery({
  maxItems: MAX_MEMPOOL_TXS_PER_REQUEST,
  errorMsg: '`limit` must be equal to or less than ' + MAX_MEMPOOL_TXS_PER_REQUEST,
});

export interface RosettaTransaction {
  transaction_identifier: {
    hash: string;
  };
  operations: Operation[];
}

export function createMempoolRouter(db: DataStore): RouterWithAsync {
  const router = addAsync(express.Router());
  router.use(express.json());
  router.postAsync('/', async (req, res) => {
    const limit = req.body.metadata
      ? parseMempoolTxQueryLimit(req.body.metadata.limit ?? 100)
      : 100;
    const offset = req.body.metadata ? parsePagingQueryInput(req.body.metadata.offset ?? 0) : 0;
    const { results: txResults, total } = await db.getMempoolTxIdList({ offset, limit });

    const transaction_identifiers = txResults.map(tx => {
      return { hash: tx.tx_id };
    });
    const meta_data = {
      limit: limit,
      total: total,
      offset: offset,
    };
    const response: RosettaMempoolTransactionListResponse = { transaction_identifiers, meta_data };
    res.json(response);
  });

  router.postAsync('/transaction', async (req, res) => {
    let tx_id = req.body.transaction_identifier.hash;

    if (!has0xPrefix(tx_id)) {
      tx_id = '0x' + tx_id;
    }
    const mempoolTxQuery = await db.getMempoolTx(tx_id);
    console.log('mempoolTxQuery', mempoolTxQuery);
    if (!mempoolTxQuery.found) {
      res.status(404).json({ error: `could not find transaction by ID ${tx_id}` });
      return;
    }

    const operations = getOperations(mempoolTxQuery.result);
    const result: RosettaTransaction = {
      transaction_identifier: { hash: tx_id },
      operations: operations,
    };
    // TODO: this validation needs fixed now that the mempool-tx and mined-tx types no longer overlap

    const schemaPath = require.resolve(
      '@blockstack/stacks-blockchain-sidecar-types/entities/rosetta-mempool-transaction-response.schema.json'
    );
    await validate(schemaPath, mempoolTxQuery.result);

    res.json(result);
  });

  return router;
}
