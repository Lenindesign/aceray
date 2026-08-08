import React, { useState } from 'react'
import { FullscreenImageViewer } from '@/components/FullscreenImageViewer'
import { Button } from '@/components/ui/button'

export default {
  title: 'Atomic Design/Organisms/FullscreenImageViewer',
  component: FullscreenImageViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A full-screen responsive image gallery and lightbox viewer with image zoom, pinch gestures, slideshow autoplay, and thumbnails navigation.',
      },
    },
  },
}

const mockImages = [
  {
    src: '/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp',
    title: 'Arte UU Table Base',
    designer: 'Studio Aceray',
  },
  {
    src: '/assets/migrated/Alba-4.webp',
    title: 'Alba Armchair',
    designer: 'Francesco Rota',
  },
  {
    src: '/assets/migrated/corso3.webp',
    title: 'Corso Lounge Chair',
    designer: 'Studio Aceray',
  },
]

export const InteractiveGallery = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-8 bg-[#FAF9F6] border border-[#E5E3DD] rounded-xl flex flex-col items-center gap-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
        PRODUCT GALLERY
      </h3>
      <p className="text-sm text-center text-[#555] mb-4">
        Click below to launch the high-resolution fullscreen lightbox viewer with zoom & gestures support.
      </p>
      <Button onClick={() => setIsOpen(true)} className="btn-primary">
        Open Fullscreen Gallery
      </Button>

      {isOpen && (
        <FullscreenImageViewer
          images={mockImages}
          initialIndex={0}
          title="Aceray Collection"
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
export const SingleImageLightbox = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-8 bg-[#FAF9F6] border border-[#E5E3DD] rounded-xl flex flex-col items-center gap-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
        SINGLE SPEC SHEET PHOTO
      </h3>
      <p className="text-sm text-center text-[#555] mb-4">
        Launches lightbox mode for a single product image (disables slideshow controls and thumbnails).
      </p>
      <Button onClick={() => setIsOpen(true)} className="btn-outline">
        Inspect Specification Photo
      </Button>

      {isOpen && (
        <FullscreenImageViewer
          images={['/assets/migrated/mira-x3-2-1.webp']}
          initialIndex={0}
          title="Mira X3 Detail View"
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
