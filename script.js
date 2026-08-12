const menu = document.querySelector('.menu');
const globalMenu = document.querySelector('.global-menu');
const menuBackdrop = document.querySelector('.menu-backdrop');
const floatingCta = document.querySelector('.floating-cta');
const backToTop = document.querySelector('.to-top');
floatingCta.classList.add('is-hidden');

backToTop.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#page-top');
});

const setMenuOpen = (isOpen) => {
  const isJapanese = document.documentElement.lang === 'ja';
  menu.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-label', isJapanese ? (isOpen ? 'メニューを閉じる' : 'メニューを開く') : (isOpen ? 'Close menu' : 'Open menu'));
  globalMenu.classList.toggle('is-open', isOpen);
  globalMenu.setAttribute('aria-hidden', String(!isOpen));
  menuBackdrop.classList.toggle('is-open', isOpen);
};

menu.addEventListener('click', () => setMenuOpen(menu.getAttribute('aria-expanded') !== 'true'));
globalMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
menuBackdrop.addEventListener('click', () => setMenuOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

const updateFloatingCta = () => {
  const buyback = document.querySelector('.work-card.buyback');
  const form = document.querySelector('#form');
  const buybackTop = buyback.getBoundingClientRect().top;
  const formTop = form.getBoundingClientRect().top;
  const hasReachedBuyback = buybackTop < window.innerHeight;
  const hasReachedForm = formTop < window.innerHeight * 0.72;

  floatingCta.classList.toggle('is-hidden', !hasReachedBuyback || hasReachedForm);
};

window.addEventListener('scroll', updateFloatingCta, { passive: true });
window.addEventListener('resize', updateFloatingCta);
updateFloatingCta();

const applicationForm = document.querySelector('.application-form');
const formSection = document.querySelector('.form-section');
const residenceOtherField = document.querySelector('.residence-other-field');
const residenceOtherInput = document.querySelector('#residence-other');

applicationForm.addEventListener('change', (event) => {
  if (event.target.name !== 'residence') return;

  const showOtherField = event.target.value === 'other';
  residenceOtherField.hidden = !showOtherField;
  residenceOtherInput.disabled = !showOtherField;
  residenceOtherInput.required = showOtherField;
  applicationForm.classList.toggle('has-other', showOtherField);
  formSection.classList.toggle('has-other', showOtherField);

  if (showOtherField) {
    residenceOtherInput.focus();
  } else {
    residenceOtherInput.value = '';
  }

  updateFloatingCta();
});

residenceOtherInput.disabled = true;

const savedApplication = (() => {
  try {
    return JSON.parse(sessionStorage.getItem('aria-application') || 'null');
  } catch (error) {
    return null;
  }
})();

if (savedApplication) {
  Object.entries(savedApplication).forEach(([name, value]) => {
    if (name === 'language') return;
    const field = applicationForm.elements.namedItem(name);
    if (!field) return;
    field.value = value;
  });

  if (savedApplication.residence === 'other') {
    residenceOtherField.hidden = false;
    residenceOtherInput.disabled = false;
    residenceOtherInput.required = true;
    applicationForm.classList.add('has-other');
    formSection.classList.add('has-other');
  }
}

applicationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  residenceOtherInput.required = applicationForm.elements.residence.value === 'other';
  if (!applicationForm.reportValidity()) return;

  const application = Object.fromEntries(new FormData(applicationForm).entries());
  try {
    application.language = localStorage.getItem('aria-language') || 'en';
    sessionStorage.setItem('aria-application', JSON.stringify(application));
  } catch (error) {
    application.language = 'en';
  }
  window.location.href = 'confirm.html';
});

const languageButtons = document.querySelectorAll('.language button[data-lang]');

const translations = [
  ['.hero-kicker', 'JLPT資格証明不要｜外国籍メンバー在籍'],
  ['.hero-role span', 'Business Intelligence /<br>Internal Consulting'],
  ['.hero h1', 'Your insight<br>can move<br>the business.'],
  ['.hero-copy', 'ARIAが運営する複数事業を対象に、データと事業理解をもとに、社長や事業責任者とともに事業の意思決定を形づくるポジションです。'],
  ['.hero-buttons .button-primary', '応募する'],
  ['.hero-buttons .button-light', '募集要項を見る'],

  ['.different > h2', 'この求人の特徴'],
  ['.difference.d1 h3', '外国人向けの業務に<br>限定されません'],
  ['.difference.d1 p', '翻訳、通訳、海外対応など、外国籍であることを前提とした仕事ではありません。<br>ARIAが運営する事業の顧客獲得、収益性、業務運営など、事業そのものに関係するテーマを扱います。'],
  ['.difference.d2 h3', '日本での職歴がなくても、<br>これまでの専門性を評価します'],
  ['.difference.d2 p', '日本での職歴だけでなく、海外での実務経験、大学・大学院での学習や研究、個人での開発やプロジェクトも選考対象です。'],
  ['.difference.d3 h3', '自分の仕事が、事業を動かした<br>実感を得られます'],
  ['.difference.d3 p', '提案が実際の施策として動き、その結果が数値や現場の変化として返ってくるため、自分の仕事が事業に与えたインパクトを実感できます。'],
  ['.cta-band .button-primary', '応募する'],
  ['.cta-band .button-light', '募集要項を見る'],

  ['.expertise > h2', 'このポジションに<br>活かせる専門性'],
  ['.expertise .lead', 'すべての領域に精通している必要はありません。いずれかの経験や専門性を起点に、事業課題に取り組みます。'],
  ['.expertise-data span', 'データ分析・統計'],
  ['.expertise-marketing span', 'マーケティング<br>顧客獲得'],
  ['.expertise-planning span', '事業企画・業務改善'],
  ['.expertise-ai span', 'AI・自動化・<br>データ活用'],

  ['.work > h2', '業務内容'],
  ['.work-intro', 'ARIAは、弁護士関連事業、買取事業、Webマーケティング事業など、領域の異なる複数の事業を運営しています。<br><br>以下は、実際にARIAで扱ってきたテーマの一例です。'],
  ['.work-card.legal h3', '弁護士関連事業'],
  ['.work-card.legal li:nth-child(1)', 'CRMデータを分析し、案件ごとの収益性を評価'],
  ['.work-card.legal li:nth-child(2)', '流入から契約・入金までのファネルを分析し、顧客対応・追客方法を改善'],
  ['.work-card.legal li:nth-child(3)', '相談・契約・入金まで追跡し、集客チャネルの質を評価'],
  ['.work-card.legal li:nth-child(4)', 'CRM・AI・自動化ツールを活用し、案件管理や進捗管理の仕組みを設計'],
  ['.work-card.buyback h3', '買取事業'],
  ['.work-card.buyback li:nth-child(1)', '利用回数や取引履歴から、LTVの高い顧客・利用パターンを分析'],
  ['.work-card.buyback li:nth-child(2)', '継続利用やLTVまで追跡し、集客チャネルごとの顧客価値を評価'],
  ['.work-card.buyback li:nth-child(3)', '利用履歴をもとに、LINE販促の対象・オファー・配信タイミングを設計'],
  ['.work-card.buyback li:nth-child(4)', '継続利用を促すボーナス施策を設計し、効果を検証'],
  ['.work-outro', '入社後は、現在在籍する外国籍メンバーとチームを組み、各事業の数字や現場から課題を見つけ、分析・改善に取り組みます。<br><br>まずは既存事業を担当し、実績に応じて新規事業の分析や仮説検討にも関わります。'],

  ['.support > h2', '日本で働くための<br>サポート'],
  ['.support h3.japanese', '日本語について'],
  ['.japanese-copy', '<p>JLPT N4程度の日本語力を歓迎していますが、入社時点で高い日本語力を求めているわけではありません。</p><p>入社後も日本語を学び続けられるよう、必要に応じて学習をサポートします。</p>'],
  ['.support h3.residence', '在留資格について'],
  ['.residence-copy', '<p>現在お持ちの在留資格でこの仕事に従事できる場合は、在留資格を変更する必要はありません。</p><p>在留資格の変更が必要な場合は、「技術・人文知識・国際業務」への変更を前提に、必要な手続きをサポートします。</p>'],
  ['.support .note', '※在留資格の許可は、学歴・職歴や担当業務などをもとに出入国在留管理庁が審査するため、取得を保証するものではありません。'],

  ['.interview > h2', '外国籍メンバー<br>インタビュー'],
  ['.interview > p', 'ARIAでは、実際に外国籍メンバーがBusiness Intelligence / Internal Consultingの仕事に取り組んでいます。<br>現在働いている彼に、入社時の日本語力や、ARIAで実際に働いて感じていることを聞きました。'],
  ['.interview-link', 'インタビューを読む→'],

  ['.job-details > h2', '募集要項'],
  ['.detail-list > .detail:nth-of-type(1) h3', 'ポジション'],
  ['.detail-list > .detail:nth-of-type(1) p', 'BI／インターナルコンサルタント'],
  ['.detail-list > .detail:nth-of-type(2) h3', '契約形態'],
  ['.detail-list > .detail:nth-of-type(2) p', '業務委託'],
  ['.detail-list > .detail:nth-of-type(3) h3', '必須スキル・経験'],
  ['.detail-list > .detail:nth-of-type(3) p', '何らかのデータ分析経験<br>使用するツールやプログラミング言語は問いません。Excel・Google スプレッドシート・BIツール・SQL・Pythonなど、分析手段は不問です。'],
  ['.detail-list > .detail:nth-of-type(4) h3', '求めるスタンス'],
  ['.detail-list > .detail:nth-of-type(4) p', '<span class="stance-part stance-part-first">・与えられた仕事をこなすだけでなく、自分なりの問題意識や「こうしたい」という提案を持ち、周囲との議論に持ち込める方</span><span class="stance-part">・感覚や慣習だけで判断せず、数字・事実・仮説をもとに考え、必要に応じて自分の考えを検証できる方</span><span class="stance-part">・データ分析、AI、テクノロジーなどを使うこと自体ではなく、それを売上・利益・顧客体験・生産性など、事業の成果につなげることに関心がある方</span><span class="stance-part">・自分の専門領域だけに閉じず、担当する事業そのものに関心を持ち、より良くするために必要なことを考えられる方</span>'],
  ['.detail-list > .detail:nth-of-type(5) h3', '歓迎する経験・スキル'],
  ['.detail-list > .detail:nth-of-type(5) p', 'マーケティング、事業企画・業務改善、AI・自動化、Python・SQL・BIツールなどの経験・スキルがある方は歓迎します。'],
  ['.detail-list > .detail:nth-of-type(6) h3', '勤務地'],
  ['.detail-list > .detail:nth-of-type(6) p', '東京都渋谷区代々木2丁目20-19<br>新宿東洋ビル'],
  ['.detail-list > .detail:nth-of-type(7) h3', '稼働'],
  ['.detail-list > .detail:nth-of-type(7) p', '月20日程度<br>9:00〜19:00（休憩1時間）'],
  ['.detail-list > .detail:nth-of-type(8) h3', '報酬'],
  ['.detail-list > .detail:nth-of-type(8) p', '経験・スキル等を考慮して決定'],
  ['.detail-list > .detail:nth-of-type(9) h3', '選考フロー'],
  ['.detail-list > .detail:nth-of-type(9) p', '<span class="process-step"><b>❶簡単応募</b><br>応募フォームから、基本情報とこれまでの経験を入力してご応募ください。<br>応募時点でResume / CVを用意する必要はありません。</span><span class="process-step"><b>❷書類選考</b><br>応募フォームの内容をもとに書類選考を行います。<br>通過された方のみに、Resume / CVの提出をご案内します。</span><span class="process-step"><b>❸面接</b><br>書類選考を通過した方には、面接をご案内します。<br>面接は複数回を予定しています。選考状況に応じて回数が異なる場合があります。</span><span class="process-step"><b>❹契約・入社</b><br>面接を通過した方には、条件等をご案内します。<br>双方で条件を確認したうえで、契約・入社となります。</span>'],

  ['.form-section > h2', '応募フォーム'],
  ['.form-intro', '<p>簡単な情報入力だけで応募できます。</p><p><span class="form-intro-resume">Resume / CVは応募後にメールで</span><span>ご提出いただきます。</span></p>'],
  ['label[for="full-name"]', '氏名'],
  ['label[for="email"]', 'メールアドレス'],
  ['label[for="phone"]', '電話番号'],
  ['label[for="location"]', '現在の居住地'],
  ['.residence-options legend', '現在の在留資格'],
  ['.residence-options label:nth-of-type(1) span', '技術・人文知識・国際業務'],
  ['.residence-options label:nth-of-type(2) span', '高度専門職'],
  ['.residence-options label:nth-of-type(3) span', '留学'],
  ['.residence-options label:nth-of-type(4) span', '家族滞在'],
  ['.residence-options label:nth-of-type(5) span', '日本人の配偶者等'],
  ['.residence-options label:nth-of-type(6) span', 'その他'],
  ['.residence-options label:nth-of-type(7) span', 'Other'],
  ['label[for="residence-other"]', '在留資格を入力してください'],
  ['.japanese-options legend', 'Japanese Level'],
  ['.japanese-options label:nth-of-type(1) span', 'JLPT N1相当'],
  ['.japanese-options label:nth-of-type(2) span', 'JLPT N2相当'],
  ['.japanese-options label:nth-of-type(3) span', 'JLPT N3相当'],
  ['.japanese-options label:nth-of-type(4) span', 'JLPT N4相当'],
  ['.japanese-options label:nth-of-type(5) span', 'JLPT N5相当'],
  ['.japanese-options label:nth-of-type(6) span', 'わからない'],
  ['.japanese-options small', '※JLPT資格の取得・証明は必要ありません。'],
  ['.submit-application', '送信する <img src="assets/submit-arrow.svg" alt="">'],
  ['.form-note', '送信後、入力いただいたメールアドレス宛にResume / CVの提出方法をご案内します。'],
  ['.floating-cta .button-primary', '応募する'],
  ['.floating-cta .button-light', '募集要項を見る'],
  ['.global-menu-links a:nth-child(1)', 'この求人の特徴'],
  ['.global-menu-links a:nth-child(2)', '活かせる専門性'],
  ['.global-menu-links a:nth-child(3)', '仕事内容'],
  ['.global-menu-links a:nth-child(4)', '日本で働くためのサポート'],
  ['.global-menu-links a:nth-child(5)', '外国籍メンバーインタビュー'],
  ['.global-menu-apply', '応募する'],
  ['.global-menu-details', '募集要項を見る']
];

translations.forEach(([selector]) => {
  const element = document.querySelector(selector);
  if (element) element.dataset.english = element.innerHTML;
});

const inputTranslations = [
  ['#full-name', 'Yamada Aria'],
  ['#location', 'Tokyo, Japan']
];

inputTranslations.forEach(([selector]) => {
  const input = document.querySelector(selector);
  input.dataset.englishPlaceholder = input.placeholder;
});

const setLanguage = (language) => {
  const isJapanese = language === 'ja';

  translations.forEach(([selector, japanese]) => {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = isJapanese ? japanese : element.dataset.english;
  });

  inputTranslations.forEach(([selector, japanesePlaceholder]) => {
    const input = document.querySelector(selector);
    input.placeholder = isJapanese ? japanesePlaceholder : input.dataset.englishPlaceholder;
  });

  document.documentElement.lang = isJapanese ? 'ja' : 'en';
  document.body.classList.toggle('lang-ja', isJapanese);
  globalMenu.setAttribute('aria-label', isJapanese ? 'ページ内ナビゲーション' : 'Page navigation');
  menu.setAttribute('aria-label', isJapanese ? (menu.getAttribute('aria-expanded') === 'true' ? 'メニューを閉じる' : 'メニューを開く') : (menu.getAttribute('aria-expanded') === 'true' ? 'Close menu' : 'Open menu'));
  document.title = isJapanese ? 'ARIA｜BI／インターナルコンサルタント採用' : 'ARIA | Business Intelligence / Internal Consulting';

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  try {
    localStorage.setItem('aria-language', language);
  } catch (error) {
    // The language switch still works when storage is unavailable.
  }
};

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

let initialLanguage = 'en';
try {
  initialLanguage = localStorage.getItem('aria-language') || 'en';
} catch (error) {
  initialLanguage = 'en';
}
setLanguage(initialLanguage);
