import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  ChevronRight,
  Clapperboard,
  Flame,
  Home,
  Search,
  Star,
  Trophy,
  Tv,
  UserRound,
} from 'lucide-react';

const tabs = ['홈', '영화', '드라마', '예능', '랭킹', '신작', '커뮤니티'];

const heroSlides = [
  {
    title: '파묘',
    subtitle: '미스터리 · 공포 | 현재 인기 1위',
    cta: '지금 바로 보기',
    image: 'https://image.tmdb.org/t/p/w1280/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg',
  },
  {
    title: '듄: 파트 2',
    subtitle: 'SF · 액션 | 극찬받는 블록버스터',
    cta: '상세 정보',
    image: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
  },
  {
    title: '서울의 봄',
    subtitle: '드라마 · 역사 | 실시간 화제작',
    cta: '감상 가능한 OTT',
    image: 'https://image.tmdb.org/t/p/w1280/yWf4Eq3cVd8qV61pK0wSqxX4kUP.jpg',
  },
];

const trending = [
  {
    title: '파묘',
    year: '2024',
    rating: '4.2',
    poster: 'https://image.tmdb.org/t/p/w500/pQYHouPsDw32FhDLr7E3jmw0WTk.jpg',
    ott: ['Netflix', 'Wavve'],
  },
  {
    title: '듄: 파트 2',
    year: '2024',
    rating: '4.4',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    ott: ['TVING'],
  },
  {
    title: '서울의 봄',
    year: '2023',
    rating: '4.6',
    poster: 'https://image.tmdb.org/t/p/w500/rm2e6Tr9yXE4SP11gPfS1VwqWbI.jpg',
    ott: ['Netflix'],
  },
  {
    title: '범죄도시4',
    year: '2024',
    rating: '3.9',
    poster: 'https://image.tmdb.org/t/p/w500/yk38sM1x8cbqa5pJ8VJG3mYLLwr.jpg',
    ott: ['Disney+'],
  },
  {
    title: '오펜하이머',
    year: '2023',
    rating: '4.3',
    poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    ott: ['Coupang'],
  },
  {
    title: '스즈메의 문단속',
    year: '2022',
    rating: '4.1',
    poster: 'https://image.tmdb.org/t/p/w500/vIeu8WysZrTSFb2uhPViKjX9EcC.jpg',
    ott: ['Watcha', 'TVING'],
  },
];

const rankings = [
  trending[0],
  trending[2],
  trending[1],
  trending[4],
  trending[3],
];

const ottColor = {
  Netflix: 'bg-red-600',
  Wavve: 'bg-sky-600',
  TVING: 'bg-rose-500',
  'Disney+': 'bg-blue-600',
  Coupang: 'bg-indigo-500',
  Watcha: 'bg-pink-500',
};

function RevealSection({ title, icon, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="fade-up py-5">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          {icon}
          {title}
        </h2>
        <button className="flex items-center text-xs text-zinc-400 hover:text-white">
          전체보기 <ChevronRight className="h-4 w-4" />
        </button>
      </header>
      {children}
    </section>
  );
}

function PosterCard({ item, rank }) {
  const [fallback, setFallback] = useState(false);

  return (
    <article className="group relative rounded-xl bg-kinocard p-2 shadow-card">
      {rank && (
        <span className="absolute left-3 top-3 z-20 text-4xl font-black leading-none text-kinopoint drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
          {rank}
        </span>
      )}
      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-[2/3] bg-zinc-800">
          {fallback ? (
            <div className="skeleton h-full w-full" />
          ) : (
            <img
              src={item.poster}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={() => setFallback(true)}
            />
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {item.ott.map((service) => (
            <span
              key={`${item.title}-${service}`}
              className={`${ottColor[service] ?? 'bg-zinc-700'} rounded px-1.5 py-0.5 text-[10px] font-medium`}
            >
              {service}
            </span>
          ))}
        </div>
      </div>
      <div className="pt-2">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-zinc-400">
          {item.year} · ⭐ {item.rating}
        </p>
      </div>
    </article>
  );
}

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const hero = useMemo(() => heroSlides[activeSlide], [activeSlide]);

  return (
    <div className="min-h-screen bg-kinobg text-zinc-100">
      <div className="mx-auto max-w-screen-md px-4 pb-12">
        <header className="sticky top-0 z-40 mb-4 border-b border-zinc-700/70 bg-[#121212]/70 pt-3 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Clapperboard className="h-5 w-5 text-kinopoint" />
              kinolights
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="search" className="rounded-full bg-zinc-700/60 p-2">
                <Search className="h-4 w-4" />
              </button>
              <button aria-label="notification" className="rounded-full bg-zinc-700/60 p-2">
                <Bell className="h-4 w-4" />
              </button>
              <button aria-label="mypage" className="rounded-full bg-zinc-700/60 p-2">
                <UserRound className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  idx === 0
                    ? 'border-kinopoint bg-kinopoint/20 text-kinopoint'
                    : 'border-zinc-700 bg-zinc-800/80 text-zinc-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <main>
          <RevealSection title="오늘의 추천" icon={<Flame className="h-4 w-4 text-orange-400" />}>
            <article className="relative overflow-hidden rounded-2xl border border-zinc-700/60 bg-kinocard">
              <img src={hero.image} alt={hero.title} className="h-56 w-full object-cover sm:h-72" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-xs text-zinc-300">{hero.subtitle}</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{hero.title}</h1>
                <button className="mt-3 inline-flex w-fit items-center rounded-full bg-kinopoint px-4 py-2 text-sm font-semibold">
                  {hero.cta}
                </button>
              </div>
            </article>
          </RevealSection>

          <hr className="border-zinc-700/60" />

          <RevealSection title="지금 많이 보는 작품" icon={<Home className="h-4 w-4 text-zinc-200" />}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {trending.map((item) => (
                <PosterCard key={item.title} item={item} />
              ))}
            </div>
          </RevealSection>

          <hr className="border-zinc-700/60" />

          <RevealSection title="오늘의 통합 랭킹" icon={<Trophy className="h-4 w-4 text-amber-300" />}>
            <div className="grid grid-cols-3 gap-3">
              {rankings.slice(0, 3).map((item, index) => (
                <PosterCard key={`${item.title}-rank`} item={item} rank={index + 1} />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {rankings.map((item, index) => (
                <div key={`${item.title}-line`} className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                  <p className="w-5 text-center text-sm font-bold text-kinopoint">{index + 1}</p>
                  <img src={item.poster} alt={item.title} className="h-12 w-8 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-zinc-400">평점 {item.rating}</p>
                  </div>
                  <Star className="h-4 w-4 text-yellow-300" />
                </div>
              ))}
            </div>
          </RevealSection>

          <hr className="border-zinc-700/60" />

          <RevealSection title="OTT 빠른 이동" icon={<Tv className="h-4 w-4 text-cyan-300" />}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['Netflix', 'Disney+', 'TVING', 'Wavve'].map((ott) => (
                <button
                  key={ott}
                  className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm"
                >
                  {ott}
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </button>
              ))}
            </div>
          </RevealSection>
        </main>
      </div>
    </div>
  );
}
