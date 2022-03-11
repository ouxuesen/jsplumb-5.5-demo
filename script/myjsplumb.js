
import { columnActiveNodeDic, lineActiveNodeDic, changeID, splitD } from './helight.js'

function myJspulmb(opt) {
  this.instance = jsPlumbBrowserUI.newInstance({
    container: document.getElementById('jsplumbApp')
  })
  this.relations = opt.relations || []
  this.nodes = opt.nodes || []
  this.registerConnectionTypes()
  this.instance.importDefaults(this.baseNodeConfig())
}
myJspulmb.prototype.init = function () {
  // let mapDic = {
  //   "Origin": "Right",
  //   "Middle": "Left,Right",
  //   "RS": "Left"
  // }
  // this.nodes.forEach(node => {
  //   node.columns.forEach(column => {
  //     let anchors = (mapDic[node.type] || "Right").split(',')
  //     anchors.forEach(anchor => {
  //       this.addEndpoint($(`#${changeID(column.id)}`)[0], anchor,changeID(column.id))
  //     })
  //   })
  // })
  this.relations.forEach(relation => {
    let source = $(`#${changeID(relation.source)}`)[0]
    let target = $(`#${changeID(relation.target)}`)[0]
    this.connect(source, target)

    // this.connectEndpoint(`${changeID(relation.source)}-Right`,`${changeID(relation.target)}-Left`)
  });

  let that = this
  this.addeventFun(this.instance)
  // this.instance.selectEndpoints().setHover(true);
}
//元素可拖动
myJspulmb.prototype.draggable = function (element) {
}
//获取基本配置
myJspulmb.prototype.baseNodeConfig = function () {
  return {
    anchor: "Bottom",
    anchors: [null, null],
    connectionsDetachable: false,
    endpoint: "Dot",
    endpointOverlays: [],
    endpoints: [{
      type: "Dot",
      options: {
        radius: 2,
      }
    }, {
      type: "Dot",
      options: {
        radius: 2,
      }
    }],
    endpointStyle: { fill: "#456", },
    endpointStyles: [null, null],
    endpointHoverStyle: null,
    endpointHoverStyles: [null, null],
    hoverPaintStyle: null,
    listStyle: {},
    maxConnections: -1,
    paintStyle: { strokeWidth: 2, stroke: "#e2e2e2" },
    reattachConnections: false,
    scope: "jsplumb_defaultscope",
    allowNestedGroups: true,
  }
}
//设置endPoint
myJspulmb.prototype.addEndpoint = function (element, anchor, id) {
  this.instance.addEndpoint(element, {
    anchor: anchor,
    endpoint: {
      type: "Dot",
      options: {
        radius: 2
      },
    },
    uuid: `${id}-${anchor}`,
    paintStyle: {
      fill: 'blue',
      outlineStroke: 'red',
      outlineWidth: 5,
      strokeWidth: 2,
      stroke: 1
    },
    hoverPaintStyle: {
      fill: 'red',
      outlineStroke: 'blue',
      outlineWidth: 5,
      strokeWidth: 2,
      stroke: 1
    }
  })
}

//连线EndPoint
myJspulmb.prototype.connectEndpoint = function (from, to) {
  let connect = this.instance.connect({
    uuids: [from, to],
    connector: {
      type: "Bezier",
      options: {
        curviness: 50,
      }

    },
    overlays: [
      {
        type: "Arrow", options: {
          location: 1, width: 8,
          length: 8,
        }
      }]
  })
}

//直接连线
myJspulmb.prototype.connect = function (from, to) {
  let connect = this.instance.connect({
    source: from,
    target: to,
    anchor: ['Right', "Left"],
    isSource: false,
    isTarget: false,
    connector: {
      type: "Bezier",
      options: {
        curviness: 50,
      }

    },
    overlays: [
      {
        type: "Arrow", options: {
          location: 1, width: 8,
          length: 8,
        }
      }]
  })
}
//添加分组
myJspulmb.prototype.addGroup = function (group, gropID) {
  this.instance.addGroup({
    el: group,
    id: gropID,
    collapsed: false,
    droppable: false,
    anchor: "BottomLeft",
    endpoint: { type: "Dot", options: { width: 10, height: 10 } }
  });
}
//分组
myJspulmb.prototype.addToGroup = function (group, element) {
  this.instance.addToGroup(group, element);
}
myJspulmb.prototype.addToDragGroup = function (group, element) {
  this.instance.addToDragGroup(group, element);
}
myJspulmb.prototype.addToDragSelection = function (elements) {
  this.instance.addToDragSelection(elements);
}
myJspulmb.prototype.toggleGroupAll = function () {
  let that = this
  this.instance.groupManager.getGroups().forEach(group => {
    that.toggleGroup(group)
  })
},
  //折叠和扩展组#
  myJspulmb.prototype.toggleGroup = function (aGroup, elem) {
    aGroup = this.instance.getGroup(aGroup)
    if (!aGroup.collapsed) {
      this.collapseGroup(aGroup)
      if (elem) {
        elem.innerHTML = '+'
        this.instance.addClass(elem, 'normal')
        this.instance.removeClass(elem, "helight")
      }
    } else {
      this.expandGroup(aGroup)
      if (elem) {
        elem.innerHTML = '-'
        this.instance.addClass(elem, 'helight')
        this.instance.removeClass(elem, 'normal')
      }
    }
    this.instance.groupManager.repaintGroup(aGroup)
  }
myJspulmb.prototype.collapseGroup = function (aGroup) {
  this.instance.collapseGroup(aGroup)

}
myJspulmb.prototype.expandGroup = function (aGroup) {
  this.instance.expandGroup(aGroup)
}
//设置高亮颜色type
myJspulmb.prototype.registerConnectionTypes = function () {
  this.instance.registerConnectionTypes({
    "default": {
      paintStyle: { strokeWidth: 2, stroke: "#e2e2e2" },
      hoverPaintStyle: { stroke: "#e2e2e2", strokeWidth: 2 },
      // cssClass: "connector-normal"
    },
    "selected": {
      paintStyle: { stroke: "red", strokeWidth: 2 },
      hoverPaintStyle: { strokeWidth: 2, stroke: "red" },
      // cssClass: "connector-selected"
    }
  });
}
//切换高亮颜色
myJspulmb.prototype.setType = function (activeNodesDic, select) {
  let selectCon = this.instance.getConnections().filter(connection => { return activeNodesDic.relations.join('|').indexOf(connection.source.id + splitD + connection.target.id) != -1 })
  selectCon.forEach(connection => {
    connection.setType(select ? "selected" : "default")
    this.instance.repaint(connection.source)
  })
  activeNodesDic.elements.forEach(({
    columnID
  }) => {
    document.getElementById(columnID).style.backgroundColor = select ? "#faebd7" : "#fff"
  });
}
myJspulmb.prototype.setElementHelight = function (id, select) {
  this.setType(columnActiveNodeDic(id, select, this.relations), select)
}

//添加事件 高亮

myJspulmb.prototype.addeventFun = function (element) {

  let that = this
  // (sourceId, targetId, select,relations)
  element.bind(jsPlumbBrowserUI.EVENT_CONNECTION_MOUSEOVER, (connect) => {
    if (connect.source.id && connect.target.id) {
      let temp = lineActiveNodeDic(connect.source.id, connect.target.id, true, this.relations)
      that.setType(temp, true)
    }
  })
  element.bind(jsPlumbBrowserUI.EVENT_CONNECTION_MOUSEOUT, (connect) => {
    if (connect.source.id && connect.target.id) {
      let temp = lineActiveNodeDic(connect.source.id, connect.target.id, true, this.relations)
      that.setType(temp, false)
    }
  })
}
export default myJspulmb