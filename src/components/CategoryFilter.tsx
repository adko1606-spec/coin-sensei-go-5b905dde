import { motion } from "framer-motion";
import { categories } from "@/data/lessons";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        className={`
          shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all
          ${selected === null
            ? "gradient-primary text-primary-foreground shadow-button"
            : "bg-card text-foreground border border-border hover:bg-muted"
          }
        `}
      >
        Všetko
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`
            shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all
            ${selected === cat.id
              ? "gradient-primary text-primary-foreground shadow-button"
              : "bg-card text-foreground border border-border hover:bg-muted"
            }
          `}
        >
          {cat.emoji} {cat.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
