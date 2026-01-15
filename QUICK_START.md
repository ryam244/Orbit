# 🚀 クイックスタートガイド（5分で起動）

## 📱 今すぐテストする（最速）

### 1. 準備（30秒）
```bash
# 1. スマホに「Expo Go」アプリをインストール
# iOS: App Store
# Android: Google Play

# 2. スマホとPCを同じWi-Fiに接続
```

### 2. 起動（1分）
```bash
cd /home/user/Orbit
npm start
```

### 3. QRコードをスキャン（30秒）
- **iOS**: カメラアプリで画面のQRコードをスキャン
- **Android**: Expo Goアプリ内のスキャナーを使用

### 4. 完了！
ゲームが起動します 🎮

---

## ❌ エラーが出た場合

### エラー1: 「Metro Bundler crashed」
```bash
# キャッシュをクリアして再起動
npx expo start --clear
```

### エラー2: QRコードをスキャンしても開かない
```bash
# トンネルモードで起動（遅いがWi-Fi不要）
npx expo start --tunnel
```

### エラー3: 「Unable to resolve module」
```bash
# 依存関係を再インストール
rm -rf node_modules
npm install
npm start
```

### エラー4: 起動するが真っ白な画面
```bash
# 開発者ツールで確認
# 1. スマホを振る
# 2. 「Toggle Element Inspector」をタップ
# 3. エラーメッセージを確認
```

---

## 🔧 完全リセット（全部ダメな時）

```bash
# すべてをクリーンアップして再起動
rm -rf node_modules package-lock.json .expo
npm install
npx expo start --clear
```

---

## 💡 便利コマンド

```bash
# Web版で試す（スマホ不要、動作確認のみ）
npm run web

# ログを詳細表示
npx expo start --verbose

# 特定のプラットフォームのみ
npm run android  # Android
npm run ios      # iOS (Macのみ)
```

---

## ✅ 動作確認

起動したら以下をテスト:

1. ✅ チュートリアルが表示される
2. ✅ 「SKIP」でスキップできる
3. ✅ タイトル画面に戻る
4. ✅ 「🎮 STANDARD」でゲーム開始
5. ✅ 左右タップで回転
6. ✅ 長押しで高速落下
7. ✅ 3つ揃うと消える
8. ✅ 「🏆 ACHIEVEMENTS」が開く

全部OKならリリース準備完了！🎉

---

## 📞 それでも起動しない場合

以下を教えてください:

1. **エラーメッセージ** (ターミナル)
2. **スマホのOS** (iOS 17 / Android 14 など)
3. **どの手順で止まったか**

例:
```
npm start を実行したら以下のエラー:
Error: Cannot find module 'expo'
```

すぐに解決方法を提示します！
