import { Routes, Route, useNavigate, useLocation } from 'react-router'
import Homepage from './pages/Home'
import ListPresetPage from './pages/list-preset-page'
import AuthPage from './pages/fitness-auth-page'
import { CategoryManagementPage } from './pages/category-management'
import { useEffect, useState } from 'react'
import { putLoggedInUser } from './services/user.service'
import { SavedUserDto } from './dtos/user'

export function RootCmp() {
    const location = useLocation()
    const isAuthOrHomePage = location.pathname === '/' || location.pathname === '/auth';
    const [user] = useState<SavedUserDto | void>(putLoggedInUser())
    const navigate = useNavigate()
    useEffect(() => {
        if (user && isAuthOrHomePage) {
            navigate('/list')
        }
    },);

    return (
        <div className="main-container">
            <main>
                <Routes>
                    <Route path='/' element={<Homepage />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/list' element={<ListPresetPage />} />
                    <Route path='/list/:id' element={<CategoryManagementPage />} />
                </Routes>
            </main>
        </div>
    )
}


