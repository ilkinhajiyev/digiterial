// Xidmətlər: menyu, ana səhifə siyahısı və /xidmetler/[slug] səhifələri bu məlumatdan qurulur.
import type { IconName } from '@/components/dg/icons';

export type Faq = { q: string; a: string };
export type ServiceGroup = 'site' | 'ads' | 'email';

export type Service = {
  slug: string;
  icon: IconName;
  group: ServiceGroup;
  isNew?: boolean;
  title: string;         // menyu və kart başlığı
  menuDesc: string;      // mega menyuda qısa təsvir
  homeDesc: string;      // ana səhifədə təsvir
  chips: string[];
  metaTitle: string;
  metaDesc: string;
  h1: [string, string, string]; // [əvvəl, kursiv vurğu, sonra]
  lead: string;
  cta: string;
  about: string;
  includes: { icon: IconName; h: string; p: string }[];
  deliverables: string[];
  steps: [string, string][];
  faq: Faq[];
  ctaH: string;
  ctaP: string;
};

export const GROUPS: { key: ServiceGroup; title: string }[] = [
  { key: 'site', title: 'Sayt və axtarış' },
  { key: 'ads', title: 'Reklam və kreativ' },
  { key: 'email', title: 'Email və avtomatlaşdırma' },
];

const GENERIC_STEPS: [string, string][] = [
  ['Təhlil', 'Mövcud vəziyyəti, rəqibləri və auditoriyanı təhlil edirik.'],
  ['Strategiya', 'Hədəf, KPI və mərhələli plan hazırlayırıq.'],
  ['İcra', 'Dizayn, kod və ya kampaniyanı qısa sprintlərlə qururuq.'],
  ['Optimizasiya', 'Nəticələri ölçür, test edir və davamlı yaxşılaşdırırıq.'],
];

export const FAQ = {
  time: { q: 'Veb sayt hazırlanması nə qədər vaxt aparır?', a: 'Landing səhifə adətən 2–3 həftə, korporativ sayt 4–8 həftə, e-ticarət saytı isə 6–12 həftə çəkir. Dəqiq müddəti ilk görüşdən sonra yazılı planla təqdim edirik.' },
  price: { q: 'Qiymət necə müəyyən edilir?', a: 'Qiymət layihənin həcminə, funksiyalarına və müddətinə görə hesablanır. Təklifdə bütün mərhələlər və xərclər ayrıca göstərilir, gizli ödəniş yoxdur.' },
  one: { q: 'Yalnız bir xidmət sifariş edə bilərəm?', a: 'Əlbəttə. Yalnız SEO, yalnız Google reklamı və ya yalnız dizayn üzrə də işləyirik, mövcud komandanızla birgə də çalışa bilərik.' },
  seo: { q: 'SEO nəticələri nə vaxt görünür?', a: 'İlk texniki irəliləyiş adətən 4–8 həftədə, davamlı üzvi trafik artımı isə 3–6 ay ərzində görünür. Hər ay mövqe və trafik hesabatı göndəririk.' },
  support: { q: 'Sayt yayımlandıqdan sonra dəstək verirsiniz?', a: 'Bəli. Texniki xidmət, kontent yeniləmələri, təhlükəsizlik və performans izləməsi üçün aylıq dəstək paketlərimiz var.' },
} satisfies Record<string, Faq>;

export const services: Service[] = [
  {
    slug: 'veb-saytlar', icon: 'web', group: 'site',
    title: 'Veb sayt hazırlanması', menuDesc: 'Korporativ sayt, landing, e-ticarət',
    homeDesc: 'Sürətli, mobil uyğun və satış yönümlü korporativ saytlar, landing səhifələr və onlayn mağazalar.',
    chips: ['Korporativ', 'Landing', 'E-ticarət'],
    metaTitle: 'Veb sayt hazırlanması Bakıda — korporativ və e-ticarət',
    metaDesc: 'Sürətli, mobil uyğun və satış yönümlü korporativ saytlar, landing səhifələr və onlayn mağazalar. 90+ PageSpeed hədəfi.',
    h1: ['Sürətli, ', 'satan', ' saytlar.'],
    lead: 'Brendinizi düzgün təqdim edən, Google-da tapılan və ziyarətçini müştəriyə çevirən saytlar hazırlayırıq: landing səhifədən korporativ sayta və e-ticarətə qədər.',
    cta: 'Sayt layihəsini müzakirə edək',
    about: 'Hər sayt mobil-əvvəl dizayn, Core Web Vitals standartları, texniki SEO təməli və rahat idarəetmə paneli ilə təhvil verilir.',
    includes: [
      { icon: 'web', h: 'Korporativ sayt', p: 'Çoxdilli, sürətli və asan idarə olunan.' },
      { icon: 'cart', h: 'E-ticarət', p: 'Məhsul kataloqu, səbət və onlayn ödəniş.' },
      { icon: 'target', h: 'Landing səhifə', p: 'Reklam kampaniyaları üçün yüksək konversiya.' },
      { icon: 'bolt', h: 'Performans', p: '90+ PageSpeed hədəfi və texniki SEO.' },
    ],
    deliverables: ['UX araşdırma və prototip', 'UI dizayn (desktop və mobil)', 'Responsiv kodlaşdırma', 'CMS və onlayn ödəniş inteqrasiyası', 'GA4, GTM və texniki SEO quraşdırması'],
    steps: GENERIC_STEPS,
    faq: [FAQ.time, FAQ.price, FAQ.support, FAQ.one],
    ctaH: 'Saytınız satmağa başlasın.',
    ctaP: 'Hədəflərinizi danışaq, mövcud vəziyyəti dəyərləndirib sizə uyğun həll təklif edək.',
  },
  {
    slug: 'seo', icon: 'seo', group: 'site',
    title: 'SEO xidməti', menuDesc: 'Google-da yuxarı mövqelər',
    homeDesc: 'Google-da yuxarı mövqelər və davamlı üzvi trafik: texniki audit, açar söz strategiyası və kontent.',
    chips: ['Texniki audit', 'Lokal SEO', 'Kontent'],
    metaTitle: 'SEO xidməti Bakıda — Google-da yuxarı mövqelər',
    metaDesc: 'Texniki SEO auditi, açar söz strategiyası, on-page optimizasiya və lokal SEO. Aylıq şəffaf mövqe və trafik hesabatı.',
    h1: ['Google-da ', 'birinci', ' səhifə.'],
    lead: 'Saytınızın Google axtarışında görünməsini ölçülə bilən şəkildə artırırıq: texniki SEO auditi, açar söz araşdırması, on-page optimizasiya və keyfiyyətli kontent.',
    cta: 'SEO auditi istəyirəm',
    about: 'Search Console və GA4 məlumatları əsasında hər ay mövqe, trafik və müraciət hesabatı təqdim edirik.',
    includes: [
      { icon: 'ai', h: 'Texniki SEO', p: 'İndeksləmə, sürət, struktur və schema.' },
      { icon: 'seo', h: 'Açar söz strategiyası', p: 'Axtarış niyyətinə əsaslanan semantik xəritə.' },
      { icon: 'web', h: 'On-page optimizasiya', p: 'Başlıqlar, meta, kontent və daxili linklər.' },
      { icon: 'pin', h: 'Lokal SEO', p: 'Google Business Profile və xəritədə görünmə.' },
    ],
    deliverables: ['Texniki SEO auditi', 'Açar söz və semantik xəritə', 'Kontent planı və mətnlər', 'Link building strategiyası', 'Aylıq mövqe və trafik hesabatı'],
    steps: GENERIC_STEPS,
    faq: [FAQ.seo, FAQ.price, FAQ.one],
    ctaH: 'Müştəriləriniz sizi Google-da tapsın.',
    ctaP: 'Saytınızın hazırkı vəziyyətinə birlikdə baxaq və ən sürətli nəticə verəcək addımları müəyyənləşdirək.',
  },
  {
    slug: 'reklam', icon: 'ads', group: 'ads',
    title: 'Google və Meta reklamı', menuDesc: 'Hər manatı izlənən kampaniyalar',
    homeDesc: 'Hər manatı izlənən kampaniyalar: Google Ads, Instagram, Facebook və TikTok reklamı.',
    chips: ['Google Ads', 'Meta Ads', 'TikTok'],
    metaTitle: 'Google və Meta reklamı — performans reklam agentliyi Bakıda',
    metaDesc: 'Google Ads, Instagram, Facebook və TikTok kampaniyaları: auditoriya, kreativ, A/B test və ROAS əsaslı optimizasiya.',
    h1: ['Hər manat ', 'izlənir.', ''],
    lead: 'Büdcənizi ən çox müraciət və satış gətirən kanallara yönəldirik: auditoriya seçimi, kreativlər, A/B testlər və davamlı optimizasiya.',
    cta: 'Reklam strategiyası istəyirəm',
    about: 'Konversiya izləməsini düzgün qururuq: hər manatın hansı nəticəni gətirdiyini şəffaf hesabatda görürsünüz.',
    includes: [
      { icon: 'seo', h: 'Google Ads', p: 'Axtarış, Performance Max və remarketinq.' },
      { icon: 'ads', h: 'Meta Ads', p: 'Instagram və Facebook kampaniyaları.' },
      { icon: 'brand', h: 'Kreativlər', p: 'Reels, statik və UGC reklam materialları.' },
      { icon: 'chart', h: 'Optimizasiya', p: 'A/B test, ROAS və CPA nəzarəti.' },
    ],
    deliverables: ['Kampaniya strukturu və quraşdırma', 'Auditoriya və hədəfləmə strategiyası', 'Reklam kreativləri və mətnləri', 'Konversiya izləməsi (GA4, Pixel)', 'Həftəlik optimizasiya və hesabat'],
    steps: GENERIC_STEPS,
    faq: [FAQ.price, FAQ.one, { q: 'Minimum reklam büdcəsi nə qədər olmalıdır?', a: 'Büdcə sahənizdən, rəqabətdən və hədəfdən asılıdır. İlk görüşdə hədəfə çatmaq üçün real büdcəni hesablayır və yazılı təqdim edirik.' }],
    ctaH: 'Reklam büdcəniz nəticə gətirsin.',
    ctaP: 'Mövcud kampaniyalarınıza baxaq və hər manatın daha çox müraciət gətirməsi üçün plan quraq.',
  },
  {
    slug: 'brendinq', icon: 'brand', group: 'ads',
    title: 'Brendinq və dizayn', menuDesc: 'Loqo, vizual kimlik, UI/UX',
    homeDesc: 'Loqo, vizual kimlik və UI/UX dizayn: tanınan və etibar yaradan brendlər.',
    chips: ['Loqo', 'Vizual kimlik', 'UI/UX'],
    metaTitle: 'Brendinq və dizayn — loqo, brend kitabı, UI/UX',
    metaDesc: 'Loqo, rəng palitrası, tipoqrafiya, brend kitabı və rəqəmsal məhsul dizaynı. Saytda, sosial mediada və çapda vahid kimlik.',
    h1: ['Tanınan ', 'brendlər.', ''],
    lead: 'Brendinizin xarakterini aydın vizual dilə çeviririk: loqo, rəng palitrası, tipoqrafiya, brend kitabı və rəqəmsal məhsul dizaynı.',
    cta: 'Brendinq layihəsi başladaq',
    about: 'Hər element bir sistemin parçasıdır. Komandanız brend kitabı ilə yeni materialları özü də düzgün hazırlaya bilir.',
    includes: [
      { icon: 'brand', h: 'Loqo və kimlik', p: 'Tam vizual identifikasiya sistemi.' },
      { icon: 'book', h: 'Brend kitabı', p: 'İstifadə qaydaları və nümunələr.' },
      { icon: 'web', h: 'UI/UX dizayn', p: 'Sayt və tətbiq interfeysləri.' },
      { icon: 'smm', h: 'Sosial media şablonları', p: 'Post, story və reklam dizaynları.' },
    ],
    deliverables: ['Loqo dizaynı', 'Brend kitabı (brandbook)', 'Rəng və tipoqrafiya sistemi', 'Sosial media şablonları', 'UI komponent kitabxanası'],
    steps: GENERIC_STEPS,
    faq: [FAQ.price, FAQ.one],
    ctaH: 'Brendiniz yadda qalsın.',
    ctaP: 'Biznesinizin xarakterini danışaq və ona uyğun vizual kimliyin istiqamətini birlikdə müəyyənləşdirək.',
  },
  {
    slug: 'smm', icon: 'smm', group: 'ads',
    title: 'SMM xidməti', menuDesc: 'Kontent, prodakşn, icma',
    homeDesc: 'Instagram, TikTok və Facebook üçün strateji kontent, prodakşn və icma idarəçiliyi.',
    chips: ['Kontent plan', 'Prodakşn', 'İcma'],
    metaTitle: 'SMM xidməti Bakıda — Instagram, TikTok, Facebook',
    metaDesc: 'Kontent planı, foto və video çəkiliş, Reels, dizayn, copywriting və icma idarəçiliyi. Aylıq analitika hesabatı.',
    h1: ['Kontent ki, ', 'izlənir.', ''],
    lead: 'Sosial media hesablarınızı strategiya əsasında idarə edirik: kontent planı, foto və video çəkiliş, dizayn, copywriting və izləyicilərlə ünsiyyət.',
    cta: 'SMM planı istəyirəm',
    about: 'Reels və qısa videolarla üzvi əhatəni artırır, nəticələri aylıq analitika ilə ölçürük.',
    includes: [
      { icon: 'calendar', h: 'Kontent strategiyası', p: 'Aylıq plan, rubrikalar və mövzular.' },
      { icon: 'camera', h: 'Prodakşn', p: 'Foto, video və Reels çəkilişi.' },
      { icon: 'smm', h: 'İcma idarəçiliyi', p: 'Şərh və mesajlara operativ cavab.' },
      { icon: 'chart', h: 'Analitika', p: 'Əhatə, cəlbetmə və müraciət hesabatı.' },
    ],
    deliverables: ['Aylıq kontent təqvimi', 'Vizual dizayn və şablonlar', 'Copywriting', 'İcma idarəçiliyi', 'Aylıq analitika hesabatı'],
    steps: GENERIC_STEPS,
    faq: [FAQ.price, FAQ.one, { q: 'Hansı platformalarda işləyirsiniz?', a: 'Instagram, TikTok və Facebook. Auditoriyanız harada olduğuna görə əsas platformanı birlikdə seçirik.' }],
    ctaH: 'Hesabınız müştəri gətirsin.',
    ctaP: 'Hesablarınıza birlikdə baxaq və auditoriyanıza uyğun kontent planının istiqamətini müəyyənləşdirək.',
  },
  {
    slug: 'email-marketinq', icon: 'mail', group: 'email', isNew: true,
    title: 'Email marketinq', menuDesc: 'Satış gətirən məktub zəncirləri',
    homeDesc: 'Abunəçi bazası, avtomatik email zəncirləri və kampaniyalar: müştəriləri geri qaytaran və satışı artıran məktublar.',
    chips: ['Kampaniyalar', 'Avtomatik zəncirlər', 'Seqmentasiya'],
    metaTitle: 'Email marketinq — avtomatik zəncirlər və kampaniyalar',
    metaDesc: 'Abunəçi bazasının qurulması, avtomatik email zəncirləri, bülleten və kampaniyalar. A/B test və aylıq hesabat.',
    h1: ['Satış gətirən ', 'məktublar.', ''],
    lead: 'Email müştəri ilə ən birbaşa əlaqə kanalıdır: alqoritm və reklam büdcəsi olmadan. Bazanızı qurur, avtomatik zəncirlər yazır və hər kampaniyanın satışa təsirini ölçürük.',
    cta: 'Email strategiyası istəyirəm',
    about: 'Yalnız icazə vermiş abunəçilərlə işləyirik: bu həm qanuni tələbdir, həm də məktubların inbox-a çatması üçün vacibdir.',
    includes: [
      { icon: 'users', h: 'Baza və seqmentasiya', p: 'Abunə formaları, bazanın təmizlənməsi və seqmentlər.' },
      { icon: 'refresh', h: 'Avtomatik zəncirlər', p: 'Xoş gəldin, tərk edilmiş səbət, geri qaytarma.' },
      { icon: 'mail', h: 'Kampaniyalar', p: 'Bülleten, endirim və yenilik məktubları.' },
      { icon: 'chart', h: 'A/B test və hesabat', p: 'Mövzu sətri, vaxt və dizayn testləri.' },
    ],
    deliverables: ['Email strategiyası və göndərmə təqvimi', 'Sayt üçün abunə formaları', 'Mobil uyğun email şablonları', 'Avtomatik email zəncirləri', 'Aylıq nəticə hesabatı'],
    steps: [
      ['Baza və seqmentlər', 'Mövcud kontaktları təmizləyir, sayt formaları ilə yeni abunəçi toplayır, seqmentlərə bölürük.'],
      ['Strategiya və platforma', 'Zəncirləri, göndərmə təqvimini və Mailchimp, Brevo və ya Klaviyo kimi platformanı seçirik.'],
      ['Dizayn və mətn', 'Mobil uyğun şablonlar və brendinizin dilində yazılmış məktublar hazırlayırıq.'],
      ['Test və böyümə', 'A/B testlər edir, nəticələri ölçür və hər ay zəncirləri yaxşılaşdırırıq.'],
    ],
    faq: [
      { q: 'Abunəçi bazam yoxdur. Başlaya bilərəm?', a: 'Bəli. Saytda abunə formaları, pop-up və faydalı material (endirim kodu, bələdçi) təklifi ilə bazanı sıfırdan qururuq.' },
      { q: 'Hazır email siyahısı alıb göndərmək olar?', a: 'Tövsiyə etmirik. İcazəsiz bazaya göndərilən məktublar spama düşür və domeninizin reputasiyasını korlayır. Yalnız icazə vermiş abunəçilərlə işləyirik.' },
      { q: 'Nə qədər tez-tez göndərmək lazımdır?', a: 'Avtomatik zəncirlər müştərinin hərəkətinə görə gedir. Kampaniya və bülletenlər üçün adətən həftədə 1 və ya ayda 2–4 məktub ilə başlayır, nəticəyə görə dəyişirik.' },
      { q: 'Hansı platformada işləyirsiniz?', a: 'Bazanızın ölçüsünə və saytınıza görə seçirik: Mailchimp, Brevo, Klaviyo və ya istifadə etdiyiniz CRM sistemi.' },
      { q: 'Korporativ email də lazımdır?', a: 'Bəli, məktubların öz domeninizdən və düzgün SPF, DKIM, DMARC ayarları ilə getməsi çatdırılma üçün vacibdir. Bunu da qururuq.' },
    ],
    ctaH: 'Bazanız satışa çevrilsin.',
    ctaP: 'Hazırkı vəziyyəti danışaq: bazanız, saytınız və hədəfləriniz. Yazılı planı 2–3 iş günündə göndəririk.',
  },
  {
    slug: 'korporativ-email', icon: 'at', group: 'email', isNew: true,
    title: 'Korporativ email', menuDesc: 'ad@sirketiniz.az ünvanları',
    homeDesc: 'Domeninizlə peşəkar email ünvanları (ad@sirketiniz.az): qurulma, köhnə poçtun köçürülməsi və məktubların spama düşməməsi üçün təhlükəsizlik ayarları.',
    chips: ['Google Workspace', 'Microsoft 365', 'SPF · DKIM · DMARC'],
    metaTitle: 'Korporativ email — Google Workspace və Microsoft 365 qurulması',
    metaDesc: 'Domeninizlə peşəkar email: Google Workspace, Microsoft 365 və ya hostinq poçtu. MX, SPF, DKIM, DMARC və köçürmə.',
    h1: ['Domeninizlə ', 'peşəkar', ' email.'],
    lead: 'info@sirketiniz.az tipli ünvanlar müştəriyə etibar verir, məktublarınızın spama düşməsinin qarşısını alır və bütün yazışmalar şirkətin nəzarətində qalır. Qurulmanı, köçürməni və təhlükəsizlik ayarlarını biz edirik.',
    cta: 'Korporativ email istəyirəm',
    about: 'Platformanı komandanızın ölçüsünə, istifadə etdiyiniz proqramlara və büdcənizə görə birlikdə seçirik.',
    includes: [
      { icon: 'at', h: 'Poçt qutuları', p: 'Hər işçi üçün şəxsi ünvan və info@, satis@ kimi ümumi qutular.' },
      { icon: 'shield', h: 'Spam qorunması', p: 'SPF, DKIM və DMARC ilə məktublar inbox-a çatır.' },
      { icon: 'migrate', h: 'Köçürmə', p: 'Köhnə poçtdan bütün məktubların köçürülməsi.' },
      { icon: 'phone', h: 'Cihazlara qurulma', p: 'Outlook, Apple Mail və telefonlarda iş.' },
    ],
    deliverables: ['Domen və platforma təhlili', 'Poçt qutuları və ümumi ünvanlar', 'MX, SPF, DKIM və DMARC qurulması', 'Köhnə poçtun köçürülməsi', 'Email imzaları və komandaya təlim'],
    steps: [
      ['Təhlil', 'Domeniniz, istifadəçi sayı, mövcud poçt və ehtiyaclarınızı öyrənir, platformanı seçirik.'],
      ['Hesablar və DNS', 'Poçt qutularını yaradır, MX, SPF, DKIM və DMARC qeydlərini qururuq.'],
      ['Köçürmə', 'Köhnə məktubları, kontaktları və təqvimi yeni hesablara köçürürük.'],
      ['Qurulma və təlim', 'Kompüter və telefonlara qurur, imzaları hazırlayır, komandaya qısa təlim keçirik.'],
    ],
    faq: [
      { q: 'Köhnə məktublarım itəcək?', a: 'Xeyr. Mövcud poçtunuzdakı məktubları, kontaktları və təqvimi yeni hesablara köçürürük. Keçid zamanı məktub qəbulu dayanmır.' },
      { q: 'Domenim yoxdursa nə edim?', a: 'Əvvəl şirkətinizə uyğun domen seçirik (məsələn, .az və ya .com), qeydiyyatdan sonra poçtu həmin domen üzərində qururuq.' },
      { q: 'Məktublarım niyə spama düşür?', a: 'Adətən səbəb SPF, DKIM və DMARC qeydlərinin olmaması və ya səhv qurulmasıdır. Bu qeydlər alıcının serverinə məktubun həqiqətən sizdən gəldiyini sübut edir.' },
      { q: 'Qiymət nədən asılıdır?', a: 'Platformanın aylıq lisenziyası istifadəçi sayına görə hesablanır. Qurulma və köçürmə xidmətinin qiymətini təhlildən sonra yazılı təklifdə göstəririk.' },
      { q: 'Telefonda işləyəcək?', a: 'Bəli. İstənilən iPhone və Android telefonda, həmçinin Outlook və Apple Mail proqramlarında işləyir.' },
    ],
    ctaH: 'Komandanız üçün peşəkar poçt.',
    ctaP: 'İstifadəçi sayını və domeninizi yazın, platforma təklifi və qiyməti 24 saat ərzində göndərək.',
  },
  {
    slug: 'ai-avtomatlasdirma', icon: 'ai', group: 'email',
    title: 'AI və avtomatlaşdırma', menuDesc: 'Chatbot, CRM, avtomatik email',
    homeDesc: 'Chatbot, CRM inteqrasiyası və avtomatik email. Komandanızın vaxtına qənaət edir.',
    chips: ['Chatbot', 'CRM', 'Email'],
    metaTitle: 'AI və avtomatlaşdırma — chatbot, CRM inteqrasiyası',
    metaDesc: 'AI chatbot, CRM inteqrasiyası, lead scoring və email avtomatlaşdırması. Rutin işləri sistem 24/7 görür.',
    h1: ['24/7 işləyən ', 'köməkçi.', ''],
    lead: 'Təkrarlanan işləri avtomatlaşdırır, süni intellektlə müştəri axınını sürətləndiririk: chatbotlar, lead scoring, CRM inteqrasiyaları və email avtomatlaşdırması.',
    cta: 'Avtomatlaşdırma planı istəyirəm',
    about: 'Əvvəl proseslərinizi xəritələyir, ən çox vaxt aparan addımları tapır, sonra onları avtomatlaşdırırıq.',
    includes: [
      { icon: 'users', h: 'CRM axını', p: 'Müraciətlərin avtomatik toplanması və bölüşdürülməsi.' },
      { icon: 'smm', h: 'AI chatbot', p: 'Sayt və WhatsApp üçün 24/7 dəstək.' },
      { icon: 'mail', h: 'Email avtomatlaşdırması', p: 'Trigger əsaslı kampaniyalar.' },
      { icon: 'ai', h: 'İnteqrasiyalar', p: 'Sayt, CRM və alətlərin birləşdirilməsi.' },
    ],
    deliverables: ['Proses auditi', 'Avtomatlaşdırma ssenarisi', 'AI chatbot inteqrasiyası', 'CRM quraşdırması', 'Təlim və dəstək'],
    steps: GENERIC_STEPS,
    faq: [FAQ.price, FAQ.one, { q: 'Chatbot səhv cavab versə nə olur?', a: 'Chatbot yalnız sizin təsdiqlədiyiniz məlumatlar əsasında cavab verir. Cavabı bilmədiyi və ya mürəkkəb hallarda söhbəti komandanızdan bir nəfərə ötürür.' }],
    ctaH: 'Komandanız vaxt qazansın.',
    ctaP: 'Hansı işlərin ən çox vaxt apardığını danışaq və ilk avtomatlaşdırma addımını birlikdə seçək.',
  },
];

// Ana səhifə siyahısının sırası
export const HOME_ORDER = ['veb-saytlar', 'seo', 'reklam', 'brendinq', 'smm', 'email-marketinq', 'korporativ-email', 'ai-avtomatlasdirma'];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesByGroup = (g: ServiceGroup) => services.filter((s) => s.group === g);
