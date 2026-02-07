// 1. 初始化六個人格分數 (根據企劃書設定)
let scores = { P: 0, D: 0, W: 0, L: 0, R: 0, O: 0 };
let currentStep = 0;
let history = []; // 儲存每一題加分的物件，用於上一題扣回

/* 全域變數擴充 */
let currentSlideIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

const personalityList = [
    { code: 'P', name: '完美主義者', desc: '追求絕對的無瑕讓你難以邁出第一步。請試著接受「完成優於完美」，即使裝備有些許刮痕，也依然能完成一場精彩的冒險。' },
    { code: 'D', name: '夢想家', desc: '腦中充滿了美妙的冒險藍圖，卻常在幻想中流連忘返。請嘗試將的計畫拆解成小步標，現在就踏出營地，實踐你的奇思妙想吧！' },
    { code: 'W', name: '杞人憂天者', desc: '因為過多的擔憂與過度的準備，讓你常常在路口止步不前。冒險本就充滿未知，試著放手去做，你會發現自己比想像中更強大。' },
    { code: 'L', name: '臨陣磨槍者', desc: '習慣在死線逼近時才爆發戰力。雖然衝刺的快感很迷人，但規律的節奏能讓你走得更遠，且不至於在戰鬥後徹底癱瘓。' },
    { code: 'R', name: '叛逆者', desc: '討厭被公會的規章所束縛，拖延是你表達自我的方式。尋找冒險中真正令你感興趣的意義，讓動力從心出發而非為了對抗。' },
    { code: 'O', name: '過勞者', desc: '過度的努力讓你雖然戰果豐碩，但也早已身心俱趕。請記得「休息」也是冒險的一部分，才能在地牢深處走得更久。' }
];

// 2. 題目資料 (包含您提到的多重加權設定)
const quizData = [
    {
        q: "收到公會發派的討伐懸賞單時...",
        options: [
            { text: "立刻檢視任務所有細節，確保萬無一失才出發。", scores: { P: 2, W: 1 } },
            { text: "覺得任務太死板，先去酒館聽聽看有沒有更有趣的傳聞。", scores: { R: 2, D: 1 } }
        ]
    },
    {
        q: "準備冒險道具（藥水、裝備）時...",
        options: [
            { text: "只帶最核心的武器，剩下的等遇到怪物再說。", scores: { L: 2 } },
            { text: "即使背包很重，也要把所有「以防萬一」的道具帶齊。", scores: { W: 3 } }
        ]
    },
    {
        q: "進入地牢深處，發現兩條岔路時...",
        options: [
            { text: "花時間觀察地圖紋路與風向，推敲出最正確的路徑。", scores: { P: 1, W: 2 } },
            { text: "先兩邊都快速跑跑看，感受哪邊比較有驚喜。", scores: { D: 2 } }
        ]
    },
    {
        q: "當你的疲勞值漸漸升高，身體感到沈重時...",
        options: [
            { text: "堅持繼續戰鬥，想要在倒下前多掃蕩一隻怪。", scores: { O: 3 } },
            { text: "決定找個隱密的角落坐下來，開始想像成功後的慶功宴。", scores: { D: 3 } }
        ]
    },
    {
        q: "隊友突然丟給你一張雜事卡（如：修補盔甲）時...",
        options: [
            { text: "雖然無奈但還是接過來，並要求自己修得比原來的更好。", scores: { P: 3, O: 1 } },
            { text: "找機會把這件事推給看起來比較閒的人。", scores: { R: 3 } }
        ]
    },
    {
        q: "面對強大的 BOSS 怪，你的戰鬥策略是？",
        options: [
            { text: "前期保留體力，等到最後一刻爆發全力一擊。", scores: { L: 3 } },
            { text: "同一回合內使出所有連續技，務求短時間內造成最大傷害。", scores: { O: 3 } }
        ]
    },
    {
        q: "當戰鬥成果不如預期，裝備沾上汙垢時...",
        options: [
            { text: "感到極度沮喪，甚至想把這次冒險紀錄擦掉重來。", scores: { P: 3 } },
            { text: "沒關係，這也是一種「戰鬥的姿態」，下次會更好。", scores: { D: 2 } }
        ]
    },
    {
        q: "在休息營地放空時，你的腦袋在想什麼？",
        options: [
            { text: "剛才戰鬥中漏掉的小失誤，反省如何做到完美。", scores: { P: 2, W: 1 } },
            { text: "各種新奇的魔法組合，雖然還沒試過但感覺很強。", scores: { D: 3 } }
        ]
    },
    {
        q: "公會規定每位冒險者都要寫戰鬥日誌...",
        options: [
            { text: "每天雖然痛苦但還是強撐著寫完，甚至寫到過勞。", scores: { O: 3 } },
            { text: "覺得這規定太束縛，能拖就拖，直到最後一刻才補完。", scores: { R: 2, L: 1 } }
        ]
    },
    {
        q: "冒險結束，結算積分時...",
        options: [
            { text: "即使累壞了，還是會想著如果當時再多觀察一下就好了。", scores: { P: 1, W: 3 } },
            { text: "只要有拿到賞金就好，現在只想徹底放鬆不想任何計畫。", scores: { L: 2 } }
        ]
    },
];

/**
 * 觸發指定元素的內容動畫
 * @param {HTMLElement} element - 要觸發動畫的元素
 */
function triggerContentAnimation(element) {
    if (!element) return;
    element.classList.remove("animate-content");
    element.offsetHeight; // 觸發重繪
    element.classList.add("animate-content");
}

/**
 * 渲染開始畫面 (Task 1)
 */
function renderStartScreen() {
    const frame = document.querySelector(".card-main-frame");
    if (!frame) return;
    frame.classList.remove('layout-slider');
    frame.innerHTML = `
        <div class="top-group start-screen-top-spacer animate-content">
             <!-- LOGO 與標題容器 -->
             <div class="start-logo-container">
                 <img src="img/LOGO.png" alt="Delay or Deliver Dungeon Logo" class="start-logo-img">
                 <p class="start-title-text">人格測驗</p>
             </div>
        </div>
        <div class="middle-group">
            <!-- 這裡未來可以放裝飾圖 -->
        </div>
        <div class="bottom-group">
            <button class="option-btn" onclick="setTimeout(startQuiz, 100)">開始挑戰</button>
        </div>
    `;
    
    // 確保 debug 面板重置
    scores = { P: 0, D: 0, W: 0, L: 0, R: 0, O: 0 };
    const debugPanel = document.getElementById("debug-panel");
    if (debugPanel) {
        debugPanel.style.display = "none"; // 強制隱藏
        updateDebugScore();
    }
}

/**
 * 初始化測驗結構並開始第一題
 */
function startQuiz() {
    const frame = document.querySelector(".card-main-frame");
    frame.classList.remove('layout-slider');
    // 重建測驗 DOM 結構
    // 修正：預設將上一題按鈕設為 display: none，徹底避免第一題閃爍
    // 新增：加入地牢風格進度條容器，並賦予一次性淡入動畫 (animate-content)
    frame.innerHTML = `
          <div class="top-group" style="flex-direction: column;">
            <div class="quiz-progress-container animate-content">
                <div id="quiz-progress-bar" class="quiz-progress-bar"></div>
            </div>
            <h2 id="question-text"></h2>
          </div>
          <div class="middle-group" id="options-container"> </div>
          <div class="bottom-group">
            <button id="back-btn" style="display: none;" onclick="setTimeout(previousQuestion, 100)">上一題</button>
          </div>
    `;
    
    // 重置狀態
    currentStep = 0;
    scores = { P: 0, D: 0, W: 0, L: 0, R: 0, O: 0 };
    history = [];
    
    loadQuestion();
}

/**
 * 載入題目並觸發切換動畫
 */
function loadQuestion() {
    const qData = quizData[currentStep];
    const frame = document.querySelector(".card-main-frame");
    const backBtn = document.getElementById("back-btn");
    const progressBar = document.getElementById("quiz-progress-bar");

    // --- 更新進度條 ---
    if (progressBar) {
        const progress = ((currentStep) / quizData.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // --- 優先處理按鈕顯示邏輯，使用 display: none 確保不閃爍 ---
    if(backBtn) {
        backBtn.style.display = currentStep === 0 ? "none" : "block";
    }

    // --- 內容載入與動畫觸發 ---
    const qText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    
    qText.innerText = qData.q;
    optionsContainer.innerHTML = ""; // 清空舊選項

    qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt.text;
        
        // 點擊時傳送該選項的 scores 物件 (例如 {W:2, P:1})，統一延遲 100ms
        btn.onclick = () => {
            setTimeout(() => selectOption(opt.scores), 100);
        };
        optionsContainer.appendChild(btn);
    });

    // 只針對題目和選項容器觸發動畫
    triggerContentAnimation(qText);
    triggerContentAnimation(optionsContainer);

    // --- 測試功能：更新 Debug 面板 ---
    updateDebugScore();
}

/**
 * 處理選項點擊與計分
 * @param {Object} scoreMap - 該選項對應的分數物件
 */
function selectOption(scoreMap) {
    // 使用 for...in 迴圈將 scoreMap 裡的所有分數加進總分
    for (let type in scoreMap) {
        if (scores.hasOwnProperty(type)) {
            scores[type] += scoreMap[type];
        }
    }

    // 將該次加分的物件存入歷史紀錄，方便「上一題」扣除
    history.push(scoreMap);
    
    if (currentStep < quizData.length - 1) {
        currentStep++;
        loadQuestion();
    } else {
        showResult();
    }
}

/**
 * 返回上一題並精確扣除對應分數
 */
function previousQuestion() {
    if (currentStep > 0 && history.length > 0) {
        // 取出最後一筆加分紀錄
        const lastAddedScores = history.pop();
        
        // 將這些分數扣回來
        for (let type in lastAddedScores) {
            if (scores.hasOwnProperty(type)) {
                scores[type] -= lastAddedScores[type];
            }
        }
        
        currentStep--;
        loadQuestion();
    }
}

/**
 * 更新右上角的測試用分數面板
 */
function updateDebugScore() {
    const display = document.getElementById("score-display");
    if (display) {
        display.innerText = `P:${scores.P} | D:${scores.D} | W:${scores.W} | L:${scores.L} | R:${scores.R} | O:${scores.O}`;
    }
}

/**
 * 顯示最終結果
 */
function showResult() {
    // 找出最高分的分數
    const maxScore = Math.max(...Object.values(scores));
    // 找出所有達到最高分的人格 (處理同分狀況)
    const topPersonalities = Object.keys(scores).filter(key => scores[key] === maxScore);
    
    // 從最高分候選中隨機選出一個
    const resultKey = topPersonalities[Math.floor(Math.random() * topPersonalities.length)];
    
    // 從 personalityList 中查找結果數據
    const resultData = personalityList.find(p => p.code === resultKey);
    
    const finalFrame = document.querySelector(".card-main-frame");
    finalFrame.classList.remove('layout-slider');
    finalFrame.innerHTML = `
        <div class="top-group animate-content">
            <h2 class="result-screen-title">測驗結果</h2>
        </div>
        <div class="middle-group result-container-center animate-content">
            <img src="img/${resultKey}.png" alt="${resultData.name}" class="result-img" onclick="openModal('img/${resultKey}.png')">
            <h1 class="result-name-text">${resultData.name}</h1>
            <div class="result-desc-box">
                <p class="result-desc-text">你是地下城中的${resultData.name}，${resultData.desc}</p>
            </div>
        </div>
        <div class="bottom-group">
            <button class="option-btn" onclick="setTimeout(showAllPersonalities, 100)">其他拖延人格介紹</button>
            <button class="option-btn" onclick="setTimeout(renderStartScreen, 100)">重新挑戰</button>
        </div>
    `;

    const debugPanel = document.getElementById("debug-panel");
    if (debugPanel) debugPanel.style.display = "none";
}

/**
 * 顯示所有拖延人格介紹 (Task 3)
 */
function showAllPersonalities() {
    currentSlideIndex = 0; // 預設從第一個開始
    renderSlide();
}

/**
 * 處理滑動手勢
 */
function handleGesture() {
    const threshold = 50; // 最小滑動距離
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // 左滑 -> 下一張
            changeSlide(1);
        } else {
            // 右滑 -> 上一張
            changeSlide(-1);
        }
    }
}

let lastDir = 1; // 紀錄最後一次切換的方向 (1 為向後/向右, -1 為向前/向左)

/**
 * 渲染單一人格 Slide
 */
function renderSlide() {
    const p = personalityList[currentSlideIndex];
    const frame = document.querySelector(".card-main-frame");
    frame.classList.add('layout-slider');
    
    // 根據方向決定動畫 class
    const animClass = lastDir > 0 ? 'slide-right' : 'slide-left';

    frame.innerHTML = `
        <div class="top-group">
            <h2 class="slide-screen-title">人格圖鑑 (${currentSlideIndex + 1}/${personalityList.length})</h2>
        </div>
        
        <div class="middle-group">
            <!-- 左右切換按鈕 -->
            <button onclick="setTimeout(() => changeSlide(-1), 100)" class="slider-nav-btn prev">&lt;</button>
            <button onclick="setTimeout(() => changeSlide(1), 100)" class="slider-nav-btn next">&gt;</button>

            <!-- 內容區 (含動畫 wrapper) -->
            <div class="slider-anim ${animClass}">
                <!-- 圖片容器 (固定高度) -->
                <div class="slider-img-container">
                    <img src="img/${p.code}.png" alt="${p.name}" class="slider-img" onclick="openModal('img/${p.code}.png')">
                </div>
                
                <!-- 說明框 (半透明襯底) -->
                <div class="desc-box">
                    <h2 class="desc-title">${p.name}</h2>
                    <p class="desc-text">${p.desc}</p>
                </div>
            </div>
        </div>

        <div class="bottom-group">
            <button class="option-btn" onclick="setTimeout(showResult, 100)">返回結果</button>
            <button class="option-btn" onclick="setTimeout(renderStartScreen, 100)">回到首頁</button>
        </div>
    `;

    // 加入觸控監聽
    const sliderArea = frame.querySelector('.middle-group');
    if (sliderArea) {
        sliderArea.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        sliderArea.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, {passive: true});
    }
}

/**
 * 切換 Slide
 * @param {number} dir -1 or 1
 */
function changeSlide(dir) {
    lastDir = dir; // 更新方向
    currentSlideIndex += dir;
    
    // 循環切換
    if (currentSlideIndex < 0) {
        currentSlideIndex = personalityList.length - 1;
    } else if (currentSlideIndex >= personalityList.length) {
        currentSlideIndex = 0;
    }
    
    renderSlide();
}

/* --- Modal 功能實作 --- */
const modal = document.getElementById('img-modal');
const modalImg = document.getElementById('modal-image');
const closeBtn = document.getElementById('modal-close');

let imgScale = 1;
let imgTranslateX = 0;
let imgTranslateY = 0;
let isDragging = false;
let startDragX = 0;
let startDragY = 0;

// 雙指縮放變數
let initialDistance = 0;
let initialScale = 1;

function initModal() {
    if (!modal || !modalImg || !closeBtn) return;

    // 關閉按鈕
    closeBtn.addEventListener('click', closeModal);
    
    // 點擊背景關閉 (但在圖片上拖曳時不應關閉)
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-content')) {
            closeModal();
        }
    });

    // 滾輪縮放
    modal.addEventListener('wheel', handleWheel, { passive: false });

    // 滑鼠拖曳
    modalImg.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    // 觸控事件 (拖曳與縮放)
    modalImg.addEventListener('touchstart', handleTouchStart, { passive: false });
    modalImg.addEventListener('touchmove', handleTouchMove, { passive: false });
    modalImg.addEventListener('touchend', handleTouchEnd);
    
    // 雙擊放大
    modalImg.addEventListener('dblclick', handleDoubleClick);
}

function openModal(src) {
    if(!modal) return;
    modalImg.src = src;
    modal.style.display = 'flex'; // 先顯示以計算尺寸
    // 強制重繪
    modal.offsetHeight;
    modal.classList.add('active');
    
    // 重置狀態
    resetImageState();
}

function closeModal() {
    if(!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        modalImg.src = '';
    }, 300); // 配合 CSS transition
}

function resetImageState() {
    imgScale = 1;
    imgTranslateX = 0;
    imgTranslateY = 0;
    updateTransform();
}

function updateTransform() {
    modalImg.style.transform = `translate(${imgTranslateX}px, ${imgTranslateY}px) scale(${imgScale})`;
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY * -0.001; // 調整縮放速度
    const newScale = Math.min(Math.max(0.5, imgScale + delta), 5); // 限制縮放範圍
    
    imgScale = newScale;
    updateTransform();
}

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    startDragX = e.clientX - imgTranslateX;
    startDragY = e.clientY - imgTranslateY;
    modalImg.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    imgTranslateX = e.clientX - startDragX;
    imgTranslateY = e.clientY - startDragY;
    updateTransform();
}

function endDrag() {
    isDragging = false;
    modalImg.style.cursor = 'grab';
}

function handleDoubleClick(e) {
    if (imgScale !== 1) {
        resetImageState();
    } else {
        imgScale = 2.5; // 放大倍率
        updateTransform();
    }
}

// 觸控邏輯
function handleTouchStart(e) {
    if (e.touches.length === 1) {
        // 單指拖曳
        isDragging = true;
        startDragX = e.touches[0].clientX - imgTranslateX;
        startDragY = e.touches[0].clientY - imgTranslateY;
    } else if (e.touches.length === 2) {
        // 雙指縮放
        isDragging = false; // 縮放時不拖曳
        initialDistance = getDistance(e.touches);
        initialScale = imgScale;
    }
}

function handleTouchMove(e) {
    if (e.touches.length > 0) {
        e.preventDefault(); // 防止頁面捲動
    }
    if (e.touches.length === 1 && isDragging) {
        imgTranslateX = e.touches[0].clientX - startDragX;
        imgTranslateY = e.touches[0].clientY - startDragY;
        updateTransform();
    } else if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches);
        if (initialDistance > 0) {
            const scaleFactor = currentDistance / initialDistance;
            imgScale = Math.min(Math.max(0.5, initialScale * scaleFactor), 5);
            updateTransform();
        }
    }
}

function handleTouchEnd(e) {
    isDragging = false;
    if (e.touches.length < 2) {
        initialDistance = 0;
    }
}

function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// 應用程式啟動
initModal();

/* --- 資產預載入邏輯 --- */
const assetsToPreload = [
    'img/LOGO.png',
    'img/P.png',
    'img/D.png',
    'img/W.png',
    'img/L.png',
    'img/R.png',
    'img/O.png',
    'bg_card.png'
];

let loadedCount = 0;
const loadingBar = document.getElementById('loading-bar');
const loadingScreen = document.getElementById('loading-screen');
const loadingDots = document.getElementById('loading-dots');

function startLoadingAnimation() {
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        if (loadingDots) {
            loadingDots.innerText = '.'.repeat(dots);
        }
    }, 500);
}

function preloadAssets() {
    const total = assetsToPreload.length;
    
    // 啟動點點動畫
    startLoadingAnimation();

    if (total === 0) {
        finishLoading();
        return;
    }

    assetsToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedCount++;
            updateProgress(loadedCount, total);
        };
        img.onerror = () => {
            console.warn(`Failed to load asset: ${src}`);
            // 即使失敗也算完成，避免卡住
            loadedCount++;
            updateProgress(loadedCount, total);
        };
    });
}

function updateProgress(count, total) {
    const percentage = Math.floor((count / total) * 100);
    if (loadingBar) {
        loadingBar.style.width = `${percentage}%`;
    }

    if (count >= total) {
        // 給一點緩衝時間讓使用者看到 100%
        setTimeout(finishLoading, 500);
    }
}

function finishLoading() {
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // 等待淡出動畫結束後再移除 (可選)
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    renderStartScreen();
}

// 開始預載入
preloadAssets();

/* --- 背景粒子效果實作 --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // 根據螢幕大小調整數量
    
    const colors = [
        '201, 160, 99', // Gold
        '100, 200, 255', // Cyan Magic
        '160, 100, 200', // Purple Void
        '120, 120, 120' // Dungeon Dust
    ];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // 邊界檢查
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`; 
        ctx.fill();
    });
    
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();