/* ---------- SUPABASE INIT ---------- */
const supabaseUrl = "https://wjjkqsgejkvfdrkqmuln.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqamtxc2dlamt2ZmRya3FtdWxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY2MTg3MSwiZXhwIjoyMDc5MjM3ODcxfQ.9d2YSB5vyD4rF843aKB0M9efy-p_-FNlGD0IGKoUvbw";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/* ---------- SUPABASE: INSERT SCORE ---------- */
async function saveScoreToSupabase() {
  if (scoreSaved) {
    console.log("Skor sudah tersimpan sebelumnya — skip insert");
    return;
  }

  const durationSeconds = gameStartTime
    ? Math.floor((Date.now() - gameStartTime) / 1000)
    : null;

  const payload = {
    name: currentPlayerName,
    class: currentPlayerClass,
    score: score,
    line: lines,
    duration: durationSeconds,
  };

  const { data, error } = await supabaseClient
    .from("score_recap")
    .insert(payload);

  if (error) {
    console.error("Gagal menyimpan skor:", error);
  } else {
    console.log("Skor tersimpan:", data);
    scoreSaved = true;
    const saveBtn = document.getElementById("saveScoreBtn");
    if (saveBtn) {
      saveBtn.textContent = "Tersimpan!";
      saveBtn.disabled = true;
    }
  }
}

/* ---------- SUPABASE: LOAD LEADERBOARD ---------- */
async function loadLeaderboard() {
  const { data, error } = await supabaseClient
    .from("score_recap")
    .select("*")
    .order("score", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Gagal load leaderboard:", error);
    return [];
  }

  return data;
}

/* ---------- CONFIG ---------- */
const defaultConfig = {
  game_title: "Tetris Rotasi Quiz",
  login_title: "Selamat Datang",
  score_label: "Skor",
  quiz_title: "Soal Rotasi",
  quiz_question: "Berapa transformasi yang terjadi?",
  background_color: "#1f2937",
  primary_color: "#2563eb",
  text_color: "#ffffff",
  accent_color: "#8b5cf6",
  success_color: "#10b981",
};

const PIECES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const COLORS = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000",
};

/* ---------- SOAL (semua fokus ke ROTASI) ---------- */
const QUESTIONS = [
  {
    id: 1,
    piece: "T",
    startRotation: 0,
    targetRotation: 3,
    prompt:
      "Jelaskan dengan kata-katamu sendiri: transformasi ROTASI apa yang terjadi dari bangun A ke bangun B?",
    options: [
      {
        label:
          "Bangun A diputar 90° berlawanan arah jarum jam terhadap titik pusat",
        answer: "ROT_90_CCW",
      },
      {
        label: "Bangun A digeser 2 kotak ke kanan tanpa diputar",
        answer: "TRANS_R2",
      },
      {
        label: "Bangun A dicerminkan terhadap sumbu vertikal",
        answer: "REF_V",
      },
      {
        label: "Bangun A diperbesar 2 kali lipat ukurannya",
        answer: "SCALE_2",
      },
    ],
    correctAnswer: "ROT_90_CCW",
    indicators: [1],
    explanation:
      "Rotasi 90° berlawanan arah jarum jam memutar setiap titik 90° ke kiri terhadap titik pusat rotasi.",
  },
  {
    id: 2,
    piece: "L",
    startRotation: 0,
    targetRotation: 2,
    prompt:
      "Manakah pasangan A dan B yang menunjukkan ROTASI 180° dari potongan L?",
    options: [
      {
        label: "B adalah L yang diputar 180° terhadap titik pusat",
        answer: "ROT_180",
      },
      { label: "B adalah L yang diputar 90° saja", answer: "ROT_90" },
      {
        label: "B adalah L yang dicerminkan terhadap sumbu-X",
        answer: "REF_X",
      },
      { label: "B adalah L yang hanya digeser ke kanan", answer: "TRANS_L" },
    ],
    correctAnswer: "ROT_180",
    indicators: [2],
    explanation:
      "Rotasi 180° membalik orientasi L sehingga ujung-ujungnya berlawanan arah dari posisi awal.",
  },
  {
    id: 3,
    piece: "I",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Sebuah potongan I memiliki titik (0,0),(1,0),(2,0),(3,0). Setelah rotasi 90° searah jarum jam terhadap titik (0,0), manakah koordinat yang benar?",
    options: [
      { label: "(0,0),(0,1),(0,2),(0,3)", answer: "(0,0),(0,1),(0,2),(0,3)" },
      { label: "(1,0),(2,0),(3,0),(4,0)", answer: "(1,0),(2,0),(3,0),(4,0)" },
      { label: "(0,0),(1,0),(2,0),(3,0)", answer: "(0,0),(1,0),(2,0),(3,0)" },
      { label: "(-1,0),(0,0),(1,0),(2,0)", answer: "(-1,0),(0,0),(1,0),(2,0)" },
    ],
    correctAnswer: "(0,0),(0,1),(0,2),(0,3)",
    indicators: [3],
    explanation:
      "Rotasi 90° searah jarum jam terhadap titik (0,0) mengubah baris horizontal menjadi kolom vertikal dengan x tetap dan y naik.",
  },
  {
    id: 4,
    piece: "J",
    startRotation: 0,
    targetRotation: 3,
    prompt:
      "Bagaimana hubungan antara rotasi 270° berlawanan arah jarum jam dan rotasi 90° searah jarum jam pada potongan J?",
    options: [
      { label: "Keduanya menghasilkan posisi akhir yang sama", answer: "SAME" },
      { label: "Satu adalah dilatasi dari yang lain", answer: "SCALE_REL" },
      { label: "Satu adalah refleksi dari yang lain", answer: "REF_REL" },
      { label: "Tidak ada hubungan sama sekali", answer: "NONE" },
    ],
    correctAnswer: "SAME",
    indicators: [4],
    explanation:
      "Rotasi 270° berlawanan arah jarum jam sama dengan rotasi 90° searah jarum jam, sehingga posisi akhirnya identik.",
  },
  {
    id: 5,
    piece: "I",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Di papan Tetris terdapat celah vertikal 4 kotak. Potongan I yang kamu miliki masih dalam posisi horizontal. Rotasi berapa derajat yang harus kamu lakukan agar potongan I masuk tepat ke celah?",
    options: [
      { label: "90°", answer: "90" },
      { label: "180°", answer: "180" },
      { label: "270°", answer: "270" },
      { label: "0° (tanpa rotasi)", answer: "0" },
    ],
    correctAnswer: "90",
    indicators: [5],
    explanation:
      "Rotasi 90° mengubah potongan I dari horizontal menjadi vertikal sehingga dapat mengisi celah vertikal 4 kotak.",
  },
  {
    id: 6,
    piece: "S",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Potongan S diputar 90° terhadap titik pusatnya. Pernyataan manakah yang paling tepat?",
    options: [
      {
        label: "Bentuk S tetap sama tetapi orientasinya berubah",
        answer: "ROT_90",
      },
      { label: "Bentuk S hilang karena rotasi", answer: "HILANG" },
      {
        label: "Bentuk S berubah ukuran menjadi dua kali lebih besar",
        answer: "BESAR2X",
      },
      { label: "Bentuk S hanya bergeser tanpa berputar", answer: "GESER" },
    ],
    correctAnswer: "ROT_90",
    indicators: [2, 3],
    explanation:
      "Rotasi mengubah orientasi bangun tetapi mempertahankan bentuk dan ukuran.",
  },
  {
    id: 7,
    piece: "Z",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Manakah dari berikut ini yang merupakan CONTOH ROTASI pada potongan Z di papan Tetris?",
    options: [
      {
        label:
          "Z diputar 90° berlawanan arah jarum jam di sekitar satu titik sudutnya",
        answer: "ROT_Z_90",
      },
      {
        label: "Z digeser 2 kotak ke kanan tanpa diputar",
        answer: "TRANS_Z_KANAN",
      },
      {
        label: "Z dicerminkan terhadap sumbu vertikal papan",
        answer: "REF_Z_VERT",
      },
      {
        label: "Z hanya diganti warna tanpa perubahan posisi",
        answer: "WARNA_Z",
      },
    ],
    correctAnswer: "ROT_Z_90",
    indicators: [2],
    explanation:
      "Contoh rotasi adalah ketika bangun berputar terhadap suatu titik pusat, bukan hanya bergeser, dicerminkan, atau diganti warna.",
  },
  {
    id: 8,
    piece: "O",
    startRotation: 0,
    targetRotation: 0,
    prompt:
      "Potongan O berbentuk persegi 2×2. Apakah rotasi 90°, 180°, atau 270° mengubah bentuk dan posisinya relatif terhadap pusat rotasi?",
    options: [
      {
        label: "Tidak mengubah bentuk dan posisinya relatif terhadap pusat",
        answer: "NO_CHANGE",
      },
      { label: "Mengubah persegi menjadi garis lurus", answer: "LINE" },
      { label: "Membesar menjadi persegi 4×4", answer: "BIG" },
      { label: "Membalik bangun sehingga tidak lagi persegi", answer: "FLIP" },
    ],
    correctAnswer: "NO_CHANGE",
    indicators: [3],
    explanation:
      "Persegi memiliki simetri putar, sehingga rotasi 90°, 180°, atau 270° terhadap pusat membuat bangun menempati posisi yang ekuivalen.",
  },
  {
    id: 9,
    piece: "T",
    startRotation: 0,
    targetRotation: 3,
    prompt:
      "Potongan T diputar 90° berlawanan arah jarum jam sebanyak tiga kali berturut-turut. Transformasi tunggal apa yang ekuivalen dengan gabungan rotasi tersebut?",
    options: [
      {
        label: "Rotasi 270° berlawanan arah jarum jam",
        answer: "ROT_270_CCW_EQ",
      },
      {
        label: "Rotasi 90° berlawanan arah jarum jam",
        answer: "ROT_90_CCW_EQ",
      },
      {
        label: "Rotasi 180° berlawanan arah jarum jam",
        answer: "ROT_180_CCW_EQ",
      },
      {
        label: "Rotasi 360° berlawanan arah jarum jam",
        answer: "ROT_360_CCW_EQ",
      },
    ],
    correctAnswer: "ROT_270_CCW_EQ",
    indicators: [4, 5],
    explanation:
      "Tiga kali rotasi 90° berlawanan arah jarum jam sama dengan satu rotasi 270° berlawanan arah jarum jam.",
  },
  {
    id: 10,
    piece: "J",
    startRotation: 0,
    targetRotation: 2,
    prompt:
      "Potongan J diputar 180° terhadap titik pusat. Pernyataan manakah yang benar tentang bangun setelah rotasi?",
    options: [
      {
        label:
          "Arahnya berbalik 180° dari posisi awal tetapi bentuk dan ukurannya tetap",
        answer: "180",
      },
      { label: "Bangun menjadi dua kali lebih panjang", answer: "PANJANG2X" },
      { label: "Bangun berubah menjadi potongan L", answer: "JADI_L" },
      { label: "Bangun hanya bergeser tanpa berputar", answer: "GESER_SAJA" },
    ],
    correctAnswer: "180",
    indicators: [4, 5],
    explanation:
      "Rotasi 180° membalik orientasi J secara penuh tetapi mempertahankan bentuk dan ukuran.",
  },
  {
    id: 11,
    piece: "T",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Dengan kata-katamu sendiri, manakah kalimat yang PALING tepat menjelaskan apa itu ROTASI dalam geometri?",
    options: [
      {
        label:
          "Perubahan posisi bangun dengan cara memutarnya terhadap suatu titik pusat dengan besar sudut tertentu",
        answer: "DEFINISI_ROTASI_BENAR",
      },
      {
        label:
          "Perubahan posisi bangun dengan cara menggeser sejajar tanpa berputar",
        answer: "DEFINISI_TRANSLASI",
      },
      {
        label:
          "Perubahan posisi bangun dengan cara membalik terhadap suatu garis",
        answer: "DEFINISI_REFLEKSI",
      },
      {
        label: "Perubahan bentuk bangun tanpa mengubah posisinya",
        answer: "DEFINISI_BENTUK",
      },
    ],
    correctAnswer: "DEFINISI_ROTASI_BENAR",
    indicators: [1],
    explanation:
      "Rotasi adalah transformasi yang memutar bangun terhadap titik pusat dengan sudut tertentu, tanpa mengubah bentuk dan ukuran.",
  },
  {
    id: 12,
    piece: "L",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Manakah dari berikut ini yang merupakan CONTOH ROTASI pada potongan L?",
    options: [
      {
        label: "L diputar 90° terhadap titik asal (0,0)",
        answer: "ROT_L_90",
      },
      {
        label: "L digeser 3 kotak ke kanan tanpa diputar",
        answer: "TRANS_L_KANAN",
      },
      {
        label: "L dicerminkan terhadap sumbu-Y",
        answer: "REF_L_Y",
      },
      {
        label: "L dibesarkan menjadi dua kali ukuran semula",
        answer: "DILATASI_L",
      },
    ],
    correctAnswer: "ROT_L_90",
    indicators: [2],
    explanation:
      "Hanya memutar bangun terhadap sebuah titik yang termasuk rotasi; menggeser, mencerminkan, dan memperbesar bukan rotasi.",
  },
  {
    id: 13,
    piece: "I",
    startRotation: 1,
    targetRotation: 1,
    prompt:
      "Aturan (x, y) → (−y, x) merupakan representasi simbolik dari rotasi berapa derajat dan ke arah mana terhadap titik asal?",
    options: [
      {
        label: "Rotasi 90° berlawanan arah jarum jam",
        answer: "ROT_90_CCW_RULE",
      },
      {
        label: "Rotasi 90° searah jarum jam",
        answer: "ROT_90_CW_RULE",
      },
      {
        label: "Rotasi 180°",
        answer: "ROT_180_RULE",
      },
      {
        label: "Rotasi 270° searah jarum jam",
        answer: "ROT_270_CW_RULE",
      },
    ],
    correctAnswer: "ROT_90_CCW_RULE",
    indicators: [3],
    explanation:
      "Rumus (x, y) → (−y, x) adalah representasi rotasi 90° berlawanan arah jarum jam terhadap titik asal (0,0).",
  },
  {
    id: 14,
    piece: "S",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Rotasi termasuk transformasi isometri. Konsep manakah yang paling tepat menjelaskan mengapa rotasi termasuk isometri?",
    options: [
      {
        label:
          "Rotasi mempertahankan jarak dan sudut sehingga bentuk dan ukuran bangun tetap",
        answer: "ISOMETRI_ROT",
      },
      {
        label: "Rotasi selalu mengubah ukuran bangun menjadi lebih besar",
        answer: "ROTASI_PERBESAR",
      },
      {
        label: "Rotasi hanya mengubah warna tanpa mengubah posisi titik",
        answer: "ROTASI_WARNA",
      },
      {
        label: "Rotasi selalu memindahkan bangun ke titik asal (0,0)",
        answer: "ROTASI_KE_ASAL",
      },
    ],
    correctAnswer: "ISOMETRI_ROT",
    indicators: [4],
    explanation:
      "Rotasi adalah isometri karena jarak antar titik dan besar sudut di dalam bangun tetap, sehingga bentuk dan ukuran bangun tidak berubah.",
  },
  {
    id: 15,
    piece: "Z",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Di papan Tetris terdapat celah yang hanya bisa diisi oleh potongan Z yang sudah miring 90°. Potongan Z yang kamu punya masih dalam posisi awal. Transformasi apa yang harus dilakukan agar potongan Z pas dengan celah?",
    options: [
      {
        label: "Rotasi 90° berlawanan arah jarum jam",
        answer: "ROT_90_CCW_Z",
      },
      {
        label: "Rotasi 180°",
        answer: "ROT_180_Z",
      },
      {
        label: "Rotasi 270° berlawanan arah jarum jam",
        answer: "ROT_270_CCW_Z",
      },
      {
        label: "Tanpa rotasi, cukup digeser saja",
        answer: "NO_ROT_Z",
      },
    ],
    correctAnswer: "ROT_90_CCW_Z",
    indicators: [5],
    explanation:
      "Karena celah sudah berbentuk Z yang miring 90°, kamu perlu merotasi potongan Z sebesar 90° ke arah yang sama agar bentuk dan orientasinya cocok.",
  },
  {
    id: 16,
    piece: "O",
    startRotation: 0,
    targetRotation: 0,
    prompt:
      "Potongan O (persegi 2×2) memiliki simetri putar orde 4. Apa artinya hal tersebut dalam konteks ROTASI?",
    options: [
      {
        label: "Bangun kembali ke posisi semula setiap diputar kelipatan 90°",
        answer: "SIMETRI_PUTAR4",
      },
      {
        label: "Bangun hanya kembali ke posisi semula setelah diputar 360°",
        answer: "HANYA_360",
      },
      {
        label: "Bangun berubah bentuk setiap diputar sedikit saja",
        answer: "SELALU_BERUBAH",
      },
      {
        label: "Bangun tidak bisa diputar sama sekali",
        answer: "TIDAK_BISA_DIPUTAR",
      },
    ],
    correctAnswer: "SIMETRI_PUTAR4",
    indicators: [3, 4],
    explanation:
      "Simetri putar orde 4 berarti ada 4 posisi berorientasi sama dalam satu putaran penuh, yaitu setiap 90° (90°, 180°, 270°, dan 360°).",
  },
  {
    id: 17,
    piece: "J",
    startRotation: 1,
    targetRotation: 1,
    prompt:
      "Titik A(2, 1) diputar 90° berlawanan arah jarum jam terhadap titik asal sehingga menjadi A′(−1, 2). Konsep apa yang digunakan untuk menjelaskan perubahan koordinat ini?",
    options: [
      {
        label: "Rumus rotasi 90° berlawanan arah jarum jam: (x, y) → (−y, x)",
        answer: "RUMUS_ROT90_CCW",
      },
      {
        label: "Rumus translasi umum (x, y) → (x + a, y + b)",
        answer: "RUMUS_TRANS",
      },
      {
        label: "Rumus refleksi terhadap sumbu-X",
        answer: "RUMUS_REF_X",
      },
      {
        label: "Rumus dilatasi dengan faktor skala k",
        answer: "RUMUS_DILATASI",
      },
    ],
    correctAnswer: "RUMUS_ROT90_CCW",
    indicators: [1, 3],
    explanation:
      "Perubahan dari (2,1) ke (−1,2) sesuai dengan rumus rotasi 90° berlawanan arah jarum jam, yaitu (x, y) → (−y, x).",
  },
  {
    id: 18,
    piece: "T",
    startRotation: 0,
    targetRotation: 2,
    prompt:
      "Pada permainan Tetris, kamu memutar potongan T dua kali 90° searah jarum jam. Transformasi gabungan ini ekuivalen dengan transformasi apa?",
    options: [
      {
        label: "Satu rotasi 180° searah jarum jam",
        answer: "ROT_180_EQ",
      },
      {
        label: "Satu rotasi 90° berlawanan arah jarum jam",
        answer: "ROT_90_CCW_EQ2",
      },
      {
        label: "Satu rotasi 270° berlawanan arah jarum jam",
        answer: "ROT_270_CCW_EQ2",
      },
      {
        label: "Bangun kembali ke posisi semula",
        answer: "KEMBALI_SEMULA",
      },
    ],
    correctAnswer: "ROT_180_EQ",
    indicators: [4, 5],
    explanation:
      "Dua rotasi 90° searah jarum jam setara dengan satu rotasi 180° searah jarum jam.",
  },
  {
    id: 19,
    piece: "L",
    startRotation: 0,
    targetRotation: 1,
    prompt:
      "Potongan L dalam posisi awal akan diputar agar cocok dengan bentuk target L′ seperti pada gambar. Jika L′ adalah hasil rotasi 90° berlawanan arah jarum jam dari L, transformasi apa yang harus kamu lakukan pada L?",
    options: [
      {
        label: "Rotasi 90° berlawanan arah jarum jam",
        answer: "ROT_L_90_CCW_APPLY",
      },
      {
        label: "Rotasi 180°",
        answer: "ROT_L_180_APPLY",
      },
      {
        label: "Rotasi 270° berlawanan arah jarum jam",
        answer: "ROT_L_270_CCW_APPLY",
      },
      {
        label: "Tanpa rotasi, cukup digeser",
        answer: "NO_ROT_L_APPLY",
      },
    ],
    correctAnswer: "ROT_L_90_CCW_APPLY",
    indicators: [3, 5],
    explanation:
      "Karena L′ adalah hasil rotasi 90° berlawanan arah jarum jam dari L, kamu harus menerapkan rotasi yang sama pada L agar bentuknya sesuai.",
  },
  {
    id: 20,
    piece: "Z",
    startRotation: 0,
    targetRotation: 3,
    prompt:
      "Sebuah bangun diputar 180° berlawanan arah jarum jam, kemudian diputar lagi 90° berlawanan arah jarum jam terhadap titik asal. Transformasi tunggal apa yang ekuivalen dengan gabungan rotasi tersebut?",
    options: [
      {
        label: "Rotasi 270° berlawanan arah jarum jam",
        answer: "ROT_270_CCW_COMB",
      },
      {
        label: "Rotasi 90° berlawanan arah jarum jam",
        answer: "ROT_90_CCW_COMB",
      },
      {
        label: "Rotasi 180° berlawanan arah jarum jam",
        answer: "ROT_180_CCW_COMB",
      },
      {
        label: "Rotasi 360° berlawanan arah jarum jam",
        answer: "ROT_360_CCW_COMB",
      },
    ],
    correctAnswer: "ROT_270_CCW_COMB",
    indicators: [4, 5],
    explanation:
      "Rotasi 180° ccw diikuti 90° ccw setara dengan rotasi 270° ccw terhadap titik asal.",
  },
];

/* ---------- HELPER: SHUFFLE ---------- */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- STATE ---------- */
let config = { ...defaultConfig };
let currentRecordCount = 0;
let currentPlayerName = "";
let currentPlayerClass = "";
// tracking waktu dan status penyimpanan
let gameStartTime = null; // timestamp ms
let scoreSaved = false;
let feedbackTimeout = null;

let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let currentPiece = null;
let currentX = 0,
  currentY = 0,
  currentRotation = 0;
let nextPieceType = null;

let score = 0,
  level = 1,
  lines = 0;
let gameLoop = null,
  isPaused = false,
  isGameOver = false;
let quizActive = false;
let questionIndex = 0;
let originalPieceType = null;

// soal aktif = versi acak dari QUESTIONS (diacak tiap login)
let activeQuestions = shuffleArray(QUESTIONS);

// flag: apakah soal sekarang sudah pernah dijawab salah
let currentQuestionWasWrong = false;

/* ---------- AUDIO ---------- */
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, dur, type = "sine") {
  try {
    if (audioContext.state === "suspended") audioContext.resume();
  } catch (e) {}

  const o = audioContext.createOscillator();
  const g = audioContext.createGain();
  o.connect(g);
  g.connect(audioContext.destination);
  o.frequency.value = freq;
  o.type = type;
  g.gain.setValueAtTime(0.1, audioContext.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + dur);
  o.start(audioContext.currentTime);
  o.stop(audioContext.currentTime + dur);
}

function playMoveSound() {
  playSound(200, 0.05, "square");
}
function playRotateSound() {
  playSound(300, 0.08, "square");
}
function playDropSound() {
  playSound(150, 0.15, "sawtooth");
}
function playLineClearSound() {
  playSound(500, 0.2, "sine");
  setTimeout(() => playSound(600, 0.2, "sine"), 100);
}
function playCorrectSound() {
  playSound(523, 0.1, "sine");
  setTimeout(() => playSound(659, 0.15, "sine"), 100);
}
function playWrongSound() {
  playSound(200, 0.3, "sawtooth");
}
function playGameOverSound() {
  playSound(300, 0.2, "sawtooth");
  setTimeout(() => playSound(250, 0.2, "sawtooth"), 150);
  setTimeout(() => playSound(200, 0.3, "sawtooth"), 300);
}

/* ---------- BOARD ---------- */
function initBoard() {
  const gb = document.getElementById("gameBoard");
  gb.innerHTML = "";
  for (let i = 0; i < 200; i++) {
    const cell = document.createElement("div");
    cell.className = "tetris-block";
    cell.style.background = "#111";
    gb.appendChild(cell);
  }
}

function drawBoard() {
  const cells = document.querySelectorAll("#gameBoard .tetris-block");
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      const idx = i * 10 + j;
      cells[idx].style.background = board[i][j] ? board[i][j] : "#111";
    }
  }
  if (currentPiece) {
    const piece = getPieceWithRotation(currentPiece.type, currentRotation);
    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j]) {
          const x = currentX + j,
            y = currentY + i;
          if (y >= 0 && y < 20 && x >= 0 && x < 10) {
            const idx = y * 10 + x;
            cells[idx].style.background = COLORS[currentPiece.type];
          }
        }
      }
    }
  }
}

/* ---------- PIECE HELPERS ---------- */
function getPieceWithRotation(type, rotation) {
  let piece = JSON.parse(JSON.stringify(PIECES[type]));
  for (let r = 0; r < rotation; r++) {
    piece = rotatePiece(piece);
  }
  return piece;
}

function rotatePiece(piece) {
  const rows = piece.length,
    cols = piece[0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = piece[i][j];
    }
  }
  return rotated;
}

function checkCollision(piece, x, y) {
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j]) {
        const newX = x + j,
          newY = y + i;
        if (newX < 0 || newX >= 10 || newY >= 20) return true;
        if (newY >= 0 && board[newY][newX]) return true;
      }
    }
  }
  return false;
}

/* ---------- LOCK & CLEAR ---------- */
function lockPiece() {
  const piece = getPieceWithRotation(currentPiece.type, currentRotation);
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j]) {
        const x = currentX + j,
          y = currentY + i;
        if (y >= 0) board[y][x] = COLORS[currentPiece.type];
      }
    }
  }
  clearLines();
  spawnPiece();
}

function clearLines() {
  let linesCleared = 0;
  for (let i = 19; i >= 0; i--) {
    if (board[i].every((cell) => cell !== 0)) {
      board.splice(i, 1);
      board.unshift(Array(10).fill(0));
      linesCleared++;
      i++;
    }
  }
  if (linesCleared > 0) {
    lines += linesCleared;
    score += linesCleared * 100 * level;
    level = Math.floor(lines / 10) + 1;
    playLineClearSound();
    updateDisplay();
  }
}

/* ---------- NEXT PIECE VISUAL ---------- */
function drawNextPiece() {
  const el = document.getElementById("nextPiece");
  el.innerHTML = "";
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.style.width = "15px";
    cell.style.height = "15px";
    cell.style.background = "#222";
    cell.style.border = "1px solid #444";
    el.appendChild(cell);
  }
  if (nextPieceType) {
    const piece = PIECES[nextPieceType];
    const color = COLORS[nextPieceType];
    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j]) {
          const idx = i * 4 + j;
          if (el.children[idx]) el.children[idx].style.background = color;
        }
      }
    }
  }
}

/* ---------- QUIZ UI ---------- */
function updateSideQuiz(original, rotated, question) {
  const sideOriginal = document.getElementById("sideOriginalShape");
  const sideTarget = document.getElementById("sideTargetShape");
  sideOriginal.innerHTML = "";
  sideTarget.innerHTML = "";

  const maxSize = Math.max(
    original.length,
    original[0].length,
    rotated.length,
    rotated[0].length,
    3
  );

  sideOriginal.style.gridTemplateColumns = `repeat(${maxSize}, 10px)`;
  sideTarget.style.gridTemplateColumns = `repeat(${maxSize}, 10px)`;

  for (let i = 0; i < maxSize; i++) {
    for (let j = 0; j < maxSize; j++) {
      const cell = document.createElement("div");
      cell.className = "mini-block";
      const has = original[i] && original[i][j] ? true : false;
      cell.style.background = has ? COLORS[originalPieceType] : "#333";
      sideOriginal.appendChild(cell);
    }
  }

  for (let i = 0; i < maxSize; i++) {
    for (let j = 0; j < maxSize; j++) {
      const cell = document.createElement("div");
      cell.className = "mini-block";
      const has = rotated[i] && rotated[i][j] ? true : false;
      cell.style.background = has ? COLORS[originalPieceType] : "#333";
      sideTarget.appendChild(cell);
    }
  }

  document.getElementById("sideQuizQuestion").textContent = question.prompt;

  const optsContainer = document.getElementById("sideQuizOptions");
  optsContainer.innerHTML = "";

  // ACak posisi jawaban: shuffle options
  const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

  shuffledOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className =
      "side-quiz-option bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-3 px-3 rounded-xl text-sm font-bold shadow-lg border border-blue-400/30 transform hover:scale-105 transition-all";
    btn.textContent = opt.label;
    btn.dataset.answer = opt.answer;
    btn.addEventListener("click", () => handleQuizAnswer(opt.answer));
    optsContainer.appendChild(btn);
  });

  quizActive = true;
}

function showQuizForQuestion(q) {
  originalPieceType = q.piece;
  const original = getPieceWithRotation(
    originalPieceType,
    q.startRotation || 0
  );
  const targetRotation =
    typeof q.targetRotation !== "undefined"
      ? q.targetRotation
      : q.startRotation || 0;
  const rotated = getPieceWithRotation(originalPieceType, targetRotation);

  // reset flag saat ganti soal
  currentQuestionWasWrong = false;

  updateSideQuiz(original, rotated, q);
}

function showQuiz() {
  const q = activeQuestions[questionIndex % activeQuestions.length];
  nextPieceType = q.piece;
  showQuizForQuestion(q);
}

/* ---------- SPAWN PIECE ---------- */
function spawnPiece() {
  const q = activeQuestions[questionIndex % activeQuestions.length];
  currentPiece = { type: q.piece };
  originalPieceType = q.piece;

  const nextQ = activeQuestions[(questionIndex + 1) % activeQuestions.length];
  nextPieceType = nextQ.piece;

  currentX = 3;
  currentY = 0;
  currentRotation = q.startRotation || 0;

  const piece = getPieceWithRotation(currentPiece.type, currentRotation);
  if (checkCollision(piece, currentX, currentY)) {
    gameOver();
    return;
  }

  drawNextPiece();
  showQuiz();
  startGameLoop();
}

/* ---------- QUIZ ANSWER ---------- */
function handleQuizAnswer(answer) {
  if (!quizActive) return;
  const feedbackEl = document.getElementById("sideQuizFeedback");
  // clear any previous hide timeout so a recent "wrong" timeout
  // won't immediately hide feedback for a subsequent correct answer
  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = null;
  }
  feedbackEl.classList.remove("hidden");

  const currentQ = activeQuestions[questionIndex % activeQuestions.length];
  const isCorrect = String(answer) === String(currentQ.correctAnswer);

  if (isCorrect) {
    let add = 0;

    // Hanya kasih poin kalau BELUM pernah salah di soal ini
    if (!currentQuestionWasWrong) {
      add = 50;
      if (currentQ.indicators && currentQ.indicators.includes(5)) add = 75;
      score += add;
      playCorrectSound();
      feedbackEl.textContent = `Benar! +${add} poin — ${
        currentQ.explanation || ""
      }`;
    } else {
      // Sudah pernah salah: tidak dapat poin
      playCorrectSound();
      feedbackEl.textContent = `Benar, tapi tanpa tambahan poin karena sebelumnya sudah salah.${
        currentQ.explanation ? " — " + currentQ.explanation : ""
      }`;
    }

    feedbackEl.className =
      "text-center text-sm font-bold text-green-400 bg-white/10 p-2 rounded-lg border border-green-400/40";
    quizActive = false;
    updateDisplay();
    questionIndex++;

    feedbackTimeout = setTimeout(() => {
      feedbackEl.classList.add("hidden");
      feedbackEl.textContent = "";
      feedbackTimeout = null;
    }, 1800);
  } else {
    // tandai bahwa soal ini sudah pernah dijawab salah
    currentQuestionWasWrong = true;

    feedbackEl.textContent = "Salah! Coba lagi.";
    feedbackEl.className =
      "text-center text-sm font-bold text-red-400 bg-white/10 p-2 rounded-lg border border-red-400/40";
    playWrongSound();
    feedbackTimeout = setTimeout(() => {
      feedbackEl.classList.add("hidden");
      feedbackEl.textContent = "";
      feedbackTimeout = null;
    }, 1200);
  }
}

/* ---------- GAME LOOP & MOVES ---------- */
function startGameLoop() {
  if (gameLoop) clearInterval(gameLoop);
  const speed = Math.max(100, 1000 - (level - 1) * 100);
  gameLoop = setInterval(() => {
    if (!isPaused && !isGameOver) moveDown();
  }, speed);
}

function moveDown() {
  const piece = getPieceWithRotation(currentPiece.type, currentRotation);
  if (!checkCollision(piece, currentX, currentY + 1)) {
    currentY++;
    playMoveSound();
  } else {
    lockPiece();
  }
  drawBoard();
}

function moveLeft() {
  const piece = getPieceWithRotation(currentPiece.type, currentRotation);
  if (!checkCollision(piece, currentX - 1, currentY)) {
    currentX--;
    playMoveSound();
    drawBoard();
  }
}

function moveRight() {
  const piece = getPieceWithRotation(currentPiece.type, currentRotation);
  if (!checkCollision(piece, currentX + 1, currentY)) {
    currentX++;
    playMoveSound();
    drawBoard();
  }
}

function rotate() {
  const newRotation = (currentRotation + 1) % 4;
  const piece = getPieceWithRotation(currentPiece.type, newRotation);
  if (!checkCollision(piece, currentX, currentY)) {
    currentRotation = newRotation;
    playRotateSound();
    drawBoard();
  }
}

function drop() {
  const piece = getPieceWithRotation(currentPiece.type, currentRotation);
  while (!checkCollision(piece, currentX, currentY + 1)) {
    currentY++;
  }
  playDropSound();
  lockPiece();
  drawBoard();
}

/* ---------- GAME OVER & RESET ---------- */
function gameOver() {
  isGameOver = true;
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }
  playGameOverSound();

  // Auto-save disabled — scores are saved only when user presses the
  // "Simpan Skor" button (manual save). This avoids duplicate/automatic
  // inserts on game over.

  document.getElementById("finalPlayerName").textContent = currentPlayerName;
  document.getElementById("finalPlayerClass").textContent = currentPlayerClass;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalLevel").textContent = level;
  document.getElementById("finalLines").textContent = lines;

  document.getElementById("gameOverModal").classList.remove("hidden");
}

async function saveScore() {
  // prevent double-save
  if (scoreSaved) {
    const saveBtn = document.getElementById("saveScoreBtn");
    if (saveBtn) {
      saveBtn.textContent = "Sudah tersimpan";
      setTimeout(() => {
        saveBtn.textContent = "Simpan Skor";
      }, 1500);
    }
    return;
  }

  if (currentRecordCount >= 999) {
    const saveBtn = document.getElementById("saveScoreBtn");
    if (saveBtn) {
      saveBtn.textContent = "Limit tercapai (999 skor)";
      saveBtn.disabled = true;
    }
    return;
  }

  const saveBtn = document.getElementById("saveScoreBtn");
  if (saveBtn) {
    saveBtn.textContent = "Menyimpan...";
    saveBtn.disabled = true;
  }

  const durationSeconds = gameStartTime
    ? Math.floor((Date.now() - gameStartTime) / 1000)
    : null;

  const payload = {
    name: currentPlayerName,
    class: currentPlayerClass,
    score: score,
    line: lines,
    duration: durationSeconds,
  };

  if (window.dataSdk && window.dataSdk.create) {
    try {
      const result = await window.dataSdk.create(payload);
      if (result.isOk) {
        scoreSaved = true;
        if (saveBtn) {
          saveBtn.textContent = "Tersimpan!";
          setTimeout(() => {
            saveBtn.textContent = "Simpan Skor";
            saveBtn.disabled = false;
          }, 1500);
        }
      } else {
        if (saveBtn) {
          saveBtn.textContent = "Error - Coba Lagi";
          saveBtn.disabled = false;
        }
      }
    } catch (err) {
      console.error("dataSdk create error:", err);
      if (saveBtn) {
        saveBtn.textContent = "Error - Coba Lagi";
        saveBtn.disabled = false;
      }
    }
  } else {
    // fallback: simpan ke Supabase
    try {
      const { error } = await supabaseClient
        .from("score_recap")
        .insert(payload);
      if (error) {
        console.error("Gagal menyimpan ke Supabase (fallback):", error);
        if (saveBtn) {
          saveBtn.textContent = "Error - Coba Lagi";
          saveBtn.disabled = false;
        }
      } else {
        scoreSaved = true;
        if (saveBtn) {
          saveBtn.textContent = "Tersimpan!";
          setTimeout(() => {
            saveBtn.textContent = "Simpan Skor";
            saveBtn.disabled = false;
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Fallback save error:", err);
      if (saveBtn) {
        saveBtn.textContent = "Error - Coba Lagi";
        saveBtn.disabled = false;
      }
    }
  }
}

function resetGame() {
  board = Array.from({ length: 20 }, () => Array(10).fill(0));
  currentPiece = null;
  currentX = 0;
  currentY = 0;
  currentRotation = 0;
  nextPieceType = null;
  score = 0;
  level = 1;
  lines = 0;
  isPaused = false;
  isGameOver = false;
  quizActive = false;
  currentQuestionWasWrong = false;
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }
  updateDisplay();
  drawBoard();
}

function updateDisplay() {
  document.getElementById("score").textContent = score;
  const levelEl = document.getElementById("level");
  if (levelEl) levelEl.textContent = level;
  document.getElementById("lines").textContent = lines;
}

function displayHighScores(data) {
  currentRecordCount = Array.isArray(data) ? data.length : 0;
  const highScoresDiv = document.getElementById("highScores");
  if (!Array.isArray(data) || data.length === 0) {
    highScoresDiv.innerHTML =
      '<p class="text-gray-200 text-sm">Belum ada skor</p>';
    return;
  }
  const sorted = [...data].sort((a, b) => b.score - a.score).slice(0, 5);
  highScoresDiv.innerHTML = sorted
    .map(
      (r, i) => `
        <div class="py-1 border-b border-gray-700">
          <div class="flex justify-between items-center">
            <span class="font-semibold">${i + 1}. ${
        r.name || r.player_name || ""
      }</span>
            <span class="text-yellow-400">${r.score}</span>
          </div>
          <div class="text-xs text-gray-400">${
            r.class || r.player_class || ""
          }</div>
        </div>
      `
    )
    .join("");
}

/* ---------- AVATAR PICKER ---------- */
const avatarButtons = document.querySelectorAll(".avatar-pill");
const avatarInputEl = document.getElementById("avatarInput");
if (avatarButtons && avatarButtons.length) {
  avatarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      avatarButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      if (avatarInputEl) {
        avatarInputEl.value = btn.dataset.avatar || "";
      }
    });
  });
}

/* ---------- EVENTS ---------- */
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const pclass = document.getElementById("classInput").value.trim();
  if (name && pclass) {
    currentPlayerName = name;
    currentPlayerClass = pclass;
    document.getElementById("playerInfo").textContent = name;
    document.getElementById("classInfo").textContent = pclass;

    // setiap login: acak ulang urutan soal
    activeQuestions = shuffleArray(QUESTIONS);
    questionIndex = 0;
    currentQuestionWasWrong = false;

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    document.getElementById("gameScreen").classList.add("flex");
    initBoard();
    drawBoard();
    // start duration tracking
    gameStartTime = Date.now();
    scoreSaved = false;
    spawnPiece();
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("nameInput").value = "";
  document.getElementById("classInput").value = "";
  resetGame();
  gameStartTime = null;
  scoreSaved = false;
});

document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      moveLeft();
      break;
    case "ArrowRight":
      e.preventDefault();
      moveRight();
      break;
    case "ArrowDown":
      e.preventDefault();
      moveDown();
      break;
    case "ArrowUp":
      e.preventDefault();
      rotate();
      break;
    case " ":
      e.preventDefault();
      drop();
      break;
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").textContent = isPaused
    ? "Resume"
    : "Pause";
});

document.getElementById("restartBtn").addEventListener("click", () => {
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }
  document.getElementById("gameOverModal").classList.add("hidden");
  resetGame();
  questionIndex = 0;
  gameStartTime = Date.now();
  scoreSaved = false;
  spawnPiece();
});

document.getElementById("playAgainBtn").addEventListener("click", () => {
  document.getElementById("gameOverModal").classList.add("hidden");
  resetGame();
  questionIndex = 0;
  gameStartTime = Date.now();
  scoreSaved = false;
  spawnPiece();
});

document.getElementById("backToLoginBtn").addEventListener("click", () => {
  document.getElementById("gameOverModal").classList.add("hidden");
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("nameInput").value = "";
  document.getElementById("classInput").value = "";
  resetGame();
  gameStartTime = null;
  scoreSaved = false;
});

document.getElementById("saveScoreBtn").addEventListener("click", (e) => {
  e.preventDefault();
  saveScore();
});

// Mobile buttons
document.getElementById("mobileLeft").addEventListener("click", (e) => {
  e.preventDefault();
  if (!isGameOver) moveLeft();
});
document.getElementById("mobileRight").addEventListener("click", (e) => {
  e.preventDefault();
  if (!isGameOver) moveRight();
});
document.getElementById("mobileDown").addEventListener("click", (e) => {
  e.preventDefault();
  if (!isGameOver) moveDown();
});
document.getElementById("mobileUp").addEventListener("click", (e) => {
  e.preventDefault();
  if (!isGameOver) rotate();
});
document.getElementById("mobileDrop").addEventListener("click", (e) => {
  e.preventDefault();
  if (!isGameOver) drop();
});

/* ---------- SDK INTEGRATION ---------- */
const dataHandler = {
  onDataChanged(data) {
    displayHighScores(data);
  },
};

async function onConfigChange(newConfig) {
  if (!newConfig) return;
  document.getElementById("loginTitle").textContent =
    newConfig.login_title || defaultConfig.login_title;
  document.getElementById("gameTitle").textContent =
    newConfig.game_title || defaultConfig.game_title;
  document.getElementById("gameHeaderTitle").textContent =
    newConfig.game_title || defaultConfig.game_title;
  document.getElementById("scoreLabel").textContent =
    newConfig.score_label || defaultConfig.score_label;
  document.getElementById("quizTitle").textContent =
    newConfig.quiz_title || defaultConfig.quiz_title;
  document.getElementById("sideQuizQuestion").textContent =
    newConfig.quiz_question || defaultConfig.quiz_question;
  document.body.style.background =
    newConfig.background_color || defaultConfig.background_color;
  document.getElementById("scoreDisplay").style.background =
    newConfig.primary_color || defaultConfig.primary_color;
}

async function init() {
  if (window.dataSdk && window.dataSdk.init) {
    const initResult = await window.dataSdk.init(dataHandler);
    if (!initResult.isOk) {
      console.error("Failed to initialize Data SDK");
    }
  }

  if (window.elementSdk && window.elementSdk.init) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities: (cfg) => ({
        recolorables: [
          {
            get: () => cfg.background_color || defaultConfig.background_color,
            set: (v) => {
              config.background_color = v;
              window.elementSdk.setConfig({ background_color: v });
            },
          },
          {
            get: () => cfg.primary_color || defaultConfig.primary_color,
            set: (v) => {
              config.primary_color = v;
              window.elementSdk.setConfig({ primary_color: v });
            },
          },
          {
            get: () => cfg.text_color || defaultConfig.text_color,
            set: (v) => {
              config.text_color = v;
              window.elementSdk.setConfig({ text_color: v });
            },
          },
          {
            get: () => cfg.accent_color || defaultConfig.accent_color,
            set: (v) => {
              config.accent_color = v;
              window.elementSdk.setConfig({ accent_color: v });
            },
          },
          {
            get: () => cfg.success_color || defaultConfig.success_color,
            set: (v) => {
              config.success_color = v;
              window.elementSdk.setConfig({ success_color: v });
            },
          },
        ],
      }),
    });
    config = window.elementSdk.config;
    await onConfigChange(config);
  }
}

init();
