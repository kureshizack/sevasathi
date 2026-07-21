import Ticker from '@/components/Ticker';
import Deck from './home/deck/Deck';
import CommunityBand from './home/CommunityBand';

/**
 * Home — CRED-style card deck gateway.
 * Instead of one long scrolling page, visitors flip through a stack of
 * full-screen glass cards (one topic per card) — designed to keep them
 * exploring every section. Ticker stays on top; CommunityBand closes.
 */
export default function Home() {
  return (
    <>
      <Ticker />
      <Deck />
      <CommunityBand />
    </>
  );
}
