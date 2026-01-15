#!/bin/bash

# Orbit セットアップチェックスクリプト
# 実行: bash check-setup.sh

echo "🔍 Orbit セットアップチェック開始..."
echo ""

# Node.js チェック
echo "✅ Node.js バージョン:"
node --version || echo "❌ Node.js がインストールされていません"
echo ""

# npm チェック
echo "✅ npm バージョン:"
npm --version || echo "❌ npm がインストールされていません"
echo ""

# package.json 存在確認
echo "✅ package.json 確認:"
if [ -f "package.json" ]; then
    echo "   ファイル存在: OK"
else
    echo "❌ package.json が見つかりません"
    exit 1
fi
echo ""

# node_modules 確認
echo "✅ node_modules 確認:"
if [ -d "node_modules" ]; then
    echo "   ディレクトリ存在: OK"
    echo "   インストール済みパッケージ数: $(ls node_modules | wc -l)"
else
    echo "❌ node_modules がありません"
    echo "   以下を実行してください:"
    echo "   npm install"
    exit 1
fi
echo ""

# 重要な依存関係チェック
echo "✅ 重要パッケージ確認:"
PACKAGES=("expo" "react" "react-native" "expo-router" "@shopify/react-native-skia")

for pkg in "${PACKAGES[@]}"; do
    if [ -d "node_modules/$pkg" ]; then
        echo "   ✓ $pkg"
    else
        echo "   ❌ $pkg が見つかりません"
    fi
done
echo ""

# Expo CLI 確認
echo "✅ Expo CLI 確認:"
if [ -f "node_modules/.bin/expo" ]; then
    echo "   Expo CLI: OK"
else
    echo "❌ Expo CLI がインストールされていません"
fi
echo ""

# TypeScript 設定確認
echo "✅ TypeScript 設定:"
if [ -f "tsconfig.json" ]; then
    echo "   tsconfig.json: OK"
else
    echo "⚠️  tsconfig.json がありません（オプション）"
fi
echo ""

# app ディレクトリ確認
echo "✅ アプリファイル確認:"
if [ -d "src/app" ]; then
    echo "   src/app/ ディレクトリ: OK"
    echo "   画面ファイル数: $(ls src/app/*.tsx 2>/dev/null | wc -l)"
else
    echo "❌ src/app/ ディレクトリが見つかりません"
fi
echo ""

# app.json 確認
echo "✅ Expo 設定確認:"
if [ -f "app.json" ]; then
    echo "   app.json: OK"
else
    echo "❌ app.json が見つかりません"
fi
echo ""

# TypeScript コンパイルチェック
echo "✅ TypeScript コンパイルチェック:"
if command -v npx &> /dev/null; then
    echo "   コンパイルテスト実行中..."
    if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
        ERROR_COUNT=$(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l)
        echo "   ⚠️  TypeScriptエラー: $ERROR_COUNT 個"
        echo "   （test-engine.ts のエラーは無視してOK）"
    else
        echo "   ✓ コンパイル成功"
    fi
else
    echo "   ⚠️  npx が見つかりません"
fi
echo ""

# .expo キャッシュ確認
echo "✅ キャッシュ状態:"
if [ -d ".expo" ]; then
    echo "   .expo/ キャッシュあり"
    echo "   初回起動は高速になります"
else
    echo "   .expo/ キャッシュなし"
    echo "   初回起動時に自動作成されます"
fi
echo ""

# 結論
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 チェック完了"
echo ""

# 全体評価
if [ -d "node_modules" ] && [ -f "package.json" ] && [ -d "src/app" ]; then
    echo "✅ セットアップ完了！"
    echo ""
    echo "🚀 次のステップ:"
    echo "   1. スマホに 'Expo Go' アプリをインストール"
    echo "   2. 以下を実行:"
    echo ""
    echo "      npm start"
    echo ""
    echo "   3. 表示されたQRコードをスキャン"
    echo ""
else
    echo "❌ セットアップが不完全です"
    echo ""
    echo "🔧 修正手順:"
    echo "   npm install"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
