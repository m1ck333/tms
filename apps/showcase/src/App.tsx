import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@tms/ui/primitives'

type Brand = 'eu' | 'us'

export function App() {
  const [brand, setBrand] = useState<Brand>('eu')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.brand = brand
  }, [brand])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center gap-3 border-b px-6 py-4">
        <h1 className="mr-auto text-lg font-semibold">@tms/ui showcase</h1>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={brand === 'eu' ? 'default' : 'outline'}
            onClick={() => setBrand('eu')}
          >
            EU
          </Button>
          <Button
            size="sm"
            variant={brand === 'us' ? 'default' : 'outline'}
            onClick={() => setBrand('us')}
          >
            US
          </Button>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? 'Light' : 'Dark'}
        </Button>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 p-6">
        <Section title="Button — variants">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </Section>

        <Section title="Button — sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Button — disabled">
          <Button disabled>Disabled</Button>
        </Section>

        <Section title="Tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Swatch
              name="primary"
              className="bg-primary text-primary-foreground"
            />
            <Swatch
              name="secondary"
              className="bg-secondary text-secondary-foreground"
            />
            <Swatch name="muted" className="bg-muted text-muted-foreground" />
            <Swatch
              name="accent"
              className="bg-accent text-accent-foreground"
            />
            <Swatch
              name="destructive"
              className="bg-destructive text-destructive-foreground"
            />
            <Swatch
              name="card"
              className="bg-card text-card-foreground border"
            />
          </div>
        </Section>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-muted-foreground text-sm font-medium">{title}</h2>
      {children}
    </section>
  )
}

function Swatch({
  name,
  className = '',
}: {
  name: string
  className?: string
}) {
  return (
    <div
      className={`flex h-16 items-center justify-center rounded-md text-xs font-medium ${className}`}
    >
      {name}
    </div>
  )
}
