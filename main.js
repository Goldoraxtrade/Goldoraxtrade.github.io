
/*
  main.js
  - Handles register, login, user storage, trading simulation, dice game, admin adjustments.
  - Users stored in localStorage under key 'gx_users'
  - currentUser stored as 'gx_current_user'
  - IDs start from 19000
*/

const LINE_OA = 'https://lin.ee/Mm1caQx'; // provided link

// Utility
function readUsers() {
  return JSON.parse(localStorage.getItem('gx_users') || '{}');
}
function writeUsers(u){ localStorage.setItem('gx_users', JSON.stringify(u)); }
function getNextId() {
  const meta = JSON.parse(localStorage.getItem('gx_meta') || '{"nextId":19000}');
  if(!meta.nextId) meta.nextId = 19000;
  return meta.nextId;
}
function incNextId() {
  const meta = JSON.parse(localStorage.getItem('gx_meta') || '{"nextId":19000}');
  meta.nextId = (meta.nextId || 19000) + 1;
  localStorage.setItem('gx_meta', JSON.stringify(meta));
}
function setCurrentUser(u){ localStorage.setItem('gx_current_user', u); }
function getCurrentUser(){ return localStorage.getItem('gx_current_user'); }
function logout(){ localStorage.removeItem('gx_current_user'); window.location.href='index.html'; }
function isLoggedIn(){ return !!getCurrentUser(); }

// Register
function registerUser() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  if(!username || !password) { alert('กรุณากรอกข้อมูลให้ครบ'); return; }
  const users = readUsers();
  // ensure unique username
  for(const id in users) if(users[id].username === username) { alert('Username นี้มีคนใช้แล้ว'); return; }
  const id = getNextId().toString();
  users[id] = { id: id, username: username, password: password, balance: 0, profitLoss: 0 };
  writeUsers(users);
  incNextId();
  alert('สมัครสมาชิกเรียบร้อย! ID ของคุณ: ' + id);
  window.location.href = 'index.html';
}

// Login
function loginUser() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  // admin check
  if(username === 'Admin' && password === 'Adminyai774570') {
    setCurrentUser('Admin'); window.location.href = 'admin.html'; return;
  }
  const users = readUsers();
  // login can accept ID or username
  let found = null;
  for(const id in users) {
    if(users[id].username === username || id === username) {
      found = users[id]; break;
    }
  }
  if(!found) { alert('ไม่พบผู้ใช้'); return; }
  if(found.password !== password) { alert('รหัสผ่านไม่ถูกต้อง'); return; }
  setCurrentUser(found.id);
  window.location.href = 'main.html';
}

// Load user data to platform page
function loadUserDataToPage() {
  const uid = getCurrentUser();
  const users = readUsers();
  const u = users[uid];
  if(!u) { alert('ไม่พบผู้ใช้'); logout(); return; }
  document.getElementById('user-id').innerText = u.id;
  document.getElementById('user-name').innerText = u.username;
  document.getElementById('balance-only').innerText = u.balance;
  document.getElementById('pl-only').innerText = u.profitLoss;
  const total = Number(u.balance || 0) + Number(u.profitLoss || 0);
  document.getElementById('total-balance').innerText = total;
  document.getElementById('display-balance').innerText = total + ' b';
  // show game area
  document.getElementById('game-area').style.display = 'block';
}

// Open LINE OA (deposit/withdraw)
function openLine(){ window.open(LINE_OA, '_blank'); alert('จะเปิด LINE OA เพื่อติดต่อฝาก/ถอน'); }

// Trading simulation (simple): random move per share, we simulate P/L impact
function trade(symbol, action) {
  const uid = getCurrentUser();
  const users = readUsers();
  const u = users[uid];
  if(!u) { alert('กรุณาล็อกอิน'); return; }
  // simple price move simulation: +/- 100-1000 per trade, positive if buy then market goes up etc.
  const move = Math.floor(Math.random()*1001) + 100; // 100..1100
  // For buy, we treat this as immediate unrealized P/L increase (player 'buys' and price moves favorably or not).
  // To keep it simple: buy produces random profit, sell produces random loss (or vice versa) - this is a placeholder.
  const sign = (action === 'buy') ? 1 : -1;
  const delta = sign * move;
  // Update profitLoss
  u.profitLoss = Number(u.profitLoss || 0) + delta;
  users[uid] = u; writeUsers(users);
  loadUserDataToPage();
  alert('ทำรายการ ' + action + ' ' + symbol + ' เสร็จ: ผลกระทบต่อกำไร/ขาดทุน ' + delta + ' b');
}

// Dice game (น้ำเต้า) - players bet and win 1.9x on correct result (simple random)
function playDice() {
  const uid = getCurrentUser();
  const users = readUsers();
  const u = users[uid];
  if(!u) { alert('กรุณาล็อกอิน'); return; }
  const bet = Number(document.getElementById('bet-amount').value || 0);
  if(bet <= 0) { alert('ใส่จำนวนเดิมพันที่ถูกต้อง'); return; }
  const totalBefore = Number(u.balance || 0) + Number(u.profitLoss || 0);
  if(bet > totalBefore) { alert('ยอดเงินไม่พอสำหรับเดิมพัน'); return; }
  // simple dice outcome 1-6, win if 4-6 (50% chance) -> payout 1.9x, lose bet otherwise
  const roll = Math.floor(Math.random()*6) + 1;
  let resultText = 'ผลลัพธ์ลูกเต๋า: ' + roll + '\n';
  let delta = 0;
  const win = roll >=4;
  if(win) {
    delta = Math.round(bet * 0.9); // profitLoss increases by net profit (payout 1.9x -> net +0.9*bet)
    u.profitLoss = Number(u.profitLoss || 0) + delta;
    resultText += 'คุณชนะ! กำไร ' + delta + ' b';
  } else {
    delta = -bet;
    u.profitLoss = Number(u.profitLoss || 0) + delta;
    resultText += 'คุณแพ้! ขาดทุน ' + (-delta) + ' b';
  }
  users[uid] = u; writeUsers(users);
  loadUserDataToPage();
  document.getElementById('game-result').innerText = resultText;
}

// Admin functions
function renderPlayers() {
  const users = readUsers();
  const wrap = document.getElementById('players-list');
  wrap.innerHTML = '<h3>รายชื่อผู้เล่น</h3>';
  const table = document.createElement('div');
  table.className = 'code';
  for(const id in users) {
    const u = users[id];
    const total = Number(u.balance||0)+Number(u.profitLoss||0);
    table.innerHTML += '<div>ID:'+u.id+' | '+u.username+' | balance:'+u.balance+' b | P/L:'+u.profitLoss+' b | total:'+total+' b</div>';
  }
  wrap.appendChild(table);
}

function adminAdjust() {
  const target = document.getElementById('admin-target').value.trim();
  const amount = Number(document.getElementById('admin-amount').value || 0);
  if(!target) { alert('กรุณาระบุ ID หรือ username'); return; }
  const users = readUsers();
  let found = null;
  for(const id in users) {
    const u = users[id];
    if(u.id === target || u.username === target) { found = u; break; }
  }
  if(!found) { alert('ไม่พบผู้เล่น'); return; }
  found.balance = Number(found.balance || 0) + Number(amount);
  users[found.id] = found; writeUsers(users);
  alert('ปรับยอดเรียบร้อย: ID ' + found.id + ' balance = ' + found.balance + ' b');
  renderPlayers();
}

// Helper to get current user on pages
function getCurrentUser(){ return localStorage.getItem('gx_current_user'); }

// expose functions for pages
window.registerUser = registerUser;
window.loginUser = loginUser;
window.loadUserDataToPage = loadUserDataToPage;
window.logout = logout;
window.trade = trade;
window.openLine = openLine;
window.playDice = playDice;
window.renderPlayers = renderPlayers;
window.adminAdjust = adminAdjust;
window.isLoggedIn = isLoggedIn;
