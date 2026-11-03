import PageShell from '../components/PageShell';
import { SectionList } from '../components/Resources';
import { CAMPUS_SECTIONS } from '../content/campus';
import { t } from '../lib/i18n';

const TOTAL = CAMPUS_SECTIONS.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.ids.length, 0), 0);

export default function Campus({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      title={t('Everything on campus')}
      intro={t('Advising, visas, student life and study away, each with a line on why it matters.')}
      meta={t('{sections} sections · {resources} resources', { sections: CAMPUS_SECTIONS.length, resources: TOTAL })}
      jump={CAMPUS_SECTIONS.map((section) => ({ id: section.id, label: t(section.title) }))}
    >
      <SectionList sections={CAMPUS_SECTIONS} />
      <p className="t-meta mt-16 max-w-2xl">
        {t('General information only. Confirm visa and work questions with the Center for International Services.')}
      </p>
    </PageShell>
  );
}
