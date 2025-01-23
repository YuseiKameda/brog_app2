import React from 'react';

type TabsProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { name: "posts", label: "自分の投稿一覧" },
        { name: "likes", label: "いいね" },
        { name: "bookmarks", label: "ブックマーク" },
    ];

    return (
        <div className="flex border-b">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => onTabChange(tab.name)}
                    className={`py-2 px-4 -mb-px border-b-2 font-medium text-sm focus:outline-none ${
                        activeTab === tab.name
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
