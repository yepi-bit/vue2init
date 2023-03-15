/* 2017-12-5 10:47:33 | 修改 木遥 */
//工具栏汉化

L.drawLocal.draw.toolbar.actions = { title: '取消绘制', text: '取消' };
L.drawLocal.draw.toolbar.finish = { title: '完成绘制', text: '完成' };
L.drawLocal.draw.toolbar.undo = { title: '删除最后一个绘制的点', text: '删除最后的点' };
L.drawLocal.draw.toolbar.buttons = { polyline: '绘制折线', polygon: '绘制多边形', rectangle: '绘制矩形', circle: '绘制圆', marker: '标点' };

L.drawLocal.edit.toolbar.actions.save = { title: '保存修改.', text: '保存' };
L.drawLocal.edit.toolbar.actions.cancel = { title: '取消编辑，丢弃所有的修改', text: '取消' };
L.drawLocal.edit.toolbar.actions.clearAll = { title: '刪除所有要素', text: '刪除所有' };
L.drawLocal.edit.toolbar.buttons = { edit: '编辑要素', editDisabled: '没有需要编辑的要素', remove: '删除要素', removeDisabled: '没有需要删除的要素' };


L.drawLocal.draw.handlers.circle = { tooltip: { start: '单击并拖动到绘制圆' }, radius: '半径' };
L.drawLocal.draw.handlers.marker = { tooltip: { start: '单击地图标记点' } };
L.drawLocal.draw.handlers.polygon = { tooltip: { start: '单击开始绘制形状', cont: '单击继续绘制形状', end: '单击继续绘制，双击完成绘制' } };
L.drawLocal.draw.handlers.polyline = { error: '<strong>错误:</strong> 面积边缘不可交叉!', tooltip: { start: '单击开始画线', cont: '单击继续画线', end: '单击继续画线,双击完成绘制' } };
L.drawLocal.draw.handlers.rectangle = { tooltip: { start: '单击并拖动绘制矩形' } };
L.drawLocal.draw.handlers.simpleshape = { tooltip: { end: '释放鼠标完成绘图' } };
L.drawLocal.edit.handlers.edit = { tooltip: { text: '拖动标记或白色小框进行编辑修改', subtext: '' } };
L.drawLocal.edit.handlers.remove = { tooltip: { text: '单击目标进行删除' } };
