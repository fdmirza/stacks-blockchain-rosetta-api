import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import { DataStore } from '../../../datastore/common';
import { RosettaConstants } from './constants';
import { RosettaErrors } from './errors';
import { isValidPrincipal } from '../../../helpers';
import { RosettaAccountBalanceResponse } from '@blockstack/stacks-blockchain-api-types';

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

    if (!isValidPrincipal(accountIdentifier.address)) {
      return res.status(400).json(RosettaErrors.invalidAccount);
    }

    const blockIdentifier = req.body.block_identifier;
    let balance: bigint = BigInt(0);
    let index: number = 0;
    let hash: string = '';

    if (blockIdentifier == null) {
      const result = await db.getStxBalance(stxAddress);
      balance = result.balance;
      const { blockHeight, blockHash } = await db.getRecentEventBlockForAddress(stxAddress);
      index = blockHeight;
      hash = blockHash;
    } else if (blockIdentifier.index && blockIdentifier.hash) {
      const result = await db.getStxBalanceAtBlock(stxAddress, blockIdentifier.index);
      balance = result.balance;
      index = blockIdentifier.index;
      hash = blockIdentifier.hash;
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
            symbol: 'STX',
            decimals: 8,
          },
        },
      ],
      coins: [],
      metadata: {
        sequence_number: 0,
      },
    };

    res.json(response);
  });
  return router;
}
