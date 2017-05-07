define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user.html',
  'modules/user/user-detail.view',
  'modules/user/user-edit.view',
  'modules/user/user.model'
], function($, _, Backbone, Marionette, userTemplate, DetailView, EditView, UserModel) {
  return Marionette.View.extend({
    template: userTemplate,
    ui: {
      form: 'form',
      grid: '.datagrid'
    },
    events: {
      'click .btn-search': 'doSearch'
    },
    initialize: function(options) {
      console.log('UserView initialize.');
      // 初始化一个UserModel，以方便启用、停用操作时使用
      this.userModel = new UserModel();
    },
    onRender: function() {
      console.log('UserView is rendered.');
      this.gridView = new Marionette.DatagridView({
        // 让DatagridView 在 this.ui.grid 中渲染
        el: this.ui.grid,
        // 绑定this.model到datagridView
        model: this.model,
        // jquery.easyui datagrid的参数
        // 由于DatagridView做了默认配置，一般情况，只需传递columns即可
        gridOptions: {
          columns:[[
            {field: 'name', title: '名称', width: 200},
            {field: 'tel', title: '电话号码', width: 200},
            {field: 'status', title: '用户状态', width: 80, align: 'center', formatter: function(value) {
              return value == 1 ? '有效' : '<span class="text-danger">已停用<span>'
            }},
            {field: 'createDate', title: '创建时间', align: 'right', width: 200},
            {field: '_opt', title: '操作', align: 'center', width: 180, buttons: [
              {label: '编辑', handler: _.bind(this.doEdit, this)},
              {label: '详情', handler: _.bind(this.showDetail, this)},
              {handler: _.bind(this.doEnableOrDisable, this), formatter: function(value, row, index) {
                return row.status == 1 ? '停用' : '启用'
              }}
            ]}
          ]]
        }
      }).render();
    },
    doSearch: function() {
      // Get query params
      var queryParams = this.queryParams = Backbone.Syphon.serialize(this.ui.form);
      // fetch data
      this.reload(queryParams);
    },
    showDetail: function(rowData, rowIndex) {
      if (this.detailView) {
        this.detailView.model.set(rowData)
      } else {
        this.detailView = new DetailView({model: new UserModel(rowData)}).render();
      }
    },
    doEdit: function(rowData, rowIndex) {
      var editView = this.editView;
      if (editView) {
        editView.model.set(rowData)
      } else {
        editView = this.editView = new EditView({model: new UserModel(rowData)}).render();
        // 数据修改后，刷新列表视图
        editView.on('user:updated', _.bind(this.reload, this))
      }
    },
    doEnableOrDisable: function(rowData, rowIndex) {
      var that = this;
      var userModel = this.userModel;
      var msg = '你确定要' + (rowData.status == 1 ? '停用' : '启用') + '该用户吗？'
      userModel.set(rowData);

      $.confirm('提示', msg, function(r) {
        if (r) {
          // 发送一个patch请求，修改用户status
          userModel.save({'status': rowData.status == 1 ? 0 : 1}, {patch: true})
            .done(_.bind(that.reload, that))
        }
      })
    },
    reload: function(queryParams) {
      this.gridView.fetch(queryParams || this.queryParams)
    }
  })
});
