import { useTranslation } from 'react-i18next';
import zylloTechIcon from '@/assets/zyllo-tech-icon.webp';

// Figure-eight drawn in the same 117x64 box as the icon, so the traced light
// follows the logo's own loops.
const INFINITY_PATH =
  'M58.5 32 C70 14 100 8 106 32 C100 56 70 50 58.5 32 C47 14 17 8 11 32 C17 56 47 50 58.5 32 Z';

/**
 * Developer credit shown in the footer's bottom bar, under the Terms /
 * Privacy / Sitemap / Cookie Settings links.
 *
 * At rest: the Zyllo infinity mark + "Powered by Zyllo Tech".
 * On hover / keyboard focus: the mark grows and a light traces around the
 * infinity loop. prefers-reduced-motion turns off the movement.
 */
const PoweredByZylloTech = () => {
  const { t } = useTranslation();

  return (
    <a
      href="https://zyllotech.com/"
      target="_blank"
      rel="noopener"
      aria-label={t('footer.poweredByAria', 'Powered by Zyllo Tech (opens in a new tab)')}
      className="group inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors relative z-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <span>{t('footer.poweredBy', 'Powered by')}</span>
      <span className="relative flex items-center justify-center shrink-0 w-11 h-6 transition-[margin] duration-300 group-hover:mx-3 group-focus-visible:mx-3 motion-reduce:transition-none">
        <img
          src={zylloTechIcon}
          alt=""
          width={117}
          height={64}
          loading="lazy"
          decoding="async"
          className="w-11 h-auto origin-center transition-transform duration-300 ease-out group-hover:scale-150 group-focus-visible:scale-150 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
        />
        {/* The travelling light — only visible while hovered/focused */}
        <svg
          viewBox="0 0 117 64"
          aria-hidden="true"
          className="pointer-events-none absolute w-11 h-auto origin-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-150 group-focus-visible:scale-150 motion-reduce:hidden"
        >
          {/* White with a warm glow: an orange/blue gradient blended into the
              logo's own colours and was invisible. */}
          <path
            d={INFINITY_PATH}
            pathLength={100}
            fill="none"
            stroke="#ffffff"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray="22 78"
            className="animate-infinity-trace"
            style={{ filter: 'drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 5px #ffd27a)' }}
          />
        </svg>
      </span>
      <span className="font-semibold tracking-wide">
        <span className="text-[#ff8a3d]">Zyllo</span>{' '}
        <span className="text-[#5aa9ff]">Tech</span>
      </span>
    </a>
  );
};

export default PoweredByZylloTech;
