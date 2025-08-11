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
    schoolStats: 'School Stats',
    settings: 'Settings',
    logout: 'Logout',

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

    // --- StudentDetails Page Specific ---
    studentDetailsTitle: 'Student Details',
    enterUdiseCodePlaceholder: 'Enter UDISE code to search for students...',
    searchStudents: 'Search Students',
    searching: 'Searching...',
    filterResults: 'Filter Results:',
    filters: 'Filters',
    filterOptions: 'Filter Options',
    clearAllFilters: 'Clear All Filters',
    udiseCodeFilter: 'UDISE Code',
    filterByUdiseCodePlaceholder: 'Filter by UDISE code...',
    classFilter: 'Class',
    allClasses: 'All Classes',
    activeFilters: 'Active Filters:',
    searchingForStudents: 'Searching for students...',
    noStudentsFoundForUdise: 'No students found for UDISE code:',
    noStudentsMatchFilters: 'No students match the current filters',
    clearFilters: 'Clear Filters',
    foundStudents: 'Found',
    student: 'student',
    students: 'students',
    filteredFrom: 'filtered from',
    total: 'total',
    forUdise: 'for UDISE:',
    schoolNameLabel: 'School Name',
    classNameLabel: 'Class',
    treeNameLabel: 'Tree',
    plantImageLabel: 'Plant Image',
    studentPhotoLabel: 'Student Photo',
    viewFullDetailsButton: 'View Full Details',
    studentDetailsModal: 'Student Details',
    studentNameLabel: 'Student Name',
    udiseCodeLabel: 'UDISE Code',
    registrationDateLabel: 'Registration Date',
    uploadedDocuments: 'Uploaded Documents',
    viewPlantImage: 'View Plant Image',
    viewStudentPhoto: 'View Student Photo',
    pleaseEnterUdiseCode: 'Please enter a UDISE code',
    pleaseEnterValidUdiseCode: 'Please enter a valid UDISE code',
    failedToFetchStudentData: 'Failed to fetch student data. Please check your connection and try again.',
    class1: 'Class 1',
    class2: 'Class 2',
    class3: 'Class 3',
    class4: 'Class 4',
    class5: 'Class 5',
    class6: 'Class 6',
    class7: 'Class 7',
    class8: 'Class 8',
    class9: 'Class 9',
    class10: 'Class 10',
    class11: 'Class 11',
    class12: 'Class 12',
    notAvailable: 'N/A',

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
    schoolStats: 'स्कूल आँकड़े',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',

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

    // --- StudentDetails Page Specific ---
    studentDetailsTitle: 'छात्र विवरण',
    enterUdiseCodePlaceholder: 'छात्रों की खोज के लिए यूडीआईएसई कोड दर्ज करें...',
    searchStudents: 'छात्र खोजें',
    searching: 'खोज रहे हैं...',
    filterResults: 'परिणाम फ़िल्टर करें:',
    filters: 'फ़िल्टर',
    filterOptions: 'फ़िल्टर विकल्प',
    clearAllFilters: 'सभी फ़िल्टर साफ़ करें',
    udiseCodeFilter: 'यूडीआईएसई कोड',
    filterByUdiseCodePlaceholder: 'यूडीआईएसई कोड से फ़िल्टर करें...',
    classFilter: 'कक्षा',
    allClasses: 'सभी कक्षाएं',
    activeFilters: 'सक्रिय फ़िल्टर:',
    searchingForStudents: 'छात्रों की खोज की जा रही है...',
    noStudentsFoundForUdise: 'यूडीआईएसई कोड के लिए कोई छात्र नहीं मिला:',
    noStudentsMatchFilters: 'कोई छात्र वर्तमान फ़िल्टर से मेल नहीं खाता',
    clearFilters: 'फ़िल्टर साफ़ करें',
    foundStudents: 'मिले',
    student: 'छात्र',
    students: 'छात्र',
    filteredFrom: 'से फ़िल्टर किया गया',
    total: 'कुल',
    forUdise: 'यूडीआईएसई के लिए:',
    schoolNameLabel: 'स्कूल का नाम',
    classNameLabel: 'कक्षा',
    treeNameLabel: 'वृक्ष',
    plantImageLabel: 'पौधे की छवि',
    studentPhotoLabel: 'छात्र फोटो',
    viewFullDetailsButton: 'पूरा विवरण देखें',
    studentDetailsModal: 'छात्र विवरण',
    studentNameLabel: 'छात्र का नाम',
    udiseCodeLabel: 'यूडीआईएसई कोड',
    registrationDateLabel: 'पंजीकरण तिथि',
    uploadedDocuments: 'अपलोड किए गए दस्तावेज़',
    viewPlantImage: 'पौधे की छवि देखें',
    viewStudentPhoto: 'छात्र फोटो देखें',
    pleaseEnterUdiseCode: 'कृपया यूडीआईएसई कोड दर्ज करें',
    pleaseEnterValidUdiseCode: 'कृपया एक वैध यूडीआईएसई कोड दर्ज करें',
    failedToFetchStudentData: 'छात्र डेटा लाने में विफल। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
    class1: 'कक्षा 1',
    class2: 'कक्षा 2',
    class3: 'कक्षा 3',
    class4: 'कक्षा 4',
    class5: 'कक्षा 5',
    class6: 'कक्षा 6',
    class7: 'कक्षा 7',
    class8: 'कक्षा 8',
    class9: 'कक्षा 9',
    class10: 'कक्षा 10',
    class11: 'कक्षा 11',
    class12: 'कक्षा 12',
    notAvailable: 'उपलब्ध नहीं',

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