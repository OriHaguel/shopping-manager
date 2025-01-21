import { Routes, Route } from 'react-router'
import Homepage from './pages/Home'

import CategoryManagementPage from './pages/category-management'
import ListPresetPage from './pages/list-preset-page'
import AuthPage from './pages/fitness-auth-page'
// import { AppHeader } from './cmps/AppHeader'
export function RootCmp() {
    return (
        <div className="main-container">
            {/* <AppHeader /> */}
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


