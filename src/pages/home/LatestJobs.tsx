import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { jobs, deadlineInfo } from '@/lib/data';
import JobCard from '@/components/JobCard';
import SectionHeader from '@/components/SectionHeader';
import { rise, stagger, viewport15 } from '@/lib/motion';

/**
 * Home §4 — Latest Jobs (ताज़ा नौकरियाँ · Latest Jobs).
 * LIVE badge + 3 JobCards + full-width secondary button.
 */
export default function LatestJobs() {
  const latest = jobs.slice(0, 3);
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute h-full w-full rounded-full bg-leaf-600 animate-pulse-dot" />
        </span>
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-leaf-600">LIVE</span>
      </div>
      <SectionHeader
        kicker="Sarkari Naukri"
        title={{ hi: 'ताज़ा नौकरियाँ', en: 'Latest Jobs' }}
        viewAllHref="/jobs"
        viewAllLabel={{ hi: 'सभी देखें', en: 'View all' }}
      />
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid gap-4 lg:grid-cols-3"
      >
        {latest.map((job) => (
          <motion.div key={job.id} variants={rise}>
            <JobCard job={job} urgent={deadlineInfo(job.lastDate).daysLeft <= 2} />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport15}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <Link
          to="/jobs"
          className="glass-card mt-6 flex w-full items-center justify-center gap-2 !rounded-full py-3.5 text-[15.5px] font-semibold text-ink-900 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          सभी <span className="font-mono">240</span> नौकरियाँ देखें →
        </Link>
      </motion.div>
    </section>
  );
}
