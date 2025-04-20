import React from "react";
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <Link to={`/shop/category/${category.id}`}>
        <Card className="card-hover overflow-hidden text-center">
          <div className="bg-agro-green-100/50 dark:bg-agro-green-900/30 p-4">
            <img
              src={category.image}
              alt={category.name}
              className="h-20 w-20 mx-auto object-contain"
            />
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium">{category.name}</h3>
            {category.count && (
              <p className="text-xs text-muted-foreground">{category.count} products</p>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default CategoryCard;
