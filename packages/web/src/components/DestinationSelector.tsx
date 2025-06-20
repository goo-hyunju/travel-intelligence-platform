// 1. 파일 경로: packages/web/src/components/DestinationSelector.tsx (새 파일)
// 설명: 사용자가 여행지를 검색하고, 비교 목록에 추가/삭제할 수 있는 UI 컴포넌트입니다.
//
import { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';

// DB에 있는 모든 여행지의 이름과 ID를 가져오는 쿼리
const GET_ALL_DESTINATIONS_LIST = gql`
  query GetAllDestinationsList {
    allDestinations {
      id
      name
      nameEn
    }
  }
`;

interface Destination {
  id: string;
  name: string;
  nameEn: string;
}

interface DestinationSelectorProps {
  selectedDestinations: Destination[];
  onSelectionChange: (selected: Destination[]) => void;
}

const DestinationSelector = ({ selectedDestinations, onSelectionChange }: DestinationSelectorProps) => {
  const { data, loading, error } = useQuery(GET_ALL_DESTINATIONS_LIST);
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어에 따라 필터링된 여행지 목록
  const filteredDestinations = useMemo(() => {
    if (!data?.allDestinations) return [];
    // 이미 선택된 도시는 목록에서 제외
    const selectedIds = new Set(selectedDestinations.map(d => d.id));
    return data.allDestinations.filter(
      (dest: Destination) =>
        !selectedIds.has(dest.id) &&
        (dest.name.includes(searchTerm) || dest.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm, selectedDestinations]);

  const addDestination = (dest: Destination) => {
    onSelectionChange([...selectedDestinations, dest]);
    setSearchTerm('');
  };

  const removeDestination = (destId: string) => {
    onSelectionChange(selectedDestinations.filter(d => d.id !== destId));
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">여행지 선택</h2>
      {/* 선택된 도시 목록 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedDestinations.map(dest => (
          <div key={dest.id} className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
            <span>{dest.name}</span>
            <button onClick={() => removeDestination(dest.id)} className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-white">
              &times;
            </button>
          </div>
        ))}
      </div>
      {/* 검색 입력창 */}
      <div className="relative">
        <input
          type="text"
          placeholder="도시 이름 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {/* 검색 결과 드롭다운 */}
        {searchTerm && filteredDestinations.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredDestinations.map((dest: Destination) => (
              <li key={dest.id}>
                <button onClick={() => addDestination(dest)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  {dest.name} ({dest.nameEn})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default DestinationSelector;
// 이 컴포넌트는 사용자가 여행지를 검색하고 선택할 수 있는 UI를 제공합니다.
// 선택된 여행지는 상위 컴포넌트에서 관리되며, 추가/삭제 시 상위 컴포넌트의 상태를 업데이트합니다.
// 검색어에 따라 필터링된 여행지 목록을 보여주며, 선택된 여행지는 목록 상단에 표시됩니다.       
// 이 컴포넌트는 여행지 선택 UI를 구현하며, Apollo Client를 사용하여 GraphQL 쿼리로 데이터를 가져옵니다.
// 선택된 여행지는 상위 컴포넌트에서 관리되며, 추가/삭제 시 상위 컴포넌트의 상태를 업데이트합니다.
// 검색어에 따라 필터링된 여행지 목록을 보여주며, 선택된