import Integration from '@/components/admin/integration';

export default function Page() {
  return (
    <Integration title="Email" sub="Kampaniyalar, avtomatik zəncirlər və göndərmə statistikası" icon="mail" provider="Email provayderi (Brevo, Mailchimp və ya Resend)"
      steps={['Provayderdə hesab açın və API açarı yaradın.', 'Göndərən domen üçün SPF, DKIM və DMARC qeydlərini qurun.', 'API açarını Hostinger-də mühit dəyişəni kimi əlavə edin.', 'Saytdakı əlaqə formasından gələn lead-ləri abunəçi siyahısına bağlayın.']}
      features={[
        { icon: 'bolt', h: 'Avtomatik zəncirlər', p: 'Xoş gəldin, tərk edilmiş səbət və geri qaytarma məktubları.' },
        { icon: 'chart', h: 'Açılma və klik faizi', p: 'Hər kampaniyanın nəticəsi və satışa təsiri.' },
        { icon: 'users', h: 'Seqmentlər', p: 'CRM-dəki lead-lər mərhələ və xidmətə görə qruplaşdırılır.' },
      ]} />
  );
}
