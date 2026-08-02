import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ResourcesPage() {
  useEffect(() => {
    document.title = 'Resources & Downloads – Aceray | Premium Commercial Furniture'
  }, [])

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#718f80]">Design Resources</span>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">Catalogs, Finishes &amp; 3D Models</h1>
          <p className="text-[#666666] max-w-xl mx-auto text-sm sm:text-base">
            Access our complete library of design resources, digital swatches, architectural CAD files, and care guides.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="border border-black/10 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">2026 Catalog Request</h3>
            <p className="text-sm text-[#666666] mb-4">Download the latest Aceray master catalog featuring contemporary seating collections.</p>
            <Link to="/contact" className="btn-primary inline-flex text-xs">Request Digital Catalog</Link>
          </div>

          <div className="border border-black/10 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Fabrics &amp; Finishes</h3>
            <p className="text-sm text-[#666666] mb-4">Explore graded-in textiles, wood stains, powder coat metals, and custom COM/COL options.</p>
            <Link to="/contact" className="btn-outline inline-flex text-xs">Order Physical Swatches</Link>
          </div>

          <div className="border border-black/10 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">3D Models &amp; CAD Downloads</h3>
            <p className="text-sm text-[#666666] mb-4">Revit, OBJ, DWG, and SketchUp 3D assets for interior architects and space planners.</p>
            <Link to="/catalog" className="btn-outline inline-flex text-xs">Browse Products for CAD</Link>
          </div>

          <div className="border border-black/10 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Care &amp; Maintenance</h3>
            <p className="text-sm text-[#666666] mb-4">Comprehensive care instructions for solid hardwoods, upholstered leathers, and outdoor finishes.</p>
            <Link to="/about" className="btn-outline inline-flex text-xs">Read Care Guide</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
