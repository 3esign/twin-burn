const RPC_ENDPOINT = 'https://solana-rpc.publicnode.com'; // SL-174: publicnode allows CORS and raw getAccountInfo

// Constants updated post-launch
const TOKEN_MINT = 'f44s44vzXxuzmT3P1pXLv6ErEhMjkLxyhYorYzj1GJs';
const VAULT_PDA = 'BkQWLJzzhngFqMA4DfJuXiNzfv6hSyVmt8mwfXSLQRE7';

const connectBtn = document.getElementById('connect-btn');
const crankBtn = document.getElementById('crank-btn');
const walletAddressDiv = document.getElementById('wallet-address');
const vaultBalanceDiv = document.getElementById('vault-balance');
const holderYieldDiv = document.getElementById('holder-yield');
const statusMsg = document.getElementById('status-msg');

let wallet = null;

// SL-171: Mobile Deep Link Fallback
function connectWallet() {
    if (window.solana && window.solana.isPhantom) {
        window.solana.connect()
            .then(res => {
                wallet = res.publicKey.toString();
                connectBtn.classList.add('hidden');
                walletAddressDiv.textContent = 'Connected: ' + wallet.slice(0, 4) + '...' + wallet.slice(-4);
                walletAddressDiv.classList.remove('hidden');
                crankBtn.disabled = false;
                crankBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                statusMsg.textContent = '';
            })
            .catch(err => {
                console.error(err);
                statusMsg.textContent = 'Connection failed.';
            });
    } else {
        // Fallback for mobile
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://phantom.app/ul/browse/${currentUrl}?ref=${currentUrl}`;
    }
}

connectBtn.addEventListener('click', connectWallet);

crankBtn.addEventListener('click', async () => {
    if (!wallet) return;
    
    crankBtn.disabled = true;
    crankBtn.textContent = 'CRANKING...';
    
    try {
        // Here we will construct the transaction using MiniSol
        // For now, simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        statusMsg.textContent = 'Transaction successful! (Simulated)';
        statusMsg.classList.replace('text-red-400', 'text-green-400');
    } catch (e) {
        statusMsg.textContent = 'Transaction failed.';
        statusMsg.classList.replace('text-green-400', 'text-red-400');
    } finally {
        crankBtn.disabled = false;
        crankBtn.textContent = '🔥 STOKE THE FIRE (CRANK)';
    }
});

// Fetch on-chain data (SL-174 raw getAccountInfo approach)
async function fetchOnChainData() {
    try {
        // Fetch Vault PDA balance (Native SOL balance)
        // Since we don't have the real PDA yet, we will mock it
        if (VAULT_PDA !== 'TBD_OUROBOROS_VAULT_PDA') {
            const res = await fetch(RPC_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getAccountInfo',
                    params: [VAULT_PDA, { encoding: 'base64' }]
                })
            });
            const data = await res.json();
            if (data.result && data.result.value) {
                const lamports = data.result.value.lamports;
                vaultBalanceDiv.textContent = (lamports / 1e9).toFixed(3) + ' SOL';
            }
        } else {
            // Mock data for demo
            vaultBalanceDiv.textContent = '12.450 SOL';
            holderYieldDiv.textContent = '7.320 SOL';
        }
    } catch (e) {
        console.error('Failed to fetch data', e);
    }
}

// Initial fetch
fetchOnChainData();
setInterval(fetchOnChainData, 10000);
