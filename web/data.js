// ===== 名言データ（パブリックドメイン / 出典明記のもののみ）=====
const QUOTES = [
  { text: "我々は繰り返し行うことの産物である。それゆえ、卓越とは行為ではなく習慣である。", author: "ウィル・デュラント（アリストテレス哲学の要約として）" },
  { text: "止まりさえしなければ、どんなにゆっくり進んでもかまわない。", author: "孔子" },
  { text: "早寝早起きは、人を健康にし、豊かにし、賢くする。", author: "ベンジャミン・フランクリン" },
  { text: "今日できることを明日に延ばすな。", author: "ベンジャミン・フランクリン" },
  { text: "今日の一つは、明日の二つに勝る。", author: "ベンジャミン・フランクリン" },
  { text: "時は金なり。", author: "ベンジャミン・フランクリン" },
  { text: "継続は力なり。", author: "日本の格言" },
  { text: "早起きは三文の徳。", author: "日本のことわざ" },
  { text: "一日の計は朝にあり。", author: "ことわざ（中国由来）" },
  { text: "千里の道も一歩から。", author: "老子に由来することわざ" },
  { text: "塵も積もれば山となる。", author: "日本のことわざ" },
  { text: "石の上にも三年。", author: "日本のことわざ" },
  { text: "ローマは一日にして成らず。", author: "西洋のことわざ" },
  { text: "習慣は第二の天性である。", author: "キケロ" },
  { text: "最初は人が習慣を作り、やがて習慣が人を作る。", author: "ジョン・ドライデン" },
  { text: "よく始めることは、半分成し遂げたことである。", author: "アリストテレス（伝）" },
  { text: "夜明けに起きるのがつらい時は、こう考えよ。「私は人間の仕事をするために起きるのだ」と。", author: "マルクス・アウレリウス『自省録』" },
  { text: "我々は短い人生を授かったのではない。我々がそれを短くしているのだ。", author: "セネカ『人生の短さについて』" },
  { text: "毎日が、一年の中で最良の日であると心に刻め。", author: "ラルフ・ワルド・エマソン" },
  { text: "朝に考え、昼に行動し、夕べに食し、夜に眠れ。", author: "ウィリアム・ブレイク" },
  { text: "明日は、まだ何も失敗していない新しい一日。", author: "L・M・モンゴメリ『赤毛のアン』" },
  { text: "今日もまた、わが生涯の一日なり。", author: "福澤諭吉" },
  { text: "天才とは、1%のひらめきと99%の努力である。", author: "トーマス・エジソン" },
  { text: "小さなことを積み重ねることが、とんでもないところへ行くただひとつの道。", author: "格言（積小為大：二宮尊徳の思想より）" },
];

// ===== 睡眠・起床Tips（一般に知られた睡眠衛生の知見）=====
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

const HERO_IMAGES = [
  "assets/img/sunrise.svg",
  "assets/img/fire.svg",
  "assets/img/curtain.svg",
  "assets/img/rocket.svg",
];
