<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="registerForm" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="registerRules">
                <el-form-item>
                    <h1>用户注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="loginForm" size="large" autocomplete="off" v-else :model="loginData" :rules="loginRules">
                <el-form-item>
                    <h1>用户登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <!-- 添加校验码 -->
                <el-form-item prop="captcha">
                    <div class="captcha-container">
                        <el-input :prefix-icon="Key" placeholder="请输入校验码" v-model="loginData.captcha"></el-input>
                        <canvas ref="captchaCanvas" @click="refreshCaptcha" class="captcha-canvas"></canvas>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import { User, Lock, Key } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
//导入消息提示组件
import { ElMessage } from 'element-plus'
//控制注册与登录表单的显示， 默认显示登录
const isRegister = ref(false)

// 登录表单数据
const loginData = ref({
    username: '',
    password: '',
    captcha: ''
})
// 注册表单数据
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

// 验证码相关
const captchaCode = ref('')
const captchaCanvas = ref(null)

// 表单引用 - 移到前面定义
const registerForm = ref(null)
const loginForm = ref(null)

// 校验密码的函数 - 移到rules定义前
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value != registerData.value.password) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}

// 校验验证码
const checkCaptcha = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入校验码'))
    } else if (value.toLowerCase() !== captchaCode.value.toLowerCase()) {
        callback(new Error('校验码不正确'))
    } else {
        callback()
    }
}

// 注册表单校验规则 - 在checkRePassword之后定义
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

// 登录表单校验规则
const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入校验码', trigger: 'blur' },
        { validator: checkCaptcha, trigger: 'blur' }
    ]
}

// 生成验证码
const generateCaptcha = () => {
    if (!captchaCanvas.value) return

    const canvas = captchaCanvas.value
    const ctx = canvas.getContext('2d')
    canvas.width = 120
    canvas.height = 40

    // 生成随机字符串
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjklmnpqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    captchaCode.value = code

    // 绘制背景
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.stroke()
    }

    // 绘制干扰点
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        ctx.beginPath()
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI)
        ctx.fill()
    }

    // 绘制验证码
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < code.length; i++) {
        ctx.fillStyle = `rgb(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50})`
        ctx.fillText(code.charAt(i), 30 + i * 20, canvas.height / 2, 20)
    }
}

// 刷新验证码
const refreshCaptcha = () => {
    generateCaptcha()
}

// 组件挂载时生成验证码
onMounted(() => {
    generateCaptcha()
})

//调用后台接口，完成注册和登录
import { userRegisterService, userLoginService } from '@/api/user.js'

const register = async () => {
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.msg ? result.msg : '注册成功')
}

// 导入路由和token状态
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

const router = useRouter();
const tokenStore = useTokenStore();

// 登录函数
const login = async () => {
    // 验证表单
    try {
        await loginForm.value.validate()
        // 验证码正确，提交登录请求
        const loginParams = {
            username: loginData.value.username,
            password: loginData.value.password
        }
        let result = await userLoginService(loginParams)
        // 保存token
        tokenStore.setToken(result.data)
        ElMessage.success(result.msg ? result.msg : '登录成功')
        // 登录成功，跳转页面
        router.push('/')
    } catch (error) {
        // 验证失败
        console.log(error)
    }
}

// 定义函数，清空数据模型的数据
const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }
    // 切换到登录表单时刷新验证码
    if (!isRegister.value) {
        refreshCaptcha()
    }
}
</script>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}

.captcha-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.captcha-canvas {
    width: 120px;
    height: 40px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
</style>