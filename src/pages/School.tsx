import PageShell from '../components/PageShell';
import { ResourceGroups } from '../components/ResourceCard';
import TopicCard from '../components/TopicCard';
import { SCHOOL_TOPICS } from '../content/school';

const SUBNAV = [
  { label: 'Overview', path: '/school' },
  ...SCHOOL_TOPICS.map((topic) => ({ label: topic.title, path: `/school/${topic.slug}` })),
];

const count = (topic: (typeof SCHOOL_TOPICS)[number]) =>
  topic.groups.reduce((sum, group) => sum + group.items.length, 0);

export function schoolTitle(route: string) {
  const topic = SCHOOL_TOPICS.find((t) => route === `/school/${t.slug}`);
  return topic ? `${topic.title} · School Experience` : 'School Experience';
}

export default function School({ route }: { route: string }) {
  const topic = SCHOOL_TOPICS.find((t) => route === `/school/${t.slug}`);

  if (topic) {
    return (
      <PageShell route={route} eyebrow="School Experience" title={topic.title} intro={topic.intro} subnav={SUBNAV}>
        <ResourceGroups groups={topic.groups} />
      </PageShell>
    );
  }

  return (
    <PageShell
      route={route}
      eyebrow="School Experience"
      title="Make the most of Newhouse"
      intro="Clubs and events, hands-on experience, academic planning and tech support, gathered in one place with a line on why each is worth opening."
      subnav={SUBNAV}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {SCHOOL_TOPICS.map((t, index) => (
          <TopicCard
            key={t.slug}
            path={`/school/${t.slug}`}
            index={index}
            title={t.title}
            summary={t.summary}
            meta={`${count(t)} resources`}
          />
        ))}
      </div>
    </PageShell>
  );
}
