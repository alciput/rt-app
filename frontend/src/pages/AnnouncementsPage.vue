<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Announcement Management</h1>
					<p class="mt-2 text-gray-600">Create, manage, and publish community announcements with rich content and attachments.</p>
				</div>
				<div class="flex items-center space-x-3">
					<button 
						@click="fetchAnnouncements()"
						:disabled="loading"
						class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						<span>Refresh</span>
					</button>
					<button 
						@click="showAddModal = true"
						class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						<span>Create Announcement</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Filters and Search -->
		<div class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
					<label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
					<select
						v-model="filters.status"
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">All Status</option>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="archived">Archived</option>
					</select>
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
					<label class="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
					<select
						v-model="filters.visibility"
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">All Visibility</option>
						<option value="rt">RT Only</option>
						<option value="rw">RW</option>
						<option value="global">Global</option>
					</select>
				</div>
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
											<span :class="getStatusBadgeClass(selectedAnnouncement.status)" class="px-2 py-1 text-xs font-medium rounded-full">
												{{ getDisplayStatus(selectedAnnouncement).toUpperCase() }}
											</span>
											<span :class="getCategoryBadgeClass(selectedAnnouncement.category)" class="px-2 py-1 text-xs font-medium rounded-full">
												{{ selectedAnnouncement.category.toUpperCase() }}
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
										<div class="flex items-center space-x-2">
											<button 
												@click="downloadAttachment(attachment)"
												class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors"
												title="Download file"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
												</svg>
											</button>
											<button 
												@click="deleteAttachment(attachment.id)"
												class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
												title="Delete attachment"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
							</div>
						</div>
					</div>
					<!-- Debug: Show attachment info in modal -->
					<div v-if="selectedAnnouncement.attachments" class="mt-2 text-xs text-gray-500">
						Debug: {{ selectedAnnouncement.attachments.length }} attachments found in modal
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
						<div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
							<button
								@click="closeDetailModal"
								class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Close
							</button>
							<button
								@click="editAnnouncement(selectedAnnouncement)"
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Edit Announcement
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Create/Edit Announcement Modal -->
		<div v-if="showAddModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
				<div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
					<form @submit.prevent="handleSubmit">
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
									<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
									</svg>
								</div>
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
									<h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
										{{ showEditModal ? 'Edit Announcement' : 'Create New Announcement' }}
									</h3>
									
									<!-- Form Fields -->
									<div class="space-y-4">
										<!-- Title -->
										<div>
											<label class="block text-sm font-medium text-gray-700">Title *</label>
											<input
												v-model="form.title"
												type="text"
												required
												class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter announcement title"
											/>
										</div>

										<!-- Category and Visibility -->
										<div class="grid grid-cols-2 gap-4">
											<div>
												<label class="block text-sm font-medium text-gray-700">Category *</label>
												<select
													v-model="form.category"
													required
													class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												>
													<option value="general">General</option>
													<option value="rt">RT</option>
													<option value="rw">RW</option>
													<option value="event">Event</option>
													<option value="urgent">Urgent</option>
													<option value="maintenance">Maintenance</option>
												</select>
											</div>
											<div>
												<label class="block text-sm font-medium text-gray-700">Visibility *</label>
												<select
													v-model="form.visibility"
													required
													class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												>
													<option value="rt">RT Only</option>
													<option value="rw">RW</option>
													<option value="global">Global</option>
												</select>
											</div>
										</div>

										<!-- Publish and Expiry Dates -->
										<div class="grid grid-cols-2 gap-4">
											<div>
												<label class="block text-sm font-medium text-gray-700">Publish Date</label>
												<input
													v-model="form.publishDate"
													type="datetime-local"
													class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												/>
											</div>
											<div>
												<label class="block text-sm font-medium text-gray-700">Expiry Date</label>
												<input
													v-model="form.expiryDate"
													type="datetime-local"
													class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												/>
											</div>
										</div>

										<!-- Content -->
										<div>
											<label class="block text-sm font-medium text-gray-700">Content *</label>
											<textarea
												v-model="form.body"
												required
												rows="6"
												class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter announcement content (supports markdown)"
											></textarea>
										</div>

										<!-- File Attachments -->
										<div>
											<label class="block text-sm font-medium text-gray-700">Attachments</label>
											
											<!-- Uploaded Files List -->
											<div v-if="form.attachments && form.attachments.length > 0" class="mt-2 mb-4">
												<div class="space-y-2">
													<div v-for="(attachment, index) in form.attachments" :key="index" class="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
														<div class="flex items-center space-x-2">
															<svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
															</svg>
															<span class="text-sm text-gray-700 font-medium">{{ attachment.fileName }}</span>
															<span class="text-xs text-gray-500">({{ formatFileSize(attachment.fileSize) }})</span>
														</div>
														<button 
															@click="removeAttachment(index)"
															class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors"
															title="Remove file"
														>
															<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
															</svg>
														</button>
													</div>
												</div>
											</div>

											<!-- Upload Area -->
											<div 
												@drop="handleDrop"
												@dragover="handleDragOver"
												@dragenter="handleDragEnter"
												@dragleave="handleDragLeave"
												:class="isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'"
												class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-gray-400 transition-colors"
											>
												<div class="space-y-1 text-center">
													<svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
														<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
													</svg>
													<div class="flex text-sm text-gray-600">
														<label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
															<span>Upload files</span>
															<input
																@change="handleFileUpload"
																type="file"
																multiple
																accept="image/*,.pdf,.doc,.docx,.txt"
																class="sr-only"
															/>
														</label>
														<p class="pl-1">or drag and drop</p>
													</div>
													<p class="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 10MB each</p>
												</div>
											</div>
										</div>

										<!-- Status -->
										<div>
											<label class="block text-sm font-medium text-gray-700">Status</label>
											<select
												v-model="form.status"
												class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											>
												<option value="draft">Draft</option>
												<option value="published">Published</option>
											</select>
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
								{{ loading ? 'Saving...' : (showEditModal ? 'Update Announcement' : 'Create Announcement') }}
							</button>
							<button
								type="button"
								@click="closeModal"
								class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							>
								Cancel
							</button>
						</div>
					</form>
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
				<p class="text-gray-600 mb-4">Create your first announcement to get started.</p>
				<button 
					@click="showAddModal = true"
					class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
				>
					Create First Announcement
				</button>
			</div>
		</div>

		<div v-else class="space-y-6">
			<div v-for="announcement in filteredAnnouncements" :key="announcement.id" class="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
				<!-- Announcement Header -->
				<div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="bg-blue-100 p-2 rounded-lg">
								<svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
								</svg>
							</div>
							<div>
								<div class="flex items-center space-x-2">
									<h3 class="text-lg font-semibold text-gray-900">{{ announcement.title }}</h3>
									<span :class="getStatusBadgeClass(getDisplayStatus(announcement))" class="px-2 py-1 text-xs font-medium rounded-full">
										{{ getDisplayStatus(announcement).toUpperCase() }}
									</span>
									<span :class="getCategoryBadgeClass(announcement.category)" class="px-2 py-1 text-xs font-medium rounded-full">
										{{ announcement.category.toUpperCase() }}
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
						<div class="flex space-x-2">
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
								@click="editAnnouncement(announcement)"
								class="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-150"
								title="Edit announcement"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button 
								@click="archiveAnnouncement(announcement.id)"
								v-if="announcement.status !== 'archived'"
								class="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-150"
								title="Archive announcement"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8l6 6 6-6M5 8l6-6 6 6"></path>
								</svg>
							</button>
							<button 
								@click="deleteAnnouncement(announcement.id)"
								class="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-150"
								title="Delete announcement"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
				
				<!-- Announcement Content -->
				<div class="px-6 py-4">
					<div class="prose prose-sm max-w-none">
						<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ announcement.body }}</p>
					</div>
					
					<!-- Attachments -->
					<div v-if="announcement.attachments && announcement.attachments.length > 0" class="mt-4">
						<h4 class="text-sm font-medium text-gray-700 mb-2">Attachments ({{ announcement.attachments.length }}):</h4>
						<div class="flex flex-wrap gap-2">
							<div v-for="attachment in announcement.attachments" :key="attachment.id" class="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
								<svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
								</svg>
								<span class="text-sm text-gray-700">{{ attachment.fileName }}</span>
								<span class="text-xs text-gray-500">({{ formatFileSize(attachment.fileSize) }})</span>
							</div>
						</div>
					</div>
					<!-- Debug: Show attachment info -->
					<div v-if="announcement.attachments" class="mt-2 text-xs text-gray-500">
						Debug: {{ announcement.attachments.length }} attachments found
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
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useAnnouncements } from '@/composables/useAnnouncements'
import type { Announcement } from '@/types'

const { announcements, loading, error, fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement: deleteAnnouncementApi, addAttachment } = useAnnouncements()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const editingAnnouncement = ref<Announcement | null>(null)
const selectedAnnouncement = ref<Announcement | null>(null)
const isDragOver = ref(false)

const form = reactive({
	title: '',
	body: '',
	category: 'general',
	visibility: 'rt',
	status: 'draft',
	publishDate: '',
	expiryDate: '',
	attachments: [] as Array<{
		fileName: string
		fileType: string
		fileSize: number
		fileData: string
	}>
})

const filters = reactive({
	search: '',
	status: '',
	category: '',
	visibility: ''
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

const getDisplayStatus = (announcement: Announcement) => {
	if (isExpired(announcement)) {
		return 'expired'
	}
	return announcement.status
}

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getStatusBadgeClass = (status: string) => {
	switch (status) {
		case 'draft': return 'bg-gray-100 text-gray-800'
		case 'published': return 'bg-green-100 text-green-800'
		case 'archived': return 'bg-yellow-100 text-yellow-800'
		case 'expired': return 'bg-red-100 text-red-800'
		default: return 'bg-gray-100 text-gray-800'
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

const filteredAnnouncements = computed(() => {
	let filtered = announcements.value

	if (filters.search) {
		const search = filters.search.toLowerCase()
		filtered = filtered.filter(announcement => 
			announcement.title.toLowerCase().includes(search) ||
			announcement.body.toLowerCase().includes(search)
		)
	}

	if (filters.status) {
		filtered = filtered.filter(announcement => announcement.status === filters.status)
	}

	if (filters.category) {
		filtered = filtered.filter(announcement => announcement.category === filters.category)
	}

	if (filters.visibility) {
		filtered = filtered.filter(announcement => announcement.visibility === filters.visibility)
	}

	return filtered
})

const handleSubmit = async () => {
	try {
		const announcementData = {
			title: form.title,
			body: form.body,
			category: form.category,
			visibility: form.visibility,
			status: form.status,
			publishDate: form.publishDate || null,
			expiryDate: form.expiryDate || null
		}

		let announcement
		if (showEditModal.value && editingAnnouncement.value) {
			announcement = await updateAnnouncement(editingAnnouncement.value.id, announcementData)
		} else {
			announcement = await createAnnouncement(announcementData)
		}

		// Upload attachments if any
		if (form.attachments && form.attachments.length > 0 && announcement) {
			console.log('Uploading attachments:', form.attachments)
			let uploadedCount = 0
			for (const attachment of form.attachments) {
				try {
					console.log('Uploading attachment:', attachment.fileName)
					const result = await addAttachment(announcement.id, attachment)
					console.log('Attachment uploaded successfully:', result)
					uploadedCount++
				} catch (err) {
					console.error('Error uploading attachment:', err)
					// Continue with other attachments even if one fails
				}
			}
			if (uploadedCount > 0) {
				alert(`Successfully uploaded ${uploadedCount} attachment(s)!`)
			}
		}
		
		closeModal()
	} catch (err) {
		console.error('Error saving announcement:', err)
	}
}

const handleFileUpload = async (event: Event) => {
	const files = (event.target as HTMLInputElement).files
	if (!files || files.length === 0) return

	try {
		for (const file of Array.from(files)) {
			// Validate file size (10MB limit)
			if (file.size > 10 * 1024 * 1024) {
				alert(`File ${file.name} is too large. Maximum size is 10MB.`)
				continue
			}

			// Validate file type
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
			if (!allowedTypes.includes(file.type)) {
				alert(`File type ${file.type} is not supported.`)
				continue
			}

			// Show loading state
			console.log(`Processing file: ${file.name}`)

			// Convert file to base64
			const base64 = await fileToBase64(file)
			console.log(`Base64 length for ${file.name}:`, base64.length)
			
			// Store file data for later upload
			if (!form.attachments) {
				form.attachments = []
			}
			
			const attachmentData = {
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
				fileData: base64
			}
			
			form.attachments.push(attachmentData)
			console.log(`File ${file.name} processed successfully:`, attachmentData)
		}
		
		// Clear the input
		(event.target as HTMLInputElement).value = ''
	} catch (error) {
		console.error('Error processing files:', error)
		alert('Error processing files. Please try again.')
	}
}

const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			const result = reader.result as string
			// Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
			const base64 = result.split(',')[1]
			resolve(base64)
		}
		reader.onerror = error => reject(error)
	})
}

const removeAttachment = (index: number) => {
	form.attachments.splice(index, 1)
}

const handleDragOver = (event: DragEvent) => {
	event.preventDefault()
	event.stopPropagation()
}

const handleDragEnter = (event: DragEvent) => {
	event.preventDefault()
	event.stopPropagation()
	isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
	event.preventDefault()
	event.stopPropagation()
	isDragOver.value = false
}

const handleDrop = async (event: DragEvent) => {
	event.preventDefault()
	event.stopPropagation()
	isDragOver.value = false

	const files = event.dataTransfer?.files
	if (files && files.length > 0) {
		// Create a mock event object to reuse the existing handleFileUpload function
		const mockEvent = {
			target: {
				files: files,
				value: ''
			}
		} as Event & { target: HTMLInputElement }
		
		await handleFileUpload(mockEvent)
	}
}

const closeModal = () => {
	form.title = ''
	form.body = ''
	form.category = 'general'
	form.visibility = 'rt'
	form.status = 'draft'
	form.publishDate = ''
	form.expiryDate = ''
	form.attachments = []
	editingAnnouncement.value = null
	showAddModal.value = false
	showEditModal.value = false
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

const deleteAttachment = async (attachmentId: string) => {
	if (confirm('Are you sure you want to delete this attachment?')) {
		try {
			// TODO: Implement delete attachment API call
			console.log('Deleting attachment:', attachmentId)
			alert('Attachment deletion not implemented yet')
		} catch (error) {
			console.error('Error deleting attachment:', error)
			alert('Error deleting attachment')
		}
	}
}

const editAnnouncement = (announcement: Announcement) => {
	editingAnnouncement.value = announcement
	form.title = announcement.title
	form.body = announcement.body
	form.category = announcement.category
	form.visibility = announcement.visibility
	form.status = announcement.status
	form.publishDate = announcement.publishDate || ''
	form.expiryDate = announcement.expiryDate || ''
	
	// Map existing attachments
	if (announcement.attachments && announcement.attachments.length > 0) {
		form.attachments = announcement.attachments.map(attachment => ({
			fileName: attachment.fileName,
			fileType: attachment.fileType,
			fileSize: attachment.fileSize,
			fileData: attachment.fileData
		}))
		console.log('Mapped existing attachments:', form.attachments)
	} else {
		form.attachments = []
	}
	
	showEditModal.value = true
}

const archiveAnnouncement = async (id: string) => {
	if (confirm('Are you sure you want to archive this announcement?')) {
		try {
			await updateAnnouncement(id, { status: 'archived', archivedAt: new Date().toISOString() })
		} catch (err) {
			console.error('Error archiving announcement:', err)
		}
	}
}

const deleteAnnouncement = async (id: string) => {
	if (confirm('Are you sure you want to delete this announcement?')) {
		try {
			await deleteAnnouncementApi(id)
		} catch (err) {
			console.error('Error deleting announcement:', err)
		}
	}
}

onMounted(() => {
	fetchAnnouncements()
})
</script>