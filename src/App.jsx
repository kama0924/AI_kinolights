import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight,
  Clapperboard,
  Flame,
  Home,
  Medal,
  MessageCircle,
  Search,
  Trophy,
  UserCircle2,
} from 'lucide-react';

const tabs = ['홈', '랭킹', '커뮤니티', '신작', '리뷰', 'MY', '컬렉션'];

const bannerItems = [
  {
    title: '살인자ㅇ난감',
    subtitle: '화제의 스릴러 시리즈 · 넷플릭스',
    cta: '지금 바로 보기',
    image:
      'https://images.unsplash.com/photo-1489599904472-af4f4f2f9d31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: '듄: 파트 투',
    subtitle: '압도적 스케일 SF · 웨이브',
    cta: '예고편 보기',
    image:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: '더 글로리',
    subtitle: '몰입감 높은 복수극 · 넷플릭스',
    cta: '계속 감상하기',
    image:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
  },
];

const cardItems = [
  {
    title: '파묘',
    rating: '4.2',
    poster:
      'https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=800&q=80',
    ott: ['Netflix', 'Tving'],
  },
  {
    title: '소년시대',
    rating: '4.5',
    poster:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    ott: ['Coupang', 'Disney+'],
  },
  {
    title: '웡카',
    rating: '3.8',
    poster: '',
    ott: ['Disney+'],
  },
  {
    title: '서울의 봄',
    rating: '4.6',
    poster:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    ott: ['Netflix'],
  },
  {
    title: '마스크걸',
    rating: '4.1',
    poster: '',
    ott: ['Netflix', 'Watcha'],
  },
  {
    title: '나의 해방일지',
    rating: '4.7',
    poster:
      'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=800&q=80',
    ott: ['Tving', 'Watcha'],
  },
];

const rankingItems = [
  { rank: 1, title: '기생수: 더 그레이', rating: '4.4', ott: ['Netflix'], poster: cardItems[0].poster },
  { rank: 2, title: '눈물의 여왕', rating: '4.3', ott: ['Tving'], poster: cardItems[3].poster },
  { rank: 3, title: '삼체', rating: '4.0', ott: ['Netflix', 'Disney+'], poster: cardItems[1].poster },
];

const ottColors = {
  Netflix: 'bg-red-600',
  'Disney+': 'bg-blue-600',
  Tving: 'bg-rose-500',
  Watcha: 'bg-pink-500',
  Coupang: 'bg-indigo-500',
};

function Section({ title, icon, children }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="fade-up py-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {icon}
          {title}
        </h2>
        <button className="flex items-center text-xs text-zinc-400 hover:text-zinc-100">
          더보기 <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </header>
      {children}
    </section>
  );
}

function Poster({ item, rank }) {
  const [failed, setFailed] = useState(!item.poster);

  return (
    <article className="relative rounded-xl bg-kinocard p-2 shadow-card">
      {typeof rank === 'number' && (
        <span className="absolute left-3 top-3 z-20 text-4xl font-black leading-none text-kinopoint drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)]">
          {rank}
        </span>
      )}

      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-[2/3] w-full rounded-lg bg-zinc-800">
          {failed ? (
            <div className="skeleton h-full w-full rounded-lg" aria-label="poster skeleton" />
          ) : (
            <img
              src={item.poster}
              alt={item.title}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {item.ott.map((service) => (
            <span
              key={service}
              className={`${ottColors[service] ?? 'bg-zinc-600'} rounded px-1.5 py-0.5 text-[10px] font-medium`}
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="pb-1 pt-2">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-zinc-400">⭐ {item.rating}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerItems.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const currentBanner = useMemo(() => bannerItems[activeSlide], [activeSlide]);

  return (
    <div className="min-h-screen bg-kinobg text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <header className="sticky top-0 z-40 mb-4 border-b border-zinc-700/60 bg-[#121212]/75 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2 text-lg font-bold">
              <Clapperboard className="h-5 w-5 text-kinopoint" />
              KinoSearch
            </div>
            <div className="flex items-center gap-3 text-zinc-200">
              <button aria-label="search" className="rounded-full bg-zinc-700/60 p-2 hover:bg-zinc-600/70">
                <Search className="h-4 w-4" />
              </button>
              <button aria-label="mypage" className="rounded-full bg-zinc-700/60 p-2 hover:bg-zinc-600/70">
                <UserCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
                  index === 0
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
          <Section title="오늘의 메인 배너" icon={<Flame className="h-5 w-5 text-orange-400" />}>
            <article className="relative overflow-hidden rounded-2xl bg-kinocard shadow-card">
              <img src={currentBanner.image} alt={currentBanner.title} className="h-52 w-full object-cover md:h-64" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="text-xs text-zinc-300">{currentBanner.subtitle}</p>
                <h1 className="my-1 text-2xl font-bold">{currentBanner.title}</h1>
                <button className="mt-2 inline-flex w-fit items-center rounded-full bg-kinopoint px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500">
                  {currentBanner.cta}
                </button>
              </div>
            </article>
          </Section>

          <hr className="border-zinc-700/60" />

          <Section title="지금 뜨는 콘텐츠" icon={<Home className="h-5 w-5 text-zinc-300" />}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {cardItems.map((item) => (
                <Poster key={item.title} item={item} />
              ))}
            </div>
          </Section>

          <hr className="border-zinc-700/60" />

          <Section title="실시간 랭킹 TOP 3" icon={<Trophy className="h-5 w-5 text-yellow-400" />}>
            <div className="grid grid-cols-3 gap-3">
              {rankingItems.map((item) => (
                <Poster key={item.rank} item={item} rank={item.rank} />
              ))}
            </div>
          </Section>

          <hr className="border-zinc-700/60" />

          <Section title="커뮤니티 인기 글" icon={<MessageCircle className="h-5 w-5 text-cyan-400" />}>
            <div className="space-y-2 rounded-xl bg-kinocard p-3">
              {['요즘 볼만한 한국 스릴러 추천해줘!', '넷플릭스와 디즈니 중 이번 달 구독은?', '주말 정주행 드라마 리스트 공유'].map((post, idx) => (
                <div key={post} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                  <p className="text-sm text-zinc-200">{post}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                    <Medal className="h-3.5 w-3.5 text-kinopoint" /> {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
