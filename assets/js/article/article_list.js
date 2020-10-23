$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // console.log(res);
                // console.log(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 使用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // console.log(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render()方法来渲染分类的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            // 自定义分页排版（查询文档）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 修改每页显示条数
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调函数
            // 触发jump回调的方法有两种：
            // 1.点击页码时
            // 2.只要调用了laypage.render()这个方法（死循环原因）
            // 用第二种方法触发jump回调，first值为true。
            // 用第一种方法触发，first值为undefined。
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize
                // 调用initTable()后即可按照最新的条目数渲染
                q.pagesize = obj.limit
                // console.log(obj.limit); //得到每页显示的条数
                // 根据最新的 q 获取对应的数据列表并渲染表格
                if (!first) {
                    initTable()
                }
                //initTable() //直接这样写会死循环
            }
        })
    }

    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        console.log(len);
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否确认要删除
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 当数据删除完成后，需要判断当前页中是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值先-1
                    // 再重新调用initTable()
                    // 如果len的值等于1，那么删除完毕后当前页面上就没有数据了
                    if(len === 1) {
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index);
                }
            })
        });
    })
})