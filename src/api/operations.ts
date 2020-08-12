import { DbMempoolTx, DbTx } from '../datastore/common';
import { getTxTypeString, getTxStatusString } from './controllers/db-controller';

import { assertNotNullish as unwrapOptional, bufferToHexPrefixString } from '../helpers';
import { CoinAction } from '../datastore/common';
import {
  RosettaOperaion,
  RosettaOperationIdentifier,
  RosettaSubAccount,
} from '@blockstack/stacks-blockchain-api-types';

// export interface Operation {
//   operation_identifier: OperationIdentifier;
//   related_operations?: [RelatedOperation];
//   type: string;
//   status: string;
//   account: Account;
//   amount?: Amount;
//   coin_change?: CoinChange;
// }

// interface OperationIdentifier {
//   index: number;
// }
// interface Account {
//   address: string;
//   sub_account?: SubAccount;
// }
// interface SubAccount {
//   address: string | undefined;
//   metadata: {
//     contract_call_function_name: string | undefined;
//     contract_call_function_args: string | undefined;
//     raw_result?: string | undefined;
//   };
// }
// interface Amount {
//   value: string;
//   currency: Currency;
// }
// interface Currency {
//   symbol: String;
//   decimals: number;
// }

// interface RelatedOperation {
//   index: number;
//   operation_identifier: OperationIdentifier;
// }

// interface CoinChange {
//   coin_identifier: {
//     identifier: string;
//   };
//   coin_action: string;
// }
export function getOperations(tx: DbMempoolTx | DbTx): RosettaOperaion[] {
  const operations: RosettaOperaion[] = [];
  const txType = getTxTypeString(tx.type_id);
  switch (txType) {
    case 'token_transfer':
      operations.push(makeFeeOperation(tx));
      operations.push(makeSenderOperation(tx, operations.length));
      operations.push(makeRecieverOperation(tx, operations.length));
      break;
    case 'contract_call':
      operations.push(makeFeeOperation(tx));
      operations.push(makeCallContractOperation(tx, operations.length));
      break;
    case 'smart_contract':
      operations.push(makeFeeOperation(tx));
      operations.push(makeDeployContractOperation(tx, operations.length));
      break;
    case 'coinbase':
      operations.push(makeCoinbaseOperation(tx, 0));
      break;
    case 'poison_microblock':
      operations.push(makePoisonMicroblockOperation(tx, 0));
      break;
    default:
      throw new Error(`Unexpected tx type: ${JSON.stringify(txType)}`);
  }
  return operations;
}

function makeFeeOperation(tx: DbMempoolTx | DbTx): RosettaOperaion {
  const fee: RosettaOperaion = {
    operation_identifier: { index: 0 },
    type: 'fee',
    status: getTxStatusString(tx.status),
    account: { address: tx.sender_address },
    amount: {
      value: tx.fee_rate.toString(10),
      currency: { symbol: 'STX', decimals: 18 },
    },
  };

  return fee;
}

function makeSenderOperation(tx: DbMempoolTx | DbTx, index: number): RosettaOperaion {
  const sender: RosettaOperaion = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
    },
    amount: {
      value:
        '-' +
        unwrapOptional(
          tx.token_transfer_amount,
          () => 'Unexpected nullish token_transfer_amount'
        ).toString(10),
      currency: { symbol: 'STX', decimals: 18 },
    },
    coin_change: {
      coin_action: CoinAction.CoinSpent,
      coin_identifier: { identifier: tx.tx_id + ':' + index },
    },
  };

  return sender;
}

function makeRecieverOperation(tx: DbMempoolTx | DbTx, index: number): RosettaOperaion {
  const reciever: RosettaOperaion = {
    operation_identifier: { index: index },
    related_operations: [{ index: 0, operation_identifier: { index: 1 } }],
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(
        tx.token_transfer_recipient_address,
        () => 'Unexpected nullish token_transfer_recipient_address'
      ),
    },
    amount: {
      value: unwrapOptional(
        tx.token_transfer_amount,
        () => 'Unexpected nullish token_transfer_amount'
      ).toString(10),
      currency: { symbol: 'STX', decimals: 18 },
    },
    coin_change: {
      coin_action: CoinAction.CoinCreated,
      coin_identifier: { identifier: tx.tx_id + ':' + index },
    },
  };

  return reciever;
}

function makeDeployContractOperation(tx: DbMempoolTx | DbTx, index: number): RosettaOperaion {
  const deployer: RosettaOperaion = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
    },
  };

  return deployer;
}

function makeCallContractOperation(tx: DbMempoolTx | DbTx, index: number): RosettaOperaion {
  const caller: RosettaOperaion = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
      sub_account: {
        address: tx.contract_call_contract_id ? tx.contract_call_contract_id : '',
        metadata: {
          contract_call_function_name: tx.contract_call_function_name,
          contract_call_function_args: bufferToHexPrefixString(
            unwrapOptional(tx.contract_call_function_args, () => '')
          ),
          raw_result: tx.raw_result,
        },
      },
    },
  };

  return caller;
}
function makeCoinbaseOperation(tx: DbMempoolTx | DbTx, index: number): RosettaOperaion {
  // TODO : Add more mappings in operations for coinbase
  const sender: RosettaOperaion = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
    },
  };

  return sender;
}

function makePoisonMicroblockOperation(tx: DbMempoolTx | DbTx, index: number): RosettaOperaion {
  // TODO : add more mappings in operations for poison-microblock
  const sender: RosettaOperaion = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
    },
  };

  return sender;
}
