import { LuStar } from "react-icons/lu";

const RatingStars = ({ value = 5, size = 14 }: { value?: number; size?: number }) => (
  <span className="inline-flex gap-0.5 text-amber-500" aria-label={`${value} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <LuStar key={i} size={size} className={i < Math.round(value) ? 'fill-current' : 'opacity-30'} />
    ))}
  </span>
);

export default RatingStars
