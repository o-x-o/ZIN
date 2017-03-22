var CTRLS={

    index: {
        render:"",
        container:".page_container",
        links:{
            "":"js",
            "":"css",
            "":"img",
            "":"link",
            "":"script"
        },
        vars: {/*放置全局的变量*/
        },
        data: {/*视图使用的变量 视图中也能使用全局变量 在js中也可通过DATA(dom)获取该视图的变量 dom为config=该CTRL的name的dom*/
        },
        events: {
        },
        load: function(){
            if($(".weui_grids").children().length<1){
                $(".hd").hide().addClass("winCenter").css("margin-top",-$(".hd").outerHeight(true)/2);
                setTimeout(function(){
                    $(".hd").show();
                },0);
                $(".weui_grids").hide();
            }else{
                $(".hd").removeClass("winCenter").css("margin-top",0);
                $(".weui_grids").show();
            }
        },
        pass: function(){
        }
    },
    
    newProject: {
        links:{
            "./plugin/jsTree/jstree.min.js":"js",
            "./plugin/jsTree/jstree.min.css":"css"
        },
        events: {
            ".getCatalog" : function(){
                var path=$(".proj_root").val();
                DO("jsTree",path);
                $.post("/listFile?path="+path,function(r,s,q){
                    console.log(r);
                    
                });
            }
        }
    },

    catalog: {
        container: ".jsTree_container",
        viewdata: {

        },
        load: function(){
            $(".jsTree").each(function(){
                $(this).newTree();
            });
        }
    },

    jsTree: {
        container: ".jsTree_container",
        links: {
            "./plugin/jsTree/jstree.min.js":"js",
            "./plugin/jsTree/jstree.min.css":"css"
        },
        load: function(){
            $(".jsTree").each(function(){
                $(this).newTree();
            });
        }
    }

};