
import { Link } from "react-router-dom";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.slug}`} className="group">
      <div className="relative rounded-lg overflow-hidden aspect-square">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div>
            <h3 className="text-white text-xl font-semibold mb-1">
              {category.name}
            </h3>
            {category.subcategories && category.subcategories.length > 0 && (
              <p className="text-white/80 text-sm">
                {category.subcategories.length} subcategories
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
