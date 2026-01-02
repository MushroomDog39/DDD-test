// 1. 初始化計分 (對應企劃書六個人格)
let scores = { P: 0, D: 0, W: 0, L: 0, R: 0, O: 0 };
let currentStep = 0;
let history = []; // 紀錄每題加了誰的分，方便退回

// 2. 題目資料 
const quizData = [
    {
        q: "收到公會發派的討伐懸賞單時...",
        options: [
            { text: "立刻檢視任務所有細節，確保萬無一失才出發。", type: "P", weight: 2 },
            { text: "覺得任務太死板，先去酒館聽聽看有沒有更有趣的傳聞。", type: "R", weight: 2 }
        ]
    },
    {
        q: "準備冒險道具（藥水、裝備）時...",
        options: [
            { text: "只帶最核心的武器，剩下的等遇到怪物再說。", type: "L", weight: 2 },
            { text: "即使背包很重，也要把所有「以防萬一」的道具帶齊。", type: "W", weight: 3 }
        ]
    },
    {
        q: "進入地牢深處，發現兩條岔路時...",
        options: [
            { text: "花時間觀察地圖紋路與風向，推敲出最正確的路徑。", type: "W", weight: 2, type: "P", weight: 1 },
            { text: "先兩邊都快速跑跑看，感受哪邊比較有驚喜。", type: "D", weight: 2 }
        ]
    },
    {
        q: "當你的疲勞值漸漸升高，身體感到沈重時...",
        options: [
            { text: "堅持繼續戰鬥，想要在倒下前多掃蕩一隻怪。", type: "O", weight: 3 },
            { text: "決定找個隱密的角落坐下來，開始想像成功後的慶功宴。", type: "D", weight: 3 }
        ]
    },
    {
        q: "隊友突然丟給你一張雜事卡（如：修補盔甲）時...",
        options: [
            { text: "雖然無奈但還是接過來，並要求自己修得比原來的更好。", type: "P", weight: 3, type: "O", weight: 1 },
            { text: "找機會把這件事推給看起來比較閒的人。", type: "R", weight: 3 }
        ]
    },
    {
        q: "面對強大的 BOSS 怪，你的戰鬥策略是？",
        options: [
            { text: "前期保留體力，等到最後一刻爆發全力一擊。", type: "L", weight: 3 },
            { text: "同一回合內使出所有連續技，務求短時間內造成最大傷害。", type: "O", weight: 3 }
        ]
    },
    {
        q: "當戰鬥成果不如預期，裝備沾上汙垢時...",
        options: [
            { text: "感到極度沮喪，甚至想把這次冒險紀錄擦掉重來。", type: "P", weight: 3 },
            { text: "沒關係，這也是一種「戰鬥的姿態」，下次會更好。", type: "D", weight: 2 }
        ]
    },
    {
        q: "在休息營地放空時，你的腦袋在想什麼？",
        options: [
            { text: "剛才戰鬥中漏掉的小失誤，反省如何做到完美。", type: "P", weight: 2, type: "W", weight: 1 },
            { text: "各種新奇的魔法組合，雖然還沒試過但感覺很強。", type: "D", weight: 3 }
        ]
    },
    {
        q: "公會規定每位冒險者都要寫戰鬥日誌...",
        options: [
            { text: "每天雖然痛苦但還是強撐著寫完，甚至寫到過勞。", type: "O", weight: 3 },
            { text: "覺得這規定太束縛，能拖就拖，直到最後一刻才補完。", type: "R", weight: 2, type: "L", weight: 1 }
        ]
    },
    {
        q: "冒險結束，結算積分時...",
        options: [
            { text: "即使累壞了，還是會想著如果當時再多觀察一下就好了。", type: "W", weight: 3, type: "P", weight: 1 },
            { text: "只要有拿到賞金就好，現在只想徹底放鬆不想任何計畫。", type: "L", weight: 2 }
        ]
    }
    
];

function loadQuestion() {
    const qData = quizData[currentStep];
    document.getElementById("question-text").innerText = qData.q;
    const container = document.getElementById("options-container");
    container.innerHTML = ""; // 清空舊選項

    qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt.type, opt.weight);
        container.appendChild(btn);
    });

    // 第一題隱藏上一題按鈕
    document.getElementById("back-btn").style.visibility = currentStep === 0 ? "hidden" : "visible";
}

function selectOption(type, weight) {
    scores[type] += weight;
    history.push({ type, weight });
    
    if (currentStep < quizData.length - 1) {
        currentStep++;
        loadQuestion();
    } else {
        showResult();
    }
}

function previousQuestion() {
    if (currentStep > 0) {
        const last = history.pop();
        scores[last.type] -= last.weight; // 扣回分數
        currentStep--;
        loadQuestion();
    }
}

function showResult() {
    // 找出最高分的人格邏輯
    const result = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const names = { P: "完美主義者", D: "夢想家", W: "杞人憂天者", L: "臨陣磨槍者", R: "叛逆者", O: "過勞者" };
    document.querySelector(".card-main-frame").innerHTML = `
        <div class="top-group"><h2>測驗結果</h2></div>
        <div class="middle-group"><h1 style="color:#c9a063; text-align:center;">${names[result]}</h1></div>
        <div class="bottom-group"><button onclick="location.reload()" class="option-btn">重測一次</button></div>
    `;
}

loadQuestion(); // 初始化頁面