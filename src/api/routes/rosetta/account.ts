import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import { DataStore } from '../../../datastore/common';
import { RosettaConstants, StacksCurrency } from './constants';
import { RosettaErrors } from './errors';
import { isValidC32Address } from '../../../helpers';
import { RosettaAccountBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { validate } from '../../validate';
import { has0xPrefix } from '../../../helpers';

export function createAccountRouter(db: DataStore): RouterWithAsync {
  const router = addAsync(express.Router());

  router.postAsync('/balance', async (req, res) => {
    const networkIdentifier = req.body.network_identifier;

    if (!networkIdentifier) {
      res.status(400).json(RosettaErrors.emptyNetworkIdentifier);
    }

    if (!networkIdentifier.blockchain) {
      res.status(400).json(RosettaErrors.emptyBlockchain);
    }

    if (!networkIdentifier.network) {
      res.status(400).json(RosettaErrors.emptyBlockchain);
    }

    if (networkIdentifier.blockchain != RosettaConstants.blockchain) {
      res.status(400).json(RosettaErrors.invalidBlockchain);
    }

    if (networkIdentifier.network != RosettaConstants.network) {
      res.status(400).json(RosettaErrors.invalidNetwork);
    }

    const accountIdentifier = req.body.account_identifier;

    if (!accountIdentifier) {
      res.status(400).json(RosettaErrors.emptyAccountIdentifier);
    }

    const stxAddress = accountIdentifier.address;
    if (!isValidC32Address(stxAddress)) {
      return res.status(400).json(RosettaErrors.invalidAccount);
    }

    const blockIdentifier = req.body.block_identifier;
    let balance: bigint = BigInt(0);
    let index: number = 0;
    let hash: string = '';

    if (blockIdentifier == null) {
      const result = await db.getStxBalance(stxAddress);
      balance = result.balance;
      const block = await db.getCurrentBlock();
      if (block.found) {
        index = block.result.block_height;
        hash = block.result.block_hash;
      } else {
        res.status(400).json(RosettaErrors.blockNotFound);
      }
    } else if (blockIdentifier.index) {
      const result = await db.getStxBalanceAtBlock(stxAddress, blockIdentifier.index);
      balance = result.balance;
      index = blockIdentifier.index;
      const block = await db.getBlockByHeight(index);
      if (block.found) {
        hash = block.result.block_hash;
      } else {
        res.status(400).json(RosettaErrors.blockNotFound);
      }
    } else if (blockIdentifier.hash) {
      let blockHash = blockIdentifier.hash;
      if (!has0xPrefix(blockHash)) {
        blockHash = '0x' + blockHash;
      }
      const block = await db.getBlock(blockHash);
      if (block.found) {
        const result = await db.getStxBalanceAtBlock(stxAddress, block.result.block_height);
        balance = result.balance;
        index = block.result.block_height;
        hash = block.result.block_hash;
      } else {
        res.status(400).json(RosettaErrors.blockNotFound);
      }
    } else {
      res.status(400).json(RosettaErrors.invalidBlockIdentifier);
    }

    const response: RosettaAccountBalanceResponse = {
      block_identifier: {
        index,
        hash,
      },
      balances: [
        {
          value: balance.toString(),
          currency: {
            ...StacksCurrency,
          },
        },
      ],
      coins: [],
      metadata: {
        sequence_number: 0,
      },
    };

    const schemaPath = require.resolve(
      '@blockstack/stacks-blockchain-api-types/api/rosetta-account/rosetta-account-response.schema.json'
    );
    await validate(schemaPath, response);

    res.json(response);
  });
  return router;
}
