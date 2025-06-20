import { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import Head from 'next/head';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';

// Chart.js의 모든 구성 요소를 등록합니다.
ChartJS.register(...registerables);

// --- GraphQL 쿼리 정의 ---
// 데이터베이스에서 모든 상세 정보를 가져오도록 쿼리를 확장합니다.
const GET_DESTINATIONS = gql`
  query GetDestinations {
    destinations {
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

// --- 타입 정의 ---
// 우선순위 항목의 타입을 정의합니다.
type Priority = {
  id: 'cost' | 'weather' | 'activity' | 'flight' | 'uniqueness';
  label: string;
  icon: string;
};

// 백엔드에서 받아올 여행지 데이터의 타입을 정의합니다.
interface Destination {
  id: string;
  name: string;
  nameEn: string;
  summary: string;
  flightTime: string;
  recommendation: string;
  scores: Record<string, number>;
  weather: { text: string; icon: string };
  flight: { time: string; cost: string };
  expenses: { total: string; breakdown: Record<string, number> };
  activities: string[];
  accommodations: string[];
}

// --- 상수 정의 ---
// 슬라이더로 조절할 우선순위 목록입니다.
const PRIORITIES: Priority[] = [
  { id: 'cost', label: '가성비', icon: '💰' },
  { id: 'weather', label: '날씨', icon: '☀️' },
  { id: 'activity', label: '즐길거리', icon: '🏄' },
  { id: 'flight', label: '짧은 비행', icon: '✈️' },
  { id: 'uniqueness', label: '특별함', icon: '✨' },
];

export default function Home() {
  // --- 상태 관리 ---
  // 우선순위 슬라이더 값들을 저장하는 상태
  const [priorities, setPriorities] = useState<Record<string, number>>({
    cost: 50, weather: 50, activity: 50, flight: 50, uniqueness: 50,
  });
  // 현재 선택된 상세 정보 탭을 저장하는 상태
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // --- 데이터 페칭 ---
  const { loading, error, data } = useQuery(GET_DESTINATIONS, {
    onCompleted: (fetchedData) => {
      // 데이터 로딩이 완료되면 첫 번째 도시를 활성 탭으로 설정
      if (fetchedData?.destinations?.length > 0) {
        setActiveTab(fetchedData.destinations[0].id);
      }
    },
  });

  // --- 핵심 로직: 점수 계산 ---
  // 사용자의 우선순위가 변경될 때마다 여행지 순위를 다시 계산합니다.
  const rankedDestinations = useMemo(() => {
    if (!data?.destinations) return [];

    // 1. 가중치 정규화
    const totalPriority = Object.values(priorities).reduce((sum, val) => sum + val, 0);
    const weights: Record<string, number> = {};
    if (totalPriority > 0) {
      for (const key in priorities) {
        weights[key] = priorities[key] / totalPriority;
      }
    }
    
    // 2. 각 여행지의 총점 계산
    const cityScores = data.destinations.map((dest: Destination) => {
      let totalScore = 0;
      for (const priorityId in weights) {
        totalScore += (dest.scores[priorityId] || 0) * (weights[priorityId] || 0);
      }
      return { ...dest, score: totalScore };
    });

    // 3. 점수 기준으로 내림차순 정렬
    interface CityScore extends Destination {
      score: number;
    }
    return cityScores.sort((a: CityScore, b: CityScore) => b.score - a.score);
  }, [data, priorities]);

  // --- 이벤트 핸들러 ---
  // 슬라이더 값이 변경될 때 호출되는 함수
  const handleSliderChange = (id: string, value: string) => {
    setPriorities((prev) => ({ ...prev, [id]: Number(value) }));
  };

  // --- 렌더링을 위한 데이터 준비 ---
  const topCity = rankedDestinations[0];
  const activeCityData = data?.destinations.find((d: Destination) => d.id === activeTab);
  
  // Radar Chart 데이터
  interface RadarChartData {
    labels: string[];
    datasets: RadarChartDataset[];
  }

  interface RadarChartDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }

  const radarChartData: RadarChartData = {
    labels: data?.destinations.map((d: Destination) => d.name) || [],
    datasets: [{
      label: '종합 매력도 점수',
      data: data?.destinations.map((d: Destination) => rankedDestinations.find((ranked: Destination & { score: number }) => ranked.id === d.id)?.score * 100 || 0) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }],
  };
  
  // Doughnut Chart 데이터
  const doughnutChartData = activeCityData ? {
    labels: ['항공', '숙소', '액티비티', '식비/기타'],
    datasets: [{
      data: Object.values(activeCityData.expenses.breakdown),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      hoverOffset: 4,
    }],
  } : { labels: [], datasets: [] };


  // 로딩 및 에러 처리
  if (loading) return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">오류가 발생했습니다: {error.message}</div>;

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
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">나에게 꼭 맞는 7월 여름휴가 찾기</h1>
            <p className="text-center text-gray-500 dark:text-gray-300 mt-1">여행 스타일을 설정하고 최적의 목적지를 추천 받아보세요.</p>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 좌측: 컨트롤 패널 & 추천 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 우선순위 설정 */}
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
              {/* 추천 섹션 */}
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

            {/* 우측: 대시보드 & 상세 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 레이더 차트 */}
              <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-2 text-center text-blue-700 dark:text-blue-400">종합 비교 대시보드</h2>
                <div className="relative h-80 md:h-96">
                  <Radar data={radarChartData} options={{ maintainAspectRatio: false, scales: { r: { suggestedMin: 0, suggestedMax: 100 } } }} />
                </div>
              </section>

              {/* 상세 정보 */}
              <section className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">상세 정보 탐색</h2>
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex flex-wrap -mb-px">
                    {data.destinations.map((d: Destination) => (
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
                         <div className="text-2xl">{activeCityData.weather.icon}</div>
                         <div className="font-semibold mt-1 dark:text-white">날씨</div>
                         <p className="text-sm text-gray-600 dark:text-gray-400">{activeCityData.weather.text}</p>
                       </div>
                       <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                         <div className="text-2xl">💸</div>
                         <div className="font-semibold mt-1 dark:text-white">예상 경비</div>
                         <p className="text-sm text-gray-600 dark:text-gray-400">{activeCityData.expenses.total}</p>
                       </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-3 dark:text-white">주요 즐길 거리</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                {activeCityData.activities.map((act: string) => <li key={act}>{act}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-center mb-3 dark:text-white">예상 경비 구성</h4>
                            <div className="relative h-64">
                                <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
