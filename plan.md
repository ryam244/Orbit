Orbit Core（仮）PRD / Tech Spec（ブラッシュアップ版）

Format: Markdown / .md
Last updated: 2026-01-11 (JST)

0. 概要

Orbit Core は、2Dの「円環（リング）×セクター（角度分割）」グリッド上でブロックを落下・着地・マッチングさせる、テンポ感のある“サイバーパンク円環パズル”を目指すiOS（＋将来Android）ゲーム。

本ドキュメントは、提示プランを ファクトチェックで補正しつつ、実装可能性とVibe Coding（AIと共同開発）適性を最大化するためのブラッシュアップと、主要リスクの洗い出しを行う。

1. 目標 / 非目標
目標

2D表現でサイバーパンク感（ネオン、発光、シェーダー、パーティクル）

60fps安定（少なくともiPhone中位機種で）

AIが理解しやすいコード構造（純粋関数・分離・型定義の徹底）

グローバル配信前提の最小コンプラ（Privacy Policy導線等）

非目標（初期）

リアルタイム音声解析による“正確な”ビート検出（泥沼化しやすい）

完璧なチート耐性（ランキング開始直後から100点は目指さない）

3D表現（本作は2Dで成立）

2. Framework Selection（方針 + ファクトチェック）
選定フレームワーク

React Native（Expo） + @shopify/react-native-skia

併用：react-native-reanimated（フレーム更新/アニメーション）

選定理由（補正版）

Vibe Coding適性が高い：ゲームロジック〜描画までを“ほぼテキスト（TypeScript）”で表現しやすい。UnityはC#スクリプトはテキストだが、Scene/Prefab等のエディタ作業比率が上がりやすく、LLMが扱いにくい工程が残りやすい。

Skiaの表現力：Skiaはシェーダー（SkSL）を扱え、発光/歪み/ノイズなどの演出が可能。

2Dゲームなら現実的：3D必須ならUnityが堅いが、本作は2DリングパズルなのでSkiaで成立させやすい。

3. 画面フロー（Screen Flow）
Splash

ロゴ表示

アセット（画像/フォント/BGM）プリロード

完了後 Titleへ

Title

背景：ゲーム画面のオートデモ or ビジュアライザー

UI：「START」「SETTINGS」「SHOP」

演出：BPMに合わせたロゴ脈動（擬似Beat Sync）

Game（Main）

ループ：Spawn → Fall → Lock → Match → Clear → Effects

HUD：スコア / Next / Gravity Gauge / Pause

Pause：再開 / リトライ / タイトルへ

Result

スコア（カウントアップ）

ハイスコア更新演出

獲得通貨（Neon Crystal）

広告/課金導線（※MVPではオフ推奨）

4. コア仕様：データモデル（重要ブラッシュアップ）
結論：角度は float ではなく 整数セクターで持つ

浮動小数（角度 degree/radian）での境界判定はバグ温床。
ゲーム内部は int（sectorIndex）、描画時のみ座標に変換する。

推奨パラメータ

sectorCount: 24（例）

ringCount: 12（Core → Deadline）

5. TypeScript Interfaces（改訂版）

※“ゲーム内の正”は整数グリッド。描画や落下中の補間のみfloatを許可。

type BlockColor = 0 | 1 | 2 | 3 | 4; 
// 0=EMPTY, 1..4 = CYAN/MAGENTA/YELLOW/GREEN など

type GridIndex = number; // 0..(ringCount*sectorCount - 1)

type ActiveBlock = {
  id: string;
  color: Exclude<BlockColor, 0>;
  sector: number;      // 0..sectorCount-1 (int)
  ringPos: number;     // 落下中の連続値（0..ringCount-1）
  velocity: number;    // units/sec
};

type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

type EngineState = {
  status: GameStatus;
  score: number;
  combo: number;
  gravityGauge: number;    // 0..1
  coreSectorOffset: number; // コア回転を “セクター単位” で持つ（int or float可）
  
  // 盤面：1次元で持つ（GC対策）
  grid: Uint8Array;        // length = ringCount * sectorCount
  
  active: ActiveBlock | null;
  nextColor: Exclude<BlockColor, 0>;
  
  // Beat Sync（擬似）
  bpm: number;
  musicStartMs: number;    // 開始オフセット基準
};

type UserProfile = {
  userId: string;
  highScore: number;
  neonCrystals: number;
  unlockedSkins: string[];
  settings: {
    bgmVolume: number;
    seVolume: number;
    controlScheme: 'WHEEL' | 'TAP';
    reduceMotion?: boolean;
  };
};

6. ディレクトリ構成（Expo Router + Feature First）

既存案は良い。さらに「純粋関数の境界」を硬くしてAIが壊しにくい形に寄せる。

src/
├── app/                     # Expo Router
│   ├── _layout.tsx
│   ├── index.tsx            # Title
│   ├── game.tsx             # Game Screen
│   └── shop.tsx
├── engine/                  # 純粋関数だけ（最重要）
│   ├── stepFall.ts
│   ├── lockBlock.ts
│   ├── findMatches.ts
│   ├── applyMatches.ts
│   ├── spawn.ts
│   └── types.ts
├── runtime/                 # Reanimated / Skia / Audio
│   ├── useFrameLoop.ts
│   ├── useControls.ts
│   ├── useAudio.ts
│   └── render/
│       ├── GameCanvas.tsx
│       ├── CoreRenderer.tsx
│       ├── BlockRenderer.tsx
│       └── EffectLayer.tsx
├── stores/
│   ├── useMetaStore.ts       # Zustand（設定/通貨/メニュー状態）
│   └── useRunStore.ts        # 実行中の軽量状態（必要最小限）
├── utils/
│   ├── grid.ts               # index計算/近傍探索
│   ├── math.ts               # sector→座標変換
│   └── rng.ts                # 乱数（seed対応）
└── constants/
    ├── GameConfig.ts
    └── Skins.ts

7. ループ設計（60fpsの肝）
原則

毎フレームやるのは「移動」と「演出」中心

**重い処理（マッチ探索/盤面更新/生成）**は **イベント駆動（着地時）**で実行

useFrameCallback（Reanimated）

useFrameCallback はフレームごとに関数を走らせるための手段。

毎フレーム（UI寄り）

active.ringPos += velocity * dt

コア回転の補間

グロー/パーティクルのアニメ

着地イベント（JS側でOK）

lockBlock(grid, active)

findMatches(grid) → applyMatches

spawn(next) / combo / score 更新

狙い：配列生成を抑え、JS GCでカクつかない。

8. 描画（Skia）

Canvas上に「コア」「ブロック」「エフェクト」をレイヤ分け

変換：sectorIndex → 角度 → x,y（描画専用）

シェーダー：Skiaはシェーディング言語（SkSL）を扱える

注意：シェーダー多用は端末によって重くなるため、

低スペック向けに reduceMotion / lowFx を用意

9. オーディオ & 擬似Beat Sync（現実解）

expo-av は再生/録音の公式手段。

方針（おすすめ）

BGMは固定BPM（曲ごとに bpm と startOffsetMs を持つ）

nowMs - musicStartMs から 拍番号を算出し、ロゴ/グローを同期させる

“音解析でビート検出”は初期ではやらない（工数爆発しやすい）

10. 状態管理
Zustand（低頻度）

スコア履歴

通貨、スキン、設定

画面遷移に関わる状態

SharedValues（高頻度）

アクティブブロック位置

コア回転

画面エフェクト

11. 外部連携 & インフラ
11.1 Supabase（任意：段階導入推奨）
匿名認証（注意点）

signInAnonymously() で匿名ユーザーを作れるが、サインアウト/データ削除/端末変更で復旧できない点が明記されている。
また、濫用防止として captcha推奨。

推奨設計

ローカル保存を正とし、オンラインは“同期/ランキング”として扱う

価値が高い行為（課金復元、ランキング投稿）直前で Sign in with Apple を促す

12. Monetization（重要：Expo運用リスク）
12.1 RevenueCat（IAP）

ExpoでRevenueCatを使う場合、ネイティブモジュールを含むため Dev Build（開発ビルド）運用が前提になりやすい。

12.2 AdMob（広告）

expo-ads-admob は Expo SDK 46で削除され、EAS Build + Development Builds では react-native-google-mobile-ads を使う方針が明示されている。

12.3 同意（EU等）/ ATT

react-native-google-mobile-ads 側で UMP（同意フロー）やATT周りの案内がある。

13. グローバル配信前提の最低限コンプラ
Privacy Policy

App Store Connect上で Privacy Policy URL は全アプリ必須。

ゲーム内通貨（IAP）

Appleのガイドラインでは、IAPで購入したクレジット/ゲーム内通貨は 失効不可、必要に応じて 復元メカニズムを用意する旨が書かれている。

14. リスクレジスター（重要度つき）
P0（致命傷）

パフォーマンス崩壊（毎フレーム配列生成→GC）

対策：盤面は Uint8Array。重い処理は着地イベントのみ。

収益化SDK導入で開発速度が落ちる（EAS/Dev Build必須化）

対策：MVPは広告/課金オフ、もしくは機能フラグで後付け。

広告同意/プライバシー不備で審査・配信停止

対策：Privacy Policy導線、同意フロー（必要地域）、データ収集申告を最初から想定。

P1（手戻り大）

角度float管理による境界バグ

対策：sectorIndex int管理、描画時だけ角度化。

Beat Syncを音解析でやろうとして泥沼

対策：固定BPM + 経過時間で擬似同期。

ランキングのチート対策を最初から完璧にしようとして破綻

対策：最初はローカルランキング/デイリーseed等で段階導入。

P2（じわじわ）

グローバル運用負債（翻訳/問い合わせ/返金）

対策：EN基準、JA追加の2言語体制から開始。サポート導線はテンプレ化。

15. 実装ロードマップ（おすすめ）
MVP（最速で“面白さ検証”）

タイトル / ゲーム / リザルト

盤面 Uint8Array、着地イベント駆動

スコア/コンボ、簡易エフェクト

ローカル保存（ハイスコア/設定）

広告なし・課金なし・オンラインなし

v1.1（収益化の入口）

リワード広告（任意）

EAS/Dev Build前提になるため、MVP後に着手が安全

v1.2（IAP）

広告削除 or スキン購入（RevenueCat）

購入復元導線の整備

v1.3（オンライン）

Supabase：ランキング投稿（匿名→Appleサインイン誘導）

チート耐性は“段階的に強化”

16. AI（Vibe Coding）用のガードレール

engine/ は 純粋関数のみ：UI/Skia/Reanimated依存を禁止

grid は TypedArray 以外にしない（性能保証）

変更は「小さいPR単位」：

例：findMatches のみ改修、render には触らない、など

17. グローバル版で始める際のチェックリスト（最低限）

 Privacy Policy URL（App Store Connect / アプリ内導線）

 データ収集の自己申告（App Privacy Details）

 （広告を入れるなら）同意（EU等）とATT方針の決定

 （IAPなら）通貨/アイテムの失効なし・復元導線

 ENスクショ/ENストア文言を先に固める
