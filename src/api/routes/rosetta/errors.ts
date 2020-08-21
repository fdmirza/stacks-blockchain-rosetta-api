/**
 * Rosetta all possible errors
 */

export const RosettaErrors = {
  invalidAccount: {
    code: 601,
    message: 'Invalid Account',
    retriable: false,
  },
  insufficientFunds: {
    code: 602,
    message: 'Insufficient Funds',
    retriable: false,
  },
  accountEmpty: {
    code: 603,
    message: 'Account is empty',
    retriable: false,
  },
  invalidBlockIndex: {
    code: 604,
    message: 'Invalid block index',
    retriable: true,
  },
  blockNotFound: {
    code: 605,
    message: 'Block not found',
    retriable: true,
  },
  invalidBlockHash: {
    code: 606,
    message: 'Invalid block hash',
    retriable: false,
  },
  transactionNotFound: {
    code: 607,
    message: 'Transaction not found',
    retriable: true,
  },
  invalidTransactionHash: {
    code: 608,
    message: 'Invalid transaction hash',
    retriable: false,
  },
  invalidParams: {
    code: 609,
    message: 'Invalid params',
    retriable: false,
  },
  invalidNetwork: {
    code: 610,
    message: 'Invalid network.',
    retriable: false,
  },
  invalidBlockchain: {
    code: 611,
    message: 'Invalid blockchain.',
    retriable: false,
  },
  unknownError: {
    code: 612,
    message: 'Unknown error.',
    retriable: false,
  },
  emptyNetworkIdentifier: {
    code: 613,
    message: 'Network identifier object is null',
    retriable: false,
  },
  emptyAccountIdentifier: {
    code: 614,
    message: 'Account identifier object is null',
    retriable: false,
  },
  invalidBlockIdentifier: {
    code: 615,
    message: 'Block identifier is null',
    retriable: false,
  },
  emptyBlockchain: {
    code: 616,
    message: 'Blockchain name is null',
    retriable: false,
  },
  emptyNetwork: {
    code: 617,
    message: 'Network name is null',
    retriable: false,
  },
  invalidRequestBody: {
    code: 618,
    message: 'Invalid schema',
    retriable: false,
    details: {}
  }
};
