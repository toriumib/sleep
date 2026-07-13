// ===== 名言データ（朝・早起きテーマ。パブリックドメインの古典を短く自訳）=====
// 仏典（ダンマパダ等）とローマ／ストア派を中心に、朝の目覚めにふさわしい言葉を集めた。
const QUOTES = [
  // --- ローマ / ストア派 ---
  { text: "夜明けに起きるのがつらいときは、こう考えよ——私は人間としての務めを果たすために起きるのだ、と。", author: "マルクス・アウレリウス『自省録』" },
  { text: "朝、目が覚めたら思い出せ。生きて、呼吸し、考え、行動できること——それがどれほど尊い特権かを。", author: "マルクス・アウレリウス『自省録』" },
  { text: "君に残された時間は限られている。今この一日を、霧を払うように澄んだ心で使え。", author: "マルクス・アウレリウス『自省録』" },
  { text: "我々は短い人生を授かったのではない。我々がそれを短くしているのだ。", author: "セネカ『人生の短さについて』" },
  { text: "先延ばしにしているうちに、人生は駆け去ってゆく。始めるなら、今日この朝だ。", author: "セネカ『倫理書簡集』" },
  { text: "今日という日を摘め。明日をあてにしすぎるな。", author: "ホラティウス『歌章』（カルペ・ディエム）" },
  { text: "まず何者になりたいかを自分に告げよ。そして朝ごとに、そのためになすべきことをなせ。", author: "エピクテトス" },
  { text: "習慣は第二の天性である。", author: "キケロ" },
  { text: "幸運は、勇気をもって踏み出す者に味方する。", author: "ウェルギリウス『アエネイス』" },
  { text: "水のしずくは、絶えず落ちることで固い石をも穿つ。", author: "オウィディウス" },
  { text: "暁（あかつき）は学芸の友。朝の時間こそ、心が最もよくはたらく。", author: "ラテン格言" },

  // --- 仏典 / 東洋 ---
  { text: "過ぎ去ったことを追わず、まだ来ぬことを思い煩わず、ただ今日なすべきことを、今日ひたむきに努めよ。", author: "『一夜賢者の偈』（中部経典）" },
  { text: "今日なすべきことを、明日に延ばすな。今日をこそ、はげみ努めよ。", author: "『ダンマパダ（法句経）』" },
  { text: "自らをよりどころとし、自らを島とせよ。ほかにたよるものはない。", author: "『ダンマパダ（法句経）』" },
  { text: "怠ることなく努めよ。おこたらぬ者にこそ、日々あらたな夜明けが訪れる。", author: "『ダンマパダ（法句経）』" },
  { text: "光陰は矢よりも速やかなり。今日この一瞬を、むなしく過ごすな。", author: "道元『正法眼蔵随聞記』" },
  { text: "明日ありと思う心の仇桜、夜半（よわ）に嵐の吹かぬものかは。", author: "親鸞（伝）" },

  // --- 早起き・朝のことわざ / 箴言 ---
  { text: "早寝早起きは、人を健康にし、豊かにし、賢くする。", author: "ベンジャミン・フランクリン" },
  { text: "早起きは三文の徳。", author: "日本のことわざ" },
  { text: "一日の計は朝にあり。", author: "ことわざ（中国由来）" },
  { text: "朝に考え、昼に行動し、夕べに食し、夜に眠れ。", author: "ウィリアム・ブレイク" },
  { text: "毎日が、一年の中で最良の日であると心に刻め。", author: "ラルフ・ワルド・エマソン" },
  { text: "今日もまた、わが生涯の一日なり。", author: "福澤諭吉" },
  { text: "千里の道も一歩から。その一歩を、今朝ふみ出せ。", author: "老子に由来することわざ" },
];

// ===== 追加名言パック（ショップで解放。朝・早起きテーマの続き）=====
const EXTRA_QUOTES = [
  { text: "朝の時間は、口に黄金をくわえている。", author: "ドイツのことわざ" },
  { text: "息あるかぎり、希望あり。新しい朝は、新しい望みとともに来る。", author: "ラテン格言（キケロに帰される）" },
  { text: "困難は朝ごとに訪れ、君が何者であるかを静かに示す。", author: "エピクテトス" },
  { text: "止まりさえしなければ、どんなにゆっくり進んでもかまわない。", author: "孔子" },
  { text: "明日は、まだ何も失敗していない新しい一日。", author: "L・M・モンゴメリ『赤毛のアン』" },
  { text: "健やかな心は、健やかな体に宿れかし。朝の一歩がそれを育てる。", author: "ユウェナリス" },
  { text: "なせば成る、なさねば成らぬ何事も。成らぬは人のなさぬなりけり。", author: "上杉鷹山" },
  { text: "少年老い易く学成り難し。一寸の光陰、軽んずべからず。", author: "朱熹（伝）「偶成」" },
  { text: "雨だれ石を穿つ。日々のわずかな積み重ねが、やがて岩をも通す。", author: "ことわざ（漢書より）" },
  { text: "思い立ったが吉日。始めるのに、今朝よりよい時はない。", author: "日本のことわざ" },
];

// ===== 睡眠・起床Tips =====
const TIPS = [
  { icon: "☀️", title: "起きたらすぐ日光を浴びる", body: "起床後はカーテンを開けて朝日を浴びましょう。光が体内時計をリセットし、夜の自然な眠気（メラトニン分泌）を整えます。" },
  { icon: "🛁", title: "就寝90分前の入浴", body: "寝る約90分前に40℃前後のお湯に浸かると、深部体温が一度上がってから下がるタイミングで眠気が来やすくなります。" },
  { icon: "📱", title: "寝る前のスマホを控える", body: "画面の光と情報の刺激は入眠を妨げます。就寝1時間前からは通知を切り、画面から離れるのが理想です。" },
  { icon: "⏰", title: "起きる時間を毎日そろえる", body: "休日も含めて起床時刻を一定にすると体内時計が安定します。「社会的時差ボケ」を防ぐのが快眠の近道です。" },
  { icon: "☕", title: "カフェインは午後早めまで", body: "カフェインの効果は数時間続きます。夕方以降のコーヒー・エナジードリンク・緑茶は控えましょう。" },
  { icon: "🍺", title: "寝酒はNG", body: "アルコールは寝つきを良くするように感じても、睡眠の後半を浅くし、中途覚醒を増やします。" },
  { icon: "🌡️", title: "寝室は涼しく暗く静かに", body: "室温はやや涼しめ（目安18〜20℃）、遮光と静けさを確保。快適な寝床環境は睡眠の質を大きく左右します。" },
  { icon: "🏃", title: "日中に体を動かす", body: "適度な運動は睡眠の質を高めます。ただし就寝直前の激しい運動は逆効果になるので夕方までに。" },
  { icon: "💤", title: "昼寝は20分まで", body: "昼寝をするなら15時前に20分以内。長い昼寝や夕方の昼寝は夜の睡眠圧を下げてしまいます。" },
  { icon: "🚶", title: "アラームはベッドから離れた場所に", body: "スマホや目覚ましを手の届かない場所に置くと、止めるために必ず立ち上がることになり、二度寝を防げます。" },
  { icon: "🥣", title: "朝食で体内時計を後押し", body: "起床後に朝食をとると内臓の体内時計も朝モードに切り替わります。特にタンパク質を含む朝食がおすすめです。" },
  { icon: "💧", title: "起きたらコップ一杯の水", body: "睡眠中に失われた水分を補給し、胃腸を動かして体を目覚めさせるスイッチになります。" },
  { icon: "🔁", title: "スヌーズに頼りすぎない", body: "細切れの二度寝は睡眠の質を下げ、かえってだるさ（睡眠慣性）を強めます。一発で起きる仕組みを作りましょう。" },
  { icon: "📝", title: "朝の楽しみを用意しておく", body: "好きなコーヒー、音楽、朝活など「起きる理由」を前夜に準備しておくと、起床のハードルが下がります。" },
  { icon: "🌙", title: "眠くなってから布団に入る", body: "眠れないまま布団で粘ると「布団=眠れない場所」と脳が学習します。眠気が来てから寝床へ。" },
  { icon: "🧘", title: "寝る前のルーティンを決める", body: "ストレッチ・読書・深呼吸など毎晩同じ流れを繰り返すと、体が「もう寝る時間だ」と覚えてくれます。" },
];

// ===== サウンド定義 =====
const BUILTIN_SOUNDS = [
  { id: "alarm_classic_beep", name: "クラシックビープ（ピピピ）", file: "assets/sounds/alarm_classic_beep.wav" },
  { id: "alarm_chiptune", name: "チップチューン（8bit風）", file: "assets/sounds/alarm_chiptune.wav" },
  { id: "alarm_bell", name: "ベル", file: "assets/sounds/alarm_bell.wav" },
  { id: "alarm_siren", name: "サイレン風", file: "assets/sounds/alarm_siren.wav" },
  { id: "alarm_morning_chime", name: "モーニングチャイム", file: "assets/sounds/alarm_morning_chime.wav" },
  { id: "alarm_urgent", name: "緊急アラーム", file: "assets/sounds/alarm_urgent.wav" },
];

const VOICE_SOUNDS = [
  { id: "voice_okoshite", name: "「だれか起こしてくださーい！」", file: "assets/voices/voice_okoshite.wav" },
  { id: "voice_asa_desuyo", name: "「朝ですよー！起きてくださーい！」", file: "assets/voices/voice_asa_desuyo.wav" },
  { id: "voice_chikoku", name: "「起きないと遅刻しますよ！」", file: "assets/voices/voice_chikoku.wav" },
  { id: "voice_mezamete", name: "「目を覚ましてください！」", file: "assets/voices/voice_mezamete.wav" },
  { id: "voice_ganbare", name: "「今日も頑張りましょう！」", file: "assets/voices/voice_ganbare.wav" },
];

// ===== ショップ =====

// 追加ボイス（コインで購入）
const SHOP_VOICES = [
  { id: "voice_ouen", name: "応援ボイス「あなたならできます！」", price: 80, file: "assets/voices/voice_ouen.wav" },
  { id: "voice_guntai", name: "鬼軍曹ボイス「起きろー！！」", price: 80, file: "assets/voices/voice_guntai.wav" },
  { id: "voice_sasayaki", name: "ささやきボイス「そろそろ起きる時間ですよ」", price: 80, file: "assets/voices/voice_sasayaki.wav" },
  { id: "voice_shitsuji", name: "執事ボイス「お支度のお時間でございます」", price: 80, file: "assets/voices/voice_shitsuji.wav" },
];

// 追加アラーム音パック（一括解放）
const PACK_SOUNDS = [
  { id: "alarm_thunder", name: "サンダー（雷鳴風）", file: "assets/sounds/alarm_thunder.wav" },
  { id: "alarm_glitch", name: "グリッチ（カオス8bit）", file: "assets/sounds/alarm_glitch.wav" },
];

// テーマ（着せ替え）
const THEMES = [
  { id: "default", name: "ミッドナイト（標準）", price: 0 },
  { id: "sunrise", name: "サンライズ", price: 100 },
  { id: "sakura", name: "サクラ", price: 100 },
  { id: "forest", name: "フォレスト", price: 100 },
  { id: "ocean", name: "オーシャン", price: 100 },
  { id: "gold", name: "ゴールドラッシュ", price: 150 },
];

// その他アイテム
const ITEM_PRICES = {
  snooze_ticket: 30,   // スヌーズ1回の権利（二度寝にコストを付ける）
  sound_pack: 120,     // 追加アラーム音パック
  quote_pack: 60,      // 追加名言パック
  gacha: 20,           // 朝の運試しガチャ
};

// コイン獲得ルール
const ECON = {
  adReward: 25,          // リワード広告視聴（Webはシミュレーション）
  stopTiers: [           // アラーム停止までの秒数 → 獲得コイン
    { within: 10, coins: 50 },
    { within: 30, coins: 30 },
    { within: 60, coins: 15 },
    { within: Infinity, coins: 5 },
  ],
  snoozePenaltyFactor: 0.5, // スヌーズしたら停止ボーナス半減
  streakBonusPerDay: 5,     // ストリーク1日あたりのボーナス
  streakBonusMax: 50,
  initialCoins: 50,
  initialTickets: 1,
};

// 実績バッジ
const BADGES = [
  { id: "debut", icon: "🌅", name: "はじめての朝", desc: "初めてアラームを止めた" },
  { id: "speedster", icon: "⚡", name: "光速の目覚め", desc: "10秒以内にアラームを停止" },
  { id: "streak3", icon: "🔥", name: "三日坊主卒業", desc: "3日連続でスヌーズなし起床" },
  { id: "streak7", icon: "👑", name: "早起きの王", desc: "7日連続でスヌーズなし起床" },
  { id: "rich", icon: "💰", name: "朝活長者", desc: "累計500コイン獲得" },
  { id: "gacha_first", icon: "🎰", name: "運試し", desc: "初めてガチャを回した" },
];

const HERO_IMAGES = [
  "assets/img/sunrise.svg",
  "assets/img/fire.svg",
  "assets/img/curtain.svg",
  "assets/img/rocket.svg",
];
