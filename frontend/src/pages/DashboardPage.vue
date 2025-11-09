<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
			<p class="mt-2 text-gray-600">Welcome back! Here's what's happening in your community.</p>
		</div>

		<!-- Overview Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Residents</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{{ totals.residents }}</p>
						<p class="text-sm text-green-600 mt-1">+{{ totals.residentsThisMonth }} this month</p>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Pending Requests</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{{ totals.pendingRequests }}</p>
						<p class="text-sm text-yellow-600 mt-1">Needs attention</p>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active RTs</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{{ totals.activeRTs }}</p>
						<p class="text-sm text-green-600 mt-1">All operational</p>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Unpaid Iuran</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{{ totals.unpaidIuran }}</p>
						<p class="text-sm text-red-600 mt-1">Overdue payments</p>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Charts Section -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">Monthly Iuran Collection</h3>
					<button class="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
				</div>
				<div class="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
					<div class="text-center">
						<svg class="h-16 w-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						<p class="text-gray-500">Chart visualization coming soon</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">Request Trends</h3>
					<button class="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
				</div>
				<div class="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
					<div class="text-center">
						<svg class="h-16 w-16 text-green-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
						</svg>
						<p class="text-gray-500">Trend analysis coming soon</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="bg-white rounded-xl shadow-lg border border-gray-100">
			<div class="px-6 py-4 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
			</div>
			<div class="p-6">
				<div class="space-y-4">
					<div class="flex items-center space-x-3">
						<div class="h-2 w-2 bg-green-500 rounded-full"></div>
						<p class="text-sm text-gray-600">New resident <span class="font-medium">Andi Susanto</span> registered</p>
						<span class="text-xs text-gray-400">2 hours ago</span>
					</div>
					<div class="flex items-center space-x-3">
						<div class="h-2 w-2 bg-blue-500 rounded-full"></div>
						<p class="text-sm text-gray-600">Announcement <span class="font-medium">"Gotong Royong Minggu"</span> published</p>
						<span class="text-xs text-gray-400">4 hours ago</span>
					</div>
					<div class="flex items-center space-x-3">
						<div class="h-2 w-2 bg-yellow-500 rounded-full"></div>
						<p class="text-sm text-gray-600">Surat request <span class="font-medium">"Domicile Letter"</span> pending approval</p>
						<span class="text-xs text-gray-400">6 hours ago</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useResidents } from '@/composables/useResidents'
import { useSurat } from '@/composables/useSurat'
import { useIuran } from '@/composables/useIuran'

const { residents, fetchResidents } = useResidents()
const { requests, fetchRequests } = useSurat()
const { summary, fetchSummary } = useIuran()

const totals = reactive({
	residents: 0,
	pendingRequests: 0,
	activeRTs: 9,
	unpaidIuran: 0,
	residentsThisMonth: 0,
	families: 0,
	familyMembers: 0,
})

onMounted(async () => {
	await Promise.all([
		fetchResidents(),
		fetchRequests(),
		fetchSummary()
	])
	
	// Update totals with real data
	totals.residents = residents.value.length
	totals.pendingRequests = requests.value.filter(r => r.status === 'pending').length
	totals.unpaidIuran = summary.value.unpaidCount
	
	// Calculate active RTs from database
	const uniqueRTs = new Set(residents.value.map(r => r.rtId).filter(rtId => rtId))
	totals.activeRTs = uniqueRTs.size
	
	// Calculate family statistics (simplified - all residents are individuals)
	totals.families = residents.value.length
	totals.familyMembers = 0
	
	// Calculate residents added this month (Indonesia timezone UTC+7)
	const getIndonesiaTime = (date = new Date()) => {
		// Indonesia is UTC+7
		return new Date(date.getTime() + (7 * 60 * 60 * 1000))
	}
	
	const indonesiaNow = getIndonesiaTime()
	const currentMonth = indonesiaNow.getMonth()
	const currentYear = indonesiaNow.getFullYear()
	
	totals.residentsThisMonth = residents.value.filter(r => {
		if (!r.createdAt) return false
		const createdDate = new Date(r.createdAt)
		const indonesiaCreatedDate = getIndonesiaTime(createdDate)
		
		return indonesiaCreatedDate.getMonth() === currentMonth && indonesiaCreatedDate.getFullYear() === currentYear
	}).length
})
</script>
