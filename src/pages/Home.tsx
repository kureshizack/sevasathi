import Ticker from '@/components/Ticker';
import Hero from './home/Hero';
import QuickServices from './home/QuickServices';
import CategoryWall from './home/CategoryWall';
import LatestJobs from './home/LatestJobs';
import SchemesSpotlight from './home/SchemesSpotlight';
import ResultsAdmit from './home/ResultsAdmit';
import ToolsTeaser from './home/ToolsTeaser';
import OfficeTeaser from './home/OfficeTeaser';
import LifeHacksStrip from './home/LifeHacksStrip';
import CommunityBand from './home/CommunityBand';

/**
 * Home — the friendly gateway (design/home.md).
 * Sections 1–10 + Footer via Layout. Ticker directly under nav.
 */
export default function Home() {
  return (
    <>
      <Ticker />
      <Hero />
      <QuickServices />
      <CategoryWall />
      <LatestJobs />
      <SchemesSpotlight />
      <ResultsAdmit />
      <ToolsTeaser />
      <OfficeTeaser />
      <LifeHacksStrip />
      <CommunityBand />
    </>
  );
}
