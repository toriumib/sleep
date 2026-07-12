# ⏰ オキロ！アラーム

朝起きられない人のための目覚ましアプリ。**Webアプリ（PWA）** と **Androidアプリ（Kotlin）** の2形態を含むmonorepoです。

```
okiro-alarm/
├── web/        # PWA（HTML/CSS/JS、フレームワークなし）
├── android/    # Android Studioプロジェクト（Kotlin + Gradle）
└── tools/      # 音源・ボイスの自動生成スクリプト（Python）
```

## 機能一覧

### 共通コンテンツ
- **名言タブ**: 朝活・習慣・継続に関する名言24選（パブリックドメイン／出典明記のもののみ）
- **睡眠Tipsタブ**: 科学的知見に基づく睡眠・起床のコツ16個
- **アラーム音6種**: すべてPythonで数式から合成した著作権フリー音源
  （クラシックビープ／チップチューン／ベル／サイレン風／モーニングチャイム／緊急アラーム）
- **お願いボイス5種**: 「だれか起こしてくださーい！」等をespeak-ng（オープンソースTTS）で生成
- **音量エスカレーション**: 徐々に音量が上がる
- **カスタム音源**: ユーザー自身の音声ファイルをアラーム音に設定可能
- **モチベーション画像**: 日の出・炎・カーテン・ロケットのSVGを自前生成（著作権フリー）

### Web（PWA）
- アラーム設定（複数・有効/無効切替・スヌーズ5分）
- Web Audio APIによる再生＋GainNodeで音量エスカレーション
- Vibration APIによるバイブレーション（対応端末）
- manifest + Service Workerによるオフライン対応・ホーム画面追加
- 音声ファイルのアップロード（IndexedDBに端末内保存）
- AdSense用プレースホルダー（`web/index.html`内のコメント参照）
- ⚠️ ブラウザの制約上、**ページ（またはインストールしたPWA）を開いている間**に鳴動します。確実に起きたい人はAndroid版を併用してください。

### Android（Kotlin）
- `AlarmManager.setAlarmClock()` による正確なアラーム（Dozeでも発火）
- フルスクリーンインテント通知で**ロック画面上に全画面アラーム表示**
- `USAGE_ALARM` のAudioAttributesで再生 → **マナーモードでもアラーム音量で鳴る**
- バイブレーション、音量エスカレーション、スヌーズ5分
- 内蔵11音源（`res/raw`）＋SAFによるカスタム音源選択
- 再起動後の再スケジュール（BootReceiver）
- Google Mobile Ads SDK（AdMob）バナー広告（**テストID組み込み済み**）

## セットアップ

### Webアプリ
```bash
cd web
python3 -m http.server 8000
# → http://localhost:8000 を開く
```
- PWAとして使うにはHTTPSでの配信が必要です（GitHub Pages / Netlify / Cloudflare Pages等）。
- スマホのブラウザで開き「ホーム画面に追加」でアプリとして起動できます。

### Androidアプリ
1. Android Studio（Hedgehog以降推奨、JDK 17）で `android/` フォルダを開く
2. Gradle Syncを実行（初回は依存ライブラリのダウンロードに時間がかかります）
   - Gradle wrapperのjarは含めていません。Android Studioが自動解決しない場合は、`android/` で `gradle wrapper` を一度実行してください（Gradle 8.7を想定）。
3. 実機またはエミュレータで実行
4. 初回起動時に「通知」の許可、アラーム設定時に「アラームとリマインダー」の許可を求められたら許可してください

## AdMob IDの差し替え（本番公開時に必須）

現在は**Googleの公式テストID**が設定されています。本番では以下の2箇所を自分のIDに差し替えてください。

| 場所 | ファイル | 現在の値（テスト用） |
|---|---|---|
| アプリID | `android/app/src/main/AndroidManifest.xml` の `com.google.android.gms.ads.APPLICATION_ID` | `ca-app-pub-3940256099942544~3347511713` |
| バナー広告ユニットID | `android/app/src/main/res/layout/activity_main.xml` の `app:adUnitId` | `ca-app-pub-3940256099942544/6300978111` |

WebのAdSenseは `web/index.html` 内の「AdSense広告プレースホルダー」コメントを自分のコード（`ca-pub-XXXX...`）に置き換えてください。

## 音源の追加・再生成

### アラーム音の再生成/追加
```bash
pip install numpy
python3 tools/generate_sounds.py web/assets/sounds
```
- `tools/generate_sounds.py` の `SOUNDS` に関数を追加すると新しい音を増やせます。
- Android用は変換して配置: `ffmpeg -i 新音源.wav -c:a libvorbis -q:a 3 android/app/src/main/res/raw/新音源.ogg`
  さらに `ContentData.kt` の `sounds` リストと `web/data.js` の `BUILTIN_SOUNDS` に1行追加。

### ボイスの再生成・差し替え
```bash
sudo apt install espeak-ng   # または brew install espeak-ng
python3 tools/generate_voices.py web/assets/voices
```
- espeak-ngの声は機械的です。より自然な日本語ボイスにしたい場合:
  - [VOICEVOX](https://voicevox.hiroshiba.jp/)（無料・商用利用可、クレジット表記必要）で同じセリフを録音し、`web/assets/voices/` と `android/app/src/main/res/raw/` の同名ファイルを置き換え
  - `gTTS`（`pip install gTTS`）でも生成可能（要ネット接続）:
    ```python
    from gtts import gTTS
    gTTS("だれか起こしてくださーい！", lang="ja").save("voice_okoshite.mp3")
    ```
  - 自分の声を録音して置き換えるのも効果的です

## GitHubへのpush手順

リモートリポジトリが未設定のため、コミットまで済ませてあります。以下でpushできます。

```bash
cd okiro-alarm
# GitHubで空リポジトリを作成してから：
git remote add origin git@github.com:<ユーザー名>/okiro-alarm.git
git push -u origin main

# ghコマンドが使えるなら：
gh repo create okiro-alarm --public --source=. --push
```

## Wear OS対応（将来課題・設計メモ）

- **構成**: `android/` に `:wear` モジュールを追加（`com.android.application` + `androidx.wear.compose`）。既存の `:app` と同一applicationIdグループでペアリング。
- **アラーム同期**: Wearable Data Layer API（`MessageClient` / `DataClient`）でスマホ側のアラーム設定をウォッチへ同期。
- **ウォッチ側の鳴動**: スマホ側の `AlarmService` 発火時に `MessageClient` でウォッチへ通知 → ウォッチは `Ongoing Activity` + バイブレーション（手首振動は起床効果が高い）。
- **単体動作**: ウォッチ単体でも `AlarmManager` は利用可能。ただし音量が小さいため、バイブ主体の設計にする。
- **タイル/コンプリケーション**: 次のアラーム時刻をTile APIで表示すると便利。

## ライセンス・著作権について

- アラーム音・画像（SVG/PNG）: 本リポジトリ内で数式・コードから生成したオリジナル。自由に利用可。
- ボイス: espeak-ng（GPLv3のソフトウェア）で生成。**生成された音声データ自体**の利用に制限はありません。
- 名言: パブリックドメインの著作・ことわざ、および出典を明記した短い引用のみを収録。
