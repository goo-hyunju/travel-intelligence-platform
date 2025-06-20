
//
// 3. 파일 경로: packages/web/src/components/DestinationSelector.tsx (수정)
// 설명: 검색 로직을 개선하여 더 정확하고 관대한 검색이 가능하도록 수정합니다.
//
import { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Destination } from '@/types'; // 중앙 타입 임포트

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
    
    // [수정] 검색어를 소문자로 변환하여, 대소문자 구분 없는 검색을 보장합니다.
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    // 이미 선택된 도시는 목록에서 제외하기 위해 ID Set을 만듭니다.
    const selectedIds = new Set(selectedDestinations.map(d => d.id));

    // 검색어가 비어있으면 필터링하지 않습니다.
    if (!lowercasedSearchTerm) {
      return [];
    }

    return data.allDestinations.filter((dest: Destination) => {
      // 1. 이미 선택된 도시인지 확인
      const isAlreadySelected = selectedIds.has(dest.id);
      if (isAlreadySelected) {
        return false;
      }

      // 2. 한글 또는 영문 이름에 검색어가 포함되는지 확인
      const nameMatches = dest.name.toLowerCase().includes(lowercasedSearchTerm);
      const nameEnMatches = dest.nameEn?.toLowerCase().includes(lowercasedSearchTerm) ?? false;
      
      return nameMatches || nameEnMatches;
    });
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
        {filteredDestinations.length > 0 && (
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
