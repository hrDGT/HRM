import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

const messages = {
  en: () => import('@/messages/en.json'),
  de: () => import('@/messages/de.json'),
  ru: () => import('@/messages/ru.json'),
};

type Locale = keyof typeof messages;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';
  const locale: Locale = raw in messages ? (raw as Locale) : 'en';

  return {
    locale,
    messages: (await messages[locale]()).default,
  };
});
