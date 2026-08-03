export default function Page() {
  return (
    <>
      <h1 className="font-display text-2xl mb-1">Sosial media</h1>
      <p className="text-mut text-sm mb-6">Hesablar, planlaşdırma və icma idarəçiliyi</p>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5"><div className="font-mono text-[.7rem] uppercase text-mut">{"Hazırlanır"}</div><div className="font-display font-bold text-2xl mt-2">—</div></div><div className="bg-[#121212] border border-white/10 rounded-2xl p-5"><div className="font-mono text-[.7rem] uppercase text-mut">{"Hazırlanır"}</div><div className="font-display font-bold text-2xl mt-2">—</div></div><div className="bg-[#121212] border border-white/10 rounded-2xl p-5"><div className="font-mono text-[.7rem] uppercase text-mut">{"Hazırlanır"}</div><div className="font-display font-bold text-2xl mt-2">—</div></div>
      </div>
      <div className="mt-6 bg-[#121212] border border-white/10 rounded-2xl p-6 text-mut text-sm">
        Bu modul üçün inteqrasiya tələb olunur (Meta / Instagram / TikTok API). Quraşdırıldıqdan sonra real data burada görünəcək.
      </div>
    </>
  );
}
