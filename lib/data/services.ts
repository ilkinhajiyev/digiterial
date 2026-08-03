export type Service = {
  slug: string; title: string; tag: string; short: string;
  overview: string[]; features: { h: string; p: string }[];
  deliverables: string[]; metric?: string; accent?: string;
};
export const services: Service[] = [
  { slug: 'veb-saytlar', title: 'Veb & E-ticarət', tag: 'Veb', short: 'Sürətli, konvertasiya yönümlü saytlar və onlayn mağazalar.',
    overview: ['Brendinizi əks etdirən, sürətli və axtarış sistemlərinə hazır saytlar qururuq. Landing-dən korporativ saytadək, WooCommerce e-ticarətdən xüsusi həllərədək.','Hər layihə Core Web Vitals, mobil-əvvəl dizayn və idarəolunan kontent strukturu ilə gəlir.'],
    features: [{ h: 'Korporativ saytlar', p: 'Çoxdilli, idarəolunan, sürətli.' }, { h: 'E-ticarət', p: 'WooCommerce / xüsusi ödəniş axını.' }, { h: 'Landing page', p: 'Kampaniyalar üçün yüksək konvertasiya.' }, { h: 'Performans', p: 'Core Web Vitals, 90+ PageSpeed.' }],
    deliverables: ['UI/UX dizayn', 'Responsiv kodlaşdırma', 'CMS inteqrasiyası', 'Texniki SEO təməli', 'Analitika quraşdırması'], metric: '98 orta PageSpeed' },
  { slug: 'seo', title: 'SEO & Texniki SEO', tag: 'SEO', short: 'Üzvi trafik üçün açar söz, texniki audit və kontent strategiyası.',
    overview: ['Axtarışda görünürlüyünüzü ölçülə bilən şəkildə artırırıq: texniki audit, açar söz araşdırması, on-page optimizasiya və keyfiyyətli kontent.','Search Console və analitika ilə hər ay irəliləyişi hesabatlandırırıq.'],
    features: [{ h: 'Texniki audit', p: 'İndeksləmə, sürət, struktur.' }, { h: 'Açar söz', p: 'Niyyət əsaslı strategiya.' }, { h: 'On-page', p: 'Məzmun, meta, daxili keçidlər.' }, { h: 'Hesabat', p: 'Aylıq mövqe və trafik.' }],
    deliverables: ['Texniki SEO audit', 'Açar söz xəritəsi', 'Kontent planı', 'Link strategiyası', 'Aylıq hesabat'], metric: '+312% üzvi trafik' },
  { slug: 'reklam', title: 'Google & Meta Ads', tag: 'Reklam', short: 'ROAS yönümlü performans reklamı: Google, Meta, TikTok.',
    overview: ['Büdcənizdən maksimum nəticə üçün kampaniyalar qurub idarə edirik. Auditoriya, kreativ, A/B test və davamlı optimizasiya.','Hər manatın hara getdiyini şəffaf hesabatla göstəririk.'],
    features: [{ h: 'Google Ads', p: 'Search, PMax, remarketinq.' }, { h: 'Meta Ads', p: 'Instagram & Facebook.' }, { h: 'Kreativ', p: 'Reels, statik, UGC.' }, { h: 'Optimizasiya', p: 'A/B test, ROAS izləmə.' }],
    deliverables: ['Kampaniya quruluşu', 'Auditoriya strategiyası', 'Reklam kreativləri', 'Konversiya izləmə', 'Həftəlik optimizasiya'], metric: '3.2x orta ROAS' },
  { slug: 'brendinq', title: 'Brendinq & Dizayn', tag: 'Brendinq', short: 'Loqo, vizual kimlik və UI/UX — yadda qalan brendlər.',
    overview: ['Brendinizin xarakterini vizual dilə çeviririk: loqo, rəng, tipoqrafiya, brend kitabı və rəqəmsal məhsul dizaynı.','Tutarlı, müasir və hər platformada işləyən kimlik.'],
    features: [{ h: 'Loqo & kimlik', p: 'Tam vizual sistem.' }, { h: 'Brend kitabı', p: 'İstifadə qaydaları.' }, { h: 'UI/UX', p: 'Məhsul və sayt dizaynı.' }, { h: 'Sosial şablonlar', p: 'Post və story dizaynları.' }],
    deliverables: ['Loqo dizaynı', 'Brend kitabı', 'Rəng & tipoqrafiya', 'Sosial media şablonları', 'UI komponentləri'], metric: '40+ brend kimliyi' },
  { slug: 'smm', title: 'SMM & Sosial Media', tag: 'SMM', short: 'Kontent plan, icma idarəçiliyi və böyümə strategiyası.',
    overview: ['Sosial media hesablarınızı strategiya ilə idarə edirik: kontent təqvimi, çəkiliş, dizayn, copywriting və icma idarəçiliyi.','Reels və qısa video formatları ilə üzvi böyümə.'],
    features: [{ h: 'Kontent plan', p: 'Aylıq təqvim və mövzular.' }, { h: 'Prodakşn', p: 'Foto, video, Reels.' }, { h: 'İcma', p: 'Şərh və mesaj idarəçiliyi.' }, { h: 'Analitika', p: 'Böyümə hesabatı.' }],
    deliverables: ['Kontent təqvimi', 'Vizual dizayn', 'Copywriting', 'İcma idarəçiliyi', 'Aylıq analitika'], metric: '+58k orta böyümə' },
  { slug: 'ai-avtomatlasdirma', title: 'AI & Avtomatlaşdırma', tag: 'AI', short: 'CRM, lead axını və biznes proseslərinin avtomatlaşdırılması.',
    overview: ['Təkrarlanan işləri avtomatlaşdırır, AI ilə müştəri axınını sürətləndiririk: chatbot, lead scoring, CRM inteqrasiyaları və email avtomatlaşdırma.','Komandanız strateji işə fokuslanır, sistem qalanını edir.'],
    features: [{ h: 'CRM axını', p: 'Lead toplama və idarəetmə.' }, { h: 'Chatbot', p: 'AI müştəri dəstəyi.' }, { h: 'Email', p: 'Avtomatik kampaniyalar.' }, { h: 'İnteqrasiya', p: 'Alətlərin birləşməsi.' }],
    deliverables: ['Proses auditi', 'Avtomatlaşdırma quruluşu', 'AI inteqrasiyası', 'CRM qurulması', 'Təlim & dəstək'], metric: '−60% əl ilə iş' },
];
export const getService = (slug: string) => services.find((s) => s.slug === slug);
