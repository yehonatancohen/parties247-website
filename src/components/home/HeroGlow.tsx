import Image from 'next/image';
import { Party } from '@/data/types';

// Where each flyer's light sits: [start, top] in % of the hero (mobile, then sm+).
const SPOTS = [
  { mobile: ['-30%', '-4%'], desktop: ['-6%', '-6%'] },
  { mobile: ['15%', '-14%'], desktop: ['27%', '-18%'] },
  { mobile: ['58%', '-2%'], desktop: ['60%', '-4%'] },
];

/**
 * Ambient light behind the hero headline: the first flyers on the wall, blown up
 * and blurred so the night's own colours tint the stage. Tiny image sizes on
 * purpose; nothing survives the blur, so 96px sources are plenty.
 */
export default function HeroGlow({ parties }: { parties: Party[] }) {
  const flyers = parties.slice(0, SPOTS.length);
  if (flyers.length === 0) return null;

  return (
    <div aria-hidden className="hero-glow">
      {flyers.map((party, i) => (
        <div
          key={party.id}
          className="hero-glow-flyer"
          style={{
            ['--glow-x' as string]: SPOTS[i].mobile[0],
            ['--glow-y' as string]: SPOTS[i].mobile[1],
            ['--glow-x-sm' as string]: SPOTS[i].desktop[0],
            ['--glow-y-sm' as string]: SPOTS[i].desktop[1],
          }}
        >
          <Image src={party.imageUrl} alt="" fill sizes="96px" quality={40} className="object-cover" />
        </div>
      ))}
      <div className="hero-glow-scrim" />
      <div className="hero-glow-grain" />
    </div>
  );
}
