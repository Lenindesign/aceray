import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import ScrollToTop from '@/components/ScrollToTop'
import HomePage from '@/pages/HomePage'
import ProductPage from '@/pages/ProductPage'
import CatalogPage from '@/pages/CatalogPage'
import AboutPage from '@/pages/AboutPage'
import BlogPage from '@/pages/BlogPage'
import ContactPage from '@/pages/ContactPage'
import CollectionsPage from '@/pages/CollectionsPage'
import FamilyLandingPage from '@/pages/FamilyLandingPage'
import FabricsFinishesPage from '@/pages/FabricsFinishesPage'
import ResourcesPage from '@/pages/ResourcesPage'
import AcerayBookPage from '@/pages/AcerayBookPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:familySlug" element={<FamilyLandingPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/fabrics-finishes" element={<FabricsFinishesPage />} />
          <Route path="/aceray-book" element={<AcerayBookPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
