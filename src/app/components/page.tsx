'use client';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

import { ComponentsDemo } from '@/components/ComponentsDemo';

export default function ComponentsPage() {
  return <ComponentsDemo />;
}
