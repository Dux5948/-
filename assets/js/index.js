$(function () {
    // 获取用户的基本信息
    getUserInfo()

    var layer = layui.layer

    // 点击退出按钮实现退出功能
    $('#btnLogout').on('click', function () {
        // 弹出提示消息框，提示用户是否确认退出
        layer.confirm('确定退出登录？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭对应的弹出层confirm询问框（自带的不用管）
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        // 有权限要求的接口
        url: '/my/userinfo',
        // headers就是请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('用户信息获取失败！')
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data)
        },
        /* // 不论成功还是失败都会调用complete回调函数
         complete: function (res) {
            // console.log(res);
            // 在complete回调函数中可以使用res.responseJSON拿到服务器响应的数据
            if (res.responseJSON.status === 1 && res.responseJSON.massage === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')
                // 强制跳转到登录页
                location.href = '/login.html'
            }
        }  */
    })
}
// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有图片头像则渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}