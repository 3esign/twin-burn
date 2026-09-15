/**
 * TWIN BURN ($TWIN) - Launch Script
 * 
 * Prema SL-176 (Zero-Haste Gate), ovaj skript NE SME sadrzavati tvrdo kodiran privatni kljuc 
 * niti vrsiti direktan deploy bez eksplicitne provere klijenta.
 * 
 * Ovaj skript generise payload za Pump.fun V2 Create i Fee-Sharing instrukcije.
 */

const { PublicKey, Keypair } = require('@solana/web3.js');

// 1. Ouroboros PDA Program i Derivacija
const OUROBOROS_PROGRAM_ID = new PublicKey('GyNLsJ8dBoymAxiPWcKFUmZhGzNpGhLT6R1DZAbi9Res'); // Ouroboros V1 program (placeholder)
const PUMP_FUN_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfX4LdEX2P6Zz1S6Kz2');

// 2. Generisanje TWIN Minta
const mintKeypair = Keypair.generate();
console.log('--- NOVI MINT GENERISAN ---');
console.log('Mint Public Key:', mintKeypair.publicKey.toBase58());

// Derivacija Vault PDA za TWIN
const [vaultPda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('ouroboros'), mintKeypair.publicKey.toBuffer()],
    OUROBOROS_PROGRAM_ID
);

console.log('Vault PDA:', vaultPda.toBase58());

// 3. Konfiguracija Fee-Sharing-a (Septembar 2026 Pump.fun API)
// Ukupno: 10000 bps (100% od 1.25% fee-a)
const feeSplit = {
    // 50% ide u Ouroboros Vault za Burn Crank
    recipient1: {
        address: vaultPda.toBase58(),
        shareBps: 5000 
    },
    // 30% ide na Pump.fun native Holder Rewards ugovor
    recipient2: {
        address: 'HRwdG617887R7Jj7x7h2hH9vQ7F9z7V92P8N8j5H9f4Q', // Native Holder Rewards PDA
        shareBps: 3000
    },
    // 20% operativni prihod
    recipient3: {
        address: 'HXFDaHyZ3i477z1BakiTWZg9UQN8rcreruuv9ifC1HvM', // Semir
        shareBps: 2000
    }
};

console.log('\\n--- FEE SHARING SPLIT ---');
console.log('Ouroboros Vault (Buy&Burn):', feeSplit.recipient1.shareBps / 100, '%');
console.log('Native Holder Rewards:', feeSplit.recipient2.shareBps / 100, '%');
console.log('Semir Treasury:', feeSplit.recipient3.shareBps / 100, '%');

console.log('\\nSpreman za potpisivanje. Koristi Pump.fun SDK V2 za slanje transakcije.');
console.log('Ocekivan trosak: ~0.016 SOL (Kreiranje + Fee lock).');
