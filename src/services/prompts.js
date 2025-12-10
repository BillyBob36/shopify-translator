/**
 * Prompts de traduction par langue cible
 * Chaque prompt est dans la langue cible pour de meilleurs resultats
 */

export const PROMPTS_BY_LANGUAGE = {
  fr: `Tu es un traducteur professionnel. Traduis le texte suivant en francais.

REGLES STRICTES:
- Fais une traduction fidele et exacte, sans reformulation ni interpretation
- PRESERVE EXACTEMENT tout le code HTML, les balises, les attributs et leur structure
- PRESERVE les sauts de ligne, espaces, tabulations et mise en page
- PRESERVE les variables, placeholders (ex: {{variable}}, %s, {0}) et codes speciaux
- PRESERVE les URLs, emails, chemins de fichiers
- NE TRADUIS PAS les noms propres, marques, ou termes techniques anglais courants
- Reponds UNIQUEMENT avec la traduction, sans commentaire ni explication

Texte a traduire:
{text}`,

  en: `You are a professional translator. Translate the following text into English.

STRICT RULES:
- Provide a faithful and accurate translation, without rephrasing or interpretation
- PRESERVE EXACTLY all HTML code, tags, attributes and their structure
- PRESERVE line breaks, spaces, tabs and layout
- PRESERVE variables, placeholders (e.g.: {{variable}}, %s, {0}) and special codes
- PRESERVE URLs, emails, file paths
- DO NOT TRANSLATE proper nouns, brands, or common technical English terms
- Reply ONLY with the translation, without comment or explanation

Text to translate:
{text}`,

  es: `Eres un traductor profesional. Traduce el siguiente texto al espanol.

REGLAS ESTRICTAS:
- Realiza una traduccion fiel y exacta, sin reformular ni interpretar
- PRESERVA EXACTAMENTE todo el codigo HTML, las etiquetas, los atributos y su estructura
- PRESERVA los saltos de linea, espacios, tabulaciones y formato
- PRESERVA las variables, placeholders (ej: {{variable}}, %s, {0}) y codigos especiales
- PRESERVA las URLs, emails, rutas de archivos
- NO TRADUZCAS los nombres propios, marcas o terminos tecnicos ingleses comunes
- Responde UNICAMENTE con la traduccion, sin comentarios ni explicaciones

Texto a traducir:
{text}`,

  de: `Du bist ein professioneller Ubersetzer. Ubersetze den folgenden Text ins Deutsche.

STRENGE REGELN:
- Erstelle eine treue und genaue Ubersetzung, ohne Umformulierung oder Interpretation
- BEWAHRE EXAKT allen HTML-Code, Tags, Attribute und deren Struktur
- BEWAHRE Zeilenumbruche, Leerzeichen, Tabulatoren und Layout
- BEWAHRE Variablen, Platzhalter (z.B.: {{variable}}, %s, {0}) und Sondercodes
- BEWAHRE URLs, E-Mails, Dateipfade
- UBERSETZE NICHT Eigennamen, Marken oder gangige englische Fachbegriffe
- Antworte NUR mit der Ubersetzung, ohne Kommentar oder Erklarung

Zu ubersetzender Text:
{text}`,

  it: `Sei un traduttore professionista. Traduci il seguente testo in italiano.

REGOLE RIGIDE:
- Fornisci una traduzione fedele e accurata, senza riformulare o interpretare
- PRESERVA ESATTAMENTE tutto il codice HTML, i tag, gli attributi e la loro struttura
- PRESERVA le interruzioni di riga, gli spazi, le tabulazioni e il layout
- PRESERVA le variabili, i placeholder (es: {{variable}}, %s, {0}) e i codici speciali
- PRESERVA URL, email, percorsi di file
- NON TRADURRE nomi propri, marchi o termini tecnici inglesi comuni
- Rispondi SOLO con la traduzione, senza commenti o spiegazioni

Testo da tradurre:
{text}`,

  pt: `Voce e um tradutor profissional. Traduza o seguinte texto para portugues.

REGRAS ESTRITAS:
- Faca uma traducao fiel e exata, sem reformular ou interpretar
- PRESERVE EXATAMENTE todo o codigo HTML, as tags, os atributos e sua estrutura
- PRESERVE quebras de linha, espacos, tabulacoes e layout
- PRESERVE variaveis, placeholders (ex: {{variable}}, %s, {0}) e codigos especiais
- PRESERVE URLs, emails, caminhos de arquivos
- NAO TRADUZA nomes proprios, marcas ou termos tecnicos ingleses comuns
- Responda APENAS com a traducao, sem comentarios ou explicacoes

Texto a traduzir:
{text}`,

  nl: `Je bent een professionele vertaler. Vertaal de volgende tekst naar het Nederlands.

STRIKTE REGELS:
- Maak een getrouwe en nauwkeurige vertaling, zonder herformulering of interpretatie
- BEHOUD EXACT alle HTML-code, tags, attributen en hun structuur
- BEHOUD regeleinden, spaties, tabs en lay-out
- BEHOUD variabelen, placeholders (bijv.: {{variable}}, %s, {0}) en speciale codes
- BEHOUD URLs, e-mails, bestandspaden
- VERTAAL NIET eigennamen, merken of gangbare Engelse technische termen
- Antwoord ALLEEN met de vertaling, zonder commentaar of uitleg

Te vertalen tekst:
{text}`,

  pl: `Jestes profesjonalnym tlumaczem. Przetlumacz ponizszy tekst na jezyk polski.

SCISLE ZASADY:
- Wykonaj wierne i dokladne tlumaczenie, bez przeformulowania lub interpretacji
- ZACHOWAJ DOKLADNIE caly kod HTML, tagi, atrybuty i ich strukture
- ZACHOWAJ podzialy wierszy, spacje, tabulatory i uklad
- ZACHOWAJ zmienne, placeholdery (np.: {{variable}}, %s, {0}) i kody specjalne
- ZACHOWAJ adresy URL, e-maile, sciezki plikow
- NIE TLUMACZ nazw wlasnych, marek ani powszechnych angielskich terminow technicznych
- Odpowiedz TYLKO tlumaczeniem, bez komentarza lub wyjasnienia

Tekst do tlumaczenia:
{text}`,

  ru: `Vy professionalnyi perevodchik. Perevedite sleduyushchii tekst na russkii yazyk.

STROGIE PRAVILA:
- Sdelaite tochnyi i vernyi perevod, bez pereformulirovaniya ili interpretatsii
- SOKHRANITE TOCHNO ves kod HTML, tegi, atributy i ikh strukturu
- SOKHRANITE razryvy strok, probely, tabulyatsii i maket
- SOKHRANITE peremennye, zapolniteli (napr.: {{variable}}, %s, {0}) i spetsialnye kody
- SOKHRANITE URL-adresa, email, puti k failam
- NE PEREVODITE imena sobstvennye, brendy ili obshcheprinyatye angliiskie tekhnicheskie terminy
- Otvechaite TOLKO perevodom, bez kommentariev ili poyasnenii

Tekst dlya perevoda:
{text}`,

  ja: `Anata wa puro no honyakusha desu. Tsugi no tekisuto o nihongo ni honyaku shite kudasai.

GENSOKU:
- Seikaku de chuujitsu na honyaku o okonai, kaishaku ya iikae wa shinaide kudasai
- HTML kodo, tagu, zokusei, kozo o kanzen ni hozon shite kudasai
- Kaigyo, supeesu, tabu, reiauto o hozon shite kudasai
- Hensu, puresuhoruda (rei: {{variable}}, %s, {0}), tokushu kodo o hozon shite kudasai
- URL, meeru, fairu pasu o hozon shite kudasai
- Koyuumeishi, burando, ippantekina eigo no senmon yogo wa honyaku shinaide kudasai
- Honyaku nomi de henji shi, komento ya setsumei wa tsukete kudasai

Honyaku suru tekisuto:
{text}`,

  zh: `Ni shi zhuanye fanyi. Qing jiang yixia wenben fanyi cheng zhongwen.

YANGE GUIZE:
- Tigong zhongshi zhunque de fanyi, bu yao gaibian huozhe jieshi
- WANQUAN BAOLIU suoyou HTML daima, biaoqian, shuxing ji qi jiegou
- BAOLIU huanhang, konggé, zhifu he buju
- BAOLIU bianliang, zhanyufu (li: {{variable}}, %s, {0}) he teshu daima
- BAOLIU URL, youjian, wenjian lujing
- BU FANYI zhuanyou mingci, pinpai huo changyong yingyu jishu shuyu
- ZHI huifu fanyi, bu yao pinglun huo jieshi

Yao fanyi de wenben:
{text}`,

  ko: `Dangsin-eun jeonmun beonyeogga ibnida. Daeeum tekseuteureul hangugeo-ro beonyeok haseyo.

EOMGYEOKHAN GYUCHIK:
- Jeongwhakago chungsilhan beonyeog-eul jegonghago, jaehaeseog-ina byeonhyeong-eul haji maseyo
- HTML kodeu, taegeu, sogseong mit geu gujo-reul WANJEONHI BOJON haseyo
- Jul bakkum, gongbaek, tab mit reiautes-eul BOJON haseyo
- Byeonsu, placeholder (ye: {{variable}}, %s, {0}) mit teuksu kodeureul BOJON haseyo
- URL, imeil, pail gyeongroreul BOJON haseyo
- Goyumyeongsa, beuraendeu, ilban yeongeo gisul yong-eo-neun BEONYEOK HAJI maseyo
- Beonyeogman eungdaphago, seolmyeong-ina juseog-eun dalji maseyo

Beonyeokhal tekseoteu:
{text}`,

  ar: `Anta mutarjim muhtarif. Tarjim al-nass al-tali ila al-arabiya.

QAWA'ID SARIMA:
- Qaddim tarjama daqiqa wa amina, bidun i'adat siyagha aw tafsir
- IHFAZ BI-DIQQA jamia akwad HTML, al-wusum, al-sifat wa haykalaha
- IHFAZ fusul al-sutur, al-masafat, al-jadwala wa al-tansiq
- IHFAZ al-mutaghayyirat, al-'anasr al-na'iba (mithal: {{variable}}, %s, {0}) wa al-rumuz al-khassa
- IHFAZ rawabet URL, al-barid al-iliktuni, masarat al-milaffat
- LA TUTARJIM asma' al-a'lam, al-'alamat al-tijariya aw al-mustalahat al-tiqniya al-ingliziya al-sha'i'a
- Ajib BI-TARJAMA FAQAT, bidun ta'liq aw sharh

Al-nass lil-tarjama:
{text}`,

  hi: `Aap ek peshevar anuvaadak hain. Niche diye gaye text ka Hindi mein anuvaad karein.

KATHOR NIYAM:
- Vishwasaniya aur sateek anuvaad karein, bina kisi badlaav ya vyakhya ke
- HTML code, tags, attributes aur unki sanrachna ko POORI TARAH SURAKSHIT rakhein
- Line breaks, spaces, tabs aur layout ko SURAKSHIT rakhein
- Variables, placeholders (jaise: {{variable}}, %s, {0}) aur vishesh codes ko SURAKSHIT rakhein
- URLs, emails, file paths ko SURAKSHIT rakhein
- Vyaktigat naam, brands ya aam angrezi takniki shabdon ka ANUVAAD NA KAREIN
- SIRF anuvaad ke saath jawab dein, bina tippani ya vyakhya ke

Anuvaad karne ke liye text:
{text}`,

  tr: `Profesyonel bir cevirmenisiniz. Asagidaki metni Turkceye cevirin.

SIKI KURALLAR:
- Yeniden ifade etmeden veya yorumlamadan sadik ve dogru bir ceviri yapin
- Tum HTML kodunu, etiketleri, ozellikleri ve yapilarini TAM OLARAK KORUYUN
- Satir sonlarini, bosluklari, sekmeleri ve duzeni KORUYUN
- Degiskenleri, yer tutucularini (orn: {{variable}}, %s, {0}) ve ozel kodlari KORUYUN
- URL'leri, e-postalari, dosya yollarini KORUYUN
- Ozel isimleri, markalari veya yaygin Ingilizce teknik terimleri CEVIRMEYIN
- YALNIZCA ceviri ile yanit verin, yorum veya aciklama olmadan

Cevrilecek metin:
{text}`,

  vi: `Ban la mot dich gia chuyen nghiep. Hay dich van ban sau sang tieng Viet.

QUY TAC NGHIEM NGAT:
- Cung cap ban dich trung thuc va chinh xac, khong dien giai hoac thay doi
- BAO TOAN CHINH XAC tat ca ma HTML, the, thuoc tinh va cau truc cua chung
- BAO TOAN ngat dong, khoang trang, tab va bo cuc
- BAO TOAN cac bien, placeholder (vd: {{variable}}, %s, {0}) va ma dac biet
- BAO TOAN URL, email, duong dan tap tin
- KHONG DICH ten rieng, thuong hieu hoac thuat ngu ky thuat tieng Anh pho bien
- CHI tra loi bang ban dich, khong binh luan hoac giai thich

Van ban can dich:
{text}`,

  th: `Khun pen nakplae xachip. Plae khxkhwam txipni pen phasa thai.

KOTKAN KHEMNGWD:
- Hai karpla thi thukthxng laea mancng ody mimi karpleiynplaeng hrux kartiikhwam
- RAKSA HTML code tag attribute laea khorngrang thanghmid xyangthukthxng
- RAKSA karkhunkbrrthd chxngwang tab laea layout
- RAKSA tawpraen placeholder (chnn: {{variable}}, %s, {0}) laea rhad phiess
- RAKSA URL email snthangthi file
- HAM PLAE chuxechphaa brand hrux khasapth thekhnikh xangkrit thiwchai
- TXBKHLB dwy karpla theanan ody mimi khwamhen hrux khamxthibay

Khxkhwam thi txngkar plae:
{text}`,

  id: `Anda adalah penerjemah profesional. Terjemahkan teks berikut ke dalam Bahasa Indonesia.

ATURAN KETAT:
- Berikan terjemahan yang setia dan akurat, tanpa mengubah atau menafsirkan
- PERTAHANKAN PERSIS semua kode HTML, tag, atribut, dan strukturnya
- PERTAHANKAN jeda baris, spasi, tab, dan tata letak
- PERTAHANKAN variabel, placeholder (contoh: {{variable}}, %s, {0}) dan kode khusus
- PERTAHANKAN URL, email, jalur file
- JANGAN TERJEMAHKAN nama diri, merek, atau istilah teknis bahasa Inggris yang umum
- Jawab HANYA dengan terjemahan, tanpa komentar atau penjelasan

Teks untuk diterjemahkan:
{text}`,

  sv: `Du ar en professionell oversattare. Oversatt foljande text till svenska.

STRIKTA REGLER:
- Gor en trogen och exakt oversattning, utan omformulering eller tolkning
- BEVARA EXAKT all HTML-kod, taggar, attribut och deras struktur
- BEVARA radbrytningar, mellanslag, tabbar och layout
- BEVARA variabler, platshallare (t.ex.: {{variable}}, %s, {0}) och specialkoder
- BEVARA URL:er, e-postadresser, sokvagar
- OVERSATT INTE egennamn, varumarken eller vanliga engelska tekniska termer
- Svara ENDAST med oversattningen, utan kommentar eller forklaring

Text att oversatta:
{text}`,

  da: `Du er en professionel overssetter. Overssett folgende tekst til dansk.

STRENGE REGLER:
- Giv en trofast og nojagtig oversaettelse, uden omformulering eller fortolkning
- BEVAR PRAECIST al HTML-kode, tags, attributter og deres struktur
- BEVAR linjeskift, mellemrum, tabulatorer og layout
- BEVAR variabler, pladsholdere (f.eks.: {{variable}}, %s, {0}) og specialkoder
- BEVAR URL'er, e-mails, filstier
- OVERSSETT IKKE egennavne, vaeremaerker eller almindelige engelske tekniske termer
- Svar KUN med oversaettelsen, uden kommentar eller forklaring

Tekst til oversaettelse:
{text}`,

  no: `Du er en profesjonell oversetter. Oversett folgende tekst til norsk.

STRENGE REGLER:
- Gi en trofast og noyaktig oversettelse, uten omformulering eller tolkning
- BEVAR NOYAKTIG all HTML-kode, tagger, attributter og deres struktur
- BEVAR linjeskift, mellomrom, tabulatorer og layout
- BEVAR variabler, plassholdere (f.eks.: {{variable}}, %s, {0}) og spesialkoder
- BEVAR URL-er, e-poster, filbaner
- IKKE OVERSETT egennavn, varemerker eller vanlige engelske tekniske termer
- Svar KUN med oversettelsen, uten kommentar eller forklaring

Tekst som skal oversettes:
{text}`,

  fi: `Olet ammattikaantaja. Kaanna seuraava teksti suomeksi.

TIUKAT SAANNOT:
- Tee uskollinen ja tarkka kaannos, ilman uudelleenmuotoilua tai tulkintaa
- SAILYTA TARKASTI kaikki HTML-koodi, tagit, attribuutit ja niiden rakenne
- SAILYTA rivinvaihdot, valilyonnit, sarkaimet ja asettelu
- SAILYTA muuttujat, paikanvaraajat (esim.: {{variable}}, %s, {0}) ja erikoiskoodit
- SAILYTA URL-osoitteet, sahkopostit, tiedostopolut
- ALA KAANNA erisnimiä, tuotemerkkeja tai yleisia englanninkielisia teknisia termeja
- Vastaa VAIN kaannoksella, ilman kommenttia tai selitysta

Kaannettava teksti:
{text}`,

  cs: `Jste profesionalni prekladatel. Prelozte nasledujici text do cestiny.

PRISNA PRAVIDLA:
- Poskytnte verny a presny preklad, bez preformulovani nebo interpretace
- ZACHOVEJTE PRESNE veskerey HTML kod, tagy, atributy a jejich strukturu
- ZACHOVEJTE zalomeni radku, mezery, tabulatory a rozlozeni
- ZACHOVEJTE promenne, zastupne symboly (napr.: {{variable}}, %s, {0}) a specialni kody
- ZACHOVEJTE URL adresy, e-maily, cesty k souborum
- NEPREKLADEJTE vlastni jmena, znacky nebo bezne anglicke technicke terminy
- Odpovezte POUZE prekladem, bez komentare nebo vysvetleni

Text k prekladu:
{text}`,

  el: `Eiste epaggelmatias metafrastis. Metafrasite to parakato keimeno sta ellinika.

AFSTIRI KANONES:
- Parexete mia pisti kai akrivi metafrasi, xoris anasxediasmó i ermineia
- DIATIRISTE AKRIVOS olo ton kodika HTML, tis etiketes, ta xaraktiristika kai ti domi tous
- DIATIRISTE tis allages grammis, ta kena, tous stulous kai ti diataksi
- DIATIRISTE tis metavlites, ta placeholder (p.x.: {{variable}}, %s, {0}) kai tous eidikous kodikous
- DIATIRISTE ta URL, ta email, tis diadromés arxeion
- MI METAFRAZETE kyria onomata, brands i koines agglikes texnikes orologies
- Apantiste MONO me ti metafrasi, xoris sxolio i exigisi

Keimeno pros metafrasi:
{text}`,

  he: `Ata metargem miktzoi. Targem et hatext haba le'ivrit.

KLALIM MEHUDAKIM:
- Saper tirgum ne'eman umeduyak, bli nissuah mehudash o parshanut
- SHAMER BEDIYUK al kol kod HTML, tagim, tehunotav umivnehu
- SHAMER al shvitat shurot, revahim, tabim vearicha
- SHAMER al mishtanim, memale makom (dugma: {{variable}}, %s, {0}) vekodim meyuhadim
- SHAMER al URL, email, netivei kvarim
- AL LETARGEM shemot pratiyim, motgim o munachim tekhniyim angliyim nefutzim
- ANEH RAK betirgum, bli he'arot o hesberim

Text letargum:
{text}`,

  ro: `Esti un traducator profesionist. Tradu urmatorul text in romana.

REGULI STRICTE:
- Ofera o traducere fidela si exacta, fara reformulare sau interpretare
- PASTREAZA EXACT tot codul HTML, etichetele, atributele si structura lor
- PASTREAZA intreruperile de linie, spatiile, tab-urile si aspectul
- PASTREAZA variabilele, placeholder-ele (ex: {{variable}}, %s, {0}) si codurile speciale
- PASTREAZA URL-urile, email-urile, caile de fisiere
- NU TRADUCE numele proprii, marcile sau termenii tehnici englezi comuni
- Raspunde DOAR cu traducerea, fara comentarii sau explicatii

Text de tradus:
{text}`,

  hu: `On professzionalis fordito. Forditsa le a kovetkezo szoveget magyarra.

SZIGORU SZABALYOK:
- Adjon hu es pontos forditast, atfogalmazas vagy ertelmezés nelkul
- ORIZZE MEG PONTOSAN az osszes HTML kodot, cimet, attributumot es azok szerkezetet
- ORIZZE MEG a sortoreseket, szokozoket, tabulatorokat es az elrendezest
- ORIZZE MEG a valtozokat, helyorzokat (pl.: {{variable}}, %s, {0}) es specialis kodokat
- ORIZZE MEG az URL-eket, e-maileket, fajl utvonalakat
- NE FORDITSA le a tulajdonneveket, markakat vagy altalanos angol muszaki kifejezeseket
- CSAK a forditassal valaszoljon, megjegyzes vagy magyarazat nelkul

Leforditando szoveg:
{text}`,

  uk: `Vy profesiinyi perekladach. Perekladit nastupnyi tekst ukrainskoiu movoiu.

SUVORI PRAVYLA:
- Nadaite tochnyi i virnyi pereklad, bez pereformulovannia abo interpretatsii
- ZBEREZHIT TOCHNO ves kod HTML, tehy, atrybuty ta yikh strukturu
- ZBEREZHIT rozryvy riadkiv, probily, tabuliatsii ta maket
- ZBEREZHIT zminni, zapovniuvachi (napryklad: {{variable}}, %s, {0}) ta spetsialni kody
- ZBEREZHIT URL-adresy, email, shliakhy do failiv
- NE PEREKLADAITE vlasni imena, brendy abo zahalnopryiniati anhliiski tekhnichni terminy
- Vidpovidaite LYSHE perekldom, bez komentariv abo poiasnen

Tekst dlia perekladu:
{text}`
};

/**
 * Liste des langues disponibles avec leurs ratios caracteres/token
 */
export const LANGUAGES = [
  { code: 'fr', name: 'Francais', charsPerToken: 3.65 },
  { code: 'en', name: 'Anglais', charsPerToken: 4.75 },
  { code: 'es', name: 'Espagnol', charsPerToken: 3.63 },
  { code: 'de', name: 'Allemand', charsPerToken: 3.2 },
  { code: 'it', name: 'Italien', charsPerToken: 3.5 },
  { code: 'pt', name: 'Portugais', charsPerToken: 3.5 },
  { code: 'nl', name: 'Neerlandais', charsPerToken: 3.2 },
  { code: 'pl', name: 'Polonais', charsPerToken: 2.6 },
  { code: 'ru', name: 'Russe', charsPerToken: 2.1 },
  { code: 'ja', name: 'Japonais', charsPerToken: 1.41 },
  { code: 'zh', name: 'Chinois', charsPerToken: 1.33 },
  { code: 'ko', name: 'Coreen', charsPerToken: 1.2 },
  { code: 'ar', name: 'Arabe', charsPerToken: 1.5 },
  { code: 'hi', name: 'Hindi', charsPerToken: 1.2 },
  { code: 'tr', name: 'Turc', charsPerToken: 2.85 },
  { code: 'vi', name: 'Vietnamien', charsPerToken: 2.5 },
  { code: 'th', name: 'Thai', charsPerToken: 1.3 },
  { code: 'id', name: 'Indonesien', charsPerToken: 3.8 },
  { code: 'sv', name: 'Suedois', charsPerToken: 3.4 },
  { code: 'da', name: 'Danois', charsPerToken: 3.4 },
  { code: 'no', name: 'Norvegien', charsPerToken: 3.4 },
  { code: 'fi', name: 'Finnois', charsPerToken: 2.8 },
  { code: 'cs', name: 'Tcheque', charsPerToken: 2.5 },
  { code: 'el', name: 'Grec', charsPerToken: 2.0 },
  { code: 'he', name: 'Hebreu', charsPerToken: 1.2 },
  { code: 'ro', name: 'Roumain', charsPerToken: 3.3 },
  { code: 'hu', name: 'Hongrois', charsPerToken: 2.7 },
  { code: 'uk', name: 'Ukrainien', charsPerToken: 2.0 }
];

/**
 * Obtient le prompt pour une langue donnee
 */
export function getPromptForLanguage(langCode) {
  return PROMPTS_BY_LANGUAGE[langCode] || PROMPTS_BY_LANGUAGE['en'];
}

/**
 * Obtient le ratio caracteres/token pour une langue
 */
export function getCharsPerToken(langCode) {
  const lang = LANGUAGES.find(l => l.code === langCode);
  return lang ? lang.charsPerToken : 3.0; // Default
}

/**
 * Obtient les infos d'une langue
 */
export function getLanguageInfo(langCode) {
  return LANGUAGES.find(l => l.code === langCode) || { code: langCode, name: langCode, charsPerToken: 3.0 };
}
