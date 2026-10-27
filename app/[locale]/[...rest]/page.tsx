import { notFound } from 'next/navigation';

// Mövcud olmayan bütün ünvanlar dizayna uyğun 404 səhifəsinə düşür
export default function CatchAll() {
  notFound();
}
