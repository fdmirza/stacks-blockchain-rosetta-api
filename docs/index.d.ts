/**
  This file is generated automatically. **DO NOT MODIFY THIS FILE DIRECTLY**
  Updates are made by editing the JSON Schema files in the 'docs/' directory,
  then running the 'yarn build' script.
*/

/**
 * GET request that returns address assets
 */
export interface AddressAssetsListResponse {
  limit: number;
  offset: number;
  total: number;
  results: TransactionEvent[];
}

/**
 * GET request that returns address balances
 */
export interface AddressBalanceResponse {
  /**
   * Balance
   */
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
  };
  fungible_tokens: {
    /**
     * Balance
     *
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "*".
     */
    [k: string]: {
      balance: string;
      total_sent: string;
      total_received: string;
    };
  };
  non_fungible_tokens: {
    /**
     * NftBalance
     *
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "*".
     */
    [k: string]: {
      count: string;
      total_sent: string;
      total_received: string;
    };
  };
}

/**
 * GET request that returns address balances
 */
export interface AddressStxBalanceResponse {
  balance: string;
  total_sent: string;
  total_received: string;
}

/**
 * GET request that returns account transactions
 */
export interface AddressTransactionsListResponse {
  limit: number;
  offset: number;
  total: number;
  results: (MempoolTransaction | Transaction)[];
}

/**
 * GET request that returns blocks
 */
export interface BlockListResponse {
  /**
   * The number of blocks to return
   */
  limit: number;
  /**
   * The number to blocks to skip (starting at `0`)
   */
  offset: number;
  /**
   * The number of blocks available
   */
  total: number;
  results: Block[];
}

/**
 * GET request for account data
 */
export interface AccountDataResponse {
  balance: string;
  nonce: number;
  balance_proof: string;
  nonce_proof: string;
}

/**
 * GET request to get contract interface
 */
export interface ContractInterfaceResponse {
  /**
   * List of defined methods
   */
  functions: unknown[];
  /**
   * List of defined variables
   */
  variables: unknown[];
  /**
   * List of defined data-maps
   */
  maps: unknown[];
  /**
   * List of fungible tokens in the contract
   */
  fungible_tokens: unknown[];
  /**
   * List of non-fungible tokens in the contract
   */
  non_fungible_tokens: unknown[];
}

/**
 * GET request to get contract source
 */
export interface ContractSourceResponse {
  source: string;
  publish_height: number;
  proof: string;
}

/**
 * GET request that core node information
 */
export interface CoreNodeInfoResponse {
  limit?: number;
  peer_version: number;
  burn_consensus: string;
  burn_block_height: number;
  stable_burn_consensus: string;
  stable_burn_block_height: number;
  server_version: string;
  network_id: number;
  parent_network_id: number;
  stacks_tip_height: number;
  stacks_tip: string;
  stacks_tip_burn_block: string;
  exit_at_block_height: number;
}

/**
 * POST request that runs the faucet
 */
export interface RunFaucetResponse {
  /**
   * Indicates if the faucet call was successful
   */
  success: boolean;
  /**
   * The transaction ID for the faucet call
   */
  txId?: string;
  /**
   * Raw transaction in hex string representation
   */
  txRaw?: string;
}

/**
 * The block_identifier uniquely identifies a block in a particular network.
 */
export interface RosettaBlockIdentifier {
  /**
   * This is also known as the block height.
   */
  index: number;
  /**
   * Block hash
   */
  hash: string;
}

/**
 * A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions). As a result of the consensus algorithm of some blockchains, blocks can be omitted (i.e. certain block indexes can be skipped). If a query for one of these omitted indexes is made, the response should not include a Block object. It is VERY important to note that blocks MUST still form a canonical, connected chain of blocks where each block has a unique index. In other words, the PartialBlockIdentifier of a block after an omitted block should reference the last non-omitted block.
 */
export interface RosettaBlockResponse {
  block?: RosettaBlock;
  /**
   * Some blockchains may require additional transactions to be fetched that weren't returned in the block response (ex: block only returns transaction hashes). For blockchains with a lot of transactions in each block, this can be very useful as consumers can concurrently fetch all transactions returned.
   */
  other_transactions?: OtherTransactionIdentifier[];
}

/**
 * Blocks contain an array of Transactions that occurred at a particular BlockIdentifier. A hard requirement for blocks returned by Rosetta implementations is that they MUST be inalterable: once a client has requested and received a block identified by a specific BlockIndentifier, all future calls for that same BlockIdentifier must return the same block contents.
 */
export interface RosettaBlock {
  block_identifier: RosettaBlockIdentifier;
  parent_block_identifier: RosettaParentBlockIdentifier;
  /**
   * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
   */
  timestamp: number;
  /**
   * All the transactions in the block
   */
  transactions: RosettaTransaction[];
  /**
   * meta data
   */
  metadata?: {
    transactions_root: string;
    difficulty: string;
    [k: string]: unknown | undefined;
  };
}

/**
 * The block_identifier uniquely identifies a block in a particular network.
 */
export interface RosettaParentBlockIdentifier {
  /**
   * This is also known as the block height.
   */
  index: number;
  /**
   * Block hash
   */
  hash: string;
}

/**
 * The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated).
 */
export interface RosettaAccount {
  /**
   * The address may be a cryptographic public key (or some encoding of it) or a provided username.
   */
  address: string;
  sub_account?: RosettaSubAccount;
  /**
   * Blockchains that utilize a username model (where the address is not a derivative of a cryptographic public key) should specify the public key(s) owned by the address in metadata.
   */
  metadata?: {
    [k: string]: unknown | undefined;
  };
}

/**
 * Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency.
 */
export interface RosettaAmount {
  /**
   * Value of the transaction in atomic units represented as an arbitrary-sized signed integer. For example, 1 BTC would be represented by a value of 100000000.
   */
  value: string;
  currency: RosettaCurrency;
  /**
   * An explanation about the purpose of this instance.
   */
  metadata?: {
    [k: string]: unknown | undefined;
  };
}

/**
 * CoinChange is used to represent a change in state of a some coin identified by a coin_identifier. This object is part of the Operation model and must be populated for UTXO-based blockchains. Coincidentally, this abstraction of UTXOs allows for supporting both account-based transfers and UTXO-based transfers on the same blockchain (when a transfer is account-based, don't populate this model).
 */
export interface RosettaCoinChange {
  /**
   * CoinIdentifier uniquely identifies a Coin.
   */
  coin_identifier: {
    /**
     * Identifier should be populated with a globally unique identifier of a Coin. In Bitcoin, this identifier would be transaction_hash:index.
     */
    identifier: string;
    [k: string]: unknown | undefined;
  };
  /**
   * CoinActions are different state changes that a Coin can undergo. When a Coin is created, it is coin_created. When a Coin is spent, it is coin_spent. It is assumed that a single Coin cannot be created or spent more than once.
   */
  coin_action: "coin_created" | "coin_spent";
}

/**
 * Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins).
 */
export interface RosettaCurrency {
  /**
   * Canonical symbol associated with a currency.
   */
  symbol: string;
  /**
   * Number of decimal places in the standard unit representation of the amount. For example, BTC has 8 decimals. Note that it is not possible to represent the value of some currency in atomic units that is not base 10.
   */
  decimals: number;
  /**
   * Any additional information related to the currency itself. For example, it would be useful to populate this object with the contract address of an ERC-20 token.
   */
  metadata?: {
    [k: string]: unknown | undefined;
  };
}

/**
 * Get a transaction in the mempool by its Transaction Identifier. This is a separate request than fetching a block transaction (/block/transaction) because some blockchain nodes need to know that a transaction query is for something in the mempool instead of a transaction in a block. Transactions may not be fully parsable until they are in a block (ex: may not be possible to determine the fee to pay before a transaction is executed). On this endpoint, it is ok that returned transactions are only estimates of what may actually be included in a block.
 */
export interface RosettaMempoolTransactionRequest {
  network_identifier: NetworkIdentifier;
  transaction_identifier: TransactionIdentifier;
}

/**
 * The root schema comprises the entire JSON document.
 */
export interface RosettaMempoolTransactionListResponse {
  /**
   * An explanation about the purpose of this instance.
   */
  transaction_identifiers: TransactionIdentifier[];
  /**
   * meta data to support pagination
   */
  metadata?: {
    /**
     * number of transactions returned
     */
    limit?: number;
    /**
     * Total number of transactions
     */
    total?: number;
    /**
     * Response offset
     */
    offset?: number;
    [k: string]: unknown | undefined;
  };
}

/**
 * A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid).
 */
export interface RosettaMempoolTransactionResponse {
  transaction: RosettaTransaction;
  /**
   * An explanation about the purpose of this instance.
   */
  metadata?: {
    /**
     * An explanation about the purpose of this instance.
     */
    descendant_fees: number;
    /**
     * An explanation about the purpose of this instance.
     */
    ancestor_count: number;
    [k: string]: unknown | undefined;
  };
}

/**
 * The network_identifier specifies which network a particular object is associated with.
 */
export interface NetworkIdentifier {
  /**
   * Blockchain name
   */
  blockchain: string;
  /**
   * If a blockchain has a specific chain-id or network identifier, it should go in this field. It is up to the client to determine which network-specific identifier is mainnet or testnet.
   */
  network: string;
  /**
   * In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains.
   */
  sub_network_identifier?: {
    /**
     * Netowork name
     */
    network: string;
    /**
     * Meta data from subnetwork identifier
     */
    metadata?: {
      /**
       * producer
       */
      producer: string;
      [k: string]: unknown | undefined;
    };
    [k: string]: unknown | undefined;
  };
}

/**
 * The operation_identifier uniquely identifies an operation within a transaction.
 */
export interface RosettaOperationIdentifier {
  /**
   * The operation index is used to ensure each operation has a unique identifier within a transaction. This index is only relative to the transaction and NOT GLOBAL. The operations in each transaction should start from index 0. To clarify, there may not be any notion of an operation index in the blockchain being described.
   */
  index: number;
  /**
   * Some blockchains specify an operation index that is essential for client use. For example, Bitcoin uses a network_index to identify which UTXO was used in a transaction. network_index should not be populated if there is no notion of an operation index in a blockchain (typically most account-based blockchains).
   */
  network_index?: number;
}

/**
 * Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction.
 */
export interface RosettaOperaion {
  operation_identifier: RosettaOperationIdentifier;
  /**
   * Restrict referenced related_operations to identifier indexes < the current operation_identifier.index. This ensures there exists a clear DAG-structure of relations. Since operations are one-sided, one could imagine relating operations in a single transfer or linking operations in a call tree.
   */
  related_operations?: RosettaRelatedOperation[];
  /**
   * The network-specific type of the operation. Ensure that any type that can be returned here is also specified in the NetworkStatus. This can be very useful to downstream consumers that parse all block data.
   */
  type: string;
  /**
   * The network-specific status of the operation. Status is not defined on the transaction object because blockchains with smart contracts may have transactions that partially apply. Blockchains with atomic transactions (all operations succeed or all operations fail) will have the same status for each operation.
   */
  status: string;
  account?: RosettaAccount;
  amount?: RosettaAmount;
  coin_change?: RosettaCoinChange;
  /**
   * Operations Meta Data
   */
  metadata?: {
    /**
     * The asm
     */
    asm: string;
    /**
     * The hex
     */
    hex: string;
    [k: string]: unknown | undefined;
  };
}

/**
 * The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool.
 */
export interface OtherTransactionIdentifier {
  /**
   * Any transactions that are attributable only to a block (ex: a block event) should use the hash of the block as the identifier.
   */
  hash: string;
}

/**
 * Restrict referenced related_operations to identifier indexes < the current operation_identifier.index. This ensures there exists a clear DAG-structure of relations. Since operations are one-sided, one could imagine relating operations in a single transfer or linking operations in a call tree.
 */
export interface RosettaRelatedOperation {
  /**
   * Describes the index of related operation.
   */
  index?: number;
  operation_identifier: RosettaOperationIdentifier;
}

/**
 * The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated).
 */
export interface RosettaSubAccount {
  /**
   * The address may be a cryptographic public key (or some encoding of it) or a provided username.
   */
  address: string;
  /**
   * Blockchains that utilize a username model (where the address is not a derivative of a cryptographic public key) should specify the public key(s) owned by the address in metadata.
   */
  metadata?: {
    [k: string]: unknown | undefined;
  };
}

/**
 * The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool.
 */
export interface TransactionIdentifier {
  /**
   * Any transactions that are attributable only to a block (ex: a block event) should use the hash of the block as the identifier.
   */
  hash: string;
}

/**
 * Transactions contain an array of Operations that are attributable to the same TransactionIdentifier.
 */
export interface RosettaTransaction {
  transaction_identifier: TransactionIdentifier;
  /**
   * List of operations
   */
  operations: RosettaOperaion[];
  /**
   * Transactions that are related to other transactions (like a cross-shard transaction) should include the tranaction_identifier of these transactions in the metadata.
   */
  metadata?: {
    /**
     * The Size
     */
    size: number;
    /**
     * The locktime
     */
    lockTime: number;
    [k: string]: unknown | undefined;
  };
}

/**
 * A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for.
 */
export interface RosettaNetworkListResponse {
  /**
   * The network_identifier specifies which network a particular object is associated with.
   */
  network_identifiers: NetworkIdentifier[];
}

/**
 * NetworkStatusResponse contains basic information about the node's view of a blockchain network. It is assumed that any BlockIdentifier.Index less than or equal to CurrentBlockIdentifier.Index can be queried. If a Rosetta implementation prunes historical state, it should populate the optional oldest_block_identifier field with the oldest block available to query. If this is not populated, it is assumed that the genesis_block_identifier is the oldest queryable block. If a Rosetta implementation performs some pre-sync before it is possible to query blocks, sync_status should be populated so that clients can still monitor healthiness. Without this field, it may appear that the implementation is stuck syncing and needs to be terminated.
 */
export interface RosettaNetworkStatusResponse {
  current_block_identifier: RosettaBlockIdentifier;
  /**
   * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
   */
  current_block_timestamp: number;
  genesis_block_identifier: RosettaGenesisBlockIdentifier;
  oldest_block_identifier?: RosettaOldestBlockIdentifier;
  sync_status?: RosettaSyncStatus;
  /**
   * Peers information
   */
  peers: RosettaPeers[];
}

/**
 * GET request that returns transactions
 */
export interface MempoolTransactionListResponse {
  limit: number;
  offset: number;
  total: number;
  results: MempoolTransaction[];
}

/**
 * GET request that returns transactions
 */
export interface TransactionResults {
  /**
   * The number of transactions to return
   */
  limit: number;
  /**
   * The number to transactions to skip (starting at `0`)
   */
  offset: number;
  /**
   * The number of transactions available
   */
  total: number;
  results: Transaction[];
}

/**
 * A block
 */
export interface Block {
  /**
   * Set to `true` if block corresponds to the canonical chain tip
   */
  canonical: boolean;
  /**
   * Height of the block
   */
  height: number;
  /**
   * Hash representing the block
   */
  hash: string;
  /**
   * Hash of the prant block
   */
  parent_block_hash: string;
  /**
   * Unix timestamp (in seconds) indicating when this block was mined.
   */
  burn_block_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) indicating when this block was mined.
   */
  burn_block_time_iso: string;
  /**
   * List of transactions included in the block
   */
  txs: string[];
}

/**
 * Describes representation of a Type-0 Stacks 2.0 transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-0-transferring-an-asset
 */
export interface MempoolTokenTransferTransaction {
  tx_id: string;
  tx_status: "pending";
  tx_result?: {
    hex: string;
    repr: string;
  };
  /**
   * Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  /**
   * A unix timestamp (in seconds) indicating when the transaction broadcast was received by the node.
   */
  receipt_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when the transaction broadcast was received by the node.
   */
  receipt_time_iso: string;
  tx_type: "token_transfer";
  token_transfer: {
    recipient_address: string;
    /**
     * Integer string (64-bit unsigned integer)
     */
    amount: string;
    /**
     * Hex encoded arbitrary message, up to 34 bytes length (should try decoding to an ASCII string)
     */
    memo: string;
  };
}

/**
 * Describes representation of a Type-1 Stacks 2.0 transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-1-instantiating-a-smart-contract
 */
export interface MempoolSmartContractTransaction {
  tx_id: string;
  tx_status: "pending";
  tx_result?: {
    hex: string;
    repr: string;
  };
  /**
   * Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  /**
   * A unix timestamp (in seconds) indicating when the transaction broadcast was received by the node.
   */
  receipt_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when the transaction broadcast was received by the node.
   */
  receipt_time_iso: string;
  tx_type: "smart_contract";
  smart_contract: {
    contract_id: string;
    /**
     * Clarity code of the smart contract being deployed
     */
    source_code: string;
  };
  post_conditions?: PostCondition[];
}

/**
 * Describes representation of a Type 2 Stacks 2.0 transaction: Contract Call
 */
export interface MempoolContractCallTransaction {
  tx_id: string;
  tx_status: "pending";
  tx_result?: {
    hex: string;
    repr: string;
  };
  /**
   * Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  /**
   * A unix timestamp (in seconds) indicating when the transaction broadcast was received by the node.
   */
  receipt_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when the transaction broadcast was received by the node.
   */
  receipt_time_iso: string;
  tx_type: "contract_call";
  contract_call: {
    contract_id: string;
    /**
     * Name of the Clarity function to be invoked
     */
    function_name: string;
  };
  post_conditions: PostCondition[];
}

/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export interface MempoolPoisonMicroblockTransaction {
  tx_id: string;
  tx_status: "pending";
  tx_result?: {
    hex: string;
    repr: string;
  };
  /**
   * Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  /**
   * A unix timestamp (in seconds) indicating when the transaction broadcast was received by the node.
   */
  receipt_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when the transaction broadcast was received by the node.
   */
  receipt_time_iso: string;
  tx_type: "poison_microblock";
  poison_microblock: {
    /**
     * Hex encoded microblock header
     */
    microblock_header_1: string;
    /**
     * Hex encoded microblock header
     */
    microblock_header_2: string;
  };
}

/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export interface MempoolCoinbaseTransaction {
  tx_id: string;
  tx_status: "pending";
  tx_result?: {
    hex: string;
    repr: string;
  };
  /**
   * Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  /**
   * A unix timestamp (in seconds) indicating when the transaction broadcast was received by the node.
   */
  receipt_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when the transaction broadcast was received by the node.
   */
  receipt_time_iso: string;
  tx_type: "coinbase";
  coinbase_payload: {
    /**
     * Hex encoded 32-byte scratch space for block leader's use
     */
    data: string;
  };
}

/**
 * Describes all transaction types on Stacks 2.0 blockchain
 */
export type MempoolTransaction =
  | MempoolTokenTransferTransaction
  | MempoolSmartContractTransaction
  | MempoolContractCallTransaction
  | MempoolPoisonMicroblockTransaction
  | MempoolCoinbaseTransaction;

/**
 * The network_identifier specifies which network a particular object is associated with.
 */
export interface NetworkIdentifier {
  /**
   * Blockchain name
   */
  blockchain: string;
  /**
   * If a blockchain has a specific chain-id or network identifier, it should go in this field. It is up to the client to determine which network-specific identifier is mainnet or testnet.
   */
  network: string;
  /**
   * In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains.
   */
  sub_network_identifier?: {
    /**
     * Netowork name
     */
    network: string;
    /**
     * Meta data from subnetwork identifier
     */
    metadata?: {
      /**
       * producer
       */
      producer: string;
      [k: string]: unknown | undefined;
    };
    [k: string]: unknown | undefined;
  };
}

/**
 * AA Peer is a representation of a node's peer.
 */
export interface RosettaPeers {
  /**
   * peer id
   */
  peer_id: string;
  /**
   * meta data
   */
  metadata?: {
    [k: string]: unknown | undefined;
  };
}

/**
 * SyncStatus is used to provide additional context about an implementation's sync status. It is often used to indicate that an implementation is healthy when it cannot be queried until some sync phase occurs. If an implementation is immediately queryable, this model is often not populated.
 */
export interface RosettaSyncStatus {
  /**
   * CurrentIndex is the index of the last synced block in the current stage.
   */
  current_index: number;
  /**
   * TargetIndex is the index of the block that the implementation is attempting to sync to in the current stage.
   */
  target_index?: number;
  /**
   * Stage is the phase of the sync process.
   */
  stage?: string;
}

export interface PostConditionStx {
  principal: PostConditionPrincipal;
  condition_code: PostConditionFungibleConditionCode;
  amount: string;
  type: "stx";
}

export interface PostConditionFungible {
  principal: PostConditionPrincipal;
  condition_code: PostConditionFungibleConditionCode;
  type: "fungible";
  amount: string;
  asset: {
    asset_name: string;
    contract_address: string;
    contract_name: string;
  };
}

export interface PostConditionNonFungible {
  principal: PostConditionPrincipal;
  condition_code: PostConditionNonFungibleConditionCode;
  type: "non_fungible";
  asset_value: {
    hex: string;
    repr: string;
  };
  asset: {
    asset_name: string;
    contract_address: string;
    contract_name: string;
  };
}

/**
 * A fungible condition code encodes a statement being made for either STX or a fungible token, with respect to the originating account.
 */
export type PostConditionFungibleConditionCode =
  | "sent_equal_to"
  | "sent_greater_than"
  | "sent_greater_than_or_equal_to"
  | "sent_less_than"
  | "sent_less_than_or_equal_to";

export type PostConditionMode = "allow" | "deny";

/**
 * A non-fungible condition code encodes a statement being made about a non-fungible token, with respect to whether or not the particular non-fungible token is owned by the account.
 */
export type PostConditionNonFungibleConditionCode = "sent" | "not_sent";

export type PostConditionPrincipalType = "principal_origin" | "principal_standard" | "principal_contract";

export type PostConditionPrincipal =
  | {
      /**
       * String literal of type `PostConditionPrincipalType`
       */
      type_id: "principal_origin";
    }
  | {
      /**
       * String literal of type `PostConditionPrincipalType`
       */
      type_id: "principal_standard";
      address: string;
    }
  | {
      /**
       * String literal of type `PostConditionPrincipalType`
       */
      type_id: "principal_contract";
      address: string;
      contract_name: string;
    };

export type PostConditionType = "stx" | "non_fungible" | "fungible";

/**
 * Post-conditionscan limit the damage done to a user's assets
 */
export type PostCondition = PostConditionStx | PostConditionFungible | PostConditionNonFungible;

/**
 * The block_identifier uniquely identifies a block in a particular network.
 */
export interface RosettaBlockIdentifier {
  /**
   * This is also known as the block height.
   */
  index: number;
  /**
   * Block hash
   */
  hash: string;
}

/**
 * The block_identifier uniquely identifies a block in a particular network.
 */
export interface RosettaGenesisBlockIdentifier {
  /**
   * This is also known as the block height.
   */
  index: number;
  /**
   * Block hash
   */
  hash: string;
}

/**
 * The block_identifier uniquely identifies a block in a particular network.
 */
export interface RosettaOldestBlockIdentifier {
  /**
   * This is also known as the block height.
   */
  index: number;
  /**
   * Block hash
   */
  hash: string;
}

export type TransactionEventAssetType = "transfer" | "mint" | "burn";

export interface TransactionEventAsset {
  asset_event_type?: TransactionEventAssetType;
  asset_id?: string;
  sender?: string;
  recipient?: string;
  amount?: string;
  value?: string;
}

export interface TransactionEventFungibleAsset {
  event_index: number;
  event_type: "fungible_token_asset";
  asset: {
    asset_event_type: string;
    asset_id: string;
    sender: string;
    recipient: string;
    amount: string;
  };
}

export interface TransactionEventNonFungibleAsset {
  event_index: number;
  event_type: "non_fungible_token_asset";
  asset: {
    asset_event_type: string;
    asset_id: string;
    sender: string;
    recipient: string;
    value: {
      hex: string;
      repr: string;
    };
  };
}

/**
 * Only present in `smart_contract` and `contract_call` tx types.
 */
export interface TransactionEventSmartContractLog {
  event_index: number;
  event_type: "smart_contract_log";
  contract_log: {
    contract_id: string;
    topic: string;
    value: {
      hex: string;
      repr: string;
    };
  };
}

/**
 * Only present in `smart_contract` and `contract_call` tx types.
 */
export interface TransactionEventStxAsset {
  event_index: number;
  event_type: "stx_asset";
  asset: TransactionEventAsset;
}

/**
 * Events types
 */
export type TransactionEventType =
  | "smart_contract_log"
  | "stx_asset"
  | "fungible_token_asset"
  | "non_fungible_token_asset";

export type TransactionEvent =
  | TransactionEventSmartContractLog
  | TransactionEventStxAsset
  | TransactionEventFungibleAsset
  | TransactionEventNonFungibleAsset;

/**
 * Describes representation of a Type-0 Stacks 2.0 transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-0-transferring-an-asset
 */
export interface TokenTransferTransaction {
  /**
   * Hash of the blocked this transactions was associated with
   */
  block_hash: string;
  /**
   * Height of the block this transactions was associated with
   */
  block_height: number;
  /**
   * Unix timestamp (in seconds) indicating when this block was mined
   */
  burn_block_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when this block was mined.
   */
  burn_block_time_iso: string;
  /**
   * Set to `true` if block corresponds to the canonical chain tip
   */
  canonical: boolean;
  /**
   * Transaction ID
   */
  tx_id: string;
  /**
   * Index of the transaction, indicating the order. Starts at `0` and increases with each transaction
   */
  tx_index: number;
  tx_status: TransactionStatus;
  /**
   * Result of the transaction. For contract calls, this will show the value returned by the call. For other transaction types, this will return a boolean indicating the success of the transaction.
   */
  tx_result?: {
    /**
     * Hex string representing the value fo the transaction result
     */
    hex: string;
    /**
     * Readable string of the transaction result
     */
    repr: string;
  };
  /**
   * Transaction fee as Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  /**
   * Address of the transaction initiator
   */
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  tx_type: "token_transfer";
  /**
   * List of transaction events
   */
  events: TransactionEvent[];
  token_transfer: {
    recipient_address: string;
    /**
     * Transfer amount as Integer string (64-bit unsigned integer)
     */
    amount: string;
    /**
     * Hex encoded arbitrary message, up to 34 bytes length (should try decoding to an ASCII string)
     */
    memo: string;
  };
}

/**
 * Describes representation of a Type-1 Stacks 2.0 transaction. https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#type-1-instantiating-a-smart-contract
 */
export interface SmartContractTransaction {
  /**
   * Hash of the blocked this transactions was associated with
   */
  block_hash: string;
  /**
   * Height of the block this transactions was associated with
   */
  block_height: number;
  /**
   * Unix timestamp (in seconds) indicating when this block was mined
   */
  burn_block_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when this block was mined.
   */
  burn_block_time_iso: string;
  /**
   * Set to `true` if block corresponds to the canonical chain tip
   */
  canonical: boolean;
  /**
   * Transaction ID
   */
  tx_id: string;
  /**
   * Index of the transaction, indicating the order. Starts at `0` and increases with each transaction
   */
  tx_index: number;
  tx_status: TransactionStatus;
  /**
   * Result of the transaction. For contract calls, this will show the value returned by the call. For other transaction types, this will return a boolean indicating the success of the transaction.
   */
  tx_result?: {
    /**
     * Hex string representing the value fo the transaction result
     */
    hex: string;
    /**
     * Readable string of the transaction result
     */
    repr: string;
  };
  /**
   * Transaction fee as Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  /**
   * Address of the transaction initiator
   */
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  tx_type: "smart_contract";
  /**
   * List of transaction events
   */
  events: TransactionEvent[];
  smart_contract: {
    /**
     * Contract identifier formatted as `<principaladdress>.<contract_name>`
     */
    contract_id: string;
    /**
     * Clarity code of the smart contract being deployed
     */
    source_code: string;
  };
  post_conditions?: PostCondition[];
}

/**
 * Describes representation of a Type 2 Stacks 2.0 transaction: Contract Call
 */
export interface ContractCallTransaction {
  /**
   * Hash of the blocked this transactions was associated with
   */
  block_hash: string;
  /**
   * Height of the block this transactions was associated with
   */
  block_height: number;
  /**
   * Unix timestamp (in seconds) indicating when this block was mined
   */
  burn_block_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when this block was mined.
   */
  burn_block_time_iso: string;
  /**
   * Set to `true` if block corresponds to the canonical chain tip
   */
  canonical: boolean;
  /**
   * Transaction ID
   */
  tx_id: string;
  /**
   * Index of the transaction, indicating the order. Starts at `0` and increases with each transaction
   */
  tx_index: number;
  tx_status: TransactionStatus;
  /**
   * Result of the transaction. For contract calls, this will show the value returned by the call. For other transaction types, this will return a boolean indicating the success of the transaction.
   */
  tx_result?: {
    /**
     * Hex string representing the value fo the transaction result
     */
    hex: string;
    /**
     * Readable string of the transaction result
     */
    repr: string;
  };
  /**
   * Transaction fee as Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  /**
   * Address of the transaction initiator
   */
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  tx_type: "contract_call";
  /**
   * List of transaction events
   */
  events: TransactionEvent[];
  contract_call: {
    /**
     * Contract identifier formatted as `<principaladdress>.<contract_name>`
     */
    contract_id: string;
    /**
     * Name of the Clarity function to be invoked
     */
    function_name: string;
    /**
     * Function definition, including function name and type as well as parameter names and types
     */
    function_signature: string;
    /**
     * List of arguments used to invoke the function
     */
    function_args?: {
      hex: string;
      repr: string;
      name: string;
      type: string;
    }[];
  };
  post_conditions: PostCondition[];
}

/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export interface PoisonMicroblockTransaction {
  /**
   * Hash of the blocked this transactions was associated with
   */
  block_hash: string;
  /**
   * Height of the block this transactions was associated with
   */
  block_height: number;
  /**
   * Unix timestamp (in seconds) indicating when this block was mined
   */
  burn_block_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when this block was mined.
   */
  burn_block_time_iso: string;
  /**
   * Set to `true` if block corresponds to the canonical chain tip
   */
  canonical: boolean;
  /**
   * Transaction ID
   */
  tx_id: string;
  /**
   * Index of the transaction, indicating the order. Starts at `0` and increases with each transaction
   */
  tx_index: number;
  tx_status: TransactionStatus;
  /**
   * Result of the transaction. For contract calls, this will show the value returned by the call. For other transaction types, this will return a boolean indicating the success of the transaction.
   */
  tx_result?: {
    /**
     * Hex string representing the value fo the transaction result
     */
    hex: string;
    /**
     * Readable string of the transaction result
     */
    repr: string;
  };
  /**
   * Transaction fee as Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  /**
   * Address of the transaction initiator
   */
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  tx_type: "poison_microblock";
  poison_microblock: {
    /**
     * Hex encoded microblock header
     */
    microblock_header_1: string;
    /**
     * Hex encoded microblock header
     */
    microblock_header_2: string;
  };
}

/**
 * Describes representation of a Type 3 Stacks 2.0 transaction: Poison Microblock
 */
export interface CoinbaseTransaction {
  /**
   * Hash of the blocked this transactions was associated with
   */
  block_hash: string;
  /**
   * Height of the block this transactions was associated with
   */
  block_height: number;
  /**
   * Unix timestamp (in seconds) indicating when this block was mined
   */
  burn_block_time: number;
  /**
   * An ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) timestamp indicating when this block was mined.
   */
  burn_block_time_iso: string;
  /**
   * Set to `true` if block corresponds to the canonical chain tip
   */
  canonical: boolean;
  /**
   * Transaction ID
   */
  tx_id: string;
  /**
   * Index of the transaction, indicating the order. Starts at `0` and increases with each transaction
   */
  tx_index: number;
  tx_status: TransactionStatus;
  /**
   * Result of the transaction. For contract calls, this will show the value returned by the call. For other transaction types, this will return a boolean indicating the success of the transaction.
   */
  tx_result?: {
    /**
     * Hex string representing the value fo the transaction result
     */
    hex: string;
    /**
     * Readable string of the transaction result
     */
    repr: string;
  };
  /**
   * Transaction fee as Integer string (64-bit unsigned integer).
   */
  fee_rate: string;
  /**
   * Address of the transaction initiator
   */
  sender_address: string;
  /**
   * Denotes whether the originating account is the same as the paying account
   */
  sponsored: boolean;
  sponsor_address?: string;
  post_condition_mode: PostConditionMode;
  tx_type: "coinbase";
  coinbase_payload: {
    /**
     * Hex encoded 32-byte scratch space for block leader's use
     */
    data: string;
  };
}

/**
 * Status of the transaction
 */
export type TransactionStatus = "success" | "pending" | "abort_by_response" | "abort_by_post_condition";

/**
 * String literal of all Stacks 2.0 transaction types
 */
export type TransactionType = "token_transfer" | "smart_contract" | "contract_call" | "poison_microblock" | "coinbase";

/**
 * Describes all transaction types on Stacks 2.0 blockchain
 */
export type Transaction =
  | TokenTransferTransaction
  | SmartContractTransaction
  | ContractCallTransaction
  | PoisonMicroblockTransaction
  | CoinbaseTransaction;

