import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';
import { professionalsMock } from '@/mocks/professionals.mock';

type Props = {
  params: { username: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const rawUsername = params.username as string;
  const username = rawUsername.replace('%40', '').replace('@', '');
  
  const professional = professionalsMock.find(p => p.username === username);
  
  if (!professional) {
    return {
      title: 'Profissional não encontrado | Belezza',
    };
  }

  const title = `${professional.businessName || professional.name} | Belezza`;
  const description = professional.bio;
  const image = professional.coverImage;

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
