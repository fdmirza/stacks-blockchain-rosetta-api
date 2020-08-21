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

  router.postAsync('/list', (req, res) => {
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

  router.postAsync('/status', async (_, res) => {
    const block = await getRosettaBlockFromDataStore(db);
    if (!block.found) {
      res.status(404).json(RosettaErrors.blockNotFound);
      return;
    }

    const genesis = await getRosettaBlockFromDataStore(db, undefined, 1);

    if (!genesis.found) {
      res.status(404).json(RosettaErrors.blockNotFound);
      return;
    }

    const stacksCoreRpcClient = new StacksCoreRpcClient();
    const neighborsResp = await stacksCoreRpcClient.getNeighbors();

    const neighbors: Neighbor[] = [];
    neighbors.push(...neighborsResp.inbound, ...neighborsResp.outbound);

    const set_of_peer_ids = new Set(
      neighbors.map(neighbor => {
        return neighbor.public_key_hash;
      })
    );

    const peers = [...set_of_peer_ids].map(peerId => {
      return { peer_id: peerId };
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

  router.postAsync('/options', (_, res) => {
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
            status: 'success',
            successful: true,
          },
          {
            status: 'pending',
            successful: true,
          },
          {
            status: 'abort_by_response',
            successful: false,
          },
          {
            status: 'abort_by_post_condition',
            successful: false,
          },
        ],
        operation_types: [
          'token_transfer',
          'contract_call',
          'smart_contract',
          'coinbase',
          'poison_microblock',
          'fee'
        ],
        errors: Object.values(RosettaErrors),
        historical_balance_lookup: true,
      },
    };

    return res.json(response);
  });

  return router;
}
