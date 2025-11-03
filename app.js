/* ===== 基本設定 ===== */
const frameCount = 142;
const dpr = Math.min(window.devicePixelRatio || 1, 2);
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const seqSection = document.querySelector('.sequence');
const overlay = document.getElementById('hero-overlay');
const debugEl = document.getElementById('debug');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 畫布尺寸 */
function resizeCanvas(){
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resizeCanvas();
addEventListener('resize', resizeCanvas, { passive:true });

/* ===== Hero 逐幀載入（自動偵測副檔名） ===== */
const extsTry = ['.jpg','.JPG','.jpeg','.png','.webp'];
let detectedExt = null;
function srcFor(i, ext){
  return `frames/frame_${String(i).padStart(4,'0')}${ext ?? detectedExt ?? extsTry[0]}`;
}
function loadFrame(i){
  return new Promise((resolve,reject)=>{
    const tries = detectedExt ? [detectedExt] : extsTry.slice();
    function next(){
      if (!tries.length) return reject(new Error('no ext'));
      const ext = tries.shift();
      const img = new Image();
      img.decoding = 'async';
      img.src = srcFor(i, ext) + `?v=${i}`; // 防快取錯影格
      img.onload = ()=>{ if(!detectedExt) detectedExt = ext; resolve(img); };
      img.onerror = next;
    }
    next();
  });
}
const cache = new Array(frameCount + 1);
loadFrame(1).then(img=>{ cache[1]=img; drawCover(img); }).catch(()=>{});

/* 等比鋪滿畫布 */
function drawCover(image){
  const cw = canvas.width/dpr, ch = canvas.height/dpr;
  const iw = image.naturalWidth, ih = image.naturalHeight;
  const cr = cw/ch, ir = iw/ih;
  let sx,sy,sw,sh;
  if (ir > cr){ sh = ih; sw = ih*cr; sx=(iw-sw)/2; sy=0; }
  else        { sw = iw; sh = iw/cr; sx=0; sy=(ih-sh)/2; }
  ctx.clearRect(0,0,cw,ch);
  ctx.drawImage(image, sx,sy,sw,sh, 0,0,cw,ch);
}

/* 卷動進度（僅依 .sequence 高度） */
function progressSeq(){
  const el = seqSection;
  const rect = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  const passed = Math.min(Math.max(-rect.top, 0), total);
  return passed / total;
}

/* 依進度渲染影格 */
async function renderByProgress(p){
  const target = Math.max(1, Math.min(frameCount, Math.round(p*(frameCount-1)+1)));
  overlay?.classList.toggle('show', p > 0.95);
  document.querySelector('.hint')?.classList.toggle('hide', p > 0.99);

  if (cache[target]) drawCover(cache[target]);
  else {
    try { const im = await loadFrame(target); cache[target]=im; drawCover(im); } catch(e){}
  }
  // 簡易 prefetch
  [target+1,target+2,target-1,target-2].forEach(j=>{
    if (j>0 && j<=frameCount && !cache[j]) loadFrame(j).then(im=>cache[j]=im).catch(()=>{});
  });
}
let lastP=-1;
function watchScroll(){
  const p = progressSeq();
  if (Math.abs(p-lastP)>1e-4){ renderByProgress(p); lastP=p; }
  const playing = p > 0 && p < 0.999;
  const overlayEl = document.getElementById('hero-overlay') || document.getElementById('overlayText');
  if (canvas)    canvas.classList.toggle('fixed',  playing);
  if (overlayEl) overlayEl.classList.toggle('fixed', playing);
  requestAnimationFrame(watchScroll);
}
requestAnimationFrame(watchScroll);
addEventListener('load', ()=>{ window.scrollTo(0,0); });

/* Debug 快捷鍵：D */
addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase()==='d' && debugEl){ debugEl.classList.toggle('show'); }
});

/* ===== Masonry（Google Drive 版） =====
   用「多行字串」收 ID，避免貼上時被自動換行破壞語法
*/
(function buildMasonry(){
  const box = document.getElementById('masonry');
  if(!box) return;

  // 直接把你那 139 個 ID 貼在這裡（空白或換行分隔皆可）
  const ids = `
1qfq40U5RecxeyYGepNOG5RoBRAsiawU4 1osM0OBXlq27Gv59DRrBjeE9oyc-5q4ox 1XxH0jaZaoZbO1An2ghoQLF5UkZWwdGSX 1FIsLk1dkRRhDc_5huLDCtjj92VLwOm-j 1BLuv8Qt8SmWcIFj2dGv-InYKM1LcUwEW 1hcE7f0jBCkxLA9d_nDUJKhav2Ms_xGwf 1qKqe4Whqh7RKgmoXkc9EnM4ZxtudMb7F 1eDmMBG_WuhZ7pLfAb2izPhC9NPeeRY_k 1L0agGFJepd4w1345XsK3f-cCIFk8OsBt 1h9p8WC3tuVSVQbWRDPkp_-cRN1HUcZ8U 1A4p8H3omLka8-N_RRLifwKxtg0Nn2T3I 1DLxu-Fi142DxOLEBI3MxGMEEMDlMhGmr 1FIs5VJuBP3faA-xQLGR_LJfpmXY1DQaF 1JftKJRoibCrC2r7_kN5Y7LMyxGQKykz6 1Qfiwb0iCkeOq_8KfxGg0HibLJ4WPhjop 1UECMcotjzi-KVumbiYMjYNTINwsEiEAG 1Gqvs1BJhc17h40eS9b5C4ldK9uB6ojUm 1kzgECR4q7unGcAQf5NfrC0l296Y5ITo0 1FBqPJY50HHUHm_8j2jfP-w5OWNIafj6i 1BWwVk3d-Gcg-IvymMr17_iJAIVfRSjzs 1r3vXL4eQSJeqnt4B-yNyG4oqzjS7mq1o 1Wdu4aFeZl5xFfIivsmH-cwSVsuOw2RtX 1F4Flh5tIhzPmsiqNVGUx3jmE3IkgI4Sb 1rKv7mE9iIsRaxVlxgcgMl4r8_B0dfpWV 1RWdqh4JV7txNKOT5yVmHabray9BgP9CA 1sL3wymVxeky0cE-pRhfYGoRy8Ysw6dXj 12cVubyjJXN1E_aGvBdVmbD40T4s2E10J 1dxgI7xf_efQqDmVesRbGqEp_CiWPgNcz 1nsHrwoiHP5DNDVq1bhk0dULD0vvKDrgI 1bIRldkkOmZh7mPtXLXG1FEeUJmNPjOCb 1nxeXiadeF9BE-3gHCkU0mhMhM1ydZ_UO 1EkGvK3pcihfJuLtPJELH-O7eH5j1GtLr 1nGn6mCcewhUpttZqjAbuX6nbr_o2w-Z- 1hibEbEizNuIA3c8BSLaG-33ipAv-Vd6X 1RDu0eibCz_nOdda0HKyaw8m8aE-LVEXU 16MHrbOrpAjcmHMQTR7olCp-zIOi_IfsT 1zmY78PIE_hpHiCZ91xwJoCokv3kg5AZy 1htaj1YBIUiopqsb8oLrtehcHBs66gQiX 17OHoTsz1VxOnLun5VPq5oSG3gnpWbvlP 1YvCGFodKHjeOFHoaqnygSYHMNoTwiMNi 1qX-AaHxT47C8G9Z93lR3BuXmfZStdMej 1zvqC89_XGFIU4TdCYPN1Eq0GLwS8T3Kd 1N1ayWyQrOAlIa0SDBm4mm5LEkG2FpN0a 1M9gWWpUr-tygLoT3HaAbaBaEcaf9IV_3 1PfETaX9-yC7bU8XwAljjhLuuBy41IsBl 1M3KW44DTA7tByIequWqJ6d5k46oRwRU8 1cdgK367samihH-yVJbzCKXbZtSQ1DHAJ 1utWJI4EBNW5X1w6Pw_YVVkbmdtnpHKXc 193mJQC4qeIFGtnIh_075gXVHmoni5lWI 1sGOlrJADWTTzKWnmMoSPQGQ4TrASuWxk 1OBcwTl29-wJE70Vf9AkdnSBXqK2UmFyI 1mMmodQJsrD0r2PNCormu3IWXGgktwfP5 11W2xeV0tE6_JTB-Me6Hxl5_G7YGPBe21 1DrR-ywaGzQtVyaWrriz2AWizeUt-yntt 1WicXRPASgx80Ib0935HhNXH_wAJzwuKB 1N0dVocHJ_parmsSGTgCPYzthmGFGOL9c 1PvdkAq6WRkIuej9n50JyPARw3rCCtdZo 19UIc3KaOOoDJI1gM1YCdwzGsYmDURxzn 1L0Bcos6TD6Z99oY9u1G65_EXj6F8RIG3 1RS1Uod9GiVdl3fXH-MHHIaKl1Ew5WpBA 1GZMx_YjAiyGW0kTaOBozkzVLQqy_93wS 13b2M49p8R22zRmg3po4uENQQYgm8nuAq 18dVjNaB5CIkdjo2YijvON4cMg10aEhMk 1NA7KkB60OBN6-gT5jyZ3JFfxVu_WvDPJ 14z6dGzcBx5g1w9Rznq2RvP_R1Zy5Y7pn 1Xh-2xGKt957S6ZJ2bQmLMJsX52CI-EZF 1NiDJEZXt_gMuXonyzi-5dqE-s6ORQtlD 12sMl0rCMuNoVgpJwBz94y1SNhKCEP_6h 1B8xSmZDQM-V62HHTPZSd8bVGpfDL1aL_ 1pGm5K-qFw-ZRRom_LftnWw-3UJFNdrOB 1dkcW4ntItIN7VyWiX_uy8JEU3ZgYYTMV 1FwZpWxP12Z0i2Nr55CwEDIZZV9NsnXxI 1GLts77tRcl6b7FEZ8dlfS3GNetSgyiYQ 1SEcK2KcNG-lXK_RxDPoP-WcZ1SR6PCTm 1bn0vbzpCymiM8wLynFBcJdf3tXVy3YxT 1d5iVLrUXOcgDtuPEZpMMUzxtzla5pLF6 1E9cjFhMLB4Q82vC5VmjTHhg0X-T1QIfc 1lTtVtYXKdYnL6KbsB4gASwxi2bc-8Yqx 1e7DTRTMDe8STRQnUky6VlDZrdV6aXrmZ 1CsaIRoeHgnZcdZzUpCJwU6i3TJN-nMzO 1B1W04Ovd2ncEpKAQZV8jESstyDpDdW_P 1U1LUWrehWKek-a78G07c_V8yKBZo8As6 1hUwES-CStqHaVhsGeiREUp4Zu3VK3bLO 1L5tKuNP-qGByzy8HiNl4AsX90Ity7L6A 1gqPYPpPN4JfYRnpaee3F5aFJHvm5-lNK 1WlCr4y8Ogzoo52FCEHoOBBE_o0h9KAWw 1ya93vUG69a15ISt6EDJH8JX4eXxnr_z2 1jX22EcmA-WfEG3zDbqPxdq1ZC1kNUk6t 1etskID9hAxL1P2acJNu1T4EVhhTBONz0 1l37LdCprOfros0wnMvfwuZgo4vAiPBam 11uvSeIQ36uJ5Gtm8AfVacsot252gdwAK 1f7PSz-qNUxY1AWkQNny7GFIJ0j86_NoC 1luaNQiI5zKHIZ25OCzmlBE5djhHv04zm 1bqRxwl-blvit8gyu1LJ9WDlIBIAA94w0 1gztgskib8M1xq9tit5s2M4wk-9Llv6sB 1dmb2Bgyvdeqb2p_eNv5Q35GrjqoYpxHe 1B1VwHQKWwoggA0DHK2mgm8srrd3wUAjn 1x_ywETSOJpKYFFZHHCOtfooDp-tMKUZQ 1NYsTlE_weUFPVbX0I7llXZIpeTp_PSVK 10RBwIWgAEG6zH2JMzK54RYvD4N62enry 12b4HpgjAIUR5AJmBAMEHr5Qata0Oo9QS 1rX8BDDCFlhOj_4f37q7_d3b7q6x_5P33 1Dxh3NC9DVMGYKmFGZFtz9A1BViPfxaBe 1MYn8CnQUvv7u81CjlYc8P2uUIFPTb8Zn 1fJIYbbBl06Iuwnt_PVNeW_9BJctwCd4S 1wDBqba6TShu6Lv_OADy0YYsdxZYDscTG 1VhImC_8pR5HilAWLxAom4KYWo_Ouvv50 1fgbKW-F14OacLBWet2i7s_O7vLJHO4dB 1c9Nio6QoKkutIS9x33Y-lCjNJ56oeyIh 1BiIDSo3lWIjn5yu3MaDQlMsxHWXJtE8o 1vPlVqhVofgQ9CMKiObOeDXciBaCum_Hp 18d9WIsjazkUGs9y0AyXjixRv03nkZ85g 14jYW69Td6UhPJ-DmxdhJ6-ibC2Pwi-_l 1rgsULQXdUR6IkpRhgxlDHcmll5e9bj5E 1X7YFo2hUedTwBBCNN9D4j7O52Z6xTyFJ 1F14XorlsFhpUM1SNAWnVk3HtvXVWaiBu 1PMOKPum0fW4alsykptu9Z3KU86FWIHV8 1eawWlz8Qqn8iGtBZi1R3MHbQObCB-f5i 1fVdF-N5VP9o-5bBB9uiEXWj1wMsZD-IS 1JxgDiCbRA7hh4d14mnFiKa3nJ4UY5-0t 197G1ANSDuS1-r1Z-_SmidcRiOSUHKmDk 1EnPKpa_uAYnSNfxy8WwjCkniQe8WVp8o 1rZMx-EragnUhqG6o_x9EOpVLmMcaHe9n 1FWg5Ars0XZsMliohu-tZo86byaAin_Ia 10J_NFV84kgy7SqL8BmndR2TXo-D4jtbq 1FEvAIIHj-uK63_ukAcmDh31SZkdZiOmt 1rbE-5s5OvLTZBh6EaI6G2JNRQx6Gqzwr 1hzC1tXdBa9QMQHr2R7bTR0V6HfBdBqWf 1dz3gLx_7fzzqlvFZoT48D_kXFrrkM_Kw 1xs9XCvhWDcBHT3yRU6sW4N7WLufUy_DE 1Wnh6gLIqDfO1jUrxsl8txqhdg3WtvLC2 1QtzYDK0cd1U5OjQqkLX5-ZqKeElyvi53 1LxgaJcRdT9ocGlIVApJIKr3zSqY5esyO 1AiVoBGAOkKnQFpsGCHWOaEOzqC4fE0QL 1Q5SirIzRZzV4waKF7D4WaUCPNoEGPDoO 1sFR6QuY2Qj3CkQol6Bhsftj4D4XA0la_ 1bZ1kgeNyEkLbIQWxZv8Xpb5IxcgmAVEf 1zFJyOIMONUKN6HAPKRgKeSD_e_s6LOEz 1q-Q8gA_lt6O2vyiuk5_lCWEsR2iRCX8K
  `
    .trim()
    .split(/\s+/)
    .filter(id => /^[A-Za-z0-9_-]+$/.test(id)); // 安全過濾

  const driveThumb = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
  const driveView  = (id) => `https://drive.google.com/uc?export=view&id=${id}`;

  // 4 組 round-robin 排列，降低連號相鄰
  const COLS = 4;
  const buckets = Array.from({length: COLS}, () => []);
  ids.forEach((id, idx) => buckets[idx % COLS].push({ id, idx }));

  const order = [];
  let more = true;
  while (more) {
    more = false;
    for (let c = 0; c < COLS; c++) {
      if (buckets[c].length) {
        order.push(buckets[c].shift().id);
        more = true;
      }
    }
  }

  // 產生 DOM
  order.forEach((id) => {
    const a = document.createElement('a');
    a.href   = driveView(id);
    a.target = '_blank';
    a.rel    = 'noopener';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = 'gallery image';
    img.src = driveThumb(id);

    img.addEventListener('load', ()=> img.classList.add('loaded'));
    img.addEventListener('error', ()=> a.remove()); // 壞圖直接移除

    a.appendChild(img);
    box.appendChild(a);
  });
})();
