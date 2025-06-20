
//
// 4. 파일 경로: packages/web/src/pages/index.tsx (수정됨)
// 설명: 기본 선택 도시를 설정하고, 관련 로직을 수정합니다.
//
import { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import Head from 'next/head';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';
import DateSelectionPanel from '@/components/DateSelectionPanel';
import DestinationSelector from '@/components/DestinationSelector';
import { Destination, Priority } from '@/types'; // 중앙 타입 임포트

ChartJS.register(...registerables);

const GET_DESTINATIONS = gql`
  query GetDestinations($ids: [String!]!, $month: Int!, $startDate: String!, $endDate: String!) {
    destinationsByIds(ids: $ids, month: $month, startDate: $startDate, endDate: $endDate) {
      id
      name
      nameEn
      summary
      flightTime
      recommendation
      scores
      weather
      flight
      expenses
      activities
      accommodations
    }
  }
`;

const PRIORITIES: Priority[] = [
  { id: 'cost', label: '가성비', icon: '💰' }, { id: 'weather', label: '날씨', icon: '☀️' },
  { id: 'activity', label: '즐길거리', icon: '🏄' }, { id: 'flight', label: '짧은 비행', icon: '✈️' },
  { id: 'uniqueness', label: '특별함', icon: '✨' },
];

// [수정] 기본으로 선택될 도시 목록을 정의합니다.
// 이 도시들이 seed.ts에 포함되어 있어야 정상적으로 데이터를 불러옵니다.
const defaultDestinations: Destination[] = [
    { id: 'bangkok', name: '방콕', nameEn: 'Bangkok' },
    { id: 'nhatrang', name: '나트랑', nameEn: 'Nha Trang' },
    { id: 'cebu', name: '세부', nameEn: 'Cebu' },
    { id: 'sapporo', name: '삿포로', nameEn: 'Sapporo' },
    { id: 'fukuoka', name: '후쿠오카', nameEn: 'Fukuoka' },
    { id: 'osaka', name: '오사카', nameEn: 'Osaka' },
];


export default function Home() {
  const [dates, setDates] = useState({ startDate: '2025-08-01', endDate: '2025-08-05', month: 8 });
  const [priorities, setPriorities] = useState<Record<string, number>>({ cost: 50, weather: 50, activity: 50, flight: 50, uniqueness: 50 });
  // [수정] useState의 초기값으로 기본 도시 목록을 사용합니다.
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>(defaultDestinations);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_DESTINATIONS, {
    variables: { 
      ids: selectedDestinations.map(d => d.id),
      ...dates 
    },
    skip: selectedDestinations.length === 0,
    onCompleted: (fetchedData) => {
      if (fetchedData?.destinationsByIds?.length > 0 && (!activeTab || !selectedDestinations.find(d => d.id === activeTab))) {
        setActiveTab(fetchedData.destinationsByIds[0].id);
      }
    },
  });

  const handleSelectionChange = (newSelection: Destination[]) => {
    setSelectedDestinations(newSelection);
    // 선택된 도시가 있을 때만 데이터 요청
    if (newSelection.length > 0) {
      refetch({ ids: newSelection.map(d => d.id), ...dates });
    } else {
        // 선택된 도시가 없으면 탭도 초기화
        setActiveTab(null);
    }
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    const newMonth = new Date(startDate).getMonth() + 1;
    const newDates = { startDate, endDate, month: newMonth };
    setDates(newDates);
    if (selectedDestinations.length > 0) {
        refetch({ ids: selectedDestinations.map(d => d.id), ...newDates });
    }
  };

  const handleSliderChange = (id: string, value: string) => {
    setPriorities((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const rankedDestinations = useMemo(() => {
    if (!data?.destinationsByIds) return [];
    const totalPriority = Object.values(priorities).reduce((sum, val) => sum + val, 0);
    const weights: Record<string, number> = {};
    if (totalPriority > 0) {
      for (const key in priorities) {
        weights[key] = priorities[key] / totalPriority;
      }
    }
    const cityScores = data.destinationsByIds.map((dest: Destination) => {
      let totalScore = 0;
      if(dest.scores) {
        for (const priorityId in weights) {
          totalScore += (dest.scores[priorityId] || 0) * (weights[priorityId] || 0);
        }
      }
      return { ...dest, score: totalScore };
    });
    interface CityScore extends Destination { score: number; }
    return cityScores.sort((a: CityScore, b: CityScore) => b.score - a.score);
  }, [data, priorities]);

  const topCity = rankedDestinations[0];
  const activeCityData = data?.destinationsByIds.find((d: Destination) => d.id === activeTab);
  
  const radarChartData = {
    labels: data?.destinationsByIds.map((d: Destination) => d.name) || [],
    datasets: [{
      label: '종합 매력도 점수',
      data: data?.destinationsByIds.map((d: Destination) => rankedDestinations.find((ranked: Destination & { score: number }) => ranked.id === d.id)?.score * 100 || 0) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }],
  };
  
  const doughnutChartData = activeCityData && activeCityData.expenses ? {
    labels: ['항공', '숙소', '액티비티', '식비/기타'],
    datasets: [{
      data: Object.values(activeCityData.expenses.breakdown),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      hoverOffset: 4,
    }],
  } : { labels: [], datasets: [] };
  
  return (
    <>
      <Head>
        <title>인터랙티브 여행지 비교 분석</title>
        <meta name="description" content="실시간 여행지 비교 분석" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">나에게 꼭 맞는 여행 찾기</h1>
                <p className="text-center text-gray-500 dark:text-gray-300 mt-1">여행 스타일을 설정하고 최적의 목적지를 추천 받아보세요.</p>
            </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <DestinationSelector selectedDestinations={selectedDestinations} onSelectionChange={handleSelectionChange} />
              <DateSelectionPanel onDateChange={handleDateChange} />
              <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">1. 나의 여행 우선순위</h2>
                <div className="space-y-4">
                  {PRIORITIES.map(({ id, label, icon }) => (
                    <div key={id}>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-300">{icon} {label}</label>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{priorities[id]}</span>
                      </div>
                      <input id={id} type="range" min="0" max="100" step="5" value={priorities[id]}
                        onChange={(e) => handleSliderChange(id, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500" />
                    </div>
                  ))}
                </div>
              </section>
              {topCity && (
                <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">2. 당신을 위한 최고의 여행지</h2>
                  <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">{topCity.name} ({(topCity.score * 100).toFixed(1)}점)</h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{topCity.recommendation}</p>
                  </div>
                </section>
              )}
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              {selectedDestinations.length === 0 ? (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center h-full flex flex-col justify-center items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">여행지를 선택해주세요</h2>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">왼쪽 패널에서 비교하고 싶은 도시를 검색하고 추가해보세요.</p>
                </div>
              ) : (
                <>
                  {loading && <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center"><p>데이터를 불러오는 중입니다...</p></div>}
                  {error && <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center"><p>오류: {error.message}</p></div>}
                  {!loading && !error && data?.destinationsByIds && (
                    <>
                      <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-2 text-center text-blue-700 dark:text-blue-400">종합 비교 대시보드</h2>
                        <div className="relative h-80 md:h-96">
                          <Radar data={radarChartData} options={{ maintainAspectRatio: false, scales: { r: { suggestedMin: 0, suggestedMax: 100 } } }} />
                        </div>
                      </section>

                      <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">상세 정보 탐색</h2>
                        <div className="border-b border-gray-200 dark:border-gray-700">
                          <nav className="flex flex-wrap -mb-px">
                            {data.destinationsByIds.map((d: Destination) => (
                              <button key={d.id} onClick={() => setActiveTab(d.id)}
                                className={`py-3 px-4 font-medium border-b-2 transition-colors ${activeTab === d.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                {d.name}
                              </button>
                            ))}
                          </nav>
                        </div>
                        {activeCityData && (
                          <div className="mt-6 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold dark:text-white">{activeCityData.name}</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">{activeCityData.summary}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                               <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                                 <div className="text-2xl">{activeCityData.weather?.icon}</div>
                                 <div className="font-semibold mt-1 dark:text-white">날씨</div>
                                 <p className="text-sm text-gray-600 dark:text-gray-400">{activeCityData.weather?.text}</p>
                               </div>
                               <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                                 <div className="text-2xl">💸</div>
                                 <div className="font-semibold mt-1 dark:text-white">예상 경비</div>
                                 <p className="text-sm text-gray-600 dark:text-gray-400">{activeCityData.expenses?.total}</p>
                               </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-3 dark:text-white">주요 즐길 거리</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                        {activeCityData.activities?.map((act: string) => <li key={act}>{act}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-center mb-3 dark:text-white">예상 경비 구성</h4>
                                    <div className="relative h-64">
                                        {activeCityData.expenses && <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false }} />}
                                    </div>
                                </div>
                            </div>
                          </div>
                        )}
                      </section>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
