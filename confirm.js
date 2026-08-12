const application = (() => {
  try { return JSON.parse(sessionStorage.getItem('aria-application') || '{}'); } catch (error) { return {}; }
})();

const copy = {
  en: {
    eyebrow:'APPLICATION', title:'Confirm Your<br>Application', lead:'Please review the information below before submitting your application.', edit:'Edit', submit:'Submit Application', note:'Your application is not submitted until you select “Submit Application.”',
    labels:{fullName:'Full Name',email:'Email Address',phone:'Phone Number',location:'Current Location',residence:'Current Status of Residence',japaneseLevel:'Japanese Level'},
    residence:{engineer:'Engineer / Specialist in Humanities / International Services','highly-skilled':'Highly Skilled Professional',student:'Student',dependent:'Dependent','spouse-japanese':'Spouse or Child of Japanese National','spouse-resident':'Spouse or Child of Permanent Resident',other:'Other'},
    japaneseLevel:{n1:'Approximately JLPT N1',n2:'Approximately JLPT N2',n3:'Approximately JLPT N3',n4:'Approximately JLPT N4',n5:'Approximately JLPT N5',unknown:'Not sure'}
  },
  ja: {
    eyebrow:'APPLICATION', title:'応募内容の<br>確認', lead:'入力内容をご確認のうえ、応募を確定してください。', edit:'修正する', submit:'この内容で応募する', note:'「この内容で応募する」を押すまで応募は完了しません。',
    labels:{fullName:'氏名',email:'メールアドレス',phone:'電話番号',location:'現在の居住地',residence:'現在の在留資格',japaneseLevel:'日本語レベル'},
    residence:{engineer:'技術・人文知識・国際業務','highly-skilled':'高度専門職',student:'留学',dependent:'家族滞在','spouse-japanese':'日本人の配偶者等','spouse-resident':'永住者の配偶者等',other:'その他'},
    japaneseLevel:{n1:'JLPT N1相当',n2:'JLPT N2相当',n3:'JLPT N3相当',n4:'JLPT N4相当',n5:'JLPT N5相当',unknown:'わからない'}
  }
};

const languageButtons = document.querySelectorAll('.language button[data-lang]');
const render = (language) => {
  const text = copy[language] || copy.en;
  document.documentElement.lang = language;
  document.body.classList.toggle('lang-ja', language === 'ja');
  document.querySelectorAll('[data-copy]').forEach((node) => { node.innerHTML = text[node.dataset.copy]; });
  document.querySelectorAll('[data-label]').forEach((node) => { node.textContent = text.labels[node.dataset.label]; });
  document.querySelectorAll('[data-value]').forEach((node) => {
    const key = node.dataset.value;
    let value = application[key] || '—';
    if (key === 'residence') value = application.residence === 'other' ? (application.residenceOther || text.residence.other) : (text.residence[value] || value);
    if (key === 'japaneseLevel') value = text.japaneseLevel[value] || value;
    node.textContent = value;
  });
  languageButtons.forEach((button) => { const active=button.dataset.lang===language; button.classList.toggle('is-active',active); button.setAttribute('aria-pressed',String(active)); });
  document.title = language === 'ja' ? 'ARIA | 応募内容の確認' : 'ARIA | Confirm Application';
  try { localStorage.setItem('aria-language', language); } catch (error) {}
};

languageButtons.forEach((button) => button.addEventListener('click', () => render(button.dataset.lang)));
document.querySelector('.flow-button-primary').addEventListener('click', () => { window.location.href='complete.html'; });
let language='en'; try { language=localStorage.getItem('aria-language') || application.language || 'en'; } catch (error) {}
render(language);
