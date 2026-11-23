
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "en" | "vi";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  apply_url: string;
};

const translations = {
  en: {
    tagline: "Connecting Talent to Global Opportunities",
    findJobs: "Find Jobs",
    about: "About Us",
    language: "Language",
    heroBadge: "Global Remote Career Platform",
    headline: "Discover Your Next Career Opportunity",
    subtitle:
      "Explore remote jobs, AI training, data annotation, and freelance opportunities from around the world.",
    searchPlaceholder: "Search jobs, skills, companies...",
    searchButton: "Search Jobs",
    allCategories: "All Categories",
    allLocations: "All Locations",
    latestJobs: "Explore Latest Opportunities",
    jobsFound: "opportunities found",
    remote: "Remote",
    worldwide: "Worldwide",
    unitedStates: "United States",
    europe: "Europe",
    viewJob: "View Job",
    demoNotice: "Demo listing — applications unavailable",
    noJobs: "No matching jobs found.",
    resetFilters: "Clear Filters",
    whyTalentAxis: "Why TalentAxis?",
    aboutDescription:
      "TalentAxis helps job seekers discover global remote and AI career opportunities in one place.",
    feature1: "Global Opportunities",
    feature1Desc:
      "Explore career opportunities from multiple international sources.",
    feature2: "Smart Job Discovery",
    feature2Desc:
      "Find relevant jobs using categories, locations, and search filters.",
    feature3: "Direct Applications",
    feature3Desc:
      "Apply through the original recruitment platform when listings are available.",
    footerDescription:
      "Connecting professionals with global career opportunities.",
    quickLinks: "Quick Links",
    disclaimer:
      "TalentAxis is an independent job discovery platform. Demo listings are for illustration only.",
    rights: "All rights reserved.",
  },
  vi: {
    tagline: "Kết nối nhân tài với cơ hội nghề nghiệp toàn cầu",
    findJobs: "Tìm việc làm",
    about: "Giới thiệu",
    language: "Ngôn ngữ",
    heroBadge: "Nền tảng việc làm quốc tế",
    headline: "Khám phá cơ hội nghề nghiệp tiếp theo",
    subtitle:
      "Tìm kiếm công việc từ xa, AI Training, Data Annotation và Freelance từ các nền tảng tuyển dụng trên thế giới.",
    searchPlaceholder: "Tìm công việc, kỹ năng, công ty...",
    searchButton: "Tìm việc",
    allCategories: "Tất cả lĩnh vực",
    allLocations: "Tất cả khu vực",
    latestJobs: "Khám phá cơ hội việc làm",
    jobsFound: "công việc được tìm thấy",
    remote: "Làm việc từ xa",
    worldwide: "Toàn cầu",
    unitedStates: "Hoa Kỳ",
    europe: "Châu Âu",
    viewJob: "Xem công việc",
    demoNotice: "Công việc minh họa — chưa thể ứng tuyển",
    noJobs: "Không tìm thấy công việc phù hợp.",
    resetFilters: "Xóa bộ lọc",
    whyTalentAxis: "Tại sao chọn TalentAxis?",
    aboutDescription:
      "TalentAxis giúp người tìm việc khám phá các cơ hội nghề nghiệp quốc tế, công việc từ xa và lĩnh vực AI trên cùng một nền tảng.",
    feature1: "Cơ hội toàn cầu",
    feature1Desc:
      "Khám phá việc làm từ nhiều nguồn tuyển dụng quốc tế.",
    feature2: "Tìm kiếm thông minh",
    feature2Desc:
      "Tìm công việc phù hợp theo lĩnh vực, khu vực và từ khóa.",
    feature3: "Ứng tuyển trực tiếp",
    feature3Desc:
      "Ứng tuyển thông qua nền tảng tuyển dụng gốc khi công việc đã được xác minh.",
    footerDescription:
      "Kết nối nhân tài với cơ hội nghề nghiệp toàn cầu.",
    quickLinks: "Liên kết nhanh",
    disclaimer:
      "TalentAxis là nền tảng khám phá việc làm độc lập. Các công việc mẫu chỉ mang tính minh họa.",
    rights: "Bảo lưu mọi quyền.",
  },
};

export default function Home() {
const [jobs, setJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  let cancelled = false;

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, title, company, location, category, job_type, salary, apply_url"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (cancelled) return;

    if (error) {
      console.error("Supabase error:", error.message);
      setError("Unable to load jobs. Please try again later.");
    } else {
      const formattedJobs: Job[] = (data ?? []).map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location ?? "Worldwide",
        category: job.category ?? "Other",
        type: job.job_type ?? "Remote",
        salary: job.salary ?? "Not disclosed",
        apply_url: job.apply_url,
      }));

      setJobs(formattedJobs);
      setError("");
    }

    setLoading(false);
  }

  fetchJobs();

  return () => {
    cancelled = true;
  };
}, []);
  const [language, setLanguage] = useState<Language>("en");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const categories = useMemo(
    () => [...new Set(jobs.map((job) => job.category))]
      .filter(Boolean)
      .sort(),
    [jobs]
  );

  const locations = useMemo(
    () => [...new Set(jobs.map((job) => job.location))]
      .filter(Boolean)
      .sort(),
    [jobs]
  );

  const t = translations[language];

  const translateLocation = (value: string) => {
    if (value === "Worldwide") return t.worldwide;
    if (value === "United States") return t.unitedStates;
    if (value === "Europe") return t.europe;
    return value;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        `${job.title} ${job.company} ${job.category} ${job.location}`
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        category === "all" || job.category === category;

      const matchesLocation =
        location === "all" || job.location === location;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation
      );
    });
  }, [jobs, search, category, location]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">

          <a href="#" className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-blue-700">
              TalentAxis
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              {t.tagline}
            </span>
          </a>

          <div className="flex items-center gap-5">

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#jobs" className="hover:text-blue-700">
                {t.findJobs}
              </a>
              <a href="#about" className="hover:text-blue-700">
                {t.about}
              </a>
            </nav>

            <div
              className="flex overflow-hidden rounded-lg border border-slate-200"
              aria-label={t.language}
            >
              {(["en", "vi"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  aria-pressed={language === lang}
                  className={`px-3 py-2 text-sm font-semibold transition ${
                    language === lang
                      ? "bg-blue-700 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-slate-900 px-5 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">

          <span className="mb-6 inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
            {t.heroBadge}
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {t.headline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            {t.subtitle}
          </p>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-xl bg-white p-3 shadow-xl sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="min-w-0 flex-1 rounded-lg px-4 py-3 text-slate-900 outline-none"
            />

            <a
              href="#jobs"
              className="rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              {t.searchButton}
            </a>
          </div>

        </div>
      </section>

      {/* JOB LISTINGS */}
      <section
        id="jobs"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t.latestJobs}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {loading
                ? (language === "vi" ? "Đang tải công việc..." : "Loading jobs...")
                : `${filteredJobs.length} ${t.jobsFound}`}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            {t.resetFilters}
          </button>
        </div>

        {/* FILTERS */}
        <div className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
	
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t.allCategories}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <option value="all">{t.allCategories}</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label={t.allLocations}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <option value="all">{t.allLocations}</option>

            {locations.map((item) => (
              <option key={item} value={item}>
                {translateLocation(item)}
              </option>
            ))}
          </select>

        </div>

        {/* JOB CARDS */}
        <div className="grid gap-5">
          {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {language === "vi"
              ? "Không thể tải công việc. Vui lòng thử lại sau."
              : error}
          </div>
        )}

        {loading && (
          <div role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {language === "vi" ? "Đang tải công việc..." : "Loading jobs..."}
          </div>
        )}

        {!loading && !error && filteredJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {job.company}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {translateLocation(job.location)}
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {t.remote}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {job.category}
                    </span>
                  </div>


                </div>

                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  {t.viewJob}
                </a>

              </div>
            </article>
          ))}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500">{t.noJobs}</p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 font-semibold text-blue-700 hover:underline"
              >
                {t.resetFilters}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-24 bg-white px-5 py-16"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">
              {t.whyTalentAxis}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              {t.aboutDescription}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🌍",
                title: t.feature1,
                description: t.feature1Desc,
              },
              {
                icon: "🔎",
                title: t.feature2,
                description: t.feature2Desc,
              },
              {
                icon: "🔗",
                title: t.feature3,
                description: t.feature3Desc,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 p-7 text-center"
              >
                <div className="mb-4 text-3xl">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 px-5 py-10 text-slate-300">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-white">
                TalentAxis
              </h2>

              <p className="mt-3 max-w-md text-sm text-slate-400">
                {t.footerDescription}
              </p>
            </div>

            <div className="md:text-right">
              <h3 className="font-semibold text-white">
                {t.quickLinks}
              </h3>

              <div className="mt-3 flex gap-5 text-sm md:justify-end">
                <a href="#jobs" className="hover:text-white">
                  {t.findJobs}
                </a>
                <a href="#about" className="hover:text-white">
                  {t.about}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6">
            <p className="text-xs leading-5 text-slate-400">
              {t.disclaimer}
            </p>


<p className="mt-3 text-xs text-slate-500">
  © 2026 TalentAxis. {t.rights}
</p>
          </div>

        </div>
      </footer>

    </main>
  );
}
