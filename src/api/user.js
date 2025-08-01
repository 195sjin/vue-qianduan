import request from '@/utils/request';

// 更新用户密码
export function updateUserPassword(data) {
  return request({
    url: '/user/updatePwd',
    method: 'patch',
    data: {
      old_Pwd: data.old_Pwd,
      new_Pwd: data.new_Pwd,
      re_Pwd: data.re_Pwd
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// 其他用户相关API...
export const userRegisterService = (registerData)=>{
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/user/register',params);
}
//提供调用登录接口的函数
export const userLoginService=(loginData)=>{

    const params=new URLSearchParams();
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/user/login',params)
}
//获取个人信息
export const userInfoGetService = ()=>{
    return request.get('/user/userInfo');
}
//修改个人信息
export const userInfoUpdateService = (userInfo)=>{
    return request.put('/user/update',userInfo)
}
//修改头像
export const userAvatarUpdateService=(avatarUrl)=>{
    let params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/user/updateAvatar',params)
}