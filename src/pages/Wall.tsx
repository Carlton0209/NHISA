import PageShell from '../components/PageShell';
import PhotoWall from '../components/PhotoWall';

/** The full photo wall: every festival photo and every approved visitor photo, on a board as tall as they need. */
export default function Wall({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      compact
      back={{ label: 'Home', path: '/' }}
      title="Find your moment."
      intro="Every photo from NHISA’s International Food Festival, and the ones members add. Drag them around, open one, or pin your own."
    >
      <PhotoWall variant="full" />
    </PageShell>
  );
}
