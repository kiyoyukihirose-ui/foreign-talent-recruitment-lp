const languageButtons = document.querySelectorAll('.language button[data-lang]');
const menuButton = document.querySelector('.menu');
const globalMenu = document.querySelector('.global-menu');

const menuCopy = {
  en: { different: 'What Makes This Role Different', expertise: 'Expertise You Can Bring', work: 'What You Will Work On', support: 'Support for Working in Japan', interview: 'Interview', details: 'Job Details', form: 'Application Form', apply: 'Apply Now' },
  ja: { different: 'この求人の特徴', expertise: '活かせる専門性', work: '仕事内容', support: '日本で働くためのサポート', interview: '外国籍メンバーインタビュー', details: '募集要項', form: '応募フォーム', apply: '応募する' }
};

const setMenuOpen = (isOpen) => {
  const isJapanese = document.documentElement.lang === 'ja';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isJapanese ? (isOpen ? 'メニューを閉じる' : 'メニューを開く') : (isOpen ? 'Close menu' : 'Open menu'));
  globalMenu.classList.toggle('is-open', isOpen);
  globalMenu.setAttribute('aria-hidden', String(!isOpen));
};

const copy = {
  en: {
    title: 'Interview with an<br>International<br>Team Member',
    intro: 'An international team member at ARIA is already working in Business Intelligence / Internal Consulting.<br>We asked him about his Japanese level when he joined ARIA and his experience working here.',
    q1: 'Q1. How much Japanese could you speak when you joined ARIA?',
    a1: 'I think my Japanese was around JLPT N3 level.<br>At that time, I had not taken the JLPT yet.',
    q2: 'Q2. Has Japanese been difficult when working at ARIA?',
    a2: 'Of course. I still have difficulties with Japanese sometimes.<br>But everyone at ARIA is very kind. If I cannot find the right words in Japanese, nobody rushes me or expects me to pretend that I understand. I can ask questions and confirm things as we work, so I feel comfortable working here.',
    q3: 'Q3. How do you work with the CEO and business leaders?',
    a3: 'I can speak directly with the CEO and business leaders about problems I want to improve and ideas I have.<br>Of course, not every idea is accepted. But if there is a clear reason behind it, people listen seriously. If the idea is good, it can become real work.',
    q4: 'Q4. What has been one of your most memorable experiences at ARIA?',
    a4: 'One of my connections overseas led to an opportunity to work with a company outside Japan.<br>Instead of just discussing the idea, we formed a temporary project team and traveled overseas to move the project forward.<br>If your experience, knowledge, or connections can create value for the company, ARIA is willing to use them and take action. That is one of the things I find interesting about working here.',
    back: 'Back to Job Page',
    apply: 'Apply Now',
    details: 'View Job Details'
  },
  ja: {
    title: '外国籍メンバー<br>インタビュー',
    intro: 'ARIAでは、実際に外国籍メンバーがBusiness Intelligence / Internal Consultingの仕事に取り組んでいます。<br>現在働いている彼に、入社時の日本語力や、ARIAで実際に働いて感じていることを聞きました。',
    q1: 'Q1. ARIAに入社したとき、日本語はどのくらい話せましたか？',
    a1: 'JLPTでいうと、たぶんN3くらいのレベルだったと思います。当時はまだJLPTを受けていませんでした。',
    q2: 'Q2. 日本語で仕事をするうえで、困ることはありませんでしたか？',
    a2: 'もちろん、日本語で困ることは今でもあります。<br>でも、ARIAのメンバーはみんなとても親切です。<br>日本語がうまく出てこないときも、急かされたり、分かったふりをする必要はありません。確認しながらコミュニケーションできるので、安心して仕事を進められています。',
    q3: 'Q3. 社長や事業責任者とは、どのように仕事を進めていますか？',
    a3: '社長や事業責任者と直接話しながら、改善したいことや自分の考えを伝えることができます。<br>自分の意見だからといって特別扱いされるわけではありませんが、理由があればきちんと聞いてもらえますし、良いと思われたものは実際の仕事として動いていきます。',
    q4: 'Q4. ARIAで働いていて、特に印象に残っていることはありますか？',
    a4: '私が以前から持っていた海外のつながりをきっかけに、海外の会社へ協力を依頼することになったことがあります。<br>話だけで終わるのではなく、実際に必要なメンバーで臨時のチームをつくり、海外まで出張して進めることになりました。<br>自分が持っている経験や人とのつながりも、会社にとって意味があるなら本当に使ってくれる。そこはARIAで働いていて面白いところだと思います。',
    back: 'トップページに戻る',
    apply: '応募する',
    details: '募集要項を見る'
  }
};

const setLanguage = (language) => {
  const selected = copy[language] || copy.en;
  document.documentElement.lang = language;
  document.body.classList.toggle('lang-ja', language === 'ja');
  document.querySelectorAll('[data-copy]').forEach((element) => {
    element.innerHTML = selected[element.dataset.copy];
  });
  languageButtons.forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-menu-copy]').forEach((element) => {
    element.textContent = menuCopy[language][element.dataset.menuCopy];
  });
  globalMenu.setAttribute('aria-label', language === 'ja' ? 'ページ内ナビゲーション' : 'Page navigation');
  setMenuOpen(false);
  document.title = language === 'ja' ? 'ARIA | 外国籍メンバーインタビュー' : 'ARIA | Interview with an International Team Member';
  try { localStorage.setItem('aria-language', language); } catch (error) {}
};

languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
globalMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

let initialLanguage = 'en';
try { initialLanguage = localStorage.getItem('aria-language') || 'en'; } catch (error) {}
setLanguage(initialLanguage);
