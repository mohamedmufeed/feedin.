import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import type { IArticle } from "../../types/articleTypes";
import { getSearchResult } from "../../service/user/articleService";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage = () => {
  const query = useQuery().get("q") || "";
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/article/${id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await getSearchResult(query);
        setArticles(res.articles);
      } catch (err) {
        console.error("Error fetching search results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <BiArrowBack className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Search results header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        <p className="text-gray-600">
          {loading ? "Searching..." : `Found ${articles.length} results for "${query}"`}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* No results */}
      {!loading && articles.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found for "{query}"</p>
          <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
        </div>
      )}

      {/* Search results */}
      {!loading && articles.length > 0 && (
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleClick(article._id || "")}
            >
              <div className="flex flex-col sm:flex-row p-6 gap-6">
                {/* Article Content */}
                <div className="flex-1">
                  {/* Author info */}
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={article.author.profileImage || "/default-avatar.png"}
                      alt={`${article.author.firstName} ${article.author.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                    <p className="text-gray-700 text-sm">
                      In{" "}
                      <span className="text-black hover:underline font-medium">
                        {article.category}
                      </span>{" "}
                      by{" "}
                      <span className="text-gray-900 hover:underline font-medium">
                        {article.author.firstName} {article.author.lastName}
                      </span>
                    </p>
                  </div>

                  {/* Article title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 hover:underline ">
                    {article.title}
                  </h3>

                  {/* Article subtitle */}
                  <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                    {article.subtitle}
                  </p>

                  {/* Article metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                      <span className="text-gray-300">•</span>
                    </div>
                  </div>
                </div>

                {/* Article cover image */}
                <div className="flex-shrink-0">
                  <img
                    src={article.coverImage || "/default-article-image.jpg"}
                    alt={article.title}
                    className="w-full sm:w-40 h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/default-article-image.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show more results button (if applicable) */}
      {articles.length > 0 && articles.length >= 10 && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;