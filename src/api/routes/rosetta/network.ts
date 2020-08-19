import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import { DataStore } from '../../../datastore/common';
import { getRosettaBlockFromDataStore } from '../../controllers/db-controller';
import { RosettaConstants } from './constants';
import { StacksCoreRpcClient, Neighbor } from '../../../core-rpc/client';
import {
  RosettaNetworkListResponse,
  RosettaNetworkOptionsResponse,
  RosettaNetworkStatusResponse,
  RosettaPeers,
} from '@blockstack/stacks-blockchain-api-types';
import { RosettaErrors } from './errors';

export function createNetworkRouter(db: DataStore): RouterWithAsync {
  const router = addAsync(express.Router());

  router.postAsync('/list', async (req, res) => {
    const response: RosettaNetworkListResponse = {
      network_identifiers: [
        {
          blockchain: RosettaConstants.blockchain,
          network: RosettaConstants.network,
        },
      ],
    };

    res.json(response);
  });

  router.getAsync('/status', async (_, res) => {
    const block = await getRosettaBlockFromDataStore(db);
    if (!block.found) {
      res.status(404).json({ error: `cannot find block` });
      return;
    }

    const genesis = await getRosettaBlockFromDataStore(db, undefined, 1);

    if (!genesis.found) {
      res.status(404).json({ error: `cannot find genesis block` });
      return;
    }

    const stacksCoreRpcClient = new StacksCoreRpcClient();
    const neighborsResp = await stacksCoreRpcClient.getNeighbors();
    // TODO: Check if we have response or not
    const neighbors: Neighbor[] = [];
    neighbors.push(...neighborsResp.inbound, ...neighborsResp.outbound);
    const peers: RosettaPeers[] = neighbors
      .filter(
        (neighbor, i, arr) =>
          arr.findIndex(
            currentNeighbor => currentNeighbor.public_key_hash === neighbor.public_key_hash
          ) === i
      )
      .map(neighbor => {
        return {
          peer_id: neighbor.public_key_hash,
        };
      });

    const response: RosettaNetworkStatusResponse = {
      current_block_identifier: {
        index: block.result.block_identifier.index,
        hash: block.result.block_identifier.hash,
      },
      current_block_timestamp: block.result.timestamp,
      genesis_block_identifier: {
        index: genesis.result.block_identifier.index,
        hash: genesis.result.block_identifier.hash,
      },
      peers,
    };

    res.json(response);
  });

  router.getAsync('/options', async (_, res) => {
    const response: RosettaNetworkOptionsResponse = {
      version: {
        rosetta_version: RosettaConstants.rosettaVersion,
        node_version: process.version,
        middleware_version: process.env.npm_package_version,
        metadata: {},
      },
      allow: {
        operation_statuses: [
          {
            status: 'SUCCESS',
            successful: true,
          },
          {
            status: 'FAILURE',
            successful: false,
          },
        ],
        operation_types: [
          'token_transfer',
          'contract_call',
          'smart_contract',
          'coinbase',
          'poison_microblock',
        ],
        errors: Object.values(RosettaErrors),
        historical_balance_lookup: true,
      },
    };

    return res.json(response);
  });

  return router;
}
