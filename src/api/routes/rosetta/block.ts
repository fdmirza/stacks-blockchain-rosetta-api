import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import {
  RosettaBlock,
} from '@blockstack/stacks-blockchain-api-types';
import { DataStore } from '../../../datastore/common';
import {
  getBlockFromDataStore,
  getBlockTransactionsFromDataStore,
  getTransactionFromDataStore,
} from '../../controllers/db-controller';
import { has0xPrefix } from '../../../helpers';


export function createRosettaBlockRouter(db: DataStore): RouterWithAsync {
  const router = addAsync(express.Router());
  router.use(express.json());
  router.postAsync('/', async (req, res) => {
    let block_hash = req.body.block_identifier.hash;
    const index = req.body.block_identifier.index;
    if (block_hash && !has0xPrefix(block_hash)) {
      block_hash = '0x' + block_hash;
    }

    const block = await getBlockFromDataStore(db, block_hash, index);

    if (!block.found) {
      res.status(404).json({ error: `cannot find block by hash ${block_hash}` });
      return;
    }
    const parent_block = await getBlockFromDataStore(db, block.result.parent_block_hash);

    const blockTxs = await getBlockTransactionsFromDataStore(block.result.hash, db);

    const result: RosettaBlock = {
      block_identifier: { index: block.result.height, hash: block.result.hash },
      parent_block_identifier: {
        index: parent_block.found ? parent_block.result.height : 0,
        hash: parent_block.found ? parent_block.result.hash : '',
      },
      timestamp: block.result.burn_block_time,
      transactions: blockTxs.found ? blockTxs.result : [],
    };

    res.json(result);
  });

  router.postAsync('/transaction', async (req, res) => {
    let tx_hash = req.body.transaction_identifier.hash;
    if (!has0xPrefix(tx_hash)) {
      tx_hash = '0x' + tx_hash;
    }

    const transaction = await getTransactionFromDataStore(tx_hash, db);
    if (!transaction.found) {
      res.status(404).json({ error: `cannot find block by hash ${tx_hash}` });
      return;
    }

    res.json(transaction.result);
  });

  return router;
}