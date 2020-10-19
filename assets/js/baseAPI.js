// 每次调用$.get()或$.post()或$.ajax()时，都会调用这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // console.log(options.url);

    // 统一为有权限的接口，设置 headers 请求头
    // 先判断，包含/my/的接口才需要
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载comple函数
    options.complete = function (res) {
        console.log(res);
        // 在complete回调函数中可以使用res.responseJSON拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页
            location.href = '/login.html'
        }
    }
})