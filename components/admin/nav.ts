// Admin naviqasiyası: sol menyu, əmr paneli (⌘K) və səhifə yolu bu siyahıdan qurulur
export type NavItem = { href: string; label: string; icon: string; badge?: 'leads' | 'tickets' | 'tasks' };
export const NAV: { title: string; items: NavItem[] }[] = [
  { title: '', items: [{ href: '/admin', label: 'İcmal', icon: 'home' }] },
  { title: 'Satış', items: [
    { href: '/admin/crm', label: 'Pipeline', icon: 'pipeline', badge: 'leads' },
    { href: '/admin/clients', label: 'Müştərilər', icon: 'users' },
    { href: '/admin/invoices', label: 'Fakturalar', icon: 'invoice' },
  ] },
  { title: 'Çatdırılma', items: [
    { href: '/admin/projects', label: 'Layihələr', icon: 'folder' },
    { href: '/admin/tasks', label: 'Tapşırıqlar', icon: 'check', badge: 'tasks' },
    { href: '/admin/tickets', label: 'Dəstək', icon: 'ticket', badge: 'tickets' },
  ] },
  { title: 'Marketinq', items: [
    { href: '/admin/campaigns', label: 'Kampaniyalar', icon: 'megaphone' },
    { href: '/admin/seo', label: 'SEO', icon: 'search' },
    { href: '/admin/analytics', label: 'Statistika', icon: 'chart' },
    { href: '/admin/content', label: 'Kontent', icon: 'pen' },
    { href: '/admin/social', label: 'Sosial media', icon: 'share' },
    { href: '/admin/email', label: 'Email', icon: 'mail' },
  ] },
  { title: 'Sayt', items: [
    { href: '/admin/portfolio', label: 'Portfolio', icon: 'image' },
    { href: '/admin/pages', label: 'Səhifələr', icon: 'layout' },
    { href: '/admin/builder', label: 'Builder', icon: 'blocks' },
    { href: '/admin/domains', label: 'Domenlər', icon: 'globe' },
  ] },
  { title: 'Şirkət', items: [
    { href: '/admin/reports', label: 'Hesabatlar', icon: 'report' },
    { href: '/admin/team', label: 'Komanda', icon: 'team' },
    { href: '/admin/settings', label: 'Parametrlər', icon: 'settings' },
  ] },
];
export const CREATE = [
  { href: '/admin/crm?new=1', label: 'Lead', icon: 'pipeline' },
  { href: '/admin/clients?new=1', label: 'Müştəri', icon: 'users' },
  { href: '/admin/projects?new=1', label: 'Layihə', icon: 'folder' },
  { href: '/admin/tasks?new=1', label: 'Tapşırıq', icon: 'check' },
  { href: '/admin/invoices?new=1', label: 'Faktura', icon: 'invoice' },
  { href: '/admin/tickets?new=1', label: 'Tiket', icon: 'ticket' },
];
export const ALL = NAV.flatMap((g) => g.items);
export const findNav = (path: string) => ALL.filter((n) => path === n.href || (n.href !== '/admin' && path.startsWith(n.href))).sort((a, b) => b.href.length - a.href.length)[0];
