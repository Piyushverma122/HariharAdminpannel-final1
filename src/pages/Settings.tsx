import React from 'react';
import { Globe, Save } from 'lucide-react'; // Removed LogOut icon
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'hi') => {
    setLanguage(newLanguage);
  };

  // Removed handleLogout function

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fadeInUp">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings')}</h1>
        <p className="text-gray-600">{t('manageLanguagePreferences')}</p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Language Settings */}
        <div className="modern-card p-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-center mb-6">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">{t('language')}</h2>
              <p className="text-gray-500 text-sm">{t('choosePreferredLanguage')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-4 text-center">
                {t('selectLanguage')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                  language === 'hi' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="language"
                    value="hi"
                    checked={language === 'hi'}
                    onChange={() => handleLanguageChange('hi')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`w-4 h-4 rounded-full border-2 mx-auto mb-2 ${
                      language === 'hi' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {language === 'hi' && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{t('hindi')}</p>
                      <p className="text-sm text-gray-500">हिंदी भाषा</p>
                    </div>
                  </div>
                </label>

                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                  language === 'en' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={language === 'en'}
                    onChange={() => handleLanguageChange('en')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`w-4 h-4 rounded-full border-2 mx-auto mb-2 ${
                      language === 'en' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {language === 'en' && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{t('english')}</p>
                      <p className="text-sm text-gray-500">English Language</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button className="btn-primary px-6 py-2">
                <Save className="w-4 h-4 mr-2" />
                <span>{t('saveChanges')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;