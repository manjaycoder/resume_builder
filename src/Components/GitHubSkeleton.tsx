// components/GitHubSkeleton.tsx
export const GitHubSkeleton = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  };