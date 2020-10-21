$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间'
            }
        }
    })

    initUserInfo()

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息获取失败！')
                }
                // console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置（清空）行为
        e.preventDefault()
        // 重新获取用户信息并填充表单即可
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息更新失败！')
                }
                layer.msg('用户信息更新成功！')

                // 调用父页面中的方法，重新渲染用户的头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})