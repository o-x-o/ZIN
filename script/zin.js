    var ZIN = {

        _ctrls: [],
        _default: null,
        _container: "",
        _isGo: false,
        _stack: [],

        curStack: function(){
            return this._stack[this._stack.length-1];
        },
        preStack: function(){
            return this._stack.length>1?this._stack[this._stack.length-2]:null;
        },
        find: function (key, value) {
            var ctrl = null;
            for (var i = 0, len = this._ctrls.length; i < len; i++) {
                if (this._ctrls[i][key] === value) {
                    ctrl = this._ctrls[i];
                    break;
                }
            }
            return ctrl;
        },

        init: function (ctrls, defaulter, container) {
            var self = this;
            self._default=defaulter;
            self._container=container;
            self.format(ctrls);

            $(window).on('hashchange', function (e) {

                var _isBack = !self._isGo;
                self._isGo = false;
                if (!_isBack) {
                    return;
                }

                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';

                /* 页面返回 load方法不会执行 
                var found = null;
                for(var i = 0, len = self._stack.length; i < len; i++){
                    var stack = self._stack[i];
                    if (stack.ctrl.url === url) {
                        found = stack;
                        break;
                    }
                }
                if (found) {
                    self.back(); 
                    return;
                }
                */

                go();
            });

            function go(){
                var url = location.hash.indexOf('#') === 0 ? location.hash.split("?")[0] : '#';
                var param = decodeURI(location.search&&location.search.split("?")[1] + "&" + location.hash.split("?")[1]||"").split(/[?&#]/);
                var ctrl = self.find('url', url) || self.find('name', self._default);
                var json={};
                for(var i=0;i<param.length;i++){
                    var j=param[i].split("=");
                    if(j)json[j[0]]=j[1];
                }
                self.do(ctrl.name, json);
            }

            go();

            return this;
        },
        format: function (ctrls) {
            function form(ctrl,zin){
                ctrl.name=ctrl.name||v;
                ctrl.url=ctrl.url||"#"+v;
                ctrl.template=ctrl.template||"tpl_"+v;
                ctrl.render=ctrl.render||"./view/"+ctrl.name+".ejs";
                ctrl.container=ctrl.container||zin._container;
                return ctrl;
            }
            for(var v in ctrls){
                this._ctrls.push(form(ctrls[v],this));
            }
            return this;
        },

        do: function (name, param) {
            var ctrl = this.find('name', name);
            if (!ctrl) {
                return;
            }
            /* TODO 根据参数动态修改ctrl */
            var scripts=[];

            if($("#"+ctrl.template).length>0){
                return this.show(ctrl, param);
            }else{
                var text = new EJS({url:ctrl.render}).text;
                var links = ctrl.links;
                
                for(var link in links){
                    var v=links[link];
                    if(link){
                        if(v=="img"){
                            new Image().src=link;
                        }else if(v=="js"||v=="script"){
                            scripts.push(link);
                        }else if(v=="css"){
                            !$("head link").checkLinkHas(link) && $LAB.css(link);
                        }else{
                            !$("head link").checkLinkHas(link) && $LAB.css(link);
                        }
                    }
                }
                $("body").append($('<script type="text/html" id="'+ctrl.template+'">'+text+'</script>'));
                return this.show(ctrl, param, scripts);
            }

        },
        show: function(ctrl, param, scripts){
            /* this._isGo = true; */
            /* location.hash = ctrl.url; */

            var children = $(ctrl.container).children();
            if(children.length>1){
                children.eq(children.length-2).remove();
            }
            if(children.length>0){
                var predom = children.eq(children.length-1);
                var prename = predom.attr("ctrl");
                var pre = this.find('name', prename);
                pre.pass&&pre.pass();
                predom.hide();
                if($("[ctrl="+prename+"]:visible").length<2){
                    this.detach(pre.vars);
                }
            }

            this.sets(ctrl.vars);
            var $html = $('<div>'+new EJS({text:$("#"+ctrl.template).html()}).render(ctrl.data)+'</div>')
                        .attr("ctrl", ctrl.name);
            $html.get(0).DATA=ctrl.data;
            if(ctrl.container==".page_container"){
                $html.addClass("page").addClass("slideIn");
            }
            $(ctrl.container).append($html);
            this.bind(ctrl);

            if(scripts && scripts.length>0){
                $LAB.setOptions({AlwaysPreserveOrder:true}).js(scripts).wait(function(){
                    ctrl.load && ctrl.load();
                });
            }else{
                ctrl.load && ctrl.load();
            }

            this._stack.push({
                ctrl: ctrl,
                param: param,
                dom: $html
            });
            
            return this;
        },
        go: function (name, param) {
            var ctrl = this.find('name', name);
            if (!ctrl) {
                return;
            }
            var str="?";
            if(typeof param == "object"){
                for(var v in param){
                    str+=v+"="+param[v]+"&";
                }
            }
            location.hash = ctrl.url + str.length>1 ? str.substr(0, str.length-1) : "";
            return this;
        },
        reload: function(){
            var cur = this.curStack();
            this.back().show(cur.ctrl);
        },
        back: function () { /* 不调load方法 */
            var cur = this._stack.pop();
            if (!cur) {
                return;
            }
            cur.ctrl.pass&&cur.ctrl.pass();
            if($("[ctrl="+cur.ctrl.name+"]").length<2){
                this.detach(cur.ctrl.vars);
            }
            var children=cur.dom.parent().children();
            if(children.length>1){
                var predom = children.eq(children.length-2);
                var prename = predom.attr("ctrl");
                var pre = this.find('name', prename);
                this.sets(pre.vars);

                cur.dom.addClass('slideOut').on('animationend', function () {
                    cur.dom.remove();
                    predom.show();
                }).on('webkitAnimationEnd', function () {
                    cur.dom.remove();
                    predom.show();
                });
            }

            return this;
        },
        /* 视图的DOM事件绑定 */
        bind: function (ctrl) {
            var events = ctrl.events;
            var container = $(ctrl.container);
            for (var t in events) {
                if(typeof events[t]=="function"){
                    container.find(t).on("click", events[t]);
                }else{
                   for (var type in events[t]) {
                        container.find(t).on(type, events[t][type]);
                    }
                }
            }
            return this;
        },
        /* 将变量赋值到全局 */
        sets: function (vars){
            for(var v in vars){
                window[v]=vars[v];
            }
            return this;
        },
        /* 将变量从全局移除 */
        detach: function (vars){
            for(var v in vars){
                window[v]=undefined;
            }
            return this;
        },
    };

    ZIN.init(CTRLS, "index", ".page_container");

    window.GO=function(name){return ZIN.go(name);};
    window.DO=function(name){return ZIN.do(name);};
    window.BACK=function(){return ZIN.back();};
    window.RELOAD=function(){return ZIN.reload();};
