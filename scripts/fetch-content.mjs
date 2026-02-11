import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const OTTS = ['Netflix', 'Disney+', 'TVING', 'Wavve', 'Watcha', 'Coupang Play'];

const curatedMovies = [
  { id: 872585, title: '오펜하이머', year: 2023, rating: '4.3', poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', overview: '세상을 바꾼 천재 물리학자의 고뇌와 선택을 다룬 전기 드라마.', genres: ['드라마', '역사'] },
  { id: 693134, title: '듄: 파트 2', year: 2024, rating: '4.4', poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', overview: '폴 아트레이드의 운명이 본격적으로 움직이기 시작한다.', genres: ['SF', '액션'] },
  { id: 940721, title: '고질라 X 콩: 뉴 엠파이어', year: 2024, rating: '3.7', poster: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2C3CdVzINUm5Cm1lrbT2uiRstwX.jpg', overview: '거대 괴수들의 새로운 전쟁이 시작된다.', genres: ['액션', '모험'] },
  { id: 438631, title: '듄', year: 2021, rating: '4.0', poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg', overview: '사막 행성 아라키스에서 펼쳐지는 거대한 서사.', genres: ['SF', '모험'] },
  { id: 359724, title: '포드 V 페라리', year: 2019, rating: '4.1', poster: 'https://image.tmdb.org/t/p/w500/6ApDtO7xaWAfPqfi2IARXIzj8QS.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2GxJ04v4BpHm6Ck1hJ2YvHf6vVG.jpg', overview: '르망 24시를 둘러싼 자동차 레이싱 드라마.', genres: ['드라마', '액션'] },
  { id: 299536, title: '어벤져스: 인피니티 워', year: 2018, rating: '4.2', poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg', overview: '모든 히어로가 타노스에 맞서 싸운다.', genres: ['액션', 'SF'] },
  { id: 497698, title: '블랙 팬서: 와칸다 포에버', year: 2022, rating: '3.8', poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg', overview: '왕을 잃은 와칸다의 새로운 여정.', genres: ['액션', 'SF'] },
  { id: 466272, title: '원스 어폰 어 타임 인 할리우드', year: 2019, rating: '4.0', poster: 'https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/pVGzV02qmHVo2Pr4f1Rr8lq5Lz0.jpg', overview: '1960년대 할리우드의 황혼기를 그린 작품.', genres: ['코미디', '드라마'] },
  { id: 872906, title: 'JUNG_E', year: 2023, rating: '3.2', poster: 'https://image.tmdb.org/t/p/w500/z2nfzvM4kJ2nZRf8g4PON53XfFQ.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/8rpDcsfLJypbO6vREc0547VKqEv.jpg', overview: '기후 재앙 이후의 미래를 배경으로 한 SF.', genres: ['SF', '드라마'] },
  { id: 496243, title: '기생충', year: 2019, rating: '4.6', poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg', overview: '두 가족의 만남으로 벌어지는 예측불가 이야기.', genres: ['스릴러', '드라마'] },
  { id: 575264, title: '미션 임파서블: 데드 레코닝 PART ONE', year: 2023, rating: '4.0', poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/628Dep6AxEtDxjZoGP78TsOxYbK.jpg', overview: '에단 헌트의 새로운 글로벌 미션.', genres: ['액션', '스릴러'] },
  { id: 603692, title: '존 윅 4', year: 2023, rating: '4.1', poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/h8gHn0OzBoaefsYseUByqsmEDMY.jpg', overview: '끝나지 않은 전설의 복수가 이어진다.', genres: ['액션', '범죄'] },
  { id: 447365, title: '가디언즈 오브 갤럭시 VOL. 3', year: 2023, rating: '4.2', poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg', overview: '가디언즈가 팀의 마지막 모험에 나선다.', genres: ['SF', '코미디'] },
  { id: 502356, title: '더 슈퍼 마리오 브라더스 무비', year: 2023, rating: '3.9', poster: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg', overview: '게임 속 세계관을 영화로 옮긴 애니메이션.', genres: ['애니메이션', '모험'] },
  { id: 346698, title: '바비', year: 2023, rating: '3.8', poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/nHf61UzkfFno5X1ofIhugCPus2R.jpg', overview: '바비랜드에서 현실 세계로 떠난 바비의 이야기.', genres: ['코미디', '판타지'] },
  { id: 298618, title: '플래시', year: 2023, rating: '3.7', poster: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/yF1eOkaYvwiORauRCPWznV9xVvi.jpg', overview: '시간여행으로 멀티버스를 건드린 히어로의 모험.', genres: ['액션', 'SF'] },
  { id: 315162, title: '장화신은 고양이: 끝내주는 모험', year: 2022, rating: '4.1', poster: 'https://image.tmdb.org/t/p/w500/kuf6dutpsT0vSVehic3EZIqkOBt.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/b1Y8SUb12gPHCSSSNlbX4nB3IKy.jpg', overview: '전설의 고양이가 마지막 생명을 지키기 위해 모험을 떠난다.', genres: ['애니메이션', '모험'] },
  { id: 792307, title: '가여운 것들', year: 2023, rating: '4.0', poster: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/4woSOUD0equAYzvwhWBHIJDCM88.jpg', overview: '독특한 상상력으로 완성한 환상적인 성장 서사.', genres: ['판타지', '코미디'] },
  { id: 8725851, title: '서울의 봄', year: 2023, rating: '4.6', poster: 'https://image.tmdb.org/t/p/w500/rm2e6Tr9yXE4SP11gPfS1VwqWbI.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/yWf4Eq3cVd8qV61pK0wSqxX4kUP.jpg', overview: '1979년 서울, 운명의 그날을 다룬 작품.', genres: ['드라마', '역사'] },
  { id: 1111111, title: '파묘', year: 2024, rating: '4.2', poster: 'https://image.tmdb.org/t/p/w500/pQYHouPsDw32FhDLr7E3jmw0WTk.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg', overview: '기이한 사건을 조사하는 사람들에게 벌어지는 일.', genres: ['공포', '미스터리'] },
];


const curatedVariety = [
  { id: 'var-1', title: 'Running Man', year: 2010, rating: '4.3', poster: 'https://image.tmdb.org/t/p/w500/2dCj6xZ4m4T6E6M0h6N5hM4R0xG.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/kR9hVfR5YtWfYQfVIAtF5NCz7Ys.jpg', overview: '대한민국 대표 장수 버라이어티 예능.' },
  { id: 'var-2', title: 'I Live Alone', year: 2013, rating: '4.1', poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1Lx6kM3tQ1Y.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2w4xG178s4NtW2N7DbSt1MSQe6w.jpg', overview: '싱글 라이프의 일상을 관찰하는 예능.' },
  { id: 'var-3', title: 'Street Woman Fighter', year: 2021, rating: '4.0', poster: 'https://image.tmdb.org/t/p/w500/7B4Nf9Y8M4J8O5f2N8F7xKpM5aL.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/d9S1h9WnQm6x4pM8x4s3qR4xZ8F.jpg', overview: '크루 간 배틀을 다루는 댄스 서바이벌.' },
  { id: 'var-4', title: 'The Genius Paik', year: 2023, rating: '3.9', poster: 'https://image.tmdb.org/t/p/w500/t4f8N6Sxw8g5k2fY1b9R7x2mL3Q.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/n5Qx8G2s4f9R7m6T3x1vB8c2dW0.jpg', overview: '백종원의 해외 외식 도전기를 그린 예능.' },
  { id: 'var-5', title: 'Physical: 100', year: 2023, rating: '4.2', poster: 'https://image.tmdb.org/t/p/w500/1S6a6x0l4S4Qf7w2Q5f7L7o3h2i.jpg', backdrop: 'https://image.tmdb.org/t/p/w1280/2i8b0w0f7Q3x0c4S8l4u6R8v1M2.jpg', overview: '최강 피지컬을 가리는 서바이벌 예능.' }
];

const stripHtml = (input = '') => input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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
  genres: movie.genres,
  ott: pickOtt(movie.title),
  runtime: '120분',
  country: 'KR',
  releaseDate: `${movie.year}-01-01`,
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
  overview: show.overview,
  genres: ['Reality'],
  ott: pickOtt(show.title),
  runtime: '90분',
  country: 'KR',
  releaseDate: `${show.year}-01-01`,
  cast: ['상세 출연진 정보 준비 중'],
}));

function normalizeShow(show) {
  const genres = show.genres || [];
  const hasVarietyGenre = genres.some((genre) => ['Reality', 'Game Show', 'Talk Show'].includes(genre));
  return {
    id: `show-${show.id}`,
    title: show.name,
    type: hasVarietyGenre ? '예능' : '드라마',
    isNew: Number(show.premiered?.slice(0, 4) || 0) >= 2023,
    year: show.premiered?.slice(0, 4) || '-',
    rating: Number(show.rating?.average || 0).toFixed(1),
    poster: show.image?.original || show.image?.medium || '',
    backdrop: show.image?.original || show.image?.medium || '',
    overview: stripHtml(show.summary) || '줄거리 정보가 준비 중입니다.',
    genres: genres.length > 0 ? genres : ['TV'],
    ott: pickOtt(show.name),
    runtime: show.runtime ? `${show.runtime}분` : '-',
    country: show.network?.country?.code || show.webChannel?.country?.code || '-',
    releaseDate: show.premiered || '-',
    cast: [show.network?.name, show.webChannel?.name, show.language].filter(Boolean),
  };
}

async function run() {
  const pages = [0, 1, 2, 3, 4, 5];
  const shows = pages.flatMap((page) => fetchViaCurl(`https://api.tvmaze.com/shows?page=${page}`));
  const showItems = shows.map(normalizeShow).filter((item) => item.poster);

  const data = [...movieItems, ...varietyItems, ...showItems]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 320)
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
