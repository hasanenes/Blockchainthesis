# Blockchain-Based Certificate Verification for Education

This repository contains the Solidity contracts and experiment scripts used for a bachelor thesis on blockchain-based academic certificate verification.

The project evaluates different ways to register certificate commitments on Ethereum-style smart contracts. The main goal is to compare cost, scalability, and verification trade-offs when storing certificate hashes directly versus storing Merkle roots for certificate batches.

## Overview

The system does not store certificate PDFs or personal certificate data on-chain. Instead, it stores cryptographic commitments:

- individual certificate hashes,
- Merkle roots representing batches of certificates,
- optional revocation status.

Verification is performed by recomputing the certificate commitment and checking whether it matches a registered on-chain value.

## Architectures

### Architecture A: Single Hash Registry

`CertificateRegistry.sol`

Stores one certificate hash per certificate.

- Simple direct lookup verification.
- Registration cost grows linearly with the number of certificates.
- Useful as a baseline for small-scale registration.

### Architecture B: Merkle Batch Registry

`BatchCertificateRegistry.sol`

Stores one Merkle root per batch of certificates.

- Many certificates are represented by one on-chain root.
- Registration cost remains nearly constant per batch.
- Verification requires a Merkle proof.

### Architecture C: Bulk Array Registry

`BulkCertificateRegistry.sol`

Registers many certificate hashes in one transaction.

- Reduces repeated transaction overhead.
- Still writes one storage slot per certificate.
- Used to test whether transaction count or storage writes are the main bottleneck.

### Revocation Variants

`RevocableCertificateRegistry.sol` and `RevocableBatchCertificateRegistry.sol`

These contracts evaluate certificate revocation.

- Per-certificate revocation is precise but requires additional storage per revoked certificate.
- Root-level revocation is cheaper for Merkle batches but invalidates the whole batch.

### Domain-Separated Merkle Verification

`SecureBatchCertificateRegistry.sol`

This version separates Merkle leaves from internal nodes:

- leaves use a `0x00` prefix,
- internal nodes use a `0x01` prefix.

This prevents internal Merkle nodes from being accepted as certificate leaves during proof verification.

## Scripts

The `scripts/` folder contains benchmark and helper scripts:

- `benchmark.js` - compares Architecture A and Architecture B.
- `extended_benchmark.js` - compares A, B, C, and revocation variants.
- `offchain_benchmark.js` - measures hashing, Merkle tree construction, and proof generation time.
- `cost_sensitivity.js` - estimates monetary cost under different gas and ETH price assumptions.
- `canonicalize.js` - normalizes certificate fields before hashing.
- `canonicalization_benchmark.js` - compares raw PDF hashing with canonical field hashing.
- `generate_dataset.js` - generates realistic certificate PDF samples and hash manifests.
- `realistic_benchmark.js` - compares gas results for realistic generated certificate hashes and synthetic hashes.
- `baseline_comparison.js` - compares blockchain registration against non-blockchain tamper-evidence baselines.
- `merkle.js` and `merkle_ds.js` - helper functions for Merkle tree construction.

## Requirements

The scripts are designed for a Hardhat-based Ethereum development environment.

Recommended tools:

- Node.js 18+
- Hardhat
- Solidity 0.8.24

