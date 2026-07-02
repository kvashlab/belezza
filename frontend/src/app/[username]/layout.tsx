import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawUsername = params.username as string;
  const username = rawUsername.replace('%40', '').replace('@', '');
  
  try {
    const res = await fetch(`http://localhost:3333/api/professionals/public/${username}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Not found');
    
    const professional = await res.json();
    
    const title = `${professional.businessName || professional.user?.name} | Belezza`;
    const description = professional.bio || 'Profissional de beleza na Belezza';
    const image = professional.coverImage || '/placeholder-cover.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
        url: `https://belezza.com/@${professional.username}`,
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return { title: 'Profissional não encontrado | Belezza' };
  }
}
export default function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main style={{ flex: 1, backgroundColor: 'var(--surface-main)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
