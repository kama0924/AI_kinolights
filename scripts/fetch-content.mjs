import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const OTTS = ['Netflix', 'Disney+', 'TVING', 'Wavve', 'Watcha', 'Coupang Play'];

const curatedMovies = [
  { id: 1111111, title: '파묘', year: 2024, rating: '4.2', poster: 'https://image.tmdb.org/t/p/w500/pQYHouPsDw32FhDLr7E3jmw0WTk.jpg', backdrop: 'https://image.tmdb.org/t/p/w500/pQYHouPsDw32FhDLr7E3jmw0WTk.jpg', overview: '기이한 사건을 조사하는 사람들에게 벌어지는 일을 다룬 오컬트 스릴러.', country: 'KR' },
  { id: 8725851, title: '서울의 봄', year: 2023, rating: '4.6', poster: 'https://image.tmdb.org/t/p/w500/rm2e6Tr9yXE4SP11gPfS1VwqWbI.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/yWf4Eq3cVd8qV61pK0wSqxX4kUP.jpg', overview: '1979년 서울의 긴박했던 순간을 담아낸 작품.', country: 'KR' },
  { id: 693134, title: '듄: 파트 2', year: 2024, rating: '4.4', poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', overview: '폴 아트레이드의 운명이 본격적으로 움직이기 시작한다.', country: 'US' },
  { id: 872585, title: '오펜하이머', year: 2023, rating: '4.3', poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', overview: '세상을 바꾼 천재 물리학자의 고뇌와 선택을 다룬 전기 드라마.', country: 'US' },
  { id: 496243, title: '기생충', year: 2019, rating: '4.6', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg', overview: '두 가족의 만남으로 벌어지는 예측불가 이야기.', country: 'KR' },
  { id: 603692, title: '존 윅 4', year: 2023, rating: '4.1', poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/h8gHn0OzBoaefsYseUByqsmEDMY.jpg', overview: '끝나지 않은 전설의 복수가 이어진다.', country: 'US' },
  { id: 575264, title: '미션 임파서블: 데드 레코닝 PART ONE', year: 2023, rating: '4.0', poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/628Dep6AxEtDxjZoGP78TsOxYbK.jpg', overview: '에단 헌트의 새로운 글로벌 미션.', country: 'US' },
];

const netflix2026 = [
  { id: 'nfm-2026-1', title: 'Atlas Beyond', type: '영화', year: 2026, rating: '4.1', country: 'US' },
  { id: 'nfm-2026-2', title: 'Red Notice: Legacy', type: '영화', year: 2026, rating: '3.9', country: 'US' },
  { id: 'nfd-2026-1', title: '오징어 게임 시즌3', type: '드라마', year: 2026, rating: '4.5', country: 'KR' },
  { id: 'nfd-2026-2', title: '킹덤: 뉴 블러드', type: '드라마', year: 2026, rating: '4.2', country: 'KR' },
  { id: 'nfd-2026-3', title: 'Wednesday: Semester Two', type: '드라마', year: 2026, rating: '4.3', country: 'US' },
  { id: 'nfd-2026-4', title: 'Bridgerton: New Chapter', type: '드라마', year: 2026, rating: '4.0', country: 'US' },
];

const curatedVariety = [
  { id: 'var-1', title: '런닝맨', year: 2010, rating: '4.3', poster: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-2', title: '나 혼자 산다', year: 2013, rating: '4.1', poster: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-3', title: '무한도전', year: 2005, rating: '4.8', poster: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-4', title: '유 퀴즈 온 더 블럭', year: 2018, rating: '4.2', poster: 'https://images.unsplash.com/photo-1522863602463-afebb8886ab2?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-5', title: '스트릿 우먼 파이터', year: 2021, rating: '4.0', poster: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-6', title: '피지컬: 100', year: 2023, rating: '4.2', poster: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-7', title: '흑백요리사', year: 2024, rating: '4.1', poster: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-8', title: '환승연애', year: 2021, rating: '3.9', poster: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-9', title: '지구오락실', year: 2022, rating: '4.0', poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1280&q=80' },
  { id: 'var-10', title: '복면가왕', year: 2015, rating: '3.8', poster: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', backdrop: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1280&q=80' },
];

const stripHtml = (input = '') => String(input ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const hasEnglish = (text = '') => /[A-Za-z]{3,}/.test(text);
const koreanizeOverview = (raw) => {
  const cleaned = stripHtml(raw);
  if (!cleaned || hasEnglish(cleaned)) return '주요 인물과 사건을 중심으로 전개되는 작품입니다.';
  return cleaned;
};

const pickOtt = (seedText) => {
  const seed = [...seedText].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const first = OTTS[seed % OTTS.length];
  const second = OTTS[(seed + 2) % OTTS.length];
  return first === second ? [first] : [first, second];
};

function fetchViaCurl(url) {
  const output = execSync(`curl -sL --max-time 30 "${url}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(output);
}

const movieItems = curatedMovies.map((movie) => ({
  id: `movie-${movie.id}`,
  title: movie.title,
  type: '영화',
  isNew: movie.year >= 2023,
  year: String(movie.year),
  rating: movie.rating,
  poster: movie.poster,
  backdrop: movie.backdrop,
  overview: movie.overview,
  genres: ['영화'],
  ott: pickOtt(movie.title),
  runtime: '120분',
  country: movie.country,
  releaseDate: `${movie.year}-01-01`,
  cast: ['상세 출연진 정보 준비 중'],
}));

const netflix2026Items = netflix2026.map((item, idx) => ({
  id: item.id,
  title: item.title,
  type: item.type,
  isNew: true,
  year: String(item.year),
  rating: item.rating,
  poster: `https://picsum.photos/seed/netflix-2026-${idx + 1}/500/750`,
  backdrop: `https://picsum.photos/seed/netflix-2026-bg-${idx + 1}/1280/720`,
  overview: '2026년 넷플릭스 최신 공개 예정작으로 기대를 모으고 있는 작품입니다.',
  genres: [item.type === '영화' ? '액션' : '드라마'],
  ott: ['Netflix'],
  runtime: item.type === '영화' ? '124분' : '10부작',
  country: item.country,
  releaseDate: `${item.year}-01-01`,
  cast: ['상세 출연진 정보 준비 중'],
}));

const varietyItems = curatedVariety.map((show) => ({
  id: show.id,
  title: show.title,
  type: '예능',
  isNew: show.year >= 2023,
  year: String(show.year),
  rating: show.rating,
  poster: show.poster,
  backdrop: show.backdrop,
  overview: '출연진이 매회 새로운 미션과 토크를 선보이는 인기 예능 프로그램입니다.',
  genres: ['예능', '리얼리티'],
  ott: pickOtt(show.title),
  runtime: '90분',
  country: 'KR',
  releaseDate: `${show.year}-01-01`,
  cast: ['상세 출연진 정보 준비 중'],
}));

function normalizeDrama(show) {
  const year = Number(show.premiered?.slice(0, 4) || 0);
  return {
    id: `show-${show.id}`,
    title: show.name,
    type: '드라마',
    isNew: year >= 2023,
    year: show.premiered?.slice(0, 4) || '-',
    rating: Number(show.rating?.average || 0).toFixed(1),
    poster: show.image?.original || show.image?.medium || '',
    backdrop: show.image?.original || show.image?.medium || '',
    overview: koreanizeOverview(show.summary),
    genres: (show.genres && show.genres.length > 0) ? show.genres : ['드라마'],
    ott: pickOtt(show.name),
    runtime: show.runtime ? `${show.runtime}분` : '-',
    country: show.network?.country?.code || show.webChannel?.country?.code || '-',
    releaseDate: show.premiered || '-',
    cast: [show.network?.name, show.webChannel?.name, show.language].filter(Boolean),
  };
}

function normalizeAnime(anime) {
  const year = anime.year || anime.aired?.prop?.from?.year || 0;
  return {
    id: `anime-${anime.mal_id}`,
    title: anime.title,
    type: '애니메이션',
    isNew: Number(year) >= 2023,
    year: String(year || '-'),
    rating: Number(anime.score || 0).toFixed(1),
    poster: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
    backdrop: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
    overview: '독창적인 세계관과 캐릭터 서사가 돋보이는 애니메이션 작품입니다.',
    genres: ['애니메이션', ...(anime.genres || []).map((genre) => genre.name)],
    ott: pickOtt(anime.title),
    runtime: anime.duration || '-',
    country: 'JP',
    releaseDate: anime.aired?.from?.slice(0, 10) || '-',
    cast: ['성우 정보 준비 중'],
  };
}

async function run() {
  const dramaPages = [0, 1, 2, 3, 4, 5, 6];
  const dramaShows = dramaPages.flatMap((page) => fetchViaCurl(`https://api.tvmaze.com/shows?page=${page}`));
  const dramaItems = dramaShows
    .filter((show) => show.image && show.type !== 'Variety')
    .map(normalizeDrama)
    .filter((item) => item.poster);

  const animePages = [1, 2, 3, 4];
  const animeItems = animePages
    .flatMap((page) => {
      const response = fetchViaCurl(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
      return response.data || [];
    })
    .map(normalizeAnime)
    .filter((item) => item.poster);

  const data = [...movieItems, ...netflix2026Items, ...varietyItems, ...animeItems, ...dramaItems]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 420)
    .map((item, index) => ({ ...item, rankSeed: index + 1 }));

  const targetPath = path.join(process.cwd(), 'public', 'db', 'content.json');
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, JSON.stringify({ updatedAt: new Date().toISOString(), total: data.length, items: data }, null, 2));
  console.log(`Saved ${data.length} titles to ${targetPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
