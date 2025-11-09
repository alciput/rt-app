<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Iuran Management</h1>
			<p class="mt-2 text-gray-600">Manage monthly family contributions and payment tracking.</p>
		</div>

		<!-- Summary Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-600">Total Collected</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">Rp {{ formatCurrency(summary.total) }}</p>
						<div class="mt-2 space-y-1">
							<p class="text-sm text-green-600">{{ summary.paidCount }} payments</p>
							<div v-if="filters.month || filters.year" class="text-xs text-gray-500">
								<span v-if="filters.month">{{ getMonthName(filters.month) }}</span>
								<span v-if="filters.month && filters.year">, </span>
								<span v-if="filters.year">{{ filters.year }}</span>
							</div>
							<div v-else class="text-xs text-gray-500">All time</div>
						</div>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-600">Paid</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{{ summary.paidCount }}</p>
						<div class="mt-2 space-y-1">
							<p class="text-sm text-green-600">Completed</p>
							<div v-if="summary.totalCount > 0" class="text-xs text-gray-500">
								{{ Math.round((summary.paidCount / summary.totalCount) * 100) }}% completion rate
							</div>
						</div>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-600">Unpaid</p>
						<p class="text-3xl font-bold text-gray-900 mt-2">{{ summary.unpaidCount }}</p>
						<div class="mt-2 space-y-1">
							<p class="text-sm text-red-600">Pending</p>
							<div v-if="summary.totalCount > 0" class="text-xs text-gray-500">
								{{ Math.round((summary.unpaidCount / summary.totalCount) * 100) }}% pending rate
							</div>
						</div>
					</div>
					<div class="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Filters and Actions -->
		<div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
			<div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
					<select v-model="filters.month" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">All Months</option>
						<option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
					<select v-model="filters.year" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">All Years</option>
						<option v-for="year in years" :key="year" :value="year">{{ year }}</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
					<select v-model="filters.paid" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">All Status</option>
						<option value="true">Paid</option>
						<option value="false">Unpaid</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Quick Filter</label>
					<select v-model="quickFilter" @change="applyQuickFilter" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						<option value="">Custom Filter</option>
						<option value="this-month">This Month</option>
						<option value="last-month">Last Month</option>
						<option value="this-quarter">This Quarter</option>
						<option value="last-quarter">Last Quarter</option>
						<option value="this-year">This Year</option>
						<option value="last-year">Last Year</option>
					</select>
				</div>
				<div class="flex gap-2">
					<button 
						@click="applyFilters"
						class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
					>
						Apply
					</button>
					<button 
						@click="clearFilters"
						class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-150"
					>
						Clear
					</button>
				</div>
			</div>
			<div class="mt-4 flex justify-between items-center">
				<div class="text-sm text-gray-500">
					Showing {{ filteredPayments.length }} of {{ payments.length }} payments
				</div>
				<div class="flex space-x-3">
					<button 
						@click="handleExport"
						class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						<span>Export CSV</span>
					</button>
					<button 
						@click="showImportModal = true"
						class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						<span>Add Family Payment</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Add Payment Modal -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
				<!-- Backdrop -->
				<div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
				
				<!-- Modal Container -->
				<div class="flex min-h-full items-center justify-center p-4">
					<div class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
						<!-- Header -->
						<div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
										<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
										</svg>
									</div>
									<div>
										<h3 class="text-lg font-semibold text-white">Add Family Payment</h3>
										<p class="text-sm text-blue-100">Record monthly contribution</p>
									</div>
								</div>
								<button 
									@click="closeModal"
									class="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors duration-200"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>
						</div>

						<!-- Form Content -->
						<form @submit.prevent="addPayment" class="p-6 space-y-6">
							<!-- Resident Selection -->
							<div class="space-y-2">
								<label class="block text-sm font-medium text-gray-700">
									Family Head
									<span class="text-red-500">*</span>
								</label>
								<div class="relative">
									<select
										v-model="form.residentId"
										required
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
									>
										<option value="">Choose a family head...</option>
										<option v-for="resident in familyHeads" :key="resident.id" :value="resident.id">
											{{ resident.name }} ({{ resident.house }})
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
										</svg>
									</div>
								</div>
							</div>

							<!-- Month and Year -->
							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700">
										Month
										<span class="text-red-500">*</span>
									</label>
									<select
										v-model="form.month"
										required
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
									>
										<option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
									</select>
								</div>
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700">
										Year
										<span class="text-red-500">*</span>
									</label>
									<select
										v-model="form.year"
										required
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
									>
										<option v-for="year in years" :key="year" :value="year">{{ year }}</option>
									</select>
								</div>
							</div>

							<!-- Amount -->
							<div class="space-y-2">
								<label class="block text-sm font-medium text-gray-700">
									Amount (Rp)
									<span class="text-red-500">*</span>
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<span class="text-gray-500 sm:text-sm">Rp</span>
									</div>
									<input
										v-model="form.amount"
										type="number"
										required
										class="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
										placeholder="100000"
									/>
								</div>
							</div>

							<!-- Payment Status -->
							<div class="space-y-2">
								<label class="block text-sm font-medium text-gray-700">Payment Status</label>
								<div class="flex space-x-4">
									<label class="flex items-center">
										<input
											v-model="form.paid"
											type="radio"
											:value="false"
											class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
										/>
										<span class="ml-2 text-sm text-gray-700">Unpaid</span>
									</label>
									<label class="flex items-center">
										<input
											v-model="form.paid"
											type="radio"
											:value="true"
											class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
										/>
										<span class="ml-2 text-sm text-gray-700">Paid</span>
									</label>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="flex space-x-3 pt-4">
								<button
									type="button"
									@click="closeModal"
									class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
								>
									Cancel
								</button>
								<button
									type="submit"
									:disabled="loading"
									class="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
								>
									<svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
									</svg>
									<span>{{ loading ? 'Adding...' : 'Add Payment' }}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Edit Payment Modal -->
		<div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeEditModal"></div>
				<div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<form @submit.prevent="updatePaymentData">
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
									<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
									</svg>
								</div>
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
									<h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Family Payment</h3>
									<div class="space-y-4">
										<div>
											<label class="block text-sm font-medium text-gray-700">Family Head</label>
											<select
												v-model="form.residentId"
												required
												class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											>
												<option value="">Select Family Head</option>
												<option v-for="resident in familyHeads" :key="resident.id" :value="resident.id">
													{{ resident.name }} ({{ resident.house }}) - Family Head
												</option>
											</select>
										</div>
										<div class="grid grid-cols-2 gap-4">
											<div>
												<label class="block text-sm font-medium text-gray-700">Month</label>
												<select
													v-model="form.month"
													required
													class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												>
													<option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
												</select>
											</div>
											<div>
												<label class="block text-sm font-medium text-gray-700">Year</label>
												<select
													v-model="form.year"
													required
													class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												>
													<option v-for="year in years" :key="year" :value="year">{{ year }}</option>
												</select>
											</div>
										</div>
										<div>
											<label class="block text-sm font-medium text-gray-700">Amount (Rp)</label>
											<input
												v-model="form.amount"
												type="number"
												required
												class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="100000"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button
								type="submit"
								:disabled="loading"
								class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								{{ loading ? 'Updating...' : 'Update Family Payment' }}
							</button>
							<button
								type="button"
								@click="closeEditModal"
								class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<!-- CSV Import Modal -->
		<IuranCSVImportModal 
			:is-open="showImportModal" 
			@close="showImportModal = false"
			@import="handleCSVImport"
		/>

		<!-- Payments Table -->
		<div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family Head</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="h-10 w-10 flex-shrink-0">
										<div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
											<span class="text-sm font-medium text-white">{{ getResidentName(payment.residentId).charAt(0) }}</span>
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">{{ getResidentName(payment.residentId) }}</div>
										<div class="text-sm text-gray-500">{{ getResidentHouse(payment.residentId) }}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ getMonthName(payment.month) }} {{ payment.year }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">Rp {{ formatCurrency(payment.amount) }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span 
									:class="payment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
									class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
								>
									{{ payment.paid ? 'Paid' : 'Unpaid' }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<div class="flex space-x-2">
									<button 
										v-if="!payment.paid"
										@click="markAsPaid(payment.id)"
										class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-150"
										title="Mark as Paid"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
									</button>
									<button 
										@click="editPayment(payment)"
										class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-150"
										title="Edit Payment"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
										</svg>
									</button>
									<button 
										@click="deletePaymentData(payment.id)"
										class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
										title="Delete Payment"
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
				Loading payments...
			</div>
		</div>

		<!-- Error State -->
		<div v-if="error" class="text-center py-12">
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<svg class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Payments</h3>
				<p class="text-red-600">{{ error }}</p>
				<button @click="fetchPayments()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150">
					Try Again
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useIuran } from '@/composables/useIuran'
import { useResidents } from '@/composables/useResidents'
import IuranCSVImportModal from '@/components/admin/IuranCSVImportModal.vue'
import type { IuranPayment } from '@/types'

const { payments, summary, loading, error, fetchPayments, fetchSummary, createPayment, markPaid, updatePayment, deletePayment, exportPayments, importPayments } = useIuran()
const { residents, fetchResidents } = useResidents()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const editingPayment = ref<IuranPayment | null>(null)
const filters = reactive({ month: '', year: '', paid: '' })
const quickFilter = ref('')
const form = reactive({ residentId: '', month: '', year: new Date().getFullYear(), amount: 100000, paid: false })

const months = [
	{ value: '01', label: 'January' },
	{ value: '02', label: 'February' },
	{ value: '03', label: 'March' },
	{ value: '04', label: 'April' },
	{ value: '05', label: 'May' },
	{ value: '06', label: 'June' },
	{ value: '07', label: 'July' },
	{ value: '08', label: 'August' },
	{ value: '09', label: 'September' },
	{ value: '10', label: 'October' },
	{ value: '11', label: 'November' },
	{ value: '12', label: 'December' },
]

const years = computed(() => {
	const currentYear = new Date().getFullYear()
	return Array.from({ length: 5 }, (_, i) => currentYear - i)
})

const filteredPayments = computed(() => 
	payments.value.filter(p => {
		const f1 = !filters.month || p.month === filters.month
		const f2 = !filters.year || p.year === parseInt(filters.year)
		const f3 = !filters.paid || p.paid === (filters.paid === 'true')
		return f1 && f2 && f3
	})
)

const familyHeads = computed(() => 
	residents.value.filter(r => !r.familyId || r.relationship === 'head')
)

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('id-ID').format(amount)
}

const getMonthName = (month: string) => {
	const monthObj = months.find(m => m.value === month)
	return monthObj ? monthObj.label : month
}

const getResidentName = (residentId: string) => {
	const resident = residents.value.find(r => r.id === residentId)
	return resident ? resident.name : 'Unknown'
}

const getResidentHouse = (residentId: string) => {
	const resident = residents.value.find(r => r.id === residentId)
	return resident ? resident.house : 'Unknown'
}

const applyFilters = () => {
	fetchPayments(filters)
	fetchSummary(filters)
}

const clearFilters = () => {
	filters.month = ''
	filters.year = ''
	filters.paid = ''
	quickFilter.value = ''
	fetchPayments()
	fetchSummary()
}

const applyQuickFilter = () => {
	const now = new Date()
	const currentYear = now.getFullYear()
	const currentMonth = now.getMonth() + 1 // 1-based month
	
	switch (quickFilter.value) {
		case 'this-month':
			filters.month = currentMonth.toString().padStart(2, '0')
			filters.year = currentYear.toString()
			break
		case 'last-month':
			const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
			const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
			filters.month = lastMonth.toString().padStart(2, '0')
			filters.year = lastMonthYear.toString()
			break
		case 'this-quarter':
			const quarter = Math.ceil(currentMonth / 3)
			filters.month = ''
			filters.year = currentYear.toString()
			// Note: For quarter filtering, we'd need backend support
			break
		case 'last-quarter':
			const lastQuarter = currentMonth <= 3 ? 4 : Math.ceil(currentMonth / 3) - 1
			filters.month = ''
			filters.year = currentYear.toString()
			// Note: For quarter filtering, we'd need backend support
			break
		case 'this-year':
			filters.month = ''
			filters.year = currentYear.toString()
			break
		case 'last-year':
			filters.month = ''
			filters.year = (currentYear - 1).toString()
			break
		default:
			return
	}
	
	applyFilters()
}

const addPayment = async () => {
	try {
		const payment = await createPayment({
			residentId: form.residentId,
			month: form.month,
			year: form.year,
			amount: form.amount
		})
		
		// If marked as paid, update the payment status
		if (form.paid && payment.data.id) {
			await markPaid(payment.data.id)
		}
		
		closeModal()
	} catch (err) {
		console.error('Error creating payment:', err)
	}
}

const markAsPaid = async (id: string) => {
	try {
		await markPaid(id)
	} catch (err) {
		console.error('Error marking payment as paid:', err)
	}
}

const editPayment = (payment: IuranPayment) => {
	editingPayment.value = payment
	form.residentId = payment.residentId
	form.month = payment.month
	form.year = payment.year
	form.amount = payment.amount
	showEditModal.value = true
}

const updatePaymentData = async () => {
	try {
		if (editingPayment.value) {
			await updatePayment(editingPayment.value.id, {
				residentId: form.residentId,
				month: form.month,
				year: form.year,
				amount: form.amount
			})
			closeEditModal()
		}
	} catch (err) {
		console.error('Error updating payment:', err)
	}
}

const deletePaymentData = async (id: string) => {
	if (confirm('Are you sure you want to delete this payment?')) {
		try {
			await deletePayment(id)
		} catch (err) {
			console.error('Error deleting payment:', err)
		}
	}
}

const closeModal = () => {
	form.residentId = ''
	form.month = ''
	form.year = new Date().getFullYear()
	form.amount = 100000
	form.paid = false
	showAddModal.value = false
}

const closeEditModal = () => {
	editingPayment.value = null
	form.residentId = ''
	form.month = ''
	form.year = new Date().getFullYear()
	form.amount = 100000
	showEditModal.value = false
}

const handleExport = async () => {
	try {
		await exportPayments({
			format: 'csv',
			month: filters.month || undefined,
			year: filters.year ? parseInt(filters.year) : undefined
		})
	} catch (err) {
		console.error('Error exporting payments:', err)
		alert('Failed to export payments. Please try again.')
	}
}

const handleCSVImport = async (csvData: any[][]) => {
	try {
		const results = await importPayments(csvData)
		const successCount = results.filter(r => r.success).length
		const errorCount = results.filter(r => !r.success).length
		
		if (successCount > 0) {
			alert(`Successfully imported ${successCount} payment(s)${errorCount > 0 ? `. ${errorCount} row(s) had errors.` : '.'}`)
		} else {
			alert('No payments were imported. Please check your CSV format.')
		}
	} catch (err) {
		console.error('Error importing payments:', err)
		alert('Failed to import payments. Please check your CSV format and try again.')
	}
}

onMounted(async () => {
	await Promise.all([
		fetchPayments(),
		fetchSummary(),
		fetchResidents()
	])
})
</script>