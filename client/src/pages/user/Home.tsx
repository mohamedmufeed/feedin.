import React, { useEffect, useState } from "react";
import Navbar from "../../components/home/Navbar";
import { BiDislike, BiLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { IArticle } from "../../types/articleTypes";
import { blockArticle, getLatestArticle, getPersonalizedFeed, getUserFeed, tooggleDislike, tooggleLike } from "../../service/user/articleService";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { CiCircleMinus } from "react-icons/ci";

const Home = () => {
  const [likesMap, setLikesMap] = useState<Record<string, string[]>>({});
  const [dislikesMap, setDislikesMap] = useState<Record<string, string[]>>({});
  const [personalizedArticle, setpersonalizedArticle] = useState<IArticle[]>([]);
  const [latestArticle, setLatestArticle] = useState<IArticle[]>([])
  const userName = useSelector((state: RootState) => state.auth.lastName);
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth?.user);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin)
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  useEffect(() => {
    const fetchUserFeed = async () => {
      try {
        if (userId) {
          const response = await getPersonalizedFeed(userId);
          if (response.success) {
            setpersonalizedArticle(response.articles);
            const initialLikesMap: Record<string, string[]> = {};
            const initialDislikesMap: Record<string, string[]> = {};
            response.articles.forEach((article: IArticle) => {
              if (article._id) {
                initialLikesMap[article._id] = article.likes || [];
                initialDislikesMap[article._id] = article.dislikes || [];
              }
            });

            setLikesMap(initialLikesMap);
            setDislikesMap(initialDislikesMap);
          }
        } else {
          const response = await getUserFeed();
          if (response.success) {
            setpersonalizedArticle(response.articles)
            const initialLikesMap: Record<string, string[]> = {};
            const initialDislikesMap: Record<string, string[]> = {};

            response.articles.forEach((article: IArticle) => {
              if (article._id) {
                initialLikesMap[article._id] = article.likes || [];
                initialDislikesMap[article._id] = article.dislikes || [];
              }
            });

            setLikesMap(initialLikesMap);
            setDislikesMap(initialDislikesMap);
          }
        }
      } catch (error) {
        console.error("Error on user feed");
      }
    };

    fetchUserFeed();
  }, [userId]);

  const handleLike = async (articleId: string) => {
    if (!userId) return navigate("/login");

    try {
      const response = await tooggleLike(articleId, userId);

      if (response?.article) {
        setLikesMap((prev) => ({ ...prev, [articleId]: response.article.likes }));
        setDislikesMap((prev) => ({ ...prev, [articleId]: response.article.dislikes }));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDislike = async (articleId: string) => {
    if (!userId) return navigate("/login");

    try {
      const response = await tooggleDislike(articleId, userId);
      if (response?.article) {
        setLikesMap((prev) => ({ ...prev, [articleId]: response.article.likes }));
        setDislikesMap((prev) => ({ ...prev, [articleId]: response.article.dislikes }));
      }
    } catch (err) {
      console.error("Dislike error:", err);
    }
  };

  const handleBlock = async (articleId: string) => {
    try {
      if (!userId) return navigate("/login");
      const response = await blockArticle(articleId, userId)
      if (response.success) {
        setpersonalizedArticle((prev) =>
          prev.filter((article) => article._id !== articleId)
        );
      }

    } catch (error) {
      console.error("Block Article :", error)
    }
  }

  const handleClick = (id: string) => {
    navigate(`/article/${id}`);
  };

  const getCurrentLikes = (articleId: string) => {
    return likesMap[articleId] || [];
  };

  const getCurrentDislikes = (articleId: string) => {
    return dislikesMap[articleId] || [];
  };

  const isLikedByUser = (articleId: string) => {
    return userId ? getCurrentLikes(articleId).includes(userId) : false;
  };

  const isDislikedByUser = (articleId: string) => {
    return userId ? getCurrentDislikes(articleId).includes(userId) : false;
  };

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await getLatestArticle()
        setLatestArticle(response.articles)
      } catch (error) {
        console.error("Error on geting latest article")
      }
    }
    fetchLatestArticles()
  }, [])


  useEffect(() => {
    if (isAdmin) {
      navigate("/admin/dashboard")
    } else {
      navigate("/")
    }
  }, [userId])


  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Mulish, sans-serif" }}>
      <Navbar />

      {/* Header Section */}
      <div className="px-6 sm:px-10 lg:px-20 py-10 sm:py-20">
        <p className="text-sm sm:text-xl text-gray-500 mb-2">{today}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Welcome, {userName}!
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl pt-4">
          Discover the latest articles tailored to your interests.
        </p>
      </div>

      {/* Article Feed and Sidebar */}
      <div className="flex flex-col lg:flex-row px-6 sm:px-10 lg:px-20 py-10 gap-8">
        {/* Main Feed: For You */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">For you</h2>

          {personalizedArticle.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              <p className="text-lg font-medium">No personalized articles available.</p>
              <p className="text-sm text-gray-500 mt-2">
                Please go to your profile and select your preferences to see personalized articles here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {personalizedArticle.map((article, index) => (
                <React.Fragment key={article._id}>
                  <div className="flex flex-col sm:flex-row p-6 gap-6">
                    {/* Article Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-4">
                        <img
                          src={article.author.profileImage}
                          alt={article.author.lastName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <p className="text-gray-700 text-sm">
                          In <span className="text-black hover:underline">{article.category}</span> by{" "}
                          <span className="text-black hover:underline">
                            {article.author.firstName} {article.author.lastName}
                          </span>
                        </p>
                      </div>

                      <h3
                        className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-gray-600"
                        onClick={() => handleClick(article._id || "")}
                      >
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4">{article.subtitle}</p>

                      <div className="flex items-center justify-between space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-6">
                          <p>
                            {article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                              : "N/A"}
                          </p>
                          <div className="flex space-x-4">
                            {userId ? (
                              <>
                                <button
                                  onClick={() => handleLike(article._id || "")}
                                  className={`flex items-center space-x-1 transition-colors cursor-pointer ${isLikedByUser(article._id || "")
                                      ? "text-green-500"
                                      : "text-gray-500 hover:text-green-600"
                                    }`}
                                >
                                  <BiLike className="w-5 h-5" />
                                  <span>{getCurrentLikes(article._id || "").length}</span>
                                </button>

                                <button
                                  onClick={() => handleDislike(article._id || "")}
                                  className={`flex items-center space-x-1 transition-colors cursor-pointer ${isDislikedByUser(article._id || "")
                                      ? "text-red-500"
                                      : "text-gray-500 hover:text-red-600"
                                    }`}
                                >
                                  <BiDislike className="w-5 h-5" />
                                  <span>{getCurrentDislikes(article._id || "").length}</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center space-x-1 text-gray-400 cursor-pointer">
                                  <BiLike className="w-5 h-5" />
                                  <span>{getCurrentLikes(article._id || "").length}</span>
                                </div>

                                <div className="flex items-center space-x-1 text-gray-400 cursor-pointer">
                                  <BiDislike className="w-5 h-5" />
                                  <span>{getCurrentDislikes(article._id || "").length}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <button
                            className="cursor-pointer"
                            onClick={() => handleBlock(article._id || "")}
                          >
                            <CiCircleMinus className="w-5 h-5 transition-transform duration-200 hover:scale-125" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <img
                      src={article.coverImage || ""}
                      alt={article.title}
                      className="w-full sm:w-40 h-40 object-cover rounded-lg"
                    />
                  </div>

                  {/* Divider */}
                  {index !== personalizedArticle.length - 1 && (
                    <div className="hidden lg:block border-t border-gray-200 my-4"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>


        <div className="hidden lg:block border-l border-gray-200"></div>

        {/* sidebar */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Latest</h2>
          {latestArticle && latestArticle.length > 0 ? (
            latestArticle.map((latestArticle, index) => (
              <div className="p-6" key={index}>
                <div className="mb-4"></div>
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src={latestArticle.author.profileImage}
                    alt={latestArticle.author.profileImage}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="text-gray-700 text-sm">
                    In <span className="text-black hover:underline">{latestArticle.category}</span> by{" "}
                    <span className="text-black hover:underline">{latestArticle.author.firstName} {latestArticle.author.lastName}</span>
                  </p>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{latestArticle.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{latestArticle.subtitle}</p>
                <p className="text-sm text-gray-500">
                  {latestArticle.createdAt ? new Date(latestArticle.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }) : "N/A"}
                </p>
              </div>
            ))

          ) :
            (
              <p>No Atricles</p>

            )}

        </div>
      </div>
    </div>
  );
};

export default Home;