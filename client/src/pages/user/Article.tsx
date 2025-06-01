import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../../components/home/Navbar"
import { BiDislike, BiLike } from "react-icons/bi";
import { useEffect, useState } from "react";
import type { IArticle } from "../../types/articleTypes";
import { blockArticle, getArticleDetails, tooggleDislike, tooggleLike } from "../../service/user/articleService";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";


import { CiCircleMinus } from "react-icons/ci";


const Article = () => {
    const [article, setArticle] = useState<IArticle>()
    const [likes, setLikes] = useState(article?.likes || []);
    const [dislikes, setDislikes] = useState(article?.dislikes || []);
    const userId = useSelector((state: RootState) => state.auth.user)
    const navigate = useNavigate()

    const { id } = useParams();

    useEffect(() => {

        const fetchArticle = async () => {
            if (!id) return
            try {
                const response = await getArticleDetails(id)
                if (response) {
                    setArticle(response.article)
                    setLikes(response.article.likes);
                    setDislikes(response.article.dislikes);
                }

            } catch (error) {
                console.error("Error on fetching article")
            }
        }
        if (id) {
            fetchArticle()
        }

    }, [id])

    const handleLike = async () => {
        if (!userId) {
            navigate("/login")
            return
        }
        try {
            const response = await tooggleLike(id || "", userId)
            console.log("like response", response)
            if (response) {
                setLikes(response.article.likes);
                setDislikes(response.article.dislikes);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const handleDislike = async () => {
        if (!userId) {
            navigate("/login")
            return
        }
        try {
            const response = await tooggleDislike(id || "", userId)
            if (response) {
                setLikes(response.article.likes);
                setDislikes(response.article.dislikes);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBlock = async () => {
        try {
            if (!userId) return navigate("/login");
            const response = await blockArticle(id || "", userId)
            if (response.success) {
                navigate("/")
            }

        } catch (error) {
            console.error("Block Article :", error)
        }
    }

    return (
        <div>
            <div className="sticky">
                <Navbar />
            </div>


            <div className="bg-gray-50">
                <div className="pt-20 px-4 sm:px-8 lg:px-40">
                    {/* Title */}
                    <h3 className="text-xl sm:text-5xl font-bold text-black mb-4">
                        {article?.title}
                    </h3>

                    {/* Author & Meta Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 text-sm text-gray-700 pt-6">
                        {/* Profile */}
                        <div className="flex items-center space-x-3">
                            <img
                                src={article?.author.profileImage}
                                alt="Author"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <p>
                                In <span className="text-black hover:underline">{article?.category}</span> by{" "}
                                <span className="text-black hover:underline">{article?.author.firstName} {article?.author.lastName}</span>
                            </p>
                        </div>

                        {/* Date & Likes */}
                        <div className="flex items-center space-x-6 text-gray-500">
                            <p>{new Date(1).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                            })}</p>

                            <div className="flex space-x-4 ">
                                {/* If user is logged in, show interactive buttons */}
                                {userId ? (
                                    <>
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center space-x-1 ${likes.includes(userId) ? 'text-green-500' : 'text-gray-500'
                                                } hover:text-green-600`}
                                        >
                                            <BiLike className="w-5 h-5" />
                                            <span>{likes.length}</span>
                                        </button>

                                        <button
                                            onClick={handleDislike}
                                            className={`flex items-center space-x-1 ${dislikes.includes(userId) ? 'text-red-500' : 'text-gray-500'
                                                } hover:text-red-600`}
                                        >
                                            <BiDislike className="w-5 h-5" />
                                            <span>{dislikes.length}</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-1 text-gray-400">
                                            <BiLike className="w-5 h-5" />
                                            <span>{likes.length}</span>
                                        </div>

                                        <div className="flex items-center space-x-1 text-gray-400">
                                            <BiDislike className="w-5 h-5" />
                                            <span>{dislikes.length}</span>
                                        </div>
                                    </>
                                )}
                            </div>


                            <div className="mt-2">
                                <button className="cursor-pointer" onClick={handleBlock}>
                                    <CiCircleMinus className="w-5 h-5 transition-transform duration-200 hover:scale-125" />
                                </button>
                            </div>


                        </div>
                    </div>

                    {/* Article Image (if needed later) */}
                    <div className="mt-10 px-4 sm:px-8">
                        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                            {article?.coverImage ? (
                                <img
                                    src={article.coverImage}
                                    alt="Banner"
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            ) : (
                                <div className="text-gray-500 text-lg">No image available</div>
                            )}
                        </div>

                        {/* subtitle */}
                        <div style={{ fontFamily: 'Georgia, serif' }} className="px py-10">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-wide leading-snug text-gray-800">
                                    {article?.subtitle}
                                </h1>
                                {/* content */}
                                <div className="pt-6">
                                    <p className="text-lg leading-relaxed tracking-normal text-gray-700">
                                        {article?.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Article;
