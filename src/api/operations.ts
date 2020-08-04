import { DbMempoolTx, DbTx } from '../datastore/common';
import { getTxTypeString, getTxStatusString } from './controllers/db-controller';

import { assertNotNullish as unwrapOptional, bufferToHexPrefixString } from '../helpers';
import { trueCV } from '@blockstack/stacks-transactions';

interface Operation {
  operation_identifier: OperationIdentifier;
  related_operations?: [RelatedOperation];
  type: string;
  status: string;
  account: Account;
  amount?: Amount;
}

interface OperationIdentifier {
  index: number;
}
interface Account {
  address: string;
  sub_account?: SubAccount;
}
interface SubAccount {
  address: string | undefined;
  metadata: {
    contract_call_function_name: string | undefined;
    contract_call_function_args: string | undefined;
    raw_result?: string | undefined;
  };
}
interface Amount {
  value: string;
  currency: Currency;
}
interface Currency {
  symbol: String;
  decimals: number;
}

interface RelatedOperation {
  index: number;
  operation_identifier: OperationIdentifier;
}
export function getOperations(tx: DbMempoolTx | DbTx): Operation[] {
  const operations: Operation[] = [];
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
      break;
    case 'poison_microblock':
      break;
    default:
      throw new Error(`Unexpected tx type: ${JSON.stringify(txType)}`);
  }
  return operations;
}

function makeFeeOperation(tx: DbMempoolTx | DbTx): Operation {
  const fee: Operation = {
    operation_identifier: { index: 0 },
    type: 'fee',
    status: 'success',
    account: { address: tx.sender_address },
    amount: {
      value: tx.fee_rate.toString(10),
      currency: { symbol: 'STX', decimals: 18 },
    },
  };

  return fee;
}

function makeSenderOperation(tx: DbMempoolTx | DbTx, index: number): Operation {
  const sender: Operation = {
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
  };

  return sender;
}

function makeRecieverOperation(tx: DbMempoolTx | DbTx, index: number): Operation {
  const reciever: Operation = {
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
  };

  return reciever;
}

function makeDeployContractOperation(tx: DbMempoolTx | DbTx, index: number): Operation {
  const deployer: Operation = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
    },
  };

  return deployer;
}

function makeCallContractOperation(tx: DbMempoolTx | DbTx, index: number): Operation {
  const caller: Operation = {
    operation_identifier: { index: index },
    type: getTxTypeString(tx.type_id),
    status: getTxStatusString(tx.status),
    account: {
      address: unwrapOptional(tx.sender_address, () => 'Unexpected nullish sender_address'),
      sub_account: {
        address: tx.contract_call_contract_id,
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
