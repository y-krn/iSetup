import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { BackButton } from '@/components/BackButton'

export const metadata: Metadata = {
  title: 'Terms — iSetup.app',
  alternates: {
    canonical: '/en/terms',
  },
}

export default function EnglishTermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-3">
        <BackButton fallback="/en" variant="text" label="Back" />
        <div className="inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          <FileText size={13} />
          Legal Note
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">Terms</h1>
          <p className="text-xs font-semibold text-muted">Last updated: May 9, 2026</p>
        </div>
      </header>

      <div className="gallery-shelf rounded-[2.25rem] p-4 sm:p-6 space-y-4">
        <Section title="1. Scope">
          <p>
            These English Terms describe the basic conditions for using iSetup.app. The Japanese version is the primary
            version of these terms unless a different treatment is required by applicable law.
          </p>
        </Section>

        <Section title="2. Account and Posting">
          <p>
            Email sign-in is required to post, edit, or delete screenshots. You are responsible for managing access to
            your email account and for the screenshots you upload.
          </p>
        </Section>

        <Section title="3. Prohibited Uploads">
          <p>Do not upload screenshots or content that include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Personal information, private notifications, contacts, locations, photos, financial, health, or sensitive information.</li>
            <li>Content that infringes copyrights, trademarks, privacy rights, publicity rights, or other rights of others.</li>
            <li>Images that are not iPhone home screen or lock screen screenshots.</li>
            <li>Discriminatory, sexual, violent, unlawful, spam, abusive, or otherwise harmful content.</li>
          </ul>
        </Section>

        <Section title="4. Public Posts and AI Analysis">
          <p>
            Posts are public. Anyone with access to iSetup.app or a shared post URL may view the screenshot and extracted
            setup details. Uploaded screenshots are processed to detect apps, widgets, colors, themes, and screen type.
            Automated results may be inaccurate.
          </p>
        </Section>

        <Section title="5. Rights and Removal">
          <p>
            You keep the rights you have in your uploaded content. By uploading content, you allow iSetup.app to host,
            store, resize, analyze, display, and distribute that content as needed to operate the service.
          </p>
          <p>
            If you believe a post infringes your rights or exposes personal information, contact{' '}
            <a href="mailto:contact@isetup.app" className="text-accent hover:underline">contact@isetup.app</a> with the
            post URL and reason for the request.
          </p>
        </Section>

        <Section title="6. Apple and App Store">
          <p>
            iSetup.app is an independent service and is not affiliated with, endorsed by, or sponsored by Apple Inc.
            iPhone, iOS, App Store, and related marks are trademarks of Apple Inc. App names, icons, and metadata belong
            to their respective owners.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            Email: <a href="mailto:contact@isetup.app" className="text-accent hover:underline">contact@isetup.app</a>
          </p>
        </Section>
      </div>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="gallery-caption rounded-3xl p-4 space-y-2">
      <h2 className="text-base font-black">{title}</h2>
      <div className="text-sm leading-relaxed text-muted space-y-2">{children}</div>
    </section>
  )
}

