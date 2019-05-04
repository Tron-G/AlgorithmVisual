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
        let result = checkError(post_data, user_data, 1, 15, 100);   //输入错误检查
        if (result !== false) {
            clearAllTimer(animation_data, true);            //清除动画定时器
            clearAllTimer(animation_data, false);           //animation_data初始化
            resetPostData(post_data, 0, result.slice(0));   //slice深拷贝
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));   //更新数据包
            resetSvgData(svg_data);
            // console.log("data", post_data);
            drawArray(post_data.array_data, svg_data);
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
        drawArray(post_data.array_data, svg_data);
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
            drawArray(post_data.array_data, svg_data);
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
        if (animation_data.is_sort) {                         //入队动画
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                // console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 2000;
                runAnimation(post_data, animation_data);
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
                runAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 1000;
                runAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(50);
    });
    hideAnimation();
    drawIntrouce();
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
    svg_data.rect_len = 70;        //矩形长度
    svg_data.font_size = 20;       //主视图字体大小
    svg_data.rect_stroke = "#4CB4E7";
    svg_data.num_fill = "#537791";
    svg_data.subscript_fill = "#A3A380";
    svg_data.rect_insert_fill = "#2eb872";
    svg_data.mark_fill = "#f03861";
    svg_data.sample_text_fill = "#8c7676";
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
        animation_data.sorted = [];
        animation_data.duration = 2000;       //动画时间基数
        animation_data.is_sort = false;   //是否执行排序标记
        animation_data.code_rect_fill = "#4f5d76";
        animation_data.choose_rect_fill = "#89a4c7";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["数组创建完成", "请点击开始按钮运行算法", "排序后数组为空,直接插入当前元素",
            "计算插入位置", "排序后数组中插入位置之后的元素后移一位", "插入当前元素", "排序完成"];
    }
}

/**
 * @description 主视图原数组绘制（排序前）
 * @param {Array} array_data 数组数据
 * @param svg_data
 */
function drawArray(array_data, svg_data) {
    d3.select("#screen_svg").remove();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);

    let total_len = svg_data.rect_len * array_data.length;//总长度
    let start_pos = (svg_data.width - total_len) / 2;

    svg.selectAll("rect")                           // 数组矩形绘制
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
            svg_data.rect_x.push(start_pos + i * svg_data.rect_len);
            return start_pos + i * svg_data.rect_len;
        })
        .attr("y", svg_data.height / 2 - 3 * svg_data.rect_len)
        .attr("width", svg_data.rect_len)
        .attr("height", svg_data.rect_len)
        .attr("fill", "white")
        .attr("stroke", svg_data.rect_stroke)
        .attr("stroke-width", 3);

    for (let index = 0; index < array_data.length; index++) {
        svg.select('.g_rect' + index)                              // 数组数字绘制
            .append("text")
            .attr('class', "m_rect" + index)
            .attr("id", "rect_text" + index)
            .attr('x', svg_data.rect_x[index])
            .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 4.5)
            .attr("dy", svg_data.rect_len / 1.5)
            .attr("font-size", svg_data.font_size)
            .attr("fill", svg_data.num_fill)
            .text(array_data[index]);
        svg.select('.g_rect' + index)                              // 数组下标绘制
            .append("text")
            .attr('class', "m_rect" + index)
            .attr("id", "rect_num" + index)
            .attr('x', svg_data.rect_x[index])
            .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 10)
            .attr("dy", svg_data.rect_len * 1.5)
            .attr("font-size", svg_data.font_size)
            .attr("fill", svg_data.subscript_fill)
            .text("a[" + index + "]");
    }
    svg.append("g")
        .attr("class", "table_text")
        .append("text")
        .attr('x', svg_data.rect_x[0])
        .attr('y', svg_data.height / 2 - 3 * svg_data.rect_len)
        .attr("dx", -svg_data.rect_len * 2)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.mark_fill)
        .text("原数组:");

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
    let sample_rect = [svg_data.rect_stroke, svg_data.rect_insert_fill];
    let sample_text = ["未排序元素", "已归位元素"];
    for (let idx = 0; idx < 2; idx++) {
        if (idx === 0) {
            svg_data.m_svg.select(".g_sample")
                .append("rect")
                .attr("x", svg_data.width / 30)
                .attr("y", svg_data.height / 25 + idx * 30)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill","white")
                .attr("stroke-width",3)
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

    let intro_text = "插入排序: 每步将一个待排序的/记录，按其关键码值的大小插入/已经排序的数组中适当位置上，/直到全部插入完为止，是一种简/单直观且稳定的排序算法。";

    let temp = intro_text.split("/");

    let text = svg.append("g")
        .append("text")
        .attr("fill", "white")
        .attr('x', width / 15)
        .attr('y', height / 30);

    text.selectAll("tspan")
        .data(temp)
        .enter()
        .append("tspan")
        .attr("x", width / 15)
        .attr("dy", height / 7)
        .text(function (d) {
            return d
        })
}


/**
 * @description 排序过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 * @param {object} animation_data 动画数据包
 */
function sortAnimation(svg_data, post_data, animation_data) {

    svg_data.m_svg.append("g")
        .attr("class", "new_text")
        .append("text")
        .attr('x', svg_data.rect_x[0])
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", -svg_data.rect_len * 2)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.mark_fill)
        .text("排序后:");

    let temp_frame;

    for (let index = 0; index < (post_data.sort_process.length - 1); index++) {
        if (index === 0) {
            temp_frame = function () {

                drawCode(post_data, animation_data, 2, 3);
                svg_data.m_svg.select("#m_rect0")
                    .transition()
                    .duration(animation_data.duration)
                    .attr("fill", svg_data.rect_insert_fill)
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);

                svg_data.m_svg.select("#rect_text0")
                    .transition()
                    .duration(animation_data.duration)
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);

                svg_data.m_svg.select("#rect_num0")
                    .transition()
                    .duration(animation_data.duration)
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);

                svg_data.m_svg.selectAll(".m_rect0").attr("class", "new_rect0");
                svg_data.m_svg.select("#m_rect0").attr("id", "new_rect0");
                svg_data.m_svg.select("#rect_text0").attr("id", "new_text0");
                svg_data.m_svg.select("#rect_num0").attr("id", "new_num0");

                animation_data.sorted.push(post_data.sort_process[0][0]);
            };

            animation_data.sortframe.push(temp_frame);
        }
        else {
            temp_frame = function () {
                drawCode(post_data, animation_data, 3, 1);
                let temp_timer = setTimeout(() => {
                    drawCode(post_data, animation_data, 4, 2);
                }, animation_data.duration / 4);
                animation_data.all_timer.push(temp_timer);       // 计时器缓存

                for (let j = post_data.sort_process[index][1]; j < animation_data.sorted.length; j++) { //插入位置之后的矩形后移

                    svg_data.m_svg.select("#new_rect" + j)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x", svg_data.rect_x[j + 1]);

                    svg_data.m_svg.select("#new_text" + j)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x", svg_data.rect_x[j + 1]);

                    svg_data.m_svg.select("#new_num" + j)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("x", svg_data.rect_x[j + 1])
                        .style("opacity", 0)
                        .transition()
                        .duration(animation_data.duration / 2)
                        .text("a[" + (j + 1) + "]")
                        .style("opacity", 1)

                }
            };
            animation_data.sortframe.push(temp_frame);

            temp_frame = function () {              //插入矩形
                if (index === post_data.sort_process.length - 2) {
                    svg_data.m_svg.select(".table_text")
                        .transition()
                        .duration(animation_data.duration)
                        .style("opacity", 0);
                }
                drawCode(post_data, animation_data, 5, 3);
                svg_data.m_svg.select("#m_rect" + index)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_insert_fill)
                    .attr("x", svg_data.rect_x[post_data.sort_process[index][1]])
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);

                svg_data.m_svg.select("#rect_text" + index)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("x", svg_data.rect_x[post_data.sort_process[index][1]])
                    .attr("y", svg_data.height / 2 - svg_data.rect_len);

                svg_data.m_svg.select("#rect_num" + index)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .style("opacity", 0)
                    .attr("x", svg_data.rect_x[post_data.sort_process[index][1]])
                    .attr("y", () => {
                        return svg_data.height / 2 - svg_data.rect_len;
                    })
                    .transition()
                    .duration(animation_data.duration / 2)
                    .style("opacity", 1)
                    .text("a[" + post_data.sort_process[index][1] + "]");

                for (let j = (animation_data.sorted.length - 1); j >= post_data.sort_process[index][1]; j--) {

                    svg_data.m_svg.selectAll(".new_rect" + j).attr("class", "new_rect" + (j + 1));
                    svg_data.m_svg.select("#new_rect" + j).attr("id", "new_rect" + (j + 1));
                    svg_data.m_svg.select("#new_text" + j).attr("id", "new_text" + (j + 1));
                    svg_data.m_svg.select("#new_num" + j).attr("id", "new_num" + (j + 1));
                }
                svg_data.m_svg.selectAll(".m_rect" + index).attr("class", "new_rect" + post_data.sort_process[index][1]);
                svg_data.m_svg.select("#m_rect" + index).attr("id", "new_rect" + post_data.sort_process[index][1]);
                svg_data.m_svg.select("#rect_text" + index).attr("id", "new_text" + post_data.sort_process[index][1]);
                svg_data.m_svg.select("#rect_num" + index).attr("id", "new_num" + post_data.sort_process[index][1]);

                animation_data.sorted.push(post_data.sort_process[index][0]);
            };
            animation_data.sortframe.push(temp_frame);
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
        code_text = ["for i = 0 to a.length", "pos = searchPos(a[i])", "Move(a, pos)", "a[pos] = a[i]"];
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
 */
function runAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.sortframe.length) {  //步进执行
            drawProgress(animation_data, animation_data.sortframe.length);
            animation_data.sortframe[animation_data.now_step]();//执行主视图动画
            // showCode(post_data, animation_data);
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.sortframe.length - 1) {
                animation_data.is_pause = true;
                drawCode(post_data, animation_data, 6, 0);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找失败");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawProgress(animation_data, animation_data.sortframe.length);
            animation_data.sortframe[animation_data.now_step]();
            // showCode(post_data, animation_data);
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runAnimation(post_data, animation_data);
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
        url: "/insert_sort_method",
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
