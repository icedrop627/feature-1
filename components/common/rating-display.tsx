import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  showReviewCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingDisplay({
  rating,
  reviewCount,
  showReviewCount = true,
  size = 'md'
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const starSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                size={starSizes[size]}
                className="fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <Star
                  size={starSizes[size]}
                  className="text-gray-300 dark:text-gray-600"
                />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    size={starSizes[size]}
                    className="fill-yellow-400 text-yellow-400"
                  />
                </div>
              </div>
            );
          } else {
            return (
              <Star
                key={index}
                size={starSizes[size]}
                className="text-gray-300 dark:text-gray-600"
              />
            );
          }
        })}
      </div>
      <span className="font-semibold text-gray-900 dark:text-gray-100">
        {rating.toFixed(1)}
      </span>
      {showReviewCount && reviewCount !== undefined && (
        <span className="text-gray-500 dark:text-gray-400">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
