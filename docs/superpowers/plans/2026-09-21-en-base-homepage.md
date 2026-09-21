# En・Base 自社ホームページ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** En・Base（AI活用支援業、屋号）の自社ホームページを静的HTML/CSS/JSで構築する。1ページ完結のLPと、既存の診断ツールをEn・Baseブランドでラップした診断ページの2階層構成。

**Architecture:** サーバー・ビルドツールなしの静的サイト。`index.html` 1枚にセクションを積み上げるLP形式。`shindan/index.html` は既存の `診断ツール/index.html`（フェーズ0〜5のAI活用診断、`LEVELS` 配列が判定ロジックの正）をコピーし、配色とヘッダー/フッターのみEn・Baseブランドに差し替える（診断ロジックは無改修）。

**Tech Stack:** HTML5 / CSS3（カスタムプロパティ、Flexbox/Grid） / Vanilla JS。Google Fonts（Noto Sans JP, Outfit）をCDN読み込み。フォームはGoogleフォームのiframe埋め込み（未作成の間はプレースホルダー）。

**Spec:** [docs/superpowers/specs/2026-09-21-en-base-homepage-design.md](../specs/2026-09-21-en-base-homepage-design.md)

## Global Constraints

- 屋号表記は「En・Base」で統一する。「DX」という単語はサイト内のどこにも使わない。
- ブランドカラーはロゴ（`images/ロゴ.png`）から抽出した実測値を使う：ブルー `#0057FC`、ライトブルー（グラデーション終端）`#8EB6FA`、ゴールドアクセント `#B5893F`、インク（本文色）`#14171C`。
- 静的HTML/CSS/JSのみ。サーバーサイド処理・ビルドツール・npm依存を追加しない。
- レスポンシブ対応必須（375px〜1440px幅で崩れないこと）。
- 事業内容カードは4つ：①業務効率化コンサル ②AIアプリ作成 ③ツール導入支援（Claude Code等） ④社内AI活用ロードマップ策定。
- 「選ばれる理由」には、一社ごとのお困りごとにフォーカスしテンプレ的でなくオーダーメイドで解決する、という趣旨を必ず含める。
- 診断ツール（`shindan/index.html`）の判定ロジック（`LEVELS` 配列とスコアリング関数）は一切変更しない。ヘッダー・フッター・配色・タイトルのみ変更する。
- お問い合わせはGoogleフォームのiframe埋め込み。フォーム未作成の間は「準備中」プレースホルダー＋mailto代替リンクを表示する。
- 各タスック完了ごとに `git add` + `git commit` する（本プロジェクトは未初期化のため、最初のタスクで `git init` する）。

---

## File Structure

```
自社ホームページ/
├── index.html                # トップページ（1ページLP）
├── css/
│   └── style.css              # トップページ用スタイル
├── js/
│   └── main.js                # モバイルナビ開閉・スムーススクロール
├── images/
│   └── ロゴ.png                # 既存ファイルをここへ移動
├── shindan/
│   └── index.html              # 診断ツール（En・Baseブランドでラップ）
└── docs/superpowers/{specs,plans}/
```

---

### Task 1: プロジェクト初期化とベースレイアウト

**Files:**
- Create: `.gitignore`
- Create: `images/` (ロゴ.png をここへ移動)
- Create: `css/style.css`
- Create: `js/main.js`
- Create: `index.html`（ヘッダー・フッター・空セクションの骨組み）

**Interfaces:**
- Produces: CSS変数一式（`--color-blue`, `--color-blue-light`, `--color-gold`, `--color-ink`, `--color-ink-soft`, `--color-bg`, `--color-bg-soft`, `--color-border`, `--radius-lg`, `--radius-md`, `--shadow`, `--container-width`）。以降の全タスクはこれらの変数名をそのまま使う。
- Produces: `index.html` 内に空の `<section id="hero">`〜`<section id="contact">` のアンカーを用意し、以降のタスクはこの中身を埋める。
- Produces: `.btn`, `.btn-primary`, `.btn-secondary`, `.container`, `.section-title`, `.section-eyebrow` という共通CSSクラス名。以降のタスクで再利用する。

- [ ] **Step 1: Git初期化**

```bash
cd "C:\Users\admin\Documents\Claude\ホームページ作成\自社ホームページ"
git init
```

- [ ] **Step 2: `.gitignore` を作成**

```
.DS_Store
Thumbs.db
```

- [ ] **Step 3: ロゴを `images/` に移動**

```bash
mkdir -p images css js
mv "ロゴ.png" "images/ロゴ.png"
```

- [ ] **Step 4: `css/style.css` を作成（デザイントークン＋共通クラス＋ヘッダー/フッター）**

```css
/* ===== Design Tokens ===== */
:root{
  --color-blue: #0057FC;
  --color-blue-light: #8EB6FA;
  --color-gold: #B5893F;
  --color-ink: #14171C;
  --color-ink-soft: #4B5563;
  --color-bg: #FFFFFF;
  --color-bg-soft: #F5F7FB;
  --color-border: #E4E7EE;
  --radius-lg: 20px;
  --radius-md: 14px;
  --shadow: 0 8px 30px rgba(0,50,150,0.08);
  --container-width: 1080px;
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  font-family:"Noto Sans JP", sans-serif;
  color:var(--color-ink);
  background:var(--color-bg);
  line-height:1.75;
  -webkit-font-smoothing:antialiased;
}
img{max-width:100%;display:block;}
a{color:inherit;text-decoration:none;}
.en{font-family:"Outfit","Noto Sans JP",sans-serif;}

.container{
  max-width:var(--container-width);
  margin:0 auto;
  padding:0 24px;
}

.section{padding:88px 0;}
.section-soft{background:var(--color-bg-soft);}
.section-eyebrow{
  display:inline-block;
  font-size:13px;
  font-weight:700;
  letter-spacing:.08em;
  color:var(--color-blue);
  background:rgba(0,87,252,0.08);
  padding:6px 14px;
  border-radius:100px;
  margin-bottom:16px;
}
.section-title{
  font-size:clamp(24px, 3vw, 34px);
  font-weight:800;
  line-height:1.5;
  margin:0 0 16px;
}
.section-lead{
  color:var(--color-ink-soft);
  font-size:16px;
  max-width:640px;
  margin:0 0 40px;
}

.btn{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:14px 28px;
  border-radius:100px;
  font-weight:700;
  font-size:15px;
  border:2px solid transparent;
  cursor:pointer;
}
.btn-primary{
  background:linear-gradient(135deg, var(--color-blue), var(--color-blue-light));
  color:#fff;
}
.btn-secondary{
  background:transparent;
  border-color:var(--color-border);
  color:var(--color-ink);
}

/* ===== Header ===== */
.site-header{
  position:sticky; top:0; z-index:100;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(8px);
  border-bottom:1px solid var(--color-border);
}
.site-header .container{
  display:flex; align-items:center; justify-content:space-between;
  height:72px;
}
.brand img{height:34px;}
.nav-links{display:flex; gap:28px; list-style:none; margin:0; padding:0;}
.nav-links a{font-size:14px; font-weight:600;}
.nav-toggle{display:none; background:none; border:none; font-size:24px; cursor:pointer;}

@media (max-width: 860px){
  .nav-links{
    position:fixed; top:72px; left:0; right:0;
    background:#fff; border-bottom:1px solid var(--color-border);
    flex-direction:column; gap:0; padding:8px 24px;
    transform:translateY(-120%); transition:transform .25s ease;
  }
  .nav-links.open{transform:translateY(0);}
  .nav-links a{display:block; padding:14px 0; border-bottom:1px solid var(--color-border);}
  .nav-toggle{display:block;}
  .header-cta{display:none;}
}

/* ===== Footer ===== */
.site-footer{
  background:var(--color-ink);
  color:#fff;
  padding:48px 0 28px;
}
.site-footer .container{
  display:flex; justify-content:space-between; flex-wrap:wrap; gap:24px;
}
.site-footer .brand img{filter:brightness(0) invert(1); height:28px;}
.footer-copy{color:#9AA3B2; font-size:13px; margin-top:24px; width:100%;}
```

- [ ] **Step 5: `js/main.js` を作成（空のイベント登録の土台のみ、中身はTask 7で実装）**

```js
document.addEventListener("DOMContentLoaded", function () {
  // モバイルナビ開閉・スムーススクロールはTask 7で実装
});
```

- [ ] **Step 6: `index.html` を作成（ヘッダー・空セクション骨組み・フッター）**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>En・Base | AI活用支援</title>
<meta name="description" content="En・Baseは中小企業向けにAI活用のコンサルティング・アプリ開発・ツール導入支援を行っています。一社ごとのお困りごとにフォーカスしたオーダーメイドの支援が強みです。">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800;900&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="site-header">
  <div class="container">
    <a class="brand" href="#hero"><img src="images/ロゴ.png" alt="En・Base"></a>
    <nav>
      <ul class="nav-links" id="navLinks">
        <li><a href="#services">事業内容</a></li>
        <li><a href="#why">選ばれる理由</a></li>
        <li><a href="#works">実績</a></li>
        <li><a href="#diagnosis">無料診断</a></li>
        <li><a href="#about">会社概要</a></li>
        <li><a href="#contact">お問い合わせ</a></li>
      </ul>
    </nav>
    <a class="btn btn-primary header-cta" href="#contact">お問い合わせ</a>
    <button class="nav-toggle" id="navToggle" aria-label="メニュー">☰</button>
  </div>
</header>

<main>
  <section id="hero"></section>
  <section id="services" class="section"></section>
  <section id="why" class="section section-soft"></section>
  <section id="works" class="section"></section>
  <section id="diagnosis" class="section section-soft"></section>
  <section id="about" class="section"></section>
  <section id="contact" class="section section-soft"></section>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="brand"><img src="images/ロゴ.png" alt="En・Base"></div>
    <p class="footer-copy">&copy; 2026 En・Base. All rights reserved.</p>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 7: ブラウザで確認**

`preview_start` でこのフォルダを開き（もしくは `navigate` でファイルを直接開き）、ヘッダーのロゴ・ナビリンク・フッターが表示され、各セクションが空のまま並んでいることを目視確認する。コンソールエラーがないことを確認する。

- [ ] **Step 8: Commit**

```bash
git add .gitignore css js images index.html
git commit -m "chore: プロジェクト初期化とベースレイアウト"
```

---

### Task 2: ヒーローセクション

**Files:**
- Modify: `index.html`（`<section id="hero">` の中身）
- Modify: `css/style.css`（`.hero` 関連スタイルを追記）

**Interfaces:**
- Consumes: Task 1で定義した `.container`, `.btn`, `.btn-primary`, `.btn-secondary`, CSS変数一式
- Produces: `.hero`, `.hero-copy`, `.hero-badges` クラス

- [ ] **Step 1: `index.html` の `<section id="hero"></section>` を以下に置き換え**

```html
<section id="hero" class="hero">
  <div class="container hero-inner">
    <div class="hero-copy">
      <span class="section-eyebrow">AI活用支援</span>
      <h1>一社ごとの「困った」に、<br>AIで伴走する。</h1>
      <p class="hero-lead">テンプレートではなく、あなたの会社の課題に合わせてAI活用を設計・実行します。まずは無料診断で、今の立ち位置から確認できます。</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="shindan/index.html">無料診断を試す →</a>
        <a class="btn btn-secondary" href="#contact">お問い合わせ</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css` に追記**

```css
/* ===== Hero ===== */
.hero{padding:100px 0 80px;}
.hero-inner{max-width:720px;}
.hero-copy h1{
  font-size:clamp(30px, 5vw, 46px);
  font-weight:900;
  line-height:1.45;
  margin:0 0 20px;
}
.hero-lead{
  font-size:17px;
  color:var(--color-ink-soft);
  margin:0 0 32px;
}
.hero-actions{display:flex; gap:16px; flex-wrap:wrap;}

@media (max-width: 600px){
  .hero{padding:64px 0 48px;}
  .hero-actions{flex-direction:column;}
  .hero-actions .btn{width:100%; justify-content:center;}
}
```

- [ ] **Step 3: ブラウザで確認**

ヒーローの見出し・リード文・2つのボタンが表示され、「無料診断を試す」ボタンが `shindan/index.html` を指していること（まだファイルが無いので404で構わない、リンク先の記述だけ確認）、「お問い合わせ」ボタンが `#contact` にジャンプすることを確認する。375px幅でボタンが縦並びになることを確認する。

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: ヒーローセクションを追加"
```

---

### Task 3: 事業内容セクション

**Files:**
- Modify: `index.html`（`<section id="services">` の中身）
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.section`, `.section-eyebrow`, `.section-title`, `.section-lead`, `.container`
- Produces: `.service-grid`, `.service-card` クラス

- [ ] **Step 1: `index.html` の `<section id="services" class="section"></section>` を以下に置き換え**

```html
<section id="services" class="section">
  <div class="container">
    <span class="section-eyebrow">SERVICES</span>
    <h2 class="section-title">事業内容</h2>
    <p class="section-lead">「使ってみたい」を「業務が変わった」に変えるところまで、一緒にやります。</p>
    <div class="service-grid">
      <div class="service-card">
        <div class="service-num en">01</div>
        <h3>業務効率化コンサル</h3>
        <p>日々の業務のどこにAIが使えるか、現場に入り込んで洗い出し、実行まで伴走します。</p>
      </div>
      <div class="service-card">
        <div class="service-num en">02</div>
        <h3>AIアプリ作成</h3>
        <p>既存のツールでは解決できない業務は、御社専用の小さなAIアプリを作って解決します。</p>
      </div>
      <div class="service-card">
        <div class="service-num en">03</div>
        <h3>ツール導入支援</h3>
        <p>Claude Codeなどの生成AIツールを、実際の業務フローに組み込むところまで支援します。</p>
      </div>
      <div class="service-card">
        <div class="service-num en">04</div>
        <h3>社内AI活用ロードマップ策定</h3>
        <p>AI活用の現在地を診断し、6ヶ月単位で無理なく進められる計画を一緒に作ります。</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css` に追記**

```css
/* ===== Services ===== */
.service-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:24px;
}
.service-card{
  background:#fff;
  border:1px solid var(--color-border);
  border-radius:var(--radius-lg);
  padding:32px;
  box-shadow:var(--shadow);
}
.service-num{
  font-size:22px;
  font-weight:700;
  color:var(--color-blue-light);
  margin-bottom:12px;
}
.service-card h3{font-size:19px; margin:0 0 10px;}
.service-card p{color:var(--color-ink-soft); font-size:14.5px; margin:0;}

@media (max-width: 700px){
  .service-grid{grid-template-columns:1fr;}
}
```

- [ ] **Step 3: ブラウザで確認**

4枚のカードが2列（PC幅）／1列（375px幅）で表示され、各カードにタイトルと本文があることを確認する。

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: 事業内容セクションを追加"
```

---

### Task 4: 選ばれる理由セクション

**Files:**
- Modify: `index.html`（`<section id="why">` の中身）
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.section`, `.section-eyebrow`, `.section-title`, `.container`
- Produces: `.why-list`, `.why-item` クラス

- [ ] **Step 1: `index.html` の `<section id="why" class="section section-soft"></section>` を以下に置き換え**

```html
<section id="why" class="section section-soft">
  <div class="container">
    <span class="section-eyebrow">WHY EN・BASE</span>
    <h2 class="section-title">選ばれる理由</h2>
    <div class="why-list">
      <div class="why-item">
        <h3>お困りごとにフォーカス</h3>
        <p>テンプレート的な提案ではなく、一社ごとの困りごとから逆算してご提案します。</p>
      </div>
      <div class="why-item">
        <h3>専門用語を使わない説明</h3>
        <p>AIやITに詳しくない方にも伝わる言葉で、意思決定に必要な情報だけをお伝えします。</p>
      </div>
      <div class="why-item">
        <h3>診断から実行まで伴走</h3>
        <p>現状把握のための無料診断から、実際の導入・定着まで一貫してサポートします。</p>
      </div>
      <div class="why-item">
        <h3>実務に基づく提案</h3>
        <p>不動産業界などでの実際の支援実績をもとに、机上論ではない現実的な計画を立てます。</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css` に追記**

```css
/* ===== Why ===== */
.why-list{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:20px 32px;
}
.why-item{
  border-left:3px solid var(--color-gold);
  padding-left:20px;
}
.why-item h3{font-size:17px; margin:0 0 8px;}
.why-item p{color:var(--color-ink-soft); font-size:14.5px; margin:0;}

@media (max-width: 700px){
  .why-list{grid-template-columns:1fr;}
}
```

- [ ] **Step 3: ブラウザで確認**

4項目がゴールドの縦線付きで表示され、「お困りごとにフォーカス」の文言が含まれていることを確認する。

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: 選ばれる理由セクションを追加"
```

---

### Task 5: 実績・事例セクション

**Files:**
- Modify: `index.html`（`<section id="works">` の中身）
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.section`, `.section-eyebrow`, `.section-title`, `.section-lead`, `.container`
- Produces: `.works-grid`, `.work-card` クラス

- [ ] **Step 1: `index.html` の `<section id="works" class="section"></section>` を以下に置き換え**

```html
<section id="works" class="section">
  <div class="container">
    <span class="section-eyebrow">WORKS</span>
    <h2 class="section-title">実績・事例</h2>
    <p class="section-lead">具体的な会社名は伏せていますが、実際にご支援した内容の一部です。</p>
    <div class="works-grid">
      <div class="work-card">
        <h3>不動産管理会社向け AI活用ロードマップ策定</h3>
        <p>案件管理・原価計算など日々の業務を棚卸しし、フェーズ0〜5のフレームワークで6ヶ月の実行計画を策定しました。</p>
      </div>
      <div class="work-card">
        <h3>業務ツールの自社開発支援</h3>
        <p>請求書発行などの決まった手順の業務を専用ツール化し、担当者の作業時間を削減しました。</p>
      </div>
      <div class="work-card">
        <h3>SNS運用・コンテンツ制作の仕組み化</h3>
        <p>ネタ収集から投稿までの一連の流れをAIで型化し、継続的に発信できる体制を構築しました。</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css` に追記**

```css
/* ===== Works ===== */
.works-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:24px;
}
.work-card{
  background:var(--color-bg-soft);
  border-radius:var(--radius-md);
  padding:28px;
}
.work-card h3{font-size:16px; margin:0 0 10px;}
.work-card p{color:var(--color-ink-soft); font-size:14px; margin:0;}

@media (max-width: 900px){
  .works-grid{grid-template-columns:1fr;}
}
```

- [ ] **Step 3: ブラウザで確認**

3件の事例カードがPCで3列、375px幅で1列表示されることを確認する。

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: 実績・事例セクションを追加"
```

---

### Task 6: 無料診断導線・会社概要・お問い合わせセクション

**Files:**
- Modify: `index.html`（`<section id="diagnosis">`, `<section id="about">`, `<section id="contact">` の中身）
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.section`, `.section-eyebrow`, `.section-title`, `.section-lead`, `.container`, `.btn-primary`
- Produces: `.phase-strip`, `.phase-chip`, `.about-grid`, `.contact-box`, `.contact-placeholder` クラス

- [ ] **Step 1: `index.html` の `<section id="diagnosis" class="section section-soft"></section>` を以下に置き換え**

```html
<section id="diagnosis" class="section section-soft">
  <div class="container">
    <span class="section-eyebrow">FREE DIAGNOSIS</span>
    <h2 class="section-title">無料AI活用診断</h2>
    <p class="section-lead">17個の質問に答えるだけで、御社のAI活用の現在地（フェーズ0〜5）と、次の6ヶ月でやるべきことがわかります。所要時間は約5分です。</p>
    <div class="phase-strip">
      <span class="phase-chip">0 未着手</span>
      <span class="phase-chip">1 個人利用</span>
      <span class="phase-chip">2 情報連携</span>
      <span class="phase-chip">3 業務組み込み</span>
      <span class="phase-chip">4 全社連携</span>
      <span class="phase-chip">5 内製化</span>
    </div>
    <a class="btn btn-primary" href="shindan/index.html">無料診断をはじめる →</a>
  </div>
</section>
```

- [ ] **Step 2: 続けて `<section id="about" class="section"></section>` を以下に置き換え**

```html
<section id="about" class="section">
  <div class="container">
    <span class="section-eyebrow">ABOUT</span>
    <h2 class="section-title">会社概要</h2>
    <dl class="about-grid">
      <dt>屋号</dt><dd>En・Base</dd>
      <dt>代表</dt><dd>［ご記入ください］</dd>
      <dt>所在地</dt><dd>［ご記入ください］</dd>
      <dt>事業内容</dt><dd>AI活用コンサルティング、AIアプリ開発、ツール導入支援</dd>
    </dl>
  </div>
</section>
```

- [ ] **Step 3: 続けて `<section id="contact" class="section section-soft"></section>` を以下に置き換え**

```html
<section id="contact" class="section section-soft">
  <div class="container">
    <span class="section-eyebrow">CONTACT</span>
    <h2 class="section-title">お問い合わせ</h2>
    <p class="section-lead">AI活用のご相談・お見積もりなど、お気軽にご連絡ください。</p>
    <div class="contact-box">
      <!-- Googleフォーム作成後、下記iframeのsrcを実際の埋め込みURLに差し替える -->
      <div class="contact-placeholder">
        <p>フォームを準備中です。お急ぎの方は下記メールよりご連絡ください。</p>
        <a class="btn btn-primary" href="mailto:contact@example.com">contact@example.com へメールする</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: `css/style.css` に追記**

```css
/* ===== Diagnosis ===== */
.phase-strip{display:flex; flex-wrap:wrap; gap:10px; margin-bottom:32px;}
.phase-chip{
  background:#fff;
  border:1px solid var(--color-border);
  border-radius:100px;
  padding:8px 16px;
  font-size:13px;
  font-weight:600;
}

/* ===== About ===== */
.about-grid{
  display:grid;
  grid-template-columns:140px 1fr;
  row-gap:16px;
  max-width:640px;
}
.about-grid dt{color:var(--color-ink-soft); font-size:14px;}
.about-grid dd{margin:0; font-weight:600;}

/* ===== Contact ===== */
.contact-box{max-width:640px;}
.contact-placeholder{
  background:#fff;
  border:1px dashed var(--color-border);
  border-radius:var(--radius-lg);
  padding:32px;
  text-align:center;
}
.contact-placeholder p{color:var(--color-ink-soft); margin:0 0 20px;}
```

- [ ] **Step 5: ブラウザで確認**

フェーズ0〜5のチップが横並びで表示され、「無料診断をはじめる」ボタンが `shindan/index.html` を指すこと。会社概要の項目が2列レイアウトで表示されること。お問い合わせセクションに「準備中」の文言とmailtoリンクが表示されることを確認する。

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: 無料診断導線・会社概要・お問い合わせセクションを追加"
```

---

### Task 7: JSインタラクション（モバイルナビ・スムーススクロール）

**Files:**
- Modify: `js/main.js`
- Modify: `css/style.css`（`.nav-toggle` 周りは Task 1 で定義済み、追加調整のみ）

**Interfaces:**
- Consumes: `#navToggle`, `#navLinks`（Task 1で定義済みのID）
- Produces: なし（末端のUI挙動）

- [ ] **Step 1: `js/main.js` を以下に置き換え**

```js
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  toggle.addEventListener("click", function () {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
```

- [ ] **Step 2: ブラウザで確認（375px幅）**

`resize_window` でモバイル幅にし、ハンバーガーボタン（☰）をクリックしてナビが開閉すること、ナビ内のリンクをクリックするとメニューが閉じて該当セクションへスムーススクロールすることを確認する。デスクトップ幅でもヘッダーのナビリンクをクリックしてスクロールすることを確認する。コンソールエラーがないことを確認する。

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: モバイルナビとスムーススクロールを実装"
```

---

### Task 8: 診断ページをEn・Baseブランドでラップ

**Files:**
- Create: `shindan/index.html`（`診断ツール/index.html` をコピーして改変）

**Interfaces:**
- Consumes: なし（診断ツールのJSロジックは無改修でそのまま使う）
- Produces: `shindan/index.html`（トップページの `#hero`, `#diagnosis` からリンクされる先）

- [ ] **Step 1: 元ファイルをコピー**

```bash
mkdir -p shindan
cp "C:\Users\admin\Documents\Claude\診断ツール\index.html" "shindan\index.html"
```

- [ ] **Step 2: `shindan/index.html` の `<title>` を変更**

`<title>AI活用診断 | 現在地とロードマップが5分でわかる</title>` を

```html
<title>AI活用診断 | En・Base</title>
```

に変更する。

- [ ] **Step 3: `:root` のカラー変数をEn・Baseブランドに変更**

元の

```css
--primary: #4338ca;
--primary-dark: #312a92;
--primary-soft: #eceafd;
--accent: #0d9488;
--accent-soft: #e3f7f4;
```

を

```css
--primary: #0057FC;
--primary-dark: #0041C4;
--primary-soft: #E8F0FE;
--accent: #B5893F;
--accent-soft: #FBF4E8;
```

に変更する（他の変数はそのまま）。

- [ ] **Step 4: ヘッダーのブランド表示をEn・Baseロゴに変更**

元の（331〜335行目付近）

```html
<div class="top-bar">
  <div class="wrap">
    <div class="brand"><span class="dot"></span>AI活用診断<small>&nbsp;ベータ</small></div>
  </div>
</div>
```

を

```html
<div class="top-bar">
  <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;">
    <a href="../index.html" style="display:flex;align-items:center;gap:10px;">
      <img src="../images/ロゴ.png" alt="En・Base" style="height:26px;">
    </a>
    <div class="brand" style="font-size:13px;"><span class="dot"></span>AI活用診断</div>
  </div>
</div>
```

に変更する。

- [ ] **Step 5: 結果画面のCTAボタンをお問い合わせへのリンクに変更**

元の（459〜464行目付近）

```html
<div class="cta-card">
  <h3>もっと詳しく相談したい方へ</h3>
  <p>診断結果をもとに、優先順位づけと実行計画を一緒に整理する無料相談を行っています。</p>
  <div class="price-row"><span class="price-old">通常 有料</span><span class="price-new">→ 初回無料相談</span></div>
  <button class="btn btn-primary">無料相談を予約する →</button>
</div>
```

の `<button class="btn btn-primary">無料相談を予約する →</button>` を

```html
<a class="btn btn-primary" href="../index.html#contact">無料相談を予約する →</a>
```

に変更する（`.btn`, `.btn-primary` はこのファイル内の既存CSSクラスなので、タグを `button` から `a` に変えても見た目は変わらない）。

- [ ] **Step 6: ブラウザで確認**

`shindan/index.html` を開き、ヘッダーにEn・Baseロゴが表示されクリックでトップページに戻ること、診断を最後まで進めて結果画面が青×ゴールドの配色になっていること、結果画面の「無料相談を予約する」リンクがトップページの `#contact` に遷移することを確認する。診断の質問〜スコアリング〜結果表示という一連の動作が壊れていないこと（既存ロジックは触っていないため回帰しないはずだが、実際に1回通しで診断してみて確認する）。

- [ ] **Step 7: Commit**

```bash
git add shindan/index.html
git commit -m "feat: 診断ツールをEn・Baseブランドでラップして統合"
```

---

### Task 9: レスポンシブ最終確認とメタ情報整備

**Files:**
- Modify: `index.html`（favicon、OGP相当のメタタグ追加）
- Modify: `css/style.css`（最終確認で見つかった崩れの微修正）

**Interfaces:**
- Consumes: 全タスクの成果物
- Produces: なし（品質確認タスク）

- [ ] **Step 1: `index.html` の `<head>` にfaviconとdescription以外のメタタグを追加**

`<link rel="stylesheet" href="css/style.css">` の直後に追加：

```html
<link rel="icon" type="image/png" href="images/ロゴ.png">
```

- [ ] **Step 2: 375px, 768px, 1440pxの3幅で全ページを目視確認**

`resize_window` を375/768/1440で切り替えながら `index.html` と `shindan/index.html` の両方をスクロールし、以下を確認する：
- テキストがコンテナからはみ出していないか
- 画像・ボタンが横に潰れていないか
- ヘッダーのナビ（モバイル幅ではハンバーガー、デスクトップ幅では横並び）が正しく切り替わるか
- 全セクションアンカー（`#services`, `#why`, `#works`, `#diagnosis`, `#about`, `#contact`）へのジャンプが機能するか

崩れが見つかった場合はその場で `css/style.css` を修正する。

- [ ] **Step 3: リンク切れチェック**

`index.html` 内の全 `href` と `shindan/index.html` 内の `../index.html#contact` / `../images/ロゴ.png` のリンク・パスが実在するファイル/アンカーを指しているか確認する。

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "chore: レスポンシブ確認とメタ情報整備"
```

---

## Self-Review Notes

- **Spec coverage:** ヒーロー/事業内容/選ばれる理由/実績/診断導線/会社概要/お問い合わせ/診断ページ統合/レスポンシブ、すべて対応タスクあり。Googleフォーム未確定の点は仕様通りプレースホルダー実装とした。
- **Placeholder scan:** 「［ご記入ください］」「準備中」はプランの手抜きではなく、未確定の実データ（代表者名・住所・Googleフォーム）を待つ実際のサイト上の表示であり、それぞれ具体的な実装コードとして記述済み。
- **Type/名前の一貫性:** CSSクラス名・ID名はTask 1で定義したものをTask 2〜9で一貫して使用（`.section`, `.container`, `.btn-primary`, `#navToggle`, `#navLinks` 等）。
