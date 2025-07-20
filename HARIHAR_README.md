# Harihar Admin Panel

एक पेड़ माँ के नाम 2.0 - Raipur Admin Panel

## Overview

This is the admin panel for the Harihar app, specifically designed for the "Ek Ped Maa Ke Naam 2.0" project in Raipur. The admin panel provides a simple and user-friendly interface to manage worker data and system settings.

## Features

### 🌐 Multi-language Support
- Hindi (हिंदी) - Default
- English
- Easy language switching in settings

### 📊 Dashboard
- Overview of all worker statistics
- Quick action buttons
- Recent activity tracking

### 👥 Data Management
- **AWW & AWH Data**: Manage Anganwadi workers and helpers
- **Support Worker Info**: Manage support worker information
- Search and filter functionality
- Export data capabilities

### ⚙️ Settings
- Language preferences
- System status monitoring
- App configuration

## Data Sources

The admin panel is designed to work with the following Excel files:
- `2AWW and AWH.xlsx` - Anganwadi workers and helpers data
- `आं.बा.सहायिका की जानकारी.xlsx` - Support worker information

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

1. Navigate to the project directory:
   ```bash
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage Instructions

### Language Switching
1. Go to Settings page (⚙️ Settings in sidebar)
2. Select preferred language (Hindi/English)
3. Click Save to apply changes

### Managing Data
1. Navigate to respective data management pages from sidebar
2. Use search functionality to find specific records
3. Use action buttons (👁️ View, ✏️ Edit, 🗑️ Delete) to manage records
4. Export data using the 📥 Export button

### Dashboard Overview
- View summary statistics for all worker types
- Monitor recent activities
- Access quick actions for common tasks

## Project Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with sidebar
│   ├── contexts/
│   │   └── LanguageContext.tsx # Hindi/English language switching
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main dashboard with statistics
│   │   ├── AwwAwhData.tsx     # AWW & AWH worker data management
│   │   ├── SupportWorkers.tsx  # Support worker information
│   │   └── Settings.tsx        # Language & app settings
│   └── App.tsx                 # Main app with routing
```

## Key Features Implemented

✅ **Responsive Design**: Works on mobile, tablet, and desktop
✅ **Hindi/English Support**: Complete bilingual interface
✅ **Clean UI**: Simple, professional design using Tailwind CSS
✅ **Data Tables**: Searchable, filterable data tables
✅ **Dashboard**: Statistical overview with charts and metrics
✅ **Settings Page**: Language preferences and system info
✅ **TypeScript**: Full type safety and better development experience

## Next Steps for Data Integration

To integrate real Excel data:
1. Add a library like `xlsx` or `react-excel-renderer`
2. Create API endpoints to read Excel files
3. Replace mock data in components with real data from Excel files
4. Add CRUD operations for data management

This admin panel provides a solid foundation for managing your Harihar app data with a professional, user-friendly interface.
