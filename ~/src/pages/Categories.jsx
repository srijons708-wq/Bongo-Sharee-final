import { useEffect, useState } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import CategoryCard from '../components/product/CategoryCard.jsx';
import { categoriesApi } from '../lib/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { categoriesApi.list().then(setCategories).catch(() => {}); }, []);
  return (
    <div className="container-content section-pad py-10">
      <Breadcrumb items={[{ label: 'Categories' }]} />
      <div className="mt-4 mb-10">
        <span className="eyebrow">Explore</span>
        <h1 className="font-display text-3xl md:text-4xl mt-2">Shop By Category</h1>
        <p className="text-muted text-sm mt-2 max-w-xl">
          From bridal Kanjivarams to everyday handloom cotton — find the weave suited to your occasion.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
