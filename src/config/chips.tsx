import {
  Anchor,
  TrainFront,
  ShieldCheck,
  FileCheck,
  Warehouse,
  SearchCheck,
  Wallet,
  ClipboardCheck,
  Boxes,
  Wheat,
  Cpu,
  Shirt,
  Building2,
  ThermometerSnowflake,
  TriangleAlert,
  Truck,
  Radar,
  Phone,
  Send,
  MapPin,
  Mail,
  type LucideIcon,
} from 'lucide-react'

export interface ChipItem {
  id: string
  icon: LucideIcon
  /** Короткая подпись на чипсе (1-3 слова) */
  label: string
  /** Заголовок поп-апа */
  modalTitle: string
  /** Eyebrow поп-апа (опционально) */
  modalEyebrow?: string
  /** Основной текст поп-апа */
  modalBody: string
  /** Дополнительный блок «операционные детали» (опционально) */
  modalDetail?: string
  /** Ссылка-действие внутри поп-апа (опционально, для контактов) */
  linkLabel?: string
  linkHref?: string
  /** Индекс категории в FORM_TEXTS.cargoOptions — предвыбор в форме расчёта */
  calcCargoIndex?: number
  /** Предзаполнение маршрута в форме расчёта (маркетинговый ход: решаем за клиента) */
  calcFrom?: string
  calcTo?: string
  /** Список пунктов для «глубокого» поп-апа (опционально) */
  modalList?: string[]
}

interface ChipsConfig {
  hero: ChipItem[]
  services: ChipItem[]
  sourcing: ChipItem[]
  cargo: ChipItem[]
  whyus: ChipItem[]
  contacts: ChipItem[]
}

export const CHIPS_UK: ChipsConfig = {
  hero: [
    {
      id: 'ports',
      icon: Anchor,
      label: 'Порти під контролем',
      modalTitle: 'Порти під контролем',
      modalEyebrow: 'Портове експедирування',
      modalBody:
        'Одеса, Чорноморськ, Південний, Констанца, Гданськ. Працюємо напряму з терміналами: внутріпортове експедирування, суднова документація, ПРР, стафінг і расстафінг контейнерів.',
      calcCargoIndex: 0,
      calcFrom: 'Шанхай / Гданськ',
      calcTo: 'Порт Одеса',
    },
    {
      id: 'china',
      icon: TrainFront,
      label: 'Прямий Китай',
      modalTitle: 'Прямий Китай',
      modalEyebrow: 'China Sourcing & Block Trains',
      modalBody:
        'Власні склади консолідації в КНР, викуп товару, QC-інспекція на фабриці та прямі ж/д Block Trains Китай — ЄС — Україна без посередників.',
      calcCargoIndex: 9,
      calcFrom: 'Китай (Шанхай)',
      calcTo: 'Україна (Одеса)',
    },
    {
      id: 'warrisks',
      icon: ShieldCheck,
      label: 'War Risks 100%',
      modalTitle: 'Страхування військових ризиків',
      modalEyebrow: 'War Risks Coverage',
      modalBody:
        'Повне покриття вантажів та контейнерів при транспортуванні, включаючи страхування військових ризиків (War Risks Coverage) на 100% вартості вантажу.',
      calcCargoIndex: 11,
    },
  ],
  services: [
    {
      id: 'port-service',
      icon: Anchor,
      label: 'Портовий сервіс',
      modalTitle: '1. Портовий сервіс',
      modalEyebrow: 'UA • RO • PL',
      modalBody:
        'Повне портове експедирування в Україні (Одеса, Чорноморськ, Південний), Румунії (Констанца) та Польщі (Гданськ, Гдиня). Працюємо напряму з терміналами без посередників.',
      modalList: [
        'Суднова документація та виписка дордерів за 1 робочий день',
        'Організація ПРР: крани, стивідори, робота терміналу 24/7',
        'Стафінг/расстафінг FCL та LCL контейнерів',
        'Представництво інтересів: термінал, митниця, держконтроль',
      ],
      calcCargoIndex: 0,
    },
    {
      id: 'multimodal',
      icon: TrainFront,
      label: 'Мультимодальні',
      modalTitle: '2. Мультимодальні перевезення',
      modalEyebrow: 'Sea • Rail • Road • Air',
      modalBody:
        'Комбінуємо море, залізницю, авто та авіа в один оптимальний маршрут — під термін, бюджет і тип вантажу.',
      modalList: [
        'Море: FCL та LCL регулярні сервіси з Азії, США, Індії та ЄС',
        'Ж/Д Block Trains Китай — ЄС — Україна: 14–18 діб',
        'Авто Door-to-Door по ЄС та Україні',
        'Авіаекспрес через аеропорти ЄС: 3–5 діб',
      ],
      calcCargoIndex: 0,
      calcFrom: 'Китай / США / ЄС',
      calcTo: 'Україна',
    },
    {
      id: 'customs',
      icon: FileCheck,
      label: 'Митниця & ЗЕД',
      modalTitle: '3. Митниця & ЗЕД',
      modalEyebrow: 'Customs Brokerage',
      modalBody:
        'Комплексний митний брокер із власною акредитацією: оформляємо імпорт, експорт і транзит без зупинок на кордоні.',
      modalList: [
        'Декларування імпорту, експорту та транзиту',
        'Акредитація ЗЕД та супровід контрактів',
        'Держконтроль: фіто, ветеринарний, санітарний',
        'Розрахунок митних платежів до прибуття вантажу',
      ],
      calcCargoIndex: 10,
    },
    {
      id: 'warehouse',
      icon: Warehouse,
      label: 'Склад & Крос-докінг',
      modalTitle: '4. Склад & Крос-докінг',
      modalEyebrow: 'PL • RO • UA',
      modalBody:
        'Власні та партнерські склади консолідації в Польщі, Румунії та Україні — буфер між морем і фінальною доставкою.',
      modalList: [
        'Консолідація LCL-вантажів від різних постачальників',
        'Крос-докінг: перевалка контейнер → єврофура за 4–6 годин',
        'Відповідальне зберігання, адресний облік, фотозвіти',
        'Палетування, маркування та комплектація під доставку',
      ],
      calcCargoIndex: 1,
    },
    {
      id: 'insurance',
      icon: ShieldCheck,
      label: 'Страхування',
      modalTitle: '5. Страхування ризиків',
      modalEyebrow: 'War Risks Coverage',
      modalBody:
        'Повне страхове покриття вантажу та контейнера на всьому маршруті — включаючи воєнні ризики.',
      modalList: [
        'Покриття 100% вартості вантажу та контейнера',
        'War Risks Coverage — воєнні ризики включено',
        'Поліс за 1 годину до відвантаження',
        'Супровід страхового випадку до виплати',
      ],
      calcCargoIndex: 11,
    },
  ],
  sourcing: [
    {
      id: 'sourcing-audit',
      icon: SearchCheck,
      label: 'Пошук і аудит фабрик',
      modalTitle: 'Пошук і аудит фабрик',
      modalEyebrow: 'Audit & Verification',
      modalBody:
        'Підбір фабрик, аудит виробництва, юридична перевірка постачальника в КНР до укладення контракту.',
      calcCargoIndex: 9,
      calcFrom: 'Китай (Гуанчжоу)',
      calcTo: 'Україна (Київ)',
    },
    {
      id: 'sourcing-payments',
      icon: Wallet,
      label: 'Викуп і платежі в КНР',
      modalTitle: 'Викуп і платежі в КНР',
      modalEyebrow: 'CNY Payments',
      modalBody:
        'Переговори, узгодження кращих цін, безпечні прямі платежі постачальникам у Китаї в юанях (CNY).',
      calcCargoIndex: 9,
      calcFrom: 'Китай (Гуанчжоу)',
      calcTo: 'Україна (Київ)',
    },
    {
      id: 'sourcing-qc',
      icon: ClipboardCheck,
      label: 'QC-інспекція',
      modalTitle: 'QC-інспекція та консолідація',
      modalEyebrow: 'QC & Consolidation',
      modalBody:
        'Інспекція партії безпосередньо на фабриці та перед відвантаженням у контейнер. Консолідація вантажів від різних постачальників на власному складі.',
      calcCargoIndex: 9,
      calcFrom: 'Китай (Гуанчжоу)',
      calcTo: 'Україна (Київ)',
    },
    {
      id: 'sourcing-blocktrains',
      icon: Boxes,
      label: 'Block Trains',
      modalTitle: 'Block Trains Китай — Україна',
      modalEyebrow: 'Rail Freight',
      modalBody:
        'Прямі ж/д склади з КНР: передбачувані терміни, вигідніше авіа і швидше моря. Контейнерні поїзди через ЄС з повним митним супроводом.',
      calcCargoIndex: 8,
      calcFrom: 'Китай (Сіань)',
      calcTo: 'Україна (Київ)',
    },
  ],
  cargo: [
    {
      id: 'agro',
      icon: Wheat,
      label: 'Зернові та агро',
      modalTitle: 'Зернові та агропродукція',
      modalEyebrow: 'Agro & Grain',
      modalBody: 'Перевалка, контроль якості, суднові та контейнерні партії, фітосанітарія.',
      calcCargoIndex: 2,
      calcFrom: 'Україна (Одеса)',
      calcTo: 'ЄС (Констанца)',
    },
    {
      id: 'electronics',
      icon: Cpu,
      label: 'Електроніка',
      modalTitle: 'Електроніка та обладнання',
      modalEyebrow: 'Tech & Asia',
      modalBody: 'Доставка з Азії/ЄС, інспекція упаковки, митне очищення «під ключ».',
      calcCargoIndex: 3,
    },
    {
      id: 'fashion',
      icon: Shirt,
      label: 'Одяг & Fashion',
      modalTitle: 'Одяг та Fashion',
      modalEyebrow: 'LCL & Consolidation',
      modalBody: 'Консолідація від різних фабрик КНР, збірні контейнери (LCL).',
      calcCargoIndex: 4,
    },
    {
      id: 'building',
      icon: Building2,
      label: 'Будматеріали',
      modalTitle: 'Будівельні матеріали',
      modalEyebrow: 'Heavy & Oversized',
      modalBody: 'Важковагові та габаритні вантажі, спецтехніка, контейнеровози.',
      calcCargoIndex: 5,
    },
    {
      id: 'reefers',
      icon: ThermometerSnowflake,
      label: 'Рефрижератори',
      modalTitle: 'Температурні вантажі (Reefers)',
      modalEyebrow: 'Reefers 24/7',
      modalBody: 'Рефрижераторні контейнери з безперервним моніторингом температури.',
      calcCargoIndex: 7,
    },
    {
      id: 'adr',
      icon: TriangleAlert,
      label: 'Негабарит & ADR',
      modalTitle: 'Негабарит та ADR',
      modalEyebrow: 'ADR & Flat Rack',
      modalBody: 'Контейнери Flat Rack, Open Top, дотримання норм безпеки ADR.',
      calcCargoIndex: 6,
    },
  ],
  whyus: [
    {
      id: 'warrisks',
      icon: ShieldCheck,
      label: 'War Risks',
      modalTitle: 'Страхування ризиків (War Risks)',
      modalEyebrow: 'Max Protection',
      modalBody: 'Максимальний фінансовий захист вантажів від усіх видів ризиків, включно з військовими.',
      calcCargoIndex: 11,
    },
    {
      id: 'infra',
      icon: Warehouse,
      label: 'Інфраструктура',
      modalTitle: 'Власна інфраструктура',
      modalEyebrow: 'Global Hubs',
      modalBody: 'Власні склади та агенти в КНР, Польщі, Румунії та Україні.',
      calcCargoIndex: 1,
    },
    {
      id: 'multimodal',
      icon: TrainFront,
      label: 'Мультимодальність',
      modalTitle: 'Мультимодальність',
      modalEyebrow: 'Sea • Rail • Road',
      modalBody: 'Швидка комбінація моря, Ж/Д Block Trains та автотранспорту.',
      calcCargoIndex: 0,
    },
    {
      id: 'doortodoor',
      icon: Truck,
      label: 'Door-to-Door',
      modalTitle: 'Сервіс «Door-to-Door»',
      modalEyebrow: 'Turnkey Service',
      modalBody: 'Повний цикл доставки від заводу в Азії до складу клієнта.',
      calcCargoIndex: 0,
    },
    {
      id: 'support247',
      icon: Radar,
      label: 'Логіст 24/7',
      modalTitle: 'Персональний логіст 24/7',
      modalEyebrow: 'Online Tracking',
      modalBody: 'Онлайн-трекінг вантажу та персональна підтримка 24/7.',
      calcCargoIndex: 0,
    },
  ],
  contacts: [
    {
      id: 'phone',
      icon: Phone,
      label: 'Гаряча лінія',
      modalTitle: 'Гаряча лінія 24/7',
      modalEyebrow: 'Hotline',
      modalBody: 'Консультація провідних логістів у будь-який час: +38 066 571-52-95.',
      linkLabel: 'Зателефонувати ➔',
      linkHref: 'tel:+380665715295',
    },
    {
      id: 'telegram',
      icon: Send,
      label: 'Telegram',
      modalTitle: 'Telegram / WhatsApp',
      modalEyebrow: 'Messenger',
      modalBody: '@grand_logistics_bot — миттєвий розрахунок вартості та трекінг вантажу.',
      linkLabel: 'Відкрити Telegram ➔',
      linkHref: 'https://t.me/grand_logistics_bot',
    },
    {
      id: 'offices',
      icon: MapPin,
      label: 'Офіси та хаби',
      modalTitle: 'Офіси та хаби',
      modalEyebrow: 'Global Hubs',
      modalBody: 'Одеса (Україна) • Гданськ (Польща) • Шанхай (КНР).',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Пошта',
      modalTitle: 'Електронна пошта',
      modalEyebrow: 'Email Support',
      modalBody: 'info@grand-logistics.com — прийом комерційних запитів 24/7.',
      linkLabel: 'Написати листа ➔',
      linkHref: 'mailto:info@grand-logistics.com',
    },
  ],
}

export const CHIPS_EN: ChipsConfig = {
  hero: [
    {
      id: 'ports',
      icon: Anchor,
      label: 'Controlled Ports',
      modalTitle: 'Controlled Ports',
      modalEyebrow: 'Port Forwarding',
      modalBody:
        'Odesa, Chornomorsk, Pivdennyi, Constanța, Gdańsk. Direct terminal work: in-port forwarding, vessel documentation, stevedoring, stuffing & stripping.',
      calcCargoIndex: 0,
      calcFrom: 'Shanghai / Gdańsk',
      calcTo: 'Port of Odesa',
    },
    {
      id: 'china',
      icon: TrainFront,
      label: 'Direct China',
      modalTitle: 'Direct China',
      modalEyebrow: 'China Sourcing & Block Trains',
      modalBody:
        'Own consolidation warehouses in China, procurement, factory QC inspection and direct rail Block Trains China — EU — Ukraine without intermediaries.',
      calcCargoIndex: 9,
      calcFrom: 'China (Shanghai)',
      calcTo: 'Ukraine (Odesa)',
    },
    {
      id: 'warrisks',
      icon: ShieldCheck,
      label: 'War Risks 100%',
      modalTitle: 'War Risks Coverage',
      modalEyebrow: 'Cargo Insurance',
      modalBody:
        'Full coverage of goods and containers during transit, including War Risks Coverage for 100% of cargo value.',
      calcCargoIndex: 11,
    },
  ],
  services: [
    {
      id: 'port-service',
      icon: Anchor,
      label: 'Port Service',
      modalTitle: '1. Port Forwarding',
      modalEyebrow: 'UA • RO • PL',
      modalBody:
        'Full port forwarding in Ukraine (Odesa, Chornomorsk, Pivdennyi), Romania (Constanța) and Poland (Gdańsk, Gdynia). Direct terminal work without intermediaries.',
      modalList: [
        'Vessel documentation & delivery orders within 1 business day',
        'Stevedoring: cranes, gangs, 24/7 terminal operations',
        'Stuffing & stripping of FCL and LCL containers',
        'Representation at the port: terminal, customs, state control',
      ],
      calcCargoIndex: 0,
    },
    {
      id: 'multimodal',
      icon: TrainFront,
      label: 'Multimodal',
      modalTitle: '2. Multimodal Freight',
      modalEyebrow: 'Sea • Rail • Road • Air',
      modalBody:
        'We combine ocean, rail, road and air into one optimal route — matched to your deadline, budget and cargo type.',
      modalList: [
        'Ocean: FCL & LCL regular services from Asia, USA, India & EU',
        'Rail Block Trains China — EU — Ukraine: 14–18 days',
        'Door-to-Door trucking across the EU and Ukraine',
        'Air express via EU airports: 3–5 days',
      ],
      calcCargoIndex: 0,
      calcFrom: 'China / USA / EU',
      calcTo: 'Ukraine',
    },
    {
      id: 'customs',
      icon: FileCheck,
      label: 'Customs & FEA',
      modalTitle: '3. Customs Brokerage',
      modalEyebrow: 'Customs Brokerage',
      modalBody:
        'Full-cycle customs broker with own accreditation: import, export and transit clearance without border delays.',
      modalList: [
        'Import, export & transit declarations',
        'FEA accreditation & contract support',
        'State control: phytosanitary, veterinary, sanitary',
        'Duty & tax calculation before cargo arrival',
      ],
      calcCargoIndex: 10,
    },
    {
      id: 'warehouse',
      icon: Warehouse,
      label: 'Warehouse',
      modalTitle: '4. Warehouse & Cross-Docking',
      modalEyebrow: 'PL • RO • UA',
      modalBody:
        'Own and partner consolidation warehouses in Poland, Romania and Ukraine — a buffer between the port and final delivery.',
      modalList: [
        'LCL consolidation from multiple suppliers',
        'Cross-docking: container → truck transfer in 4–6 hours',
        'Bonded storage, slot accounting, photo reports',
        'Palletizing, labeling & order picking for delivery',
      ],
      calcCargoIndex: 1,
    },
    {
      id: 'insurance',
      icon: ShieldCheck,
      label: 'Insurance',
      modalTitle: '5. Risk Insurance',
      modalEyebrow: 'War Risks Coverage',
      modalBody:
        'Full insurance coverage of cargo and container along the entire route — including war risks.',
      modalList: [
        '100% coverage of cargo and container value',
        'War Risks Coverage included',
        'Policy issued within 1 hour before shipment',
        'Claim support until payout',
      ],
      calcCargoIndex: 11,
    },
  ],
  sourcing: [
    {
      id: 'sourcing-audit',
      icon: SearchCheck,
      label: 'Factory Audit',
      modalTitle: 'Factory Search & Audit',
      modalEyebrow: 'Audit & Verification',
      modalBody:
        'Factory matching, production audit, legal verification of suppliers in China before signing contracts.',
      calcCargoIndex: 9,
      calcFrom: 'China (Guangzhou)',
      calcTo: 'Ukraine (Kyiv)',
    },
    {
      id: 'sourcing-payments',
      icon: Wallet,
      label: 'CNY Payments',
      modalTitle: 'Procurement & Payments',
      modalEyebrow: 'CNY Payments',
      modalBody:
        'Negotiations, price agreement, secure direct payments to suppliers in China (CNY).',
      calcCargoIndex: 9,
      calcFrom: 'China (Guangzhou)',
      calcTo: 'Ukraine (Kyiv)',
    },
    {
      id: 'sourcing-qc',
      icon: ClipboardCheck,
      label: 'QC Inspection',
      modalTitle: 'QC Inspection & Consolidation',
      modalEyebrow: 'QC & Consolidation',
      modalBody:
        'Batch inspection directly at the factory and before container loading. Consolidation from multiple suppliers at our own warehouse.',
      calcCargoIndex: 9,
      calcFrom: 'China (Guangzhou)',
      calcTo: 'Ukraine (Kyiv)',
    },
    {
      id: 'sourcing-blocktrains',
      icon: Boxes,
      label: 'Block Trains',
      modalTitle: 'Block Trains China — Ukraine',
      modalEyebrow: 'Rail Freight',
      modalBody:
        'Direct rail from China: predictable timing, cheaper than air, faster than sea. Container trains via the EU with full customs support.',
      calcCargoIndex: 8,
      calcFrom: "China (Xi'an)",
      calcTo: 'Ukraine (Kyiv)',
    },
  ],
  cargo: [
    {
      id: 'agro',
      icon: Wheat,
      label: 'Grain & Agro',
      modalTitle: 'Grain & Agro Products',
      modalEyebrow: 'Agro & Grain',
      modalBody: 'Transshipment, quality control, vessel and container lots, phytosanitary inspection.',
      calcCargoIndex: 2,
      calcFrom: 'Ukraine (Odesa)',
      calcTo: 'EU (Constanța)',
    },
    {
      id: 'electronics',
      icon: Cpu,
      label: 'Electronics',
      modalTitle: 'Electronics & Machinery',
      modalEyebrow: 'Tech & Asia',
      modalBody: 'Delivery from Asia/EU, packaging inspection, turnkey customs clearance.',
      calcCargoIndex: 3,
    },
    {
      id: 'fashion',
      icon: Shirt,
      label: 'Fashion',
      modalTitle: 'Apparel & Fashion',
      modalEyebrow: 'LCL & Consolidation',
      modalBody: 'Consolidation from multiple China factories, LCL groupage containers.',
      calcCargoIndex: 4,
    },
    {
      id: 'building',
      icon: Building2,
      label: 'Construction',
      modalTitle: 'Construction Materials',
      modalEyebrow: 'Heavy & Oversized',
      modalBody: 'Heavyweight and oversized cargo, special equipment, container trucks.',
      calcCargoIndex: 5,
    },
    {
      id: 'reefers',
      icon: ThermometerSnowflake,
      label: 'Reefers',
      modalTitle: 'Temperature Controlled (Reefers)',
      modalEyebrow: 'Reefers 24/7',
      modalBody: 'Refrigerated containers with continuous thermal monitoring.',
      calcCargoIndex: 7,
    },
    {
      id: 'adr',
      icon: TriangleAlert,
      label: 'Oversized & ADR',
      modalTitle: 'Oversized & ADR Dangerous Goods',
      modalEyebrow: 'ADR & Flat Rack',
      modalBody: 'Flat Rack, Open Top containers, strict ADR safety compliance.',
      calcCargoIndex: 6,
    },
  ],
  whyus: [
    {
      id: 'warrisks',
      icon: ShieldCheck,
      label: 'War Risks',
      modalTitle: 'War Risks Insurance',
      modalEyebrow: 'Max Protection',
      modalBody: 'Maximum financial protection for cargo during multimodal transit, including war risks.',
      calcCargoIndex: 11,
    },
    {
      id: 'infra',
      icon: Warehouse,
      label: 'Infrastructure',
      modalTitle: 'Own Infrastructure',
      modalEyebrow: 'Global Hubs',
      modalBody: 'Own warehouses and agents in China, Poland, Romania & Ukraine.',
      calcCargoIndex: 1,
    },
    {
      id: 'multimodal',
      icon: TrainFront,
      label: 'Multimodal',
      modalTitle: 'Multimodal Freight',
      modalEyebrow: 'Sea • Rail • Road',
      modalBody: 'Fast combination of ocean freight, rail block trains & trucking.',
      calcCargoIndex: 0,
    },
    {
      id: 'doortodoor',
      icon: Truck,
      label: 'Door-to-Door',
      modalTitle: 'Door-to-Door Service',
      modalEyebrow: 'Turnkey Service',
      modalBody: 'Full delivery cycle from supplier factory to client warehouse.',
      calcCargoIndex: 0,
    },
    {
      id: 'support247',
      icon: Radar,
      label: 'Support 24/7',
      modalTitle: 'Personal Logistics 24/7',
      modalEyebrow: 'Online Tracking',
      modalBody: '24/7 real-time cargo tracking & personal support manager.',
      calcCargoIndex: 0,
    },
  ],
  contacts: [
    {
      id: 'phone',
      icon: Phone,
      label: 'Hotline',
      modalTitle: 'Hotline 24/7',
      modalEyebrow: 'Hotline',
      modalBody: 'Round-the-clock logistics manager support: +38 066 571-52-95.',
      linkLabel: 'Call now ➔',
      linkHref: 'tel:+380665715295',
    },
    {
      id: 'telegram',
      icon: Send,
      label: 'Telegram',
      modalTitle: 'Telegram & WhatsApp',
      modalEyebrow: 'Messenger',
      modalBody: '@grand_logistics_bot — instant cost calculation and cargo tracking.',
      linkLabel: 'Open Telegram ➔',
      linkHref: 'https://t.me/grand_logistics_bot',
    },
    {
      id: 'offices',
      icon: MapPin,
      label: 'Offices',
      modalTitle: 'Global Offices',
      modalEyebrow: 'Global Hubs',
      modalBody: 'Odesa (Ukraine) • Gdańsk (Poland) • Shanghai (China).',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      modalTitle: 'Official Email',
      modalEyebrow: 'Email Support',
      modalBody: 'info@grand-logistics.com — commercial inquiries processing 24/7.',
      linkLabel: 'Write email ➔',
      linkHref: 'mailto:info@grand-logistics.com',
    },
  ],
}
