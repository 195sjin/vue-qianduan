<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import {ref} from 'vue'
import avatar from '@/assets/default.png'
const uploadRef = ref()

//读取用户信息
import {useUserInfoStore} from '@/stores/userinfo.js'
const userInfoStore = useUserInfoStore()


//读取token信息
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore()

//用户头像地址
const imgUrl=ref(userInfoStore.info.userPic)
//图片上传成功的回调
const uploadSuccess = (result)=>{
    //回显图片
    imgUrl.value = result.data
}

//调用接口，更新头像url
import {userAvatarUpdateService} from '@/api/user.js'
import {ElMessage} from 'element-plus'
const updateAvatar = async ()=>{
    let result = await userAvatarUpdateService(imgUrl.value)
    ElMessage.success(result.message? result.message:'修改成功')
    //更新pinia中的数据
    userInfoStore.info.userPic=imgUrl.value
}


</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload ref="uploadRef" class="avatar-uploader" :show-file-list="false" :auto-upload="true" action="/api/upload"
                    name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <img v-else :src="avatar" width="278" />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"
                    @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>