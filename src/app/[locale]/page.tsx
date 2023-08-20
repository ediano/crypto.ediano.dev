import type { DefaultPageProps } from '@/types/pages.type';
import { getDictionaryServerOnly } from './dictionaries/dictionary-server-only';

type HomeProps = DefaultPageProps;

export default async function Home({ params }: HomeProps) {
  const dict = await getDictionaryServerOnly(params.locale);

  return (
    <>
      <h1 className="w-full">Home: {params.locale}</h1>
    </>
  );
}
