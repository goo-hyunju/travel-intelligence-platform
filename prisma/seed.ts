
//
// 파일 경로: prisma/seed.ts
// 설명: 예시 페이지에 있던 5개 도시의 풍부한 상세 데이터를 초기 데이터로 설정합니다.
//
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.destination.deleteMany();

  const destinations = [
    {
        id: 'cebu',
        name: "세부",
        nameEn: "Cebu",
        scores: { cost: 0.4, weather: 0.3, activity: 0.9, flight: 0.4, uniqueness: 1.0 },
        summary: "독특하고 다이내믹한 해양 액티비티의 천국. 7월은 우기지만 스콜성 소나기가 특징이라 여행에 큰 지장을 주지 않을 수 있습니다. 고래상어 투어 등 특별한 경험을 원한다면 최고의 선택입니다.",
        weather: { text: "7월은 우기(6-10월)에 해당하며, 짧고 강한 스콜성 소나기가 특징입니다. 평균 25-31°C. 태풍 시즌에 접어들 수 있으니 주의가 필요합니다.", icon: '🌦️' },
        flight: { time: "4.6시간", cost: "약 15만원 ~" },
        expenses: { total: "약 130만원", breakdown: { flight: 340000, lodging: 324000, activity: 595000, food_personal: 47000 } },
        activities: ["호핑투어 (스노클링)", "모알보알 캐녀닝", "오슬롭 고래상어 투어", "세부 시티투어"],
        accommodations: ["레드 플래닛 호텔", "사보이 호텔 막탄", "퀘스트 호텔"],
        flightTime: "4.6시간",
        recommendation: "**독특한 체험을 원한다면, 세부!** 고래상어와 함께 수영하고, 수만 마리의 정어리 떼 속에서 스노클링하는 경험은 평생 잊지 못할 추억을 선사할 것입니다. 활동적인 여행을 즐긴다면 우기 날씨도 문제없습니다."
    },
    {
        id: 'nhatrang',
        name: "나트랑",
        nameEn: "Nha Trang",
        scores: { cost: 0.9, weather: 0.8, activity: 0.8, flight: 0.3, uniqueness: 0.5 },
        summary: "연중 맑은 날씨와 합리적인 물가로 해변 휴양에 이상적인 곳입니다. 7월은 건기로, 최적의 날씨 속에서 해양 스포츠, 테마파크, 머드 온천 등 휴양과 힐링을 함께 즐길 수 있습니다.",
        weather: { text: "7월은 건기에 속하며, 맑고 무더운 날씨가 이어집니다. 평균 25-33°C. 비가 거의 오지 않아 해변 활동에 최적입니다.", icon: '☀️' },
        flight: { time: "5시간", cost: "약 16만원 ~" },
        expenses: { total: "약 95만원", breakdown: { flight: 250000, lodging: 150000, activity: 150000, food_personal: 350000 } },
        activities: ["빈원더스 테마파크", "머드 온천 스파", "혼문섬 호핑투어", "포나가르 사원"],
        accommodations: ["아노바 나트랑 호텔", "선라이즈 나트랑", "쉐라톤 나트랑"],
        flightTime: "5시간",
        recommendation: "**가성비와 다양한 활동을 원한다면, 나트랑!** 저렴한 물가로 5성급 호텔, 맛있는 음식, '1일 1마사지'를 부담 없이 즐길 수 있습니다. 대규모 테마파크와 머드 온천까지 있어 지루할 틈이 없습니다."
    },
    {
        id: 'danang',
        name: "다낭",
        nameEn: "Da Nang",
        scores: { cost: 1.0, weather: 0.4, activity: 0.7, flight: 0.5, uniqueness: 0.4 },
        summary: "문화 유적과 현대적인 휴양 시설이 조화롭게 어우러진 도시입니다. 아름다운 미케 비치는 물론, 근교의 호이안 올드타운, 바나힐 등 볼거리가 풍부해 다양한 테마의 여행이 가능합니다.",
        weather: { text: "7월은 건기 막바지로, 1년 중 가장 덥고 습한 시기입니다. 평균 26-32°C, 최고 40°C에 육박할 수 있습니다.", icon: '🥵' },
        flight: { time: "4.5시간", cost: "약 15만원 ~" },
        expenses: { total: "약 85만원", breakdown: { flight: 250000, lodging: 200000, activity: 150000, food_personal: 250000 } },
        activities: ["바나힐 골든 브릿지", "호이안 올드타운 야경", "미케 비치 휴양", "오행산 탐험"],
        accommodations: ["그랜드 오션 부티크", "힐튼 가든 인", "멜리아 다낭"],
        flightTime: "4.5시간",
        recommendation: "**최고의 항공 가성비를 원한다면, 다낭!** 저렴한 항공권과 현지 물가 덕분에 부담 없이 알찬 여행이 가능합니다. 특히 근교의 호이안, 바나힐까지 둘러볼 수 있어 짧은 기간 동안 다양한 경험을 할 수 있습니다."
    },
    {
        id: 'fukuoka',
        name: "후쿠오카",
        nameEn: "Fukuoka",
        scores: { cost: 0.6, weather: 0.2, activity: 0.5, flight: 1.0, uniqueness: 0.3 },
        summary: "짧은 비행시간과 편리한 도시 인프라를 갖춘 미식과 쇼핑의 도시입니다. 7월은 덥고 습하지만, 실내 즐길 거리가 많고 근교의 유후인, 벳부 등 온천 여행을 함께 계획하기 좋습니다.",
        weather: { text: "7월은 장마와 겹쳐 매우 덥고 습합니다. 평균 22-34°C. 실내 활동 위주로 계획하는 것이 좋습니다.", icon: '♨️' },
        flight: { time: "1.3시간", cost: "약 13만원 ~" },
        expenses: { total: "약 90만원", breakdown: { flight: 150000, lodging: 250000, activity: 150000, food_personal: 350000 } },
        activities: ["유후인/벳부 온천", "캐널시티 쇼핑", "다자이후 텐만구", "나카스 야타이(포장마차)"],
        accommodations: ["앤 호텔 하카타", "TKP 선라이프 호텔", "도미 인 프리미엄"],
        flightTime: "1.3시간",
        recommendation: "**짧은 비행시간을 원한다면, 후쿠오카!** 1시간 30분이면 도착하는 압도적인 접근성 덕분에 현지에서 더 많은 시간을 보낼 수 있습니다. 쇼핑, 미식 등 도심 관광과 근교 온천 여행을 알차게 즐겨보세요."
    },
    {
        id: 'sapporo',
        name: "삿포로",
        nameEn: "Sapporo",
        scores: { cost: 0.2, weather: 1.0, activity: 0.6, flight: 0.8, uniqueness: 0.7 },
        summary: "한여름에도 한국의 봄가을처럼 쾌적한 날씨 속에서 광활한 자연과 미식을 즐길 수 있습니다. 라벤더 밭이 절정을 이루는 7월, 더위를 피해 힐링 여행을 떠나고 싶다면 최고의 선택지입니다.",
        weather: { text: "7월은 쾌적하고 선선한 여름 날씨를 보입니다. 평균 17-25°C. 더위를 피해 여행하기에 가장 좋은 환경입니다.", icon: '🌸' },
        flight: { time: "2.7시간", cost: "약 14만원 ~" },
        expenses: { total: "약 120만원", breakdown: { flight: 200000, lodging: 300000, activity: 200000, food_personal: 500000 } },
        activities: ["후라노/비에이 라벤더 투어", "오타루 운하", "삿포로 맥주 박물관", "신선한 해산물 탐방"],
        accommodations: ["게이큐 EX 호텔", "크로스 호텔", "도미인 프리미엄"],
        flightTime: "2.7시간",
        recommendation: "**쾌적한 날씨를 원한다면, 삿포로!** 무더운 7월, 더위를 피해 한국의 봄가을 같은 날씨 속에서 만개한 라벤더 밭과 대자연을 즐길 수 있습니다. 신선한 해산물과 맥주 등 미식의 즐거움은 덤입니다."
    },
  ];

  for (const dest of destinations) {
    await prisma.destination.create({
      data: dest,
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
