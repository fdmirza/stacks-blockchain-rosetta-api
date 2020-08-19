import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import { DataStore } from '../../../datastore/common';
import {
    getBlockFromDataStore, getRosettaBlockFromDataStore,


} from '../../controllers/db-controller';

export function createNetworkRouter(db: DataStore): RouterWithAsync {
    const router = addAsync(express.Router());
    router.use(express.json());

    router.postAsync('/list', async (req, res) => {

        const response = {
            network_identifiers: [
                {
                    blockchain: "blockstack",
                    network: "testnet"
                }
            ]
        }

        res.json(response)
    })

    router.postAsync('/status', async (req, res) => {

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

        // TODO : update hard-coded peer_id
        const respone = {
            current_block_identifier: {
                index: block.result.block_identifier.index,
                hash: block.result.block_identifier.hash
            },
            current_block_timestamp: block.result.timestamp,
            genesis_block_identifier: {
                index: genesis.result.block_identifier.index,
                hash: genesis.result.block_identifier.hash
            }
        }

        res.json(respone)
    })

    router.postAsync('/options', async (req, res) => {

        res.json({
            "version": {
                "rosetta_version": "1.2.5",
                "node_version": "1.0.2",
                "middleware_version": "0.2.7",
                "metadata": {}
            },
            "allow": {
                "operation_statuses": [
                    {
                        "status": "success",
                        "successful": true
                    }
                ],
                "operation_types": [
                    'token_transfer',
                    'contract_call',
                    'smart_contract',
                    'coinbase',
                    'poison_microblock',
                ],
                "errors": [
                    {
                        "code": 11,
                        "message": "Invalid account format",
                        "retriable": true,
                        "details": {
                            "address": "0x1dcc4de8dec75d7aab85b567b6",
                            "error": "not base64"
                        }
                    }, {
                        "code": 12,
                        "message": "cannot find block by hash",
                        "retriable": false,
                    }
                ],
                "historical_balance_lookup": true
            }
        })
    })

    return router;
}