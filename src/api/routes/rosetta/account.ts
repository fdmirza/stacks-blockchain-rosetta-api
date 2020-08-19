import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import { DataStore } from '../../../datastore/common';
import { RosettaConstants } from './constants';
import { RosettaErrors } from './errors';
import { isValidPrincipal } from '../../../helpers';

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

    if (!blockIdentifier) {
      const result = await db.getStxBalance(stxAddress);
      balance = result.balance;
    }

    if (blockIdentifier.index && blockIdentifier.hash) {
      const result = await db.getStxBalanceAtBlock(stxAddress, blockIdentifier.index);
      balance = result.balance;
    } else {
      res.status(400).json(RosettaErrors.invalidBlockIdentifier);
    }

    // Get balance info for STX token
    // const { balance, totalSent, totalReceived } = await db.getStxBalanceAtBlock(stxAddress);

    const response = {
      network_identifiers: [
        {
          blockchain: balance.toString(),
          network: 'adf',
        },
      ],
    };

    res.json(response);
  });
  return router;
}
