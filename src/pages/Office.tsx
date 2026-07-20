import SectionHeader from '@/components/SectionHeader';
import FAQAccordion from '@/components/FAQAccordion';
import { officeFaqs } from '@/lib/data';
import OfficeHero from '@/pages/office/OfficeHero';
import ExcelAcademy from '@/pages/office/ExcelAcademy';
import ShortcutWall from '@/pages/office/ShortcutWall';
import AppGuides from '@/pages/office/AppGuides';
import CareerCorner from '@/pages/office/CareerCorner';
import SkillPath from '@/pages/office/SkillPath';

/**
 * Office Zone (office.md): hero → Excel Academy (copyable formulas) →
 * Shortcut Wall → Word/PPT/Sheets → Career Corner → Skill Path → FAQ.
 */
export default function Office() {
  return (
    <>
      <OfficeHero />
      <ExcelAcademy />
      <ShortcutWall />
      <AppGuides />
      <CareerCorner />
      <SkillPath />

      <section className="mx-auto max-w-[820px] px-4 py-14 md:px-6 lg:px-8">
        <SectionHeader kicker="FAQ" title={{ hi: 'अक्सर पूछे जाने वाले सवाल', en: 'Frequently asked' }} />
        <FAQAccordion faqs={officeFaqs} />
      </section>
    </>
  );
}
