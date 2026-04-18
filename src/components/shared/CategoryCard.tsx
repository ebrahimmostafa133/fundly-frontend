import { Link } from 'react-router-dom';
import type { Category } from '../../types/project.types';

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  const categoryValue = category.slug || category.name;

  return (
    <Link
      to={`/projects?category=${encodeURIComponent(categoryValue)}`}
      className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 font-medium hover:border-primary-300 hover:text-primary-600 transition-colors"
    >
      {category.name}
    </Link>
  );
}
