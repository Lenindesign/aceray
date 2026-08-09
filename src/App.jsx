import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import ScrollToTop from '@/components/ScrollToTop'
import SitePasswordGate from '@/components/SitePasswordGate'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'))
const DesignersPage = lazy(() => import('@/pages/DesignersPage'))
const DesignerLandingPage = lazy(() => import('@/pages/DesignerLandingPage'))
const FamilyLandingPage = lazy(() => import('@/pages/FamilyLandingPage'))
const FabricsFinishesPage = lazy(() => import('@/pages/FabricsFinishesPage'))
const InstallationsPage = lazy(() => import('@/pages/InstallationsPage'))
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'))
const AcerayBookPage = lazy(() => import('@/pages/AcerayBookPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export default function App() {
  return (
    <SitePasswordGate>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="route-loading" aria-live="polite">Loading...</div>}>
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
              <Route path="/designers" element={<DesignersPage />} />
              <Route path="/designers/:designerSlug" element={<DesignerLandingPage />} />
              <Route path="/installations" element={<InstallationsPage />} />
              <Route path="/installation-gallery" element={<InstallationsPage />} />
              <Route path="/gallery" element={<InstallationsPage />} />
              <Route path="/projects" element={<InstallationsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/fabrics-finishes" element={<FabricsFinishesPage />} />
              <Route path="/aceray-book" element={<AcerayBookPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SitePasswordGate>
  )
}
