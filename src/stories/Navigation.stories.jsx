import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { Outlet, Route, Routes } from 'react-router-dom'

const meta = {
  title: 'Aceray Layout/Navigation',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export function HeaderDefault() {
  return <Header />
}

export function HeaderOnCatalogRoute() {
  return <Header />
}

HeaderOnCatalogRoute.parameters = {
  reactRouter: {
    initialEntries: ['/catalog'],
  },
}

export function FooterDefault() {
  return <Footer />
}

export function FullLayoutShell() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <section className="container py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718f80]">Storybook Shell</p>
              <h1 className="mt-3 text-4xl font-light tracking-wide text-[#222]">Aceray page content</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#555]">
                The layout story verifies the top banner, header, page area, and footer together.
              </p>
            </section>
          }
        />
      </Route>
      <Route path="*" element={<Outlet />} />
    </Routes>
  )
}
