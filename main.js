// นี่เป็นตัวอย่างโค้ดหลัก จัดการล็อกอิน, สมัครสมาชิก, เกม, และแอดมิน
// ฝาก/ถอนเด้งไป LINE OA
document.getElementById('depositBtn')?.addEventListener('click',()=>{ window.open('https://lin.ee/Mm1caQx','_blank'); });


// เกมน้ำเต้าปูปลา
let balance=0;
document.getElementById('balance')&&(document.getElementById('balance').textContent=balance);
const diceBtns=document.querySelectorAll('.diceBtn');
let selected=[];
diceBtns.forEach(btn=>{ btn.addEventListener('click',()=>{
const animal=btn.dataset.animal;
if(selected.includes(animal)) return;
if(selected.length>=3){ alert('เลือกได้สูงสุด 3 ตัวเท่านั้น!'); return; }
selected.push(animal);
btn.style.transform='translateY(-10px)';
playGame(animal);
});});


function playGame(animal){
const outcomes=['win','lose','lose','lose'];
const result=outcomes[Math.floor(Math.random()*outcomes.length)];
if(result==='win'){ balance+=100; alert(`คุณชนะ! +100 b`); }
else{ balance-=50; alert(`คุณแพ้! -50 b`); }
document.getElementById('balance')&&(document.getElementById('balance').textContent=balance);
}