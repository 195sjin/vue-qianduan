import { createRouter, createWebHistory } from 'vue-router';
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import ArticleCategoryVue from '@/views/article/ArticleCategory.vue';
import ArticleManageVue from '@/views/article/ArticleManage.vue';
import UserInfoVue from '@/views/user/UserInfo.vue';
import UserAvatarVUe from '@/views/user/UserAvatar.vue';
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue';

const routes = [
    { path: '/login', component: LoginVue },
    { path: '/', component: LayoutVue, redirect: '/article/manage',
        children: [
            { path: '/article/category', component: ArticleCategoryVue },
            { path: '/article/manage', component: ArticleManageVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVUe },
            { path: '/user/resetPassword', component: UserResetPasswordVue,
                meta: { requiresAuth: true, title: '更新密码' }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;