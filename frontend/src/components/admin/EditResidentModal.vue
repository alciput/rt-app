<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay with blur effect -->
      <div 
        class="fixed inset-0 bg-gradient-to-br from-gray-900/50 to-blue-900/30 backdrop-blur-sm transition-opacity duration-300" 
        @click="close"
      ></div>

      <!-- Modal panel with beautiful design -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-6 py-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">Edit Resident</h3>
                <p class="text-orange-100 mt-1">Update resident information and documents</p>
                <div v-if="!isFormPopulated" class="mt-2 text-orange-200 text-sm">
                  <svg class="inline animate-spin -ml-1 mr-2 h-4 w-4 text-orange-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading resident data...
                </div>
              </div>
            </div>
            <button
              @click="close"
              class="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Form content -->
        <form @submit.prevent="handleSubmit" class="bg-gray-50">
          <div class="px-6 py-8">
            <!-- Personal Information Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Personal Information</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <!-- House Number -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    House Number <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                      </svg>
                    </div>
                    <input
                      v-model="form.house"
                      type="text"
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder="e.g. A-01, B-15"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Location Information Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Location Details</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Cluster -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Cluster <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.cluster"
                    required
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Cluster</option>
                    <option value="Alium">🏢 Alium</option>
                    <option value="Boulevard">🌳 Boulevard</option>
                  </select>
                </div>

                <!-- Blok (conditional) -->
                <div v-if="form.cluster === 'Alium'" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Blok</label>
                  <select
                    v-model="form.blok"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Blok</option>
                    <option value="A">🏠 Blok A</option>
                    <option value="B">🏠 Blok B</option>
                    <option value="C">🏠 Blok C</option>
                    <option value="D">🏠 Blok D</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Identity & Documents Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Identity & Documents</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- NIK KTP -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">NIK KTP</label>
                  <input
                    v-model="form.nikKtp"
                    type="text"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter NIK KTP number"
                  />
                </div>

                <!-- KTP File Upload with Preview -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">KTP File</label>
                  
                  <!-- Current Image Preview -->
                  <div v-if="form.ktpFile && form.ktpFile.startsWith('data:image/')" class="mb-4">
                    <div class="relative inline-block">
                      <img 
                        :src="form.ktpFile" 
                        :alt="form.name"
                        class="h-24 w-24 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        @click="removeImage"
                        type="button"
                        class="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <p class="text-xs text-green-600 mt-1">✅ Image uploaded successfully</p>
                  </div>

                  <!-- File Name Display (for non-image files) -->
                  <div v-else-if="form.ktpFile" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span class="text-sm text-gray-700">{{ form.ktpFile }}</span>
                      </div>
                      <button
                        @click="removeImage"
                        type="button"
                        class="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- File Upload Area -->
                  <div class="relative">
                    <input
                      @change="handleFileUpload"
                      type="file"
                      accept="image/*,.pdf"
                      class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">📄 Upload KTP image or PDF (optional) - Images will be automatically compressed</p>
                </div>
              </div>
            </div>

            <!-- Status & Role Section -->
            <div class="mb-8">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Status & Role</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Status -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.status"
                        type="radio"
                        value="active"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.status === 'active' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Active
                      </div>
                    </label>
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.status"
                        type="radio"
                        value="inactive"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.status === 'inactive' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Inactive
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Role -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Role</label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.role"
                        type="radio"
                        value="Contract"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.role === 'Contract' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Contract
                      </div>
                    </label>
                    <label class="relative cursor-pointer">
                      <input
                        v-model="form.role"
                        type="radio"
                        value="Owner"
                        class="sr-only"
                      />
                      <div class="flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200"
                           :class="form.role === 'Owner' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 hover:border-gray-400'">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        Owner
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
            </div>

            <!-- Family Members Section -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900">Family Members</h4>
                </div>
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="loadExistingFamilyMembers(props.resident?.id)"
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Refresh</span>
                  </button>
                  <button
                    type="button"
                    @click="addFamilyMember"
                    class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>Add Family Member</span>
                  </button>
                </div>
              </div>

              <!-- Family Members List -->
              <div v-if="familyMembers.length > 0" class="space-y-4">
                <div v-for="(member, index) in familyMembers" :key="index" class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-purple-600">{{ member.name.charAt(0) || 'M' }}</span>
                      </div>
                      <div>
                        <div class="flex items-center space-x-2">
                          <h5 class="text-sm font-semibold text-purple-800">Family Member {{ index + 1 }}</h5>
                          <span v-if="isExistingFamilyMember(member)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            Saved
                          </span>
                          <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                            New
                          </span>
                        </div>
                        <p class="text-xs text-purple-600">{{ member.relationship || 'No relationship set' }}</p>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <!-- Delete from database button (for existing members) -->
                      <button
                        v-if="isExistingFamilyMember(member)"
                        type="button"
                        @click="confirmDeleteFamilyMember(member)"
                        class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-150"
                        title="Delete from database"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <!-- Remove from form button (for new members) -->
                      <button
                        v-else
                        type="button"
                        @click="removeFamilyMember(index)"
                        class="text-orange-500 hover:text-orange-700 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-150"
                        title="Remove from form"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        v-model="member.name"
                        type="text"
                        required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter member name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <select
                        v-model="member.relationship"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Relationship</option>
                        <option value="wife">Wife</option>
                        <option value="husband">Husband</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        v-model="member.age"
                        type="number"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Age"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8 text-gray-500">
                <svg class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <p class="text-sm">No family members added yet</p>
                <p class="text-xs text-gray-400 mt-1">Click "Add Family Member" to get started</p>
              </div>
            </div>

            <!-- Administrative Information Section -->
            <div class="mb-6">
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg class="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">Administrative Details</h4>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- RT -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">RT</label>
                  <select
                    v-model="form.rtId"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select RT</option>
                    <option value="01">01</option>
                  </select>
                </div>

                <!-- RW -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">RW</label>
                  <select
                    v-model="form.rwId"
                    class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select RW</option>
                    <option value="11">11</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer with beautiful buttons -->
          <div class="bg-white px-6 py-6 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                type="button"
                @click="close"
                class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ loading ? 'Updating...' : 'Update Resident' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, nextTick } from 'vue'
import { useResidents } from '@/composables/useResidents'
import type { Resident } from '@/types'

interface Props {
  isOpen: boolean
  resident: Resident | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: [resident: Resident]
}>()

const { updateResident, createResident, deleteResident, residents, fetchResidents, loading } = useResidents()

const form = reactive({
  name: '',
  house: '',
  cluster: '' as 'Alium' | 'Boulevard' | '',
  blok: '',
  nikKtp: '',
  ktpFile: '',
  status: 'active' as 'active' | 'inactive',
  role: 'Contract' as 'Contract' | 'Owner',
  rtId: '',
  rwId: '',
})

const isFormPopulated = ref(false)

// Family members array
const familyMembers = ref<Array<{
  name: string
  relationship: string
  age: number | null
}>>([])

// Load existing family members for the current resident
const loadExistingFamilyMembers = async (residentId: string) => {
  try {
    console.log('Loading family members for resident:', residentId)
    // Fetch all residents to get the latest data
    await fetchResidents()
    
    console.log('Total residents fetched:', residents.value.length)
    console.log('All residents with familyId:', residents.value.filter(r => r.familyId).map(r => ({ name: r.name, familyId: r.familyId })))
    
    // Find family members linked to this resident
    const members = residents.value.filter(r => r.familyId === residentId)
    console.log('Found family members for', residentId, ':', members)
    
    // Clear existing family members first
    familyMembers.value = []
    
    // Populate the family members array with proper reactivity
    const newMembers = members.map(member => ({
      name: member.name,
      relationship: member.relationship || '',
      age: member.age || null
    }))
    
    // Use splice to ensure reactivity
    familyMembers.value.splice(0, familyMembers.value.length, ...newMembers)
    
    console.log('Family members loaded into UI:', familyMembers.value)
    console.log('Family members array length:', familyMembers.value.length)
    console.log('Family members reactive array:', familyMembers.value)
    
    // Force reactivity update
    await nextTick()
    console.log('After nextTick - family members:', familyMembers.value)
  } catch (error) {
    console.error('Error loading family members:', error)
  }
}

// Manual form population function
const populateForm = (resident: Resident) => {
  console.log('EditResidentModal: Manually populating form with:', resident.name)
  try {
    form.name = resident.name || ''
    form.house = resident.house || ''
    form.cluster = resident.cluster || ''
    form.blok = resident.blok || ''
    form.nikKtp = resident.nikKtp || ''
    form.ktpFile = resident.ktpFile || ''
    form.status = resident.status || 'active'
    form.role = resident.role || 'Contract'
    form.rtId = resident.rtId || ''
    form.rwId = resident.rwId || ''
    isFormPopulated.value = true
    console.log('EditResidentModal: Manual form population successful')
    
    // Load existing family members for this resident
    console.log('EditResidentModal: About to load family members for:', resident.id)
    loadExistingFamilyMembers(resident.id)
  } catch (error) {
    console.error('EditResidentModal: Error in manual form population:', error)
  }
}

const handleSubmit = async () => {
  if (!props.resident) return
  
  try {
    // Update the main resident
    const updatedResident = await updateResident(props.resident.id, {
      name: form.name,
      house: form.house,
      cluster: form.cluster as 'Alium' | 'Boulevard',
      blok: form.blok || undefined,
      nikKtp: form.nikKtp || undefined,
      ktpFile: form.ktpFile || undefined,
      status: form.status,
      role: form.role,
      rtId: form.rtId,
      rwId: form.rwId,
    })
    
    // Create family members as new residents
    console.log('Creating family members:', familyMembers.value)
    for (const member of familyMembers.value) {
      if (member.name.trim() && member.relationship) {
        console.log('Creating family member:', member.name, 'for parent:', props.resident.id)
        const newMember = await createResident({
          name: member.name,
          house: form.house, // Same house as parent
          cluster: form.cluster as 'Alium' | 'Boulevard', // Same cluster as parent
          blok: form.blok, // Same blok as parent
          nikKtp: undefined, // Family members have their own NIK (not inherited)
          ktpFile: undefined, // Family members have their own KTP (not inherited)
          status: form.status, // Same status as parent
          role: form.role, // Same role as parent
          rtId: form.rtId, // Same RT as parent
          rwId: form.rwId, // Same RW as parent
          familyId: props.resident.id, // Link to parent
          relationship: member.relationship,
          age: member.age || undefined,
        })
        console.log('Family member created successfully:', newMember)
      }
    }
    
    // Emit success event to trigger refresh in parent component
    emit('success', updatedResident)
    close()
  } catch (error) {
    console.error('Error updating resident:', error)
    // Error handling is done in the composable
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Check if it's an image or PDF
    if (file.type.startsWith('image/')) {
      // Compress image before converting to base64
      compressImage(file, (compressedBase64) => {
        form.ktpFile = compressedBase64
        console.log('Image compressed and converted to base64:', file.name)
      })
    } else {
      // For PDF files, convert directly to base64 without compression
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        form.ktpFile = base64String
        console.log('PDF converted to base64:', file.name)
      }
      reader.readAsDataURL(file)
    }
  }
}

// Image compression function
const compressImage = (file: File, callback: (base64: string) => void) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    // Calculate new dimensions (max 800px width, maintain aspect ratio)
    const maxWidth = 800
    const maxHeight = 600
    let { width, height } = img
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }
    
    // Set canvas dimensions
    canvas.width = width
    canvas.height = height
    
    // Draw and compress
    ctx?.drawImage(img, 0, 0, width, height)
    
    // Convert to base64 with compression (0.8 quality)
    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
    callback(compressedBase64)
  }
  
  // Load the image
  const reader = new FileReader()
  reader.onload = (e) => {
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.ktpFile = ''
  console.log('Image removed')
}

const resetForm = () => {
  form.name = ''
  form.house = ''
  form.cluster = ''
  form.blok = ''
  form.nikKtp = ''
  form.ktpFile = ''
  form.status = 'active'
  form.role = 'Contract'
  form.rtId = ''
  form.rwId = ''
  familyMembers.value = []
  isFormPopulated.value = false
}

const close = () => {
  console.log('Edit modal close function called')
  resetForm()
  emit('close')
}

// Populate form when resident changes
watch(() => props.resident, (resident) => {
  console.log('EditResidentModal: Resident prop changed:', resident?.name)
  
  if (resident) {
    console.log('EditResidentModal: Populating form with resident data')
    
    // Try immediate population first
    populateForm(resident)
    
    // Also try with nextTick as fallback
    nextTick(() => {
      if (!isFormPopulated.value) {
        console.log('EditResidentModal: Retrying form population with nextTick')
        populateForm(resident)
      }
    })
  }
}, { immediate: true })

// Watch for modal open/close to reload family members
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.resident) {
    console.log('EditResidentModal: Modal opened, reloading family members for:', props.resident.id)
    // Small delay to ensure modal is fully rendered
    setTimeout(() => {
      loadExistingFamilyMembers(props.resident.id)
    }, 100)
  }
})


// Family member functions
const addFamilyMember = () => {
  familyMembers.value.push({
    name: '',
    relationship: '',
    age: null
  })
}

const removeFamilyMember = (index: number) => {
  familyMembers.value.splice(index, 1)
}

// Check if a family member is an existing member (already in database)
const isExistingFamilyMember = (member: { name: string; relationship: string; age: number | null }) => {
  // Find the resident in the database that matches this family member
  const existingResident = residents.value.find(r => 
    r.familyId === props.resident?.id && 
    r.name === member.name && 
    r.relationship === member.relationship &&
    r.age === member.age
  )
  return !!existingResident
}

// Get the ID of an existing family member
const getFamilyMemberId = (member: { name: string; relationship: string; age: number | null }) => {
  const existingResident = residents.value.find(r => 
    r.familyId === props.resident?.id && 
    r.name === member.name && 
    r.relationship === member.relationship &&
    r.age === member.age
  )
  return existingResident?.id
}

// Confirm delete family member
const confirmDeleteFamilyMember = (member: { name: string; relationship: string; age: number | null }) => {
  if (confirm(`Are you sure you want to delete "${member.name}" from the database? This action cannot be undone.`)) {
    const memberId = getFamilyMemberId(member)
    if (memberId) {
      deleteFamilyMember(memberId)
    }
  }
}

// Delete existing family member from database
const deleteFamilyMember = async (memberId: string) => {
  try {
    console.log('Deleting family member with ID:', memberId)
    await deleteResident(memberId)
    
    // Remove from local family members array
    const memberIndex = familyMembers.value.findIndex(member => 
      residents.value.find(r => r.id === memberId)?.name === member.name
    )
    if (memberIndex !== -1) {
      familyMembers.value.splice(memberIndex, 1)
    }
    
    // Refresh the residents list to update the main list
    await fetchResidents()
    
    console.log('Family member deleted successfully')
  } catch (error) {
    console.error('Error deleting family member:', error)
    alert('Failed to delete family member. Please try again.')
  }
}

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>