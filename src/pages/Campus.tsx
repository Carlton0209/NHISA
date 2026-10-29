import PageShell from '../components/PageShell';
import { SectionList } from '../components/Resources';
import { CAMPUS_SECTIONS } from '../content/campus';

const TOTAL = CAMPUS_SECTIONS.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.ids.length, 0), 0);

export default function Campus({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      title="Everything on campus"
      intro="Advising, visas, student life and study away, each with a line on why it matters."
      meta={`${CAMPUS_SECTIONS.length} sections · ${TOTAL} resources`}
      jump={CAMPUS_SECTIONS.map((section) => ({ id: section.id, label: section.title }))}
    >
      <SectionList sections={CAMPUS_SECTIONS} />
      <p className="t-meta mt-16 max-w-2xl">
        General information only. Confirm visa and work questions with the Center for International Services.
      </p>
    </PageShell>
  );
}
