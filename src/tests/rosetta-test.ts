import * as supertest from 'supertest';
import {
  DbBlock,
  DbTxTypeId,
  DbMempoolTx,
  DbTxStatus,
} from '../datastore/common';
import { startApiServer, ApiServer } from '../api/init';
import { PgDataStore, cycleMigrations, runMigrations } from '../datastore/postgres-store';
import { PoolClient } from 'pg';
import { RosettaBlock } from '@blockstack/stacks-blockchain-api-types';


describe('api tests', () => {
  let db: PgDataStore;
  let client: PoolClient;
  let api: ApiServer;

  beforeEach(async () => {
    process.env.PG_DATABASE = 'postgres';
    await cycleMigrations();
    db = await PgDataStore.connect();
    client = await db.pool.connect();
    api = await startApiServer(db);
  });

  test('fetch mempool', async () => {
    const mempoolTx: DbMempoolTx = {
      tx_id: '0x8912000000000000000000000000000000000000000000000000000000000000',
      raw_tx: Buffer.from('test-raw-tx'),
      type_id: DbTxTypeId.Coinbase,
      status: DbTxStatus.Pending,
      receipt_time: 1594307695,
      coinbase_payload: Buffer.from('coinbase hi'),
      post_conditions: Buffer.from([0x01, 0xf5]),
      fee_rate: BigInt(1234),
      sponsored: false,
      sender_address: 'sender-addr',
      origin_hash_mode: 1,
    };
    await db.updateMempoolTx({ mempoolTx });

    const searchResult1 = await supertest(api.server)
      .post(`/rosetta/v1/mempool`)
      .set('Content-Type', 'application/json').send(`{
            "network_identifier": {
                "blockchain": "blockstack",
                "network": "testnet",
                "sub_network_identifier": {
                    "network": "shard 1",
                    "metadata": {
                        "producer": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
                    }
                }
            },
            "metadata": {
                "limit":100,
                "offset":0
            }
        }`);
    expect(searchResult1.status).toBe(200);
    expect(searchResult1.type).toBe('application/json');
    const expectedResp1 = {
      transaction_identifiers: [
        {
          hash: '0x8912000000000000000000000000000000000000000000000000000000000000',
        },
      ],
      metadata: {
        limit: 100,
        total: 1,
        offset: 0,
      },
    };

    expect(JSON.parse(searchResult1.text)).toEqual(expectedResp1);
  });


  test('fetch mempool transaction', async () => {
    const mempoolTx: DbMempoolTx = {
      tx_id: '0x8912000000000000000000000000000000000000000000000000000000000000',
      raw_tx: Buffer.from('test-raw-tx'),
      type_id: DbTxTypeId.TokenTransfer,
      status: DbTxStatus.Pending,
      receipt_time: 1594307695,
      token_transfer_amount: BigInt(5000),
      coinbase_payload: Buffer.from('token trasfer hi'),
      post_conditions: Buffer.from([0x01, 0xf5]),
      fee_rate: BigInt(1234),
      sponsored: false,
      sender_address: 'sender-addr',
      token_transfer_recipient_address: 'recipient-addr',
      origin_hash_mode: 1,
    };
    await db.updateMempoolTx({ mempoolTx });

    const searchResult1 = await supertest(api.server)
      .post(`/rosetta/v1/mempool/transaction`)
      .set('Content-Type', 'application/json').send(`{
        "network_identifier": {
            "blockchain": "blockstack",
            "network": "testnet",
            "sub_network_identifier": {
                "network": "shard 1",
                "metadata": {
                    "producer": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
                }
            }
        },
        "transaction_identifier": {
            "hash": "0x8912000000000000000000000000000000000000000000000000000000000000"
        }
    }`);
    expect(searchResult1.status).toBe(200);
    expect(searchResult1.type).toBe('application/json');
    const expectedResp1 = {
      transaction_identifier: {
        hash: '0x8912000000000000000000000000000000000000000000000000000000000000',
      },
      operations: [
        {
          operation_identifier: {
            index: 0,
          },
          type: 'fee',
          status: 'pending',
          account: {
            address: 'sender-addr',
          },
          amount: {
            value: '1234',
            currency: {
              symbol: 'STX',
              decimals: 6,
            },
          },
        },
        {
          operation_identifier: {
            index: 1,
          },
          type: 'token_transfer',
          status: 'pending',
          account: {
            address: 'sender-addr',
          },
          amount: {
            value: '-5000',
            currency: {
              symbol: 'STX',
              decimals: 6,
            },
          },
          coin_change: {
            coin_identifier: {
              identifier: '0x8912000000000000000000000000000000000000000000000000000000000000:1',
            },
            coin_action: 'coin_spent',
          },
        },
        {
          operation_identifier: {
            index: 2,
          },
          related_operations: [
            {
              index: 0,
              operation_identifier: {
                index: 1,
              },
            },
          ],
          type: 'token_transfer',
          status: 'pending',
          account: {
            address: 'recipient-addr',
          },
          amount: {
            value: '5000',
            currency: {
              symbol: 'STX',
              decimals: 6,
            },
          },
          coin_change: {
            coin_identifier: {
              identifier: '0x8912000000000000000000000000000000000000000000000000000000000000:2',
            },
            coin_action: 'coin_created',
          },
        },
      ],
    };

    expect(JSON.parse(searchResult1.text)).toEqual(expectedResp1);
  });

  test('fetch block', async () => {
    const block: DbBlock = {
      block_hash: "0x8912000000000000000000000000000000000000000000000000000000000000",
      block_height: 12,
      burn_block_time: 123456,
      parent_block_hash: "0x9912000000000000000000000000000000000000000000000000000000000000",
      index_block_hash: "0x1233000000000000000000000000000000000000000000000000000000000000",
      parent_index_block_hash: "0x1244000000000000000000000000000000000000000000000000000000000000",
      canonical: true,
      parent_microblock: "0x1255000000000000000000000000000000000000000000000000000000000000"
    };
    const client = await db.pool.connect();
    await db.updateBlock(client, block);

    const parentBlock: DbBlock = {
      block_hash: "0x9912000000000000000000000000000000000000000000000000000000000000",
      block_height: 11,
      burn_block_time: 123456,
      parent_block_hash: "0x9913000000000000000000000000000000000000000000000000000000000000",
      index_block_hash: "0x1133000000000000000000000000000000000000000000000000000000000000",
      parent_index_block_hash: "0x1144000000000000000000000000000000000000000000000000000000000000",
      canonical: true,
      parent_microblock: "0x1133000000000000000000000000000000000000000000000000000000000000"
    };
    await db.updateBlock(client, parentBlock);
    const searchResult1 = await supertest(api.server)
      .post(`/rosetta/v1/block`)
      .set('Content-Type', 'application/json').send(`{
        "network_identifier": {
            "blockchain": "blockstack",
            "network": "testnet",
            "sub_network_identifier": {
                "network": "shard 1"
            }
        },
        "block_identifier": {
            "hash": "0x8912000000000000000000000000000000000000000000000000000000000000"
        }
    }`);
    expect(searchResult1.status).toBe(200);
    expect(searchResult1.type).toBe('application/json');
    const expectedResp1: RosettaBlock = {

      block_identifier: {
        index: 12,
        hash: "0x8912000000000000000000000000000000000000000000000000000000000000"
      },
      parent_block_identifier: {
        index: 11,
        hash: "0x9912000000000000000000000000000000000000000000000000000000000000"
      },
      timestamp: 123456000,
      transactions: []

    };
    client.release();
    expect(JSON.parse(searchResult1.text)).toEqual(expectedResp1);
  });

  test('fetch network status', async () => {
    const genesis: DbBlock = {
      block_hash: "0x8912000000000000000000000000000000000000000000000000000000000000",
      block_height: 1,
      burn_block_time: 123456,
      parent_block_hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      index_block_hash: "0x1233000000000000000000000000000000000000000000000000000000000000",
      parent_index_block_hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      canonical: true,
      parent_microblock: "0x0000000000000000000000000000000000000000000000000000000000000000"
    };
    const client = await db.pool.connect();
    await db.updateBlock(client, genesis);

    const block: DbBlock = {
      block_hash: "0x9912000000000000000000000000000000000000000000000000000000000000",
      block_height: 20,
      burn_block_time: 123456,
      parent_block_hash: "0x9913000000000000000000000000000000000000000000000000000000000000",
      index_block_hash: "0x1133000000000000000000000000000000000000000000000000000000000000",
      parent_index_block_hash: "0x1144000000000000000000000000000000000000000000000000000000000000",
      canonical: true,
      parent_microblock: "0x1133000000000000000000000000000000000000000000000000000000000000"
    };
    await db.updateBlock(client, block);
    const searchResult1 = await supertest(api.server)
      .post(`/rosetta/v1/network/status`)
      .set('Content-Type', 'application/json');
    expect(searchResult1.status).toBe(200);
    expect(searchResult1.type).toBe('application/json');
    // TODO : update hard-coded peer_id
    const expectedResp1 = {

      current_block_identifier: {
        index: 20,
        hash: "0x9912000000000000000000000000000000000000000000000000000000000000"
      },
      genesis_block_identifier: {
        index: 1,
        hash: "0x8912000000000000000000000000000000000000000000000000000000000000"
      },
      current_block_timestamp: 123456000,
      peers: [{
        peer_id: "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
        metadata: {}
      }]

    };
    client.release();
    expect(JSON.parse(searchResult1.text)).toEqual(expectedResp1);
  });

  afterEach(async () => {
    await new Promise(resolve => api.server.close(() => resolve()));
    client.release();
    await db?.close();
    await runMigrations(undefined, 'down');
  });
});
