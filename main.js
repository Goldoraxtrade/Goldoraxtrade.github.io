let playerBalance = 0;

// แสดงยอดเงิน
function updateBalance() {
  document.getElementById('player-balance').textContent = playerBalance;
}

// ซื้อขายสินทรัพย์
function buyAsset(asset, amount) {
  // สมมติราคาหุ้น 100 b/หุ้น
  let cost = 100 * amount;
  if(playerBalance >= cost){
    playerBalance -= cost;
    updateBalance();
    alert(`ซื้อ ${asset} จำนวน ${amount} หุ้นเรียบร้อย`);
  } else {
    alert("ยอดเงินไม่เพียงพอ");
  }
}

function sellAsset(asset, amount) {
  // สมมติราคาหุ้น 100 b/หุ้น
  let revenue = 100 * amount;
  playerBalance += revenue;
  updateBalance();
  alert(`ขาย ${asset} จำนวน ${amount} หุ้นเรียบร้อย`);
}

// ฝาก/ถอนไป LINE OA
function openLineOA() {
  window.open('https://goldoraxtrade.github.io/', '_blank');
}

// ฟังการส่ง request_balance_from_parent จาก iframe เกม
window.addEventListener('message', function(event){
  if(event.data === 'request_balance_from_parent'){
    event.source.postMessage({balance: playerBalance}, event.origin);
  }
});

updateBalance();
