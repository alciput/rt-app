import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DashboardPage from '@/pages/DashboardPage.vue'
import ResidentsPage from '@/pages/ResidentsPage.vue'
import AnnouncementsPage from '@/pages/AnnouncementsPage.vue'
import IuranPage from '@/pages/IuranPage.vue'
import SuratPage from '@/pages/SuratPage.vue'
import TestFamilyPage from '@/pages/TestFamilyPage.vue'
import TestEditPage from '@/pages/TestEditPage.vue'
import TestUpdatePage from '@/pages/TestUpdatePage.vue'
import TestFileUpload from '@/pages/TestFileUpload.vue'
import { useAuth } from '@/services/auth'

const routes: RouteRecordRaw[] = [
	{ path: '/', name: 'dashboard', component: DashboardPage },
	{ path: '/residents', name: 'residents', component: ResidentsPage, meta: { roles: ['Owner'] } },
	{ path: '/announcements', name: 'announcements', component: AnnouncementsPage, meta: { roles: ['Contract', 'Owner'] } },
	{ path: '/iuran', name: 'iuran', component: IuranPage, meta: { roles: ['Owner'] } },
	{ path: '/surat', name: 'surat', component: SuratPage, meta: { roles: ['Contract', 'Owner'] } },
	{ path: '/test-family', name: 'test-family', component: TestFamilyPage },
	{ path: '/test-edit', name: 'test-edit', component: TestEditPage },
	{ path: '/test-update', name: 'test-update', component: TestUpdatePage },
	{ path: '/test-upload', name: 'test-upload', component: TestFileUpload },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to) => {
	const { user } = useAuth()
	const allowed = (to.meta?.roles as string[] | undefined)
	if (!allowed) return true
	if (!user.value) return { name: 'dashboard' }
	return allowed.includes(user.value.role) || { name: 'dashboard' }
})

export default router
