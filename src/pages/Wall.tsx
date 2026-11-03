import PageShell from '../components/PageShell';
import PhotoWall from '../components/PhotoWall';
import { t } from '../lib/i18n';

/** The full photo wall: every festival photo and every approved visitor photo, on a board as tall as they need. */
export default function Wall({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      compact
      back={{ label: t('Home'), path: '/' }}
      title={t('Find your moment.')}
    >
      <PhotoWall variant="full" />
    </PageShell>
  );
}
