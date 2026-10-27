import Integration from '@/components/admin/integration';

export default function Page() {
  return (
    <Integration title="Sosial media" sub="Hesablar, kontent təqvimi və icma idarəçiliyi" icon="share" provider="Meta (Instagram, Facebook) və TikTok API"
      steps={['Meta for Developers-də tətbiq yaradın və Instagram Business hesabını qoşun.', 'TikTok for Business hesabından API girişi alın.', 'Açarları Hostinger-də mühit dəyişəni kimi əlavə edin.', 'Müştəri hesablarını Müştərilər bölməsindəki qeydlərlə əlaqələndirin.']}
      features={[
        { icon: 'calendar', h: 'Kontent təqvimi', p: 'Postların planlaşdırılması və statusu bir yerdə.' },
        { icon: 'chart', h: 'Əhatə və cəlbetmə', p: 'Hər hesab üzrə aylıq böyümə və ən yaxşı postlar.' },
        { icon: 'mail', h: 'Mesajlar və şərhlər', p: 'İcma idarəçiliyi üçün vahid gələnlər qutusu.' },
      ]} />
  );
}
