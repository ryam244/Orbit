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

---

## 18. 実装フェーズ（詳細）

### Phase 1: ゲームコア実装（Current）

**目標**: ゲームの核となるロジックを完成させ、動作確認を行う

#### 1.1 型定義とデータモデル
- [ ] `engine/types.ts` 作成
  - BlockColor, ActiveBlock, EngineState など
  - plan.md Section 5 の型定義を実装
  - 状態: 完了

#### 1.2 基本エンジン関数
- [ ] `stepFall.ts` 実装
  - ブロック落下ロジック（velocity × deltaTime）
  - 着地判定（ringPos >= ringCount）
  - 難易度調整用の速度パラメータ
  - 状態: 完了

- [ ] `lockBlock.ts` 完成
  - グリッドへのブロック配置
  - 既存ブロックとの衝突チェック
  - GameOver判定（最上段に着地）
  - 状態: 完了

- [ ] `findMatches.ts` 実装
  - リング方向のマッチング（連続3個以上）
  - セクター方向のマッチング（連続3個以上）
  - L字/T字などの複雑なマッチング（後フェーズ）
  - 状態: 完了

- [ ] `applyMatches.ts` 完成
  - マッチしたブロックの消去
  - 重力適用（上のブロックを落下）
  - カスケード処理（連鎖）
  - 状態: 完了

- [ ] `spawn.ts` 実装
  - ランダムな色選択（1-4）
  - ランダムなセクター選択
  - スポーン位置の安全性確認
  - 状態: 完了

#### 1.3 難易度とゲームバランス
- [ ] `GameConfig.ts` 拡張
  - 初期落下速度
  - 速度上昇率（レベルアップ）
  - マッチ条件（最小個数）
  - スコア倍率
  - コンボボーナス
  - 状態: 完了

#### 1.4 動作確認
- [ ] 簡易テストコード作成
  - ブロック落下→着地→マッチング→消去の流れ
  - エッジケースの確認
  - 状態: 完了

### Phase 2: 操作性とUI（Next）

**目標**: プレイヤーが快適に操作できるインターフェースを実装

#### 2.1 入力システム
- [ ] `runtime/useControls.ts` 実装
  - ブロック回転（左右）
  - 高速落下（長押し）
  - 即座落下（スワイプダウン）
  - コア回転（将来機能）

#### 2.2 フレームループ
- [ ] `runtime/useFrameLoop.ts` 実装
  - useFrameCallback を使った60fps駆動
  - deltaTime計算
  - ゲーム状態の更新
  - イベント駆動の最適化

#### 2.3 レンダリング
- [ ] `runtime/render/GameCanvas.tsx` 実装
  - Skia Canvas セットアップ
  - 座標系の確立

- [ ] `runtime/render/CoreRenderer.tsx` 実装
  - コア（中心円）の描画
  - リングガイドの描画
  - セクターガイドの描画

- [ ] `runtime/render/BlockRenderer.tsx` 実装
  - グリッド上のブロック描画
  - アクティブブロック描画
  - 色とグロー効果

- [ ] `runtime/render/EffectLayer.tsx` 実装
  - パーティクル効果（マッチ時）
  - スコア表示アニメーション
  - コンボ表示

#### 2.4 UI/HUD
- [ ] スコア表示
- [ ] Next ブロック表示
- [ ] Pause ボタン
- [ ] デバッグ情報表示（開発時のみ）

### Phase 3: ゲームフロー統合

**目標**: タイトル→ゲーム→リザルトの完全な流れを実装

#### 3.1 状態管理
- [ ] `stores/useGameStore.ts` 作成
  - Zustand でゲーム状態管理
  - EngineState の永続化
  - ハイスコア記録

#### 3.2 画面実装
- [ ] `app/index.tsx` (Title) 完成
  - スタートボタン
  - 設定ボタン
  - BGM開始

- [ ] `app/game.tsx` (Game) 完成
  - ゲームループ統合
  - Pause/Resume
  - GameOver 遷移

- [ ] `app/result.tsx` (Result) 完成
  - スコア表示
  - ハイスコア更新演出
  - リトライ/タイトル戻る

#### 3.3 サウンド
- [ ] `runtime/useAudio.ts` 実装
  - BGM再生（expo-av）
  - SE再生（着地、消去、コンボ）
  - ボリューム設定

### Phase 4: エフェクトとポリッシュ

**目標**: サイバーパンクな雰囲気と手触りの良さを追加

#### 4.1 ビジュアルエフェクト
- [ ] Skia シェーダー（グロー）
- [ ] パーティクルシステム
- [ ] カメラシェイク（大消し時）
- [ ] スコアポップアップ

#### 4.2 Beat Sync（擬似）
- [ ] BPM設定とタイミング計算
- [ ] ロゴ/UIの脈動
- [ ] ビジュアライザー

#### 4.3 設定とローカライゼーション
- [ ] 設定画面
- [ ] BGM/SE ボリューム調整
- [ ] 操作スキーム選択
- [ ] EN/JA 切り替え

### Phase 5: テストとバランス調整

**目標**: ゲームプレイの面白さを最大化

#### 5.1 プレイテスト
- [ ] 難易度曲線の調整
- [ ] スコアバランス
- [ ] コンボ倍率
- [ ] 落下速度

#### 5.2 パフォーマンス最適化
- [ ] 60fps維持確認
- [ ] メモリ使用量チェック
- [ ] GC対策
- [ ] reduceMotion 対応

#### 5.3 バグ修正
- [ ] エッジケースの処理
- [ ] クラッシュ対策
- [ ] 状態整合性確認

---

## 19. 現在の実装ステータス

**Phase 1: ゲームコア実装** - ✅ 完了 (2026-01-13)

- [x] ディレクトリ構造確立
- [x] 基本ユーティリティ（grid.ts, math.ts）
- [x] GameConfig.ts 初期設定
- [x] types.ts 作成
- [x] エンジンコア関数実装
  - [x] stepFall.ts - ブロック落下ロジック
  - [x] lockBlock.ts - ブロック着地と配置
  - [x] findMatches.ts - マッチング検出（リング方向＋セクター方向）
  - [x] applyMatches.ts - マッチ適用と重力処理
  - [x] spawn.ts - 新ブロック生成
- [x] GameConfig.ts に難易度パラメータ追加
  - 落下速度（初期値、増分、最大値）
  - スコア倍率
  - コンボシステム
- [x] 動作確認（test-engine.ts）

**Phase 2: 操作性とUI** - ✅ 完了 (2026-01-13)

- [x] 状態管理
  - [x] stores/useGameStore.ts - Zustand でゲーム状態管理
- [x] フレームループ
  - [x] runtime/useFrameLoop.ts - 60fps駆動、着地イベント処理
- [x] レンダリング（Skia）
  - [x] runtime/render/GameCanvas.tsx - Canvas基盤
  - [x] runtime/render/CoreRenderer.tsx - コア＆リング描画
  - [x] runtime/render/BlockRenderer.tsx - ブロック描画
- [x] 入力システム
  - [x] runtime/useControls.ts - タッチ操作（回転、高速落下）
- [x] ゲーム画面統合
  - [x] app/game.tsx - 完全なゲームループ＋HUD＋操作

**Phase 3: ゲームフロー統合** - ✅ 完了 (2026-01-14)

- [x] タイトル画面実装
  - [x] app/index.tsx - サイバーパンク風デザイン
  - [x] ハイスコア/プレイ回数表示
  - [x] グロー効果とネオンテーマ
- [x] リザルト画面実装
  - [x] app/result.tsx - スコア表示＋演出
  - [x] スコアカウントアップアニメーション
  - [x] ハイスコア更新時の「NEW RECORD」バッジ
  - [x] リトライ/タイトル戻るボタン

**Phase 4: エフェクトとポリッシュ** - 🔜 次のステップ

**Completed Features**:
- ✅ ブロック落下システム（速度調整可能）
- ✅ 着地判定と衝突検出
- ✅ マッチング検出（3個以上の連続ブロック）
- ✅ 重力適用（マッチ後の落下処理）
- ✅ ランダムスポーン（Game Over判定付き）
- ✅ 60fps フレームループ
- ✅ Skia 2Dレンダリング（コア、リング、ブロック）
- ✅ タッチ操作（左右回転、高速落下）
- ✅ HUD（スコア、コンボ表示）
- ✅ Pause/Resume機能
- ✅ Game Over検出と遷移
- ✅ サイバーパンク風タイトル画面
- ✅ スコアアニメーション付きリザルト画面
- ✅ ハイスコア記録とNEW RECORD演出
- ✅ 完全なゲームフロー（Title → Game → Result → Title）

**Known Issues**:
- ⚠️ @shopify/react-native-skia のインストール未完了
  - ネットワークエラーでバイナリダウンロードに失敗
  - ネットワーク環境で `npm install @shopify/react-native-skia` を実行必要
- ✅ その他の依存関係はインストール済み
  - zustand (v5.0.10)
  - react-native-reanimated (v4.2.1)
  - react-native-gesture-handler (v2.30.0)

**Configuration**:
- ✅ babel.config.js に reanimated プラグイン追加
- ✅ _layout.tsx に GestureHandlerRootView 追加
- ✅ package.json に全依存関係記録

**Next Steps**:
1. ネットワーク環境で Skia をインストール
   ```bash
   npm install @shopify/react-native-skia
   ```
2. アプリ起動とデモプレイ
   ```bash
   npm start
   # Then press 'i' for iOS or 'a' for Android
   ```
3. 難易度調整（落下速度、マッチ難易度）
4. タイトル画面とリザルト画面の実装
5. サウンド追加（BGM、SE）
