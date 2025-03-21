'use client';

import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

// TS Interfaces
interface TabsContextType {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

interface TabsProviderProps {
    children: ReactNode;
    defaultTab: string;
}

interface TabsListProps {
    children: ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    id: string;
    children: ReactNode;
    count?: number;
}

interface TabsContentProps {
    id: string;
    children: ReactNode;
}

interface TabsProps {
    defaultTab: string;
    children: ReactNode;
    className?: string;
}

// Context
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Provider Component
export const TabsProvider: FC<TabsProviderProps> = ({
                                                        children,
                                                        defaultTab,
                                                    }) => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabsContext.Provider>
    );
};

// Custom Hook
export const useTabsContext = (): TabsContextType => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('useTabsContext must be used within a TabsProvider');
    }
    return context;
};

// TabsList Component
const TabsList: FC<TabsListProps> = ({ children, className = '' }) => {
    return (
        <nav className={`mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5 ${className}`}>
            {children}
        </nav>
    );
};

// TabsTrigger Component
const TabsTrigger: FC<TabsTriggerProps> = ({ id, children, count }) => {
    const { activeTab, setActiveTab } = useTabsContext();

    const isActive = activeTab === id;

    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 border-b-2 px-2.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
                isActive
                    ? 'text-brand-500 dark:border-brand-400 border-brand-500 dark:text-brand-400'
                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
            {children}
            {count !== undefined && (
                <span className="inline-block items-center justify-center rounded-full bg-brand-50 px-2 py-0.5 text-center text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
          {count}
        </span>
            )}
        </button>
    );
};

// TabsContent Component
const TabsContent: FC<TabsContentProps> = ({ id, children }) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== id) {
        return null;
    }

    return <div>{children}</div>;
};

// Main Tabs Component
export const Tabs: FC<TabsProps> = ({ defaultTab, children, className = '' }) => {
    return (
        <TabsProvider defaultTab={defaultTab}>
            <div className={`space-y-6 ${className}`}>
                <div className="p-6 bg-white rounded-3xl">
                    {children}
                </div>
            </div>
        </TabsProvider>
    );
};

// Export all components
export { TabsList, TabsTrigger, TabsContent };