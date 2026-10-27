import { I, PageHead, Card } from './ui';

// İnteqrasiya tələb edən modullar üçün izahlı boş vəziyyət
export default function Integration({ title, sub, icon, provider, steps, features }: { title: string; sub: string; icon: string; provider: string; steps: string[]; features: { icon: string; h: string; p: string }[] }) {
  return (
    <>
      <PageHead title={title} sub={sub} />
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-3">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-brand/12 text-brand grid place-items-center shrink-0 bg-brand/10"><I n={icon} className="w-6 h-6" /></span>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset bg-white/[.06] text-mut-d ring-white/10"><span className="w-1.5 h-1.5 rounded-full bg-brand" />Qoşulmayıb</div>
              <h2 className="font-display font-bold text-xl mt-3">{provider} inteqrasiyası lazımdır</h2>
              <p className="text-mut-d text-sm mt-2 max-w-[56ch]">Bu modul real məlumatı xarici xidmətdən götürür. Qoşulduqdan sonra göstəricilər və siyahılar burada avtomatik görünəcək.</p>
            </div>
          </div>
          <ol className="mt-6 flex flex-col gap-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-[13.5px]"><span className="w-6 h-6 rounded-full bg-panel3 grid place-items-center text-[12px] font-semibold adm-num shrink-0">{i + 1}</span><span className="text-mut-d pt-0.5">{s}</span></li>
            ))}
          </ol>
        </Card>
        <div className="grid gap-3">
          {features.map((f) => (
            <Card key={f.h} className="p-5 flex gap-4">
              <span className="w-9 h-9 rounded-xl bg-panel2 border border-line grid place-items-center text-mut-d shrink-0"><I n={f.icon} className="w-4 h-4" /></span>
              <div><h3 className="font-semibold text-[14px]">{f.h}</h3><p className="text-mut text-[13px] mt-1">{f.p}</p></div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
