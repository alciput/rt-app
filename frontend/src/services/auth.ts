import { ref } from 'vue'

export type Role = 'Contract' | 'Owner'
export interface UserInfo {
	id: string
	name: string
	role: Role
}

const user = ref<UserInfo | null>({ id: 'u1', name: 'Owner User', role: 'Owner' })

export function useAuth() {
	function signInWithGoogle() {
		user.value = { id: 'u2', name: 'Google User', role: 'Contract' }
		// Store token for API requests
		localStorage.setItem('auth_token', 'mock-jwt-token-u2')
	}
	function signInWithMicrosoft() {
		user.value = { id: 'u3', name: 'MS User', role: 'Owner' }
		// Store token for API requests
		localStorage.setItem('auth_token', 'mock-jwt-token-u3')
	}
	function signOut() {
		user.value = null
		localStorage.removeItem('auth_token')
	}
	
	// Initialize with admin token
	if (!localStorage.getItem('auth_token')) {
		localStorage.setItem('auth_token', 'mock-jwt-token-u1')
	}
	
	return { user, signInWithGoogle, signInWithMicrosoft, signOut }
}
