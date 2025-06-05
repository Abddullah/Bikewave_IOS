import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {DEFAULT_LANGUAGE} from '../../utilities/constants';
import {appLanguages} from '../../utilities/languageData/data';
import {languageData} from '../../utilities';
import {getItem, setItem} from '../../services/assynsStorage';

// CHANGE LANGUAGE
const setLanguageAsync = async lang => {
  await setItem('languagecode', lang);
};

// Clear saved language and force default
export const clearSavedLanguage = async () => {
  await setItem('languagecode', DEFAULT_LANGUAGE);
  await i18n.changeLanguage(DEFAULT_LANGUAGE);
  return true;
};

export const onLanguageSelect = async (langId, setflag, flag) => {
  let lang = appLanguages.find(item => item.code === langId);
  if (lang) {
    await i18n.changeLanguage(lang.code);
    await setLanguageAsync(lang.code);
    setflag(!flag);
  }
};

// CHANGE LANGUAGE

export const fetchTranslations = async () => {
  const translations = languageData;
  let selectedLocale = null;

  if (translations.length) {
    if (translations.length) {
      translations.forEach(translation => {
        i18n.addResourceBundle(
          translation.locale,
          'translation',
          translation.translation,
          true,
          true,
        );
      });

      const locales = translations.map(translation => translation.locale);

      let lang;

      try {
        // Try to get saved language, if not found use default
        lang = await getItem('languagecode');
        // If no language is saved or it's not valid, use default
        if (!lang || !locales.includes(lang)) {
          lang = DEFAULT_LANGUAGE;
          await setItem('languagecode', DEFAULT_LANGUAGE);
        }
      } catch (error) {
        // If any error, use default
        lang = DEFAULT_LANGUAGE;
        await setItem('languagecode', DEFAULT_LANGUAGE);
      }

      selectedLocale = locales.find(locale => locale === lang);
    }

    if (selectedLocale) {
      await setItem('languagecode', selectedLocale);

      i18n.changeLanguage(selectedLocale);
    } else {
      await setItem('languagecode', DEFAULT_LANGUAGE);
    }
  }
  return true;
};

export const translate = value => i18n.t(value);

// Set fallback language to mumbo jumbo so it displays missing tags
i18n.use(initReactI18next).init({
  debug: true,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  resources: {
  },
});

export default i18n;
