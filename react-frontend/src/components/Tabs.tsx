interface TabProps<T extends string> {
  currentTab: T;
  onTabChange: (tab: T) => void;
  tabs: Array<{
    id: T;
    label: string;
  }>;
}

export function Tabs<T extends string>({
  currentTab,
  onTabChange,
  tabs,
}: TabProps<T>) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
              ${
                currentTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
