import request from '@/utils/request.js'
//提供调用注册接口的函数
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