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

    if (networkIdentifier == null) {
      res.status(400).json(RosettaErrors.emptyNetworkIdentifier);
    }

    if (networkIdentifier.blockchain != RosettaConstants.blockchain) {
      res.status(400).json(RosettaErrors.invalidBlockchain);
    }

    if (networkIdentifier.network != RosettaConstants.network) {
      res.status(400).json(RosettaErrors.invalidNetwork);
    }

    const accountIdentifier = req.body.account_identifier;

    if (accountIdentifier == null) {
      res.status(400).json(RosettaErrors.emptyAccountIdentifier);
    }

    const stxAddress = accountIdentifier.address;

    if (!isValidPrincipal(accountIdentifier.address)) {
      return res.status(400).json({ error: `invalid STX address "${stxAddress}"` });
    }

    const blockIdentifier = req.body.block_identifier;
    let balance: bigint = BigInt(0);
    if (blockIdentifier != null) {
      if (blockIdentifier.index && blockIdentifier.hash) {
        const result = await db.getStxBalanceAtBlock(
          stxAddress,
          //  '\\x' + blockIdentifier.hash,
          blockIdentifier.index
        );
        balance = result.balance;
      } else {
        res.status(400).json(RosettaErrors.invalidBlockIdentifier);
      }
    } else {
      const result = await db.getStxBalance(stxAddress);
      balance = result.balance;
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
