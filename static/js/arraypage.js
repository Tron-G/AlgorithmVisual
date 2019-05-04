/**
 * @description 输入窗口及播放暂停步进隐藏等所有交互函数
 */
function inputWindow() {
    let post_data = {};                     //向后台传输的数据包
    let svg_data = {};                       //主屏幕svg对象
    let animation_data = {};                //动画数据缓存

    resetPostData(post_data);                //post_data初始化
    resetSvgData(svg_data);
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
            drawArray(post_data.array_data, svg_data);        //主视图绘制
            drawCode(post_data, animation_data, 0, 0);      //伪代码及提示窗口绘制
            drawProgress(animation_data, 0);                   //重置进度条
        }
    });
    ///////////////////////////////--------随机创建--------///////////////////////////////////////
    $('#random_bt').click(function () {
        clearAllTimer(animation_data, true);
        clearAllTimer(animation_data, false);
        resetPostData(post_data, 1);
        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        drawArray(post_data.array_data, svg_data);
        drawCode(post_data, animation_data, 0, 0);
        drawProgress(animation_data, 0);                       // 进度条重置
    });
    ///////////////////////////////--------查找功能--------///////////////////////////////////////
    $('#search_bt').click(function () {
        let search_num = $('#search_num').val();
        let result = checkError(post_data, search_num, 2);
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_search = true;                    //执行查找标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1, result);
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            drawArray(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);                       // 进度条重置
            drawCode(post_data, animation_data, 2, 0);
            createAnimation(svg_data, post_data, animation_data); // 查找动画生成
        }
    });
    ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_search) {
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            } else {                                           // 播放
                animation_data.is_pause = false;
                animation_data.duration = 1500;
                $("#play_bt").attr("class", "pause");
                runAnimation(svg_data, post_data, animation_data);
            }
        }
        else
            errorWarning(11);
    });
    ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
        if (animation_data.is_search) {
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 600;
                clearAllTimer(animation_data, true);
                runAnimation(svg_data, post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 600;
                clearAllTimer(animation_data, true);
                runAnimation(svg_data, post_data, animation_data);
            }
        }
        else
            errorWarning(11);
    });
    ///////////////////////////////--------修改功能--------///////////////////////////////////////
    $('#change_bt').click(function () {
        let change_data = $('#change_num').val();
        let result = checkError(post_data, change_data, 3);
        if (result[0] > (post_data.array_data.length - 1)) {
            errorWarning(7);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, false);
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 2, -1, result[0], result[1]);

            drawArray(post_data.array_data, svg_data);              //重绘
            let change_timer = setTimeout(function () {
                changeAnimation(svg_data, post_data, animation_data);
                let temp = postData(post_data);
                post_data = JSON.parse(JSON.stringify(temp));     //更新数据包
                drawCode(post_data, animation_data, 1, 0);        //伪代码生成
                drawProgress(animation_data, 0);                     //重置进度条
                clearTimeout(change_timer);
            }, animation_data.duration / 2);
        }
    });

    hideAnimation();
}

inputWindow();

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
        animation_data.frame = [];          //动画函数缓存器
        animation_data.duration = 1500;     //动画时间基数
        animation_data.is_search = false;   //是否执行查找标记
        animation_data.is_next = false;     //执行步进标记
        animation_data.is_find = false;     //是否查找成功标记
        animation_data.code_rect_fill = "#4f5d76";
        animation_data.choose_rect_fill = "#89a4c7";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["数组创建成功", "修改成功", "点击开始按钮开始查找",
            "判断是否相等", "不相等,查找下一个,i = ", "未找到", "查找成功,数组下标i = "];
    }
}


/**
 * @description post_data 属性设置
 * @param {object} post_data 数据包
 * @param {number} input_tpye 数据生成方式，0默认为手动输入，1为随机
 * @param {object} array_data 保存数组值
 * @param {number} operate_type 进行的操作类型，0：无，1：查找，2：修改
 * @param {number} search_num 要查找的数值
 * @param {number} change_pos 要修改的数值下标
 * @param {number} change_num 要修改的数值
 * @param search_process 查找过程数据(后台)
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       search_num = -1, change_pos = -1, change_num = -1, search_process = null) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.search_num = search_num;
    post_data.change_pos = change_pos;
    post_data.change_num = change_num;
    post_data.search_process = search_process;
}


/**
 * @description svg_data 矩形y坐标重置更新
 * @param {object} svg_data svg相关数据
 */
function resetSvgData(svg_data) {
    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();
    svg_data.m_svg = null;
    svg_data.width = width;
    svg_data.height = height;
    svg_data.font_size = 20;       //主视图字体大小
    svg_data.rect_stroke = "#4CB4E7";
    svg_data.num_fill = "#537791";
    svg_data.subscript_fill = "#A3A380";
    svg_data.rect_search_fill = "#fab57a";
    svg_data.rect_change_fill = "#a56cc1";
    svg_data.text_change_fill = "#FF0033";
    svg_data.search_fail_fill = "red";
    svg_data.search_succ_fill = "#a1de93";
    svg_data.sample_text_fill = "#8c7676";
    svg_data.mark_fill = "#f03861";
    svg_data.rect_len = 70;        //矩形长度
}

/**
 * @description 主视图数组绘制
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
        .append("rect")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr("x", function (d, i) {
            return start_pos + i * svg_data.rect_len;
        })
        .attr("y", svg_data.height / 2 - svg_data.rect_len)
        .attr("width", svg_data.rect_len)
        .attr("height", svg_data.rect_len)
        .attr("fill", "white")
        .attr("stroke", svg_data.rect_stroke)
        .attr("stroke-width", 3);

    svg.selectAll('g')                              // 数组数字绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_text" + i;
        })
        .attr('x', function (d, i) {
            return start_pos + i * svg_data.rect_len;
        })
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", svg_data.rect_len / 4.5)
        .attr("dy", svg_data.rect_len / 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.num_fill)
        .text(function (d) {
            return d;
        });

    svg.selectAll('g')                              // 数组下标绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_num" + i;
        })
        .attr('x', function (d, i) {
            return start_pos + i * svg_data.rect_len;
        })
        .attr('y', svg_data.height / 2 - svg_data.rect_len)
        .attr("dx", svg_data.rect_len / 10)
        .attr("dy", svg_data.rect_len * 1.5)
        .attr("font-size", svg_data.font_size)
        .attr("fill", svg_data.subscript_fill)
        .text(function (d, i) {
            return "a[" + i + "]";
        });
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
    let sample_rect = [svg_data.rect_stroke, svg_data.rect_search_fill, svg_data.rect_change_fill, svg_data.search_succ_fill,svg_data.search_fail_fill];
    let sample_text = ["未处理元素", "已查找元素", "修改元素", "查找成功元素", "查找失败/目标不存在"];
    for (let idx = 0; idx < 5; idx++) {
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
 * @description 结论绘制
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包animation_data
 */
function drawConclusion(svg_data, post_data) {
    let sum = post_data.search_process.length - 1;

    svg_data.m_svg.append("g")
        .attr("class", "g_conclusion")
        .append("text")
        .attr("x", svg_data.width / 3)
        .attr("y", 17 * svg_data.height / 20)
        .attr("font-size", svg_data.font_size * 1.3)
        .attr("fill", svg_data.mark_fill)
        .text("本次查找总共比较的次数为：" + sum);
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

    let intro_text = "冒泡排序: 重复地走访过要排序的元素列，/依次比较两个相邻的元素，如果他们的顺序/错误就把他们交换过来，直到排序完成";

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
        .attr("dy", height / 5)
        .text(function (d) {
            return d
        })
}




/**
 * @description 查找过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function createAnimation(svg_data, post_data, animation_data) {

    let temp_frame;
    for (let idx = 0; idx < (post_data.search_process.length - 1); idx++) {
        temp_frame = function () {
            if (idx === (post_data.search_process.length - 2) && post_data.search_process[post_data.search_process.length - 1] === -1) {
                svg_data.m_svg.selectAll(".m_rect" + post_data.search_process[idx])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.search_fail_fill);
                svg_data.m_svg.selectAll(".rect_num" + post_data.search_process[idx])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.text_change_fill);
            }
            else if (idx === (post_data.search_process.length - 2) && post_data.search_process[post_data.search_process.length - 1] === 1) {
                svg_data.m_svg.selectAll(".m_rect" + post_data.search_process[idx])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.search_succ_fill);
                svg_data.m_svg.selectAll(".rect_num" + post_data.search_process[idx])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.text_change_fill);
            }
            else {
                svg_data.m_svg.selectAll(".m_rect" + post_data.search_process[idx])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.rect_search_fill);
                svg_data.m_svg.selectAll(".rect_num" + post_data.search_process[idx])
                    .transition()
                    .duration(animation_data.duration / 2)
                    .attr("fill", svg_data.text_change_fill);
            }
            if (idx >= 1) {
                // svg_data.m_svg.selectAll(".m_rect" + post_data.search_process[idx - 1])
                //     .transition()
                //     .duration(animation_data.duration / 4)
                //     .attr("fill", "white");
                svg_data.m_svg.selectAll(".rect_num" + post_data.search_process[idx - 1])
                    .transition()
                    .duration(animation_data.duration / 4)
                    .attr("fill", svg_data.subscript_fill);
            }
        };
        animation_data.frame.push(temp_frame);
    }
}

/**
 * @description 查找过程的动画运行函数
 * @param svg_data
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runAnimation(svg_data, post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.frame.length
            && !animation_data.is_find) {                   //步进执行
            drawProgress(animation_data, animation_data.frame.length);       // 进度条
            animation_data.frame[animation_data.now_step]();//执行主视图动画
            showCode(post_data, animation_data);
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runAnimation(svg_data, post_data, animation_data);
        }
        else {                                              //自动执行
            if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num) {
                animation_data.is_find = true;
                animation_data.is_pause = true;
                drawConclusion(svg_data, post_data);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找成功" + (animation_data.now_step - 1));
                return;
            }
            else if (animation_data.now_step > animation_data.frame.length - 1) {
                animation_data.is_pause = true;
                drawConclusion(svg_data, post_data);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找失败");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            drawProgress(animation_data, animation_data.frame.length);       // 进度条
            animation_data.frame[animation_data.now_step]();
            showCode(post_data, animation_data);
            // console.log("正在播放第:" + animation_data.now_step + "帧", post_data.search_process.length);
            animation_data.now_step++;
            runAnimation(svg_data, post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}

/**
 * @description 伪代码执行展示
 * @param {object} post_data
 * @param {object} animation_data
 */
function showCode(post_data, animation_data) {
    drawCode(post_data, animation_data, 3, 1);      //提示窗口判断相等动画
    let temp_timer = setTimeout(() => {
        if (animation_data.now_step === post_data.search_process.length - 1
            && post_data.search_process[post_data.search_process.length - 1] === 1)
            drawCode(post_data, animation_data, 6, 4);  //查找成功
        else if(animation_data.now_step === post_data.search_process.length - 1
            && post_data.search_process[post_data.search_process.length - 1] === -1)
            drawCode(post_data, animation_data, 5, 3);  //查找失败
        else
            drawCode(post_data, animation_data, 4, 2);  //下一个
    }, animation_data.duration / 2);
    animation_data.all_timer.push(temp_timer);       // 计时器缓存
}


/**
 * @description 修改过程的动画绘制
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param animation_data
 */
function changeAnimation(svg_data, post_data, animation_data) {
    svg_data.m_svg.selectAll(".m_rect" + post_data.change_pos)
        .transition()
        .duration(animation_data.duration / 6)
        .attr("fill", svg_data.rect_change_fill);

    svg_data.m_svg.selectAll(".rect_num" + post_data.change_pos)
        .transition()
        .duration(animation_data.duration / 6)
        .attr("fill", svg_data.text_change_fill);

    svg_data.m_svg.selectAll(".rect_text" + post_data.change_pos)
        .transition()
        .delay(animation_data.duration / 4)
        .style("opacity", 0)
        .duration(animation_data.duration / 4)
        .transition()
        .duration(animation_data.duration / 4)
        .style("opacity", 1)
        .text(post_data.change_num);
}


/**
 * @description 解释窗口的动画绘制
 * @param {object} post_data
 * @param {object} animation_data
 * @param word_id 解释文字所在数组(animation_data.explain_words[])下标
 */
function hintAnimationDraw(post_data, animation_data, word_id) {
    let temp = "";
    if (word_id === 4)
        temp = animation_data.explain_words[word_id] + (animation_data.now_step - 1);
    else if (word_id === 6)
        temp = animation_data.explain_words[word_id] + (animation_data.now_step - 1);
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
        .attr('x', width / 10)
        .attr('y', height / 2)
        .attr("dy", height / 9)
        .attr("fill", animation_data.hint_text_fill)
        .text(temp);
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
        code_text = ["i = 0", "while(input_num != a[i])", "i++", "if(i > a.length),return false", "return i"];
    else if (post_data.operate_type === 2) {
        let temp = "a[" + post_data.change_pos + "] = " + post_data.change_num;
        code_text.push(temp);
    }
    else {
        if (post_data.input_tpye === 0)
            code_text = ["for i = 0 to length,a[i] = input()"];
        else
            code_text = ["for i = 0 to length,a[i] = random()"];
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
        .attr("fill", animation_data.code_rect_fill);

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

    code_svg.selectAll(".code_rect" + now_step)
        .transition()
        .duration(500)
        .attr("fill", animation_data.choose_rect_fill);

    hintAnimationDraw(post_data, animation_data, word_id); // 提示窗口动画

}

/**
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    let temp = $.ajax({
        type: 'POST',
        url: "/array_method",
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