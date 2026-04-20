import '@testing-library/jest-dom';

let mockMessages: Record<string, any> = {};
let mockLocale = 'en';

function getNestedValue(obj: Record<string, any>, key: string): any {
  return key.split('.').reduce((acc, part) => acc?.[part], obj) ?? key;
}

jest.mock('next-intl', () => {
  return {
    NextIntlClientProvider: ({ children, locale = 'en', messages = {} }: { children: React.ReactNode; locale?: string; messages?: Record<string, any>; }) => {
      mockLocale = locale;
      mockMessages = messages;
      return children;
    },
    useTranslations: (namespace?: string) => {
      const namespaceObj = namespace ? mockMessages[namespace] : mockMessages;
      return (key: string) => getNestedValue(namespaceObj, key);
    },
    useLocale: () => mockLocale,
    useMessages: () => mockMessages,
  };
});

jest.mock('use-intl/react', () => ({
  IntlProvider: ({ children }: { children: React.ReactNode }) => children,
  useTranslations: (namespace?: string) => {
    const namespaceObj = namespace ? mockMessages[namespace] : mockMessages;
    return (key: string) => getNestedValue(namespaceObj, key);
  },
  useLocale: () => mockLocale,
}));

beforeEach(() => {
  mockMessages = {};
  mockLocale = 'en';
});
