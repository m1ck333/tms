import { useEffect, useState, type ReactNode } from 'react'
import {
  Copy,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useOutsideClick } from '@tms/core'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  type ColumnDef,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  IconButton,
  Input,
  MultiSelect,
  NumberInput,
  RadioGroup,
  Select,
  Separator,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toaster,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tms/ui'

type Brand = 'eu' | 'us'
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

const PARTNERS = [
  { value: 'p1', label: 'Delhaize Serbia' },
  { value: 'p2', label: 'Nelt Co.' },
  { value: 'p3', label: 'Knjaz Miloš' },
  { value: 'p4', label: 'Bambi a.d.' },
  { value: 'p5', label: 'Hemofarm' },
  { value: 'p6', label: 'Tarkett' },
  { value: 'p7', label: 'Gorenje' },
]

type Vehicle = {
  plate: string
  model: string
  capacity: number
  status: string
}

const VEHICLES: Vehicle[] = [
  { plate: 'BG-123-AB', model: 'Volvo FH', capacity: 24, status: 'Active' },
  { plate: 'NS-456-CD', model: 'Scania R', capacity: 26, status: 'In service' },
  { plate: 'NI-789-EF', model: 'MAN TGX', capacity: 22, status: 'Active' },
  { plate: 'BG-321-GH', model: 'DAF XF', capacity: 25, status: 'Active' },
  { plate: 'KG-654-IJ', model: 'Renault T', capacity: 20, status: 'Idle' },
  { plate: 'SU-987-KL', model: 'Iveco S-Way', capacity: 23, status: 'Active' },
  {
    plate: 'ZR-147-MN',
    model: 'Mercedes Actros',
    capacity: 27,
    status: 'In service',
  },
  { plate: 'PA-258-OP', model: 'Volvo FM', capacity: 21, status: 'Active' },
]

const vehicleColumns: ColumnDef<Vehicle>[] = [
  { accessorKey: 'plate', header: 'Plate' },
  { accessorKey: 'model', header: 'Model' },
  { accessorKey: 'capacity', header: 'Capacity (t)' },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === 'In service' ? 'destructive' : 'secondary'
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
]

export function App() {
  const [brand, setBrand] = useState<Brand>('eu')
  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState('Belgrade')
  const [tags, setTags] = useState(['CMR', 'ADR', 'Refrigerated'])
  const [cargo, setCargo] = useState('')
  const [city, setCity] = useState('')
  const [services, setServices] = useState<string[]>(['adr'])
  const [equipment, setEquipment] = useState<string[]>([
    'adr',
    'reefer',
    'cmr',
    'express',
  ])
  const [partner, setPartner] = useState('')
  const [partnerOpts, setPartnerOpts] = useState(PARTNERS)
  const [partnerLoading, setPartnerLoading] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelWrapRef = useOutsideClick<HTMLDivElement>(
    () => setPanelOpen(false),
    panelOpen
  )
  const [weight, setWeight] = useState<number | undefined>(undefined)
  const [capacity, setCapacity] = useState<number | undefined>(24)
  const [notify, setNotify] = useState(true)
  const [toastPos, setToastPos] = useState<ToastPosition>('bottom-right')

  // Simulated server-side search: parent fetches + toggles loading.
  // (A real app would debounce and hit GraphQL/REST here.)
  const handlePartnerSearch = (query: string) => {
    setPartnerLoading(true)
    window.setTimeout(() => {
      const q = query.toLowerCase()
      setPartnerOpts(PARTNERS.filter((p) => p.label.toLowerCase().includes(q)))
      setPartnerLoading(false)
    }, 600)
  }

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
        <Section title="Overlays — dialog & sheet">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete route?</DialogTitle>
                  <DialogDescription>
                    This permanently removes the route and its stops. This
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit vehicle</SheetTitle>
                  <SheetDescription>BG-123-AB</SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <div className="grid gap-4">
                    <Input label="Plate" defaultValue="BG-123-AB" />
                    <Input label="Model" defaultValue="Volvo FH" />
                    <NumberInput
                      label="Capacity (t)"
                      value={capacity}
                      onChange={setCapacity}
                    />
                  </div>
                </SheetBody>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button>Save</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </Section>

        <Section title="DataTable — sortable, bordered, paginated (desktop)">
          <DataTable
            columns={vehicleColumns}
            data={VEHICLES}
            pageSize={5}
            onRowClick={(v) => toast(`${v.plate} — ${v.model}`)}
          />
        </Section>

        <Section title="Tabs & Table">
          <Tabs defaultValue="fleet" className="max-w-xl">
            <TabsList>
              <TabsTrigger value="fleet">Fleet</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
            </TabsList>
            <TabsContent value="fleet">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plate</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>BG-123-AB</TableCell>
                    <TableCell>Volvo FH</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NS-456-CD</TableCell>
                    <TableCell>Scania R</TableCell>
                    <TableCell>
                      <Badge variant="destructive">In service</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="drivers">
              <p className="text-muted-foreground p-2 text-sm">
                Drivers tab content…
              </p>
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Toast (sonner)">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast('Route saved.')}>
              Default
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success('Vehicle updated.')}
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error('Failed to save route.')}
            >
              Error
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast('Route deleted.', {
                  action: { label: 'Undo', onClick: () => toast('Restored.') },
                })
              }
            >
              With action
            </Button>
            <div className="w-44">
              <Select
                value={toastPos}
                onChange={(v) => setToastPos(v as ToastPosition)}
                options={[
                  { value: 'top-left', label: 'top-left' },
                  { value: 'top-center', label: 'top-center' },
                  { value: 'top-right', label: 'top-right' },
                  { value: 'bottom-left', label: 'bottom-left' },
                  { value: 'bottom-center', label: 'bottom-center' },
                  { value: 'bottom-right', label: 'bottom-right' },
                ]}
              />
            </div>
          </div>
        </Section>

        <Section title="Tooltip & DropdownMenu">
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  icon={<Plus />}
                  variant="outline"
                  aria-label="Add stop"
                />
              </TooltipTrigger>
              <TooltipContent>Add stop</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  icon={<MoreHorizontal />}
                  variant="outline"
                  aria-label="Actions"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Route actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Pencil /> Edit
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={notify}
                  onCheckedChange={setNotify}
                >
                  Notify driver
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Section>

        <Section title="Hook — useOutsideClick (@tms/core)">
          <div ref={panelWrapRef} className="relative inline-block">
            <Button variant="outline" onClick={() => setPanelOpen((o) => !o)}>
              Toggle panel
            </Button>
            {panelOpen && (
              <div className="bg-popover text-popover-foreground z-popover absolute mt-2 w-64 rounded-md border p-3 text-sm shadow-md">
                A custom (non-Radix) panel. Click anywhere outside to close it —
                that's <code>useOutsideClick</code> from <code>@tms/core</code>.
              </div>
            )}
          </div>
        </Section>

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

        <Section title="Button — icons, loading, sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button prefixIcon={<Plus />}>Add stop</Button>
            <Button variant="outline" suffixIcon={<Search />}>
              Search
            </Button>
            <Button loading>Saving</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <IconButton icon={<Plus />} aria-label="Add" />
            <IconButton
              icon={<Trash2 />}
              variant="destructive"
              aria-label="Delete"
            />
            <IconButton
              icon={<Search />}
              variant="outline"
              size="sm"
              aria-label="Search"
            />
          </div>
        </Section>

        <Section title="Inputs — label, hint, error, required, clear, password">
          <div className="grid max-w-sm gap-4">
            <Input
              label="Email"
              required
              type="email"
              placeholder="driver@example.com"
              prefixIcon={<Mail />}
            />
            <Input
              label="Phone"
              helperText="Include country code, e.g. +381."
              placeholder="+381 ..."
            />
            <Input
              label="PIB"
              error="PIB must be 9 digits."
              defaultValue="123"
            />
            <Input
              label="Search"
              clearable
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              prefixIcon={<Search />}
            />
            <Input label="Password" type="password" placeholder="••••••••" />
            <NumberInput
              label="Weight (kg)"
              value={weight}
              onChange={setWeight}
              placeholder="Empty by default"
              helperText="Starts empty, clears to empty — no zombie zero."
            />
            <Textarea
              label="Note"
              helperText="Optional."
              placeholder="Anything worth noting…"
            />
          </div>
        </Section>

        <Section title="Selection — checkbox, switch, radio">
          <div className="grid max-w-sm gap-5">
            <Checkbox
              label="I agree"
              description="Accept the terms of service."
              defaultChecked
            />
            <Switch
              label="Email notifications"
              description="Get notified about expiring documents."
            />
            <RadioGroup
              label="Cargo type"
              defaultValue="general"
              options={[
                { value: 'general', label: 'General' },
                { value: 'adr', label: 'ADR', description: 'Dangerous goods.' },
                { value: 'reefer', label: 'Refrigerated' },
                {
                  value: 'tanker',
                  label: 'Tanker (unavailable)',
                  disabled: true,
                },
              ]}
            />
            <div className="flex flex-col gap-4 border-t pt-4">
              <Checkbox label="Disabled checkbox" disabled defaultChecked />
              <Switch label="Disabled switch" disabled />
              <Input
                label="Disabled input"
                placeholder="Can't type here"
                disabled
              />
            </div>
          </div>
        </Section>

        <Section title="Select — single, clearable, searchable">
          <div className="grid max-w-sm gap-4">
            <Select
              label="Cargo type"
              required
              clearable
              value={cargo}
              onChange={setCargo}
              placeholder="Choose cargo…"
              options={[
                { value: 'general', label: 'General' },
                { value: 'adr', label: 'ADR (dangerous goods)' },
                { value: 'reefer', label: 'Refrigerated' },
                { value: 'oversized', label: 'Oversized' },
              ]}
            />
            <Select
              label="Destination city"
              searchable
              clearable
              value={city}
              onChange={setCity}
              placeholder="Search a city…"
              helperText="Searchable (local filter). Pass onSearch for server-side."
              options={[
                { value: 'bg', label: 'Belgrade' },
                { value: 'ns', label: 'Novi Sad' },
                { value: 'nis', label: 'Niš' },
                { value: 'muc', label: 'Munich' },
                { value: 'vie', label: 'Vienna' },
                { value: 'zag', label: 'Zagreb' },
                { value: 'lju', label: 'Ljubljana' },
              ]}
            />
            <Select
              label="Partner (server search)"
              searchable
              clearable
              value={partner}
              onChange={setPartner}
              options={partnerOpts}
              onSearch={handlePartnerSearch}
              loading={partnerLoading}
              placeholder="Type to search…"
              helperText="onSearch is set → server-side; shows a loading spinner."
            />
            <Select
              label="Disabled select"
              disabled
              placeholder="Unavailable"
              options={[{ value: 'x', label: 'X' }]}
            />
          </div>
        </Section>

        <Section title="MultiSelect — chips, searchable">
          <div className="grid max-w-sm gap-4">
            <MultiSelect
              label="Services"
              searchable
              value={services}
              onChange={setServices}
              placeholder="Add services…"
              helperText="Selected items show as removable chips."
              options={[
                { value: 'adr', label: 'ADR' },
                { value: 'reefer', label: 'Refrigerated' },
                { value: 'cmr', label: 'CMR insurance' },
                { value: 'oversized', label: 'Oversized' },
                { value: 'express', label: 'Express' },
                { value: 'customs', label: 'Customs clearance' },
              ]}
            />
            <MultiSelect
              label="Equipment (single row, responsive +N)"
              singleRow
              value={equipment}
              onChange={setEquipment}
              placeholder="Add equipment…"
              helperText="singleRow → fits as many chips as the width allows, rest collapse to +N (resize to see)."
              options={[
                { value: 'adr', label: 'ADR' },
                { value: 'reefer', label: 'Refrigerated' },
                { value: 'cmr', label: 'CMR insurance' },
                { value: 'oversized', label: 'Oversized' },
                { value: 'express', label: 'Express' },
                { value: 'customs', label: 'Customs clearance' },
              ]}
            />
          </div>
        </Section>

        <Section title="Badge — variants & closeable">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
              >
                {tag}
              </Badge>
            ))}
            {tags.length === 0 && (
              <span className="text-muted-foreground text-sm">
                All removed — refresh to reset.
              </span>
            )}
          </div>
        </Section>

        <Section title="Card">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Vehicle</CardTitle>
              <CardDescription>Truck · BG-123-AB</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Card content sits on the shared neutral palette; only the brand
                color changes.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Open</Button>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </CardFooter>
          </Card>
        </Section>

        <Section title="Separator">
          <div className="max-w-sm">
            <p className="text-sm">Above</p>
            <Separator className="my-3" />
            <p className="text-sm">Below</p>
          </div>
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
            <Swatch
              name="accent"
              className="bg-accent text-accent-foreground"
            />
            <Swatch name="muted" className="bg-muted text-muted-foreground" />
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

      <Toaster richColors position={toastPos} />
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
