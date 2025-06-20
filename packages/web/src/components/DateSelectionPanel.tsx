
// 2. 파일 경로: packages/web/src/components/DateSelectionPanel.tsx (수정)
// 설명: 누락되었던 export default 구문을 추가합니다.
//
import { useState } from 'react';

interface DateSelectionPanelProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

const DateSelectionPanel = ({ onDateChange }: DateSelectionPanelProps) => {
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-05');

  const handleApplyClick = () => {
    onDateChange(startDate, endDate);
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">0. 여행 기간 설정</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">시작일</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">종료일</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
       <button 
        onClick={handleApplyClick}
        className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        기간 적용
      </button>
    </section>
  );
};

export default DateSelectionPanel;
