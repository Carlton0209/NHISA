import PageShell from '../components/PageShell';
import { SectionList } from '../components/ResourceCard';
import { CAMPUS_SECTIONS } from '../content/campus';

export default function Campus({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      eyebrow="Campus Resources"
      title="Everything on campus, in one place"
      intro="Advising, international student services, student life and study away. Each link comes with a line on why it’s worth opening."
      jump={CAMPUS_SECTIONS.map((section) => ({ id: section.id, label: section.title }))}
    >
      <SectionList sections={CAMPUS_SECTIONS} label={(index) => String(index + 1).padStart(2, '0')} />
      <p className="mt-16 max-w-2xl text-sm text-white/45">
        NHISA shares general information. For anything about your visa or work authorization, confirm with the Center for
        International Services.
      </p>
    </PageShell>
  );
}
