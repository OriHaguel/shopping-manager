import { Routes, Route } from 'react-router'
import Homepage from './pages/Home'
import CategoryManagementPage from './pages/category-management'
import ListPresetPage from './pages/list-preset-page'
// import { AppHeader } from './cmps/AppHeader'
export function RootCmp() {
    return (
        <div className="main-container">
            {/* <AppHeader /> */}
            <main>
                <Routes>
                    {/* <Route path='/' element={<CategoryManagementPage />} /> */}
                    <Route path='/' element={<ListPresetPage />} />
                </Routes>
            </main>
        </div>
    )
}


