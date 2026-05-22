const questions = [
  { q:"요즘 SNS에서 가장 오래 보게 되는 콘텐츠는?", options:[
    {text:"예쁜 일상, 브이로그, 감성 카페", add:{validation:1, comparison:1, algorithm:1}},
    {text:"패션, 뷰티, 몸매 관리", add:{validation:2, comparison:2, consumption:1}},
    {text:"쇼핑 추천, 할인, 신상 리뷰", add:{consumption:2, algorithm:1}},
    {text:"딱히 없음. 그냥 넘김", add:{fatigue:1}}
  ]},
  { q:"왜 그 콘텐츠에서 멈췄나요?", options:[
    {text:"예쁘고 좋아 보여서", add:{validation:1, comparison:1}},
    {text:"따라하고 싶어서", add:{validation:2, comparison:2}},
    {text:"계속 뜨니까 보게 돼서", add:{algorithm:2}},
    {text:"이상하게 신경 쓰여서", add:{anxiety:1, fatigue:1}}
  ]},
  { q:"그걸 보면 어떤 감정이 제일 커지나요?", options:[
    {text:"동경", add:{anxiety:3}},
    {text:"지금의 나를 바꾸고싶음", add:{comparison:3}},
    {text:"호기심", add:{emptiness:3}},
    {text:"갖고 싶음", add:{consumption:3}}
  ]},
  { q:,"나도 모르게 오래 보게 되는 광고는?" options:[
    {text:"사고 싶게 만드는 광고", add:{validation:2, comparison:1}},
    {text:"댓글 반응이 폭발하는 광고", add:{comparison:2, consumption:1}},
    {text:"이상하게 자꾸 다시 뜨는 광고", add:{validation:3}},
    {text:"평소에 관심이 있던 물건의 광고", add:{anxiety:2, emptiness:1}}
  ]},
  { q:"나도 저렇게 되고 싶다고 느껴?", options:[
    {text:"많이 느껴", add:{validation:2, comparison:2, consumption:1}},
    {text:"조금 느껴", add:{validation:1, comparison:1}},
    {text:"가끔 피곤해져", add:{fatigue:2}},
    {text:"거의 안 느껴", add:{fatigue:1}}
  ]},
  { q:"사람들이 너를 어떻게 봤으면 좋겠어?", options:[
    {text:"괜히 계속 눈이 가는 사람", add:{validation:2}},
    {text:"예쁜/멋진 사람", add:{validation:3}},
    {text:"남들이 좋아할 것 같은 사람", add:{validation:2, comparison:1}},
    {text:"그냥 나답게 봤으면 좋겠음", add:{fatigue:1}}
  ]},
  { q:"그걸 가지면 뭐가 달라질 것 같아?", options:[
    {text:"덜 불안할 것 같아", add:{anxiety:2}},
    {text:"인정받을 것 같아", add:{validation:2}},
    {text:"남들보다 뒤처지지 않을 것 같아", add:{comparison:2, anxiety:1}},
    {text:"잠깐 기분이 좋아질 것 같아", add:{consumption:2, emptiness:1}}
  ]},
  { q:"실제로 그걸 위해 사고 싶은 게 있어?", options:[
    {text:"옷이나 패션 소품", add:{consumption:2, validation:1}},
    {text:"화장품/관리 제품", add:{consumption:2, validation:1}},
    {text:"전자기기나 인테리어 소품", add:{consumption:2, comparison:1}},
    {text:"딱히 없지만 계속 보게 돼", add:{algorithm:2, fatigue:1}}
  ]},
  { q:"광고가 계속 뜨면 어떻게 해?", options:[
    {text:"결국 눌러본다", add:{algorithm:2, consumption:1}},
    {text:"저장해둔다", add:{consumption:2}},
    {text:"넘긴다", add:{fatigue:2}},
    {text:"숨김/차단한다", add:{fatigue:3}}
  ]},
  { q:"결국 사고 나면 오래 만족해?", options:[
    {text:"오래 만족한다", add:{validation:1}},
    {text:"금방 식는다", add:{emptiness:2, fatigue:1}},
    {text:"후회할 때가 많다", add:{anxiety:1, emptiness:2}},
    {text:"사기 전까지가 제일 좋다", add:{consumption:1, emptiness:2}}
  ]}
];

const initialScores = { validation:0, comparison:0, anxiety:0, consumption:0, algorithm:0, fatigue:0, emptiness:0 };
let scores = {...initialScores};
let current = 0;

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const questionTitle = document.getElementById("questionTitle");
const optionsEl = document.getElementById("options");
const stepText = document.getElementById("stepText");
const barFill = document.getElementById("barFill");

startBtn.addEventListener("click", start);
restartBtn.addEventListener("click", () => {
  current = 0;
  scores = {...initialScores};
  result.classList.add("hidden");
  intro.classList.remove("hidden");
});

function start(){
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion(){
  const item = questions[current];
  questionTitle.textContent = item.q;
  stepText.textContent = `${current + 1} / ${questions.length}`;
  barFill.style.width = `${((current + 1) / questions.length) * 100}%`;
  optionsEl.innerHTML = "";

  item.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => selectOption(opt.add));
    optionsEl.appendChild(btn);
  });
}

function selectOption(add){
  Object.entries(add).forEach(([key, value]) => scores[key] += value);
  current++;
  if(current < questions.length) renderQuestion();
  else showResult();
}

function topKey(){
  return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
}

function showResult(){
  quiz.classList.add("hidden");
  result.classList.remove("hidden");

  const key = topKey();
  const resultData = getResultData(key);
  const gloss = scores.validation + scores.comparison;
  const size = scores.consumption + scores.algorithm;
  const crack = scores.fatigue + scores.emptiness + scores.anxiety;

  document.getElementById("resultName").textContent = resultData.name;
  document.getElementById("resultDesc").textContent = resultData.desc;
  document.getElementById("specColor").textContent = resultData.colorText;
  document.getElementById("specGloss").textContent = gloss >= 8 ? "고광택 / 반사형" : gloss >= 4 ? "은은한 광택" : "무광에 가까움";
  document.getElementById("specTexture").textContent = crack >= 8 ? "균열 있음 / 닳은 표면" : crack >= 4 ? "잔흠집 있음" : "매끈함";
  document.getElementById("specSize").textContent = size >= 8 ? "대형 욕망구" : size >= 4 ? "중형 욕망구" : "소형 욕망구";
  document.getElementById("resultCopy").textContent = resultData.copy;

  const dango = document.getElementById("dangoVisual");
  dango.style.setProperty("--dango-color", resultData.color);
  dango.style.setProperty("--pattern-opacity", scores.algorithm >= 4 ? ".45" : ".18");
  dango.classList.toggle("crack", crack >= 6);
}

function getResultData(key){
  const map = {
    validation:{name:"보여지기 좋은 구슬", color:"#d9e8c3", colorText:"파스텔 연두 + 반사광", desc:"타인의 시선 앞에서 더 매끈해지고 싶어 하는 욕망이 광택으로 굳어진 도로당고입니다.", copy:"남들이 보는 나를 조금 더 반짝이게 해드립니다."},
    comparison:{name:"남의 삶 반사구", color:"#cbb7e8", colorText:"연보라 + 차가운 그림자", desc:"비교의 시선이 표면에 남아, 볼수록 다른 사람의 삶을 비추는 도로당고입니다.", copy:"나보다 좋아 보이는 삶을 오래 반사합니다."},
    anxiety:{name:"조급한 붉은 공", color:"#e78f86", colorText:"흐린 붉은색", desc:"놓치면 뒤처질 것 같은 감각이 압축된 도로당고입니다. 표면 아래 작은 긴장이 남아 있습니다.", copy:"오늘만, 지금만, 놓치면 안 될 것 같은 기분을 담았습니다."},
    consumption:{name:"장바구니의 달", color:"#f1d77b", colorText:"부드러운 노랑 + 흙빛", desc:"사기 전의 설렘이 가장 크게 남아 있는 도로당고입니다.", copy:"결제 직전의 반짝임을 오래 보관하세요."},
    algorithm:{name:"추천된 욕망구", color:"#c7e6b1", colorText:"연두색 + 반복 무늬", desc:"계속 보여졌기 때문에 가까워진 욕망이 둥글게 굳어진 결과입니다.", copy:"당신이 좋아할 가능성이 높은 욕망입니다."},
    fatigue:{name:"닳아버린 취향", color:"#bfc7b8", colorText:"회녹색 무광", desc:"너무 많이 추천되고 너무 자주 반복되어 표면이 조용히 닳아버린 도로당고입니다.", copy:"더 이상 새롭지 않은 새로움을 담았습니다."},
    emptiness:{name:"속이 빈 만족", color:"#d2d2c8", colorText:"흐린 회색", desc:"갖고 싶었지만 막상 가진 뒤에는 오래 남지 않는 감각이 만든 도로당고입니다.", copy:"채운 것 같지만 다시 비어 있는 기분을 제공합니다."}
  };
  return map[key];
}
