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

    let is_first = true;                   //是否首次进入
    if(is_first){
        clearAllTimer(animation_data, true);            //清除动画定时器
        clearAllTimer(animation_data, false);           //animation_data初始化
        resetPostData(post_data, 1);
        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        resetSvgData(svg_data);
        drawTree(post_data, svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        drawCode(post_data, animation_data, 0, 0);
        is_first = false;
    }

    ///////////////////////////////--------手动输入创建--------///////////////////////////////////////
    $('#submit_bt').click(function () {
        let user_data = $('#user_data').val();
        let result = checkTreeError(post_data, user_data, 1, 15);   //输入错误检查
        if (result !== false) {
            clearAllTimer(animation_data, true);            //清除动画定时器
            clearAllTimer(animation_data, false);           //animation_data初始化
            resetPostData(post_data, 0, result.slice(0));   //slice深拷贝
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));   //更新数据包
            resetSvgData(svg_data);
            // console.log("data", post_data);
            drawTree(post_data, svg_data);
            drawProgress(animation_data, 0);
            drawCode(post_data, animation_data, 0, 0);
        }
    });
    ///////////////////////////////--------随机创建--------///////////////////////////////////////
    $('#random_bt').click(function () {
        clearAllTimer(animation_data, true);            //清除动画定时器
        clearAllTimer(animation_data, false);           //animation_data初始化
        resetPostData(post_data, 1);
        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        resetSvgData(svg_data);
        drawTree(post_data, svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        // console.log(post_data);
        drawCode(post_data, animation_data, 0, 0);
    });
    ///////////////////////////////--------先序遍历功能--------///////////////////////////////////////
    $('#preorder_bt').click(function () {
        let result = true;
        if (post_data.array_data === null) {
            errorWarning(4);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_search = true;                    //执行标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1, post_data.tree_depth);
            resetSvgData(svg_data);
            drawTree(post_data, svg_data);
            drawProgress(animation_data, 0);               //重置进度条
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("pre", post_data);
            drawCode(post_data, animation_data, 1, 0);
            searchAnimation(svg_data, post_data, animation_data);
        }
    });
///////////////////////////////--------中序遍历功能--------///////////////////////////////////////
    $('#inorder_bt').click(function () {
        let result = true;
        if (post_data.array_data === null) {
            errorWarning(4);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_search = true;                    //执行标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 2, post_data.tree_depth);
            resetSvgData(svg_data);
            drawTree(post_data, svg_data);
            drawProgress(animation_data, 0);               //重置进度条
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("in", post_data);
            drawCode(post_data, animation_data, 1, 0);
            searchAnimation(svg_data, post_data, animation_data);
        }
    });
///////////////////////////////--------后序遍历功能--------///////////////////////////////////////
    $('#postorder_bt').click(function () {
        let result = true;
        if (post_data.array_data === null) {
            errorWarning(4);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_search = true;                    //执行标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 3, post_data.tree_depth);
            resetSvgData(svg_data);
            drawTree(post_data, svg_data);
            drawProgress(animation_data, 0);               //重置进度条
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("post", post_data);
            drawCode(post_data, animation_data, 1, 0);
            searchAnimation(svg_data, post_data, animation_data);
        }
    });

    // ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_search) {                         //动画
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                // console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 1500;
                runAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(61);
    });
    // ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
        if (animation_data.is_search) {                        //动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 500;
                clearAllTimer(animation_data, true);
                runAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.is_pause = true;
                animation_data.duration = 500;
                runAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(61);
    });
    hideAnimation();
    search();
}

inputWindow();

/**
 * @description svg_data 圆心坐标重置更新
 * @param {object} svg_data svg相关数据
 */
function resetSvgData(svg_data) {
    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();
    svg_data.m_svg = null;
    svg_data.width = width;
    svg_data.height = height;
    svg_data.circlepos_x = [];        //圆心x坐标
    svg_data.circlepos_y = [];
    svg_data.circle_radius = 30;        //节点半径
    svg_data.tree_width = 100;         //节点间隔
    svg_data.tree_height = 120;        //每层高度
    svg_data.font_size = 20;       //主视图字体大小
    svg_data.circle_stroke = "#aa7070";
    svg_data.circle_num_fill = "#4b2b30";
    svg_data.circle_line_stroke = "#447878";
    svg_data.circle_search_fill = "#f4991a";
    svg_data.line_search_stroke = "red";
    svg_data.search_stroke = "orange";
    svg_data.done_stroke = "#3a7563";
    svg_data.mark_fill = "#f03861";
    svg_data.sample_text_fill = "#8c7676";
    svg_data.title_fill = "#3f72af";
}

/**
 * @description post_data属性设置
 * @param {object} post_data  数据包
 * @param {number} input_tpye  数据生成方式，0默认为手动输入，1为随机
 * @param {object} array_data  保存二叉树数据值
 * @param {number} operate_type  进行的操作类型，0：无，1：先序，2：中序，3：后序
 * @param {number} tree_depth 二叉树深度
 * @param {object} search_process    遍历过程数据(后台)
 * @param search_result 遍历序列
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       tree_depth = 0, search_process = null, search_result = null) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.tree_depth = tree_depth;
    post_data.search_process = search_process;
    post_data.search_result = search_result;
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
        animation_data.is_next = false;     //执行步进标记
        animation_data.searchframe = [];     //排序动画函数缓存器
        animation_data.duration = 1500;       //动画时间基数
        animation_data.is_search = false;   //是否执行遍历标记
        animation_data.code_rect_fill = "#4f5d76";
        animation_data.choose_rect_fill = "#89a4c7";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["二叉树创建完成", "请点击开始按钮运行算法", "输出当前节点：",
            "访问节点左子树", "访问节点右子树", "遍历完成", "节点已输出，寻找下一个节点"];
    }
}

/**
 * @description 主视图二叉树绘制
 * @param {object} post_data 数组数据
 * @param svg_data
 */
function drawTree(post_data, svg_data) {
    d3.select("#screen_svg").remove();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);

    calcPos(post_data, svg_data);
    for (let idx = 0; idx < post_data.array_data.length; idx++) {
        if (post_data.array_data[idx] !== -1) {
            let p_node = Math.floor((idx + 1) / 2) - 1;
            if (p_node >= 0) {
                svg.append('g')
                    .attr('class', "g_line" + idx)
                    .append("line")
                    .attr('class', "circle_line" + idx)
                    .attr("x1", svg_data.circlepos_x[p_node])
                    .attr("y1", svg_data.circlepos_y[p_node])
                    .attr("x2", svg_data.circlepos_x[idx])
                    .attr("y2", svg_data.circlepos_y[idx])
                    .attr("stroke", svg_data.circle_line_stroke)
                    .attr("stroke-width", 2)
            }
        }
    }

    for (let idx = 0; idx < post_data.array_data.length; idx++) {
        if (post_data.array_data[idx] !== -1) {
            svg.append('g')
                .attr('class', "g_circle" + idx)
                .append("circle")
                .attr('class', "m_node" + idx)
                .attr('id', "m_circle" + idx)
                .attr("cx", svg_data.circlepos_x[idx])
                .attr("cy", svg_data.circlepos_y[idx])
                .attr("r", svg_data.circle_radius)
                .attr("fill", "white")
                .attr("stroke", svg_data.circle_stroke)
                .attr("stroke-width", 3);

            svg.select(".g_circle" + idx)
                .append("text")
                .attr('class', "m_node" + idx)
                .attr('id', "m_text" + idx)
                .attr('x', svg_data.circlepos_x[idx])
                .attr('y', svg_data.circlepos_y[idx])
                .attr("dx", -svg_data.circle_radius / 2.5)
                .attr("dy", svg_data.circle_radius / 4)
                .attr("font-size", svg_data.font_size)
                .attr("fill", svg_data.circle_num_fill)
                .text(post_data.array_data[idx]);
        }
    }
    svg.select(".g_circle0")
        .append("text")
        .attr("class", "root")
        .attr('x', svg_data.circlepos_x[0])
        .attr('y', svg_data.circlepos_y[0])
        .attr("dx", -svg_data.circle_radius)
        .attr("dy", -svg_data.circle_radius * 2)
        .attr("font-size", svg_data.font_size * 1.5)
        .attr("fill", "black")
        .text("root");

    svg.append("g").attr("class", "g_visited");
    svg.append("g")
        .attr("class", "g_title")
        .append("text")
        .attr('x', svg_data.width / 2.3)
        .attr('y', svg_data.height / 10)
        .attr("font-size", svg_data.font_size * 2)
        .attr("fill", svg_data.title_fill)
        .text("二叉树");

    svg_data.m_svg = svg;
    drawSample(svg_data);
}

/**
 * @description 主视图图例绘制
 * @param svg_data
 */
function drawSample(svg_data) {
    svg_data.m_svg.append("g")
        .attr("class", "g_sample");
    let sample_rect = [svg_data.circle_stroke, svg_data.circle_search_fill, svg_data.done_stroke];
    let sample_text = ["二叉树节点", "查找中的节点", "已访问过的节点"];
    for (let idx = 0; idx < 3; idx++) {
        if (idx === 0) {
            svg_data.m_svg.select(".g_sample")
                .append("rect")
                .attr("x", svg_data.width / 30)
                .attr("y", svg_data.height / 25 + idx * 30)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "white")
                .attr("stroke-width", 3)
                .attr("stroke", sample_rect[idx]);
        }
        else {
            svg_data.m_svg.select(".g_sample")
                .append("rect")
                .attr("x", svg_data.width / 30)
                .attr("y", svg_data.height / 25 + idx * 30)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", sample_rect[idx]);
        }

        svg_data.m_svg.select(".g_sample")
            .append("text")
            .attr("x", svg_data.width / 30 + 30)
            .attr("y", svg_data.height / 25 + idx * 30)
            .attr("dy", 13)
            .attr("font-size", 15)
            .text(sample_text[idx])
            .attr("fill", svg_data.sample_text_fill);
    }
}

/**
 * @description 计算节点位置
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 */
function calcPos(post_data, svg_data) {

    if (post_data.tree_depth === 1) {
        svg_data.circlepos_x.push(svg_data.width / 2);
        svg_data.circlepos_y.push(svg_data.height / 2);
    }
    else if (post_data.tree_depth === 2) {
        let root_x = svg_data.width / 2;
        let root_y = (svg_data.height - svg_data.tree_height - 2 * svg_data.circle_radius) / 2;
        svg_data.circlepos_x.push(root_x);
        svg_data.circlepos_y.push(root_y);
        for (let idx = 1; idx < post_data.array_data.length; idx++) {
            svg_data.circlepos_y.push(root_y + svg_data.tree_height);
            svg_data.circlepos_x.push(root_x - svg_data.tree_width / 2 + (idx - 1) * svg_data.tree_width);
        }
    }
    else if (post_data.tree_depth === 3) {
        let root_x = svg_data.width / 2 - svg_data.tree_width;
        let root_y = (svg_data.height - 2 * svg_data.tree_height - 2 * svg_data.circle_radius) / 2;
        let x1 = root_x - 3 * svg_data.tree_width / 2;      //第二层开始
        svg_data.circlepos_x.push(root_x);
        svg_data.circlepos_y.push(root_y);
        svg_data.circlepos_x.push(root_x - 3 * svg_data.tree_width / 2);
        svg_data.circlepos_y.push(root_y + svg_data.tree_height);
        svg_data.circlepos_x.push(root_x + 3 * svg_data.tree_width / 2);
        svg_data.circlepos_y.push(root_y + svg_data.tree_height);

        for (let idx = 3; idx < post_data.array_data.length; idx++) {
            svg_data.circlepos_y.push(root_y + 2 * svg_data.tree_height);
            if (idx > 4) {
                svg_data.circlepos_x.push(root_x + 3 * svg_data.tree_width / 2 - svg_data.tree_width / 2 + (idx - 5) * svg_data.tree_width);
            }
            else {
                svg_data.circlepos_x.push(x1 - svg_data.tree_width / 2 + (idx - 3) * svg_data.tree_width);
            }
        }
    }
    else if (post_data.tree_depth === 4) {
        let root_x = svg_data.width / 2 - svg_data.tree_width;
        let root_y = (svg_data.height - 3 * svg_data.tree_height - 2 * svg_data.circle_radius) / 2;
        let x1 = root_x - 2 * svg_data.tree_width;      //第二层开始
        svg_data.circlepos_x.push(root_x);
        svg_data.circlepos_y.push(root_y);
        svg_data.circlepos_x.push(root_x - 2 * svg_data.tree_width);
        svg_data.circlepos_y.push(root_y + svg_data.tree_height);
        svg_data.circlepos_x.push(root_x + 2 * svg_data.tree_width);
        svg_data.circlepos_y.push(root_y + svg_data.tree_height);

        for (let idx = 3; idx < 7; idx++) {
            svg_data.circlepos_y.push(root_y + 2 * svg_data.tree_height);
            svg_data.circlepos_x.push(x1 - svg_data.tree_width + (idx - 3) * svg_data.tree_width * 2);
        }
        let x2 = x1 - svg_data.tree_width;          //第三层开始
        for (let idx = 7; idx < post_data.array_data.length; idx++) {
            svg_data.circlepos_y.push(root_y + 3 * svg_data.tree_height);
            svg_data.circlepos_x.push(x2 - svg_data.tree_width / 2 + (idx - 7) * svg_data.tree_width);
        }
    }
}


/**
 * @description 遍历过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 * @param {object} animation_data 动画数据包
 */
function searchAnimation(svg_data, post_data, animation_data) {
    let temp_frame;
    let arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    svg_data.m_svg.append("defs")
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
        .attr("fill", "black");

    svg_data.m_svg.select(".g_visited")
        .append("text")
        .attr('x', svg_data.width / 7 - 130)
        .attr('y', 5 * svg_data.height / 6)
        .attr("dx", -svg_data.circle_radius / 2.5)
        .attr("dy", svg_data.circle_radius / 4)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.mark_fill)
        .text("遍历序列:");

    let done_id = [];

    if (post_data.operate_type === 1) {       //先序
        for (let idx = 0; idx < post_data.search_process.length; idx++) {
            let start;
            if (post_data.search_process[idx].length > 1)
                start = 1;
            else
                start = 0;
            for (let k = start; k < post_data.search_process[idx].length; k++) {
                temp_frame = function () {
                    if (idx === 0 && k === start) {
                        svg_data.m_svg.append("g")
                            .attr("class", "g_now")
                            .append("text")
                            .attr("class", "now_text")
                            .attr('x', svg_data.circlepos_x[0])
                            .attr('y', svg_data.circlepos_y[0])
                            .attr("dx", -svg_data.circle_radius)
                            .attr("dy", svg_data.circle_radius * 2)
                            .attr("font-size", svg_data.font_size * 1.2)
                            .attr("fill", svg_data.mark_fill)
                            .text("now");
                    }

                    svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k])
                        .transition()
                        .duration(animation_data.duration)
                        .attr("fill", svg_data.circle_search_fill)
                        .attr("stroke", svg_data.done_stroke);

                    svg_data.m_svg.select(".now_text")
                        .transition()
                        .duration(animation_data.duration)
                        .attr('x', svg_data.circlepos_x[post_data.search_process[idx][k]])
                        .attr('y', svg_data.circlepos_y[post_data.search_process[idx][k]]);

                    if (k === 0) {
                        drawCode(post_data, animation_data, 2, 2, post_data.array_data[post_data.search_process[idx][k]]);
                        let pos = post_data.search_result[post_data.search_process[idx][k]];
                        svg_data.m_svg.select(".g_visited")
                            .append('g')
                            .attr('class', "g_out" + pos)
                            .append("circle")
                            .attr("cx", svg_data.width / 7 + pos * 80)
                            .attr("cy", 5 * svg_data.height / 6)
                            .attr("r", svg_data.circle_radius)
                            .attr("fill", svg_data.done_stroke)
                            .attr("stroke", svg_data.done_stroke)
                            .attr("stroke-width", 3);

                        svg_data.m_svg.select(".g_out" + pos)
                            .append("text")
                            .attr('x', svg_data.width / 7 + pos * 80)
                            .attr('y', 5 * svg_data.height / 6)
                            .attr("dx", -svg_data.circle_radius / 2.5)
                            .attr("dy", svg_data.circle_radius / 4)
                            .attr("font-size", svg_data.font_size)
                            .attr("fill", "white")
                            .text(post_data.array_data[post_data.search_process[idx][k]]);
                    }


                    if (k > 0) {
                        svg_data.m_svg.select(".temp_line").remove();

                        svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k - 1])
                            .transition()
                            .duration(animation_data.duration)
                            .attr("fill", svg_data.done_stroke);

                        let line_id;
                        if (post_data.search_process[idx][k] > post_data.search_process[idx][k - 1]) {
                            line_id = post_data.search_process[idx][k];
                            if ((post_data.search_process[idx][k] + 1) === (post_data.search_process[idx][k - 1] + 1) * 2) {
                                if (done_id.indexOf(post_data.search_process[idx][k]) === -1) {
                                    drawCode(post_data, animation_data, 3, 3);                           //左子树
                                    let temp_timer = setTimeout(() => {
                                        drawCode(post_data, animation_data, 2, 2, post_data.array_data[post_data.search_process[idx][k]]);
                                        let pos = post_data.search_result[post_data.search_process[idx][k]];
                                        svg_data.m_svg.select(".g_visited")
                                            .append('g')
                                            .attr('class', "g_out" + pos)
                                            .append("circle")
                                            .attr("cx", svg_data.width / 7 + pos * 80)
                                            .attr("cy", 5 * svg_data.height / 6)
                                            .attr("r", svg_data.circle_radius)
                                            .attr("fill", svg_data.done_stroke)
                                            .attr("stroke", svg_data.done_stroke)
                                            .attr("stroke-width", 3);

                                        svg_data.m_svg.select(".g_out" + pos)
                                            .append("text")
                                            .attr('x', svg_data.width / 7 + pos * 80)
                                            .attr('y', 5 * svg_data.height / 6)
                                            .attr("dx", -svg_data.circle_radius / 2.5)
                                            .attr("dy", svg_data.circle_radius / 4)
                                            .attr("font-size", svg_data.font_size)
                                            .attr("fill", "white")
                                            .text(post_data.array_data[post_data.search_process[idx][k]]);
                                    }, animation_data.duration / 2);
                                    animation_data.all_timer.push(temp_timer);              // 计时器缓存
                                }
                            }
                            else if ((post_data.search_process[idx][k] + 1) === (((post_data.search_process[idx][k - 1] + 1) * 2) + 1)) {
                                if (done_id.indexOf(post_data.search_process[idx][k]) === -1) {
                                    drawCode(post_data, animation_data, 4, 4);                         //右子树
                                    let temp_timer = setTimeout(() => {
                                        drawCode(post_data, animation_data, 2, 2, post_data.array_data[post_data.search_process[idx][k]]);
                                        let pos = post_data.search_result[post_data.search_process[idx][k]];
                                        svg_data.m_svg.select(".g_visited")
                                            .append('g')
                                            .attr('class', "g_out" + pos)
                                            .append("circle")
                                            .attr("cx", svg_data.width / 7 + pos * 80)
                                            .attr("cy", 5 * svg_data.height / 6)
                                            .attr("r", svg_data.circle_radius)
                                            .attr("fill", svg_data.done_stroke)
                                            .attr("stroke", svg_data.done_stroke)
                                            .attr("stroke-width", 3);

                                        svg_data.m_svg.select(".g_out" + pos)
                                            .append("text")
                                            .attr('x', svg_data.width / 7 + pos * 80)
                                            .attr('y', 5 * svg_data.height / 6)
                                            .attr("dx", -svg_data.circle_radius / 2.5)
                                            .attr("dy", svg_data.circle_radius / 4)
                                            .attr("font-size", svg_data.font_size)
                                            .attr("fill", "white")
                                            .text(post_data.array_data[post_data.search_process[idx][k]]);
                                    }, animation_data.duration / 2);
                                    animation_data.all_timer.push(temp_timer);              // 计时器缓存
                                }
                            }
                        }
                        else {
                            line_id = post_data.search_process[idx][k - 1];
                            drawCode(post_data, animation_data, 6, 0);
                        }

                        svg_data.m_svg.select(".g_line" + line_id)
                            .append("line")
                            .attr("class", "temp_line")
                            .attr("x1", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y1", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("x2", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y2", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("stroke", svg_data.mark_fill)
                            .attr("stroke-width", 3)
                            .attr("marker-end", "url(#arrow)")
                            .transition()
                            .duration(animation_data.duration)
                            .attr("x1", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y1", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("x2", svg_data.circlepos_x[post_data.search_process[idx][k]])
                            .attr("y2", svg_data.circlepos_y[post_data.search_process[idx][k]])
                    }
                };
                animation_data.searchframe.push(temp_frame);
            }
        }
    }
    else if (post_data.operate_type === 2) {       //中序
        for (let idx = 0; idx < post_data.search_process.length; idx++) {
            let start;
            if (post_data.search_process[idx].length > 1)
                start = 1;
            else
                start = 0;
            for (let k = start; k < post_data.search_process[idx].length; k++) {
                temp_frame = function () {
                    if (idx === 0 && k === start) {
                        svg_data.m_svg.append("g")
                            .attr("class", "g_now")
                            .append("text")
                            .attr("class", "now_text")
                            .attr('x', svg_data.circlepos_x[0])
                            .attr('y', svg_data.circlepos_y[0])
                            .attr("dx", -svg_data.circle_radius)
                            .attr("dy", svg_data.circle_radius * 2)
                            .attr("font-size", svg_data.font_size * 1.2)
                            .attr("fill", svg_data.mark_fill)
                            .text("now");
                    }

                    if (post_data.search_process.length === 1) {
                        drawCode(post_data, animation_data, 2, 3, post_data.array_data[post_data.search_process[idx][k]]);
                        let pos = post_data.search_result[post_data.search_process[idx][k]];
                        svg_data.m_svg.select(".g_visited")
                            .append('g')
                            .attr('class', "g_out" + pos)
                            .append("circle")
                            .attr("cx", svg_data.width / 7 + pos * 80)
                            .attr("cy", 5 * svg_data.height / 6)
                            .attr("r", svg_data.circle_radius)
                            .attr("fill", svg_data.done_stroke)
                            .attr("stroke", svg_data.done_stroke)
                            .attr("stroke-width", 3);

                        svg_data.m_svg.select(".g_out" + pos)
                            .append("text")
                            .attr('x', svg_data.width / 7 + pos * 80)
                            .attr('y', 5 * svg_data.height / 6)
                            .attr("dx", -svg_data.circle_radius / 2.5)
                            .attr("dy", svg_data.circle_radius / 4)
                            .attr("font-size", svg_data.font_size)
                            .attr("fill", "white")
                            .text(post_data.array_data[post_data.search_process[idx][k]]);
                    }

                    svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k])
                        .transition()
                        .duration(animation_data.duration)
                        .attr("fill", svg_data.circle_search_fill)
                        .attr("stroke", svg_data.search_stroke);

                    svg_data.m_svg.select(".now_text")
                        .transition()
                        .duration(animation_data.duration)
                        .attr('x', svg_data.circlepos_x[post_data.search_process[idx][k]])
                        .attr('y', svg_data.circlepos_y[post_data.search_process[idx][k]]);

                    if (k === post_data.search_process[idx].length - 1) {
                        done_id.push(post_data.search_process[idx][k]);
                        let temp_timer = setTimeout(() => {
                            drawCode(post_data, animation_data, 2, 3, post_data.array_data[post_data.search_process[idx][k]]);
                            let pos = post_data.search_result[post_data.search_process[idx][k]];
                            svg_data.m_svg.select(".g_visited")
                                .append('g')
                                .attr('class', "g_out" + pos)
                                .append("circle")
                                .attr("cx", svg_data.width / 7 + pos * 80)
                                .attr("cy", 5 * svg_data.height / 6)
                                .attr("r", svg_data.circle_radius)
                                .attr("fill", svg_data.done_stroke)
                                .attr("stroke", svg_data.done_stroke)
                                .attr("stroke-width", 3);

                            svg_data.m_svg.select(".g_out" + pos)
                                .append("text")
                                .attr('x', svg_data.width / 7 + pos * 80)
                                .attr('y', 5 * svg_data.height / 6)
                                .attr("dx", -svg_data.circle_radius / 2.5)
                                .attr("dy", svg_data.circle_radius / 4)
                                .attr("font-size", svg_data.font_size)
                                .attr("fill", "white")
                                .text(post_data.array_data[post_data.search_process[idx][k]]);
                        }, animation_data.duration / 2);
                        animation_data.all_timer.push(temp_timer);              // 计时器缓存
                    }

                    if (k > 0) {
                        svg_data.m_svg.select(".temp_line").remove();
                        if (done_id.indexOf(post_data.search_process[idx][k - 1]) !== -1) {
                            svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k - 1])
                                .transition()
                                .duration(animation_data.duration)
                                .attr("fill", svg_data.done_stroke)
                                .attr("stroke", svg_data.done_stroke);
                        }
                        else {
                            svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k - 1])
                                .transition()
                                .duration(animation_data.duration)
                                .attr("fill", "white")
                                .attr("stroke", svg_data.circle_stroke);
                        }

                        let line_id;
                        if (post_data.search_process[idx][k] > post_data.search_process[idx][k - 1]) {
                            line_id = post_data.search_process[idx][k];
                            if ((post_data.search_process[idx][k] + 1) === (post_data.search_process[idx][k - 1] + 1) * 2) {
                                drawCode(post_data, animation_data, 3, 2);                           //左子树
                            }
                            else if ((post_data.search_process[idx][k] + 1) === (((post_data.search_process[idx][k - 1] + 1) * 2) + 1)) {
                                drawCode(post_data, animation_data, 4, 4);                         //右子树
                            }
                        }
                        else {
                            line_id = post_data.search_process[idx][k - 1];
                            drawCode(post_data, animation_data, 6, 0);
                        }

                        svg_data.m_svg.select(".g_line" + line_id)
                            .append("line")
                            .attr("class", "temp_line")
                            .attr("x1", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y1", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("x2", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y2", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("stroke", svg_data.mark_fill)
                            .attr("stroke-width", 3)
                            .attr("marker-end", "url(#arrow)")
                            .transition()
                            .duration(animation_data.duration)
                            .attr("x1", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y1", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("x2", svg_data.circlepos_x[post_data.search_process[idx][k]])
                            .attr("y2", svg_data.circlepos_y[post_data.search_process[idx][k]])
                    }
                };
                animation_data.searchframe.push(temp_frame);
            }
        }
    }
    else if (post_data.operate_type === 3) {       //后序
        for (let idx = 0; idx < post_data.search_process.length; idx++) {
            let start;
            if (post_data.search_process[idx].length > 1)
                start = 1;
            else
                start = 0;
            for (let k = start; k < post_data.search_process[idx].length; k++) {
                temp_frame = function () {
                    if (idx === 0 && k === start) {
                        svg_data.m_svg.append("g")
                            .attr("class", "g_now")
                            .append("text")
                            .attr("class", "now_text")
                            .attr('x', svg_data.circlepos_x[0])
                            .attr('y', svg_data.circlepos_y[0])
                            .attr("dx", -svg_data.circle_radius)
                            .attr("dy", svg_data.circle_radius * 2)
                            .attr("font-size", svg_data.font_size * 1.2)
                            .attr("fill", svg_data.mark_fill)
                            .text("now");
                    }

                    svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k])
                        .transition()
                        .duration(animation_data.duration)
                        .attr("fill", svg_data.circle_search_fill)
                        .attr("stroke", svg_data.search_stroke);

                    svg_data.m_svg.select(".now_text")
                        .transition()
                        .duration(animation_data.duration)
                        .attr('x', svg_data.circlepos_x[post_data.search_process[idx][k]])
                        .attr('y', svg_data.circlepos_y[post_data.search_process[idx][k]]);

                    if (k === post_data.search_process[idx].length - 1) {
                        done_id.push(post_data.search_process[idx][k]);
                        let temp_timer = setTimeout(() => {
                            drawCode(post_data, animation_data, 2, 4, post_data.array_data[post_data.search_process[idx][k]]);
                            let pos = post_data.search_result[post_data.search_process[idx][k]];
                            svg_data.m_svg.select(".g_visited")
                                .append('g')
                                .attr('class', "g_out" + pos)
                                .append("circle")
                                .attr("cx", svg_data.width / 7 + pos * 80)
                                .attr("cy", 5 * svg_data.height / 6)
                                .attr("r", svg_data.circle_radius)
                                .attr("fill", svg_data.done_stroke)
                                .attr("stroke", svg_data.done_stroke)
                                .attr("stroke-width", 3);

                            svg_data.m_svg.select(".g_out" + pos)
                                .append("text")
                                .attr('x', svg_data.width / 7 + pos * 80)
                                .attr('y', 5 * svg_data.height / 6)
                                .attr("dx", -svg_data.circle_radius / 2.5)
                                .attr("dy", svg_data.circle_radius / 4)
                                .attr("font-size", svg_data.font_size)
                                .attr("fill", "white")
                                .text(post_data.array_data[post_data.search_process[idx][k]]);
                        }, animation_data.duration / 2);
                        animation_data.all_timer.push(temp_timer);              // 计时器缓存
                    }


                    if (k > 0) {
                        svg_data.m_svg.select(".temp_line").remove();
                        if (done_id.indexOf(post_data.search_process[idx][k - 1]) !== -1) {
                            svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k - 1])
                                .transition()
                                .duration(animation_data.duration)
                                .attr("fill", svg_data.done_stroke)
                                .attr("stroke", svg_data.done_stroke);
                        }
                        else {
                            svg_data.m_svg.select("#m_circle" + post_data.search_process[idx][k - 1])
                                .transition()
                                .duration(animation_data.duration)
                                .attr("fill", "white")
                                .attr("stroke", svg_data.circle_stroke);
                        }

                        let line_id;
                        if (post_data.search_process[idx][k] > post_data.search_process[idx][k - 1]) {
                            line_id = post_data.search_process[idx][k];
                            if ((post_data.search_process[idx][k] + 1) === (post_data.search_process[idx][k - 1] + 1) * 2) {
                                drawCode(post_data, animation_data, 3, 2);                           //左子树
                            }
                            else if ((post_data.search_process[idx][k] + 1) === (((post_data.search_process[idx][k - 1] + 1) * 2) + 1)) {
                                drawCode(post_data, animation_data, 4, 3);                         //右子树
                            }
                        }
                        else {
                            line_id = post_data.search_process[idx][k - 1];
                            drawCode(post_data, animation_data, 6, 0);
                        }
                        svg_data.m_svg.select(".g_line" + line_id)
                            .append("line")
                            .attr("class", "temp_line")
                            .attr("x1", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y1", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("x2", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y2", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("stroke", svg_data.mark_fill)
                            .attr("stroke-width", 3)
                            .attr("marker-end", "url(#arrow)")
                            .transition()
                            .duration(animation_data.duration)
                            .attr("x1", svg_data.circlepos_x[post_data.search_process[idx][k - 1]])
                            .attr("y1", svg_data.circlepos_y[post_data.search_process[idx][k - 1]])
                            .attr("x2", svg_data.circlepos_x[post_data.search_process[idx][k]])
                            .attr("y2", svg_data.circlepos_y[post_data.search_process[idx][k]])
                    }
                };
                animation_data.searchframe.push(temp_frame);
            }
        }

    }
}


/**
 * @description 算法窗口绘制
 * @param {Object}  post_data
 * @param {Object}  animation_data
 * @param {number}  word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param {number}  now_step 当前选中的代码块
 * @param out_num 输出节点
 */
function drawCode(post_data, animation_data, word_id, now_step, out_num = -1) {
    let code_text = [];
    if (post_data.operate_type === 1)
        code_text = ["void PreOrder(tree *node)", "if(node != null)", "access(node->data)", "PreOrder(node->left)", "PreOrder(node->right)"];
    else if (post_data.operate_type === 2)
        code_text = ["void InOrder(tree *node)", "if(node != null)", "InOrder(node->left)", "access(node->data)", "InOrder(node->right)"];
    else if (post_data.operate_type === 3)
        code_text = ["void PostOrder(tree *node)", "if(node != null)", "PostOrder(node->left)", "PostOrder(node->right)", "access(node->data)"];
    else if (post_data.operate_type === 0)
        code_text = ["请执行遍历操作"];

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
        .attr("fill", animation_data.code_rect_fill);

    for (let index = 0; index < code_text.length; index++) {
        code_svg.selectAll('g')
            .append("text")
            .text(code_text[index])
            .attr('x', () => {
                if (index === 0)
                    return width / 10;
                else if (index === 1)
                    return width / 5;
                else
                    return width / 3;
            })
            .attr('y', index * rect_height)
            .attr('dy', rect_height / 2)
            .attr("fill", "white");

    }

    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", animation_data.choose_rect_fill);

    DrawhintAnimation(post_data, animation_data, word_id, out_num); // 提示窗口动画
}


/**
 * @description 排序过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.searchframe.length) {  //步进执行
            drawProgress(animation_data, animation_data.searchframe.length);
            animation_data.searchframe[animation_data.now_step]();//执行主视图动画
            // showCode(post_data, animation_data);
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.searchframe.length - 1) {
                animation_data.is_pause = true;
                drawCode(post_data, animation_data, 5, 0);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找失败");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawProgress(animation_data, animation_data.searchframe.length);
            animation_data.searchframe[animation_data.now_step]();
            // showCode(post_data, animation_data);
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description 解释窗口的动画绘制
 * @param {object} post_data
 * @param {object} animation_data
 * @param word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param nums 输出节点
 */
function DrawhintAnimation(post_data, animation_data, word_id, nums) {
    let temp;
    if (word_id === 2)
        temp = animation_data.explain_words[word_id] + nums;
    else
        temp = animation_data.explain_words[word_id];

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
        .attr("fill", animation_data.hint_text_fill)
        .text(temp);
}

/**
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    let temp = $.ajax({
        type: 'POST',
        url: "/binary_tree_method",
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
 * @description 错误检查
 */
function checkTreeError(post_data, value, value_type, list_len = 10, max_num = 999) {
    let error_type = -1;                    // 错误类型
    if (value_type === 1) {                 // 数组
        let array_num;
        if (value === "") {
            error_type = 1;                // 空串
        }
        else {
            array_num = value.split(',');
            if (array_num.length > list_len && list_len === 10) {
                error_type = 5;            // 数组长度超过10
            }
            else if (array_num.length > list_len && list_len === 15) {
                error_type = 8;            // 数组长度超过15
            }
            else {
                for (let i = 0; i < array_num.length; i++) {
                    let p_node = Math.floor((i + 1) / 2) - 1;

                    if (array_num[i] === "") {
                        error_type = 1;    // 空串
                    }
                    if (isNaN(array_num[i]) === true || array_num[i].indexOf(" ") !== -1) {
                        error_type = 2;    // 含有非法字符
                    }
                    else if (array_num[i] < 0 || array_num[i] > max_num
                        || array_num[i].indexOf('.') !== -1) {
                        if (Number(array_num[i]) !== -1) {
                            if (max_num === 999)
                                error_type = 3;    // 值超出范围或非整数
                        }
                    }
                    else if (Number(array_num[p_node]) === -1)
                        error_type = 60;
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
}