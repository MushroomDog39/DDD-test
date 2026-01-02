// 1. 初始化六個人格分數 (根據企劃書設定)
let scores = { P: 0, D: 0, W: 0, L: 0, R: 0, O: 0 };
let currentStep = 0;
let history = []; // 儲存每一題加分的物件，用於上一題扣回

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
 * 載入題目並觸發切換動畫
 */
function loadQuestion() {
    const qData = quizData[currentStep];
    const frame = document.querySelector(".card-main-frame");

    // --- 動態效果：觸發 CSS 動畫重啟 ---
    frame.style.animation = 'none';
    frame.offsetHeight; // 觸發重繪 (Reflow)
    frame.style.animation = null; 

    // --- 內容載入 ---
    document.getElementById("question-text").innerText = qData.q;
    
    const container = document.getElementById("options-container");
    container.innerHTML = ""; // 清空舊選項

    qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt.text;
        
        // 點擊時傳送該選項的 scores 物件 (例如 {W:2, P:1})
        btn.onclick = () => selectOption(opt.scores);
        container.appendChild(btn);
    });

    // --- 測試功能：更新 Debug 面板 ---
    updateDebugScore();

    // 控制上一題按鈕顯示邏輯
    document.getElementById("back-btn").style.visibility = currentStep === 0 ? "hidden" : "visible";
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
    // 找出最高分的 key
    const resultKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    const personalityNames = {
        P: "完美主義者",
        D: "夢想家",
        W: "杞人憂天者",
        L: "臨陣磨槍者",
        R: "叛逆者",
        O: "過勞者"
    };

    // 這裡可以根據 resultKey 載入對應的立繪 (之後美化再細做)
    const finalFrame = document.querySelector(".card-main-frame");
    finalFrame.innerHTML = `
        <div class="top-group">
            <h2 style="color: #fff;">測驗結果</h2>
        </div>
        <div class="middle-group" style="text-align: center;">
            <h1 style="color: #c9a063; font-size: 2.5rem; margin-bottom: 20px;">${personalityNames[resultKey]}</h1>
            <p style="color: #ddd;">你是地下城中的${personalityNames[resultKey]}！</p>
        </div>
        <div class="bottom-group">
            <button class="option-btn" onclick="location.reload()">重新挑戰</button>
        </div>
    `;
    
    // 結果頁隱藏 debug 面板
    document.getElementById("debug-panel").style.display = "none";
}

// 啟動測驗
loadQuestion();