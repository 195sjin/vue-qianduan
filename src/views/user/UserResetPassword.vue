<template>
  <div class="update-password-container">
    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>更新密码</span>
        </div>
      </template>

      <el-form ref="passwordFormRef" :model="passwordForm" :rules="rules" label-width="120px">
        <el-form-item label="原密码" prop="old_pwd">
          <el-input v-model="passwordForm.old_pwd" type="password" placeholder="请输入原密码" />
        </el-form-item>

        <el-form-item label="新密码" prop="new_pwd">
          <el-input v-model="passwordForm.new_pwd" type="password" placeholder="请输入新密码" />
        </el-form-item>

        <el-form-item label="确认新密码" prop="re_pwd">
          <el-input v-model="passwordForm.re_pwd" type="password" placeholder="请再次输入新密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpdatePassword">确认更新</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { updateUserPassword } from '@/api/user';
import { useRouter } from 'vue-router';

// 表单数据
const passwordForm = reactive({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
});

// 表单引用
const passwordFormRef = ref(null);

// 表单规则
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码长度应在5-16个字符之间', trigger: 'blur' }
    // 移除了密码必须包含字母和数字的验证规则
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== passwordForm.new_pwd) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
};

// 初始化路由
const router = useRouter();

// 处理密码更新
const handleUpdatePassword = () => {
  passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await updateUserPassword({
          old_Pwd: passwordForm.old_pwd,
          new_Pwd: passwordForm.new_pwd,
          re_Pwd: passwordForm.re_pwd
        });
        if (response.code === 0) {
          ElMessage.success('密码更新成功，请重新登录');
          resetForm();
          router.push('/login');  // 取消注释，启用自动跳转
        } else {
          ElMessage.error(response.message || '密码更新失败');
        }
      } catch (error) {
        // 打印详细错误信息
        ElMessage.error('更新密码失败: ' + (error.message || JSON.stringify(error)));
        console.error('Update password error:', error);
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  passwordFormRef.value.resetFields();
};
</script>

<style scoped>
.update-password-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.password-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>