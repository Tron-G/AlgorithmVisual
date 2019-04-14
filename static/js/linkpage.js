/**
 * @description 输入窗口及播放暂停步进隐藏等所有交互函数
 */
function inputWindow() {
    let post_data = {};                     //向后台传输的数据包
    let svg_data = {};                       //主屏幕svg对象
    let animation_data = {};                //动画数据缓存

    resetSvgData(svg_data);
    resetPostData(post_data);                //post_data初始化
    clearAllTimer(animation_data, false);   //animation_data初始化

    ///////////////////////////////--------手动输入创建--------///////////////////////////////////////
    $('#submit_bt').click(function () {
        let user_data = $('#user_data').val();
        let result = checkError(post_data, user_data, 1);   //输入错误检查
        if (result !== false) {
            clearAllTimer(animation_data, true);            //清除动画定时器
            clearAllTimer(animation_data, false);           //animation_data初始化
            resetPostData(post_data, 0, result.slice(0));   //slice深拷贝
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));   //更新数据包

            resetSvgData(svg_data);
            drawLinkedList(post_data.array_data, svg_data);
            drawCodeOne(post_data, animation_data, 0, 0);
            drawProgress(animation_data, 0);                //重置进度条

        }
    });
    ///////////////////////////////--------随机创建--------///////////////////////////////////////
    $('#random_bt').click(function () {
        clearAllTimer(animation_data, true);            //清除动画定时器
        clearAllTimer(animation_data, false);           //animation_data初始化
        resetPostData(post_data, 1);
        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        console.log("data", post_data);
        resetSvgData(svg_data);
        drawLinkedList(post_data.array_data, svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        drawCodeOne(post_data, animation_data, 0, 0);

    });
    ///////////////////////////////--------查找功能--------///////////////////////////////////////
    $('#search_bt').click(function () {
        let search_num = $('#search_num').val();
        let result = checkError(post_data, search_num, 2);
        if (post_data.array_data === null || post_data.array_data.length === 0) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(14);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_search = true;                    //执行查找标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1, result);

            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            console.log("search", post_data);

            resetSvgData(svg_data);
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);                        //重置进度条
            drawCodeOne(post_data, animation_data, 1, 0);
            searchAnimation(svg_data, post_data, animation_data);

        }
    });
    ///////////////////////////////--------插入功能--------///////////////////////////////////////
    $('#insert_bt').click(function () {
        let insert_data = $('#insert_num').val();
        let result = checkError(post_data, insert_data, 3);
        if (post_data.array_data.length >= 10) {                  //链表长度超出范围
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(18);
            result = false;
        }
        if (post_data.array_data === null || post_data.array_data.length === 0) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(19);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_insert = true;                    //执行插入标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 2, -1, -1, result[0], result[1]);
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);

            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            console.log("insert", post_data);

            drawInsertCode(post_data, animation_data, 1, 0);
            insertAnimation(svg_data, post_data, animation_data);
        }
    });
    ///////////////////////////////--------移除功能--------///////////////////////////////////////
    $('#delete_bt').click(function () {
        let insert_data = $('#delete_num').val();
        let result = checkError(post_data, insert_data, 2);
        if (post_data.array_data === null || post_data.array_data.length === 0) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(14);
            result = false;
        }
        else if (result < 0 || result > (post_data.array_data.length - 1)) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(16);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_delete = true;                    //执行插入标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 3, -1, -1, -1, -1, result);
            resetSvgData(svg_data);                                     //重置svg_data
            drawLinkedList(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);

            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            console.log("delete", post_data);

            drawDeleteCode(post_data, animation_data, 1, 0);
            deleteAnimation(svg_data, post_data, animation_data);

        }
    });
    // ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_search) {                         //查找动画
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 1500;
                runSearchAnimation(post_data, animation_data);
            }
        }
        else if (animation_data.is_insert) {                         //插入动画
            if (!animation_data.is_pause) {
                animation_data.is_pause = true;
                console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");
                clearAllTimer(animation_data, true);
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 2000;
                runInsertAnimation(post_data, animation_data);
            }

        }
        else if (animation_data.is_delete) {                         //移除动画
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 2000;
                runDeleteAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(17);
    });
    // ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
        if (animation_data.is_search) {                        //查找动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 800;
                clearAllTimer(animation_data, true);
                runSearchAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 800;
                runSearchAnimation(post_data, animation_data);
            }
        }
        else if (animation_data.is_insert) {                        //插入动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 800;
                clearAllTimer(animation_data, true);
                runInsertAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 800;
                runInsertAnimation(post_data, animation_data);
            }
        }
        else if (animation_data.is_delete) {                        //移除动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 800;
                clearAllTimer(animation_data, true);
                runDeleteAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 800;
                runDeleteAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(17);
    });


    hideAnimation();
}

inputWindow();

/**
 * @description svg_data 圆心x坐标重置更新
 * @param {object} svg_data svg相关数据
 */
function resetSvgData(svg_data) {
    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();
    svg_data.m_svg = null;
    svg_data.circlepos = [];        //圆心x坐标
    svg_data.width = width;
    svg_data.height = height;
    svg_data.circle_radius = 30;        //节点半径
    svg_data.arrow_len = 70;         //箭头长度
}

/**
 * @description post_data属性设置
 * @param {object} post_data 数据包
 * @param {number} input_tpye 数据生成方式，0默认为手动输入，1为随机
 * @param {object} array_data 保存链表值
 * @param {number} operate_type 进行的操作类型，0：无，1：查找，2：插入，3：移除
 * @param {number} search_num 要查找的数值
 * @param {number} search_pos 查找的数值的下标（后台修改生成，默认-1表示未找到）
 * @param {number} insert_pos 要插入的数值下标
 * @param {number} insert_num 要插入的数值
 * @param {number} delete_pos 要移除的数值下标
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       search_num = -1, search_pos = -1, insert_pos = -1, insert_num = -1,
                       delete_pos = -1) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.search_num = search_num;
    post_data.search_pos = search_pos;
    post_data.insert_pos = insert_pos;
    post_data.insert_num = insert_num;
    post_data.delete_pos = delete_pos;
}

/**
 * @description 清除动画定时器
 * @param {object} animation_data 动画数据包
 * @param {boolean} do_clear  动画定时器操作，true清除所有定时器，false初始化动画数据包
 */
function clearAllTimer(animation_data, do_clear) {
    if (do_clear === true) {
        if (animation_data.all_timer.length !== 0) {
            for (let each in animation_data.all_timer) {
                clearTimeout(animation_data.all_timer[each]);
            }
            animation_data.all_timer.splice(0);
        }
    }
    else if (do_clear === false) {
        animation_data.all_timer = [];      //定时器缓存器
        animation_data.now_step = 0;        //当前执行动画的index
        animation_data.is_pause = true;     //暂停标记，默认暂停
        animation_data.searchframe = [];     //查找动画函数缓存器
        animation_data.insertframe = [];     //插入动画函数缓存器
        animation_data.deleteframe = [];     //移除动画函数缓存器
        animation_data.duration = 1500;     //动画时间基数
        animation_data.is_search = false;   //是否执行查找标记
        animation_data.is_insert = false;   //是否执行插入标记
        animation_data.is_delete = false;   //是否执行移除标记
        animation_data.is_next = false;     //执行步进标记
        animation_data.is_find = false;     //是否查找成功标记
        animation_data.explain_words = ["链表创建成功(尾插法)", "请点击开始按钮开始运行算法", "判断数值是否相等",
            "不相等,查找下一个节点", "未找到", "查找成功", "判断是否到达插入点", "未到达，继续前进",
            "到达插入点，储存插入点为aft", "创建新节点", "新节点指向插入点", "原节点指向新节点", "新节点指向头部", "更换头部",
            "尾部指向新节点", "更换尾部", "插入完成", "保存原头部指针", "头部指针后移", "删除原头部指针", "新建指针pre并指向头部",
            "新建指针temp保存pre的后继节点", "判断指针temp是否为空", "temp指针不为空,pre和temp指针后移", "temp指针为空,将指针pre的后继置空",
            "删除temp指针(原尾部)尾部指针置为pre", "判断是否到达移除点", "储存将被删除节点的指针及其后继",
            "将pre节点的后继指向aft", "删除节点", "移除节点完成"];
    }
}

/**
 * @description 主视图数组绘制
 * @param {Array} array_data 数组数据
 * @param svg_data
 * @return {object} svg svg对象
 */
function drawLinkedList(array_data, svg_data) {
    d3.select("#screen_svg").remove();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);


    let total_len = (svg_data.circle_radius * 2 + svg_data.arrow_len)
        * (array_data.length - 1) + svg_data.circle_radius * 2; //总长度
    let start_pos = (svg_data.width - total_len) / 2;
    svg.selectAll("circle")                           // 链表节点绘制
        .data(array_data)
        .enter()
        .append('g')
        .attr('class', function (d, i) {
            return "g_circle" + i;
        })
        .append("circle")
        .attr('class', function (d, i) {
            return "m_node" + i;
        })
        .attr('id', function (d, i) {
            return "m_circle" + i;
        })
        .attr("cx", function (d, i) {
            svg_data.circlepos.push(start_pos + i * (svg_data.circle_radius * 2 + svg_data.arrow_len));
            return start_pos + i * (svg_data.circle_radius * 2 + svg_data.arrow_len);
        })
        .attr("cy", svg_data.height / 2 - svg_data.circle_radius)
        .attr("r", svg_data.circle_radius)
        .attr("fill", "white")
        .attr("stroke", "#6a2c70")
        .attr("stroke-width", 3);

    svg.selectAll('g')                              // 链表数字绘制
        .append("text")
        .attr('class', function (d, i) {
            return "m_node" + i;
        })
        .attr('x', function (d, i) {
            return start_pos + i * (svg_data.circle_radius * 2 + svg_data.arrow_len);
        })
        .attr('y', svg_data.height / 2 - svg_data.circle_radius)
        .attr("dx", -svg_data.circle_radius / 2.5)
        .attr("dy", svg_data.circle_radius / 4)
        .attr("fill", "#b83b5e")
        .text(function (d) {
            return d;
        });
    //////////////////////////////Draw arrow////////////////////////////////
    let arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    svg.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto")
        .append("path")
        .attr("d", arrow_path)
        .attr("fill", "#393e46");

    for (let index = 0; index < array_data.length - 1; index++) {
        svg.append("g")
            .attr('class', "g_arrow" + index)
            .append("line")
            .attr('class', "circle_arrow" + index)
            .attr("x1", start_pos + index * (svg_data.circle_radius * 2 + svg_data.arrow_len) + svg_data.circle_radius)
            .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
            .attr("x2", start_pos + index * (svg_data.circle_radius * 2 +
                svg_data.arrow_len) + svg_data.circle_radius + svg_data.arrow_len - 8)
            .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
            .attr("stroke", "#393e46")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)")
    }
    ///////////////////////////////head,tail text///////////////////////////
    svg.select(".g_circle0")
        .append("text")
        .attr("class", "m_node0")
        .attr("id", "head_text")
        .attr("x", start_pos)
        .attr("y", svg_data.height / 2)
        .attr("dx", -svg_data.circle_radius)
        .attr("dy", svg_data.circle_radius)
        .attr("fill", "#A3A380")
        .text("head");
    if (array_data.length > 1) {
        svg.select(".g_circle" + (array_data.length - 1))
            .append("text")
            .attr("class", "m_node" + (array_data.length - 1))
            .attr("id", "tail_text")
            .attr("x", start_pos + (array_data.length - 1) * (svg_data.circle_radius * 2 + svg_data.arrow_len))
            .attr("y", svg_data.height / 2)
            .attr("dx", -svg_data.circle_radius / 2)
            .attr("dy", svg_data.circle_radius)
            .attr("fill", "#A3A380")
            .text("tail");
    }
    svg_data.m_svg = svg;
}


/**
 * @description 查找过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function searchAnimation(svg_data, post_data, animation_data) {
    animation_data.searchframe = post_data.array_data.map(function (d, i) {
        return function () {
            svg_data.m_svg.selectAll("#m_circle" + i)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", "#fab57a")
                .attr("stroke", "orange");

            svg_data.m_svg.select(".g_circle" + i)
                .append("text")
                .attr("class", "temp_text")
                .attr("x", svg_data.circlepos[i])
                .attr("y", svg_data.height / 2)
                .attr("dx", -svg_data.circle_radius)
                .attr("dy", 2 * svg_data.circle_radius)
                .attr("fill", "red")
                .text("temp");

            drawProgress(animation_data, animation_data.searchframe.length);       // 进度条
            if (i >= 1) {
                svg_data.m_svg.select(".temp_text").remove();
                svg_data.m_svg.select("#m_circle" + (i - 1))
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", "white");

                svg_data.m_svg.select(".g_arrow" + (i - 1))
                    .append("line")
                    .attr("x1", svg_data.circlepos[i - 1] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[i - 1] + svg_data.circle_radius)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("stroke", "orange")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow)")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[i - 1] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[i - 1] + svg_data.circle_radius + svg_data.arrow_len - 6)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius)

            }
        }
    });
}

/**
 * @description 插入过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function insertAnimation(svg_data, post_data, animation_data) {
    let temp_frame;
    ///////////////////////////////////头部插入动画 1、新建节点 2、指向头 3、更换头///////////////////////////////
    if (post_data.insert_pos === 0) {
        temp_frame = function () {
            svg_data.m_svg.append('g')
                .attr('class', "g_insert")
                .append("circle")
                .attr('class', "insert_node")
                .attr("cx", svg_data.circlepos[0] - 2 * svg_data.circle_radius - svg_data.arrow_len)
                .attr("cy", svg_data.height / 2 - svg_data.circle_radius)
                .attr("r", svg_data.circle_radius)
                .attr("fill", "#a1de93")
                .attr("stroke", "#6a2c70")
                .attr("stroke-width", 3);

            svg_data.m_svg.select('.g_insert')                              // 链表数字绘制
                .append("text")
                .attr('class', "insert_node")
                .attr('x', svg_data.circlepos[0] - 2 * svg_data.circle_radius - svg_data.arrow_len)
                .attr('y', svg_data.height / 2 - svg_data.circle_radius)
                .attr("dx", -svg_data.circle_radius / 2.5)
                .attr("dy", svg_data.circle_radius / 4)
                .attr("fill", "#b83b5e")
                .text(post_data.insert_num);

            svg_data.m_svg.select('.g_insert')
                .append("text")
                .attr('class', "insert_node")
                .attr("id", "insert_text")
                .attr('x', svg_data.circlepos[0] - 2 * svg_data.circle_radius - svg_data.arrow_len)
                .attr('y', svg_data.height / 2 - svg_data.circle_radius)
                .attr("dx", -svg_data.circle_radius)
                .attr("dy", 2 * svg_data.circle_radius)
                .attr("fill", "red")
                .text("insert_vtx");
        };
        animation_data.insertframe.push(temp_frame);
        temp_frame = function () {
            svg_data.m_svg.select('.g_insert')
                .append("line")
                .attr("class", "insert_arrow")
                .attr("x1", svg_data.circlepos[0] - svg_data.circle_radius - svg_data.arrow_len)
                .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                .attr("x2", svg_data.circlepos[0] - svg_data.circle_radius - svg_data.arrow_len)
                .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                .attr("stroke", "green")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .transition()
                .duration(animation_data.duration / 2)
                .attr("x1", svg_data.circlepos[0] - svg_data.circle_radius - svg_data.arrow_len)
                .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                .attr("x2", svg_data.circlepos[0] - svg_data.circle_radius)
                .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
        };
        animation_data.insertframe.push(temp_frame);
        temp_frame = function () {
            svg_data.m_svg.select("#head_text").remove();
            svg_data.m_svg.select("#insert_text").remove();
            svg_data.m_svg.select(".g_insert")
                .append("text")
                .attr('x', svg_data.circlepos[0] - 2 * svg_data.circle_radius - svg_data.arrow_len)
                .attr('y', svg_data.height / 2 - svg_data.circle_radius)
                .attr("dx", -svg_data.circle_radius)
                .attr("dy", 2 * svg_data.circle_radius)
                .attr("fill", "red")
                .text("head");
        };
        animation_data.insertframe.push(temp_frame);
        return;
    }

    ///////////////////////////////////尾部插入动画/////////////////////////////////////
    else if (post_data.insert_pos === post_data.array_data.length - 1) {
        temp_frame = function () {
            svg_data.m_svg.append('g')
                .attr('class', "g_insert")
                .append("circle")
                .attr('class', "insert_node")
                .attr("cx", svg_data.circlepos[post_data.array_data.length - 2] + 2 * svg_data.circle_radius + svg_data.arrow_len)
                .attr("cy", svg_data.height / 2 - svg_data.circle_radius)
                .attr("r", svg_data.circle_radius)
                .attr("fill", "#a1de93")
                .attr("stroke", "#6a2c70")
                .attr("stroke-width", 3);

            svg_data.m_svg.select('.g_insert')                              // 链表数字绘制
                .append("text")
                .attr('class', "insert_node")
                .attr('x', svg_data.circlepos[post_data.array_data.length - 2] + 2 * svg_data.circle_radius + svg_data.arrow_len)
                .attr('y', svg_data.height / 2 - svg_data.circle_radius)
                .attr("dx", -svg_data.circle_radius / 2.5)
                .attr("dy", svg_data.circle_radius / 4)
                .attr("fill", "#b83b5e")
                .text(post_data.insert_num);

            svg_data.m_svg.select('.g_insert')
                .append("text")
                .attr('class', "insert_node")
                .attr("id", "insert_text")
                .attr('x', svg_data.circlepos[post_data.array_data.length - 2] + 2 * svg_data.circle_radius + svg_data.arrow_len)
                .attr('y', svg_data.height / 2 - svg_data.circle_radius)
                .attr("dx", -svg_data.circle_radius)
                .attr("dy", 2 * svg_data.circle_radius)
                .attr("fill", "red")
                .text("insert_vtx");
        };
        animation_data.insertframe.push(temp_frame);
        temp_frame = function () {
            svg_data.m_svg.select('.g_insert')
                .append("line")
                .attr("class", "insert_arrow")
                .attr("x1", svg_data.circlepos[post_data.array_data.length - 2] + svg_data.circle_radius)
                .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                .attr("x2", svg_data.circlepos[post_data.array_data.length - 2] + svg_data.circle_radius)
                .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                .attr("stroke", "green")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .transition()
                .duration(animation_data.duration / 2)
                .attr("x1", svg_data.circlepos[post_data.array_data.length - 2] + svg_data.circle_radius)
                .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                .attr("x2", svg_data.circlepos[post_data.array_data.length - 2] + svg_data.circle_radius + svg_data.arrow_len)
                .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
        };
        animation_data.insertframe.push(temp_frame);
        temp_frame = function () {
            svg_data.m_svg.select("#tail_text").remove();
            svg_data.m_svg.select("#insert_text").remove();
            svg_data.m_svg.select(".g_insert")
                .append("text")
                .attr('x', svg_data.circlepos[post_data.array_data.length - 2] + 2 * svg_data.circle_radius + svg_data.arrow_len)
                .attr('y', svg_data.height / 2 - svg_data.circle_radius)
                .attr("dx", -svg_data.circle_radius / 2)
                .attr("dy", 2 * svg_data.circle_radius)
                .attr("fill", "red")
                .text("tail");
        };
        animation_data.insertframe.push(temp_frame);
        return;
    }

    for (let index = 0; index < post_data.array_data.length; index++) {
        //////////////////////////////////中间插入节点动画 1、查找目标位置 2、插入动画//////////////////////////////////
        if (index < post_data.insert_pos) {
            temp_frame = function () {                   //查找目标节点
                svg_data.m_svg.selectAll("#m_circle" + index)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", "#fab57a")
                    .attr("stroke", "orange");
                svg_data.m_svg.select(".g_circle" + index)
                    .append("text")
                    .attr("class", "temp_text")
                    .attr("x", svg_data.circlepos[index])
                    .attr("y", svg_data.height / 2)
                    .attr("dx", -svg_data.circle_radius)
                    .attr("dy", 2 * svg_data.circle_radius)
                    .attr("fill", "red")
                    .text("pre/" + index);
                // drawProgress(animation_data);       // 进度条
                if (index >= 1) {
                    svg_data.m_svg.select(".temp_text").remove();
                    svg_data.m_svg.select("#m_circle" + (index - 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "white");
                    svg_data.m_svg.select(".g_arrow" + (index - 1))
                        .append("line")
                        .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)")
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius + svg_data.arrow_len - 6)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                }
            };
            animation_data.insertframe.push(temp_frame);
        }
        //////////////////////插入动画 1、新建节点 2、指向位置 3、前驱指向新节点 4、归位//////////////////////////
        else if (index === post_data.insert_pos) {
            temp_frame = function () {                      //新建节点
                svg_data.m_svg.select("#m_circle" + index)  //选中当前节点
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", "#6eb6ff")
                    .attr("stroke", "#6eb6ff");
                svg_data.m_svg.select(".g_circle" + index)
                    .append("text")
                    .attr("class", "temp_text")
                    .attr("x", svg_data.circlepos[index])
                    .attr("y", svg_data.height / 2)
                    .attr("dx", -svg_data.circle_radius)
                    .attr("dy", 2 * svg_data.circle_radius)
                    .attr("fill", "red")
                    .text("aft/" + index);


                svg_data.m_svg.append('g')            //新建节点
                    .attr('class', "g_insert")
                    .append("circle")
                    .attr('class', "insert_node")
                    .attr("cx", svg_data.circlepos[index])
                    .attr("cy", svg_data.height / 2 + svg_data.circle_radius + svg_data.arrow_len)
                    .attr("r", svg_data.circle_radius)
                    .attr("fill", "#a1de93")
                    .attr("stroke", "#a1de93")
                    .attr("stroke-width", 3);

                svg_data.m_svg.select('.g_insert')                              // 链表数字绘制
                    .append("text")
                    .attr('class', "insert_node")
                    .attr('x', svg_data.circlepos[index])
                    .attr('y', svg_data.height / 2 + svg_data.circle_radius + svg_data.arrow_len)
                    .attr("dx", -svg_data.circle_radius / 2.5)
                    .attr("dy", svg_data.circle_radius / 4)
                    .attr("fill", "#b83b5e")
                    .text(post_data.insert_num);

                svg_data.m_svg.select('.g_insert')
                    .append("text")
                    .attr('class', "insert_node")
                    .attr('x', svg_data.circlepos[index])
                    .attr('y', svg_data.height / 2 + svg_data.circle_radius + svg_data.arrow_len)
                    .attr("dx", -svg_data.circle_radius)
                    .attr("dy", svg_data.circle_radius * 2)
                    .attr("fill", "red")
                    .text("insert_vtx");

            };
            animation_data.insertframe.push(temp_frame);

            temp_frame = function () {              //新建节点指向目标节点
                svg_data.m_svg.select('.g_insert')
                    .append("line")
                    .attr("class", "insert_arrow")
                    .attr("x1", svg_data.circlepos[index])
                    .attr("y1", svg_data.height / 2 + svg_data.arrow_len)
                    .attr("x2", svg_data.circlepos[index])
                    .attr("y2", svg_data.height / 2 + svg_data.arrow_len)
                    .attr("stroke", "green")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow)")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[index])
                    .attr("y1", svg_data.height / 2 + svg_data.arrow_len)
                    .attr("x2", svg_data.circlepos[index])
                    .attr("y2", svg_data.height / 2)
            };
            animation_data.insertframe.push(temp_frame);

            temp_frame = function () {              //前驱节点重新指向新建节点
                svg_data.m_svg.select(".circle_arrow" + (index - 1))
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("y2", svg_data.height / 2 + svg_data.circle_radius + svg_data.arrow_len)
            };
            animation_data.insertframe.push(temp_frame);

            temp_frame = function () {              //所有节点返回指定位置
                for (let index = post_data.insert_pos; index < post_data.array_data.length; index++) {
                    svg_data.m_svg.selectAll(".m_node" + index)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("cx", svg_data.circlepos[index] + 2 * svg_data.circle_radius + svg_data.arrow_len)
                        .attr("x", svg_data.circlepos[index] + 2 * svg_data.circle_radius + svg_data.arrow_len);

                    svg_data.m_svg.selectAll(".circle_arrow" + index)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[index] + 3 * svg_data.circle_radius + svg_data.arrow_len)
                        .attr("x2", svg_data.circlepos[index] + 3 * svg_data.circle_radius + 2 * svg_data.arrow_len)
                }

                svg_data.m_svg.selectAll(".insert_node")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("cy", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("y", svg_data.height / 2 - svg_data.circle_radius);

                svg_data.m_svg.select(".circle_arrow" + (index - 1))
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

                svg_data.m_svg.select(".insert_arrow")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[index] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index] + svg_data.circle_radius + svg_data.arrow_len)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

                svg_data.m_svg.selectAll(".temp_text").remove();
            };
            animation_data.insertframe.push(temp_frame);
        }
        else
            break;
    }

}

/**
 * @description  移除过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function deleteAnimation(svg_data, post_data, animation_data) {
    let temp_frame;
    ///////////////////////////////////移除头部动画 1、获得头部指针 2、头部后移 3、移除原头部///////////////////////////////
    if (post_data.delete_pos === 0) {
        temp_frame = function () {
            svg_data.m_svg.selectAll("#m_circle0")
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", "#fab57a")
                .attr("stroke", "orange");

            svg_data.m_svg.select(".g_circle0")
                .append("text")
                .attr("class", "temp_text")
                .attr("x", svg_data.circlepos[0])
                .attr("y", svg_data.height / 2)
                .attr("dx", -svg_data.circle_radius)
                .attr("dy", 2 * svg_data.circle_radius)
                .attr("fill", "red")
                .text("temp");
        };
        animation_data.deleteframe.push(temp_frame);

        temp_frame = function () {
            svg_data.m_svg.select(".g_arrow0")
                .append("line")
                .attr("class", "temp_arrow")
                .attr("x1", svg_data.circlepos[0] + svg_data.circle_radius)
                .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                .attr("x2", svg_data.circlepos[0] + svg_data.circle_radius)
                .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                .attr("stroke", "green")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .transition()
                .duration(animation_data.duration / 2)
                .attr("x1", svg_data.circlepos[0] + svg_data.circle_radius)
                .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                .attr("x2", svg_data.circlepos[0] + svg_data.circle_radius + svg_data.arrow_len - 6)
                .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

            svg_data.m_svg.select("#m_circle1")
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", "#a1de93")
                .attr("stroke", "#a1de93");

            svg_data.m_svg.select("#head_text").remove();

            svg_data.m_svg.select(".g_circle1")
                .append("text")
                .attr("class", "m_node1")
                .attr("id", "head_text")
                .attr("x", svg_data.circlepos[1])
                .attr("y", svg_data.height / 2)
                .attr("dx", -svg_data.circle_radius)
                .attr("dy", svg_data.circle_radius)
                .attr("fill", "red")
                .text("head");
        };
        animation_data.deleteframe.push(temp_frame);

        temp_frame = function () {
            svg_data.m_svg.selectAll(".g_circle0").remove();
            svg_data.m_svg.select(".temp_text").remove();
            svg_data.m_svg.selectAll(".g_arrow0").remove();
        };
        animation_data.deleteframe.push(temp_frame);
        return;
    }

    ///////////////////////////////////移除尾部动画/////////////////////////////////////
    else if (post_data.delete_pos === post_data.array_data.length) {
        for (let index = 0; index <= post_data.array_data.length; index++) {
            if (index === 0) {                            //头结点
                temp_frame = function () {
                    svg_data.m_svg.select("#m_circle" + index)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "orange")
                        .attr("stroke", "#fab57a");

                    svg_data.m_svg.select(".g_circle" + index)
                        .append("text")
                        .attr("class", "pre_text")
                        .attr("x", svg_data.circlepos[index])
                        .attr("y", svg_data.height / 2)
                        .attr("dx", -svg_data.circle_radius)
                        .attr("dy", 2 * svg_data.circle_radius)
                        .attr("fill", "red")
                        .text("pre/" + index);
                };
                animation_data.deleteframe.push(temp_frame);

                temp_frame = function () {                 //保存后继节点
                    svg_data.m_svg.select("#m_circle" + (index + 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "#a1de93")
                        .attr("stroke", "#a1de93");

                    svg_data.m_svg.select(".g_circle" + (index + 1))
                        .append("text")
                        .attr("class", "temp_text")
                        .attr("x", svg_data.circlepos[index + 1])
                        .attr("y", svg_data.height / 2)
                        .attr("dx", -svg_data.circle_radius)
                        .attr("dy", 2 * svg_data.circle_radius)
                        .attr("fill", "red")
                        .text("temp");

                    svg_data.m_svg.select(".g_arrow0")
                        .append("line")
                        .attr("x1", svg_data.circlepos[0] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[0] + svg_data.circle_radius)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)")
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[0] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[0] + svg_data.circle_radius + svg_data.arrow_len - 6)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

                };
                animation_data.deleteframe.push(temp_frame);
            }
            else if (index === post_data.array_data.length) {     //尾节点动画
                temp_frame = function () {
                    svg_data.m_svg.selectAll(".g_arrow" + (index - 1)).remove();
                };
                animation_data.deleteframe.push(temp_frame);

                temp_frame = function () {
                    svg_data.m_svg.selectAll(".g_circle" + index).remove();
                    svg_data.m_svg.select(".pre_text").remove();

                    svg_data.m_svg.select("#m_circle" + (index - 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "#a1de93")
                        .attr("stroke", "#a1de93");

                    svg_data.m_svg.select(".g_circle" + (index - 1))
                        .append("text")
                        .attr("x", svg_data.circlepos[index - 1])
                        .attr("y", svg_data.height / 2)
                        .attr("dx", -svg_data.circle_radius / 2)
                        .attr("dy", svg_data.circle_radius)
                        .attr("fill", "red")
                        .text("tail");
                };
                animation_data.deleteframe.push(temp_frame);

            }
            else {                                      //中间查找
                temp_frame = function () {
                    svg_data.m_svg.selectAll(".pre_text").remove();
                    svg_data.m_svg.selectAll(".temp_text").remove();

                    svg_data.m_svg.select("#m_circle" + (index - 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "white")
                        .attr("stroke", "orange");

                    svg_data.m_svg.select("#m_circle" + index)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "orange")
                        .attr("stroke", "#fab57a");

                    svg_data.m_svg.select(".g_circle" + index)
                        .append("text")
                        .attr("class", "pre_text")
                        .attr("x", svg_data.circlepos[index])
                        .attr("y", svg_data.height / 2)
                        .attr("dx", -svg_data.circle_radius)
                        .attr("dy", 2 * svg_data.circle_radius)
                        .attr("fill", "red")
                        .text("pre/" + index);

                    svg_data.m_svg.select(".g_arrow" + (index - 1))
                        .append("line")
                        .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)")
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius + svg_data.arrow_len - 6)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius);


                    svg_data.m_svg.select("#m_circle" + (index + 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "#a1de93")
                        .attr("stroke", "#a1de93");

                    svg_data.m_svg.select(".g_circle" + (index + 1))
                        .append("text")
                        .attr("class", "temp_text")
                        .attr("x", svg_data.circlepos[index + 1])
                        .attr("y", svg_data.height / 2)
                        .attr("dx", -svg_data.circle_radius)
                        .attr("dy", 2 * svg_data.circle_radius)
                        .attr("fill", "red")
                        .text("temp");

                    svg_data.m_svg.select(".g_arrow" + index)
                        .append("line")
                        .attr("x1", svg_data.circlepos[index] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index] + svg_data.circle_radius)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("stroke", "#a1de93")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)")
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[index] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index] + svg_data.circle_radius + svg_data.arrow_len - 6)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius);
                };
                animation_data.deleteframe.push(temp_frame);
            }
        }
        return;
    }

    for (let index = 0; index < post_data.array_data.length; index++) {
        //////////////////////////////////移除中间节点动画 1、查找目标位置 2、移除动画//////////////////////////////////
        if (index < post_data.delete_pos) {
            temp_frame = function () {                   //查找目标节点
                svg_data.m_svg.selectAll("#m_circle" + index)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", "#fab57a")
                    .attr("stroke", "orange");
                svg_data.m_svg.select(".g_circle" + index)
                    .append("text")
                    .attr("id", "pre_text")
                    .attr("x", svg_data.circlepos[index])
                    .attr("y", svg_data.height / 2)
                    .attr("dx", -svg_data.circle_radius)
                    .attr("dy", 2 * svg_data.circle_radius)
                    .attr("fill", "red")
                    .text("pre/" + index);

                if (index >= 1) {
                    svg_data.m_svg.select("#pre_text").remove();
                    svg_data.m_svg.select("#m_circle" + (index - 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", "white");
                    svg_data.m_svg.select(".g_arrow" + (index - 1))
                        .append("line")
                        .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)")
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                        .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                        .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius + svg_data.arrow_len - 6)
                        .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                }
            };
            animation_data.deleteframe.push(temp_frame);
        }
        //////////////////////移除动画 1、选中当前及后继 2、前驱指向当前后继 3、移除 4、归位//////////////////////////
        else if (index === post_data.delete_pos) {
            temp_frame = function () {                      //新建节点
                svg_data.m_svg.select("#m_circle" + index)  //选中当前节点
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", "#393e46")
                    .attr("stroke", "#393e46");
                svg_data.m_svg.select(".g_circle" + index)
                    .append("text")
                    .attr("class", "m_node" + index)
                    .attr("id", "del_text")
                    .attr("x", svg_data.circlepos[index])
                    .attr("y", svg_data.height / 2)
                    .attr("dx", -svg_data.circle_radius)
                    .attr("dy", 2 * svg_data.circle_radius)
                    .attr("fill", "red")
                    .text("del/" + index);

                svg_data.m_svg.select(".g_arrow" + (index - 1))  //前驱箭头
                    .append("line")
                    .attr("id", "pre_arrow")
                    .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("stroke", "orange")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow)")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius + svg_data.arrow_len - 6)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

                svg_data.m_svg.select("#m_circle" + (index + 1))  //选中下一个节点
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", "#a1de93")
                    .attr("stroke", "#a1de93");
                svg_data.m_svg.select(".g_circle" + (index + 1))
                    .append("text")
                    .attr("id", "aft_text")
                    .attr("x", svg_data.circlepos[index + 1])
                    .attr("y", svg_data.height / 2)
                    .attr("dx", -svg_data.circle_radius)
                    .attr("dy", 2 * svg_data.circle_radius)
                    .attr("fill", "red")
                    .text("aft/" + (index + 1));

                svg_data.m_svg.select(".g_arrow" + index)    //后继箭头
                    .append("line")
                    .attr("id", "temp_arrow")
                    .attr("x1", svg_data.circlepos[index] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index] + svg_data.circle_radius)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow)")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[index] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index] + svg_data.circle_radius + svg_data.arrow_len - 6)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

            };
            animation_data.deleteframe.push(temp_frame);

            temp_frame = function () {              //更换节点后继,当前节点下移
                svg_data.m_svg.select(".circle_arrow" + (index - 1)).remove(); //移除底层箭头
                svg_data.m_svg.select(".circle_arrow" + index).remove();

                svg_data.m_svg.selectAll(".m_node" + index)  //选中当前节点下移
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("cy", svg_data.height / 2 + svg_data.arrow_len)
                    .attr("y", svg_data.height / 2 + svg_data.arrow_len);

                svg_data.m_svg.select("#temp_arrow")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[index] + svg_data.circle_radius - 4)
                    .attr("y1", svg_data.height / 2 + svg_data.arrow_len - 15)
                    .attr("x2", svg_data.circlepos[index] + svg_data.circle_radius + svg_data.arrow_len)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius + 13);

                svg_data.m_svg.select("#pre_arrow").remove();
                svg_data.m_svg.select(".g_arrow" + (index - 1))
                    .append("line")
                    .attr("class", "circle_arrow" + (index - 1))
                    .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("stroke", "orange")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow)")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x1", svg_data.circlepos[index - 1] + svg_data.circle_radius)
                    .attr("y1", svg_data.height / 2 - svg_data.circle_radius)
                    .attr("x2", svg_data.circlepos[index + 1] - svg_data.circle_radius - 6)
                    .attr("y2", svg_data.height / 2 - svg_data.circle_radius);

            };
            animation_data.deleteframe.push(temp_frame);

            temp_frame = function () {              //移除节点
                svg_data.m_svg.selectAll(".g_circle" + index).remove();
                svg_data.m_svg.selectAll(".g_arrow" + index).remove();
                svg_data.m_svg.select("#pre_text").remove();
                svg_data.m_svg.select("#aft_text").remove();

            };
            animation_data.deleteframe.push(temp_frame);

            temp_frame = function () {              //所有节点返回指定位置

                svg_data.m_svg.select(".circle_arrow" + (index - 1))
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x2", svg_data.circlepos[index] - svg_data.circle_radius);

                for (let j = (post_data.delete_pos + 1); j <= post_data.array_data.length; j++) {
                    svg_data.m_svg.selectAll(".m_node" + j)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("cx", svg_data.circlepos[j] - 2 * svg_data.circle_radius - svg_data.arrow_len)
                        .attr("x", svg_data.circlepos[j] - 2 * svg_data.circle_radius - svg_data.arrow_len);

                    svg_data.m_svg.selectAll(".circle_arrow" + j)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x1", svg_data.circlepos[j] - svg_data.circle_radius - svg_data.arrow_len)
                        .attr("x2", svg_data.circlepos[j] - svg_data.circle_radius)
                }
            };
            animation_data.deleteframe.push(temp_frame);
        }
        else
            break;
    }


}


/**
 * @description   (Delete) 移除过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runDeleteAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.deleteframe.length) {   //步进执行
            drawProgress(animation_data, animation_data.deleteframe.length);
            animation_data.deleteframe[animation_data.now_step]();        //执行主视图动画
            showDeleteCode(post_data, animation_data);                     //伪代码及提示展示
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runDeleteAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.deleteframe.length - 1) {
                console.log("end", animation_data.now_step);
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("结束");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawProgress(animation_data, animation_data.deleteframe.length);
            showDeleteCode(post_data, animation_data);
            animation_data.deleteframe[animation_data.now_step]();
            animation_data.now_step++;
            console.log("正在播放第:" + animation_data.now_step + "帧");
            runDeleteAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description   移除过程的伪代码及提示展示函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function showDeleteCode(post_data, animation_data) {
    if (post_data.delete_pos === 0) {                               //移除头部提示框
        if (animation_data.now_step === 0)
            drawDeleteCode(post_data, animation_data, 17, 0);
        else if (animation_data.now_step === 1)
            drawDeleteCode(post_data, animation_data, 18, 1);
        else if (animation_data.now_step === 2)
            drawDeleteCode(post_data, animation_data, 19, 2);
    }
    else if (post_data.delete_pos === post_data.array_data.length) {    //移除尾部提示框
        if (animation_data.now_step === 0)
            drawDeleteCode(post_data, animation_data, 20, 0);
        else if (animation_data.now_step === 1)
            drawDeleteCode(post_data, animation_data, 21, 1);
        else if (animation_data.now_step === (animation_data.deleteframe.length - 2))
            drawDeleteCode(post_data, animation_data, 24, 4);
        else if (animation_data.now_step === (animation_data.deleteframe.length - 1))
            drawDeleteCode(post_data, animation_data, 25, 5);
        else {
            drawDeleteCode(post_data, animation_data, 22, 2);       //判断相等
            let temp_timer = setTimeout(() => {
                drawDeleteCode(post_data, animation_data, 23, 3);          //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);              // 计时器缓存
        }
    }
    else {
        if (animation_data.now_step === 0)
            drawDeleteCode(post_data, animation_data, 20, 0);
        else if (animation_data.now_step === (animation_data.deleteframe.length - 4))
            drawDeleteCode(post_data, animation_data, 27, 3);
        else if (animation_data.now_step === (animation_data.deleteframe.length - 3))
            drawDeleteCode(post_data, animation_data, 28, 4);
        else if (animation_data.now_step === (animation_data.deleteframe.length - 2))
            drawDeleteCode(post_data, animation_data, 29, 5);
        else if (animation_data.now_step === (animation_data.deleteframe.length - 1))
            drawDeleteCode(post_data, animation_data, 30, 5);
        else if (0 < animation_data.now_step < (animation_data.deleteframe.length - 1)) {
            drawDeleteCode(post_data, animation_data, 26, 1);       //判断相等
            let temp_timer = setTimeout(() => {
                drawDeleteCode(post_data, animation_data, 7, 2);          //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);              // 计时器缓存
        }
    }
}


/**
 * @description   (Insert) 插入过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runInsertAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.insertframe.length) {   //步进执行
            drawProgress(animation_data, animation_data.insertframe.length);
            animation_data.insertframe[animation_data.now_step]();        //执行主视图动画
            showInsertCode(post_data, animation_data);
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runInsertAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.insertframe.length - 1) {
                console.log("end", animation_data.now_step);
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("结束");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawProgress(animation_data, animation_data.insertframe.length);
            showInsertCode(post_data, animation_data);
            animation_data.insertframe[animation_data.now_step]();
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runInsertAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}

/**
 * @description   插入过程的伪代码及提示展示函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function showInsertCode(post_data, animation_data) {

    if (post_data.insert_pos === 0) {
        if (animation_data.now_step === 0)
            drawInsertCode(post_data, animation_data, 9, 0);
        else if (animation_data.now_step === 1)
            drawInsertCode(post_data, animation_data, 12, 1);
        else if (animation_data.now_step === 2)
            drawInsertCode(post_data, animation_data, 13, 2);
    }
    else if (post_data.insert_pos === (post_data.array_data.length - 1)) {
        if (animation_data.now_step === 0)
            drawInsertCode(post_data, animation_data, 9, 0);
        else if (animation_data.now_step === 1)
            drawInsertCode(post_data, animation_data, 14, 1);
        else if (animation_data.now_step === 2)
            drawInsertCode(post_data, animation_data, 15, 2);
    }
    else {
        if (animation_data.now_step === 0)
            drawInsertCode(post_data, animation_data, 20, 0);
        else if (animation_data.now_step < animation_data.insertframe.length - 4) {
            drawInsertCode(post_data, animation_data, 6, 1);       //判断相等
            let temp_timer = setTimeout(() => {
                drawInsertCode(post_data, animation_data, 7, 2);          //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);              // 计时器缓存
        }
        else if (animation_data.now_step === animation_data.insertframe.length - 4) {
            drawInsertCode(post_data, animation_data, 8, 3);
            let temp_timer = setTimeout(() => {
                drawInsertCode(post_data, animation_data, 9, 4);          //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);              // 计时器缓存
        }
        else if (animation_data.now_step === animation_data.insertframe.length - 3)
            drawInsertCode(post_data, animation_data, 10, 5);
        else if (animation_data.now_step === animation_data.insertframe.length - 2)
            drawInsertCode(post_data, animation_data, 11, 6);
        else if (animation_data.now_step === animation_data.insertframe.length - 1)
            drawInsertCode(post_data, animation_data, 16, 6);

    }

}


/**
 * @description  (Search) 查找过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runSearchAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.searchframe.length
            && !animation_data.is_find) {                   //步进执行
            animation_data.searchframe[animation_data.now_step]();//执行主视图动画
            drawCodeOne(post_data, animation_data, 2, 1);      //提示窗口判断相等动画
            let temp_timer = setTimeout(() => {
                if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num)
                    drawCodeOne(post_data, animation_data, 5, 4);  //查找成功
                else
                    drawCodeOne(post_data, animation_data, 3, 2);  //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);       // 计时器缓存
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runSearchAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num) {
                animation_data.is_find = true;
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找成功" + (animation_data.now_step - 1));
                return;
            }
            if (animation_data.now_step > animation_data.searchframe.length - 1) {
                console.log("end", animation_data.now_step);
                animation_data.is_pause = true;
                drawCodeOne(post_data, animation_data, 4, 3);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找失败");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawCodeOne(post_data, animation_data, 2, 1);      //判断相等
            let temp_timer = setTimeout(() => {
                if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num)
                    drawCodeOne(post_data, animation_data, 5, 4);  //查找成功
                else
                    drawCodeOne(post_data, animation_data, 3, 2);  //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);      // 计时器缓存
            animation_data.searchframe[animation_data.now_step]();
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runSearchAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description 进度条绘制
 * @param {Object} animation_data
 * @param {number} frame_len 总帧数，0表示清空
 */
function drawProgress(animation_data, frame_len) {
    if (frame_len === 0)
        $("#play_bt").attr("class", "play");
    d3.select("#progress_svg").remove();
    let screen = $("#progress");
    let width = screen.width();
    let height = screen.height();
    let rect_length;
    if (frame_len === 0) {
        rect_length = 0;
    }
    else {
        rect_length = width / frame_len;
    }
    d3.select("#progress")
        .append("svg")
        .attr("id", "progress_svg")
        .attr("width", width)
        .attr("height", height)
        .append("rect")
        .attr("class", "progress_rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr("width", rect_length * animation_data.now_step)
        .attr("height", height)
        .attr("fill", "#0075f6")
        .transition()
        .duration(animation_data.duration)
        .ease(d3.easeLinear)                                //v5 新写法，线性缓动
        .attr("width", rect_length * (animation_data.now_step + 1));
}


/**
 * @description 解释窗口的动画绘制
 * @param {object} post_data
 * @param {object} animation_data
 * @param word_id 解释文字所在数组(animation_data.explain_words[])下标
 */
function hintAnimation(post_data, animation_data, word_id) {
    let temp = animation_data.explain_words[word_id];
    d3.select("#hint_svg").remove();
    let screen = $("#hint_window");
    let width = screen.width();
    let height = screen.height();
    let svg = d3.select("#hint_window")
        .append("svg")
        .attr("id", "hint_svg")
        .attr("width", width)
        .attr("height", height);
    svg.append("text")
        .attr('x', width / 12)
        .attr('y', height / 2)
        .attr("dy", height / 9)
        .attr("fill", "#5c2626")
        .text(temp);
}

/**
 * @description  创建、搜索算法窗口绘制
 * @param {Object}  post_data
 * @param {Object}  animation_data
 * @param {number}  word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param {number}  now_step 当前选中的代码块
 */
function drawCodeOne(post_data, animation_data, word_id, now_step) {
    let code_text = [];
    if (post_data.operate_type === 1)
        code_text = ["temp = head;", "while(temp.data != input)", "temp = temp.next;", "if(temp == NULL),return false;", "return temp;"];
    else if (post_data.operate_type === 0) {
        if (post_data.input_tpye === 0)
            code_text = ["head = new Node( ); tail = new Node( );,tail = head;,for(i = 0; i < length; i++){," +
            "temp = new Node( );,temp.data = input( );,tail.next = temp;,tail = temp;   },tail.next = NULL;"];
        else
            code_text = ["head = new Node( ); tail = new Node( );,tail = head;,for(i = 0; i < random_length; i++){," +
            "temp = new Node( );,temp.data = random( );,tail.next = temp;,tail = temp;  },tail.next = NULL;"];
    }

    d3.select("#code_svg").remove();
    let screen = $("#code_window");
    let width = screen.width();
    let height = screen.height();
    let rect_height = height / code_text.length;

    let code_svg = d3.select("#code_window")
        .append("svg")
        .attr("id", "code_svg")
        .attr("width", width)
        .attr("height", height);

    code_svg.selectAll("rect")
        .data(code_text)
        .enter()
        .append("g")
        .append("rect")
        .attr("class", (d, i) => {
            return "code_rect" + i;
        })
        .attr('x', 0)
        .attr('y', (d, i) => {
            return i * rect_height;
        })
        .attr("width", width)
        .attr("height", rect_height)
        .attr("fill", "#7f4a88");
    if (post_data.operate_type === 1) {
        for (let index = 0; index < code_text.length; index++) {
            let temp = code_text[index].split(",");
            if (temp.length > 1) {
                let text = code_svg.selectAll("g")
                    .append("text")
                    .attr("font-size", "15px")
                    .attr("fill", "white")
                    .attr('x', () => {
                        if (index === 2 || index === 3)
                            return width / 5;
                        else
                            return width / 10;
                    })
                    .attr('y', index * rect_height);
                text.selectAll("tspan")
                    .data(temp)
                    .enter()
                    .append("tspan")
                    .attr("x", (d, i) => {
                        if (i > 0)
                            return 2 * text.attr("x");
                        else
                            return text.attr("x");
                    })
                    .attr("dy", rect_height / 3.5)
                    .text(function (d) {
                        return d
                    })
            }
            else {
                code_svg.selectAll('g')
                    .append("text")
                    .text(code_text[index])
                    .attr('x', () => {
                        if (index === 2 || index === 3)
                            return width / 5;
                        else
                            return width / 10;
                    })
                    .attr('y', index * rect_height)
                    .attr('dy', rect_height / 2)
                    .style("font-size", "15px")
                    .attr("fill", "white");
            }
        }
    }
    else {
        let temp = code_text[0].split(",");
        let text = code_svg.selectAll("g")
            .append("text")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .attr('x', width / 10)
            .attr('y', rect_height / 10);
        text.selectAll("tspan")
            .data(temp)
            .enter()
            .append("tspan")
            .attr("x", (d, i) => {
                if (i >= 3 && i <= 6)
                    return 2 * text.attr("x");
                else
                    return text.attr("x");
            })
            .attr("dy", rect_height / 10)
            .text(function (d) {
                return d
            })

    }


    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", "#ca82f8");

    hintAnimation(post_data, animation_data, word_id); // 提示窗口动画

}


/**
 * @description  插入算法窗口绘制
 * @param {Object}  post_data
 * @param {Object}  animation_data
 * @param {number}  word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param {number}  now_step 当前选中的代码块
 */
function drawInsertCode(post_data, animation_data, word_id, now_step) {
    let code_text = [];
    if (post_data.insert_pos === 0)
        code_text = ["temp = new Node( ); temp.data = input( );", "temp.next = head", "head = temp"];
    else if (post_data.insert_pos === (post_data.array_data.length - 1))
        code_text = ["temp = new Node( ); temp.data = input( );", "temp.next = tail", "tail = temp"];
    else
        code_text = ["pre = new Node( ); pre = head;", "for(i = 0;i < insert_pos - 1;i++)", "pre = pre.next;",
            "aft = new Node( ); aft = pre.next;", "n_insert = new Node( );", "n_insert.next = aft", "pre.next = n_insert;"];

    d3.select("#code_svg").remove();
    let screen = $("#code_window");
    let width = screen.width();
    let height = screen.height();
    let rect_height = height / code_text.length;

    let code_svg = d3.select("#code_window")
        .append("svg")
        .attr("id", "code_svg")
        .attr("width", width)
        .attr("height", height);

    code_svg.selectAll("rect")
        .data(code_text)
        .enter()
        .append("g")
        .append("rect")
        .attr("class", (d, i) => {
            return "code_rect" + i;
        })
        .attr('x', 0)
        .attr('y', (d, i) => {
            return i * rect_height;
        })
        .attr("width", width)
        .attr("height", rect_height)
        .attr("fill", "#7f4a88");

    for (let index = 0; index < code_text.length; index++) {
            code_svg.selectAll('g')
                .append("text")
                .text(code_text[index])
                .attr('x', () => {
                    if (index === 2 && post_data.insert_pos > 0 && post_data.insert_pos < (post_data.array_data.length - 1))
                        return width / 5;
                    else
                        return width / 10;
                })
                .attr('y', index * rect_height)
                .attr('dy', rect_height / 2)
                .style("font-size", "15px")
                .attr("fill", "white");
    }
    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", "#ca82f8");

    hintAnimation(post_data, animation_data, word_id); // 提示窗口动画

}

/**
 * @description  移除算法窗口绘制
 * @param {Object}  post_data
 * @param {Object}  animation_data
 * @param {number}  word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param {number}  now_step 当前选中的代码块
 */
function drawDeleteCode(post_data, animation_data, word_id, now_step) {
    let code_text = [];
    if (post_data.delete_pos === 0)
        code_text = ["temp = new Node( ); temp = head;", "head = head.next;", "delete(temp);"];
    else if (post_data.delete_pos === post_data.array_data.length)
        code_text = ["pre = new Node( ); pre = head;", "temp = new Node( ); temp = pre.next;",
            "while(temp.next != NULL)","pre = pre.next; temp = pre.next;",
            "pre.next = NULL", "delete(temp); tail = pre;"];
    else
        code_text = ["pre/del/aft = new Node( ); pre = head;", "for(i = 0;i < delete_pos - 1;i++)", "pre = pre.next;",
            "del = pre.next;  aft = del.next", "pre.next = aft",
            "delete(del);"];

    d3.select("#code_svg").remove();
    let screen = $("#code_window");
    let width = screen.width();
    let height = screen.height();
    let rect_height = height / code_text.length;

    let code_svg = d3.select("#code_window")
        .append("svg")
        .attr("id", "code_svg")
        .attr("width", width)
        .attr("height", height);

    code_svg.selectAll("rect")
        .data(code_text)
        .enter()
        .append("g")
        .append("rect")
        .attr("class", (d, i) => {
            return "code_rect" + i;
        })
        .attr('x', 0)
        .attr('y', (d, i) => {
            return i * rect_height;
        })
        .attr("width", width)
        .attr("height", rect_height)
        .attr("fill", "#7f4a88");

    for (let index = 0; index < code_text.length; index++) {
        code_svg.selectAll('g')
            .append("text")
            .text(code_text[index])
            .attr('x', () => {
                if (index === 2 && post_data.delete_pos > 0 && post_data.delete_pos < post_data.array_data.length
                    || index === 3 && post_data.delete_pos === post_data.array_data.length)
                    return width / 5;
                else
                    return width / 10;
            })
            .attr('y', index * rect_height)
            .attr('dy', rect_height / 2)
            .style("font-size", "15px")
            .attr("fill", "white");
    }
    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", "#ca82f8");

    hintAnimation(post_data, animation_data, word_id); // 提示窗口动画

}

/**
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    let temp = $.ajax({
        type: 'POST',
        url: "/link_method",
        async: false,
        data: JSON.stringify(p_data),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            return data;
        }
    });
    return temp.responseJSON;
}

/**
 * @description 错误检查函数
 * @param {object} post_data
 * @param {string||number} value 待检查的值
 * @param {number} value_type 值的类型，1：数组 2：单值 3：下标和值
 * @return {boolean||number} 错误(false)或者正确结果
 */
function checkError(post_data, value, value_type) {
    let error_type = -1;                    // 错误类型
    if (value_type === 1) {                 // 数组
        let array_num;
        if (value === "") {
            error_type = 10;                // 空串
        }
        else {
            array_num = value.split(',');
            if (array_num.length > 10) {
                error_type = 11;            // 数组长度超过10
            }
            else {
                for (let i = 0; i < array_num.length; i++) {
                    if (array_num[i] === "") {
                        error_type = 10;    // 空串
                    }
                    if (isNaN(array_num[i]) === true || array_num[i].indexOf(" ") !== -1) {
                        error_type = 12;    // 含有非法字符
                    }
                    else if (array_num[i] < 0 || array_num[i] > 999
                        || array_num[i].indexOf('.') !== -1) {
                        error_type = 13;    // 值超出范围或非整数
                    }
                    if (error_type !== -1) {
                        break;
                    }
                }
            }
        }
        if (error_type !== -1) {
            errorWarning(error_type);
            return false;
        }
        else {
            return array_num;
        }
    }
    else if (value_type === 2) {            // 单值
        if (post_data.array_data === null) {
            error_type = 14                 // 没有数组数据
        }
        else if (value === "") {
            error_type = 10;                // 空值
        }
        else if (isNaN(value) === true || value.indexOf(" ") !== -1) {
            error_type = 12;                // 含有非法字符
        }
        else if (value < 0 || value > 999
            || value.indexOf('.') !== -1) {
            error_type = 13;                // 值超出范围或非整数
        }
        if (error_type !== -1) {
            errorWarning(error_type);
            return false;
        }
        else {
            return value;
        }
    }
    else if (value_type === 3) {            //下标，值
        let temp_num;
        if (post_data.array_data === null) {
            error_type = 14                 // 没有数组数据
        }
        else if (value === "") {
            error_type = 10;                // 空值
        }
        else {
            temp_num = value.split(',');
            if (temp_num.length !== 2) {
                error_type = 15;            // 输入数据长度错误
            }
            else {
                for (let i = 0; i < temp_num.length; i++) {
                    if (temp_num[i] === "") {
                        error_type = 10;    // 空串
                    }
                    if (isNaN(temp_num[i]) === true || temp_num[i].indexOf(" ") !== -1) {
                        error_type = 12;    // 含有非法字符
                    }
                    else if (temp_num[i] < 0 || temp_num[i] > 999
                        || temp_num[i].indexOf('.') !== -1) {
                        error_type = 13;    // 值超出范围或非整数
                    }
                    if (error_type !== -1) {
                        break;
                    }
                }
                if (temp_num[0] < 0 || temp_num[0] > post_data.array_data.length) {
                    error_type = 16;        // 下标超出范围
                }
            }
        }
        if (error_type !== -1) {
            errorWarning(error_type);
            return false;
        }
        else {
            return temp_num;
        }
    }
}

/**
 * @description 错误提示函数
 * @param {Number} error_type 错误类型
 */
function errorWarning(error_type) {
    switch (error_type) {
        case 10:
            alert("不能输入空值");
            break;
        case 11:
            alert("请输入长度小于10的链表");
            break;
        case 12:
            alert("输入含非法字符，请重新输入");
            break;
        case 13:
            alert("请输入0到999间的整数");
            break;
        case 14:
            alert("输先输入链表");
            break;
        case 15:
            alert("位置和修改值只能为一组数");
            break;
        case 16:
            alert("输入位置超出范围");
            break;
        case 17:
            alert("请先执行查找/插入/移除操作");
            break;
        case 18:
            alert("演示链表最大长度为10，无法继续插入");
            break;
        case 19:
            alert("请保证链表不为空的条件下进行插入操作");
            break;
    }
}

/**
 * @description div隐藏动画绘制
 */
function hideAnimation() {
    let interval = 700;         //动画时间
    let hide_state1 = false;
    let hide_state2 = false;
    let hide_state3 = false;
    $("#hide_bt1").click(function () {
        if (!hide_state1) {
            $("#input_page").animate({left: '+85%'}, interval);
            $("#hide_bt1").attr("class", "hide_left");
            hide_state1 = true;
        }
        else {
            $("#input_page").animate({left: '0%'}, interval);
            $("#hide_bt1").attr("class", "hide_right");
            hide_state1 = false;
        }
    });
    $("#hide_bt2").click(function () {
        if (!hide_state2) {
            $("#hint_window").animate({left: '+85%'}, interval);
            $("#hide_bt2").attr("class", "hide_left");
            hide_state2 = true;
        }
        else {
            $("#hint_window").animate({left: '0%'}, interval);
            $("#hide_bt2").attr("class", "hide_right");
            hide_state2 = false;
        }
    });
    $("#hide_bt3").click(function () {
        if (!hide_state3) {
            $("#code_window").animate({left: '+85%'}, interval);
            $("#hide_bt3").attr("class", "hide_left");
            hide_state3 = true;
        }
        else {
            $("#code_window").animate({left: '0%'}, interval);
            $("#hide_bt3").attr("class", "hide_right");
            hide_state3 = false;
        }
    });
}
