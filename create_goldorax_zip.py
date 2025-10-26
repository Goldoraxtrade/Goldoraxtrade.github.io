import zipfile
import os

assets = [
    'GOLD', 'AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA',
    'PTT', 'AOT', 'SCB', 'CPALL', 'ADVANC', 'KBANK', 'BDMS', 'SCC', 'TRUE', 'BAM'
]

# ปุ่มสัตว์พร้อมสี
animal_buttons = [
    ('🐟 ปลา', '#4DA6FF'),
    ('🦐 กุ้ง', '#FF66B2'),
    ('🍈 น้ำเต้า', '#66CC66'),
    ('🦀 ปู', '#FF4D4D'),
    ('🐯 เสือ', '#FF9933'),
    ('🐔 ไก่', '#FFCC33')
]

files = {
    'index.html': """<!DOCTYPE html>
<html lang='th'>
<head><meta charset='UTF-8'><title>GoldoraXtrade</title><link rel='stylesheet' href='style.css'></head>
<body>
<h1>ยินดีต้อนรับสู่ GoldoraXtrade</h1>
<a href='login.html'>เข้าสู่ระบบ</a><br>
<a href='register.html'>สมัครสมาชิก</a>
</body></html>""",

    'login.html': """<!DOCTYPE html>
<html lang='th'><head><meta charset='UTF-8'><title>Login</title><link rel='stylesheet' href='style.css'></head>
<body>
<h1>เข้าสู่ระบบ</h1>
<form id='loginForm'><input type='text' id='username' placeholder='ชื่อผู้ใช้' required><br><input type='password' id='password' placeholder='รหัสผ่าน' required><br><button type='submit'>เข้าสู่ระบบ</button></form>
<script src='main.js'></script></body></html>""",

    'register.html': """<!DOCTYPE html>
<html lang='th'><head><meta charset='UTF-8'><title>Register</title><link rel='stylesheet' href='style.css'></head>
<body>
<h1>สมัครสมาชิก</h1>
<form id='registerForm'><input type='text' id='username' placeholder='ชื่อผู้ใช้' required><br><input type='password' id='password' placeholder='รหัสผ่าน' required><br><button type='submit'>สมัครสมาชิก</button></form>
<script src='main.js'></script></body></html>""",

    'main.html': f"""<!DOCTYPE html>
<html lang='th'>
<head><meta charset='UTF-8'><title>GoldoraXtrade</title><link rel='stylesheet' href='style.css'></head>
<body>
<h1>ระบบเทรดและเกมน้ำเต้า</h1>
<p id='balance'>ยอดเงิน: 0</p>
<div class='card'>
<h2>ระบบเทรด</h2>
<select id='asset'>""" + '\n'.join([f'<option value="{a}">{a}</option>' for a in assets]) + """</select>
<button id='buy'>ซื้อ</button>
<button id='sell'>ขาย</button>
<div id='chart'>กราฟราคาจำลอง</div>
</div>
<div class='card'>
<h2>เกมน้ำเต้า</h2>
<div id='animalButtons'>""" + '\n'.join([f'<button class="animal" style="background:{c};">{a}</button>' for a,c in animal_buttons]) + """</div>
<button id='playDice'>เล่น</button>
</div>
<div class='card'>
<h2>ฝาก/ถอน</h2>
<button id='deposit'>ฝาก/ถอน</button>
</div>
<script src='main.js'></script>
</body></html>""",

    'style.css': """body { font-family: Arial,sans-serif; text-align:center; background: linear-gradient(to right, #FFF1C4, #FFD6A5); padding:20px; min-height:100vh; }
.card { background:#ffffff; border-radius:15px; padding:20px; margin:15px auto; max-width:500px; box-shadow:5px 5px 15px rgba(0,0,0,0.2); }
button.animal { border:none; border-radius:10px; padding:15px 25px; font-size:28px; box-shadow:3px 3px 6px rgba(0,0,0,0.3); cursor:pointer; transition: transform 0.1s, box-shadow 0.1s; margin:5px; }
button.animal:active { transform: translateY(2px); box-shadow:1px 1px 3px rgba(0,0,0,0.3); }""",

    'main.js': """let users=JSON.parse(localStorage.getItem('users'))||[];
let currentUser=JSON.parse(localStorage.getItem('currentUser'))||null;
function saveUsers(){localStorage.setItem('users',JSON.stringify(users));}
const loginForm=document.getElementById('loginForm');
if(loginForm){loginForm.addEventListener('submit',e=>{e.preventDefault();const username=document.getElementById('username').value;
const password=document.getElementById('password').value;let user=users.find(u=>u.username===username&&u.password===password);
if(user){currentUser=user;localStorage.setItem('currentUser',JSON.stringify(currentUser));window.location='main.html';}
else{alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');}});}
const registerForm=document.getElementById('registerForm');
if(registerForm){registerForm.addEventListener('submit',e=>{e.preventDefault();const username=document.getElementById('username').value;
const password=document.getElementById('password').value;const newId=19000+users.length;let newUser={id:newId,username,password,balance:0};users.push(newUser);saveUsers();alert('สมัครสำเร็จ! ID ของคุณ: '+newId);window.location='login.html';});}
if(document.getElementById('balance')){
if(!currentUser){window.location='login.html';}
const balanceEl=document.getElementById('balance');function updateBalance(){balanceEl.innerText='ยอดเงิน: '+currentUser.balance;}updateBalance();
let selectedAnimals=[];
document.querySelectorAll('button.animal').forEach(b=>{b.addEventListener('click',()=>{
const a=b.innerText;if(selectedAnimals.includes(a)){selectedAnimals=selectedAnimals.filter(x=>x!==a);b.style.border='none';}else{
if(selectedAnimals.length<3){selectedAnimals.push(a);b.style.border='3px solid black';}else{alert('เลือกได้สูงสุด 3 ตัว');}}});});
document.getElementById('playDice').addEventListener('click',()=>{
if(currentUser.balance<=0){alert('ต้องฝากเงินก่อนถึงเล่นได้');return;}
if(selectedAnimals.length===0){alert('กรุณาเลือกสัตว์อย่างน้อย 1 ตัว');return;}
const bet=100*selectedAnimals.length;
if(currentUser.balance<bet){alert('ยอดเงินไม่เพียงพอ');return;}
currentUser.balance-=bet;
const results=[];
const choices=['🐟 ปลา','🦐 กุ้ง','🍈 น้ำเต้า','🦀 ปู','🐯 เสือ','🐔 ไก่'];
for(let i=0;i<3;i++){results.push(choices[Math.floor(Math.random()*choices.length)]);}
alert('ผลลัพธ์: '+results.join(' | '));
let win=0;results.forEach(r=>{if(selectedAnimals.includes(r)){win+=bet/selectedAnimals.length;}});
currentUser.balance+=win;updateBalance();saveUsers();selectedAnimals=[];
document.querySelectorAll('button.animal').forEach(b=>b.style.border='none');});
document.getElementById('deposit').addEventListener('click',()=>{window.open('https://lin.ee/Mm1caQx');alert('การฝากและถอนกรุณาติดต่อแอดมินผ่าน LINE OA เท่านั้น');});}"""
}

zip_name='GoldoraXtrade_v9_GameTrade_FullColor.zip'
with zipfile.ZipFile(zip_name,'w') as zipf:
    for fname,content in files.items():
        with open(fname,'w',encoding='utf-8') as f:
            f.write(content)
        zipf.write(fname)
        os.remove(fname)
print(f'สร้างไฟล์ {zip_name} เสร็จแล้ว')