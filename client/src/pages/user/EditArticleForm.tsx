import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Upload, X, MoreHorizontal, ChevronDown, Tag } from 'lucide-react';
import { IoIosArrowRoundBack } from "react-icons/io";
import Navbar from '../../components/home/Navbar';
import { editArticle, getArticleDetails } from '../../service/user/articleService';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const EditArticleForm = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [isDraft, setIsDraft] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { id } = useParams()
    const categories = [

        "Technology",
        "Science",
        "Health",
        "Travel",
        "Education",
        "Finance",
        "Sports",
        "Entertainment",
        "Artificial Intelligence",
        "Machine Learning",
        "Design",
        "Photography",
        "Music",
        "Cooking",
        "Gaming",
        "Books",
        "Movies",
        "Fitness",

    ];
  useEffect(()=>{
      const fetchArticleData = async () => {
        if (!id) return
        try {
            const response = await getArticleDetails(id)
            const article= response?.article
            setTitle(article.title)
            setCoverImage(article.coverImage)
            setSubtitle(article.subtitle)
            setSelectedCategory(article.category)
            setContent(article.content)
            console.log(response)

        } catch (error) {
            console.error("Error on fetching article")
        }
    }
    if(id){
        fetchArticleData()
    }
  },[])

    const navigate = useNavigate()
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = await uploadToCloudinary(file)
            setCoverImage(imageUrl)
        }
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePublish = async () => {

        if (!selectedCategory) {
            alert('Please select a category for your article before publishing.');
            return;
        }
        if (!id) {
            return
        }

        const data = { title, subtitle, coverImage, content, category: selectedCategory }
        const response = await editArticle(data, id)
        if (response.success) {
            navigate("/settings/articles")
            setIsDraft(false);
        } else {
            console.error("Somthing went wrong")
        }


    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setShowCategoryDropdown(false);
    };

    const selectedCategoryData = categories.find(cat => cat === selectedCategory);

    const wordCount = content.split(' ').filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Navbar */}
            <header className="sticky top-0 z-50 bg-gray-50 shadow-sm">
                {/* Your existing Navbar */}
                <div className="border-b border-gray-100">
                    <Navbar />
                </div>

                {/* Article Controls Bar */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        {/* Left Section - Draft Status */}
                        <div className="flex items-center space-x-4">
                         <div onClick={()=>navigate(-1)}>
                            <IoIosArrowRoundBack className='w-7 h-7'/>
                         </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${isDraft ? 'bg-orange-400' : 'bg-green-500'}`}></div>
                                <span className="text-sm text-gray-600">
                                    {isDraft ? 'Draft in' : 'Published in'}
                                    <span className="font-medium text-gray-800 ml-1">Mohamedmufeed</span>
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">• Auto-saved</span>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex items-center space-x-3">


                            <button
                                onClick={handlePublish}
                                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                {'Update'}
                            </button>

                            <button className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-white rounded-full transition-all duration-200">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Category Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Tag size={16} className="mr-2" />
                        Article Category
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="w-full md:w-auto min-w-[200px] flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            {selectedCategoryData ? (
                                <div className="flex items-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium  mr-3`}>
                                        {selectedCategory}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-500">Select a category</span>
                            )}
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showCategoryDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCategorySelect(category)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-center"
                                    >
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium`}>
                                            {category}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedCategory && (
                        <p className="text-xs text-gray-500 mt-2">
                            Your article will be published in the {selectedCategoryData} category
                        </p>
                    )}
                </div>

                {/* Cover Image Section */}
                <div className="mb-12">
                    {!coverImage ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer hover:border-gray-900 hover:bg-gray-100 transition-all duration-300 group"
                        >
                            <Upload className="mx-auto h-14 w-14 text-gray-400 mb-4 transition-colors" />
                            <p className="text-gray-700 text-lg mb-2 font-semibold">Add a cover image</p>
                            <p className="text-gray-500 text-sm mb-1">Click to upload or drag and drop</p>
                            <p className="text-gray-400 text-xs">Recommended: 1600 x 840 pixels</p>
                        </div>
                    ) : (
                        <div className="relative group">
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-80 object-cover rounded-xl shadow-lg block"
                            />

                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300"></div>
                            <button
                                onClick={removeCoverImage}
                                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>

                {/* Title Input */}
                <div className="mb-6">
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full text-5xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none bg-transparent leading-tight"
                        rows={2}
                        style={{ fontFamily: 'Georgia, serif' }}
                    />
                </div>

                {/* Subtitle Input */}
                <div className="mb-10">
                    <textarea
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Write a subtitle to hook your readers..."
                        className="w-full text-xl text-gray-600 placeholder-gray-400 border-none outline-none resize-none bg-transparent leading-relaxed"
                        rows={2}
                        style={{ fontFamily: 'Georgia, serif' }}
                    />
                </div>

                {/* Content Input */}
                <div className="mb-8">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell your story..."
                        className="w-full text-xl text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent leading-relaxed"
                        rows={25}
                        style={{
                            fontFamily: 'Georgia, serif',
                            minHeight: '600px'
                        }}
                    />
                </div>

                {/* Stats */}
                {content && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-12">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="font-medium">{wordCount} words</span>
                            <span>{readTime} min read</span>
                            {selectedCategoryData && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium`}>
                                    {selectedCategoryData}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-400">
                            Last edited just now
                        </div>
                    </div>
                )}
            </main>

            {/* Enhanced Footer Toolbar */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-white border border-gray-200 rounded-full shadow-xl px-6 py-3 flex items-center space-x-4">
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
                        <span className="text-lg font-bold">B</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
                        <span className="text-lg italic">I</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
                        <span className="text-lg">&ldquo;</span>
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
                        <span className="text-lg font-bold">H</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showCategoryDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowCategoryDropdown(false)}
                ></div>
            )}
        </div>
    );
}

export default EditArticleForm;