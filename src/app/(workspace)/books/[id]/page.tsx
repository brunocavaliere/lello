type BookDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

import { BookDetailWorkspace } from '@/components/books';

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  return <BookDetailWorkspace bookId={id} />;
}
