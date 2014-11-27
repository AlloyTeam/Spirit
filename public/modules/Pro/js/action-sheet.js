(function( $, pro ) {
    /*底部浮层组件
    * 
    * 调用示例：by gctang
    * pro.actionSheet.show({
    *   content: ['value1','value2'], // 或以'<li>value1</li><li>value2</li>>'的字符串形式传入
    *   binHandle: [function(){}, function(){}]//需与content一一对应
    *})
    * or 高级配置用法：
    * pro.actionSheet.show({
    *   content: [
    *       {
    *           id: 'testId',//给节点添加自定义id
    *           className: 'ui-clor-red',//添加自己的样式
    *           value: 'value1' //展示的值
    *           cmd: 'customEvent1' //自定义事件名
    *       },
    *       {
    *           value: 'value2',
    *           cmd: 'customEvent2' //自定义事件名
    *       }
    *    ],
    *    customEvent1: function(){
    *        //自定义事件 do something
    *    }
    * })
    */
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
            }else{
                this.$el.find('.content').html(options.content);
            } 
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);
                var command = $btn.data('cmd');

                $btn.active(function(){
                    var fu = null;
                    var index = -1;
                    if(command === 'as-cancel'){
                        index = self.$el.find('.content').children().length;
                    }else{
                        index = $btn.index();
                    }
                   
                    if($btn.data('dismiss')){
                        self.hide();    // 点击后隐藏action-sheet
                    } 

                    if(self.options.btnHandle.length > 0){
                        fn = self.options.btnHandle[index];
                        $.isFunction( fn ) && fn();
                    } else if($.isFunction( self.options[command] )){
                        self.options[command]();
                    }
                });
            });
        }
    }, true);
})(Zepto, pro);
