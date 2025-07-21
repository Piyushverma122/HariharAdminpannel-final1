import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SupportWorker {
  id: number;
  name: { en: string; hi: string };
  sector: string;
  center: { en: string; hi: string };
  dob: string;
  contact: string;
  accountNumber: string;
  bankCode: string;
  casteGroup: { en: string; hi: string };
}

const dummyWorkers: SupportWorker[] = [
  {
    id: 1,
    name: { en: 'Radha Patel', hi: 'राधा पटेल' },
    sector: 'Sector 5',
    center: { en: 'Anganwadi Center A1', hi: 'आंगनवाड़ी केंद्र A1' },
    dob: '1990-03-15',
    contact: '9876543210',
    accountNumber: '123456789012',
    bankCode: 'SBIN0001234',
    casteGroup: { en: 'OBC', hi: 'अन्य पिछड़ा वर्ग' },
  },
  {
    id: 2,
    name: { en: 'Suman Yadav', hi: 'सुमन यादव' },
    sector: 'Sector 3',
    center: { en: 'Anganwadi Center B2', hi: 'आंगनवाड़ी केंद्र B2' },
    dob: '1987-06-20',
    contact: '9123456789',
    accountNumber: '987654321098',
    bankCode: 'ICIC0005678',
    casteGroup: { en: 'SC', hi: 'अनुसूचित जाति' },
  },
  {
    id: 3,
    name: { en: 'Meena Kumari', hi: 'मीना कुमारी' },
    sector: 'Sector 2',
    center: { en: 'Anganwadi Center C3', hi: 'आंगनवाड़ी केंद्र C3' },
    dob: '1992-11-10',
    contact: '9001234567',
    accountNumber: '456789012345',
    bankCode: 'HDFC0009999',
    casteGroup: { en: 'ST', hi: 'अनुसूचित जनजाति' },
  },
  {
    id: 4,
    name: { en: 'Geeta Sharma', hi: 'गीता शर्मा' },
    sector: 'Sector 6',
    center: { en: 'Anganwadi Center D4', hi: 'आंगनवाड़ी केंद्र D4' },
    dob: '1995-07-22',
    contact: '9012345678',
    accountNumber: '789012345678',
    bankCode: 'PNB0001111',
    casteGroup: { en: 'General', hi: 'सामान्य' },
  },
  {
    id: 5,
    name: { en: 'Pooja Verma', hi: 'पूजा वर्मा' },
    sector: 'Sector 7',
    center: { en: 'Anganwadi Center E5', hi: 'आंगनवाड़ी केंद्र E5' },
    dob: '1991-03-30',
    contact: '9988776655',
    accountNumber: '654321098765',
    bankCode: 'BOB0002222',
    casteGroup: { en: 'OBC', hi: 'अन्य पिछड़ा वर्ग' },
  },
  {
    id: 6,
    name: { en: 'Kavita Thakur', hi: 'कविता ठाकुर' },
    sector: 'Sector 4',
    center: { en: 'Anganwadi Center F6', hi: 'आंगनवाड़ी केंद्र F6' },
    dob: '1989-12-25',
    contact: '8877665544',
    accountNumber: '321098765432',
    bankCode: 'AXIS0003333',
    casteGroup: { en: 'SC', hi: 'अनुसूचित जाति' },
  },
];

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginRight: '8px',
  minWidth: '140px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  marginBottom: '10px',
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: '#e6f4ea',
  color: '#2e7d32',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '13px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '24px',
  padding: '32px',
};

const searchBarStyle: React.CSSProperties = {
  width: '300px',
  margin: '0 auto',
  marginTop: '20px',
  marginBottom: '10px',
  display: 'block',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const SupportWorkers = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = dummyWorkers.filter((worker) =>
    worker.name[language].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2
        style={{
          fontSize: '26px',
          fontWeight: '600',
          textAlign: 'center',
          marginTop: '24px',
        }}
      >
        {t('supportWorkers')}
      </h2>

      <input
        type="text"
        placeholder={language === 'en' ? 'Search by name...' : 'नाम से खोजें...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchBarStyle}
      />

      <div style={gridStyle}>
        {filteredWorkers.map((worker) => (
          <div key={worker.id} style={cardStyle}>
            <h3
              style={{
                fontSize: '20px',
                marginBottom: '16px',
                fontWeight: '600',
                color: 'green',
              }}
            >
              {worker.name[language]}
            </h3>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('sector')}:</span> <span>{worker.sector}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('center')}:</span>{' '}
              <span>{worker.center[language]}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('dob')}:</span> <span>{worker.dob}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('contact')}:</span> <span>{worker.contact}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('accountNumber')}:</span>{' '}
              <span>{worker.accountNumber}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('bankCode')}:</span> <span>{worker.bankCode}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>{t('casteGroup')}:</span>
              <span style={badgeStyle}>{worker.casteGroup[language]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportWorkers;
  