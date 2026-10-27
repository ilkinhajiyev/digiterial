// Bloq yazıları (canlı saytdan köçürülüb). Yeni yazı əlavə etmək üçün bu siyahıya obyekt əlavə edin.
export type PostBlock = { t: 'p' | 'h2' | 'h3' | 'quote'; text: string } | { t: 'ul'; items: string[] };
export type Post = { slug: string; title: string; description: string; date: string; category: string; body: PostBlock[]; faq: { q: string; a: string }[] };

export const posts: Post[] = [
  {
    "slug": "veb-sayt-hazirlanmasi-qiymeti",
    "title": "Veb sayt hazırlanmasının qiyməti nədən asılıdır? 2026 bələdçisi",
    "description": "Veb sayt hazırlanmasının qiymətini müəyyən edən 7 əsas amil, sayt növləri və büdcəni düzgün planlamaq üçün praktik məsləhətlər.",
    "date": "2026-10-06",
    "category": "Veb sayt",
    "body": [
      {
        "t": "p",
        "text": "\"Sayt neçəyə başa gəlir?\" — biznes sahiblərinin bizə ən çox verdiyi sualdır. Düzgün cavab \"nə qurduğunuzdan asılıdır\" olsa da, bu cavab heç kimə kömək etmir. Bu yazıda veb sayt hazırlanmasının qiymətini real olaraq nəyin formalaşdırdığını, hansı xərclərin vacib, hansılarının isə ixtiyari olduğunu izah edirik."
      },
      {
        "t": "h2",
        "text": "Əvvəlcə sayt növünü müəyyənləşdirin"
      },
      {
        "t": "p",
        "text": "Qiymətə ən böyük təsiri saytın növü göstərir. Bazarda üç əsas kateqoriya var:"
      },
      {
        "t": "ul",
        "items": [
          "Landing səhifə — bir məhsul, xidmət və ya reklam kampaniyası üçün tək səhifəlik sayt. Məqsədi bir hərəkətə yönləndirməkdir: zəng, müraciət, qeydiyyat.",
          "Korporativ sayt — şirkəti, xidmətləri, komandanı və əlaqə məlumatlarını təqdim edən çoxsəhifəli sayt. Çox vaxt bloq və çoxdilli struktur da daxil olur.",
          "E-ticarət saytı — məhsul kataloqu, səbət, onlayn ödəniş, çatdırılma və sifariş idarəetməsi olan onlayn mağaza."
        ]
      },
      {
        "t": "p",
        "text": "Hər növün iş həcmi fərqlidir: landing səhifə adətən bir neçə həftəyə hazır olur, onlayn mağaza isə inteqrasiyalar səbəbindən bir neçə aya qədər çəkə bilər."
      },
      {
        "t": "h2",
        "text": "Qiyməti formalaşdıran 7 amil"
      },
      {
        "t": "ul",
        "items": [
          "Dizayn yanaşması. Hazır şablon ucuz və sürətlidir, lakin brendinizi fərqləndirmir. Fərdi UI/UX dizayn daha çox vaxt tələb edir, amma konversiya və etibar baxımından fərq yaradır.",
          "Səhifə sayı və struktur. Hər yeni səhifə şablonu (xidmət, məhsul, bloq yazısı) dizayn və kodlaşdırma işi deməkdir.",
          "Funksionallıq. Onlayn ödəniş, rezervasiya sistemi, şəxsi kabinet, kalkulyator, CRM inteqrasiyası — hər biri ayrıca iş həcmidir.",
          "Kontent. Mətnlərin yazılması (copywriting), foto və video çəkiliş çox vaxt büdcədən kənarda unudulur, halbuki saytın satıb-satmaması məhz kontentdən asılıdır.",
          "Dil sayı. Azərbaycan, rus və ingilis dillərində sayt həm tərcümə, həm də hər dil üçün ayrıca SEO işi tələb edir.",
          "Texniki SEO və sürət. Sürətli yüklənən, mobil uyğun və axtarış sistemlərinə hazır struktur əvvəlcədən planlanmalıdır — sonradan düzəltmək daha baha başa gəlir.",
          "Dəstək və yeniləmələr. Hostinq, domen, təhlükəsizlik yeniləmələri və texniki dəstək davamlı xərclərdir."
        ]
      },
      {
        "t": "h2",
        "text": "Gizli xərclərə diqqət edin"
      },
      {
        "t": "p",
        "text": "Ən çox yayılmış səhv yalnız ilkin hazırlanma qiymətinə baxmaqdır. Təklifi müqayisə edərkən bu sualları verin:"
      },
      {
        "t": "ul",
        "items": [
          "Domen və hostinq qiymətə daxildirmi?",
          "Saytı sonradan özünüz redaktə edə biləcəksinizmi (CMS)?",
          "Google Analytics (GA4) və konversiya izləməsi quraşdırılırmı?",
          "Yayımdan sonra neçə ay texniki dəstək verilir?",
          "Mənbə kodu və bütün girişlər sizə təhvil verilirmi?"
        ]
      },
      {
        "t": "quote",
        "text": "Ucuz sayt sonradan yenidən yazılmalı olursa, ən baha seçim olur. Büdcəni planlayarkən saytı 3–5 illik investisiya kimi düşünün."
      },
      {
        "t": "h2",
        "text": "Büdcəni necə düzgün planlamaq olar?"
      },
      {
        "t": "p",
        "text": "Əvvəlcə saytın biznes məqsədini bir cümlə ilə yazın: \"ayda X müraciət almaq\", \"onlayn satışı başlatmaq\" və s. Sonra bu məqsəd üçün mütləq lazım olan funksiyaları (\"must have\") və sonraya saxlanıla bilənləri (\"nice to have\") ayırın. Bu yanaşma ilk versiyanı daha sürətli və daha sərfəli yayımlamağa imkan verir."
      },
      {
        "t": "p",
        "text": "Agentlikdən təklif alarkən mərhələli plan istəyin: kəşf, dizayn, kodlaşdırma, test və yayım. Hər mərhələnin nəticəsi və müddəti yazılı göstərilməlidir. Digiterial-da veb sayt hazırlanması layihələrini məhz bu şəkildə — şəffaf mərhələlər və ayrıca göstərilmiş xərclərlə aparırıq."
      },
      {
        "t": "h2",
        "text": "Nəticə"
      },
      {
        "t": "p",
        "text": "Veb sayt hazırlanmasının qiyməti sayt növü, dizayn yanaşması, funksionallıq, kontent və dəstək kimi amillərdən formalaşır. Ən sərfəli seçim ən ucuz təklif deyil, biznes məqsədinizə ən qısa yolla xidmət edən həlldir. Layihənizin həcmini dəqiqləşdirmək istəyirsinizsə, bizə yazın — ehtiyacınıza uyğun mərhələli plan hazırlayaq."
      }
    ],
    "faq": [
      {
        "q": "Landing səhifə nə qədər müddətə hazır olur?",
        "a": "Kontent hazırdırsa, landing səhifə adətən 2–3 həftəyə dizayn edilib yayımlana bilər."
      },
      {
        "q": "Hazır şablon yoxsa fərdi dizayn?",
        "a": "Qısa müddətli kampaniya üçün şablon kifayət edə bilər. Brendi fərqləndirmək və konversiyanı artırmaq istəyirsinizsə, fərdi dizayn uzunmüddətli perspektivdə daha sərfəlidir."
      },
      {
        "q": "Saytı sonradan özüm redaktə edə bilərəmmi?",
        "a": "Bəli, əgər sayt idarəetmə paneli (CMS) ilə hazırlanıbsa. Təklif alarkən bunu mütləq soruşun."
      }
    ]
  },
  {
    "slug": "seo-nedir-google-da-yuxari-cixmaq",
    "title": "SEO nədir? Google-da yuxarı çıxmaq üçün 10 praktik addım",
    "description": "SEO nədir, necə işləyir və saytınızı Google axtarışında yuxarı qaldırmaq üçün bu gün başlaya biləcəyiniz 10 praktik addım.",
    "date": "2026-09-28",
    "category": "SEO",
    "body": [
      {
        "t": "p",
        "text": "SEO (Search Engine Optimization — axtarış sisteminə optimallaşdırma) saytınızın Google kimi axtarış sistemlərində pulsuz, yəni üzvi nəticələrdə daha yuxarıda görünməsi üçün görülən işlərin məcmusudur. Reklamdan fərqli olaraq, SEO-nun nəticəsi kliklərə görə ödəniş etmədən davamlı trafik gətirir."
      },
      {
        "t": "h2",
        "text": "SEO necə işləyir?"
      },
      {
        "t": "p",
        "text": "Google üç əsas mərhələdə işləyir: səhifələri tapır (crawling), indeksləyir (indexing) və istifadəçinin sorğusuna görə sıralayır (ranking). SEO bu üç mərhələnin hər birində saytınızın işini asanlaşdırmaqdır. Bunun üçün üç istiqamətdə çalışırıq:"
      },
      {
        "t": "ul",
        "items": [
          "Texniki SEO — saytın sürəti, mobil uyğunluğu, strukturu, indekslənməsi.",
          "On-page SEO — səhifə məzmunu, başlıqlar, meta məlumatlar, daxili linklər.",
          "Off-page SEO — digər saytlardan gələn keyfiyyətli linklər və brend etibarı."
        ]
      },
      {
        "t": "h2",
        "text": "Google-da yuxarı çıxmaq üçün 10 addım"
      },
      {
        "t": "ul",
        "items": [
          "Google Search Console-a qoşulun. Saytınızın hansı sorğularla göründüyünü, indeksləmə xətalarını və klikləri pulsuz izləmək üçün ən vacib alətdir.",
          "Açar söz araşdırması aparın. Müştərilərinizin real olaraq nə axtardığını öyrənin. Məsələn, \"veb sayt\" əvəzinə \"Bakıda veb sayt hazırlanması\" daha konkret niyyəti göstərir.",
          "Hər səhifəyə bir əsas mövzu verin. Bir səhifə bir əsas sorğuya cavab verməlidir. Eyni açar sözü bir neçə səhifədə hədəfləmək onları bir-biri ilə rəqabətə salır.",
          "Title və meta description yazın. Başlıq təxminən 60, təsvir isə 160 simvola qədər olmalı, açar sözü və klik etmək üçün səbəbi ehtiva etməlidir.",
          "Başlıq strukturunu düzgün qurun. Səhifədə bir H1, məntiqi ardıcıllıqla H2 və H3 başlıqlar olmalıdır.",
          "Saytın sürətini artırın. Şəkilləri sıxın, müasir formatlardan (WebP, AVIF) istifadə edin, lazımsız skriptləri azaldın. Core Web Vitals göstəricilərini PageSpeed Insights ilə yoxlayın.",
          "Mobil versiyanı prioritet edin. Google saytları əsasən mobil versiyaya görə qiymətləndirir.",
          "Faydalı kontent yaradın. Müştərilərin suallarına ətraflı və aydın cavab verən məqalələr, bələdçilər və FAQ bölmələri yazın.",
          "Daxili linkləmə qurun. Bloq yazılarından xidmət səhifələrinə, xidmətlərdən portfolio-ya keçidlər həm istifadəçiyə, həm də Google-a saytın strukturunu göstərir.",
          "Lokal SEO-nu unutmayın. Bakıda xidmət göstərirsinizsə, Google Business Profile-ı tam doldurun və müştərilərdən rəy toplayın."
        ]
      },
      {
        "t": "quote",
        "text": "SEO bir dəfəlik iş deyil. Rəqiblər, axtarış alqoritmləri və istifadəçi davranışı dəyişdikcə strategiya da yenilənməlidir."
      },
      {
        "t": "h2",
        "text": "SEO nəticələri nə vaxt görünür?"
      },
      {
        "t": "p",
        "text": "Texniki düzəlişlərin təsiri adətən bir neçə həftə ərzində görünməyə başlayır. Rəqabətli sorğularda davamlı mövqe və trafik artımı isə çox vaxt 3–6 ay və daha çox çəkir. Ona görə də SEO-nu reklamla paralel aparmaq, qısa və uzunmüddətli nəticələri balanslaşdırmaq üçün effektiv yanaşmadır."
      },
      {
        "t": "h2",
        "text": "Nəticə"
      },
      {
        "t": "p",
        "text": "SEO saytınızı tapılan, sürətli və faydalı etməkdir. Yuxarıdakı 10 addım güclü təməl yaradır. Peşəkar yanaşma istəyirsinizsə, SEO xidmətimiz texniki auditdən kontent strategiyasına və aylıq hesabata qədər bütün prosesi əhatə edir."
      }
    ],
    "faq": [
      {
        "q": "SEO pulsuzdurmu?",
        "a": "Üzvi nəticələrdə görünmək üçün Google-a ödəniş edilmir, lakin SEO işi vaxt, bilik və kontent investisiyası tələb edir."
      },
      {
        "q": "SEO yoxsa Google reklamı?",
        "a": "Reklam dərhal trafik gətirir, SEO isə davamlı və uzunmüddətli nəticə verir. Ən yaxşı nəticə ikisinin birlikdə istifadəsindən alınır."
      }
    ]
  },
  {
    "slug": "google-ads-yoxsa-instagram-reklami",
    "title": "Google Ads yoxsa Instagram reklamı: biznesiniz üçün hansı sərfəlidir?",
    "description": "Google Ads və Instagram (Meta) reklamının fərqləri, hansı biznes üçün hansının daha uyğun olduğu və büdcəni necə bölmək lazım olduğu.",
    "date": "2026-09-18",
    "category": "Reklam",
    "body": [
      {
        "t": "p",
        "text": "Rəqəmsal reklama başlayan bizneslərin ilk sualı budur: pulu Google-a, yoxsa Instagram-a xərcləmək? Cavab məhsulunuzdan, müştərinin qərar vermə yolundan və büdcənizdən asılıdır. Gəlin iki platformanı praktik baxımdan müqayisə edək."
      },
      {
        "t": "h2",
        "text": "Əsas fərq: tələb yoxsa maraq"
      },
      {
        "t": "p",
        "text": "Google Ads artıq mövcud olan tələbi tutur. İstifadəçi \"Bakıda kondisioner təmiri\" yazırsa, onun ehtiyacı hazırdır — siz sadəcə ilk görünən olmalısınız."
      },
      {
        "t": "p",
        "text": "Instagram və Facebook reklamı (Meta Ads) isə tələb yaradır. İstifadəçi heç nə axtarmır, lakin maraqlarına, yaşına və davranışına görə sizin reklamınızı görür. Burada vizual və təklif həlledicidir."
      },
      {
        "t": "h2",
        "text": "Google Ads kimlər üçün daha uyğundur?"
      },
      {
        "t": "ul",
        "items": [
          "Təcili ehtiyac olan xidmətlər: təmir, tibbi xidmətlər, hüquqi məsləhət, kuryer.",
          "İnsanların aktiv axtardığı məhsul və xidmətlər.",
          "B2B xidmətlər və yüksək dəyərli sifarişlər.",
          "Lokal bizneslər — xəritə və axtarışda görünmək üçün."
        ]
      },
      {
        "t": "h2",
        "text": "Instagram reklamı kimlər üçün daha uyğundur?"
      },
      {
        "t": "ul",
        "items": [
          "Vizual məhsullar: geyim, kosmetika, dizayn, restoran, səyahət.",
          "Yeni məhsul və ya brend — insanlar hələ sizi axtarmır.",
          "İmpulsiv və ya emosional alış qərarları.",
          "Remarketinq — saytınıza girib almayanlara yenidən göstərmək."
        ]
      },
      {
        "t": "h2",
        "text": "Müqayisə cədvəli"
      },
      {
        "t": "ul",
        "items": [
          "Niyyət: Google — yüksək (axtarış), Instagram — aşağı-orta (kəşf).",
          "Formatlar: Google — mətn, alış-veriş, video (YouTube); Instagram — Reels, Stories, karusel.",
          "Hədəfləmə: Google — açar sözlər; Instagram — maraqlar, demoqrafiya, oxşar auditoriyalar.",
          "Ən güclü tərəfi: Google — hazır müştərini tutmaq; Instagram — tanınma və tələb yaratmaq."
        ]
      },
      {
        "t": "h2",
        "text": "Büdcəni necə bölmək olar?"
      },
      {
        "t": "p",
        "text": "Tək bir doğru nisbət yoxdur, lakin praktik başlanğıc yanaşması belədir:"
      },
      {
        "t": "ul",
        "items": [
          "Əvvəlcə konversiya izləməsini qurun (GA4, Meta Pixel). Ölçə bilmədiyiniz reklamı optimallaşdıra bilməzsiniz.",
          "Məhsulunuz aktiv axtarılırsa, büdcənin böyük hissəsini Google Search-ə yönəldin.",
          "Vizual və yeni məhsuldursa, Meta Ads ilə başlayın və saytı ziyarət edənlərə remarketinq qurun.",
          "İlk 2–4 həftədən sonra müraciət başına xərcə (CPA) baxın və büdcəni daha effektiv kanala köçürün."
        ]
      },
      {
        "t": "quote",
        "text": "Ən böyük səhv reklamı \"bəyənmə\" və \"baxış\" sayına görə qiymətləndirməkdir. Əsas göstərici müraciət və satış başına xərcdir."
      },
      {
        "t": "h2",
        "text": "Nəticə"
      },
      {
        "t": "p",
        "text": "Google Ads hazır tələbi satışa çevirir, Instagram reklamı isə yeni tələb yaradır. Əksər bizneslər üçün ən yaxşı nəticə ikisinin birlikdə, aydın ölçmə ilə istifadəsindən gəlir. Google və Meta reklamı xidmətimizdə kampaniyaları məhz müraciət və satış göstəricilərinə görə idarə edirik."
      }
    ],
    "faq": [
      {
        "q": "Reklama nə qədər büdcə ilə başlamaq olar?",
        "a": "Kiçik büdcə ilə test etmək mümkündür, lakin nəticəni qiymətləndirmək üçün kifayət qədər klik və müraciət toplanmalıdır. Büdcəni hədəf CPA-ya görə planlamaq daha düzgündür."
      },
      {
        "q": "Instagram-da \"Boost\" düyməsi kifayətdirmi?",
        "a": "Boost sürətli seçimdir, amma Ads Manager hədəfləmə, konversiya optimizasiyası və A/B test üçün daha geniş imkanlar verir."
      }
    ]
  },
  {
    "slug": "landing-page-nedir",
    "title": "Landing page nədir və konversiyanı artıran 9 element",
    "description": "Landing page nədir, adi saytdan nə ilə fərqlənir və ziyarətçini müştəriyə çevirən 9 əsas element — nümunələr və yoxlama siyahısı ilə.",
    "date": "2026-09-09",
    "category": "Veb sayt",
    "body": [
      {
        "t": "p",
        "text": "Landing page (eniş səhifəsi) ziyarətçini bir konkret hərəkətə yönləndirmək üçün hazırlanmış tək səhifədir: müraciət göndərmək, zəng etmək, qeydiyyatdan keçmək və ya məhsul almaq. Reklam kampaniyalarının effektivliyi çox vaxt məhz bu səhifənin keyfiyyətindən asılıdır."
      },
      {
        "t": "h2",
        "text": "Landing page ilə korporativ sayt arasındakı fərq"
      },
      {
        "t": "p",
        "text": "Korporativ sayt şirkət haqqında hər şeyi danışır və ziyarətçiyə bir çox yol təklif edir. Landing page isə bir məqsədə fokuslanır: menyu minimal, diqqəti yayındıran linklər az, bütün mətn və dizayn bir hərəkətə xidmət edir."
      },
      {
        "t": "h2",
        "text": "Konversiyanı artıran 9 element"
      },
      {
        "t": "ul",
        "items": [
          "Aydın başlıq. İlk 5 saniyədə \"bu nədir və mənə nə fayda verir?\" sualına cavab verin.",
          "Konkret alt başlıq. Faydanı rəqəm, müddət və ya nəticə ilə dəqiqləşdirin.",
          "Bir əsas CTA. \"Müraciət et\", \"Zəng sifariş et\" kimi aydın düymə — səhifə boyu bir neçə dəfə təkrarlana bilər.",
          "Faydalar, xüsusiyyətlər yox. \"5 GB yaddaş\" yerinə \"bütün sənədləriniz bir yerdə\" yazın.",
          "Sosial sübut. Real müştəri rəyləri, loqolar, case study-lər və nəticələr.",
          "Etirazlara cavab. Qiymət, müddət, zəmanət haqqında FAQ bölməsi tərəddüdü azaldır.",
          "Sadə forma. Hər əlavə sahə müraciət sayını azaldır. Yalnız həqiqətən lazım olanı soruşun.",
          "Sürət və mobil uyğunluq. Reklam trafikinin böyük hissəsi mobildən gəlir; yavaş səhifə büdcəni yandırır.",
          "Vizual iyerarxiya. Kontrastlı düymə, kifayət qədər boş sahə və oxunaqlı tipoqrafiya ziyarətçini təbii şəkildə CTA-ya aparır."
        ]
      },
      {
        "t": "quote",
        "text": "Qızıl qayda: bir landing page — bir auditoriya — bir təklif. Fərqli auditoriyalar üçün ayrı səhifələr daha yüksək nəticə verir."
      },
      {
        "t": "h2",
        "text": "Landing page-i necə test etmək olar?"
      },
      {
        "t": "p",
        "text": "Yayımdan sonra iş bitmir. Başlıq, CTA mətni, şəkil və forma uzunluğu üzrə A/B test aparın. Hər dəfə yalnız bir elementi dəyişin ki, nəyin təsir etdiyini dəqiq biləsiniz. Konversiya izləməsini (GA4, Meta Pixel) əvvəlcədən qurmaq vacibdir."
      },
      {
        "t": "h2",
        "text": "Yoxlama siyahısı"
      },
      {
        "t": "ul",
        "items": [
          "Başlıq faydanı aydın deyirmi?",
          "CTA ilk ekranda görünürmü?",
          "Səhifə mobildə 3 saniyədən tez açılırmı?",
          "Formada artıq sahə varmı?",
          "Rəylər və nəticələr realdırmı?"
        ]
      },
      {
        "t": "h2",
        "text": "Nəticə"
      },
      {
        "t": "p",
        "text": "Yaxşı landing page reklam büdcənizin hər manatını daha çox müraciətə çevirir. Veb sayt hazırlanması xidmətimiz çərçivəsində kampaniyalarınız üçün konversiya yönümlü landing səhifələr hazırlayır və onları reklam ilə birlikdə optimallaşdırırıq."
      }
    ],
    "faq": []
  },
  {
    "slug": "lokal-seo-google-xerite-baki",
    "title": "Lokal SEO: Bakıda biznesinizi Google Xəritədə necə önə çıxarmaq olar",
    "description": "Google Business Profile, rəylər və lokal açar sözlərlə Bakıda biznesinizi Google axtarışında və xəritədə daha görünən etmək üçün addım-addım bələdçi.",
    "date": "2026-08-27",
    "category": "SEO",
    "body": [
      {
        "t": "p",
        "text": "\"Yaxınlıqda restoran\", \"Nərimanovda stomatoloq\", \"Bakıda avtoservis\" — bu tip axtarışlar lokal niyyət daşıyır və Google onlara xəritə nəticələri ilə cavab verir. Lokal SEO biznesinizin məhz bu nəticələrdə görünməsi üçün görülən işlərdir."
      },
      {
        "t": "h2",
        "text": "Google Business Profile — təməl"
      },
      {
        "t": "p",
        "text": "Lokal SEO-nun ən vacib hissəsi Google Business Profile-dır (əvvəlki adı Google My Business). Profili tam və düzgün doldurun:"
      },
      {
        "t": "ul",
        "items": [
          "Ad, ünvan, telefon (NAP) — saytınızda və bütün kataloqlarda eyni formada yazılmalıdır.",
          "Əsas və əlavə kateqoriyalar — biznesinizi ən dəqiq təsvir edən kateqoriyanı seçin.",
          "İş saatları — bayram günləri daxil, həmişə aktual saxlayın.",
          "Foto və videolar — məkan, komanda, məhsul və işlərinizin real fotoları.",
          "Xidmətlər və məhsullar — qiymət diapazonu və qısa təsvirlə.",
          "Paylaşımlar — yeniliklər, təkliflər və tədbirlər haqqında müntəzəm postlar."
        ]
      },
      {
        "t": "h2",
        "text": "Rəylər: etibarın valyutası"
      },
      {
        "t": "p",
        "text": "Rəylərin sayı, keyfiyyəti və təzəliyi lokal sıralamaya və müştərinin seçiminə təsir edir."
      },
      {
        "t": "ul",
        "items": [
          "Məmnun müştərilərdən rəy istəməyi prosesə daxil edin — məsələn, xidmətdən sonra QR kod və ya link göndərin.",
          "Hər rəyə, xüsusilə mənfi rəylərə, nəzakətli və konkret cavab verin.",
          "Saxta rəylərdən qaçın — bu, profilin bloklanmasına səbəb ola bilər."
        ]
      },
      {
        "t": "h2",
        "text": "Saytınızı lokal axtarışa hazırlayın"
      },
      {
        "t": "ul",
        "items": [
          "Xidmət səhifələrində şəhər və rayon adlarını təbii şəkildə istifadə edin (\"Bakıda veb sayt hazırlanması\").",
          "Hər filial üçün ayrıca səhifə yaradın.",
          "Əlaqə səhifəsinə Google Xəritə yerləşdirin.",
          "Schema.org LocalBusiness işarələməsi əlavə edin — iş saatları, ünvan və telefon axtarış sistemlərinə strukturlaşdırılmış şəkildə ötürülür."
        ]
      },
      {
        "t": "quote",
        "text": "Lokal SEO-da ardıcıllıq vacibdir: ünvanınız bir kataloqda \"Bakı, Nizami küç.\", digərində \"Baku, Nizami str.\" yazılıbsa, bu, axtarış sistemləri üçün qarışıqlıq yaradır."
      },
      {
        "t": "h2",
        "text": "Lokal kataloq və sosial siqnallar"
      },
      {
        "t": "p",
        "text": "Azərbaycanda istifadə olunan biznes kataloqlarında, xəritə xidmətlərində və sosial şəbəkələrdə eyni məlumatlarla qeydiyyat brendinizin etibarlılığını gücləndirir."
      },
      {
        "t": "h2",
        "text": "Nəticə"
      },
      {
        "t": "p",
        "text": "Lokal SEO kiçik və orta bizneslər üçün ən sərfəli müştəri mənbələrindən biridir. Google Business Profile, rəylər və lokal optimallaşdırılmış sayt birlikdə işləyəndə fərq tez hiss olunur. SEO xidmətimiz lokal SEO-nu da əhatə edir."
      }
    ],
    "faq": []
  },
  {
    "slug": "saytiniz-niye-satmir",
    "title": "Saytınız niyə satmır? 7 tipik səhv və onların həlli",
    "description": "Trafik var, amma müraciət yoxdur? Saytların satmamasının 7 ən çox rast gəlinən səbəbi və konversiyanı artırmaq üçün praktik həllər.",
    "date": "2026-08-14",
    "category": "Konversiya",
    "body": [
      {
        "t": "p",
        "text": "Saytınıza ziyarətçi gəlir, amma zəng və müraciət azdır? Problem çox vaxt trafikdə yox, saytın özündədir. Aşağıda auditlərdə ən çox rast gəldiyimiz 7 səhvi və onların həllini topladıq."
      },
      {
        "t": "h2",
        "text": "1. Dəyər təklifi aydın deyil"
      },
      {
        "t": "p",
        "text": "Ziyarətçi ilk ekranda nə təklif etdiyinizi və bunun ona nə fayda verdiyini başa düşmürsə, gedir. \"Peşəkar xidmətlər\" kimi ümumi başlıqlar heç nə demir."
      },
      {
        "t": "p",
        "text": "Həll: Başlıqda konkret fayda yazın: kim üçün, hansı problemi, hansı nəticə ilə həll edirsiniz."
      },
      {
        "t": "h2",
        "text": "2. Sayt yavaş açılır"
      },
      {
        "t": "p",
        "text": "Hər əlavə saniyə ziyarətçi itkisi deməkdir, xüsusilə mobil internetdə."
      },
      {
        "t": "p",
        "text": "Həll: Şəkilləri optimallaşdırın, lazımsız plaginləri və skriptləri silin, keyfiyyətli hostinq seçin. PageSpeed Insights ilə yoxlayın."
      },
      {
        "t": "h2",
        "text": "3. Mobil versiya zəifdir"
      },
      {
        "t": "p",
        "text": "Düymələr kiçik, mətn oxunmur, formalar çətin doldurulur — mobil istifadəçi səbirsizdir."
      },
      {
        "t": "p",
        "text": "Həll: Saytı əvvəlcə mobil üçün düşünün; düymələr ən azı 44px, mətn rahat oxunan ölçüdə olsun."
      },
      {
        "t": "h2",
        "text": "4. Hərəkətə çağırış (CTA) yoxdur və ya çoxdur"
      },
      {
        "t": "p",
        "text": "Ziyarətçi növbəti addımı bilməlidir. On fərqli düymə isə qərarsızlıq yaradır."
      },
      {
        "t": "p",
        "text": "Həll: Hər səhifə üçün bir əsas CTA seçin və onu görünən yerlərdə təkrarlayın."
      },
      {
        "t": "h2",
        "text": "5. Etibar siqnalları azdır"
      },
      {
        "t": "p",
        "text": "Rəylər, real layihələr, komanda fotoları, əlaqə məlumatları yoxdursa, insanlar risk etmək istəmir."
      },
      {
        "t": "p",
        "text": "Həll: Müştəri rəyləri, portfolio, sertifikatlar və aydın əlaqə məlumatları əlavə edin."
      },
      {
        "t": "h2",
        "text": "6. Forma çox uzundur"
      },
      {
        "t": "p",
        "text": "Hər əlavə sahə müraciət sayını azaldır."
      },
      {
        "t": "p",
        "text": "Həll: Yalnız ad, əlaqə və qısa mesaj soruşun. Qalan məlumatı ilk söhbətdə öyrənmək olar. Alternativ olaraq WhatsApp düyməsi əlavə edin."
      },
      {
        "t": "h2",
        "text": "7. Nəticələr ölçülmür"
      },
      {
        "t": "p",
        "text": "Hansı səhifənin, kanalın və kampaniyanın müraciət gətirdiyini bilmirsinizsə, nəyi düzəltmək lazım olduğunu da bilmirsiniz."
      },
      {
        "t": "p",
        "text": "Həll: GA4 və Google Tag Manager ilə form göndərmə, zəng klikləri və WhatsApp kliklərini konversiya kimi izləyin."
      },
      {
        "t": "quote",
        "text": "Kiçik dəyişikliklər — daha aydın başlıq, daha qısa forma, daha sürətli səhifə — çox vaxt yeni sayt hazırlamaqdan daha tez nəticə verir."
      },
      {
        "t": "h2",
        "text": "Nəticə"
      },
      {
        "t": "p",
        "text": "Satmayan saytın səbəbi adətən bir neçə düzəldilə bilən problemin cəmidir. Saytınızın hansı nöqtədə müştəri itirdiyini öyrənmək istəyirsinizsə, bizimlə əlaqə saxlayın. Veb sayt və SEO xidmətlərimiz konversiya optimizasiyasını da əhatə edir."
      }
    ],
    "faq": []
  }
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
const INTL: Record<string, string> = { en: 'en-GB', ru: 'ru-RU', de: 'de-DE' };
export function formatDate(iso: string, locale = 'az') {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (INTL[locale]) return new Intl.DateTimeFormat(INTL[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d));
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export function readingMinutes(p: Post) {
  const words = p.body.reduce((n, b) => n + ('items' in b ? b.items.join(' ') : b.text).split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}
