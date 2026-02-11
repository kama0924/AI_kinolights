import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Flame,
  Home,
  Search,
  Star,
  Tv,
  UserRound,
} from 'lucide-react';

const tabs = ['홈', '영화', '드라마', '예능', '신작'];
const ottColor = {
  Netflix: 'bg-red-600',
  Wavve: 'bg-sky-600',
  TVING: 'bg-rose-500',
  'Disney+': 'bg-blue-600',
  Watcha: 'bg-pink-500',
  'Coupang Play': 'bg-indigo-500',
};

function useContentDb() {
  const [state, setState] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let active = true;

    fetch(`${import.meta.env.BASE_URL}db/content.json`)
      .then((res) => {
        if (!res.ok) throw new Error('DB 파일을 불러오지 못했습니다.');
        return res.json();
      })
      .then((data) => {
        if (active) setState({ items: data.items ?? [], loading: false, error: '' });
      })
      .catch((error) => {
        if (active) setState({ items: [], loading: false, error: error.message });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

function RevealSection({ title, icon, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 },
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
  return (
    <Link to={`/title/${item.id}`} className="group relative block rounded-xl bg-kinocard p-2 shadow-card">
      {rank ? (
        <span className="absolute left-3 top-3 z-20 text-4xl font-black leading-none text-kinopoint drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
          {rank}
        </span>
      ) : null}
      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-[2/3] bg-zinc-800">
          {item.poster ? (
            <img src={item.poster} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="skeleton h-full w-full" />
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {item.ott.map((service) => (
            <span key={`${item.id}-${service}`} className={`${ottColor[service] ?? 'bg-zinc-700'} rounded px-1.5 py-0.5 text-[10px] font-medium`}>
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
    </Link>
  );
}

function HomePage() {
  const { items, loading, error } = useContentDb();
  const [tab, setTab] = useState('홈');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((prev) => prev + 1), 3800);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = useMemo(() => items.filter((item) => item.backdrop).slice(0, 6), [items]);
  const currentHero = heroSlides.length ? heroSlides[activeSlide % heroSlides.length] : null;

  const filteredByTab = useMemo(() => {
    if (tab === '홈') return items;
    if (tab === '신작') return items.filter((item) => item.isNew);
    return items.filter((item) => item.type === tab);
  }, [items, tab]);

  const trending = filteredByTab.slice(0, 12);
  const rankings = [...filteredByTab]
    .sort((a, b) => Number(b.rating) - Number(a.rating) || Number(b.year) - Number(a.year))
    .slice(0, 10);

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
              <button aria-label="search" className="rounded-full bg-zinc-700/60 p-2"><Search className="h-4 w-4" /></button>
              <button aria-label="notification" className="rounded-full bg-zinc-700/60 p-2"><Bell className="h-4 w-4" /></button>
              <button aria-label="mypage" className="rounded-full bg-zinc-700/60 p-2"><UserRound className="h-4 w-4" /></button>
            </div>
          </div>
          <nav className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
            {tabs.map((name) => (
              <button
                key={name}
                onClick={() => setTab(name)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  tab === name ? 'border-kinopoint bg-kinopoint/20 text-kinopoint' : 'border-zinc-700 bg-zinc-800/80 text-zinc-300'
                }`}
              >
                {name}
              </button>
            ))}
          </nav>
        </header>

        {loading ? <div className="skeleton h-72 w-full rounded-2xl" /> : null}
        {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

        {!loading && !error && currentHero ? (
          <main>
            <RevealSection title={`${tab} 추천`} icon={<Flame className="h-4 w-4 text-orange-400" />}>
              <Link to={`/title/${currentHero.id}`} className="relative block overflow-hidden rounded-2xl border border-zinc-700/60 bg-kinocard">
                <img src={currentHero.backdrop} alt={currentHero.title} className="h-56 w-full object-cover sm:h-72" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-xs text-zinc-300">{currentHero.type} · {currentHero.genres.slice(0, 2).join(' / ')}</p>
                  <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{currentHero.title}</h1>
                  <p className="mt-1 line-clamp-2 max-w-[85%] text-xs text-zinc-200">{currentHero.overview}</p>
                  <span className="mt-3 inline-flex w-fit items-center rounded-full bg-kinopoint px-4 py-2 text-sm font-semibold">상세 보기</span>
                </div>
              </Link>
            </RevealSection>

            <hr className="border-zinc-700/60" />

            <RevealSection title={`${tab} 인기작`} icon={<Home className="h-4 w-4 text-zinc-200" />}>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {trending.map((item) => <PosterCard key={item.id} item={item} />)}
              </div>
            </RevealSection>

            <hr className="border-zinc-700/60" />

            <RevealSection title={`${tab} 랭킹`} icon={<Star className="h-4 w-4 text-amber-300" />}>
              <div className="grid grid-cols-3 gap-3">
                {rankings.slice(0, 3).map((item, idx) => <PosterCard key={item.id} item={item} rank={idx + 1} />)}
              </div>
              <div className="mt-4 space-y-2">
                {rankings.map((item, idx) => (
                  <Link to={`/title/${item.id}`} key={item.id} className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2">
                    <p className="w-5 text-center text-sm font-bold text-kinopoint">{idx + 1}</p>
                    <img src={item.poster} alt={item.title} className="h-12 w-8 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-zinc-400">평점 {item.rating} · {item.type}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  </Link>
                ))}
              </div>
            </RevealSection>

            <hr className="border-zinc-700/60" />

            <RevealSection title="OTT" icon={<Tv className="h-4 w-4 text-cyan-300" />}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.keys(ottColor).map((ott) => (
                  <button key={ott} className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm">
                    {ott}
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  </button>
                ))}
              </div>
            </RevealSection>
          </main>
        ) : null}
      </div>
    </div>
  );
}

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, loading, error } = useContentDb();

  const item = useMemo(() => items.find((entry) => entry.id === id), [items, id]);
  const similar = useMemo(() => {
    if (!item) return [];
    return items
      .filter((entry) => entry.id !== item.id && (entry.type === item.type || entry.genres.some((g) => item.genres.includes(g))))
      .slice(0, 12);
  }, [items, item]);

  if (loading) return <div className="min-h-screen bg-kinobg p-4"><div className="skeleton h-72 rounded-2xl" /></div>;
  if (error || !item) return <div className="min-h-screen bg-kinobg p-4 text-red-300">상세 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="min-h-screen bg-kinobg text-zinc-100">
      <div className="mx-auto max-w-screen-md pb-12">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-700/60 bg-[#121212]/80 px-4 py-3 backdrop-blur-md">
          <button onClick={() => navigate(-1)} className="rounded-full bg-zinc-700/70 p-2"><ArrowLeft className="h-4 w-4" /></button>
          <p className="text-sm font-semibold">작품 정보</p>
          <button className="rounded-full bg-zinc-700/70 p-2"><Search className="h-4 w-4" /></button>
        </header>

        <section className="relative">
          <img src={item.backdrop || item.poster} alt={item.title} className="h-80 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex gap-4 p-4">
            <img src={item.poster} alt={item.title} className="h-36 w-24 rounded-lg border border-zinc-700 object-cover" />
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{item.title}</h1>
              <p className="mt-1 text-sm text-zinc-300">{item.type} · {item.year} · {item.runtime}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.genres.map((genre) => <span key={genre} className="rounded bg-zinc-700/70 px-2 py-0.5 text-xs">{genre}</span>)}
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-yellow-300"><Star className="h-4 w-4 fill-yellow-300" /> {item.rating}</p>
            </div>
          </div>
        </section>

        <section className="px-4 pt-5">
          <h2 className="mb-2 text-sm font-bold text-zinc-200">작품 소개</h2>
          <p className="text-sm leading-6 text-zinc-300">{item.overview}</p>
        </section>

        <section className="px-4 pt-6">
          <h2 className="mb-3 text-sm font-bold text-zinc-200">감상 가능한 OTT</h2>
          <div className="flex flex-wrap gap-2">
            {item.ott.map((ott) => (
              <span key={ott} className={`${ottColor[ott] ?? 'bg-zinc-700'} rounded-full px-3 py-1 text-xs font-semibold`}>
                {ott}
              </span>
            ))}
          </div>
        </section>

        <section className="px-4 pt-6">
          <h2 className="mb-3 text-sm font-bold text-zinc-200">기본 정보</h2>
          <div className="space-y-2 rounded-xl border border-zinc-700 bg-zinc-900/60 p-3 text-sm text-zinc-300">
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-zinc-400" /> 공개일: {item.releaseDate}</p>
            <p>국가: {item.country}</p>
            <p>출연/채널: {item.cast.join(', ')}</p>
          </div>
        </section>

        <section className="px-4 pt-6">
          <h2 className="mb-3 text-sm font-bold text-zinc-200">비슷한 작품</h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {similar.map((entry) => (
              <Link key={entry.id} to={`/title/${entry.id}`} className="w-28 shrink-0">
                <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800">
                  <img src={entry.poster} alt={entry.title} className="h-full w-full object-cover" />
                </div>
                <p className="mt-1 truncate text-xs text-zinc-200">{entry.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/title/:id" element={<DetailPage />} />
    </Routes>
  );
}
