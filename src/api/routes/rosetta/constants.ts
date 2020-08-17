export class RosettaConstants {
  static readonly blockchain = 'stacks';
  static readonly network = 'testnet';
  static readonly rosettaVersion = '1.4.2';
}

export class RosettaErrorCodes {
  static readonly invalidAccount = 601;
  static readonly insufficientFunds = 602;
  static readonly accountEmpty = 603;
  static readonly invalidBlockIndex = 604;
  static readonly getBlockFailed = 605;
  static readonly invalidBlockHash = 606;
  static readonly getTransactionFailed = 607;
  static readonly invalidTransactionHash = 608;
  static readonly invalidParams = 609;
  static readonly invalidContractAddress = 610;
}
