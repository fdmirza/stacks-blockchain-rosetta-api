import * as express from 'express';
import { addAsync, RouterWithAsync } from '@awaitjs/express';
import { DataStore } from '../../../datastore/common';
import {
    getBlockFromDataStore,


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

        const block = await getBlockFromDataStore(db);
        if (!block.found) {
            res.status(404).json({ error: `cannot find block` });
            return;
        }

        const genesis = await getBlockFromDataStore(db, undefined, 1);

        if (!genesis.found) {
            res.status(404).json({ error: `cannot find genesis block` });
            return;
        }


        const respone = {
            current_block_identifier: {
                index: block.result.height,
                hash: block.result.hash
            },
            current_block_timestamp: block.result.burn_block_time * 1000,
            genesis_block_identifier: {
                index: genesis.result.height,
                hash: genesis.result.hash
            },
            peers: [
                {
                    peer_id: "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
                    metadata: {}

                }
            ]
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
                        "status": "SUCCESS",
                        "successful": true
                    }
                ],
                "operation_types": [
                    "TRANSFER"
                ],
                "errors": [
                    {
                        "code": 12,
                        "message": "Invalid account format",
                        "retriable": true,
                        "details": {
                            "address": "0x1dcc4de8dec75d7aab85b567b6",
                            "error": "not base64"
                        }
                    }
                ],
                "historical_balance_lookup": true
            }
        })
    })

    return router;
}