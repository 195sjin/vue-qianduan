<script setup>
import {
    Edit,
    Delete,
    InfoFilled
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "娱乐",
        "categoryAlias": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "军事",
        "categoryAlias": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getArticles()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getArticles()
}

//文章列表查询
import { articleCategoryListService, articleListService, articleAddService, articleDetailService, articleUpdateService, articleDeleteService } from '@/api/article.js'
const getArticleCategoryList = async () => {
    //获取所有分类
    let resultC = await articleCategoryListService();
    categorys.value = resultC.data
}

import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'

//文章列表查询
const getArticles = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);
    //渲染列表数据
    articles.value = result.data.items
    //为列表中添加categoryName属性
    for(let i=0;i<articles.value.length;i++){
        let article = articles.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(article.categoryId===categorys.value[j].id){
                article.categoryName=categorys.value[j].categoryName
            }
        }
    }
    //渲染总条数
    total.value=result.data.total
}
getArticleCategoryList();
getArticles()

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})

// 添加编辑相关变量
const editDrawerVisible = ref(false)
const editArticleModel = ref({
    id: '',
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})


import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();

//上传图片成功回调
const uploadSuccess = (img) => {
    //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
    articleModel.value.coverImg=img.data
}

//添加文章
const addArticle=async (state)=>{
    articleModel.value.state = state
    let result = await articleAddService(articleModel.value);
    ElMessage.success(result.message? result.message:'添加成功')
    //隐藏抽屉
    visibleDrawer.value=false
    //再次调用getArticles,获取文章
    getArticles()
    
}

// 文章详情相关变量
const detailDialogVisible = ref(false)
const articleDetail = ref({})

// 查看文章详情方法
const viewArticleDetail = async (id) => {
  try {
    const result = await articleDetailService(id)
    articleDetail.value = result.data
    
    // 添加文章分类名称
    for(let j=0;j<categorys.value.length;j++){
      if(articleDetail.value.categoryId === categorys.value[j].id){
        articleDetail.value.categoryName = categorys.value[j].categoryName
        break
      }
    }
    
    // 确保coverImg字段存在
    if(!articleDetail.value.coverImg){
      articleDetail.value.coverImg = ''
    }
    
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

// 打开编辑抽屉方法
const openEditDrawer = async (id) => {
  try {
    const result = await articleDetailService(id)
    const articleData = result.data
    // 填充编辑表单数据
    editArticleModel.value = {
      id: articleData.id,
      title: articleData.title,
      categoryId: articleData.categoryId,
      coverImg: articleData.coverImg || '',
      content: articleData.content,
      state: articleData.state
    }
    editDrawerVisible.value = true
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  }
}

// 更新文章方法
const updateArticle = async (state) => {
  try {
    const updateModel = {
      ...editArticleModel.value,
      state: state
    }
    const result = await articleUpdateService(updateModel)
    ElMessage.success(result.message || '更新成功')
    // 关闭抽屉
    editDrawerVisible.value = false
    // 刷新文章列表
    getArticles()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

// 编辑时上传图片成功回调
const editUploadSuccess = (img) => {
  editArticleModel.value.coverImg = img.data
}

// 删除文章方法
const deleteArticle = async (id) => {
  try {
    // 显示确认对话框
    const confirmResult = await ElMessageBox.confirm(
      '确定要删除这篇文章吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    if (confirmResult === 'confirm') {
      // 用户点击了确定按钮
      const result = await articleDeleteService(id)
      ElMessage.success(result.message || '删除成功')
      // 刷新文章列表
      getArticles()
    }
  } catch (error) {
    // 如果是用户取消操作，不显示错误提示
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" style="width: 180px;">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width: 180px;">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getArticles">搜索</el-button>
                <el-button @click="categoryId='';state='';getArticles()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            // 修改操作列的模板代码
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button :icon="InfoFilled" circle plain type="info" @click="viewArticleDetail(row.id)"></el-button>
                <el-button :icon="Edit" circle plain type="primary" @click="openEditDrawer(row.id)"></el-button>
                <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row.id)"></el-button>
              </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10 ,15, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />


        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px">
                <el-form-item label="文章标题">
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">


                    <!-- 
                    
                    auto-upload:是否自动上传

                    action: 服务器接口路径

                    name: 上传的文件字段名

                    headers: 设置上传的请求头

                    on-success: 上传成功的回调函数
                    
                    -->



                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="/api/upload"
                    name="file"
                    :headers="{'Authorization':tokenStore.token}"
                    :on-success="uploadSuccess"
                    >
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <!-- 文章详情弹窗 -->
        <el-dialog v-model="detailDialogVisible" title="文章详情" width="50%">
          <el-form :model="articleDetail" label-width="100px">
            <el-form-item label="文章标题">
              <el-input v-model="articleDetail.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
              <el-input v-model="articleDetail.categoryName" disabled></el-input>
            </el-form-item>
            <el-form-item label="发表时间">
              <el-input v-model="articleDetail.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="articleDetail.state" disabled></el-input>
            </el-form-item>
            <el-form-item label="封面图片">
              <img v-if="articleDetail.coverImg" :src="articleDetail.coverImg" style="width: 200px; height: 150px; object-fit: cover;">
              <span v-else>无封面图片</span>
            </el-form-item>
            <el-form-item label="文章内容">
              <div v-html="articleDetail.content" style="min-height: 200px;"></div>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!-- 编辑文章抽屉 -->
        <el-drawer v-model="editDrawerVisible" title="编辑文章" direction="rtl" size="50%">
          <el-form :model="editArticleModel" label-width="100px">
            <el-form-item label="文章标题">
              <el-input v-model="editArticleModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
              <el-select placeholder="请选择" v-model="editArticleModel.categoryId">
                <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章封面">
              <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                action="/api/upload"
                name="file"
                :headers="{'Authorization':tokenStore.token}"
                :on-success="editUploadSuccess"
              >
                <img v-if="editArticleModel.coverImg" :src="editArticleModel.coverImg" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
              <div class="editor">
                <quill-editor theme="snow" v-model:content="editArticleModel.content" contentType="html"></quill-editor>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateArticle('已发布')">发布</el-button>
              <el-button type="info" @click="updateArticle('草稿')">保存为草稿</el-button>
            </el-form-item>
          </el-form>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>