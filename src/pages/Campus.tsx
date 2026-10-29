import PageShell from '../components/PageShell';
import { SectionList } from '../components/Resources';
import { CAMPUS_SECTIONS } from '../content/campus';

const TOTAL = CAMPUS_SECTIONS.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.ids.length, 0), 0);

export default function Campus({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      title="Everything on campus, in one place"
      intro="Advising, international student services, student life and study away. Each link comes with a line on why it’s worth opening."
      meta={`${CAMPUS_SECTIONS.length} sections · ${TOTAL} resources`}
      jump={CAMPUS_SECTIONS.map((section) => ({ id: section.id, label: section.title }))}
    >
      <SectionList sections={CAMPUS_SECTIONS} />
      <p className="t-meta mt-24 max-w-2xl">
        NHISA shares general information. For anything about your visa or work authorization, confirm with the Center for
        International Services.
      </p>
    </PageShell>
  );
}
