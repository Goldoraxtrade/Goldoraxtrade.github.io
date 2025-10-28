// ล็อกอิน, สมัครสมาชิก, เกม, และแอดมิน (เชื่อมต่อ Firebase จริง)
// ฝาก/ถอนเด้งไป LINE OA
document.querySelectorAll('.deposit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.open('https://lin.ee/Mm1caQx', '_blank');
  });
});

// ------------------- LOGIN -------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    if (doc.exists && doc.data().password === password) {
      sessionStorage.setItem('player', username);
      window.location.href = 'game.html';
    } else {
      alert('ชื่อผู้เล่นหรือรหัสผ่านไม่ถูกต้อง');
    }
  });
}

// ------------------- REGISTER -------------------
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    if (doc.exists) {
      alert('มีชื่อผู้เล่นนี้อยู่แล้ว');
      return;
    }
    await userRef.set({ password, balance: 1000 });
    alert('สมัครสมาชิกสำเร็จ! เข้าสู่ระบบได้เลย');
    window.location.href = 'login.html';
  });
}

// ------------------- ADMIN -------------------
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    if (password === 'admin123') { // รหัสแอดมิน (แก้ไขได้)
      adminLoginForm.style.display = 'none';
      adminPanel.style.display = 'block';
      const users = await db.collection('users').get();
      const list = document.getElementById('playerList');
      list.innerHTML = '';
      users.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = `${doc.id} | เงิน: ${doc.data().balance} บาท`;
        list.appendChild(li);
      });
    } else {
      alert('รหัสแอดมินผิด');
    }
  });
}

// ------------------- GAME -------------------
if (document.getElementById('balance')) {
  let player = sessionStorage.getItem('player');
  if (!player) window.location.href = 'login.html';
  let balance = 0;
  const balanceDisplay = document.getElementById('playerBalance');
  db.collection('users').doc(player).get().then(doc => {
    if (doc.exists) {
      balance = doc.data().balance;
      balanceDisplay.textContent = balance;
    }
  });
  const animals = ['น้ำเต้า', 'ปู', 'ปลา', 'เสือ', 'ไก่', 'กุ้ง'];
  const emojis = ['🍐','🦀','🐟','🐯','🐔','🦐'];
  const selected = new Set();
  const animalButtons = document.querySelectorAll('.animal-btn');
  animalButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const animal = animals[i];
      if (selected.has(animal)) {
        selected.delete(animal);
        btn.classList.remove('selected');
      } else {
        if (selected.size < 3) {
          selected.add(animal);
          btn.classList.add('selected');
        }
      }
    });
  });
  document.getElementById('roll').addEventListener('click', async () => {
    if (balance < 100) {
      alert('ยอดเงินไม่พอ! ติดต่อแอดมินเพื่อเติมเงิน');
      return;
    }
    if (selected.size === 0) {
      alert('กรุณาเลือกสัตว์ก่อน!');
      return;
    }
    balance -= 100;
    balanceDisplay.textContent = balance;
    await db.collection('users').doc(player).update({ balance });
    document.getElementById('diceArea').textContent = 'หมุน...';
    document.getElementById('result').textContent = '';
    document.getElementById('rollSound').currentTime = 0;
    document.getElementById('rollSound').play();
    setTimeout(async () => {
      const dice = [];
      for (let i = 0; i < 3; i++) dice.push(Math.floor(Math.random() * animals.length));
      document.getElementById('diceArea').innerHTML = dice.map(i => emojis[i]).join(' ');
      let hit = 0;
      dice.forEach(i => { if (selected.has(animals[i])) hit++; });
      if (hit > 0 && Math.random() < 0.2) {
        const win = hit * 100 * 2;
        balance += win;
        document.getElementById('result').textContent = `🎉 คุณชนะ! สัตว์ที่คุณเลือกออก ${hit} ตัว ได้รับ ${win} บาท!`;
        document.getElementById('winSound').currentTime = 0;
        document.getElementById('winSound').play();
        await db.collection('users').doc(player).update({ balance });
      } else {
        document.getElementById('result').textContent = 'เสียใจ! รอบนี้คุณแพ้ 😢';
        await db.collection('users').doc(player).update({ balance });
      }
      balanceDisplay.textContent = balance;
      selected.clear();
      animalButtons.forEach(b => b.classList.remove('selected'));
    }, 1000);
  });
}