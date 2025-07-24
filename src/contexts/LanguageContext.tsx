import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'; // Import useEffect

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // --- General / Layout Translations ---
    appTitle: 'Harihar Admin Panel',
    navigation: 'Navigation',
    dashboard: 'Dashboard',
    teachersStats: 'Teachers Stats',
    studentStats: 'Student Stats',
    schoolStats: 'School Stats',
    settings: 'Settings',

    // --- Dashboard Page Specific ---
    totalRecords: 'Total Records',
    overview: 'Overview',
    totalCount: 'Total Count',

    // --- AwwAwhData (Teachers Stats Page) Specific ---
    teachersStatsTitle: 'TEACHERS STATS', // Used in AwwAwhData h2
    searchTeachersPlaceholder: 'Search by name, school, or mobile', // For AwwAwhData search
    loading: 'Loading...', // General loading message
    failedToFetchTeachers: 'Failed to fetch teacher data.', // Error message
    noTeachersFound: 'No records found.', // Message for no data
    school: 'School', // Label for school
    mobile: 'Mobile', // Label for mobile
    username: 'Username', // Label for username
    employeeId: 'Employee ID', // Label for employee ID
    udise: 'UDISE', // Label for UDISE
    studentCount: 'Student Count', // Label for student count
    date: 'Date', // Label for date
    viewFullDetails: 'View Full Details', // Button text
    detailsFor: 'Details for', // Modal title prefix
    name: 'Name', // Label for name
    password: 'Password', // Label for password (if displayed)
    registrationDate: 'Registration Date', // Label for registration date

    // --- SupportWorkers (Student Stats Page) Specific ---
    studentStatsTitle: 'STUDENT STATS', // Title for SupportWorkers page
    searchStudentsPlaceholder: 'Search by name, school, UDISE, etc.', // For SupportWorkers search
    noStudentsFound: 'No records found.', // Message for no data
    class: 'Class', // Label for class
    tree: 'Tree', // Label for tree name
    verified: 'Verified', // Label for verified status
    yes: 'Yes', // For verified status
    no: 'No', // For verified status
    viewPlantationProofs: 'View Plantation Proofs', // Button text
    noProofsAvailable: 'No proofs available', // Message for no proofs
    proofsFor: 'Proofs for', // Modal title prefix
    plantImage: 'Plant Image', // Label for plant image
    certificate: 'Certificate', // Label for certificate

    // --- SchoolStats Page Specific ---
    schoolStatsTitle: 'SCHOOL STATS', // Main title for SchoolStats page
    searchSchoolsPlaceholder: 'Search by name, address, UDISE, or School ID', // Search placeholder
    failedToFetchSchools: 'Failed to fetch school data.', // Error message
    noSchoolsFound: 'No schools found.', // Message for no data
    address: 'Address', // Label for address
    schoolId: 'School ID', // Label for school ID
    sno: 'S.No.', // Label for S.No.
    schoolName: 'School Name', // Label for school name (in modal)

    // --- Settings Page Specific ---
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'Hindi',
    save: 'Save',

    // --- Other potentially used keys from your previous context ---
    dataManagement: 'Data Management',
    awwAwhData: 'AWW & AWH Data',
    supportWorkerInfo: 'Support Worker Info',
    awwWorkers: 'AWW Workers',
    awhWorkers: 'AWH Workers',
    supportWorkers: 'Support Workers',
    recentActivity: 'Recent Activity',
    Teacher: 'Teacher', // If used as a standalone label
    center: 'Center',
    anganwadiCenterName: 'Anganwadi Center Name', // Corrected from nganwadiCenterName
    dob: 'Date of Birth',
    contact: 'Contact',
    accountNumber: 'Account Number',
    bankCode: 'Bank Code',
    casteGroup: 'Caste Group',
  },
  hi: {
    // --- General / Layout Translations ---
    appTitle: 'हरिहर एडमिन पैनल',
    navigation: 'नेविगेशन',
    dashboard: 'डैशबोर्ड',
    teachersStats: 'शिक्षक आँकड़े',
    studentStats: 'छात्र आँकड़े',
    schoolStats: 'स्कूल आँकड़े',
    settings: 'सेटिंग्स',

    // --- Dashboard Page Specific ---
    totalRecords: 'कुल रिकॉर्ड',
    overview: 'अवलोकन',
    totalCount: 'कुल संख्या',

    // --- AwwAwhData (Teachers Stats Page) Specific ---
    teachersStatsTitle: 'शिक्षक आंकड़े',
    searchTeachersPlaceholder: 'नाम, स्कूल या मोबाइल से खोजें',
    loading: 'लोड हो रहा है...',
    failedToFetchTeachers: 'शिक्षक डेटा लाने में विफल।',
    noTeachersFound: 'कोई रिकॉर्ड नहीं मिला।',
    school: 'स्कूल',
    mobile: 'मोबाइल',
    username: 'उपयोगकर्ता नाम',
    employeeId: 'कर्मचारी आईडी',
    udise: 'यूडीआईएसई',
    studentCount: 'छात्र संख्या',
    date: 'दिनांक',
    viewFullDetails: 'पूरा विवरण देखें',
    detailsFor: 'विवरण के लिए',
    name: 'नाम',
    password: 'पासवर्ड',
    registrationDate: 'पंजीकरण की तिथि',

    // --- SupportWorkers (Student Stats Page) Specific ---
    studentStatsTitle: 'छात्र आंकड़े',
    searchStudentsPlaceholder: 'नाम, स्कूल, यूडीआईएसई आदि से खोजें।',
    noStudentsFound: 'कोई रिकॉर्ड नहीं मिला।',
    class: 'कक्षा',
    tree: 'वृक्ष',
    verified: 'सत्यापित',
    yes: 'हाँ',
    no: 'नहीं',
    viewPlantationProofs: 'वृक्षारोपण प्रमाण देखें',
    noProofsAvailable: 'कोई प्रमाण उपलब्ध नहीं है',
    proofsFor: 'के लिए प्रमाण',
    plantImage: 'पौधे की छवि',
    certificate: 'प्रमाणपत्र',

    // --- SchoolStats Page Specific ---
    schoolStatsTitle: 'स्कूल आंकड़े',
    searchSchoolsPlaceholder: 'नाम, पता, यूडीआईएसई या स्कूल आईडी से खोजें',
    failedToFetchSchools: 'स्कूल डेटा लाने में विफल।',
    noSchoolsFound: 'कोई स्कूल नहीं मिला।',
    address: 'पता',
    schoolId: 'स्कूल आईडी',
    sno: 'क्रमांक',
    schoolName: 'स्कूल का नाम',

    // --- Settings Page Specific ---
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    english: 'अंग्रेजी',
    hindi: 'हिंदी',
    save: 'सेव करें',

    // --- Other potentially used keys from your previous context ---
    dataManagement: 'डेटा प्रबंधन',
    awwAwhData: 'आंगनवाड़ी कार्यकर्ता और सहायिका डेटा',
    supportWorkerInfo: 'सहायिका की जानकारी',
    awwWorkers: 'आंगनवाड़ी कार्यकर्ता',
    awhWorkers: 'आंगनवाड़ी सहायिका',
    supportWorkers: 'सहायिका',
    recentActivity: 'हाल की गतिविधि',
    Teacher: 'शिक्षक',
    center: 'केंद्र',
    anganwadiCenterName: 'आंगनवाड़ी केंद्र का नाम',
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
  // Initialize language state from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return (savedLanguage === 'en' || savedLanguage === 'hi') ? savedLanguage : 'en'; // Default to English
  });

  // Update localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // The translation function
  const t = (key: string): string => {
    return translations[language][key] || key; // Fallback to key if translation not found
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