import { SITE_URL } from './site-config.mjs';

const location = {
  region: '北海道',
  locality: '旭川市',
  street: '3条通13丁目',
  building: 'ヤナギヤビル1F',
};

export const site = {
  url: SITE_URL,
  name: 'プリスクール・学童 にじいろ',
  title: '旭川のプリスクール・英語学童｜プリスクール・学童 にじいろ',
  description: '北海道旭川市3条通の「プリスクール・学童 にじいろ」。遊びや生活の中で自然に英語に触れ、一人ひとりの「やってみたい」を育む対面の教室です。体験入園・体験学童は予約制で随時受付。お問い合わせは0166-67-2500。',
  phone: '0166-67-2500',
  phoneHref: 'tel:0166672500',
  location,
  address: `${location.region}${location.locality}${location.street}`,
  building: location.building,
  hours: '9:00〜18:00',
  closed: '土曜日・日曜日',
  instagram: 'https://www.instagram.com/hitkinder/',
  map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${location.region}${location.locality}${location.street} ${location.building}`),
};

export const navigation = [
  { href: '#about', label: 'にじいろについて', en: 'About' },
  { href: '#preschool', label: 'プリスクール', en: 'Preschool' },
  { href: '#afterschool', label: '学童', en: 'After school' },
  { href: '#days', label: 'にじいろの日々', en: 'Our days' },
  { href: '#team', label: 'スタッフ', en: 'Our team' },
  { href: '#visit', label: '体験・アクセス', en: 'Visit us' },
];

export const preschoolGrowth = [
  { first: '言葉がふえる。', next: '話すのが楽しくなる。', detail: '表現や語彙が増えることで、人と話す楽しさを知る。' },
  { first: '気持ちが伝わる。', next: '自信がうまれる。', detail: '英語で伝わった喜びを、小さな「できた！」に。' },
  { first: '相手の反応を待つ。', next: '思いやりが育つ。', detail: 'やりとりの中で、相手の気持ちにも目を向ける。' },
  { first: '初めての言葉に出会う。', next: '興味がひろがる。', detail: '知らなかった言葉が、新しい世界への入口に。' },
];

export const afterschoolGrowth = [
  { first: '英語に慣れる', next: '「むずかしい」が、少しずつ身近に。' },
  { first: '英語で伝えようとする', next: '自分から一歩、踏み出すきっかけに。' },
  { first: 'いろいろな言葉を聞く', next: '新しい言葉や文化への関心に。' },
  { first: '英語って楽しいと感じる', next: 'これからの学びや、未来の選択肢に。' },
];

export const teachers = [
  { name: 'マミ先生', en: 'Mami', role: '日常の中に、自然な英語を。', description: '米国アラバマ大学芸術学科を卒業。子どもたちの日常生活の中に自然な英語を取り入れ、楽しいコミュニケーションをつくります。' },
  { name: 'エミリー先生', en: 'Emilie', role: '文化を越えて、気持ちをつなぐ。', description: 'フランス出身。アメリカでの生活に加え、外国人として日本で子育てをした経験も。異なる文化や環境での経験を、子どもたちとの関わりに活かしています。' },
  { name: 'マナ先生', en: 'Mana', role: '「作ってみたい」を、かたちに。', description: '東京で長年、保育施設に勤務。英語と製作活動のスペシャリストとして、一人ひとりの創造力と「やってみたい」という気持ちを引き出します。' },
];
