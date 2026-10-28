import PageShell from '../components/PageShell';
import TopicCard from '../components/TopicCard';

export default function ComingSoon({ route, title }: { route: string; title: string }) {
  return (
    <PageShell
      route={route}
      eyebrow={title}
      title="Coming soon"
      intro={`We’re putting the ${title} section together. In the meantime, these guides are ready to use.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TopicCard
          path="/school"
          index={0}
          title="School Experience"
          summary="Clubs, experience, academics and IT support at Newhouse."
        />
        <TopicCard
          path="/job"
          index={1}
          title="Job Knowledge"
          summary="LinkedIn, Handshake, email signatures, job search and career planning."
        />
      </div>
    </PageShell>
  );
}
