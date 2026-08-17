# Core UI Components

## Card

`	sx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer action</CardFooter>
</Card>
`

Variants: default, interactive (hover shadow), featured (border accent)

## Table

`	sx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
`

Features: sorting, filtering, pagination, row selection, empty state

## Modal / Dialog

- Trigger: Button atau element lain
- Overlay dengan blur background
- Close on escape key
- Close on overlay click
- Sizes: sm, md, lg, xl, fullscreen
- Animation: fade + scale

## Drawer

- Side panel (right by default, configurable)
- Untuk form atau detail view
- Close on escape
- Sizes: sm (400px), md (600px), lg (800px)

## Wizard / Stepper

Multi-step form component:
- Steps dengan indicator
- Previous / Next navigation
- Validation per step
- Summary step sebelum submit

## Empty State

`	sx
<EmptyState
  icon={Package}
  title="No packages yet"
  description="Create your first package to get started"
  action={<Button>Create Package</Button>}
/>
`

## Loading State

- Skeleton component untuk card, table, form
- Spinner untuk button actions
- Progress bar untuk file upload

## Error State

`	sx
<ErrorState
  title="Something went wrong"
  description="Please try again"
  action={<Button onClick={retry}>Retry</Button>}
/>
`

Global error boundary di layout level.
