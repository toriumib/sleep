// ===== 名言データ（朝・早起きテーマ / 日英併記）=====
// 仏典・キリスト教（聖書）・ローマ／ストア派・世界の偉人・ことわざから、
// 朝の目覚めにふさわしい言葉を集めた。いずれもパブリックドメインの古典を短く自訳
// （特定の出版翻訳の丸写しは避けている）。author=日本語表記 / authorEn=英語表記。
const QUOTES = [
  // --- ローマ / ストア派 ---
  { ja: "夜明けに起きるのがつらいときは、こう考えよ——私は人間としての務めを果たすために起きるのだ、と。", en: "At dawn, when you struggle to get out of bed, tell yourself: I am rising to do the work of a human being.", author: "マルクス・アウレリウス『自省録』", authorEn: "Marcus Aurelius, Meditations" },
  { ja: "朝、目が覚めたら思い出せ。生きて、呼吸し、考え、行動できること——それがどれほど尊い特権かを。", en: "When you arise in the morning, think of what a precious privilege it is to be alive—to breathe, to think, to enjoy, to love.", author: "マルクス・アウレリウス『自省録』", authorEn: "Marcus Aurelius, Meditations" },
  { ja: "今この一瞬に心をとどめ、目の前の一日を、澄んだ心で使い切れ。", en: "Confine yourself to the present, and make the most of this single day.", author: "マルクス・アウレリウス『自省録』", authorEn: "Marcus Aurelius, Meditations" },
  { ja: "行く手をはばむものが、かえって道となる。", en: "The impediment to action advances action. What stands in the way becomes the way.", author: "マルクス・アウレリウス『自省録』", authorEn: "Marcus Aurelius, Meditations" },
  { ja: "我々は短い人生を授かったのではない。我々がそれを短くしているのだ。", en: "It is not that we have a short time to live, but that we waste much of it.", author: "セネカ『人生の短さについて』", authorEn: "Seneca, On the Shortness of Life" },
  { ja: "先延ばしにしているうちに、人生は駆け去ってゆく。始めるなら、今日この朝だ。", en: "While we are postponing, life speeds by. Begin at once—this very morning.", author: "セネカ『倫理書簡集』", authorEn: "Seneca, Letters" },
  { ja: "今日という日を摘め。明日をあてにしすぎるな。", en: "Seize the day, and put as little trust as you can in tomorrow.", author: "ホラティウス『歌章』（カルペ・ディエム）", authorEn: "Horace, Odes (Carpe diem)" },
  { ja: "まず何者になりたいかを自分に告げよ。そして朝ごとに、そのためになすべきことをなせ。", en: "First say to yourself what you would be, and then do what you have to do.", author: "エピクテトス", authorEn: "Epictetus" },
  { ja: "習慣は第二の天性である。", en: "Habit is, as it were, a second nature.", author: "キケロ", authorEn: "Cicero" },
  { ja: "幸運は、勇気をもって踏み出す者に味方する。", en: "Fortune favors the bold.", author: "ウェルギリウス『アエネイス』", authorEn: "Virgil, Aeneid" },
  { ja: "水のしずくは、力ではなく絶え間なさによって、固い石をも穿つ。", en: "Dripping water hollows out stone, not through force but through persistence.", author: "オウィディウス", authorEn: "Ovid" },
  { ja: "暁（あかつき）は学芸の友。朝の時間こそ、心が最もよくはたらく。", en: "The dawn is the friend of the muses; the morning hours serve the mind best.", author: "ラテン格言", authorEn: "Latin proverb" },

  // --- 仏典 / 東洋 ---
  { ja: "過ぎ去ったことを追わず、まだ来ぬことを思い煩わず、ただ今日なすべきことを、今日ひたむきに努めよ。", en: "Do not dwell in the past, do not dream of the future; concentrate the mind on the present moment.", author: "『一夜賢者の偈』（中部経典）", authorEn: "Bhaddekaratta Sutta (Majjhima Nikaya)" },
  { ja: "今日なすべきことを、明日に延ばすな。今日をこそ、はげみ努めよ。", en: "Do today what must be done. Who knows? Tomorrow may never come.", author: "『ダンマパダ（法句経）』", authorEn: "Dhammapada" },
  { ja: "自らをよりどころとし、自らを島とせよ。ほかにたよるものはない。", en: "Be a lamp unto yourself. Be your own refuge.", author: "『ダンマパダ（法句経）』", authorEn: "Dhammapada" },
  { ja: "怠ることなく努めよ。おこたらぬ者にこそ、日々あらたな夜明けが訪れる。", en: "Strive on with diligence; for the diligent, a new dawn always breaks.", author: "『ダンマパダ（法句経）』", authorEn: "Dhammapada" },
  { ja: "光陰は矢よりも速やかなり。今日この一瞬を、むなしく過ごすな。", en: "Time flies faster than an arrow; do not waste this single moment.", author: "道元『正法眼蔵随聞記』", authorEn: "Dogen, Shobogenzo Zuimonki" },
  { ja: "明日ありと思う心の仇桜、夜半（よわ）に嵐の吹かぬものかは。", en: "Do not count on tomorrow's blossoms; who knows if a storm will blow in the night?", author: "親鸞（伝）", authorEn: "Attributed to Shinran" },
  { ja: "天が人に大きな務めを与えようとするとき、まずその心と体を試練で鍛える。", en: "When Heaven is about to give a great task to someone, it first hardens their mind and body.", author: "孟子", authorEn: "Mencius" },
  { ja: "学びて時にこれを習う、また喜ばしからずや。", en: "Is it not a pleasure to learn, and to practice what you have learned in due time?", author: "孔子『論語』", authorEn: "Confucius, Analects" },

  // --- キリスト教 / 聖書 ---
  { ja: "これは主が造られた日。この日を喜び、楽しもう。", en: "This is the day that the Lord has made; let us rejoice and be glad in it.", author: "旧約聖書『詩篇』118:24", authorEn: "Psalm 118:24" },
  { ja: "主の慈しみは尽きることがない。その憐れみは、朝ごとに新しい。", en: "The steadfast love of the Lord never ceases; his mercies are new every morning.", author: "旧約聖書『哀歌』3:22-23", authorEn: "Lamentations 3:22-23" },
  { ja: "夜は涙のうちに過ごしても、朝には喜びの叫びがある。", en: "Weeping may stay for the night, but joy comes in the morning.", author: "旧約聖書『詩篇』30:5", authorEn: "Psalm 30:5" },
  { ja: "明日のことを思い煩うな。明日のことは明日が思い煩う。", en: "Do not worry about tomorrow, for tomorrow will worry about itself.", author: "新約聖書『マタイによる福音書』6:34", authorEn: "Matthew 6:34" },
  { ja: "おのれの日を正しく数えることを教えてください。そうして知恵の心を得ます。", en: "Teach us to number our days, that we may gain a heart of wisdom.", author: "旧約聖書『詩篇』90:12", authorEn: "Psalm 90:12" },
  { ja: "あなたの手がなしうることは、力の限りを尽くしてなせ。", en: "Whatever your hand finds to do, do it with all your might.", author: "旧約聖書『伝道の書』9:10", authorEn: "Ecclesiastes 9:10" },
  { ja: "怠け者よ、いつまで眠るのか。いつ眠りから起き上がるのか。", en: "How long will you lie there, you sluggard? When will you rise from your sleep?", author: "旧約聖書『箴言』6:9", authorEn: "Proverbs 6:9" },
  { ja: "主を待ち望む者は新たな力を得、鷲のように翼を張って舞い上がる。", en: "Those who hope in the Lord will renew their strength; they will soar on wings like eagles.", author: "旧約聖書『イザヤ書』40:31", authorEn: "Isaiah 40:31" },
  { ja: "今こそ、眠りから覚めるべき時である。", en: "The hour has come for you to wake up from your sleep.", author: "新約聖書『ローマの信徒への手紙』13:11", authorEn: "Romans 13:11" },
  { ja: "強く、雄々しくあれ。おののいてはならない。", en: "Be strong and courageous. Do not be afraid.", author: "旧約聖書『ヨシュア記』1:9", authorEn: "Joshua 1:9" },
  { ja: "主よ、朝ごとにわたしの声を聞いてください。朝ごとにあなたに向かって備えをします。", en: "In the morning, Lord, you hear my voice; in the morning I lay my requests before you.", author: "旧約聖書『詩篇』5:3", authorEn: "Psalm 5:3" },
  { ja: "何事にも時があり、天の下のすべての営みに時がある。", en: "For everything there is a season, and a time for every matter under heaven.", author: "旧約聖書『伝道の書』3:1", authorEn: "Ecclesiastes 3:1" },

  // --- 世界の偉人 ---
  { ja: "早寝早起きは、人を健康にし、豊かにし、賢くする。", en: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", author: "ベンジャミン・フランクリン", authorEn: "Benjamin Franklin" },
  { ja: "失った時間は、二度と取り戻せない。", en: "Lost time is never found again.", author: "ベンジャミン・フランクリン", authorEn: "Benjamin Franklin" },
  { ja: "我々は繰り返し行うことの産物である。ゆえに卓越とは、行為ではなく習慣である。", en: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "ウィル・デュラント（アリストテレスの要約）", authorEn: "Will Durant (summarizing Aristotle)" },
  { ja: "よく始めることは、半分成し遂げたことである。", en: "Well begun is half done.", author: "アリストテレス（伝）", authorEn: "Attributed to Aristotle" },
  { ja: "毎日が、一年の中で最良の日であると心に刻め。", en: "Write it on your heart that every day is the best day in the year.", author: "ラルフ・ワルド・エマソン", authorEn: "Ralph Waldo Emerson" },
  { ja: "朝は、一日のうちで最も記憶に値する時間である。", en: "The morning is the most memorable season of the day.", author: "ヘンリー・デイヴィッド・ソロー", authorEn: "Henry David Thoreau" },
  { ja: "朝に考え、昼に行動し、夕べに食し、夜に眠れ。", en: "Think in the morning. Act in the noon. Eat in the evening. Sleep in the night.", author: "ウィリアム・ブレイク", authorEn: "William Blake" },
  { ja: "朝一番にカエルを食べてしまえ。その日、それより悪いことは起こらない。", en: "Eat a live frog first thing in the morning, and nothing worse will happen to you the rest of the day.", author: "マーク・トウェイン（伝）", authorEn: "Attributed to Mark Twain" },
  { ja: "天才とは、1%のひらめきと99%の努力である。", en: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "トーマス・エジソン", authorEn: "Thomas Edison" },
  { ja: "勝利は、最も忍耐強く努める者のものである。", en: "Victory belongs to the most persevering.", author: "ナポレオン・ボナパルト", authorEn: "Napoleon Bonaparte" },
  { ja: "木を切るのに6時間もらえるなら、私は最初の4時間を斧を研ぐことに使う。", en: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "エイブラハム・リンカーン（伝）", authorEn: "Attributed to Abraham Lincoln" },
  { ja: "顔を太陽の方へ向けていれば、影は見えない。", en: "Keep your face to the sunshine and you cannot see a shadow.", author: "ヘレン・ケラー", authorEn: "Helen Keller" },
  { ja: "どんなに暗い夜も、必ず明ける。そして太陽は昇る。", en: "Even the darkest night will end and the sun will rise.", author: "ヴィクトル・ユゴー『レ・ミゼラブル』", authorEn: "Victor Hugo, Les Misérables" },
  { ja: "よく過ごした一日が快い眠りをもたらすように、よく用いた人生は安らかな終わりをもたらす。", en: "As a well-spent day brings happy sleep, so a life well used brings a peaceful end.", author: "レオナルド・ダ・ヴィンチ", authorEn: "Leonardo da Vinci" },
  { ja: "明日死ぬかのように生きよ。永遠に生きるかのように学べ。", en: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "マハトマ・ガンディー", authorEn: "Mahatma Gandhi" },
  { ja: "大切なのは、問い続けることをやめないことだ。", en: "The important thing is not to stop questioning.", author: "アルベルト・アインシュタイン", authorEn: "Albert Einstein" },
  { ja: "急がず、しかし休まず。", en: "Without haste, but without rest.", author: "ゲーテ", authorEn: "Goethe" },
  { ja: "偉人が到達した高みは、一足飛びに得たものではない。彼らは仲間が眠る間に、夜を徹して登り続けたのだ。", en: "The heights by great men reached and kept were not attained by sudden flight, but they, while their companions slept, were toiling upward in the night.", author: "ヘンリー・ワズワース・ロングフェロー", authorEn: "Henry Wadsworth Longfellow" },
  { ja: "今日もまた、わが生涯の一日なり。", en: "Today, too, is one day of my life.", author: "福澤諭吉", authorEn: "Fukuzawa Yukichi" },
  { ja: "明日は、まだ何ひとつ失敗していない新しい一日。", en: "Tomorrow is a new day with no mistakes in it yet.", author: "L・M・モンゴメリ『赤毛のアン』", authorEn: "L. M. Montgomery, Anne of Green Gables" },

  // --- ことわざ ---
  { ja: "早起きは三文の徳。", en: "The early bird catches the worm.", author: "日本のことわざ", authorEn: "Japanese proverb" },
  { ja: "一日の計は朝にあり。", en: "The plan for the whole day is made in the morning.", author: "ことわざ（中国由来）", authorEn: "Proverb (Chinese origin)" },
  { ja: "千里の道も一歩から。その一歩を、今朝ふみ出せ。", en: "A journey of a thousand miles begins with a single step—take it this morning.", author: "老子に由来することわざ", authorEn: "Proverb (after Lao Tzu)" },
  { ja: "止まりさえしなければ、どんなにゆっくり進んでもかまわない。", en: "It does not matter how slowly you go, as long as you do not stop.", author: "孔子", authorEn: "Confucius" },
  { ja: "小さな努力の積み重ねこそが、大きなことを成し遂げる。", en: "Great things are achieved by an accumulation of small efforts.", author: "二宮尊徳（積小為大）", authorEn: "Ninomiya Sontoku" },
];

// ===== 追加名言パック（ショップで解放。朝・早起きテーマの続き / 日英併記）=====
const EXTRA_QUOTES = [
  { ja: "朝の時間は、口に黄金をくわえている。", en: "The morning hour has gold in its mouth.", author: "ドイツのことわざ", authorEn: "German proverb" },
  { ja: "息あるかぎり、希望あり。新しい朝は、新しい望みとともに来る。", en: "While there is life, there is hope; each new morning comes with new hope.", author: "ラテン格言（キケロに帰される）", authorEn: "Latin proverb (attributed to Cicero)" },
  { ja: "困難は朝ごとに訪れ、君が何者であるかを静かに示す。", en: "Difficulties reveal a person's true character.", author: "エピクテトス", authorEn: "Epictetus" },
  { ja: "わたしは夜明け前に起き、助けを求めて叫びます。", en: "I rise before dawn and cry for help.", author: "旧約聖書『詩篇』119:147", authorEn: "Psalm 119:147" },
  { ja: "わたしを強くしてくださる方によって、わたしはどんなことでもできる。", en: "I can do all things through him who gives me strength.", author: "新約聖書『フィリピの信徒への手紙』4:13", authorEn: "Philippians 4:13" },
  { ja: "すべては心にはじまる。心が定まれば、行いもまた定まる。", en: "All that we are is the result of what we have thought.", author: "『ダンマパダ（法句経）』", authorEn: "Dhammapada" },
  { ja: "なぜ生きるかを知る者は、ほとんどあらゆる困難に耐えられる。", en: "He who has a why to live can bear almost any how.", author: "フリードリヒ・ニーチェ", authorEn: "Friedrich Nietzsche" },
  { ja: "賢者は、見つける以上の好機を自ら作り出す。", en: "A wise man will make more opportunities than he finds.", author: "フランシス・ベーコン", authorEn: "Francis Bacon" },
  { ja: "熱意なくして、偉大なことが成し遂げられたためしはない。", en: "Nothing great was ever achieved without enthusiasm.", author: "ラルフ・ワルド・エマソン", authorEn: "Ralph Waldo Emerson" },
  { ja: "昨日から学び、今日を生き、明日に希望を持て。", en: "Learn from yesterday, live for today, hope for tomorrow.", author: "アルベルト・アインシュタイン（伝）", authorEn: "Attributed to Albert Einstein" },
  { ja: "今日できることを、明日に延ばすな。", en: "Never leave that till tomorrow which you can do today.", author: "ベンジャミン・フランクリン", authorEn: "Benjamin Franklin" },
  { ja: "なせば成る、なさねば成らぬ何事も。成らぬは人のなさぬなりけり。", en: "If you try, it will be done; if you do not, it will not. Nothing is impossible—only left undone.", author: "上杉鷹山", authorEn: "Uesugi Yozan" },
  { ja: "少年老い易く学成り難し。一寸の光陰、軽んずべからず。", en: "Youth passes quickly and learning is hard; do not waste a single moment of time.", author: "朱熹（伝）「偶成」", authorEn: "Attributed to Zhu Xi" },
  { ja: "雨だれ石を穿つ。日々のわずかな積み重ねが、やがて岩をも通す。", en: "Constant dripping wears away the stone.", author: "ことわざ（漢書より）", authorEn: "Proverb (Book of Han)" },
  { ja: "思い立ったが吉日。始めるのに、今朝よりよい時はない。", en: "There is no better time to begin than this very morning.", author: "日本のことわざ", authorEn: "Japanese proverb" },
  { ja: "健やかな心は、健やかな体に宿れかし。朝の一歩がそれを育てる。", en: "A sound mind in a sound body—the morning's first steps nurture both.", author: "ユウェナリス", authorEn: "Juvenal" },
];

// ===== 睡眠・起床Tips（日英併記）=====
const TIPS = [
  { icon: "☀️", title: "起きたらすぐ日光を浴びる", titleEn: "Get sunlight right after waking", body: "起床後はカーテンを開けて朝日を浴びましょう。光が体内時計をリセットし、夜の自然な眠気（メラトニン分泌）を整えます。", bodyEn: "Open the curtains and take in the morning sun as soon as you wake. Light resets your body clock and sets up natural sleepiness (melatonin) at night." },
  { icon: "🛁", title: "就寝90分前の入浴", titleEn: "Bathe about 90 minutes before bed", body: "寝る約90分前に40℃前後のお湯に浸かると、深部体温が一度上がってから下がるタイミングで眠気が来やすくなります。", bodyEn: "Soaking in ~40°C water about 90 minutes before bed raises your core temperature; as it drops afterward, sleepiness comes more easily." },
  { icon: "📱", title: "寝る前のスマホを控える", titleEn: "Avoid your phone before bed", body: "画面の光と情報の刺激は入眠を妨げます。就寝1時間前からは通知を切り、画面から離れるのが理想です。", bodyEn: "Screen light and a flood of information hinder falling asleep. Ideally, silence notifications and step away from screens an hour before bed." },
  { icon: "⏰", title: "起きる時間を毎日そろえる", titleEn: "Keep a consistent wake time", body: "休日も含めて起床時刻を一定にすると体内時計が安定します。「社会的時差ボケ」を防ぐのが快眠の近道です。", bodyEn: "Waking at the same time every day, weekends included, stabilizes your body clock. Avoiding 'social jet lag' is a shortcut to better sleep." },
  { icon: "☕", title: "カフェインは午後早めまで", titleEn: "Cut off caffeine by early afternoon", body: "カフェインの効果は数時間続きます。夕方以降のコーヒー・エナジードリンク・緑茶は控えましょう。", bodyEn: "Caffeine lasts for hours. Avoid coffee, energy drinks, and green tea from late afternoon onward." },
  { icon: "🍺", title: "寝酒はNG", titleEn: "Skip the nightcap", body: "アルコールは寝つきを良くするように感じても、睡眠の後半を浅くし、中途覚醒を増やします。", bodyEn: "Alcohol may feel like it helps you fall asleep, but it makes the later half of sleep shallow and increases night waking." },
  { icon: "🌡️", title: "寝室は涼しく暗く静かに", titleEn: "Keep the bedroom cool, dark, quiet", body: "室温はやや涼しめ（目安18〜20℃）、遮光と静けさを確保。快適な寝床環境は睡眠の質を大きく左右します。", bodyEn: "Keep it slightly cool (around 18–20°C), dark, and quiet. A comfortable sleep environment greatly affects sleep quality." },
  { icon: "🏃", title: "日中に体を動かす", titleEn: "Move your body during the day", body: "適度な運動は睡眠の質を高めます。ただし就寝直前の激しい運動は逆効果になるので夕方までに。", bodyEn: "Moderate exercise improves sleep quality. But intense exercise right before bed backfires—finish by early evening." },
  { icon: "💤", title: "昼寝は20分まで", titleEn: "Nap for 20 minutes at most", body: "昼寝をするなら15時前に20分以内。長い昼寝や夕方の昼寝は夜の睡眠圧を下げてしまいます。", bodyEn: "If you nap, keep it under 20 minutes and before 3 p.m. Long or late naps reduce your sleep drive at night." },
  { icon: "🚶", title: "アラームはベッドから離れた場所に", titleEn: "Put the alarm away from your bed", body: "スマホや目覚ましを手の届かない場所に置くと、止めるために必ず立ち上がることになり、二度寝を防げます。", bodyEn: "Place your phone or alarm out of reach so you must stand up to stop it—this helps prevent falling back asleep." },
  { icon: "🥣", title: "朝食で体内時計を後押し", titleEn: "Use breakfast to set your clock", body: "起床後に朝食をとると内臓の体内時計も朝モードに切り替わります。特にタンパク質を含む朝食がおすすめです。", bodyEn: "Eating breakfast after waking shifts your internal organs' clock into morning mode. A protein-rich breakfast is especially good." },
  { icon: "💧", title: "起きたらコップ一杯の水", titleEn: "Drink a glass of water on waking", body: "睡眠中に失われた水分を補給し、胃腸を動かして体を目覚めさせるスイッチになります。", bodyEn: "It replaces water lost during sleep and gets your gut moving—a switch that wakes the body up." },
  { icon: "🔁", title: "スヌーズに頼りすぎない", titleEn: "Don't rely on snooze", body: "細切れの二度寝は睡眠の質を下げ、かえってだるさ（睡眠慣性）を強めます。一発で起きる仕組みを作りましょう。", bodyEn: "Fragmented dozing lowers sleep quality and worsens grogginess (sleep inertia). Build a system to get up in one go." },
  { icon: "📝", title: "朝の楽しみを用意しておく", titleEn: "Prepare a morning treat", body: "好きなコーヒー、音楽、朝活など「起きる理由」を前夜に準備しておくと、起床のハードルが下がります。", bodyEn: "Prepare a 'reason to get up'—favorite coffee, music, a morning hobby—the night before, and rising gets easier." },
  { icon: "🌙", title: "眠くなってから布団に入る", titleEn: "Go to bed only when sleepy", body: "眠れないまま布団で粘ると「布団=眠れない場所」と脳が学習します。眠気が来てから寝床へ。", bodyEn: "Lying awake in bed teaches your brain 'bed = a place I can't sleep.' Go to bed only once sleepiness arrives." },
  { icon: "🧘", title: "寝る前のルーティンを決める", titleEn: "Set a pre-sleep routine", body: "ストレッチ・読書・深呼吸など毎晩同じ流れを繰り返すと、体が「もう寝る時間だ」と覚えてくれます。", bodyEn: "Repeating the same flow each night—stretching, reading, deep breaths—teaches your body that it's time to sleep." },
];

// ===== サウンド定義（name=日本語 / nameEn=英語）=====
const BUILTIN_SOUNDS = [
  { id: "alarm_classic_beep", name: "クラシックビープ（ピピピ）", nameEn: "Classic Beep", file: "assets/sounds/alarm_classic_beep.wav" },
  { id: "alarm_chiptune", name: "チップチューン（8bit風）", nameEn: "Chiptune (8-bit)", file: "assets/sounds/alarm_chiptune.wav" },
  { id: "alarm_bell", name: "ベル", nameEn: "Bell", file: "assets/sounds/alarm_bell.wav" },
  { id: "alarm_siren", name: "サイレン風", nameEn: "Siren", file: "assets/sounds/alarm_siren.wav" },
  { id: "alarm_morning_chime", name: "モーニングチャイム", nameEn: "Morning Chime", file: "assets/sounds/alarm_morning_chime.wav" },
  { id: "alarm_urgent", name: "緊急アラーム", nameEn: "Urgent Alarm", file: "assets/sounds/alarm_urgent.wav" },
];

const VOICE_SOUNDS = [
  { id: "voice_okoshite", name: "「だれか起こしてくださーい！」", nameEn: '"Somebody wake me up!"', file: "assets/voices/voice_okoshite.wav" },
  { id: "voice_asa_desuyo", name: "「朝ですよー！起きてくださーい！」", nameEn: '"It\'s morning! Please wake up!"', file: "assets/voices/voice_asa_desuyo.wav" },
  { id: "voice_chikoku", name: "「起きないと遅刻しますよ！」", nameEn: '"You\'ll be late if you don\'t get up!"', file: "assets/voices/voice_chikoku.wav" },
  { id: "voice_mezamete", name: "「目を覚ましてください！」", nameEn: '"Please wake up!"', file: "assets/voices/voice_mezamete.wav" },
  { id: "voice_ganbare", name: "「今日も頑張りましょう！」", nameEn: '"Let\'s do our best today!"', file: "assets/voices/voice_ganbare.wav" },
];

// ===== ショップ =====

// 追加ボイス（コインで購入）
const SHOP_VOICES = [
  { id: "voice_ouen", name: "応援ボイス「あなたならできます！」", nameEn: 'Cheer voice: "You can do it!"', price: 80, file: "assets/voices/voice_ouen.wav" },
  { id: "voice_guntai", name: "鬼軍曹ボイス「起きろー！！」", nameEn: 'Drill sergeant: "WAKE UP!!"', price: 80, file: "assets/voices/voice_guntai.wav" },
  { id: "voice_sasayaki", name: "ささやきボイス「そろそろ起きる時間ですよ」", nameEn: 'Whisper: "It\'s about time to wake up"', price: 80, file: "assets/voices/voice_sasayaki.wav" },
  { id: "voice_shitsuji", name: "執事ボイス「お支度のお時間でございます」", nameEn: 'Butler: "Time to prepare, sir"', price: 80, file: "assets/voices/voice_shitsuji.wav" },
];

// 追加アラーム音パック（一括解放）
const PACK_SOUNDS = [
  { id: "alarm_thunder", name: "サンダー（雷鳴風）", nameEn: "Thunder", file: "assets/sounds/alarm_thunder.wav" },
  { id: "alarm_glitch", name: "グリッチ（カオス8bit）", nameEn: "Glitch (chaotic 8-bit)", file: "assets/sounds/alarm_glitch.wav" },
];

// テーマ（着せ替え）
const THEMES = [
  { id: "default", name: "ミッドナイト（標準）", nameEn: "Midnight (default)", price: 0 },
  { id: "sunrise", name: "サンライズ", nameEn: "Sunrise", price: 100 },
  { id: "sakura", name: "サクラ", nameEn: "Sakura", price: 100 },
  { id: "forest", name: "フォレスト", nameEn: "Forest", price: 100 },
  { id: "ocean", name: "オーシャン", nameEn: "Ocean", price: 100 },
  { id: "gold", name: "ゴールドラッシュ", nameEn: "Gold Rush", price: 150 },
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

// 実績バッジ（name/desc=日本語 / nameEn/descEn=英語）
const BADGES = [
  { id: "debut", icon: "🌅", name: "はじめての朝", nameEn: "First Morning", desc: "初めてアラームを止めた", descEn: "Stopped an alarm for the first time" },
  { id: "speedster", icon: "⚡", name: "光速の目覚め", nameEn: "Lightning Wake", desc: "10秒以内にアラームを停止", descEn: "Stopped an alarm within 10 seconds" },
  { id: "streak3", icon: "🔥", name: "三日坊主卒業", nameEn: "Three-Day Streak", desc: "3日連続でスヌーズなし起床", descEn: "Woke up 3 days in a row without snoozing" },
  { id: "streak7", icon: "👑", name: "早起きの王", nameEn: "King of Early Rising", desc: "7日連続でスヌーズなし起床", descEn: "Woke up 7 days in a row without snoozing" },
  { id: "rich", icon: "💰", name: "朝活長者", nameEn: "Morning Tycoon", desc: "累計500コイン獲得", descEn: "Earned 500 coins in total" },
  { id: "gacha_first", icon: "🎰", name: "運試し", nameEn: "Fortune Seeker", desc: "初めてガチャを回した", descEn: "Spun the gacha for the first time" },
];

const HERO_IMAGES = [
  "assets/img/sunrise.svg",
  "assets/img/fire.svg",
  "assets/img/curtain.svg",
  "assets/img/rocket.svg",
];

// ===== UI多言語辞書（日本語 / 英語）=====
// {n} などのプレースホルダは app.js の t() で置換する。
const I18N = {
  ja: {
    lang_toggle: "EN",
    app_title: "⏰ オキロ！アラーム",
    tagline: "朝起きられないあなたへ。今日から変わろう。",
    tab_alarm: "⏰ アラーム",
    tab_quotes: "💬 名言",
    tab_tips: "😴 Tips",
    tab_sounds: "🔊 音",
    tab_shop: "🛒 ショップ",
    set_alarm_h: "アラームを設定",
    vibrate: "バイブレーション",
    escalate: "音量エスカレーション（徐々に大きく）",
    add_alarm: "＋ アラームを追加",
    alarms_h: "設定済みアラーム",
    coin_rule_note: "💡 早く止めるほどコインがもらえます（10秒以内=50 / 30秒以内=30 / 60秒以内=15 / それ以降=5、スヌーズすると半減）。スヌーズにはチケットが必要です。",
    browser_note: "※ ブラウザ版はページ（またはPWA）を開いている間に動作します。画面を閉じても確実に鳴らしたい場合はAndroidアプリ版をご利用ください。",
    ad_space: "広告スペース（AdSense）",
    shuffle: "🔀 別の名言",
    quotes_locked: "🔒 追加名言パック（16選）はショップで解放できます。",
    builtin_h: "内蔵アラーム音（自動生成・著作権フリー）",
    voice_h: "お願いボイス",
    voice_note: "「だれか起こしてください〜！」など、周りに頼るボイス。追加ボイスはショップで購入できます。",
    custom_h: "自分の音声を使う",
    custom_note: "好きな音声ファイル（mp3 / wav / ogg など）をアラーム音にできます。端末内（IndexedDB）にのみ保存されます。",
    preview: "▶ 試聴",
    coins_h: "🪙 所持コイン",
    coins_unit: "コイン",
    coins_note: "アラームを早く止める・連続早起き・広告視聴でコインが貯まります。",
    watch_ad_h: "📺 広告を見てコインGET",
    watch_ad_note: "広告を最後まで見ると +25コイン。（Web版は疑似視聴。AdSenseに正式なリワード広告はないため、本番はAndroid版のAdMobリワード広告をご利用ください。README参照）",
    watch_ad_btn: "▶ 広告を見る（+25🪙）",
    ticket_h: "😴 スヌーズチケット",
    ticket_note: "スヌーズ1回につきチケット1枚を消費します。「二度寝にはコストがかかる」仕組みで朝に強くなろう。",
    ticket_label: "スヌーズチケット（所持：{n}枚）",
    theme_h: "🎨 テーマ着せ替え",
    voiceshop_h: "🗣️ 追加ボイス",
    pack_h: "🎵 追加コンテンツ",
    gacha_h: "🎰 朝の運試しガチャ（20🪙）",
    gacha_note: "コイン・チケット・激励が当たる！朝の楽しみに。",
    gacha_btn: "ガチャを回す",
    badges_h: "🏅 実績バッジ",
    ring_title: "朝だ！起きろ！",
    snooze_btn: "😴 スヌーズ（チケット1枚）",
    stop_btn: "✋ 起きた！",
    footer: "アラーム音・画像・ボイスはすべて自動生成（著作権フリー）",
    banner_ad: "広告（AdSense）— 本番では自分のAdSenseコードに差し替えてください",
    // 動的
    buy: "{n}🪙で購入",
    owned: "購入済み",
    theme_active: "適用中",
    theme_apply: "適用する",
    day_unit: "日",
    ticket_chip: "😴 チケット×{n}",
    ring_timer: "⏱ {n}秒 — 早く止めるほどコインGET！",
    label_wake_bonus: "起床ボーナス",
    label_ad_watch: "広告視聴",
    label_gacha: "ガチャ",
    label_gacha_jackpot: "ガチャ大当たり",
    badge_unlock: "🏅 実績解除: {x}",
    not_enough_coins: "🪙 コインが足りません",
    no_ticket: "😴 チケットが足りません。ショップで購入してください",
    ticket_bought: "😴 スヌーズチケットを購入しました",
    theme_bought: '🎨 「{x}」を購入しました',
    voice_bought: '🗣️ 「{x}」を購入しました',
    pack_unlocked: "🎵 追加コンテンツを解放しました",
    ad_watching: "📺 広告視聴中... 残り{n}秒",
    ad_done: "✅ 視聴完了！",
    custom_saved: '✅ 「{x}」を保存しました。アラーム音の選択肢に「カスタム音源」が追加されます。',
    custom_saved_short: "✅ カスタム音源が保存済みです。",
    custom_sound_name: "カスタム音源",
    no_alarms: "アラームはまだありません",
    meta_vibrate: "バイブ",
    meta_escalate: "エスカレーション",
    gacha_jackpot: "🎉 大当たり！ +100🪙",
    gacha_win30: "✨ 当たり！ +30🪙",
    gacha_ticket: "😴 スヌーズチケット×1 ゲット！",
    gacha_win5: "🙂 +5🪙",
    gacha_miss: "💪 「今日も一日頑張ろう！」（はずれ）",
    notif_title: "⏰ オキロ！アラーム",
    notif_body: "朝だ！起きろ！ ",
    pack_sound_name: "追加アラーム音パック（雷鳴・グリッチ）",
    pack_quote_name: "追加名言パック（16選）",
  },
  en: {
    lang_toggle: "日本語",
    app_title: "⏰ Okiro! Alarm",
    tagline: "For those who can't get up in the morning. Change starts today.",
    tab_alarm: "⏰ Alarm",
    tab_quotes: "💬 Quotes",
    tab_tips: "😴 Tips",
    tab_sounds: "🔊 Sounds",
    tab_shop: "🛒 Shop",
    set_alarm_h: "Set an Alarm",
    vibrate: "Vibration",
    escalate: "Volume escalation (gradually louder)",
    add_alarm: "＋ Add Alarm",
    alarms_h: "Your Alarms",
    coin_rule_note: "💡 The faster you stop it, the more coins you earn (≤10s=50 / ≤30s=30 / ≤60s=15 / after=5; snoozing halves it). Snoozing requires a ticket.",
    browser_note: "※ The web version runs while the page (or PWA) is open. For guaranteed ringing even when the screen is off, use the Android app.",
    ad_space: "Ad space (AdSense)",
    shuffle: "🔀 Another quote",
    quotes_locked: "🔒 The extra quote pack (16 more) can be unlocked in the Shop.",
    builtin_h: "Built-in Alarm Sounds (auto-generated, royalty-free)",
    voice_h: "Wake-me-up Voices",
    voice_note: 'Voices that beg others to wake you, like "Somebody wake me up!". More voices can be bought in the Shop.',
    custom_h: "Use Your Own Sound",
    custom_note: "Use any audio file (mp3 / wav / ogg, etc.) as your alarm. It is stored only on your device (IndexedDB).",
    preview: "▶ Preview",
    coins_h: "🪙 Your Coins",
    coins_unit: "coins",
    coins_note: "Earn coins by stopping alarms quickly, waking early on streaks, and watching ads.",
    watch_ad_h: "📺 Watch an Ad for Coins",
    watch_ad_note: "Watch an ad to the end for +25 coins. (The web version is a simulation. AdSense has no true rewarded ads, so for production use the Android app's AdMob rewarded ads. See README.)",
    watch_ad_btn: "▶ Watch ad (+25🪙)",
    ticket_h: "😴 Snooze Tickets",
    ticket_note: 'Each snooze costs one ticket. The "sleeping in has a cost" system helps you get stronger in the mornings.',
    ticket_label: "Snooze tickets (owned: {n})",
    theme_h: "🎨 Themes",
    voiceshop_h: "🗣️ Extra Voices",
    pack_h: "🎵 Extra Content",
    gacha_h: "🎰 Morning Fortune Gacha (20🪙)",
    gacha_note: "Win coins, tickets, or a cheer! A little morning fun.",
    gacha_btn: "Spin the Gacha",
    badges_h: "🏅 Achievement Badges",
    ring_title: "It's morning! Wake up!",
    snooze_btn: "😴 Snooze (1 ticket)",
    stop_btn: "✋ I'm up!",
    footer: "All sounds, images, and voices are auto-generated (royalty-free).",
    banner_ad: "Ad (AdSense) — replace with your own AdSense code for production",
    // dynamic
    buy: "Buy for {n}🪙",
    owned: "Owned",
    theme_active: "Active",
    theme_apply: "Apply",
    day_unit: "d",
    ticket_chip: "😴 Tickets×{n}",
    ring_timer: "⏱ {n}s — stop sooner for more coins!",
    label_wake_bonus: "Wake bonus",
    label_ad_watch: "Ad watch",
    label_gacha: "Gacha",
    label_gacha_jackpot: "Gacha jackpot",
    badge_unlock: "🏅 Badge unlocked: {x}",
    not_enough_coins: "🪙 Not enough coins",
    no_ticket: "😴 Not enough tickets. Buy one in the Shop.",
    ticket_bought: "😴 Snooze ticket purchased",
    theme_bought: '🎨 Purchased "{x}"',
    voice_bought: '🗣️ Purchased "{x}"',
    pack_unlocked: "🎵 Extra content unlocked",
    ad_watching: "📺 Watching ad... {n}s left",
    ad_done: "✅ Done!",
    custom_saved: '✅ Saved "{x}". A "Custom sound" option has been added to the alarm sounds.',
    custom_saved_short: "✅ A custom sound is saved.",
    custom_sound_name: "Custom sound",
    no_alarms: "No alarms yet",
    meta_vibrate: "Vibrate",
    meta_escalate: "Escalation",
    gacha_jackpot: "🎉 Jackpot! +100🪙",
    gacha_win30: "✨ Win! +30🪙",
    gacha_ticket: "😴 Got 1 snooze ticket!",
    gacha_win5: "🙂 +5🪙",
    gacha_miss: '💪 "Have a great day!" (no prize)',
    notif_title: "⏰ Okiro! Alarm",
    notif_body: "It's morning! Wake up! ",
    pack_sound_name: "Extra alarm sound pack (Thunder & Glitch)",
    pack_quote_name: "Extra quote pack (16 quotes)",
  },
};
