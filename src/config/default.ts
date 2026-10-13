import type { SiteConfig } from "./types";

// Fallback config used when the Google Sheet is not configured or unreachable.
// It is also the seed for the sheet (scripts/sheet-seed.ts).
// TODO: replace placeholder contacts, prices and verify warranty/payment terms.
export const defaultConfig: SiteConfig = {
  url: "https://example.com",
  geo: { lat: 46.4825, lng: 30.7233 },
  postalCode: "65000",
  country: "UA",
  phone: "+380000000000",
  phoneDisplay: "+38 (000) 000-00-00",
  telegram: "https://t.me/username",
  viber: "viber://chat?number=%2B380000000000",
  timeZone: "Europe/Kyiv",
  novaPoshta: { recipient: "Прізвище Ім'я По батькові", phone: "+380000000000", branch: "Одеса, відділення №1" },
  schedule: [
    { days: [1, 2, 3, 4, 5], from: "09:00", to: "18:00" },
    { days: [6], from: "09:00", to: "14:00" },
  ],
  texts: {
    name: { uk: "DieselMedic", ru: "DieselMedic", en: "DieselMedic" },
    city: { uk: "Одеса", ru: "Одесса", en: "Odesa" },
    cityIn: { uk: "в Одесі", ru: "в Одессе", en: "in Odesa" },
    street: { uk: "вул. Прикладна, 1", ru: "ул. Примерная, 1", en: "1 Prykladna St" },
    region: { uk: "Одеська область", ru: "Одесская область", en: "Odesa Oblast" },
    description: {
      uk: "Ремонт знятих паливних насосів високого тиску (ПНВТ/ТНВД) і дизельних форсунок. Перевірка на стенді, протокол до і після ремонту, відправка Новою поштою по всій Україні.",
      ru: "Ремонт снятых топливных насосов высокого давления (ТНВД) и дизельных форсунок. Проверка на стенде, протокол до и после ремонта, отправка Новой почтой по всей Украине.",
      en: "Repair of removed diesel high-pressure fuel pumps and injectors. Bench testing, before-and-after test reports, shipping via Nova Poshta across Ukraine.",
    },
    shipping: {
      uk: "Приймаємо зняті ПНВТ і форсунки Новою поштою з усієї України",
      ru: "Принимаем снятые ТНВД и форсунки Новой почтой со всей Украины",
      en: "We accept removed pumps and injectors via Nova Poshta from all over Ukraine",
    },
  },

  services: [
    /* ---------------- Injectors ---------------- */
    {
      slug: "remont-forsunok",
      group: "injectors",
      priceFrom: 600,
      perUnitOptions: [1, 2, 3, 4, 6, 8],
      perUnitLabel: { uk: "Кількість форсунок", ru: "Количество форсунок", en: "Number of injectors" },
      title: {
        uk: "Ремонт форсунок Common Rail",
        ru: "Ремонт форсунок Common Rail",
        en: "Common Rail injector repair",
      },
      h1: {
        uk: "Ремонт електромагнітних форсунок Common Rail",
        ru: "Ремонт электромагнитных форсунок Common Rail",
        en: "Solenoid Common Rail injector repair",
      },
      short: {
        uk: "Bosch, Denso, Delphi. Тест на стенді, заміна клапанів і розпилювачів.",
        ru: "Bosch, Denso, Delphi. Тест на стенде, замена клапанов и распылителей.",
        en: "Bosch, Denso, Delphi. Bench test, valve and nozzle replacement.",
      },
      description: {
        uk: "Відновлюємо зняті електромагнітні форсунки Common Rail Bosch, Denso, Delphi. Перевіряємо на стенді, замінюємо зношені деталі й показуємо результат до і після ремонту.",
        ru: "Восстанавливаем снятые электромагнитные форсунки Common Rail Bosch, Denso, Delphi. Проверяем на стенде, меняем изношенные детали и показываем результат до и после ремонта.",
        en: "We restore removed solenoid Common Rail injectors by Bosch, Denso and Delphi: bench testing, replacement of worn parts and a before-and-after report.",
      },
      includes: {
        uk: [
          "Тест на стенді з протоколом до і після ремонту",
          "Ультразвукова чистка",
          "Заміна розпилювачів, клапанів, ущільнень",
          "Регулювання ходу якоря та зазорів",
          "Коди коригування (IMA/QR) для прописування в ЕБУ",
        ],
        ru: [
          "Тест на стенде с протоколом до и после ремонта",
          "Ультразвуковая чистка",
          "Замена распылителей, клапанов, уплотнений",
          "Регулировка хода якоря и зазоров",
          "Коды коррекции (IMA/QR) для прописывания в ЭБУ",
        ],
        en: [
          "Bench test with before-and-after report",
          "Ultrasonic cleaning",
          "Replacement of nozzles, valves and seals",
          "Armature stroke and clearance adjustment",
          "Correction codes (IMA/QR) for ECU coding",
        ],
      },
      body: {
        uk: "## Коли потрібен ремонт форсунок\n- Важкий запуск, особливо на гарячу\n- Чорний або сизий дим, стукіт форсунок\n- Підвищена витрата палива, втрата потужності\n- Помилки корекції подачі по циліндрах\n- Великий зворотний злив\n\n## Як ми ремонтуємо\nСпочатку перевіряємо форсунку на стенді за кількома режимами: холостий хід, середнє навантаження, повна подача, попередній впорскування та зворотний злив. Так видно, що саме зношено — розпилювач, клапан чи сама форсунка.\n\nПісля розбирання й ультразвукової чистки замінюємо лише ті деталі, які цього потребують, і регулюємо зазори. Повторний тест показує, що форсунка повернулась у допуск виробника. Протокол «до» і «після» ви отримуєте разом із деталями.\n\n## Які форсунки приймаємо\nЕлектромагнітні форсунки Bosch (серії 0 445 110 / 0 445 120), Denso, Delphi для легкових авто, мікроавтобусів і вантажівок.",
        ru: "## Когда нужен ремонт форсунок\n- Тяжёлый запуск, особенно на горячую\n- Чёрный или сизый дым, стук форсунок\n- Повышенный расход топлива, потеря мощности\n- Ошибки коррекции подачи по цилиндрам\n- Большой обратный слив\n\n## Как мы ремонтируем\nСначала проверяем форсунку на стенде в нескольких режимах: холостой ход, средняя нагрузка, полная подача, предвпрыск и обратный слив. Так видно, что именно изношено — распылитель, клапан или сама форсунка.\n\nПосле разборки и ультразвуковой чистки меняем только те детали, которые этого требуют, и регулируем зазоры. Повторный тест показывает, что форсунка вернулась в допуск производителя. Протокол «до» и «после» вы получаете вместе с деталями.\n\n## Какие форсунки принимаем\nЭлектромагнитные форсунки Bosch (серии 0 445 110 / 0 445 120), Denso, Delphi для легковых авто, микроавтобусов и грузовиков.",
        en: "## When injectors need repair\n- Hard starting, especially when hot\n- Black or blue smoke, injector knock\n- Higher fuel consumption, loss of power\n- Per-cylinder fuel correction errors\n- Excessive back-leak\n\n## How we repair them\nWe first test the injector on a bench in several modes: idle, part load, full load, pilot injection and back-leak. This shows exactly what is worn — the nozzle, the valve or the injector body.\n\nAfter disassembly and ultrasonic cleaning we replace only the parts that need it and adjust the clearances. A second test confirms the injector is back within the manufacturer's tolerance. You get the before-and-after report together with the parts.\n\n## Which injectors we accept\nSolenoid injectors by Bosch (0 445 110 / 0 445 120 series), Denso and Delphi for cars, vans and trucks.",
      },
      faq: [
        {
          q: {
            uk: "Скільки триває ремонт форсунок?",
            ru: "Сколько длится ремонт форсунок?",
            en: "How long does injector repair take?",
          },
          a: {
            uk: "Зазвичай 1–2 робочі дні з моменту отримання, залежно від наявності запчастин.",
            ru: "Обычно 1–2 рабочих дня с момента получения, в зависимости от наличия запчастей.",
            en: "Usually 1–2 business days after we receive them, depending on parts availability.",
          },
        },
        {
          q: {
            uk: "Чи можна ремонтувати лише одну форсунку?",
            ru: "Можно ли ремонтировать только одну форсунку?",
            en: "Can I repair just one injector?",
          },
          a: {
            uk: "Можна, але радимо перевірити весь комплект: зазвичай форсунки зношуються рівномірно, і за тестом видно, яким потрібен ремонт.",
            ru: "Можно, но советуем проверить весь комплект: обычно форсунки изнашиваются равномерно, и по тесту видно, каким нужен ремонт.",
            en: "Yes, but we recommend testing the whole set: injectors usually wear evenly, and the test shows which ones need repair.",
          },
        },
      ],
    },
    {
      slug: "remont-pyezoforsunok",
      group: "injectors",
      priceFrom: 1200,
      perUnitOptions: [1, 2, 3, 4, 6, 8],
      perUnitLabel: { uk: "Кількість форсунок", ru: "Количество форсунок", en: "Number of injectors" },
      title: { uk: "Ремонт п'єзофорсунок", ru: "Ремонт пьезофорсунок", en: "Piezo injector repair" },
      h1: {
        uk: "Ремонт п'єзофорсунок Bosch, Siemens (Continental), Denso",
        ru: "Ремонт пьезофорсунок Bosch, Siemens (Continental), Denso",
        en: "Piezo injector repair: Bosch, Siemens (Continental), Denso",
      },
      short: {
        uk: "Діагностика п'єзоелемента, заміна клапана й розпилювача.",
        ru: "Диагностика пьезоэлемента, замена клапана и распылителя.",
        en: "Piezo stack diagnostics, valve and nozzle replacement.",
      },
      description: {
        uk: "Ремонтуємо зняті п'єзофорсунки Bosch, Siemens VDO (Continental) і Denso. Перевіряємо п'єзоелемент, клапан і розпилювач на стенді, видаємо протокол і коди коригування.",
        ru: "Ремонтируем снятые пьезофорсунки Bosch, Siemens VDO (Continental) и Denso. Проверяем пьезоэлемент, клапан и распылитель на стенде, выдаём протокол и коды коррекции.",
        en: "We repair removed piezo injectors by Bosch, Siemens VDO (Continental) and Denso: bench testing of the piezo stack, valve and nozzle, with a report and correction codes.",
      },
      includes: {
        uk: ["Перевірка ємності й опору п'єзоелемента", "Тест на стенді до і після ремонту", "Заміна розпилювача та клапанної групи", "Коди коригування для ЕБУ"],
        ru: ["Проверка ёмкости и сопротивления пьезоэлемента", "Тест на стенде до и после ремонта", "Замена распылителя и клапанной группы", "Коды коррекции для ЭБУ"],
        en: ["Piezo stack capacitance and resistance check", "Bench test before and after repair", "Nozzle and valve group replacement", "ECU correction codes"],
      },
      body: {
        uk: "## Особливості п'єзофорсунок\nП'єзофорсунки працюють швидше за електромагнітні й дають точніше впорскування, але вони чутливіші до якості палива. Найчастіше зношується клапанна група й розпилювач, рідше — сам п'єзоелемент.\n\n## Що ми перевіряємо\n- Електричні параметри п'єзоелемента\n- Подачу на різних режимах і зворотний злив\n- Герметичність і форму факела розпилу\n\nЯкщо п'єзоелемент справний, форсунку можна відновити заміною клапана й розпилювача — це значно дешевше за нову. Якщо ні, чесно скажемо про це до ремонту.\n\n## Які форсунки приймаємо\nBosch CRI3 (п'єзо), Siemens VDO / Continental для VAG, Ford, PSA, Denso п'єзо для Toyota.",
        ru: "## Особенности пьезофорсунок\nПьезофорсунки работают быстрее электромагнитных и дают более точный впрыск, но они чувствительнее к качеству топлива. Чаще всего изнашивается клапанная группа и распылитель, реже — сам пьезоэлемент.\n\n## Что мы проверяем\n- Электрические параметры пьезоэлемента\n- Подачу на разных режимах и обратный слив\n- Герметичность и форму факела распыла\n\nЕсли пьезоэлемент исправен, форсунку можно восстановить заменой клапана и распылителя — это значительно дешевле новой. Если нет, честно скажем об этом до ремонта.\n\n## Какие форсунки принимаем\nBosch CRI3 (пьезо), Siemens VDO / Continental для VAG, Ford, PSA, Denso пьезо для Toyota.",
        en: "## About piezo injectors\nPiezo injectors switch faster than solenoid ones and give more precise injection, but they are more sensitive to fuel quality. The valve group and nozzle wear most often; the piezo stack itself fails less frequently.\n\n## What we check\n- Electrical parameters of the piezo stack\n- Delivery in different modes and back-leak\n- Sealing and spray pattern\n\nIf the piezo stack is healthy, the injector can be restored by replacing the valve and nozzle — much cheaper than a new one. If not, we tell you honestly before any repair.\n\n## Which injectors we accept\nBosch CRI3 (piezo), Siemens VDO / Continental for VAG, Ford, PSA, and Denso piezo for Toyota.",
      },
      faq: [
        {
          q: {
            uk: "Чи ремонтуються п'єзофорсунки Siemens?",
            ru: "Ремонтируются ли пьезофорсунки Siemens?",
            en: "Can Siemens piezo injectors be repaired?",
          },
          a: {
            uk: "Так, якщо п'єзоелемент справний. Це видно після перевірки на стенді — до початку ремонту.",
            ru: "Да, если пьезоэлемент исправен. Это видно после проверки на стенде — до начала ремонта.",
            en: "Yes, if the piezo stack is healthy. We can tell after the bench test, before any repair starts.",
          },
        },
      ],
    },
    {
      slug: "remont-nasos-forsunok",
      group: "injectors",
      priceFrom: 800,
      perUnitOptions: [1, 2, 3, 4, 5, 6],
      perUnitLabel: { uk: "Кількість насос-форсунок", ru: "Количество насос-форсунок", en: "Number of unit injectors" },
      title: { uk: "Ремонт насос-форсунок", ru: "Ремонт насос-форсунок", en: "Unit injector repair" },
      h1: {
        uk: "Ремонт насос-форсунок (PD, PDE)",
        ru: "Ремонт насос-форсунок (PD, PDE)",
        en: "Unit injector repair (PD, PDE)",
      },
      short: {
        uk: "VAG PD, вантажні PDE: перевірка, ремкомплекти, регулювання.",
        ru: "VAG PD, грузовые PDE: проверка, ремкомплекты, регулировка.",
        en: "VAG PD and truck PDE: testing, repair kits, calibration.",
      },
      description: {
        uk: "Відновлюємо зняті насос-форсунки VAG (PD/Pumpe-Düse) та вантажні PDE: перевірка на стенді, заміна ремкомплектів, розпилювачів і клапанів, регулювання.",
        ru: "Восстанавливаем снятые насос-форсунки VAG (PD/Pumpe-Düse) и грузовые PDE: проверка на стенде, замена ремкомплектов, распылителей и клапанов, регулировка.",
        en: "We restore removed VAG PD (Pumpe-Düse) and truck PDE unit injectors: bench testing, repair kits, nozzles and valves, calibration.",
      },
      includes: {
        uk: ["Тест на стенді", "Заміна ущільнень і ремкомплекту", "Заміна розпилювача за потреби", "Протокол випробувань"],
        ru: ["Тест на стенде", "Замена уплотнений и ремкомплекта", "Замена распылителя при необходимости", "Протокол испытаний"],
        en: ["Bench test", "Seal and repair kit replacement", "Nozzle replacement if needed", "Test report"],
      },
      body: {
        uk: "## Типові несправності насос-форсунок\n- Пропуск палива в масло (зростає рівень масла)\n- Нерівна робота на холостому ходу\n- Важкий запуск і димлення\n- Помилки балансування циліндрів\n\n## Що робимо\nПеревіряємо насос-форсунки на стенді, оцінюємо подачу та герметичність, замінюємо ущільнення й ремкомплекти, за потреби — розпилювач і клапан. Після ремонту повторно тестуємо й видаємо протокол.\n\n## Які приймаємо\nНасос-форсунки VAG 1.9 / 2.0 TDI PD, а також PDE для вантажних авто.",
        ru: "## Типичные неисправности насос-форсунок\n- Пропуск топлива в масло (растёт уровень масла)\n- Неровная работа на холостом ходу\n- Тяжёлый запуск и дымность\n- Ошибки балансировки цилиндров\n\n## Что делаем\nПроверяем насос-форсунки на стенде, оцениваем подачу и герметичность, меняем уплотнения и ремкомплекты, при необходимости — распылитель и клапан. После ремонта повторно тестируем и выдаём протокол.\n\n## Какие принимаем\nНасос-форсунки VAG 1.9 / 2.0 TDI PD, а также PDE для грузовых авто.",
        en: "## Typical unit injector faults\n- Fuel leaking into the oil (rising oil level)\n- Rough idle\n- Hard starting and smoke\n- Cylinder balancing errors\n\n## What we do\nWe bench-test the unit injectors, check delivery and sealing, replace seals and repair kits and, if needed, the nozzle and valve. After the repair we test again and give you a report.\n\n## Which ones we accept\nVAG 1.9 / 2.0 TDI PD unit injectors and PDE units for trucks.",
      },
      faq: [],
    },
    {
      slug: "remont-mekhanichnykh-forsunok",
      group: "injectors",
      priceFrom: 300,
      perUnitOptions: [1, 2, 3, 4, 6, 8],
      perUnitLabel: { uk: "Кількість форсунок", ru: "Количество форсунок", en: "Number of injectors" },
      title: { uk: "Ремонт механічних форсунок", ru: "Ремонт механических форсунок", en: "Mechanical injector repair" },
      h1: {
        uk: "Ремонт механічних дизельних форсунок",
        ru: "Ремонт механических дизельных форсунок",
        en: "Mechanical diesel injector repair",
      },
      short: {
        uk: "Регулювання тиску відкриття, заміна розпилювачів.",
        ru: "Регулировка давления открытия, замена распылителей.",
        en: "Opening pressure adjustment, nozzle replacement.",
      },
      description: {
        uk: "Ремонт механічних форсунок легкових авто, вантажівок, тракторів і спецтехніки: перевірка тиску відкриття, якості розпилу, заміна розпилювачів і регулювання.",
        ru: "Ремонт механических форсунок легковых авто, грузовиков, тракторов и спецтехники: проверка давления открытия, качества распыла, замена распылителей и регулировка.",
        en: "Repair of mechanical injectors for cars, trucks, tractors and machinery: opening pressure and spray checks, nozzle replacement and adjustment.",
      },
      includes: {
        uk: ["Перевірка тиску відкриття", "Перевірка розпилу й герметичності", "Заміна розпилювачів", "Регулювання"],
        ru: ["Проверка давления открытия", "Проверка распыла и герметичности", "Замена распылителей", "Регулировка"],
        en: ["Opening pressure check", "Spray pattern and sealing check", "Nozzle replacement", "Adjustment"],
      },
      body: {
        uk: "## Коли варто перевірити\nМеханічні форсунки стоять на старіших дизелях, сільгосптехніці й генераторах. Ознаки зносу: димлення, важкий запуск, нерівна робота й підвищена витрата.\n\n## Що робимо\nНа стенді перевіряємо тиск початку впорскування, форму факела й герметичність голки. Замінюємо розпилювачі, регулюємо тиск відкриття шайбами чи гвинтом і повторно тестуємо весь комплект, щоб форсунки працювали однаково.",
        ru: "## Когда стоит проверить\nМеханические форсунки стоят на старых дизелях, сельхозтехнике и генераторах. Признаки износа: дымность, тяжёлый запуск, неровная работа и повышенный расход.\n\n## Что делаем\nНа стенде проверяем давление начала впрыска, форму факела и герметичность иглы. Меняем распылители, регулируем давление открытия шайбами или винтом и повторно тестируем весь комплект, чтобы форсунки работали одинаково.",
        en: "## When to check them\nMechanical injectors are used on older diesels, farm machinery and generators. Signs of wear: smoke, hard starting, rough running and higher fuel use.\n\n## What we do\nOn the bench we check the opening pressure, spray pattern and needle sealing. We replace nozzles, set the opening pressure with shims or a screw, and re-test the whole set so all injectors work evenly.",
      },
      faq: [],
    },

    /* ---------------- Pumps ---------------- */
    {
      slug: "remont-pnvt",
      group: "pumps",
      priceFrom: 1500,
      title: { uk: "Ремонт ПНВТ (ТНВД)", ru: "Ремонт ТНВД", en: "Fuel injection pump repair" },
      h1: {
        uk: "Ремонт знятих паливних насосів високого тиску (ПНВТ, ТНВД)",
        ru: "Ремонт снятых топливных насосов высокого давления (ТНВД)",
        en: "Repair of removed diesel high-pressure fuel pumps",
      },
      short: {
        uk: "Рядні, розподільчі та насоси Common Rail усіх виробників.",
        ru: "Рядные, распределительные и насосы Common Rail всех производителей.",
        en: "Inline, distributor and Common Rail pumps of all makes.",
      },
      description: {
        uk: "Відновлюємо зняті ПНВТ усіх типів: рядні, розподільчі (VE, VP) та насоси Common Rail. Дефектовка з фотозвітом, регулювання на стенді за заводськими параметрами.",
        ru: "Восстанавливаем снятые ТНВД всех типов: рядные, распределительные (VE, VP) и насосы Common Rail. Дефектовка с фотоотчётом, регулировка на стенде по заводским параметрам.",
        en: "We rebuild removed pumps of all types: inline, distributor (VE, VP) and Common Rail. Inspection with photo report, bench calibration to factory specs.",
      },
      includes: {
        uk: ["Дефектовка з фотозвітом", "Заміна плунжерних пар і ремкомплектів", "Регулювання на стенді", "Протокол стендових випробувань"],
        ru: ["Дефектовка с фотоотчётом", "Замена плунжерных пар и ремкомплектов", "Регулировка на стенде", "Протокол стендовых испытаний"],
        en: ["Inspection with photo report", "Plunger and repair kit replacement", "Bench calibration", "Bench test report"],
      },
      body: {
        uk: "## Ознаки несправності ПНВТ\n- Важкий запуск або двигун глухне\n- Втрата потужності, «провали» при розгоні\n- Помилки тиску палива в рейці\n- Течі палива з насоса\n- Металева стружка в паливі\n\n## Як проходить ремонт\nПісля отримання насос розбираємо й робимо дефектовку — надсилаємо фото зношених деталей і узгоджуємо вартість. Лише після вашого підтвердження замінюємо деталі, збираємо й регулюємо насос на стенді. Ви отримуєте протокол випробувань.\n\n## Важливо\nЯкщо в насосі була стружка, обов'язково промийте паливну систему й замініть фільтр перед встановленням — інакше новий ремонт зруйнується так само.",
        ru: "## Признаки неисправности ТНВД\n- Тяжёлый запуск или двигатель глохнет\n- Потеря мощности, «провалы» при разгоне\n- Ошибки давления топлива в рейке\n- Течи топлива из насоса\n- Металлическая стружка в топливе\n\n## Как проходит ремонт\nПосле получения насос разбираем и делаем дефектовку — присылаем фото изношенных деталей и согласовываем стоимость. Только после вашего подтверждения меняем детали, собираем и регулируем насос на стенде. Вы получаете протокол испытаний.\n\n## Важно\nЕсли в насосе была стружка, обязательно промойте топливную систему и замените фильтр перед установкой — иначе новый ремонт разрушится так же.",
        en: "## Signs of a faulty pump\n- Hard starting or stalling\n- Loss of power, hesitation under acceleration\n- Rail pressure errors\n- Fuel leaks from the pump\n- Metal particles in the fuel\n\n## How the repair works\nOnce we receive the pump, we disassemble and inspect it, send you photos of the worn parts and agree the price. Only after your confirmation do we replace parts, reassemble and calibrate the pump on the bench. You get a test report.\n\n## Important\nIf the pump had metal particles, flush the fuel system and replace the filter before installing it — otherwise the rebuilt pump will fail the same way.",
      },
      faq: [
        {
          q: {
            uk: "Як зрозуміти, що несправний ПНВТ?",
            ru: "Как понять, что неисправен ТНВД?",
            en: "How do I know the pump is faulty?",
          },
          a: {
            uk: "Типові ознаки: важкий запуск, втрата потужності, підвищена витрата палива, помилки тиску в рейці, течі.",
            ru: "Типичные признаки: тяжёлый запуск, потеря мощности, повышенный расход топлива, ошибки давления в рейке, течи.",
            en: "Typical signs: hard starting, loss of power, higher fuel consumption, rail pressure errors, leaks.",
          },
        },
      ],
    },
    {
      slug: "remont-pnvt-common-rail",
      group: "pumps",
      priceFrom: 2500,
      title: {
        uk: "Ремонт насосів Common Rail",
        ru: "Ремонт насосов Common Rail",
        en: "Common Rail pump repair",
      },
      h1: {
        uk: "Ремонт ПНВТ Common Rail: Bosch CP1, CP3, CP4, Denso, Delphi",
        ru: "Ремонт ТНВД Common Rail: Bosch CP1, CP3, CP4, Denso, Delphi",
        en: "Common Rail pump repair: Bosch CP1, CP3, CP4, Denso, Delphi",
      },
      short: {
        uk: "Bosch CP1/CP3/CP4, Denso HP, Delphi DFP — з регулюванням на стенді.",
        ru: "Bosch CP1/CP3/CP4, Denso HP, Delphi DFP — с регулировкой на стенде.",
        en: "Bosch CP1/CP3/CP4, Denso HP, Delphi DFP — bench calibrated.",
      },
      description: {
        uk: "Ремонт знятих насосів Common Rail Bosch CP1, CP3, CP4, Denso HP2/HP3/HP4, Delphi DFP: дефектовка, заміна зношених деталей і клапанів регулювання, перевірка продуктивності на стенді.",
        ru: "Ремонт снятых насосов Common Rail Bosch CP1, CP3, CP4, Denso HP2/HP3/HP4, Delphi DFP: дефектовка, замена изношенных деталей и клапанов регулировки, проверка производительности на стенде.",
        en: "Repair of removed Common Rail pumps — Bosch CP1, CP3, CP4, Denso HP2/HP3/HP4, Delphi DFP: inspection, replacement of worn parts and control valves, bench output test.",
      },
      includes: {
        uk: ["Дефектовка з фотозвітом", "Заміна плунжерів, ущільнень, підшипників", "Перевірка клапанів регулювання тиску й дозування", "Тест продуктивності на стенді"],
        ru: ["Дефектовка с фотоотчётом", "Замена плунжеров, уплотнений, подшипников", "Проверка клапанов регулировки давления и дозирования", "Тест производительности на стенде"],
        en: ["Inspection with photo report", "Replacement of plungers, seals, bearings", "Pressure and metering valve check", "Bench output test"],
      },
      body: {
        uk: "## Які насоси Common Rail ремонтуємо\n- Bosch CP1, CP1H, CP3, CP4\n- Denso HP2, HP3, HP4\n- Delphi DFP1, DFP3, DFP6\n\n## Що найчастіше виходить з ладу\nУ насосах Common Rail зношуються плунжерні пари, кулачок і підшипники, а також клапани регулювання тиску (DRV) і дозування (ZME/SCV). Через неякісне паливо в насосі з'являється стружка, яка потрапляє у форсунки.\n\n## Наш підхід\nРемонтуємо лише після дефектовки й узгодження вартості. Після збирання насос перевіряємо на стенді: тиск, продуктивність і роботу клапанів. Якщо в системі була стружка, порадимо, що ще перевірити, щоб ремонт прослужив довго.",
        ru: "## Какие насосы Common Rail ремонтируем\n- Bosch CP1, CP1H, CP3, CP4\n- Denso HP2, HP3, HP4\n- Delphi DFP1, DFP3, DFP6\n\n## Что чаще всего выходит из строя\nВ насосах Common Rail изнашиваются плунжерные пары, кулачок и подшипники, а также клапаны регулировки давления (DRV) и дозирования (ZME/SCV). Из-за некачественного топлива в насосе появляется стружка, которая попадает в форсунки.\n\n## Наш подход\nРемонтируем только после дефектовки и согласования стоимости. После сборки насос проверяем на стенде: давление, производительность и работу клапанов. Если в системе была стружка, подскажем, что ещё проверить, чтобы ремонт прослужил долго.",
        en: "## Common Rail pumps we repair\n- Bosch CP1, CP1H, CP3, CP4\n- Denso HP2, HP3, HP4\n- Delphi DFP1, DFP3, DFP6\n\n## What usually fails\nIn Common Rail pumps the plungers, cam and bearings wear, as do the pressure control (DRV) and metering (ZME/SCV) valves. Poor fuel creates metal particles in the pump that then reach the injectors.\n\n## Our approach\nWe repair only after inspection and agreeing the price. After assembly the pump is bench-tested for pressure, output and valve operation. If the system had metal particles, we tell you what else to check so the repair lasts.",
      },
      faq: [
        {
          q: {
            uk: "Чи варто ремонтувати Bosch CP4?",
            ru: "Стоит ли ремонтировать Bosch CP4?",
            en: "Is a Bosch CP4 worth repairing?",
          },
          a: {
            uk: "Так, якщо корпус і вал не пошкоджені. Після дефектовки скажемо, що вигідніше — ремонт чи заміна.",
            ru: "Да, если корпус и вал не повреждены. После дефектовки скажем, что выгоднее — ремонт или замена.",
            en: "Yes, if the housing and shaft are undamaged. After inspection we tell you which is cheaper — repair or replacement.",
          },
        },
      ],
    },
    {
      slug: "remont-pnvt-vp44",
      group: "pumps",
      priceFrom: 3500,
      title: {
        uk: "Ремонт розподільчих ПНВТ (VP44, VE)",
        ru: "Ремонт распределительных ТНВД (VP44, VE)",
        en: "Distributor pump repair (VP44, VE)",
      },
      h1: {
        uk: "Ремонт розподільчих ПНВТ Bosch VP44, VP29/30, VE, Lucas",
        ru: "Ремонт распределительных ТНВД Bosch VP44, VP29/30, VE, Lucas",
        en: "Distributor pump repair: Bosch VP44, VP29/30, VE, Lucas",
      },
      short: {
        uk: "Механічні VE та електронні VP44/VP29/VP30, включно з блоком керування.",
        ru: "Механические VE и электронные VP44/VP29/VP30, включая блок управления.",
        en: "Mechanical VE and electronic VP44/VP29/VP30 including the control unit.",
      },
      description: {
        uk: "Відновлюємо розподільчі ПНВТ: механічні Bosch VE, Lucas/Delphi та електронні Bosch VP44, VP29, VP30 — механіку й блок керування насосом. Регулювання на стенді.",
        ru: "Восстанавливаем распределительные ТНВД: механические Bosch VE, Lucas/Delphi и электронные Bosch VP44, VP29, VP30 — механику и блок управления насосом. Регулировка на стенде.",
        en: "We rebuild distributor pumps: mechanical Bosch VE, Lucas/Delphi and electronic Bosch VP44, VP29, VP30 — both mechanics and the pump control unit. Bench calibration.",
      },
      includes: {
        uk: ["Дефектовка механіки й електроніки", "Ремонт блоку керування VP (PSG)", "Заміна ремкомплектів, ротора за потреби", "Регулювання на стенді"],
        ru: ["Дефектовка механики и электроники", "Ремонт блока управления VP (PSG)", "Замена ремкомплектов, ротора при необходимости", "Регулировка на стенде"],
        en: ["Mechanical and electronic inspection", "VP control unit (PSG) repair", "Repair kits, rotor replacement if needed", "Bench calibration"],
      },
      body: {
        uk: "## Типові проблеми VP44 і VE\n- Двигун глухне на гарячу або не заводиться\n- Помилки зв'язку з насосом (VP44)\n- Нестабільні оберти, втрата потужності\n- Течі палива по валу й кришці\n\n## Що робимо\nУ електронних насосах VP44/VP29/VP30 часто виходить з ладу блок керування (PSG) — ремонтуємо його окремо від механіки. У механічних VE замінюємо ремкомплекти, регулюємо кут і подачу. Після ремонту насос проходить перевірку на стенді на всіх режимах.",
        ru: "## Типичные проблемы VP44 и VE\n- Двигатель глохнет на горячую или не заводится\n- Ошибки связи с насосом (VP44)\n- Нестабильные обороты, потеря мощности\n- Течи топлива по валу и крышке\n\n## Что делаем\nВ электронных насосах VP44/VP29/VP30 часто выходит из строя блок управления (PSG) — ремонтируем его отдельно от механики. В механических VE меняем ремкомплекты, регулируем угол и подачу. После ремонта насос проходит проверку на стенде на всех режимах.",
        en: "## Typical VP44 and VE problems\n- Engine stalls when hot or won't start\n- Pump communication errors (VP44)\n- Unstable idle, loss of power\n- Fuel leaks at the shaft and cover\n\n## What we do\nIn electronic VP44/VP29/VP30 pumps the control unit (PSG) often fails — we repair it separately from the mechanics. In mechanical VE pumps we replace repair kits and set timing and delivery. After the repair the pump is bench-tested in all modes.",
      },
      faq: [],
    },

    /* ---------------- Testing ---------------- */
    {
      slug: "perevirka-na-stendi",
      group: "testing",
      priceFrom: 300,
      perUnitOptions: [1, 2, 3, 4, 6, 8],
      perUnitLabel: { uk: "Кількість деталей", ru: "Количество деталей", en: "Number of parts" },
      title: {
        uk: "Перевірка форсунок і ПНВТ на стенді",
        ru: "Проверка форсунок и ТНВД на стенде",
        en: "Bench testing of injectors and pumps",
      },
      h1: {
        uk: "Перевірка знятих форсунок і ПНВТ на стенді",
        ru: "Проверка снятых форсунок и ТНВД на стенде",
        en: "Bench testing of removed injectors and pumps",
      },
      short: {
        uk: "Протокол стану без ремонту — щоб знати, чи потрібен ремонт.",
        ru: "Протокол состояния без ремонта — чтобы знать, нужен ли ремонт.",
        en: "A condition report without repair — to find out if repair is needed.",
      },
      description: {
        uk: "Перевіряємо зняті форсунки й насоси на стенді: подача, зворотний злив, розпил, герметичність. Видаємо протокол і рекомендації. Якщо ремонтуємо у нас — вартість перевірки входить у ремонт.",
        ru: "Проверяем снятые форсунки и насосы на стенде: подача, обратный слив, распыл, герметичность. Выдаём протокол и рекомендации. Если ремонтируем у нас — стоимость проверки входит в ремонт.",
        en: "We bench-test removed injectors and pumps: delivery, back-leak, spray pattern, sealing. You get a report and recommendations; if we do the repair, the test is included.",
      },
      includes: {
        uk: ["Тест подачі та зворотного зливу", "Перевірка розпилу й герметичності", "Протокол із результатами", "Рекомендації щодо ремонту"],
        ru: ["Тест подачи и обратного слива", "Проверка распыла и герметичности", "Протокол с результатами", "Рекомендации по ремонту"],
        en: ["Delivery and back-leak test", "Spray pattern and sealing check", "Test report", "Repair recommendations"],
      },
      body: {
        uk: "## Навіщо перевіряти перед ремонтом\nЧасто причина проблем — не форсунки, а датчики, фільтр чи підсмоктування повітря. Перевірка на стенді за кілька хвилин показує, чи справні форсунки й насос, і позбавляє зайвих витрат.\n\n## Що ви отримуєте\n- Протокол з фактичною подачею на кожному режимі\n- Порівняння з допусками виробника\n- Рекомендацію: ремонт, заміна чи «все в нормі»\n\nПротокол зручно показати продавцю при купівлі вживаних деталей або майстру, який встановлював форсунки.",
        ru: "## Зачем проверять перед ремонтом\nЧасто причина проблем — не форсунки, а датчики, фильтр или подсос воздуха. Проверка на стенде за несколько минут показывает, исправны ли форсунки и насос, и избавляет от лишних расходов.\n\n## Что вы получаете\n- Протокол с фактической подачей на каждом режиме\n- Сравнение с допусками производителя\n- Рекомендацию: ремонт, замена или «всё в норме»\n\nПротокол удобно показать продавцу при покупке б/у деталей или мастеру, который устанавливал форсунки.",
        en: "## Why test before repairing\nOften the problem is not the injectors but sensors, a filter or an air leak. A bench test shows in minutes whether the injectors and pump are healthy and saves you unnecessary costs.\n\n## What you get\n- A report with actual delivery in each mode\n- Comparison with the manufacturer's tolerances\n- A recommendation: repair, replace, or all fine\n\nThe report is also handy when buying used parts or when talking to the mechanic who fitted the injectors.",
      },
      faq: [
        {
          q: { uk: "Скільки триває перевірка?", ru: "Сколько длится проверка?", en: "How long does testing take?" },
          a: {
            uk: "Зазвичай у день отримання деталей.",
            ru: "Обычно в день получения деталей.",
            en: "Usually the same day we receive the parts.",
          },
        },
      ],
    },
  ],

  commonFaq: [
    {
      q: {
        uk: "Як відправити деталі на ремонт?",
        ru: "Как отправить детали на ремонт?",
        en: "How do I send parts for repair?",
      },
      a: {
        uk: "Зніміть ПНВТ або форсунки, заглушіть отвори, щільно запакуйте й відправте Новою поштою. Вкладіть записку з телефоном і маркою авто. Детальніше — на сторінці «Доставка й оплата».",
        ru: "Снимите ТНВД или форсунки, заглушите отверстия, плотно упакуйте и отправьте Новой почтой. Вложите записку с телефоном и маркой авто. Подробнее — на странице «Доставка и оплата».",
        en: "Remove the pump or injectors, plug the openings, pack them tightly and ship via Nova Poshta. Add a note with your phone number and car model. See the Delivery & payment page for details.",
      },
    },
    {
      q: {
        uk: "Чи даєте гарантію?",
        ru: "Даёте ли гарантию?",
        en: "Do you give a warranty?",
      },
      a: {
        uk: "Так, на виконані роботи й встановлені запчастини. Умови вказуємо в протоколі.",
        ru: "Да, на выполненные работы и установленные запчасти. Условия указываем в протоколе.",
        en: "Yes, on the work done and installed parts. The terms are stated in the report.",
      },
    },
    {
      q: {
        uk: "Коли я дізнаюся ціну?",
        ru: "Когда я узнаю цену?",
        en: "When will I know the price?",
      },
      a: {
        uk: "Після перевірки на стенді ми телефонуємо й узгоджуємо вартість. Без вашої згоди ремонт не починаємо.",
        ru: "После проверки на стенде мы звоним и согласовываем стоимость. Без вашего согласия ремонт не начинаем.",
        en: "After the bench test we call you to agree the price. We never start a repair without your approval.",
      },
    },
  ],

  pages: [
    {
      slug: "dostavka",
      title: { uk: "Доставка й оплата", ru: "Доставка и оплата", en: "Delivery & payment" },
      description: {
        uk: "Як відправити зняті ПНВТ і форсунки Новою поштою, як упакувати деталі та як оплатити ремонт.",
        ru: "Как отправить снятые ТНВД и форсунки Новой почтой, как упаковать детали и как оплатить ремонт.",
        en: "How to ship removed pumps and injectors via Nova Poshta, how to pack them and how to pay.",
      },
      body: {
        uk: "## Як відправити деталі\nМи приймаємо ПНВТ і форсунки з усієї України Новою поштою. Можна також привезти особисто — адреса на сторінці контактів.\n\n## Як правильно запакувати\n- Заглушіть усі паливні отвори пробками або щільно замотайте плівкою\n- Загорніть кожну форсунку окремо, щоб вони не билися одна об одну\n- Покладіть деталі в коробку й заповніть порожнини\n- Вкладіть записку: ім'я, телефон, марка й модель авто, опис проблеми\n\n## Що далі\nПісля отримання ми перевіряємо деталі на стенді, телефонуємо й узгоджуємо вартість ремонту. Після ремонту надсилаємо протокол і відправляємо деталі назад Новою поштою.\n\n## Оплата\nОплата після узгодження вартості: на картку, на рахунок або накладеним платежем при отриманні. Вартість доставки — за тарифами Нової пошти.",
        ru: "## Как отправить детали\nМы принимаем ТНВД и форсунки со всей Украины Новой почтой. Можно также привезти лично — адрес на странице контактов.\n\n## Как правильно упаковать\n- Заглушите все топливные отверстия пробками или плотно обмотайте плёнкой\n- Заверните каждую форсунку отдельно, чтобы они не бились друг о друга\n- Положите детали в коробку и заполните пустоты\n- Вложите записку: имя, телефон, марка и модель авто, описание проблемы\n\n## Что дальше\nПосле получения мы проверяем детали на стенде, звоним и согласовываем стоимость ремонта. После ремонта присылаем протокол и отправляем детали обратно Новой почтой.\n\n## Оплата\nОплата после согласования стоимости: на карту, на счёт или наложенным платежом при получении. Стоимость доставки — по тарифам Новой почты.",
        en: "## How to ship your parts\nWe accept pumps and injectors from all over Ukraine via Nova Poshta. You can also bring them in person — see the contacts page.\n\n## How to pack them\n- Plug all fuel openings with caps or wrap them tightly in film\n- Wrap each injector separately so they don't knock against each other\n- Put the parts in a box and fill the gaps\n- Add a note: name, phone number, car make and model, description of the problem\n\n## What happens next\nWhen the parts arrive we test them on the bench, call you and agree the repair price. After the repair we send you the report and ship the parts back via Nova Poshta.\n\n## Payment\nPayment after the price is agreed: by card, bank transfer or cash on delivery. Shipping is charged at Nova Poshta rates.",
      },
    },
    {
      slug: "pro-nas",
      title: { uk: "Про нас", ru: "О нас", en: "About us" },
      description: {
        uk: "Спеціалізована майстерня з ремонту знятих ПНВТ і дизельних форсунок: стендове обладнання, протоколи, гарантія.",
        ru: "Специализированная мастерская по ремонту снятых ТНВД и дизельных форсунок: стендовое оборудование, протоколы, гарантия.",
        en: "A specialist workshop repairing removed diesel pumps and injectors: test benches, reports, warranty.",
      },
      body: {
        uk: "## Чим ми займаємося\nМи — вузькоспеціалізована майстерня: працюємо лише з паливною апаратурою дизелів. Не знімаємо деталі з авто, а приймаємо вже зняті — від власників, СТО та автомагазинів з усієї України.\n\n## Чому нам довіряють\n- Перевіряємо кожну деталь на стенді до і після ремонту\n- Показуємо результат у протоколі, а не «на слово»\n- Узгоджуємо ціну до початку робіт\n- Замінюємо лише те, що справді зношено\n- Даємо гарантію на роботи й запчастини\n\n## Для СТО та партнерів\nПрацюємо з автосервісами й магазинами запчастин на постійній основі: швидкі терміни, протоколи для ваших клієнтів, зручна відправка Новою поштою. Зателефонуйте, щоб домовитися про умови.",
        ru: "## Чем мы занимаемся\nМы — узкоспециализированная мастерская: работаем только с топливной аппаратурой дизелей. Не снимаем детали с авто, а принимаем уже снятые — от владельцев, СТО и автомагазинов со всей Украины.\n\n## Почему нам доверяют\n- Проверяем каждую деталь на стенде до и после ремонта\n- Показываем результат в протоколе, а не «на словах»\n- Согласовываем цену до начала работ\n- Меняем только то, что действительно изношено\n- Даём гарантию на работы и запчасти\n\n## Для СТО и партнёров\nРаботаем с автосервисами и магазинами запчастей на постоянной основе: быстрые сроки, протоколы для ваших клиентов, удобная отправка Новой почтой. Позвоните, чтобы договориться об условиях.",
        en: "## What we do\nWe are a specialist workshop working only with diesel fuel injection equipment. We don't remove parts from cars — we accept parts that are already removed, from owners, garages and parts shops across Ukraine.\n\n## Why customers trust us\n- Every part is bench-tested before and after repair\n- Results are shown in a report, not just promised\n- The price is agreed before work starts\n- We replace only what is actually worn\n- Warranty on work and parts\n\n## For garages and partners\nWe work with garages and parts shops on a regular basis: quick turnaround, reports for your customers, easy shipping via Nova Poshta. Call us to discuss terms.",
      },
    },
  ],

  addons: [
    {
      id: "urgent",
      price: 500,
      label: { uk: "Термінове виконання (1 день)", ru: "Срочное выполнение (1 день)", en: "Express service (1 day)" },
    },
    {
      id: "return",
      price: 150,
      label: { uk: "Пакування й відправка назад", ru: "Упаковка и отправка обратно", en: "Packing and return shipping" },
    },
  ],

  // Filled from the sheet only: these blocks stay hidden until there is real data
  trust: { brands: [], heroImage: "", protocolImage: "", stats: [], reviews: [] },

  // Brand/series and vehicle pages come from the sheet only (tabs series, vehicles)
  landings: [],
  // Articles come from the sheet only (tab articles)
  articles: [],
};
