import { useRef } from 'react'
import { Clock } from '@phosphor-icons/react/dist/csr/Clock'
import { EnvelopeSimple } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin'
import { Phone } from '@phosphor-icons/react/dist/csr/Phone'
import { office } from '../../data/content'
import { MQ, gsap, useGSAP } from '../../lib/scroll'
import { Media } from '../ui/Media'
import { ContactForm } from './ContactForm'

/** Vamos Conversar: título monumental, foto revelada por cortina, blocos de contato e formulário. */
export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('.contact-word', {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.contact-title', start: 'top 85%', once: true },
        })
        gsap
          .timeline({ scrollTrigger: { trigger: '.contact-figure', start: 'top 85%', end: 'center 50%', scrub: 1 } })
          .fromTo('.contact-clip', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
          .fromTo('.contact-img', { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section id="contato" ref={root} aria-labelledby="contato-title" className="relative border-t border-line pt-[var(--section-y)]">
      <div className="wrap">
        <h2 id="contato-title" className="contact-title display monument">
          <span className="mask-line"><span className="contact-word">Vamos</span></span>{' '}
          <span className="mask-line"><span className="contact-word text-accent">conversar</span></span>
        </h2>
      </div>

      <div className="wrap mt-12 grid border-t border-line lg:grid-cols-12">
        <figure className="contact-figure relative border-line py-10 lg:col-span-5 lg:border-r lg:pr-12">
          <div className="contact-clip relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-[4/5]">
            <Media name="contact" className="contact-img origin-[50%_48%]" />
          </div>
          <figcaption className="mono mt-3 flex justify-between gap-4 text-[10px] text-muted">
            <span>Sala de reuniões</span>
            <span>Imagem ilustrativa</span>
          </figcaption>

          <dl className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
            <InfoBlock icon={<MapPin size={18} aria-hidden />} title="Endereço">
              <p>{office.address}</p>
              <p className="text-muted">{office.neighborhood}</p>
            </InfoBlock>
            <InfoBlock icon={<Clock size={18} aria-hidden />} title="Horário">
              {office.hours.map((h) => (
                <p key={h}>{h}</p>
              ))}
            </InfoBlock>
            <InfoBlock icon={<EnvelopeSimple size={18} aria-hidden />} title="Contato">
              <p>
                <a href={`mailto:${office.email}`} className="break-all text-accent-text underline decoration-1 underline-offset-4">
                  {office.email}
                </a>
              </p>
              <p className="flex items-center gap-2 text-muted">
                <Phone size={14} aria-hidden /> {office.phone}
              </p>
            </InfoBlock>
          </dl>
        </figure>

        <div id="formulario" className="py-10 lg:col-span-7 lg:pl-12">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg p-5">
      <dt className="mono flex items-center gap-2 text-muted">
        <span className="text-accent-text">{icon}</span>
        {title}
      </dt>
      <dd className="mt-3 space-y-1 text-[15px]">{children}</dd>
    </div>
  )
}
