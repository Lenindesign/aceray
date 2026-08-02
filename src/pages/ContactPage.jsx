import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function ContactPage() {
  useEffect(() => { document.title = 'Contact Aceray | Trade Pricing & Representatives' }, [])

  return (
    <div className="max-w-[900px] mx-auto px-8 py-20">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[#718f80] font-semibold mb-3">Get In Touch</p>
      <h1 className="text-4xl font-light tracking-[0.06em] text-[#222] mb-6">Contact & Trade Pricing</h1>
      <Separator className="bg-[#E5E3DD] mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#222] mb-6">Send a Message</h2>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wide text-[#555] font-medium" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="border border-[#E5E3DD] px-3 py-2.5 text-sm outline-none focus:border-[#718f80] transition-colors bg-transparent"
                placeholder="Your full name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wide text-[#555] font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="border border-[#E5E3DD] px-3 py-2.5 text-sm outline-none focus:border-[#718f80] transition-colors bg-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wide text-[#555] font-medium" htmlFor="company">Company / Studio</label>
              <input
                id="company"
                type="text"
                className="border border-[#E5E3DD] px-3 py-2.5 text-sm outline-none focus:border-[#718f80] transition-colors bg-transparent"
                placeholder="Your firm name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wide text-[#555] font-medium" htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                className="border border-[#E5E3DD] px-3 py-2.5 text-sm outline-none focus:border-[#718f80] transition-colors bg-transparent resize-none"
                placeholder="Tell us about your project or request..."
              />
            </div>
            <Button
              type="submit"
              className="bg-[#718f80] hover:bg-[#5a6e5e] text-white text-[0.75rem] tracking-[0.1em] uppercase h-12 rounded-none mt-2 w-full"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#222] mb-4">Trade Program</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              Aceray works exclusively with interior designers, hospitality purchasers, and design professionals. Trade accounts receive exclusive pricing, complimentary swatches, and dedicated representative support.
            </p>
          </div>
          <Separator className="bg-[#E5E3DD]" />
          <div>
            <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#222] mb-4">Contact</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-[0.68rem] tracking-[0.1em] uppercase text-[#767676] font-semibold mb-0.5">Email</dt>
                <dd><a href="mailto:info@aceray.com" className="text-[#718f80] hover:underline">info@aceray.com</a></dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.1em] uppercase text-[#767676] font-semibold mb-0.5">Phone</dt>
                <dd className="text-[#555]">+1 (305) 000-0000</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.1em] uppercase text-[#767676] font-semibold mb-0.5">Showroom</dt>
                <dd className="text-[#555]">Miami, FL · By Appointment</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
