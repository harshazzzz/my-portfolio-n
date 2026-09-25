import styles from "./DeveloperAvatar.module.css";
/** Code-native illustration doubles as the mobile and WebGL fallback. */
export default function DeveloperFallback() {
  return (
    <svg className={styles.fallback} viewBox="0 0 600 600" aria-hidden="true">
      <ellipse
        cx="315"
        cy="485"
        rx="220"
        ry="48"
        fill="#8b5cf6"
        opacity=".08"
      />
      <ellipse
        cx="305"
        cy="474"
        rx="187"
        ry="38"
        fill="none"
        stroke="#00f5ff"
        opacity=".3"
      />
      <g fill="none" stroke="#00f5ff" opacity=".12">
        <path d="M50 440 300 320 550 440M100 470 350 350M170 490 420 370M230 510 480 390" />
        <path d="M70 410 360 540M140 380 430 510M210 350 500 480" />
      </g>
      <rect
        x="225"
        y="260"
        width="137"
        height="160"
        rx="36"
        fill="#141928"
        stroke="#8b5cf6"
        strokeOpacity=".5"
      />
      <path
        d="M270 378 252 456 270 475M328 378 347 453 369 470"
        fill="none"
        stroke="#223048"
        strokeWidth="32"
        strokeLinecap="round"
      />
      <path
        d="M267 475h-25M369 472h23"
        stroke="#728394"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M260 246Q296 220 335 247L356 351H238Z"
        fill="#1a3550"
        stroke="#3c7189"
      />
      <path d="M288 235v27l15 12 13-14v-26" fill="#b67a59" />
      <ellipse cx="300" cy="194" rx="48" ry="58" fill="#c68a68" />
      <path
        d="M252 189Q237 123 296 127Q357 119 349 186L331 158Q306 183 272 162Z"
        fill="#141823"
      />
      <path
        d="M276 194h12m27 0h12"
        stroke="#222a34"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M291 219q11 7 23-1"
        fill="none"
        stroke="#774737"
        strokeWidth="3"
      />
      <path
        d="M263 272 229 311 278 329M333 272 371 308 332 326"
        fill="none"
        stroke="#254662"
        strokeWidth="27"
        strokeLinecap="round"
      />
      <path
        d="m278 329 15 0m39-3-14 1"
        stroke="#c68a68"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M153 353 431 353 474 380 120 380Z"
        fill="#182839"
        stroke="#487080"
      />
      <path d="M149 382v71M437 382v71" stroke="#22344b" strokeWidth="10" />
      <path
        d="M245 271h119l-12 90H257Z"
        fill="#102335"
        stroke="#00f5ff"
        strokeOpacity=".75"
        strokeWidth="2"
      />
      <path d="M250 364h116l15 8H234Z" fill="#607084" />
      <g strokeLinecap="round" strokeWidth="4">
        <path
          d="M269 294h35m-29 12h62m-56 12h40m-45 12h56"
          stroke="#00f5ff"
          opacity=".75"
        />
        <path d="M311 294h26m-54 48h37" stroke="#8b5cf6" />
      </g>
      <g fill="#0e1b2b" stroke="#8b5cf6" strokeOpacity=".4">
        <rect x="80" y="204" width="99" height="76" rx="12" />
        <rect x="415" y="234" width="105" height="75" rx="12" />
      </g>
      <g stroke="#00f5ff" strokeWidth="3" opacity=".6">
        <path d="M95 224h43m-43 12h65m-65 12h32M432 252h42m-42 12h68m-68 12h35" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx={90 + i * 77}
          cy={125 + (i % 3) * 90}
          r="2"
          fill={i % 2 ? "#8b5cf6" : "#00f5ff"}
        />
      ))}
    </svg>
  );
}
