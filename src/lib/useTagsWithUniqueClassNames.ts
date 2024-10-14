import { useMemo } from "react";

const classNames = [
  "text-red-500 border-red-500 bg-red-500/20",
  "text-yellow-500 border-yellow-500 bg-yellow-500/20",
  "text-purple-500 border-purple-500 bg-purple-500/20",
  "text-pink-500 border-pink-500 bg-pink-500/20",
  "text-teal-500 border-teal-500 bg-teal-500/20",
  "text-orange-500 border-orange-500 bg-orange-500/20",
  "text-cyan-500 border-cyan-500 bg-cyan-500/20",
  "text-sky-500 border-sky-500 bg-sky-500/20",
  "text-indigo-500 border-indigo-500 bg-indigo-500/20",
  "text-amber-500 border-amber-500 bg-amber-500/20",
  "text-green-500 border-green-500 bg-green-500/20",
  "text-blue-500 border-blue-500 bg-blue-500/20",
  "text-gray-500 border-gray-500 bg-gray-500/20",
  "text-lime-500 border-lime-500 bg-lime-500/20",
  "text-rose-500 border-rose-500 bg-rose-500/20",
  "text-fuchsia-500 border-fuchsia-500 bg-fuchsia-500/20",
  "text-emerald-500 border-emerald-500 bg-emerald-500/20",
  "text-violet-500 border-violet-500 bg-violet-500/20",
  "text-stone-500 border-stone-500 bg-stone-500/20",
  "text-amber-400 border-amber-400 bg-amber-400/20",
  "text-lime-400 border-lime-400 bg-lime-400/20",
  "text-rose-400 border-rose-400 bg-rose-400/20",
  "text-slate-500 border-slate-500 bg-slate-500/20",
  "text-emerald-400 border-emerald-400 bg-emerald-400/20",
];

const useTagsWithUniqueClassNames = (tags: string[]) => {
  return useMemo(() => {
    const availableClassNames = [...classNames];
    return tags.map((tag) => {
      if (availableClassNames.length === 0) {
        throw new Error("Không đủ màu cho tất cả các tags.");
      }
      const randomIndex = Math.floor(
        Math.random() * availableClassNames.length,
      );
      const className = availableClassNames.splice(randomIndex, 1)[0];
      return { tag, className };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tags)]);
};

export default useTagsWithUniqueClassNames;
