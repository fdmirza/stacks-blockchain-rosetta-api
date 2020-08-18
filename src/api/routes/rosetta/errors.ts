/**
 * Rosetta all possible errors
 */

export const RosettaErrors = {
  invalidAccount: {
    code: 601,
    message: 'Invalid Account',
    retriable: true,
  },
  insufficientFunds: {
    code: 602,
    message: 'Insufficient Funds',
    retriable: true,
  },
  accountEmpty: {
    code: 603,
    message: 'Account is empty',
    retriable: true,
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
    retriable: true,
  },
  transactionNotFound: {
    code: 607,
    message: 'Transaction not found',
    retriable: true,
  },
  invalidTransactionHash: {
    code: 608,
    message: 'Invalid transaction hash',
    retriable: true,
  },
  invalidParams: {
    code: 609,
    message: 'invalid params',
    retriable: true,
  },
  invalidNetwork: {
    code: 610,
    message: 'Invalid network.',
    retriable: true,
  },
  invalidBlockchain: {
    code: 611,
    message: 'Invalid blockchain.',
    retriable: true,
  },
  unknownError: {
    code: 612,
    message: 'Unknown error.',
    retriable: false,
  },
};