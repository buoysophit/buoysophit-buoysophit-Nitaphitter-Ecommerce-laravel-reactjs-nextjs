const invariant = require('tiny-invariant');
const path = require('path');

invariant(
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  'NEXT_PUBLIC_DEFAULT_LANGUAGE is required, but not set, check your .env file'
);

const isMultiLangEnable =
  process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
  !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

function generateLocales() {
  if (isMultiLangEnable) {
    return process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(',');
  }

  return [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE];
}

module.exports = {
  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
    locales: generateLocales(),
    localeDetection: isMultiLangEnable,
  },
  react: { useSuspense: false },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
