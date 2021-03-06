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
        drawHistogram(post_data.array_data, svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        drawCode(post_data, animation_data, 0, 0);
        is_first = false;
    }

    ///////////////////////////////--------手动输入创建--------///////////////////////////////////////
    $('#submit_bt').click(function () {
        let user_data = $('#user_data').val();
        let result = checkError(post_data, user_data, 1, 15, 100);   //输入错误检查
        if (result !== false) {
            clearAllTimer(animation_data, true);            //清除动画定时器
            clearAllTimer(animation_data, false);           //animation_data初始化
            resetPostData(post_data, 0, result.slice(0));   //slice深拷贝
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));   //更新数据包
            resetSvgData(svg_data);
            // console.log("data", post_data);
            drawHistogram(post_data.array_data, svg_data);
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
        drawHistogram(post_data.array_data, svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        // console.log(post_data);
        drawCode(post_data, animation_data, 0, 0);
    });
    ///////////////////////////////--------排序功能--------///////////////////////////////////////
    $('#sort_bt').click(function () {
        let result = true;
        if (post_data.array_data === null) {
            errorWarning(4);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_sort = true;                    //执行标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1);
            resetSvgData(svg_data);
            drawHistogram(post_data.array_data, svg_data);
            drawProgress(animation_data, 0);               //重置进度条
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("sort", post_data);
            drawCode(post_data, animation_data, 1, 0);
            sortAnimation(svg_data, post_data, animation_data);
        }
    });

    // ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_sort) {                         //动画
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                // console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 1600;
                runAnimation(post_data, animation_data, svg_data);
            }
        }
        else
            errorWarning(50);
    });
    // ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
        if (animation_data.is_sort) {                        //动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 1000;
                clearAllTimer(animation_data, true);
                runAnimation(post_data, animation_data, svg_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 1000;
                runAnimation(post_data, animation_data, svg_data);
            }
        }
        else
            errorWarning(50);
    });
    hideAnimation();
    drawIntrouce();
    search();
}

inputWindow();

/**
 * @description svg_data 矩形x坐标重置更新
 * @param {object} svg_data svg相关数据
 */
function resetSvgData(svg_data) {
    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();
    svg_data.m_svg = null;
    svg_data.width = width;
    svg_data.height = height;
    svg_data.rect_x = [];
    svg_data.rect_width = 60;        //矩形宽度
    svg_data.rect_padding = 4;        //间距
    svg_data.font_size = 20;       //主视图字体大小
    svg_data.rect_fill = "#4CB4E7";
    svg_data.num_fill = "#a06ee1";
    svg_data.rect_done_fill = "#112d4e";
    svg_data.rect_search_fill = "#fab57a";
    svg_data.rect_choose_fill = "#a1de93";
    svg_data.base_num_fill = "#606470";
    svg_data.mark_fill = "#f03861";
    svg_data.sample_text_fill = "#8c7676";
    svg_data.title_fill = "#3f72af";
}

/**
 * @description post_data属性设置
 * @param {object} post_data  数据包
 * @param {number} input_tpye  数据生成方式，0默认为手动输入，1为随机
 * @param {object} array_data  保存链表值
 * @param {number} operate_type  进行的操作类型，0：无，1：排序
 * @param {object} sort_process    排序过程数据(后台)
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       sort_process = null) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.sort_process = sort_process;
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
        animation_data.sortframe = [];     //排序动画函数缓存器
        animation_data.duration = 1600;       //动画时间基数
        animation_data.is_sort = false;   //是否执行排序标记
        animation_data.code_rect_fill = "#4f5d76";
        animation_data.choose_rect_fill = "#89a4c7";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["数组创建完成", "请点击开始按钮运行算法", "向左寻找第一个小于基准元素的值",
            "向右寻找第一个大于基准元素的值", "将a[j]和基准元素的位置交换", "将a[i]和基准元素的位置交换", "基准元素归位",
            "向左区间递归进行排序", "向右区间递归进行排序", "排序完成", "对所有元素进行第一次排序"];
    }
}

/**
 * @description 主视图直方图绘制（排序前）
 * @param {Array} array_data 数组数据
 * @param svg_data
 */
function drawHistogram(array_data, svg_data) {
    d3.select("#screen_svg").remove();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);

    let total_len = svg_data.rect_width * array_data.length;//总长度
    let start_pos = (svg_data.width - total_len) / 2 - 60;
    let scale = d3.scaleLinear().domain([0, Math.max.apply(null, array_data)]).range([0, 450]);

    svg.selectAll("rect")                           // 直方图绘制
        .data(array_data)
        .enter()
        .append('g')
        .attr("class", function (d, i) {
            return "g_rect" + i;
        })
        .append("rect")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr('id', function (d, i) {
            return "m_rect" + i;
        })
        .attr("x", function (d, i) {
            svg_data.rect_x.push(start_pos + i * svg_data.rect_width);
            return start_pos + i * svg_data.rect_width;
        })
        .attr("y", function (d, i) {
            if (d === 0)
                return (2 * svg_data.height / 3) - scale(d + 1);
            else
                return (2 * svg_data.height / 3) - scale(d);
        })
        .attr("width", svg_data.rect_width - svg_data.rect_padding)
        .attr("height", function (d, i) {
            if (d === 0)
                return scale(d + 1);
            else
                return scale(d);
        })
        .attr("fill", svg_data.rect_fill);

    for (let index = 0; index < array_data.length; index++) {
        svg.select('.g_rect' + index)                              // 数组数字绘制
            .append("text")
            .attr('class', "m_rect" + index)
            .attr("id", "rect_text" + index)
            .attr('x', svg_data.rect_x[index])
            .attr('y', 2 * svg_data.height / 3)
            .attr("dx", svg_data.rect_width / 4)
            .attr("dy", svg_data.rect_width / 2)
            .attr("font-size", svg_data.font_size * 1.3)
            .attr("fill", svg_data.num_fill)
            .text(array_data[index]);
    }
    svg.select(".g_rect0")
        .append("text")
        .attr('class', "i")
        .attr('x', svg_data.rect_x[0])
        .attr('y', 2 * svg_data.height / 3)
        .attr("dx", svg_data.rect_width / 4)
        .attr("dy", svg_data.rect_width)
        .attr("font-size", svg_data.font_size * 1.3)
        .attr("fill", svg_data.mark_fill)
        .text("i");
    if (array_data.length === 1) {
        svg.select(".g_rect0")
            .append("text")
            .attr('class', "j")
            .attr('x', svg_data.rect_x[0])
            .attr('y', 2 * svg_data.height / 3)
            .attr("dx", svg_data.rect_width / 4)
            .attr("dy", svg_data.rect_width * 1.5)
            .attr("font-size", svg_data.font_size * 1.3)
            .attr("fill", svg_data.mark_fill)
            .text("j");
    }
    else {
        svg.select(".g_rect" + (array_data.length - 1))
            .append("text")
            .attr('class', "j")
            .attr('x', svg_data.rect_x[array_data.length - 1])
            .attr('y', 2 * svg_data.height / 3)
            .attr("dx", svg_data.rect_width / 4)
            .attr("dy", svg_data.rect_width * 1.5)
            .attr("font-size", svg_data.font_size * 1.3)
            .attr("fill", svg_data.mark_fill)
            .text("j");
    }
     svg.append("g")
        .attr("class", "g_title")
        .append("text")
        .attr('x', svg_data.width / 2.2)
        .attr('y', svg_data.height / 10)
        .attr("font-size", svg_data.font_size * 2)
        .attr("fill", svg_data.title_fill)
        .text("快速排序");
    let intro_wid = $("#hint_page").width();
    let intro_hei = $("#hint_page").height();
    let code_wid = $("#code_page").width();
    let code_hei = $("#code_page").height();

    svg.append("g")
        .attr("class", "g_intro")
        .append("text")
        .attr('x', svg_data.width - intro_wid)
        .attr('y', svg_data.height - intro_hei - code_hei - 50)
        .attr("font-size", svg_data.font_size * 1.1)
        .attr("fill", svg_data.sample_text_fill)
        .text("解释窗口：");

    svg.append("g")
        .attr("class", "g_icode")
        .append("text")
        .attr('x', svg_data.width - code_wid)
        .attr('y', svg_data.height - code_hei - 15)
        .attr("font-size", svg_data.font_size * 1.1)
        .attr("fill", svg_data.sample_text_fill)
        .text("伪代码窗口：");

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
    let sample_rect = [svg_data.rect_fill, svg_data.rect_search_fill, svg_data.rect_choose_fill, svg_data.base_num_fill, svg_data.rect_done_fill];
    let sample_text = ["未排序元素", "查找中的元素", "待交换元素", "基准元素", "已归位元素"];
    for (let idx = 0; idx < 5; idx++) {
        svg_data.m_svg.select(".g_sample")
            .append("rect")
            .attr("x", svg_data.width / 30)
            .attr("y", svg_data.height / 25 + idx * 30)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", sample_rect[idx]);

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
 * @description 结论绘制
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 */
function drawConclusion(svg_data, post_data) {
    let sum = 0;
    for(let idx = 0;idx<post_data.sort_process.length;idx++){
        sum += (post_data.sort_process[idx].length - 1);
    }

    svg_data.m_svg.append("g")
        .attr("class","g_conclusion")
        .append("text")
        .attr("x",svg_data.width / 3)
        .attr("y",17*svg_data.height / 20)
        .attr("font-size", svg_data.font_size * 1.3)
        .attr("fill",svg_data.mark_fill)
        .text("本次排序总共交换的次数为："+ sum);
}


/**
 * @description 排序过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 * @param {object} animation_data 动画数据包
 */
function sortAnimation(svg_data, post_data, animation_data) {

    let temp_frame;
    for (let idx = 0; idx < post_data.sort_process.length; idx++) {

        if (post_data.sort_process[idx].length === 1) {
            temp_frame = function () {
                if (idx > 0 && post_data.sort_process[idx][0][1]
                    < post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1][post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1].length - 1]) {
                    drawCode(post_data, animation_data, 7, 5); // 左递归
                    let temp_timer = setTimeout(() => {
                        drawCode(post_data, animation_data, 6, 2);
                    }, animation_data.duration / 2);
                    animation_data.all_timer.push(temp_timer);       // 计时器缓存
                }

                else if (idx > 0 &&post_data.sort_process[idx][0][1]
                    > post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1][post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1].length - 1]){
                    drawCode(post_data, animation_data, 8, 6);  //右递归
                    let temp_timer = setTimeout(() => {
                        drawCode(post_data, animation_data, 6, 2);
                    }, animation_data.duration / 2);
                    animation_data.all_timer.push(temp_timer);       // 计时器缓存
                }

                svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][0][1])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_done_fill);

                svg_data.m_svg.select(".i")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x", svg_data.rect_x[post_data.sort_process[idx][0][1]]);

                svg_data.m_svg.select(".j")
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x", svg_data.rect_x[post_data.sort_process[idx][0][1]]);
            };
            animation_data.sortframe.push(temp_frame);
        }
        else {
            temp_frame = function () {                                          //重新划定范围
                if(idx === 0)
                    drawCode(post_data, animation_data, 10, 0);
                if (idx > 0 && post_data.sort_process[idx][0][1]
                    < post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1][post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1].length - 1])
                    drawCode(post_data, animation_data, 7, 5); // 左递归
                else if (idx > 0 &&post_data.sort_process[idx][0][1]
                    > post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1][post_data.sort_process[idx - 1][post_data.sort_process[idx - 1].length - 1].length - 1])
                    drawCode(post_data, animation_data, 8, 6);  //右递归

                svg_data.m_svg.select(".i")
                    .transition()
                    .duration(animation_data.duration / 3)
                    .attr("x", svg_data.rect_x[post_data.sort_process[idx][0][1]]);

                svg_data.m_svg.select(".j")
                    .transition()
                    .duration(animation_data.duration / 3)
                    .attr("x", svg_data.rect_x[post_data.sort_process[idx][0][2]]);

                svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][0][1])
                    .attr("fill",svg_data.base_num_fill);

            };
            animation_data.sortframe.push(temp_frame);
            for (let k = 1; k < post_data.sort_process[idx].length; k += 2) {
                ///////////////////////////////////////////////////////////////////////遍历  j 前移

                for (let p = 1; p < (post_data.sort_process[idx][k].length - 2); p++) {
                    temp_frame = function () {

                        drawCode(post_data, animation_data, 2, 1);

                        svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][k][p])
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_search_fill);

                        svg_data.m_svg.select(".j")
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("x", svg_data.rect_x[post_data.sort_process[idx][k][p]]);

                        if (p > 1) {
                            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][k][p - 1])
                                .transition()
                                .duration(animation_data.duration / 2)
                                .attr("fill", ()=>{
                                    // if(p === 2)
                                    //     return svg_data.base_num_fill;
                                    // else
                                        return svg_data.rect_fill;
                                });
                            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][k][p - 1])
                                .transition()
                                .duration(animation_data.duration / 2)
                                .attr("fill", svg_data.num_fill);
                        }

                    };
                    animation_data.sortframe.push(temp_frame);
                }
                //////////////////////////////////////////////////////////////////////// 交换 j
                let base_num_pos = post_data.sort_process[idx][k][post_data.sort_process[idx][k].length - 2];
                let temp_j = post_data.sort_process[idx][k][post_data.sort_process[idx][k].length - 1];
                if (temp_j !== base_num_pos) {                                      // 交换  j
                    temp_frame = function () {
                        if (post_data.sort_process[idx][k].length > 3) {
                            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][k][post_data.sort_process[idx][k].length - 3])
                                .transition()
                                .duration(animation_data.duration / 3)
                                .attr("fill", svg_data.rect_fill);
                            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][k][post_data.sort_process[idx][k].length - 3])
                                .transition()
                                .duration(animation_data.duration / 3)
                                .attr("fill", svg_data.num_fill);
                        }

                        drawCode(post_data, animation_data, 4, 2);

                        svg_data.m_svg.select(".j")
                            .transition()
                            .duration(animation_data.duration / 3)
                            .attr("x", svg_data.rect_x[temp_j]);

                        svg_data.m_svg.selectAll(".m_rect" + base_num_pos)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.base_num_fill)
                            .attr("x", svg_data.rect_x[temp_j]);

                        svg_data.m_svg.selectAll(".m_rect" + temp_j)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_choose_fill)
                            .attr("x", svg_data.rect_x[base_num_pos]);

                        svg_data.m_svg.selectAll(".m_rect" + base_num_pos).attr("class", "tmp_class");
                        svg_data.m_svg.select("#m_rect" + base_num_pos).attr("id", "tmp_rect");
                        svg_data.m_svg.select("#rect_text" + base_num_pos).attr("id", "tmp_text");

                        svg_data.m_svg.selectAll(".m_rect" + temp_j).attr("class", "m_rect" + base_num_pos);
                        svg_data.m_svg.select("#m_rect" + temp_j).attr("id", "m_rect" + base_num_pos);
                        svg_data.m_svg.select("#rect_text" + temp_j).attr("id", "rect_text" + base_num_pos);

                        svg_data.m_svg.selectAll(".tmp_class").attr("class", "m_rect" + temp_j);
                        svg_data.m_svg.select("#tmp_rect").attr("id", "m_rect" + temp_j);
                        svg_data.m_svg.select("#tmp_text").attr("id", "rect_text" + temp_j);
                    };
                    animation_data.sortframe.push(temp_frame);
                }
                else {
                    temp_frame = function () {

                        drawCode(post_data, animation_data, 6, 2);

                        svg_data.m_svg.selectAll(".m_rect" + temp_j)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_done_fill);

                        svg_data.m_svg.select(".j")
                            .transition()
                            .duration(animation_data.duration / 3)
                            .attr("x", svg_data.rect_x[temp_j]);

                        if (post_data.sort_process[idx][k].length > 3) {
                            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][k][post_data.sort_process[idx][k].length - 3])
                                .transition()
                                .duration(animation_data.duration / 3)
                                .attr("fill", svg_data.rect_fill);
                            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][k][post_data.sort_process[idx][k].length - 3])
                                .transition()
                                .duration(animation_data.duration / 3)
                                .attr("fill", svg_data.num_fill);
                        }
                    };
                    animation_data.sortframe.push(temp_frame);

                }
                ////////////////////////////////////////////////////////////////////// i 后移
                for (let p = 1; p < (post_data.sort_process[idx][k + 1].length - 2); p++) {
                    temp_frame = function () {

                        drawCode(post_data, animation_data, 3, 3);
                        svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][k + 1][p])
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_search_fill);

                        svg_data.m_svg.select(".i")
                            .transition()
                            .duration(animation_data.duration / 3)
                            .attr("x", svg_data.rect_x[post_data.sort_process[idx][k + 1][p]]);

                        if (p > 1) {
                            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][k + 1][p - 1])
                                .transition()
                                .duration(animation_data.duration / 2)
                                .attr("fill", ()=>{
                                    // if(p === 2)
                                    //     return svg_data.base_num_fill;
                                    // else
                                        return svg_data.rect_fill;
                                });
                            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][k + 1][p - 1])
                                .transition()
                                .duration(animation_data.duration / 2)
                                .attr("fill", svg_data.num_fill);
                        }

                    };
                    animation_data.sortframe.push(temp_frame);
                }
                //////////////////////////////////////////////////////////////////////// 交换  i
                let base_num_pos1 = post_data.sort_process[idx][k + 1][post_data.sort_process[idx][k + 1].length - 1];
                let temp_i = post_data.sort_process[idx][k + 1][post_data.sort_process[idx][k + 1].length - 2];
                if (temp_i !== base_num_pos1) {                                      // 交换  i
                    temp_frame = function () {

                        if (post_data.sort_process[idx][k + 1].length > 3) {
                            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][k + 1][post_data.sort_process[idx][k + 1].length - 3])
                                .transition()
                                .duration(animation_data.duration / 3)
                                .attr("fill", svg_data.rect_fill);
                            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][k + 1][post_data.sort_process[idx][k + 1].length - 3])
                                .transition()
                                .duration(animation_data.duration / 3)
                                .attr("fill", svg_data.num_fill);
                        }

                        drawCode(post_data, animation_data, 5, 4);

                        svg_data.m_svg.select(".i")
                            .transition()
                            .duration(animation_data.duration / 3)
                            .attr("x", svg_data.rect_x[temp_i]);

                        svg_data.m_svg.selectAll(".m_rect" + base_num_pos1)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.base_num_fill)
                            .attr("x", svg_data.rect_x[temp_i]);

                        svg_data.m_svg.selectAll(".m_rect" + temp_i)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_choose_fill)
                            .attr("x", svg_data.rect_x[base_num_pos1]);

                        svg_data.m_svg.selectAll(".m_rect" + base_num_pos1).attr("class", "tmp_class");
                        svg_data.m_svg.select("#m_rect" + base_num_pos1).attr("id", "tmp_rect");
                        svg_data.m_svg.select("#rect_text" + base_num_pos1).attr("id", "tmp_text");

                        svg_data.m_svg.selectAll(".m_rect" + temp_i).attr("class", "m_rect" + base_num_pos1);
                        svg_data.m_svg.select("#m_rect" + temp_i).attr("id", "m_rect" + base_num_pos1);
                        svg_data.m_svg.select("#rect_text" + temp_i).attr("id", "rect_text" + base_num_pos1);

                        svg_data.m_svg.selectAll(".tmp_class").attr("class", "m_rect" + temp_i);
                        svg_data.m_svg.select("#tmp_rect").attr("id", "m_rect" + temp_i);
                        svg_data.m_svg.select("#tmp_text").attr("id", "rect_text" + temp_i);
                    };
                    animation_data.sortframe.push(temp_frame);
                }
                else {
                    temp_frame = function () {

                        drawCode(post_data, animation_data, 6, 4);

                        svg_data.m_svg.selectAll(".m_rect" + temp_i)
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_done_fill);

                        svg_data.m_svg.select(".i")
                            .transition()
                            .duration(animation_data.duration / 3)
                            .attr("x", svg_data.rect_x[temp_i]);

                        if (post_data.sort_process[idx][k + 1].length > 3) {
                            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][k + 1][post_data.sort_process[idx][k + 1].length - 3])
                                .transition()
                                .duration(animation_data.duration / 2)
                                .attr("fill", svg_data.rect_fill);
                            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][k + 1][post_data.sort_process[idx][k + 1].length - 3])
                                .transition()
                                .duration(animation_data.duration / 2)
                                .attr("fill", svg_data.num_fill);
                        }
                    };
                    animation_data.sortframe.push(temp_frame);

                }
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
 */
function drawCode(post_data, animation_data, word_id, now_step) {
    let code_text = [];
    if (post_data.operate_type === 1)
        code_text = ["QuickSort(a, start, end)", "while( i<j && a[j] > base)/j - -", "Exchange(a[j], a[base])",
            "while(i<j && a[i]<base)/i++", "Exchange(a[i], a[base])", "QuickSort(a, start, i -1)", "QuickSort(a, i + 1, end)"];
    else
        code_text = ["请执行排序操作"];

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
        let temp = code_text[index].split("/");
        if (temp.length > 1) {
            let text = code_svg.selectAll("g")
                .append("text")
                .attr("fill", "white")
                .attr('x', () => {
                    if (index === 0)
                        return width / 10;
                    else
                        return width / 5;
                })
                .attr('y', index * rect_height);
            text.selectAll("tspan")
                .data(temp)
                .enter()
                .append("tspan")
                .attr("x", (d, i) => {
                    if (i > 0)
                        return 1.5 * text.attr("x");
                    else
                        return text.attr("x");
                })
                .attr("dy", rect_height / 2.5)
                .text(function (d) {
                    return d
                })
        }
        else {
            code_svg.selectAll('g')
                .append("text")
                .text(code_text[index])
                .attr('x', () => {
                    if (index === 0)
                        return width / 10;
                    else
                        return width / 5;
                })
                .attr('y', index * rect_height)
                .attr('dy', rect_height / 2)
                .attr("fill", "white");
        }
    }

    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", animation_data.choose_rect_fill);

    hintAnimation(post_data, animation_data, word_id); // 提示窗口动画
}


/**
 * @description 排序过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 * @param svg_data
 */
function runAnimation(post_data, animation_data, svg_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.sortframe.length) {  //步进执行
            drawProgress(animation_data, animation_data.sortframe.length);
            animation_data.sortframe[animation_data.now_step]();//执行主视图动画
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runAnimation(post_data, animation_data, svg_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.sortframe.length - 1) {
                animation_data.is_pause = true;
                drawCode(post_data, animation_data, 9, 0);
                drawConclusion(svg_data, post_data);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找失败");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawProgress(animation_data, animation_data.sortframe.length);
            animation_data.sortframe[animation_data.now_step]();
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runAnimation(post_data, animation_data, svg_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    let temp = $.ajax({
        type: 'POST',
        url: "/quick_sort_method",
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
 * @description 算法介绍窗口
 */
function drawIntrouce() {
    d3.select("#intro_svg").remove();
    let screen = $("#intro_window");
    let width = screen.width();
    let height = screen.height();
    let svg = d3.select("#intro_window")
        .append("svg")
        .attr("id", "intro_svg")
        .attr("width", width)
        .attr("height", height);

    let intro_text = "算法介绍：/快速排序: 通过一趟排序将要排序的数据以/基准元素为中心分割成独立的两部分，其中/一部分的所有数据都比另外一部分的所有数/据都要小，" +
        "然后再按此方法对这两部分数据/分别进行快速排序，整个排序过程可以递归/进行，以此达到整个数据变成有序序列，本/示例选取的基准元素为未排序部分的首元素";

    let temp = intro_text.split("/");

    let text = svg.append("g")
        .append("text")
        .attr("fill", "white")
        .attr('x', width / 15)
        .attr('y', height / 15);

    text.selectAll("tspan")
        .data(temp)
        .enter()
        .append("tspan")
        .attr("x", (d, i)=>{
            if(i===0)
                return 10;
            else
                return width / 15;

        })
        .attr("dy",(d, i)=>{
            if(i===0)
                return height / 20;
            else
                return height / 9;
        })
        .attr("font-size",(d, i)=>{
            if(i===0)
                return 20;
            else
                return 15;
        })
        .text(function (d) {
            return d
        })
}