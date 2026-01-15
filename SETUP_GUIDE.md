# Orbit - 開発環境セットアップガイド

## 📋 必要な環境

### 必須
- **Node.js**: v18以上（現在: v22.21.1 ✅）
- **npm**: v8以上（現在: v10.9.4 ✅）
- **スマートフォン**: iOS または Android

### オプション
- **Android Studio**: Androidエミュレーター使用時
- **Xcode**: iOSシミュレーター使用時（Mac のみ）

---

## 🚀 初回セットアップ手順

### 1. 依存関係のインストール

```bash
# プロジェクトディレクトリに移動
cd /home/user/Orbit

# 既存のnode_modulesを削除（クリーンインストール）
rm -rf node_modules package-lock.json

# 依存関係を新規インストール
npm install

# インストール確認
npm list --depth=0
```

**期待される出力:**
```
orbit-core@0.1.0
├── @react-native-async-storage/async-storage@2.2.0
├── @shopify/react-native-skia@1.6.5
├── expo@54.0.31
├── expo-av@16.0.8
├── react@19.1.0
├── react-native@0.81.5
├── zustand@5.0.10
└── ... (他の依存関係)
```

---

## 📱 実機テスト手順

### Step 1: Expo Goアプリをインストール

スマートフォンに以下のアプリをインストール:

- **iOS**: App Storeで「Expo Go」を検索
- **Android**: Google Playで「Expo Go」を検索

### Step 2: 開発サーバーを起動

```bash
# プロジェクトディレクトリで実行
npm start

# または
npx expo start
```

**成功すると以下が表示されます:**
```
Starting Metro Bundler
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### Step 3: QRコードをスキャン

1. スマートフォンとPCを**同じWi-Fiネットワーク**に接続
2. Expo Goアプリを開く
3. ターミナルに表示されたQRコードをスキャン
   - **iOS**: カメラアプリで直接スキャン
   - **Android**: Expo Goアプリ内のスキャナーを使用

### Step 4: アプリが起動

- 初回は依存関係のダウンロードに時間がかかります（1-3分）
- ゲームが起動したら成功です！🎉

---

## 🐛 トラブルシューティング

### 問題1: `npm start` がエラーで止まる

**原因**: キャッシュの問題

**解決策:**
```bash
# キャッシュをクリア
npx expo start --clear

# それでもダメなら完全リセット
rm -rf node_modules .expo package-lock.json
npm install
npm start
```

---

### 問題2: QRコードをスキャンしても何も起きない

**原因**: ネットワークの問題

**解決策1: トンネルモードを使用**
```bash
# トンネル接続（Wi-Fi不要だが遅い）
npx expo start --tunnel

# ngrokのインストールが必要な場合
npm install -g @expo/ngrok
```

**解決策2: LAN IPアドレスを確認**
```bash
# LAN接続モード（推奨）
npx expo start --lan

# 表示されるIPアドレスをメモ
# 例: exp://192.168.1.100:8081
```

---

### 問題3: 「Unable to resolve module」エラー

**原因**: 依存関係の不整合

**解決策:**
```bash
# 1. Metro Bundlerをリセット
rm -rf .expo
npx expo start --clear

# 2. それでもダメなら再インストール
rm -rf node_modules
npm install
npm start
```

---

### 問題4: 起動は成功するが真っ白な画面

**原因**: JavaScriptエラー

**解決策:**
```bash
# 開発者メニューを開く
# - iOS: デバイスを振る
# - Android: デバイスを振る or Cmd+M (エミュレーター)

# 「Debug Remote JS」を選択
# ブラウザのコンソールでエラーを確認
```

**Expo Goアプリ内でエラーを確認:**
- 赤い画面が表示される場合、エラーメッセージを読む
- よくあるエラー:
  - `Invariant Violation`: コンポーネントのインポートミス
  - `undefined is not an object`: 型エラー
  - `Network request failed`: サーバー接続エラー

---

### 問題5: Android/iOSエミュレーターが起動しない

**Android Studio (Android):**
```bash
# 1. Android Studioをインストール
# 2. AVD Manager で仮想デバイス作成
# 3. 以下を実行
npx expo start --android
```

**Xcode (iOS - Mac のみ):**
```bash
# 1. Xcodeをインストール
# 2. iOS Simulatorを起動
# 3. 以下を実行
npx expo start --ios
```

---

## 🔧 開発モード機能

### ホットリロード
- ファイルを保存すると自動的にアプリが更新される
- `r`キーを押すと手動リロード

### 開発者メニュー
- **iOS**: デバイスを振る or Cmd+D (シミュレーター)
- **Android**: デバイスを振る or Cmd+M (エミュレーター)

メニュー項目:
- **Reload**: アプリをリロード
- **Debug Remote JS**: Chrome DevToolsで デバッグ
- **Toggle Performance Monitor**: FPS表示
- **Toggle Inspector**: 要素インスペクター

---

## 🧪 動作確認チェックリスト

起動後、以下をテストしてください:

- [ ] タイトル画面が表示される
- [ ] チュートリアルが自動で開く（初回のみ）
- [ ] チュートリアルをスキップできる
- [ ] 難易度選択画面に遷移できる
- [ ] モード選択画面に遷移できる
- [ ] ゲームが起動する
- [ ] ブロックが落下する
- [ ] 左右タップで回転する
- [ ] 長押しで高速落下
- [ ] 3つ揃うと消える
- [ ] ゲームオーバーになる
- [ ] リザルト画面が表示される
- [ ] アチーブメント画面が開く
- [ ] タイトルに戻れる

---

## 📊 パフォーマンスチェック

### FPS確認
```bash
# 開発者メニュー → Toggle Performance Monitor
# 目標: 60 FPS以上
```

### メモリ使用量
```bash
# 開発者メニュー → Enable Sampling Profiler
# 大量のブロックでテスト
```

---

## 🎯 次のステップ

### 1. サウンドファイルの追加
```bash
# assets/sounds/ ディレクトリに以下を配置:
# - match.mp3
# - rotate.mp3
# - drop.mp3
# - land.mp3
# - combo.mp3
# - gameOver.mp3

# 前回提供したガイドを参照
```

### 2. 実際の広告統合（オプション）
```bash
# Google AdMobアカウント作成後:
npx expo install react-native-google-mobile-ads

# src/utils/adManager.ts のコメントを参照
```

### 3. ビルド準備
```bash
# 開発ビルド作成
npx expo prebuild

# Android APK作成
eas build --platform android

# iOS IPA作成（Mac + Apple Developer Account 必要）
eas build --platform ios
```

---

## 💡 Tips

### 高速開発
```bash
# Web版で素早くテスト（動作確認のみ）
npm run web

# 特定のプラットフォームのみ起動
npm run android  # Androidのみ
npm run ios      # iOSのみ
```

### ログ確認
```bash
# Metro Bundlerのログを詳細表示
npx expo start --verbose

# 特定のログレベル
EXPO_DEBUG=true npx expo start
```

### キャッシュ管理
```bash
# 全キャッシュクリア（問題が多い場合）
watchman watch-del-all  # Watchmanインストール済みの場合
rm -rf $TMPDIR/react-* $TMPDIR/metro-*
rm -rf ~/.expo
npm start -- --reset-cache
```

---

## 📞 サポート

問題が解決しない場合:

1. **ターミナルのエラーメッセージをコピー**
2. **Expo Goアプリの赤いエラー画面をスクリーンショット**
3. **以下の情報を共有:**
   - OS (iOS/Android)
   - OSバージョン
   - Expo Goバージョン
   - エラーメッセージ

---

## 🎮 ゲームの遊び方（テスト用）

1. **初回起動**: チュートリアルが自動で表示される
2. **難易度選択**: 1-10の難易度を選択（初心者は1-3推奨）
3. **モード選択**:
   - Standard: 通常モード
   - Time Attack: 120秒制限
   - Endless: 無限プレイ
4. **操作**:
   - 左タップ: 左回転
   - 右タップ: 右回転
   - 長押し: 高速落下
5. **目標**: 同じ色を3つ以上揃える
6. **アチーブメント**: 10個解除で広告削除！

---

## ✅ セットアップ完了確認

以下が全て ✅ になれば完了:

- [ ] `npm install` が成功
- [ ] `npm start` でサーバーが起動
- [ ] QRコードが表示される
- [ ] スマートフォンでQRスキャン
- [ ] アプリが起動
- [ ] チュートリアルが表示される
- [ ] ゲームがプレイできる
- [ ] アチーブメント画面が開く

全て完了したらストアリリース準備完了です！🚀
