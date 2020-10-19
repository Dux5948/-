$(function () {
    // 点击“去注册账号的链接”
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录的链接”
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()这个函数来自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // ajax的post请求第二个参数提取出来
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        // 发起ajax的post请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                // layui的内置方法
                return layer.msg(res.message)
            }
            layer.msg('注册成功！');
            // 模拟人的点击行为（获取a链接-->点击事件）
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 登录之后服务器返回的token值，保存到localStoraga中（控制台application中）
                // token是用来做身份认证的-->有权限的接口，以请求头的方式发送到后台
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }

        })
    })
})