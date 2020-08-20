import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import {
  RosettaBlock,
  RosettaBlockResponse
} from '@blockstack/stacks-blockchain-api-types';
import { DataStore } from '../../../datastore/common';
import {
  getBlockFromDataStore,
  getBlockTransactionsFromDataStore,
  getTransactionFromDataStore,
  getRosettaBlockFromDataStore
} from '../../controllers/db-controller';
import { has0xPrefix } from '../../../helpers';


export function createRosettaBlockRouter(db: DataStore): RouterWithAsync {
  const router = addAsync(express.Router());
  router.use(express.json());
  router.postAsync('/', async (req, res) => {
    console.log(JSON.stringify(req.body));
    let block_hash = req.body.block_identifier.hash;
    const index = req.body.block_identifier.index;
    if (block_hash && !has0xPrefix(block_hash)) {
      block_hash = '0x' + block_hash;
    }

    const block = await getRosettaBlockFromDataStore(db, block_hash, index);

    if (!block.found) {
      res.status(404).json({
        code: 12,
        message: "cannot find block by hash",
        retriable: false
      });
      return;
    }
    const blockResponse: RosettaBlockResponse = {
      block: block.result
    }
    res.json(blockResponse);
  });

  router.postAsync('/transaction', async (req, res) => {
    let tx_hash = req.body.transaction_identifier.hash;
    if (!has0xPrefix(tx_hash)) {
      tx_hash = '0x' + tx_hash;
    }

    const transaction = await getTransactionFromDataStore(tx_hash, db);
    if (!transaction.found) {
      res.status(404).json({ error: `cannot find transaction by hash ${tx_hash}` });
      return;
    }

    res.json(transaction.result);
  });

  return router;
}
