<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Surat Requests</h1>
			<p class="mt-2 text-gray-600">Manage letter requests and approval workflow.</p>
		</div>

		<!-- Request New Surat -->
		<div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Request New Letter</h3>
			<form @submit.prevent="requestSurat" class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Letter Type</label>
						<select 
							v-model="form.type" 
							required
							class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Select Letter Type</option>
							<option value="Domicile Letter">Domicile Letter</option>
							<option value="Permission Letter">Permission Letter</option>
							<option value="Business Permit">Business Permit</option>
							<option value="Marriage Certificate">Marriage Certificate</option>
							<option value="Death Certificate">Death Certificate</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
						<input 
							v-model="form.description"
							type="text"
							class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Additional details..."
						/>
					</div>
				</div>
				<div class="flex justify-end">
					<button 
						type="submit"
						:disabled="loading"
						class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						{{ loading ? 'Submitting...' : 'Submit Request' }}
					</button>
				</div>
			</form>
		</div>

		<!-- Status Filter -->
		<div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
			<div class="flex flex-wrap gap-2">
				<button 
					@click="filterStatus = ''"
					:class="filterStatus === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
					class="px-4 py-2 rounded-lg transition-colors duration-150"
				>
					All ({{ requests.length }})
				</button>
				<button 
					@click="filterStatus = 'pending'"
					:class="filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'"
					class="px-4 py-2 rounded-lg transition-colors duration-150"
				>
					Pending ({{ getStatusCount('pending') }})
				</button>
				<button 
					@click="filterStatus = 'rt-approved'"
					:class="filterStatus === 'rt-approved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
					class="px-4 py-2 rounded-lg transition-colors duration-150"
				>
					RT Approved ({{ getStatusCount('rt-approved') }})
				</button>
				<button 
					@click="filterStatus = 'rw-approved'"
					:class="filterStatus === 'rw-approved' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'"
					class="px-4 py-2 rounded-lg transition-colors duration-150"
				>
					RW Approved ({{ getStatusCount('rw-approved') }})
				</button>
				<button 
					@click="filterStatus = 'admin-approved'"
					:class="filterStatus === 'admin-approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'"
					class="px-4 py-2 rounded-lg transition-colors duration-150"
				>
					Approved ({{ getStatusCount('admin-approved') }})
				</button>
				<button 
					@click="filterStatus = 'rejected'"
					:class="filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'"
					class="px-4 py-2 rounded-lg transition-colors duration-150"
				>
					Rejected ({{ getStatusCount('rejected') }})
				</button>
			</div>
		</div>

		<!-- Requests List -->
		<div class="space-y-4">
			<div v-for="request in filteredRequests" :key="request.id" class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center space-x-3 mb-2">
							<h3 class="text-lg font-semibold text-gray-900">{{ request.type }}</h3>
							<span 
								:class="getStatusClass(request.status)"
								class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
							>
								{{ getStatusLabel(request.status) }}
							</span>
						</div>
						<p v-if="request.description" class="text-gray-600 mb-3">{{ request.description }}</p>
						<div class="flex items-center text-sm text-gray-500 space-x-4">
							<span>Request ID: {{ request.id }}</span>
							<span>{{ formatDate(request.createdAt) }}</span>
						</div>
					</div>
					<div class="flex space-x-2 ml-4">
						<button 
							v-if="request.status === 'pending'"
							@click="approveRt(request.id)"
							:disabled="loading"
							class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Approve RT
						</button>
						<button 
							v-if="request.status === 'rt-approved'"
							@click="approveRw(request.id)"
							:disabled="loading"
							class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Approve RW
						</button>
						<button 
							v-if="request.status === 'rw-approved'"
							@click="approveAdmin(request.id)"
							:disabled="loading"
							class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Final Approve
						</button>
						<button 
							v-if="request.status !== 'rejected' && request.status !== 'admin-approved'"
							@click="reject(request.id)"
							:disabled="loading"
							class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Reject
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="text-center py-12">
			<div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Loading requests...
			</div>
		</div>

		<!-- Error State -->
		<div v-if="error" class="text-center py-12">
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<svg class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Requests</h3>
				<p class="text-red-600">{{ error }}</p>
				<button @click="fetchRequests()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150">
					Try Again
				</button>
			</div>
		</div>

		<!-- Empty State -->
		<div v-if="!loading && !error && requests.length === 0" class="text-center py-12">
			<svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
			</svg>
			<h3 class="text-lg font-medium text-gray-900 mb-2">No Requests Found</h3>
			<p class="text-gray-600">Submit a new letter request to get started.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useSurat } from '@/composables/useSurat'
import type { SuratRequest } from '@/types'

const { requests, loading, error, fetchRequests, createRequest, approveRt, approveRw, approveAdmin, reject } = useSurat()

const filterStatus = ref('')
const form = reactive({ type: '', description: '' })

const filteredRequests = computed(() => {
	console.log('🔍 Filtering requests with status:', filterStatus.value)
	console.log('🔍 Total requests:', requests.value.length)
	console.log('🔍 All request statuses:', requests.value.map(r => r.status))
	
	if (!filterStatus.value) {
		console.log('🔍 Showing all requests')
		return requests.value
	}
	
	const filtered = requests.value.filter(r => r.status === filterStatus.value)
	console.log(`🔍 Filtered ${filtered.length} requests for status: ${filterStatus.value}`)
	return filtered
})

const getStatusCount = (status: string) => {
	const count = requests.value.filter(r => r.status === status).length
	console.log(`📊 Status count for ${status}:`, count)
	return count
}

const getStatusClass = (status: string) => {
	switch (status) {
		case 'pending': return 'bg-yellow-100 text-yellow-800'
		case 'rt-approved': return 'bg-blue-100 text-blue-800'
		case 'rw-approved': return 'bg-indigo-100 text-indigo-800'
		case 'admin-approved': return 'bg-green-100 text-green-800'
		case 'rejected': return 'bg-red-100 text-red-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

const getStatusLabel = (status: string) => {
	switch (status) {
		case 'pending': return 'Pending'
		case 'rt-approved': return 'RT Approved'
		case 'rw-approved': return 'RW Approved'
		case 'admin-approved': return 'Approved'
		case 'rejected': return 'Rejected'
		default: return status
	}
}

const formatDate = (dateString?: string) => {
	if (!dateString) return 'Unknown date'
	return new Date(dateString).toLocaleDateString('id-ID', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

const requestSurat = async () => {
	try {
		await createRequest({
			type: form.type,
			description: form.description
		})
		form.type = ''
		form.description = ''
	} catch (err) {
		console.error('Error creating request:', err)
	}
}

onMounted(() => {
	fetchRequests()
})
</script>