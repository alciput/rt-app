<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
		<!-- Header -->
		<header class="bg-white shadow-lg border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<!-- Logo -->
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
								<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
								</svg>
							</div>
						</div>
						<div class="ml-3">
							<h1 class="text-xl font-bold text-gray-900">RT/RW Management</h1>
							<p class="text-sm text-gray-500">Community Management System</p>
						</div>
					</div>

					<!-- Navigation -->
					<nav class="hidden md:flex space-x-8">
						<RouterLink 
							to="/" 
							class="nav-link"
							:class="{ 'nav-link-active': $route.name === 'dashboard' }"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
							</svg>
							Dashboard
						</RouterLink>
						<RouterLink 
							to="/residents" 
							class="nav-link"
							:class="{ 'nav-link-active': $route.name === 'residents' }"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
							</svg>
							Residents
						</RouterLink>
						<RouterLink 
							to="/announcements" 
							class="nav-link"
							:class="{ 'nav-link-active': $route.name === 'announcements' }"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
							</svg>
							Announcements
						</RouterLink>
						<RouterLink 
							to="/iuran" 
							class="nav-link"
							:class="{ 'nav-link-active': $route.name === 'iuran' }"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
							</svg>
							Iuran
						</RouterLink>
						<RouterLink 
							to="/surat" 
							class="nav-link"
							:class="{ 'nav-link-active': $route.name === 'surat' }"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
							</svg>
							Surat
						</RouterLink>
					</nav>

					<!-- User Menu -->
					<div class="flex items-center space-x-4">
						<div class="flex items-center space-x-2">
							<div class="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
								<span class="text-white text-sm font-medium">A</span>
							</div>
							<div class="hidden sm:block">
								<p class="text-sm font-medium text-gray-900">Admin User</p>
								<p class="text-xs text-gray-500">Admin</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1">
			<RouterView />
		</main>
	</div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.nav-link {
	@apply flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200;
}

.nav-link-active {
	@apply text-blue-600 bg-blue-50;
}
</style>
