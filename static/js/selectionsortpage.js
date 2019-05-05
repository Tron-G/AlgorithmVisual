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
                animation_data.duration = 1000;
                runAnimation(svg_data, post_data, animation_data);
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
                animation_data.duration = 500;
                clearAllTimer(animation_data, true);
                runAnimation(svg_data, post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 500;
                runAnimation(svg_data, post_data, animation_data);
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
        animation_data.duration = 1000;       //动画时间基数
        animation_data.is_sort = false;   //是否执行排序标记
        animation_data.code_rect_fill = "#4f5d76";
        animation_data.choose_rect_fill = "#89a4c7";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["数组创建完成", "请点击开始按钮运行算法", "遍历数组未排序部分，寻找最小值",
            "当前数字小于最小值，更新最小值", "将最小值交换到数组未排序部分首位", "排序完成"];
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
    let sample_text = ["未排序元素", "查找中的元素", "当前最小值元素", "待交换的首位元素", "已归位元素"];
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
    for (let idx = 0; idx < post_data.sort_process.length; idx++) {
        if (post_data.sort_process[idx][0] !== post_data.sort_process[idx][post_data.sort_process[idx].length - 1]) {
            sum += 1;
        }
    }

    svg_data.m_svg.append("g")
        .attr("class", "g_conclusion")
        .append("text")
        .attr("x", svg_data.width / 3)
        .attr("y", 17 * svg_data.height / 20)
        .attr("font-size", svg_data.font_size * 1.3)
        .attr("fill", svg_data.mark_fill)
        .text("本次排序总共交换的次数为：" + sum);
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
        let step = 0;
        for (let j = post_data.sort_process[idx][0]; j < post_data.array_data.length; j++) {    //查找
            temp_frame = function () {
                svg_data.m_svg.select("#m_rect" + j)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_search_fill);

                svg_data.m_svg.select("#rect_text" + j)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.mark_fill);

                if (step > 0 && post_data.sort_process[idx][step - 1] !== (j - 1)) {
                    svg_data.m_svg.select("#m_rect" + (j - 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", svg_data.rect_fill);
                    svg_data.m_svg.select("#rect_text" + (j - 1))
                        .transition()
                        .duration(animation_data.duration / 2)
                        .attr("fill", svg_data.num_fill);
                }

                if (j === (post_data.array_data.length - 1) && j !== post_data.sort_process[idx][post_data.sort_process[idx].length - 1]) {
                    svg_data.m_svg.select("#m_rect" + j)
                        .transition()
                        .delay(animation_data.duration / 2)
                        .duration(animation_data.duration / 2)
                        .attr("fill", svg_data.rect_fill);
                    svg_data.m_svg.select("#rect_text" + j)
                        .transition()
                        .delay(animation_data.duration / 2)
                        .duration(animation_data.duration / 2)
                        .attr("fill", svg_data.num_fill);
                }
                drawCode(post_data, animation_data, 2, 0);

                if (j === post_data.sort_process[idx][step]) {

                    let temp_timer = setTimeout(() => {
                        drawCode(post_data, animation_data, 3, 1);
                    }, animation_data.duration / 4);
                    animation_data.all_timer.push(temp_timer);       // 计时器缓存

                    svg_data.m_svg.select("#m_rect" + j)
                        .transition()
                        .delay(animation_data.duration / 2)
                        .duration(animation_data.duration / 2)
                        .attr("fill", () => {
                            if (step === 0)
                                return svg_data.base_num_fill;
                            else
                                return svg_data.rect_choose_fill;
                        });
                    svg_data.m_svg.select("#rect_text" + j)
                        .transition()
                        .delay(animation_data.duration / 2)
                        .duration(animation_data.duration / 2)
                        .attr("fill", () => {
                            if (step === 0)
                                return svg_data.base_num_fill;
                            else
                                return svg_data.rect_choose_fill;
                        });

                    if (step > 1) {
                        svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][step - 1])
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.rect_fill);
                        svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][step - 1])
                            .transition()
                            .duration(animation_data.duration / 2)
                            .attr("fill", svg_data.num_fill);
                    }

                    step += 1;
                }
            };
            animation_data.sortframe.push(temp_frame);
        }

        temp_frame = function () {                   //交换
            drawCode(post_data, animation_data, 4, 2);
            svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][0])
                .transition()
                .duration(animation_data.duration / 2)
                .attr("x", svg_data.rect_x[post_data.sort_process[idx][post_data.sort_process[idx].length - 1]]);

            svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1])
                .transition()
                .duration(animation_data.duration / 2)
                .attr("x", svg_data.rect_x[post_data.sort_process[idx][0]]);


        };
        animation_data.sortframe.push(temp_frame);

        temp_frame = function () {
            svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][0]).attr("class", "temp_class");
            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][0]).attr("id", "temp_rect");
            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][0]).attr("id", "temp_text");

            svg_data.m_svg.selectAll(".m_rect" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1]).attr("class", "m_rect" + post_data.sort_process[idx][0]);
            svg_data.m_svg.select("#m_rect" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1]).attr("id", "m_rect" + post_data.sort_process[idx][0]);
            svg_data.m_svg.select("#rect_text" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1]).attr("id", "rect_text" + post_data.sort_process[idx][0]);

            svg_data.m_svg.selectAll(".temp_class").attr("class", "m_rect" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1]);
            svg_data.m_svg.select("#temp_rect").attr("id", "m_rect" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1]);
            svg_data.m_svg.select("#temp_text").attr("id", "rect_text" + post_data.sort_process[idx][post_data.sort_process[idx].length - 1]);

            for (let k = 0; k <= post_data.sort_process[idx][0]; k++) {
                svg_data.m_svg.select("#m_rect" + k)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_done_fill);

                svg_data.m_svg.select("#rect_text" + k)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_done_fill);
            }
            for (let p = (post_data.sort_process[idx][0] + 1); p < post_data.array_data.length; p++) {
                svg_data.m_svg.select("#m_rect" + p)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_fill);

                svg_data.m_svg.select("#rect_text" + p)
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.num_fill);
            }
        };
        animation_data.sortframe.push(temp_frame);
    }

    temp_frame = function () {

        drawCode(post_data, animation_data, 5, 0);
        for (let i = 0; i < post_data.array_data.length; i++) {
            svg_data.m_svg.select("#m_rect" + i)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", svg_data.rect_done_fill);

            svg_data.m_svg.select("#rect_text" + i)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", svg_data.rect_done_fill);
        }
    };
    animation_data.sortframe.push(temp_frame);

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
        code_text = ["for i = 0 to a.length - 1/min = i/for j = (i + 1) to a.length", "if(a[j] < a[min])/min = j", "Exchange(a[i], a[min])"];
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
                    else if (index === 1)
                        return width / 4;
                    else if (index === 2)
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
                .attr("dy", () => {
                    if (temp.length === 3)
                        return rect_height / 3.5;
                    else
                        return rect_height / 2.5;
                })
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
                    else if (index === 1)
                        return width / 4;
                    else if (index === 2)
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
 * @param svg_data
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runAnimation(svg_data, post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.sortframe.length) {  //步进执行
            drawProgress(animation_data, animation_data.sortframe.length);
            animation_data.sortframe[animation_data.now_step]();//执行主视图动画
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runAnimation(svg_data, post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.sortframe.length - 1) {
                animation_data.is_pause = true;
                drawConclusion(svg_data, post_data);
                // drawCode(post_data, animation_data, 4, 0);
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
            runAnimation(svg_data, post_data, animation_data);
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
        url: "/selection_sort_method",
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

    let intro_text = "选择排序: 每一次从待排序的数据元素中选/出最小的一个元素，存放在序列的起始位置，/以此类推，直到全部待排序的数据元素排完。/选择排序是不稳定的排序方法。";

    let temp = intro_text.split("/");

    let text = svg.append("g")
        .append("text")
        .attr("fill", "white")
        .attr('x', width / 15)
        .attr('y', height / 10);

    text.selectAll("tspan")
        .data(temp)
        .enter()
        .append("tspan")
        .attr("x", width / 15)
        .attr("dy", height / 6)
        .text(function (d) {
            return d
        })
}