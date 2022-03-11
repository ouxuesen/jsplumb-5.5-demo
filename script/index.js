import myJspulmb from './myjsplumb.js'
import { changeID } from './helight.js'
$(function () {
    // 获取测试数据
    function getTemplate(node) {
        return $('#tpl-Origin').html();
    }
    // let url = "http://10.8.8.26:4000/api/getBBColumens"
    // let params = JSON.stringify({ "bbnames": ["对公信贷业务借据", "个人信贷分户账", "个人信贷分户账明细记录", "个人信贷业务借据", "对公信贷分户账"] })
    // $.ajax({
    //     url: url,
    //     dataType: "json",
    //     contentType: 'application/json;charset=UTF-8',
    //     async: true, //true:异步,false:同步
    //     data: params,
    //     type: "POST",
    //     headers: {
    //     },
    //     timeout: 30 * 1000, //请求时间
    //     beforeSend: function () {
    //         //请求前的处理
    //     },
    //     complete: function (result) {
    //         debugger
    //     },
    //     error: function (error) {
    //     }
    // })
    $.get('../data/test.json', function (data, status) {
        if (status == 'success') {
            // jsplumbJson = data
            jmpumbreRelations(data.nodes, data.relations)
        }
    })
    var $container = $('#jsplumbApp')
    //处理数据
    function createNodes(nodeList, myJsplumb) {
        nodeList.forEach(function (item, key) {
            item.id = changeID(item.id)
            var data = {
                id: item.id,
                name: item.name,
                top: item.top * 1.5,
                left: item.left * 1.5,
                type: item.type
            };
            // myJsplumb.addToDragSelection($(`#${item.id}`)[0])
            //根据不同类型的表获取各自的模板并填充数据
            var template = getTemplate(item);
            // template.addClass(`panel-node-${item.type}`);
            $container.append(Mustache.render(template, data));
            //根据json数据添加表的每个列
            //将类数组对象转换为真正数组避免前端报错 XX.forEach is not a function
            item.columns = Array.from(item.columns);
            var ul = $('#' + item.id);
            myJsplumb.addGroup($(`#${item.id}`)[0], item.id)
            item.columns.forEach(col => {
                //这里li标签的id应该和 addEndpointOfXXX方法里的保持一致 col-group-item
                var li = $("<li id='id-col' class='panel-node-list' >col_replace</li>");
                li[0].id = changeID(col.id)
                li[0].innerText = col.name;
                li.mouseover(function (el) {
                    // li.css("background-color", "#faebd7");
                    myJsplumb.setElementHelight(this.id, true)
                });
                li.mouseout(function (el) {
                    myJsplumb.setElementHelight(this.id, false)
                });
                myJsplumb.draggable(li[0], false)
                // ul.append(li);
                myJsplumb.addToGroup(item.id, li[0])
            });
        });

    }
    //jmpumb
    function jmpumbreRelations(nodes, relations) {
        var myJsplumb = new myJspulmb({
            relations,
            nodes
        })
        createNodes(nodes, myJsplumb)
        myJsplumb.init()
        myJsplumb.toggleGroupAll()
        $(".group-toggle").click(function (e) {
            e.preventDefault();
            let gropEl = this.parentNode
            myJsplumb.toggleGroup(gropEl.id, this)
        });
    }
})