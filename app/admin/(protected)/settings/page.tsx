export default function Page() {
  const inp = 'w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-brand';
  const lbl = 'font-mono text-[.62rem] uppercase text-mut block mb-1.5';
  return (
    <>
      <h1 className="font-display text-2xl mb-1">Tənzimləmələr</h1>
      <p className="text-mut text-sm mb-6">Agentlik və sayt parametrləri</p>
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 max-w-xl grid gap-4">
        <div><label className={lbl}>Agentlik adı</label><input className={inp} defaultValue="Digiterial" /></div>
        <div><label className={lbl}>Əlaqə email</label><input className={inp} defaultValue="salam@digiterial.com" /></div>
        <div><label className={lbl}>Telefon</label><input className={inp} defaultValue="+994 60 499 63 40" /></div>
        <div><label className={lbl}>Brend rəngi</label><input type="color" className="h-10 w-20 bg-[#161616] border border-white/15 rounded-lg" defaultValue="#F1E500" /></div>
        <button className="bg-brand text-ink font-semibold text-sm rounded-lg px-4 py-2.5 w-fit">Yadda saxla</button>
        <p className="text-mut text-xs">Qeyd: bu form hələ DB-yə bağlanmayıb (settings cədvəli TODO).</p>
      </div>
    </>
  );
}
