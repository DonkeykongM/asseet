import { Hero } from '@/components/sections/hero';
import { ProcessSteps } from '@/components/sections/process-steps';
import { CategoriesGrid } from '@/components/sections/categories-grid';
import { Features } from '@/components/sections/features';
import { MiniTools } from '@/components/sections/mini-tools';
import { FAQ } from '@/components/sections/faq';
import { Newsletter } from '@/components/sections/newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <ProcessSteps />
      <CategoriesGrid />
      <Features />
      <MiniTools />
      <FAQ />
      <Newsletter />
    </>
  );
}