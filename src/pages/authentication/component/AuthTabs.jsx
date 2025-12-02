import React from 'react';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Masuk' },
    { id: 'register', label: 'Daftar' }
  ];

  return (
    <div className="flex space-x-2 p-1 bg-muted rounded-lg mb-8">
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => onTabChange(tab?.id)}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-smooth tap-target ${
            activeTab === tab?.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab?.label}
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;