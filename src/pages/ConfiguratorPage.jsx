import { useEffect } from 'react'
import ChairConfigurator from '@/components/configurator/ChairConfigurator'
import { setSeoMetadata, removeSeoJsonLd } from '@/lib/seo'

export default function ConfiguratorPage() {
  useEffect(() => {
    setSeoMetadata({
      title: 'Chair Configurator - #100-01 Side Chair | Aceray',
      description: 'Customize the Aceray #100-01 dining chair with premium European beech wood finishes and Planet Grade A upholstery fabrics.',
      canonical: 'https://aceray.com/configurator',
    })

    return () => {
      removeSeoJsonLd()
    }
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <ChairConfigurator />
    </main>
  )
}
