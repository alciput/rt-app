<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Residents Management</h1>
			<p class="mt-2 text-gray-600">Manage community residents and their information.</p>
		</div>

		<!-- Filters and Actions -->
		<div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2">Search by house number</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						<input 
							v-model="filters.house" 
							type="text" 
							class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
							placeholder="e.g. A-12" 
						/>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
					<select v-model="filters.status" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">All Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
					<select v-model="filters.role" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">All Roles</option>
						<option value="Owner">Owner</option>
						<option value="Contract">Contract</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Family</label>
					<select v-model="filters.family" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">All Family Types</option>
						<option value="head">Family Heads</option>
						<option value="member">Family Members</option>
					</select>
				</div>
			</div>
			<div class="mt-4 flex justify-between items-center">
				<div class="text-sm text-gray-500">
					Showing {{ filteredResidents.length }} of {{ residents.length }} residents
					<span class="ml-2 text-blue-600">(Update trigger: {{ updateTrigger }})</span>
				</div>
				<div class="flex space-x-3">
					<button 
						@click="exportToCSV"
						class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						<span>Export CSV</span>
					</button>
					<button 
						@click="triggerFileImport"
						class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
						</svg>
						<span>Import CSV</span>
					</button>
					<button 
						@click="showAddModal = true"
						class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						<span>Add Resident</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Add Resident Modal -->
		<AddResidentModal 
			:is-open="showAddModal" 
			@close="() => { console.log('Close event received'); showAddModal = false }"
			@success="handleResidentAdded"
		/>

		<!-- Edit Resident Modal -->
		<EditResidentModal 
			v-if="selectedResident"
			:key="selectedResident.id"
			:is-open="showEditModal" 
			:resident="selectedResident"
			@close="showEditModal = false"
			@success="handleResidentUpdated"
		/>

		<!-- CSV Import Modal -->
		<CSVImportModal 
			:is-open="showImportModal" 
			@close="showImportModal = false"
			@import="handleCSVImport"
			ref="csvImportModal"
		/>


		<!-- Residents Table -->
		<div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="resident in filteredResidents" :key="`${resident.id}-${resident.updatedAt}-${updateTrigger}`" class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="h-12 w-12 flex-shrink-0">
										<div v-if="resident.ktpFile && resident.ktpFile.startsWith('data:image/')" class="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
											<img 
												:src="resident.ktpFile" 
												:alt="resident.name"
												class="h-full w-full object-cover"
											/>
										</div>
										<div v-else class="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200">
											<span class="text-sm font-medium text-white">{{ resident.name.charAt(0) }}</span>
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">{{ resident.name }}</div>
										<div class="text-sm text-gray-500">ID: {{ resident.id }}</div>
										<div v-if="resident.ktpFile && !resident.ktpFile.startsWith('data:image/')" class="text-xs text-gray-400">
											📄 {{ resident.ktpFile }}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ resident.house }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div v-if="resident.familyId" class="text-sm text-gray-600">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
										👥 Family Member
									</span>
									<div class="text-xs text-gray-500 mt-1">
										{{ resident.relationship || 'Member' }} • Age: {{ resident.age || 'N/A' }}
									</div>
								</div>
								<div v-else class="text-sm text-gray-600">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										👑 Family Head
									</span>
									<div class="text-xs text-gray-500 mt-1">
										{{ getFamilyMembersCount(resident.id) }} member(s)
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span 
									:class="resident.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
									class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
								>
									{{ resident.status }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span 
									:class="getRoleColor(resident.role)"
									class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
								>
									{{ resident.role }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<div class="flex space-x-2">
									<button 
										@click="editResident(resident)"
										class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-150"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
										</svg>
									</button>
									<button 
										@click="deleteResident(resident.id)"
										class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
										</svg>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="text-center py-12">
			<div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Loading residents...
			</div>
		</div>

		<!-- Error State -->
		<div v-if="error" class="text-center py-12">
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<svg class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Residents</h3>
				<p class="text-red-600">{{ error }}</p>
				<button @click="fetchResidents()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150">
					Try Again
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { useResidents } from '@/composables/useResidents'
import AddResidentModal from '@/components/admin/AddResidentModal.vue'
import EditResidentModal from '@/components/admin/EditResidentModal.vue'
import CSVImportModal from '@/components/admin/CSVImportModal.vue'
import { exportResidentsToCSV, downloadCSV, parseCSVToResidents, validateCSVResident } from '@/utils/csv'
import type { Resident } from '@/types'

const { residents, loading, error, fetchResidents, deleteResident: deleteResidentApi } = useResidents()

const filters = reactive({ house: '', status: '', role: '', family: '' })
const showAddModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const selectedResident = ref<Resident | null>(null)
const updateTrigger = ref(0)
const csvImportModal = ref<InstanceType<typeof CSVImportModal> | null>(null)

const filteredResidents = computed(() => 
	residents.value.filter(r => {
		const f1 = !filters.house || r.house.toLowerCase().includes(filters.house.toLowerCase())
		const f2 = !filters.status || r.status === (filters.status as any)
		const f3 = !filters.role || r.role === (filters.role as any)
		const f4 = !filters.family || 
			(filters.family === 'head' && !r.familyId) || 
			(filters.family === 'member' && r.familyId)
		return f1 && f2 && f3 && f4
	})
)

const getRoleColor = (role: string) => {
	switch (role) {
		case 'Owner': return 'bg-purple-100 text-purple-800'
		case 'Contract': return 'bg-blue-100 text-blue-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

const getFamilyMembersCount = (residentId: string) => {
	return residents.value.filter(r => r.familyId === residentId).length
}

function editResident(resident: Resident) {
	console.log('ResidentsPage: Edit resident clicked:', resident)
	// Create a clean copy of the resident object to avoid Proxy issues
	const cleanResident = {
		id: resident.id,
		name: resident.name,
		house: resident.house,
		cluster: resident.cluster,
		blok: resident.blok,
		nikKtp: resident.nikKtp,
		ktpFile: resident.ktpFile,
		status: resident.status,
		role: resident.role,
		rtId: resident.rtId,
		rwId: resident.rwId,
		createdAt: resident.createdAt,
		updatedAt: resident.updatedAt
	}
	selectedResident.value = cleanResident
	console.log('ResidentsPage: Selected resident set to:', selectedResident.value)
	showEditModal.value = true
	console.log('ResidentsPage: Edit modal opened')
}

async function deleteResident(id: string) {
	if (confirm('Are you sure you want to delete this resident?')) {
		try {
			await deleteResidentApi(id)
		} catch (err) {
			console.error('Error deleting resident:', err)
		}
	}
}

function handleResidentAdded(resident: Resident) {
	// The resident is already added to the list by the composable
	// We can show a success message or do any additional handling here
	console.log('Resident added successfully:', resident)
}

function handleResidentUpdated(resident: Resident) {
	// The resident is already updated in the list by the composable
	console.log('Resident updated successfully:', resident)
	// Force refresh the residents list to ensure UI is updated
	console.log('Forcing refresh of residents data')
	updateTrigger.value++
	fetchResidents().then(() => {
		console.log('Residents refreshed, current count:', residents.value.length)
		// Log family relationships for debugging
		const familyHeads = residents.value.filter(r => !r.familyId)
		const familyMembers = residents.value.filter(r => r.familyId)
		console.log('Family heads:', familyHeads.length)
		console.log('Family members:', familyMembers.length)
		console.log('Family members with relationships:', familyMembers.map(m => ({ name: m.name, relationship: m.relationship, familyId: m.familyId })))
	})
}



onMounted(() => {
	fetchResidents()
})


// Watch for changes in residents array
watch(() => residents.value, (newResidents) => {
	console.log('Residents array updated:', newResidents.length, 'residents')
}, { deep: true })

// CSV Export function
const exportToCSV = () => {
	try {
		const csvContent = exportResidentsToCSV(residents.value)
		const timestamp = new Date().toISOString().split('T')[0]
		downloadCSV(csvContent, `residents_${timestamp}.csv`)
		console.log('CSV exported successfully')
	} catch (error) {
		console.error('Error exporting CSV:', error)
		alert('Failed to export CSV. Please try again.')
	}
}

// CSV Import functions
const triggerFileImport = () => {
	showImportModal.value = true
}

const handleCSVImport = async (file: File) => {
	try {
		console.log('Starting CSV import for file:', file.name)
		const fileContent = await readFileContent(file)
		const csvResidents = parseCSVToResidents(fileContent)
		
		console.log('Parsed CSV residents:', csvResidents.length)
		
		// Validate each resident
		const validationErrors: string[] = []
		csvResidents.forEach((resident, index) => {
			const errors = validateCSVResident(resident)
			if (errors.length > 0) {
				validationErrors.push(`Row ${index + 2}: ${errors.join(', ')}`)
			}
		})
		
		if (validationErrors.length > 0) {
			alert(`CSV validation errors:\n${validationErrors.join('\n')}`)
			return
		}
		
		console.log('Validation passed, starting import...')
		// Import residents
		const results = await importResidents(csvResidents)
		console.log('Import results:', results)
		
		// Update modal with results
		if (csvImportModal.value) {
			csvImportModal.value.setImportResults(results)
		}
		
	} catch (error) {
		console.error('Error importing CSV:', error)
		alert(`Failed to import CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

const readFileContent = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			resolve(e.target?.result as string)
		}
		reader.onerror = () => {
			reject(new Error('Failed to read file'))
		}
		reader.readAsText(file)
	})
}

const importResidents = async (csvResidents: any[]) => {
	const { createResident, updateResident } = useResidents()
	
	let successCount = 0
	let errorCount = 0
	
	// Process all residents first
	for (const csvResident of csvResidents) {
		try {
			const residentData = {
				name: csvResident.name,
				house: csvResident.house,
				cluster: csvResident.cluster as 'Alium' | 'Boulevard',
				blok: csvResident.blok,
				nikKtp: csvResident.nikKtp,
				ktpFile: csvResident.ktpFile,
				status: csvResident.status as 'active' | 'inactive',
				role: csvResident.role as 'Contract' | 'Owner',
				rtId: csvResident.rt || 'rt1',
				rwId: csvResident.rw || 'rw1',
				familyId: csvResident.familyId,
				relationship: csvResident.relationship,
				age: csvResident.age,
			}

			// Smart upsert logic
			if (csvResident.id && csvResident.id.trim() !== '') {
				// Check if resident with this ID already exists
				const existingResident = residents.value.find(r => r.id === csvResident.id)
				if (existingResident) {
					// Update existing resident
					await updateResident(csvResident.id, residentData)
					console.log(`Updated resident with ID: ${csvResident.id}`)
				} else {
					// Create new resident with specified ID
					await createResident({ ...residentData, id: csvResident.id })
					console.log(`Created new resident: ${csvResident.name} with ID: ${csvResident.id}`)
				}
			} else {
				// Create new resident with auto-generated ID
				await createResident(residentData)
				console.log(`Created new resident: ${csvResident.name} with auto-generated ID`)
			}
			successCount++
		} catch (error) {
			console.error('Error processing resident:', error)
			errorCount++
		}
	}
	
	// Only refresh once at the end
	console.log('Import completed, refreshing residents list...')
	await fetchResidents()
	console.log('Residents list refreshed')
	
	return { success: successCount, errors: errorCount }
}
</script>
