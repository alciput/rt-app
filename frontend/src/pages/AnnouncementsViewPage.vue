<template>
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Community Announcements</h1>
			<p class="mt-2 text-gray-600">Stay updated with the latest community news and important information.</p>
		</div>

		<!-- Filters and Search -->
		<div class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
					<input
						v-model="filters.search"
						type="text"
						placeholder="Search announcements..."
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
					<select
						v-model="filters.category"
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">All Categories</option>
						<option value="general">General</option>
						<option value="rt">RT</option>
						<option value="rw">RW</option>
						<option value="event">Event</option>
						<option value="urgent">Urgent</option>
						<option value="maintenance">Maintenance</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
					<select
						v-model="filters.dateRange"
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">All Time</option>
						<option value="today">Today</option>
						<option value="week">This Week</option>
						<option value="month">This Month</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Announcements List -->
		<div v-if="filteredAnnouncements.length === 0 && !loading" class="text-center py-12">
			<div class="bg-gray-50 rounded-xl p-8">
				<svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
				</svg>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No Announcements Found</h3>
				<p class="text-gray-600">Check back later for community updates.</p>
			</div>
		</div>

		<div v-else class="space-y-6">
			<div v-for="announcement in filteredAnnouncements" :key="announcement.id" class="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
				<!-- Announcement Header -->
				<div :class="getHeaderGradient(announcement.category)" class="px-6 py-4 border-b border-gray-100">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div :class="getIconBg(announcement.category)" class="p-2 rounded-lg">
								<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
								</svg>
							</div>
							<div>
								<div class="flex items-center space-x-2">
									<h3 class="text-lg font-semibold text-gray-900">{{ announcement.title }}</h3>
									<span :class="getCategoryBadgeClass(announcement.category)" class="px-2 py-1 text-xs font-medium rounded-full">
										{{ announcement.category.toUpperCase() }}
									</span>
									<span v-if="announcement.category === 'urgent'" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 animate-pulse">
										URGENT
									</span>
								</div>
								<div class="flex items-center text-sm text-gray-500 mt-1">
									<svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
									{{ formatDate(announcement.createdAt) }}
									<span class="mx-2">•</span>
									<span class="capitalize">{{ announcement.visibility }}</span>
								</div>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<!-- Reactions -->
							<div class="flex items-center space-x-1">
								<button 
									@click="toggleReaction(announcement.id, 'like')"
									:class="getReactionClass(announcement, 'like')"
									class="p-2 rounded-lg hover:bg-gray-100 transition-all duration-150"
									title="Like"
								>
									👍
								</button>
								<button 
									@click="toggleReaction(announcement.id, 'love')"
									:class="getReactionClass(announcement, 'love')"
									class="p-2 rounded-lg hover:bg-gray-100 transition-all duration-150"
									title="Love"
								>
									❤️
								</button>
								<button 
									@click="toggleReaction(announcement.id, 'check')"
									:class="getReactionClass(announcement, 'check')"
									class="p-2 rounded-lg hover:bg-gray-100 transition-all duration-150"
									title="Check"
								>
									✅
								</button>
							</div>
							<button 
								@click="viewDetails(announcement)"
								class="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-all duration-150"
								title="View details"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
							<button 
								@click="toggleAnnouncement(announcement.id)"
								class="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-150"
								:title="isExpanded(announcement.id) ? 'Show less' : 'Show more'"
							>
								<svg class="h-4 w-4" :class="{ 'rotate-180': isExpanded(announcement.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
				
				<!-- Announcement Content (Collapsible) -->
				<div v-show="isExpanded(announcement.id)" class="px-6 py-4">
					<div class="prose prose-sm max-w-none">
						<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ announcement.body }}</p>
					</div>
					
					<!-- Attachments -->
					<div v-if="announcement.attachments && announcement.attachments.length > 0" class="mt-4">
						<h4 class="text-sm font-medium text-gray-700 mb-2">Attachments ({{ announcement.attachments.length }}):</h4>
						<div class="flex flex-wrap gap-2">
							<div v-for="attachment in announcement.attachments" :key="attachment.id" class="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
								<svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
								</svg>
								<span class="text-sm text-gray-700">{{ attachment.fileName }}</span>
								<span class="text-xs text-gray-500">({{ formatFileSize(attachment.fileSize) }})</span>
								<button 
									@click="downloadAttachment(attachment)"
									class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
									title="Download file"
								>
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
									</svg>
								</button>
							</div>
						</div>
					</div>

					<!-- Comments Section -->
					<div class="mt-6 border-t border-gray-200 pt-4">
						<div class="flex items-center space-x-4 mb-4">
							<h4 class="text-sm font-medium text-gray-700">Comments ({{ announcement.comments?.length || 0 }})</h4>
						</div>
						
						<!-- Add Comment -->
						<div class="mb-4">
							<textarea
								v-model="newComments[announcement.id]"
								placeholder="Add a comment..."
								rows="2"
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							></textarea>
							<div class="mt-2 flex justify-end">
								<button
									@click="addComment(announcement.id)"
									:disabled="!newComments[announcement.id]?.trim()"
									class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Post Comment
								</button>
							</div>
						</div>

						<!-- Comments List -->
						<div v-if="announcement.comments && announcement.comments.length > 0" class="space-y-3">
							<div v-for="comment in announcement.comments" :key="comment.id" class="bg-gray-50 rounded-lg p-3">
								<div class="flex items-center justify-between mb-1">
									<span class="text-sm font-medium text-gray-700">Resident</span>
									<span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
								</div>
								<p class="text-sm text-gray-600">{{ comment.content }}</p>
							</div>
						</div>
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
				Loading announcements...
			</div>
		</div>

		<!-- Error State -->
		<div v-if="error" class="text-center py-12">
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<svg class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Announcements</h3>
				<p class="text-red-600">{{ error }}</p>
				<button @click="fetchAnnouncements()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150">
					Try Again
				</button>
			</div>
		</div>

		<!-- Announcement Detail Modal -->
		<div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>
				<div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
					<div v-if="selectedAnnouncement" class="bg-white">
						<!-- Header -->
						<div :class="getHeaderGradient(selectedAnnouncement.category)" class="px-6 py-4 border-b border-gray-100">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div :class="getIconBg(selectedAnnouncement.category)" class="p-2 rounded-lg">
										<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
										</svg>
									</div>
									<div>
										<div class="flex items-center space-x-2">
											<h3 class="text-xl font-semibold text-gray-900">{{ selectedAnnouncement.title }}</h3>
											<span :class="getCategoryBadgeClass(selectedAnnouncement.category)" class="px-2 py-1 text-xs font-medium rounded-full">
												{{ selectedAnnouncement.category.toUpperCase() }}
											</span>
											<span v-if="isExpired(selectedAnnouncement)" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 animate-pulse">
												EXPIRED
											</span>
										</div>
										<div class="flex items-center text-sm text-gray-500 mt-1">
											<svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											{{ formatDate(selectedAnnouncement.createdAt) }}
											<span class="mx-2">•</span>
											<span class="capitalize">{{ selectedAnnouncement.visibility }}</span>
										</div>
									</div>
								</div>
								<button 
									@click="closeDetailModal"
									class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-150"
								>
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>
						</div>

						<!-- Content -->
						<div class="px-6 py-6">
							<!-- Date Information -->
							<div class="mb-6 bg-gray-50 rounded-lg p-4">
								<h4 class="text-sm font-medium text-gray-700 mb-3">Schedule Information</h4>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label class="block text-xs font-medium text-gray-500 mb-1">Publish Date</label>
										<div class="flex items-center space-x-2">
											<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
											</svg>
											<span class="text-sm text-gray-700">
												{{ selectedAnnouncement.publishDate ? formatDateTime(selectedAnnouncement.publishDate) : 'Immediately' }}
											</span>
										</div>
									</div>
									<div>
										<label class="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
										<div class="flex items-center space-x-2">
											<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
											</svg>
											<span class="text-sm text-gray-700">
												{{ selectedAnnouncement.expiryDate ? formatDateTime(selectedAnnouncement.expiryDate) : 'No expiry' }}
											</span>
										</div>
									</div>
								</div>
								<div v-if="isExpired(selectedAnnouncement)" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
									<div class="flex items-center">
										<svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
										</svg>
										<span class="text-sm font-medium text-red-800">This announcement has expired</span>
									</div>
								</div>
							</div>

							<!-- Content -->
							<div class="mb-6">
								<h4 class="text-sm font-medium text-gray-700 mb-3">Content</h4>
								<div class="prose prose-sm max-w-none">
									<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedAnnouncement.body }}</p>
								</div>
							</div>

							<!-- Attachments -->
							<div v-if="selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0" class="mb-6">
								<h4 class="text-sm font-medium text-gray-700 mb-3">Attachments ({{ selectedAnnouncement.attachments.length }})</h4>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div v-for="attachment in selectedAnnouncement.attachments" :key="attachment.id" class="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
										<svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
										</svg>
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-700">{{ attachment.fileName }}</p>
											<p class="text-xs text-gray-500">{{ formatFileSize(attachment.fileSize) }} • {{ attachment.fileType }}</p>
										</div>
										<button 
											@click="downloadAttachment(attachment)"
											class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors"
											title="Download file"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>

							<!-- Comments -->
							<div v-if="selectedAnnouncement.comments && selectedAnnouncement.comments.length > 0" class="mb-6">
								<h4 class="text-sm font-medium text-gray-700 mb-3">Comments ({{ selectedAnnouncement.comments.length }})</h4>
								<div class="space-y-3">
									<div v-for="comment in selectedAnnouncement.comments" :key="comment.id" class="bg-gray-50 rounded-lg p-3">
										<div class="flex items-center justify-between mb-1">
											<span class="text-sm font-medium text-gray-700">Resident</span>
											<span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
										</div>
										<p class="text-sm text-gray-600">{{ comment.content }}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Footer -->
						<div class="bg-gray-50 px-6 py-4 flex justify-end">
							<button
								@click="closeDetailModal"
								class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useAnnouncements } from '@/composables/useAnnouncements'
import type { Announcement } from '@/types'

const { announcements, loading, error, fetchAnnouncements } = useAnnouncements()

const expandedAnnouncements = ref<Set<string>>(new Set())
const newComments = reactive<Record<string, string>>({})
const showDetailModal = ref(false)
const selectedAnnouncement = ref<Announcement | null>(null)

const filters = reactive({
	search: '',
	category: '',
	dateRange: ''
})

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

const formatDateTime = (dateString?: string) => {
	if (!dateString) return 'Unknown date'
	return new Date(dateString).toLocaleDateString('id-ID', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}

const isExpired = (announcement: Announcement) => {
	if (!announcement.expiryDate) return false
	const now = new Date()
	const expiryDate = new Date(announcement.expiryDate)
	return now > expiryDate
}

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getHeaderGradient = (category: string) => {
	switch (category) {
		case 'urgent': return 'bg-gradient-to-r from-red-50 to-pink-50'
		case 'event': return 'bg-gradient-to-r from-green-50 to-emerald-50'
		case 'maintenance': return 'bg-gradient-to-r from-orange-50 to-yellow-50'
		case 'rt': return 'bg-gradient-to-r from-purple-50 to-violet-50'
		case 'rw': return 'bg-gradient-to-r from-indigo-50 to-blue-50'
		default: return 'bg-gradient-to-r from-blue-50 to-indigo-50'
	}
}

const getIconBg = (category: string) => {
	switch (category) {
		case 'urgent': return 'bg-red-100'
		case 'event': return 'bg-green-100'
		case 'maintenance': return 'bg-orange-100'
		case 'rt': return 'bg-purple-100'
		case 'rw': return 'bg-indigo-100'
		default: return 'bg-blue-100'
	}
}

const getCategoryBadgeClass = (category: string) => {
	switch (category) {
		case 'general': return 'bg-blue-100 text-blue-800'
		case 'rt': return 'bg-purple-100 text-purple-800'
		case 'rw': return 'bg-indigo-100 text-indigo-800'
		case 'event': return 'bg-green-100 text-green-800'
		case 'urgent': return 'bg-red-100 text-red-800'
		case 'maintenance': return 'bg-orange-100 text-orange-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

const getReactionClass = (announcement: Announcement, reactionType: string) => {
	const hasReaction = announcement.reactions?.some(r => r.reactionType === reactionType)
	return hasReaction ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
}

const isExpanded = (announcementId: string) => {
	return expandedAnnouncements.value.has(announcementId)
}

const toggleAnnouncement = (announcementId: string) => {
	if (expandedAnnouncements.value.has(announcementId)) {
		expandedAnnouncements.value.delete(announcementId)
	} else {
		expandedAnnouncements.value.add(announcementId)
	}
}

const toggleReaction = async (announcementId: string, reactionType: string) => {
	// TODO: Implement reaction toggle API call
	console.log('Toggle reaction:', announcementId, reactionType)
}

const addComment = async (announcementId: string) => {
	const content = newComments[announcementId]
	if (!content?.trim()) return

	// TODO: Implement add comment API call
	console.log('Add comment:', announcementId, content)
	newComments[announcementId] = ''
}

const closeDetailModal = () => {
	selectedAnnouncement.value = null
	showDetailModal.value = false
}

const viewDetails = (announcement: Announcement) => {
	selectedAnnouncement.value = announcement
	showDetailModal.value = true
}

const downloadAttachment = (attachment: any) => {
	try {
		// Create a blob from the base64 data
		const byteCharacters = atob(attachment.fileData)
		const byteNumbers = new Array(byteCharacters.length)
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i)
		}
		const byteArray = new Uint8Array(byteNumbers)
		const blob = new Blob([byteArray], { type: attachment.fileType })
		
		// Create download link
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = attachment.fileName
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	} catch (error) {
		console.error('Error downloading attachment:', error)
		alert('Error downloading file')
	}
}

const filteredAnnouncements = computed(() => {
	let filtered = announcements.value.filter(a => a.status === 'published')

	if (filters.search) {
		const search = filters.search.toLowerCase()
		filtered = filtered.filter(announcement => 
			announcement.title.toLowerCase().includes(search) ||
			announcement.body.toLowerCase().includes(search)
		)
	}

	if (filters.category) {
		filtered = filtered.filter(announcement => announcement.category === filters.category)
	}

	if (filters.dateRange) {
		const now = new Date()
		filtered = filtered.filter(announcement => {
			const announcementDate = new Date(announcement.createdAt || '')
			
			switch (filters.dateRange) {
				case 'today':
					return announcementDate.toDateString() === now.toDateString()
				case 'week':
					const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
					return announcementDate >= weekAgo
				case 'month':
					const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
					return announcementDate >= monthAgo
				default:
					return true
			}
		})
	}

	// Sort by creation date (newest first)
	return filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
})

onMounted(() => {
	fetchAnnouncements()
})
</script>