import de from '../../messages/de.json';
import en from '../../messages/en.json';
import ru from '../../messages/ru.json';

const dictionaries = { en, ru, de };

export function getT(locale: keyof typeof dictionaries) {
  const dict = dictionaries[locale];

  return (path: string): string => {
    const value = path.split('.').reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, dict);

    if (typeof value !== 'string') {
      throw new Error(
        `[getT] Translation path "${path}" for locale "${locale}" is missing or not a string.`
      );
    }

    return value;
  };
}