import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  en: {
    [key: string]: string;
  };
  hi: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    dataManagement: 'Data Management',
    awwAwhData: 'AWW & AWH Data',
    supportWorkerInfo: 'Support Worker Info',
    settings: 'Settings',
    navigation: 'Navigation',

    // Dashboard
    totalRecords: 'Total Records',
    awwWorkers: 'AWW Workers',
    awhWorkers: 'AWH Workers',
    supportWorkers: 'Support Workers',
    recentActivity: 'Recent Activity',

    // Settings
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'Hindi',
    save: 'Save',

    // App Title
    appTitle: 'Harihar Admin Panel',

    // Support worker 
    sector: 'Sector',
    anganwadiCenterName: 'Anganwadi Center Name',
    dob: 'Date of Birth',
    contact: 'Contact',
    accountNumber: 'Account Number',
    bankCode: 'Bank Code',
    casteGroup: 'Caste Group',
    
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    dataManagement: 'डेटा प्रबंधन',
    awwAwhData: 'आंगनवाड़ी कार्यकर्ता और सहायिका डेटा',
    supportWorkerInfo: 'सहायिका की जानकारी',
    settings: 'सेटिंग्स',
    navigation: 'नेविगेशन',

    // Dashboard
    totalRecords: 'कुल रिकॉर्ड',
    awwWorkers: 'आंगनवाड़ी कार्यकर्ता',
    awhWorkers: 'आंगनवाड़ी सहायिका',
    supportWorkers: 'सहायिका',
    recentActivity: 'हाल की गतिविधि',

    // Settings
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    english: 'अंग्रेजी',
    hindi: 'हिंदी',
    save: 'सेव करें',

    // App Title
    appTitle: 'हरिहर एडमिन पैनल',

    // Support worker
    sector: 'सेक्टर',
    center:'सेंटर',
    nganwadiCenterName: 'आंगनवाड़ी केंद्र का नाम',
    dob: 'जन्म तिथि',
    contact: 'संपर्क',
    accountNumber: 'खाता संख्या',
    bankCode: 'बैंक कोड',
    casteGroup: 'जाति समूह',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi'); // Default to Hindi

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
