import { CATEGORY_COLORS } from "../expenseConstants";

export default function CategoryBadge({ category }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
      }`}
    >
      {category}
    </span>
  );
}