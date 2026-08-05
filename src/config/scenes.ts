// Конфигурация кино-части: 3 верхних 3D видео-сцены + 1 карта (экран 4) + 1 4-я 3D Hero Video сцена (экран 5)
export type StepKind = 'loop' | 'transit'

export interface CinemaStep {
  kind: StepKind
  src: string
  scene: number // номер сцены 1..3
  vh: number // высота сегмента в vh
}

export const CINEMA_STEPS: CinemaStep[] = [
  { kind: 'loop', src: '/videos/loop01.mp4', scene: 1, vh: 100 },
  { kind: 'transit', src: '/videos/transit12.mp4', scene: 1, vh: 150 },
  { kind: 'loop', src: '/videos/loop02.mp4', scene: 2, vh: 100 },
  { kind: 'transit', src: '/videos/transit23.mp4', scene: 2, vh: 150 },
  { kind: 'loop', src: '/videos/loop03.mp4', scene: 3, vh: 100 },
]

export interface ServicePillar {
  title: string
  desc1: string
  desc2: string
}

export interface SceneText {
  pill: string
  eyebrow: string
  titleLine1: string
  titleLine2: string
  titleLine3: string
  subtitle?: string
  bullets: string[]
  pillars?: ServicePillar[]
}

// Украинская версия (3 видео-сцены вверху, 4-я карта, 5-я 4-я 3D Hero Video сцена)
export const SCENE_TEXTS_UK: SceneText[] = [
  {
    pill: '01 Порт',
    eyebrow: 'Портове експедирування • Мультимодальні перевезення • Пошук та викуп у Китаї',
    titleLine1: 'Міжнародна логістика',
    titleLine2: 'та портовий сервіс',
    titleLine3: '«під ключ»',
    subtitle: 'Оперативна доставка контейнерних, збірних та спеціальних вантажів із Китаю, США, Індії та ЄС. Беремо на себе експедирування в портах, митне оформлення та страхування військових ризиків.',
    bullets: [
      'Порти під контролем: Одеса, Чорноморськ, Південний, Констанца, Гданськ.',
      'Прямий Китай: склади, викуп, QC-інспекція та Block Trains.',
      'Безпека: страхування вантажів, включаючи покриття військових ризиків (War Risks).',
    ],
  },
  {
    pill: '02 Послуги',
    eyebrow: 'Наші послуги • 5 основних напрямків логістики',
    titleLine1: 'Комплексні сервіси',
    titleLine2: 'та експедирування',
    titleLine3: '«під ключ»',
    bullets: [],
    pillars: [
      {
        title: '1. Портовий сервіс',
        desc1: 'Україна (Одеса, Чорноморськ, Південний), Румунія (Констанца), Польща (Гданськ, Гдиня).',
        desc2: 'Внутріпортове експедирування, суднова документація, ПРР, стафінг/расстафінг.',
      },
      {
        title: '2. Мультимодальні перевезення',
        desc1: 'Море: FCL (комплектні) та LCL (збірні) по всьому світу.',
        desc2: 'Ж/Д Block Trains з КНР • Авто Door-to-Door • Авіа експрес через ЄС.',
      },
      {
        title: '3. Митниця & ЗЕД',
        desc1: 'Комплексний митний брокер (імпорт, експорт, транзит).',
        desc2: 'Держконтроль (санітарний, фіто, вет) та юридичний супровід ЗЕД.',
      },
      {
        title: '4. Склад & Крос-докінг',
        desc1: 'Склади зберігання та консолідації в Польщі, Румунії та Україні.',
        desc2: 'Крос-докінг: оперативна перевантаження з контейнерів у єврофури без простою.',
      },
      {
        title: '5. Страхування ризиків',
        desc1: 'Почне покриття вантажів та контейнерів при транспортуванні.',
        desc2: 'Покриття військових ризиків (War Risks Coverage).',
      },
    ],
  },
  {
    pill: '03 Квиз',
    eyebrow: 'China Sourcing & Інтерактивний Квиз',
    titleLine1: 'Власний хаб',
    titleLine2: 'консолідації',
    titleLine3: 'в Китаї',
    bullets: ['Пошук і аудит фабрик', 'Викуп і платежі в КНР', 'QC-інспекція та консолідація'],
  },
  {
    pill: '04 Логістика',
    eyebrow: 'Про компанію • Grand Logistics Services',
    titleLine1: 'Надійна',
    titleLine2: 'міжнародна',
    titleLine3: 'логістика',
    subtitle: 'Провідний оператор мультимодальних перевозок та портового експедирування. Гарантуємо 100% збереження вантажу та дотримання термінів.',
    bullets: [
      '100% покриття військових ризиків (War Risks Coverage).',
      'Власні склади та агенти в Польщі, Румунії, КНР та Україні.',
      'Персональний супровід 24/7 та прозорий трекінг.',
    ],
  },
]

// Английская версия
export const SCENE_TEXTS_EN: SceneText[] = [
  {
    pill: '01 Port',
    eyebrow: 'Port Forwarding • Multimodal Logistics • China Sourcing & Procurement',
    titleLine1: 'International Logistics',
    titleLine2: '& Turnkey Port',
    titleLine3: 'Services',
    subtitle: 'Prompt delivery of containerized, groupage (LCL), and specialized cargo from China, USA, India & EU. We handle port forwarding, customs clearance, and war risk insurance.',
    bullets: [
      'Controlled ports: Odesa, Chornomorsk, Pivdennyi, Constanța, Gdańsk.',
      'Direct China: Warehouses, procurement, QC inspection & Block Trains.',
      'Security: Cargo insurance including War Risks coverage.',
    ],
  },
  {
    pill: '02 Services',
    eyebrow: 'Our Services • 5 Core Logistics Pillars',
    titleLine1: 'Turnkey Services',
    titleLine2: '& Port Forwarding',
    titleLine3: 'Solutions',
    bullets: [],
    pillars: [
      {
        title: '1. Port Forwarding',
        desc1: 'Ukraine (Odesa, Chornomorsk, Pivdennyi), Romania (Constanța), Poland (Gdańsk, Gdynia).',
        desc2: 'In-port forwarding, vessel documentation, stevedoring, stuffing & stripping.',
      },
      {
        title: '2. Multimodal Freight',
        desc1: 'Ocean: FCL (Full Container) and LCL (Groupage) worldwide.',
        desc2: 'Rail Block Trains from China • Door-to-Door Trucking • Air Express via EU.',
      },
      {
        title: '3. Customs Brokerage',
        desc1: 'Comprehensive customs clearance (Import, Export, Transit).',
        desc2: 'State inspections (phytosanitary, veterinary) & legal FEA support.',
      },
      {
        title: '4. Warehouse & Cross-Docking',
        desc1: 'Consolidation & storage facilities in Poland, Romania, and Ukraine.',
        desc2: 'Cross-docking: rapid container-to-truck transfer without downtime.',
      },
      {
        title: '5. Risk Insurance',
        desc1: 'Full coverage of goods and containers during transit and handling.',
        desc2: 'Including War Risks Coverage.',
      },
    ],
  },
  {
    pill: '03 Quiz',
    eyebrow: 'China Sourcing & Interactive Quiz',
    titleLine1: 'Own Consolidation',
    titleLine2: 'Hub in China',
    titleLine3: 'Guaranteed',
    bullets: ['Supplier audit & sourcing', 'Procurement & CNY payments', 'QC inspection & storage'],
  },
  {
    pill: '04 Logistics',
    eyebrow: 'About Company • Grand Logistics Services',
    titleLine1: 'Reliable',
    titleLine2: 'International',
    titleLine3: 'Logistics',
    subtitle: 'Leading multimodal transport operator and port forwarding broker. We guarantee 100% cargo safety.',
    bullets: [
      '100% War Risks Coverage.',
      'Own warehouses and agents in Poland, Romania, China & Ukraine.',
      '24/7 personal support and transparent tracking.',
    ],
  },
]

// Форма захвата для обоих языков
export const FORM_TEXTS = {
  UK: {
    navServices: 'Послуги',
    navGeography: 'Географія',
    navSourcing: 'China Sourcing',
    navContacts: 'Контакти',
    headerCta: 'Розрахувати вартість ➔',
    title: 'Швидкий розрахунок',
    subtitle: 'Отримайте розрахунок кошторису та маршрут за 15 хвилин',
    labelFrom: 'ЗВІДКИ',
    placeholderFrom: 'Країна / Порт / Місто (напр. Шанхай)',
    labelTo: 'КУДИ',
    placeholderTo: 'Країна / Місто (напр. Одеса / Київ)',
    labelCargo: 'ТИП ВАНТАЖУ / ПОСЛУГА',
    cargoOptions: [
      'FCL Контейнер',
      'LCL Збірний',
      'Зернові / Агро',
      'Електроніка',
      'Одяг & Fashion',
      'Будматеріали',
      'Негабарит / ADR',
      'Рефрижератори',
      'Ж/Д Block Train',
      'Викуп у КНР',
      'Митне оформлення',
      'Страхування вантажу',
    ],
    labelContact: 'ТЕЛЕФОН / TELEGRAM',
    placeholderContact: '+380 (XX) XXX-XX-XX / @username',
    submitBtn: 'Розрахувати вартість та маршрут ➔',
    successMsg: '✓ Дякуємо! Заявку прийнято. Логіст зв\'яжеться з вами протягом 15 хвилин.',
    confidential: 'Конфіденційно. Без спаму.',
  },
  EN: {
    navServices: 'Services',
    navGeography: 'Geography',
    navSourcing: 'China Sourcing',
    navContacts: 'Contacts',
    headerCta: 'Calculate Cost ➔',
    title: 'Quick Calculation',
    subtitle: 'Get cost estimate and route plan within 15 minutes',
    labelFrom: 'FROM',
    placeholderFrom: 'Country / Port / City (e.g. Shanghai)',
    labelTo: 'TO',
    placeholderTo: 'Country / City (e.g. Odesa / Kyiv)',
    labelCargo: 'CARGO TYPE / SERVICE',
    cargoOptions: [
      'FCL Container',
      'LCL Groupage',
      'Grain / Agro',
      'Electronics',
      'Fashion',
      'Construction',
      'Oversized / ADR',
      'Reefers',
      'Rail Block Train',
      'China Sourcing',
      'Customs Brokerage',
      'Cargo Insurance',
    ],
    labelContact: 'PHONE / TELEGRAM',
    placeholderContact: '+380 (XX) XXX-XX-XX / @username',
    submitBtn: 'Calculate Cost & Route ➔',
    successMsg: '✓ Thank you! Request received. A logistics specialist will contact you within 15 minutes.',
    confidential: 'Confidential. No spam.',
  },
}

export const ACCENT = '#7CC248'
export const GRAPHITE = '#3A3F44'
