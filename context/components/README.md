# Admin Components Documentation

This directory contains reusable Vue components for the RT/RW management application admin interface.

## Components Overview

### OverviewCards.vue
**Purpose**: Display key metrics and statistics in a card layout.

**Props**:
- `totals` (Object): Contains residents, pendingRequests, activeRTs, unpaidIuran counts

**Usage**:
```vue
<OverviewCards :totals="{ residents: 128, pendingRequests: 6, activeRTs: 9, unpaidIuran: 23 }" />
```

### ResidentTable.vue
**Purpose**: Display and manage residents with filtering and CRUD operations.

**Props**:
- `residents` (Array): List of resident objects
- `loading` (Boolean, optional): Loading state
- `error` (String, optional): Error message
- `canCreate` (Boolean, optional): Show create button
- `canEdit` (Boolean, optional): Show edit actions
- `canDelete` (Boolean, optional): Show delete actions

**Events**:
- `create`: Emitted when create button is clicked
- `edit`: Emitted with resident object when edit is clicked
- `delete`: Emitted with resident ID when delete is clicked

**Usage**:
```vue
<ResidentTable 
  :residents="residents" 
  :loading="loading"
  :can-delete="userRole === 'Admin'"
  @create="handleCreate"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

### AnnouncementCard.vue
**Purpose**: Display individual announcement with edit/delete actions.

**Props**:
- `announcement` (Object): Announcement data
- `canEdit` (Boolean, optional): Show edit button
- `canDelete` (Boolean, optional): Show delete button
- `authors` (Object, optional): Author ID to name mapping

**Events**:
- `edit`: Emitted with announcement object
- `delete`: Emitted with announcement ID

**Usage**:
```vue
<AnnouncementCard 
  :announcement="announcement"
  :can-edit="canEditAnnouncement(announcement)"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

### IuranSummary.vue
**Purpose**: Display payment summary with filtering options.

**Props**:
- `summary` (Object): Payment summary data with total, paidCount, unpaidCount, totalCount

**Events**:
- `filter`: Emitted with filter object when filters are applied

**Usage**:
```vue
<IuranSummary 
  :summary="paymentSummary"
  @filter="handleFilter"
/>
```

### SuratRequestCard.vue
**Purpose**: Display surat request with approval workflow actions.

**Props**:
- `request` (Object): Surat request data
- `canApprove` (Boolean, optional): Show approval buttons
- `canApproveRt` (Boolean, optional): Show RT approval button
- `canApproveRw` (Boolean, optional): Show RW approval button
- `canApproveAdmin` (Boolean, optional): Show Admin approval button
- `canReject` (Boolean, optional): Show reject button

**Events**:
- `approve-rt`: Emitted with request ID
- `approve-rw`: Emitted with request ID
- `approve-admin`: Emitted with request ID
- `reject`: Emitted with request ID

**Usage**:
```vue
<SuratRequestCard 
  :request="request"
  :can-approve-rt="userRole === 'Ketua RT'"
  :can-approve-rw="userRole === 'Ketua RW'"
  :can-approve-admin="userRole === 'Admin'"
  @approve-rt="handleApproveRt"
  @approve-rw="handleApproveRw"
  @approve-admin="handleApproveAdmin"
  @reject="handleReject"
/>
```

## Design Principles

1. **Self-contained**: Each component manages its own state and styling
2. **Reusable**: Components accept props for customization
3. **Accessible**: Proper ARIA labels and keyboard navigation
4. **Responsive**: Mobile-first design with TailwindCSS
5. **Type-safe**: Full TypeScript support with proper interfaces

## Styling

All components use TailwindCSS utility classes for consistent styling:
- Consistent spacing and typography
- Hover states for interactive elements
- Color-coded status indicators
- Responsive grid layouts
- Loading and error states

## Integration

Components are designed to work with the composables in `src/composables/`:
- `useResidents()` for resident management
- `useAnnouncements()` for announcement management
- `useIuran()` for payment management
- `useSurat()` for surat request management
