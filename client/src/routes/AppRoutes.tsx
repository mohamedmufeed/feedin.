import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProtectedRoute from "../components/authForms/ProtectedRoute"

const Login = lazy(() => import("../pages/user/Login"))
const Home = lazy(() => import("../pages/user/Home"))
const Article = lazy(() => import("../pages/user/Article"))
const Profile = lazy(() => import("../pages/user/Profile"))
const Articles = lazy(() => import("../pages/user/Articles"))
const ArticleForm = lazy(() => import("../pages/user/ArticleForm"))
const EditArticleForm = lazy(() => import("../pages/user/EditArticleForm"))
const SearchPage = lazy(() => import("../pages/user/SearchPage"))

const AdminDashboard=lazy(()=>import("../pages/admin/ArminDashboard"))
const AdminUserManagement=lazy(()=>import("../pages/admin/AdminUserManagement"))
const PreferenceManagement = lazy(()=>import("../pages/admin/AdminPreferenceManagement"))

const AppRoutes = () => {
    return (
        <Router>
            <Suspense>
            </Suspense>

            <Routes>
                {/* auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                {/* home */}
                <Route path="/" element={<Home />} />


                {/* user */}

                <Route path="/article/:id" element={
                    <ProtectedRoute>
                        <Article />
                    </ProtectedRoute>
                } />

                <Route path="/add-article" element={
                    <ProtectedRoute>
                        <ArticleForm />
                    </ProtectedRoute>
                } />

                <Route path="/settings/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>

                } />

                <Route path="/settings/articles" element={
                    <ProtectedRoute>
                        <Articles />
                    </ProtectedRoute>

                } />

                <Route path="/articles/:id/edit" element={
                    <ProtectedRoute>
                        <EditArticleForm />
                    </ProtectedRoute>
                } />

                <Route path="/search" element={
                    <ProtectedRoute>
                        <SearchPage />
                    </ProtectedRoute>
                } />

                {/* admin */}

                <Route path="/admin/dashboard" element={
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/admin/users" element={
                    <ProtectedRoute adminOnly>
                        <AdminUserManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/preferences" element={
                    <ProtectedRoute adminOnly>
                        <PreferenceManagement />
                    </ProtectedRoute>
                } />

            </Routes>
        </Router>
    )
}

export default AppRoutes