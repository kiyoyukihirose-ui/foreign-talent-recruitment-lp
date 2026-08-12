const copy = {
  en:{eyebrow:'THANK YOU',title:'Application<br>Complete',lead:'Thank you for applying to ARIA.<br>Your application has been received.',nextTitle:'What happens next',nextText:'We will review your application details. Candidates who pass the initial screening will receive instructions for submitting a Resume / CV by email.',mailNote:'Please check your inbox and spam folder.',back:'Back to Top'},
  ja:{eyebrow:'THANK YOU',title:'応募が<br>完了しました',lead:'ARIAへご応募いただき、ありがとうございます。<br>応募内容を受け付けました。',nextTitle:'今後の流れ',nextText:'応募内容をもとに書類選考を行います。通過された方には、Resume / CVの提出方法をメールでご案内します。',mailNote:'受信トレイと迷惑メールフォルダをご確認ください。',back:'トップページへ戻る'}
};
const languageButtons=document.querySelectorAll('.language button[data-lang]');
const render=(language)=>{const text=copy[language]||copy.en;document.documentElement.lang=language;document.body.classList.toggle('lang-ja',language==='ja');document.querySelectorAll('[data-copy]').forEach((node)=>{node.innerHTML=text[node.dataset.copy];});languageButtons.forEach((button)=>{const active=button.dataset.lang===language;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});document.title=language==='ja'?'ARIA | 応募完了':'ARIA | Application Complete';try{localStorage.setItem('aria-language',language);}catch(error){}};
languageButtons.forEach((button)=>button.addEventListener('click',()=>render(button.dataset.lang)));
let language='en';try{language=localStorage.getItem('aria-language')||'en';}catch(error){}render(language);
try{sessionStorage.removeItem('aria-application');}catch(error){}
