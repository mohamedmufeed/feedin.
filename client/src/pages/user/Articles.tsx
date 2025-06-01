import { useEffect, useState } from 'react';
import Navbar from '../../components/home/Navbar';
import SettingsSideBar from '../../components/profile/SettingsSideBar';
import { MdEdit, MdDelete } from "react-icons/md";
import type { IArticle } from '../../types/articleTypes';
import { deleteArticle, userArticles } from '../../service/user/articleService';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/store';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/profile/DeleteConfirmationModal';

const Articles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const navigate = useNavigate()

  const userId = useSelector((state: RootState) => state.auth.user);

  const fetchArticles = async () => {
    if (!userId) return;
    try {
      const response = await userArticles(userId, page, limit, searchQuery);
      setArticles(response.articles);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("Error fetching articles");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [userId, page, searchQuery]);

  const handleClick = (articleId: string) => {
    navigate(`/articles/${articleId}/edit`)
  }

  const handleDelete = async () => {
    if (!selectedArticleId) return
    try {
      const response = await deleteArticle(selectedArticleId)
      console.log(response)
      if (response.success) {
      setArticles((prev) => prev.filter((article) => article._id !== selectedArticleId));
      }

    } catch (error) {
      console.error("Error on deleting article")
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex">
        <SettingsSideBar />

        <div className="flex-1 px-6 py-8">
          <h1 className="text-2xl font-bold mb-6">My Articles</h1>


          <input
            type="text"
            placeholder="Search articles..."
            className="mb-4 px-4 py-2 border rounded-md w-full max-w-md"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />

          <div className="grid grid-cols-5 font-semibold text-gray-600 mb-4 px-10">
            <div className='col-span-3'>Title</div>
            <div>Date</div>
            <div className="text-right">Actions</div>
          </div>


          <div className="space-y-4">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border px-6 py-4 grid grid-cols-5 items-center"
              >
                <div className='col-span-3'>
                  <h2 className="text-md font-medium">{article.title}</h2>
                  <p className="text-gray-500 text-sm">{article.subtitle}</p>
                </div>
                <p className="text-gray-500 text-sm col-span-1">
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric"
                  }) : "N/A"}
                </p>
                <div className="flex justify-end gap-4 col-span-1">
                  <MdEdit className='w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-300' onClick={() => handleClick(article._id || "")} />
                  <MdDelete className='w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-300' onClick={() => {
                    setSelectedArticleId(article._id || null);
                    setModalOpen(true);
                  }} />
                </div>
              </div>
            ))}
            {articles.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                No articles found.
              </div>
            )}
          </div>

          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleDelete}
          />
          <div className="flex justify-center mt-8 gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{page} / {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
