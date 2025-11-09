<template>
	<div class="max-w-4xl mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold mb-6">Test File Upload</h1>
		
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-lg font-semibold mb-4">Upload Test</h2>
			
			<!-- File Upload Area -->
			<div 
				@drop="handleDrop"
				@dragover="handleDragOver"
				@dragenter="handleDragEnter"
				@dragleave="handleDragLeave"
				:class="isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'"
				class="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-gray-400 transition-colors"
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

			<!-- Uploaded Files -->
			<div v-if="files.length > 0" class="mt-6">
				<h3 class="text-md font-medium mb-3">Uploaded Files:</h3>
				<div class="space-y-2">
					<div v-for="(file, index) in files" :key="index" class="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
						<div class="flex items-center space-x-2">
							<svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<span class="text-sm text-gray-700 font-medium">{{ file.fileName }}</span>
							<span class="text-xs text-gray-500">({{ formatFileSize(file.fileSize) }})</span>
						</div>
						<button 
							@click="removeFile(index)"
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

			<!-- Test Upload Button -->
			<div v-if="files.length > 0" class="mt-6">
				<button 
					@click="testUpload"
					:disabled="uploading"
					class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{{ uploading ? 'Uploading...' : 'Test Upload' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const files = ref<Array<{
	fileName: string
	fileType: string
	fileSize: number
	fileData: string
}>>([])

const isDragOver = ref(false)
const uploading = ref(false)

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileUpload = async (event: Event) => {
	const fileList = (event.target as HTMLInputElement).files
	if (!fileList || fileList.length === 0) return

	try {
		for (const file of Array.from(fileList)) {
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

			console.log(`Processing file: ${file.name}`)

			// Convert file to base64
			const base64 = await fileToBase64(file)
			
			files.value.push({
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
				fileData: base64
			})

			console.log(`File ${file.name} processed successfully`)
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

const removeFile = (index: number) => {
	files.value.splice(index, 1)
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

	const fileList = event.dataTransfer?.files
	if (fileList && fileList.length > 0) {
		// Create a mock event object to reuse the existing handleFileUpload function
		const mockEvent = {
			target: {
				files: fileList,
				value: ''
			}
		} as Event & { target: HTMLInputElement }
		
		await handleFileUpload(mockEvent)
	}
}

const testUpload = async () => {
	uploading.value = true
	try {
		console.log('Testing upload with files:', files.value)
		
		// Simulate upload delay
		await new Promise(resolve => setTimeout(resolve, 2000))
		
		alert('Upload test completed! Check console for details.')
		console.log('Upload test successful!')
	} catch (error) {
		console.error('Upload test failed:', error)
		alert('Upload test failed!')
	} finally {
		uploading.value = false
	}
}
</script>
