// Dairəvi bayraqlar — circle-flags (MIT, © HatScripts, github.com/HatScripts/circle-flags) əsasında.
// SVG-lər birbaşa koda yerləşdirilib: xarici asılılıq və ya CDN sorğusu yoxdur.
export type LangCode = 'az' | 'en' | 'ru' | 'de';

export const LANGS: { code: LangCode; label: string }[] = [
  { code: 'az', label: 'Azərbaycan' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
];

const PATHS: Record<LangCode, [string, string][]> = {
  "az": [
    [
      "#d80027",
      "m0 167 256-32 256 32v178l-256 32L0 345Z"
    ],
    [
      "#338af3",
      "M0 0h512v167H0Z"
    ],
    [
      "#6da544",
      "M0 345h512v167H0Z"
    ],
    [
      "#eee",
      "M229 167a89 89 0 1 0 67 153 72 72 0 0 1-34 8 72 72 0 1 1 34-136 89 89 0 0 0-67-25m88 39-9 27-26-12 12 25-27 10 27 10-12 25 26-12 9 27 10-27 26 12-13-25 27-10-27-10 13-25-26 12z"
    ]
  ],
  "en": [
    [
      "#eee",
      "m0 0 8 22-8 23v23l32 54-32 54v32l32 48-32 48v32l32 54-32 54v68l22-8 23 8h23l54-32 54 32h32l48-32 48 32h32l54-32 54 32h68l-8-22 8-23v-23l-32-54 32-54v-32l-32-48 32-48v-32l-32-54 32-54V0l-22 8-23-8h-23l-54 32-54-32h-32l-48 32-48-32h-32l-54 32L68 0H0z"
    ],
    [
      "#0052b4",
      "M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z"
    ],
    [
      "#d80027",
      "M0 0v45l131 131h45L0 0zm208 0v208H0v96h208v208h96V304h208v-96H304V0h-96zm259 0L336 131v45L512 0h-45zM176 336 0 512h45l131-131v-45zm160 0 176 176v-45L381 336h-45z"
    ]
  ],
  "ru": [
    [
      "#0052b4",
      "M512 170v172l-256 32L0 342V170l256-32z"
    ],
    [
      "#eee",
      "M512 0v170H0V0Z"
    ],
    [
      "#d80027",
      "M512 342v170H0V342Z"
    ]
  ],
  "de": [
    [
      "#ffda44",
      "m0 345 256.7-25.5L512 345v167H0z"
    ],
    [
      "#d80027",
      "m0 167 255-23 257 23v178H0z"
    ],
    [
      "#333",
      "M0 0h512v167H0z"
    ]
  ]
};

export function Flag({ code, size }: { code: string; size?: 'lg' }) {
  const p = PATHS[code as LangCode] || PATHS.az;
  return (
    <span className={`flag-c${size ? ' ' + size : ''}`} aria-hidden="true">
      <svg viewBox="0 0 512 512" focusable="false">{p.map(([fill, d], i) => <path key={i} fill={fill} d={d} />)}</svg>
    </span>
  );
}
