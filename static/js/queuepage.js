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
            drawQueue(post_data.array_data, svg_data);
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
        drawQueue(post_data.array_data, svg_data);
        drawProgress(animation_data, 0);                //重置进度条
        drawCode(post_data, animation_data, 0, 0);

    });
    ///////////////////////////////--------入队功能--------///////////////////////////////////////
    $('#enqueue_bt').click(function () {
        let enqueue_num = $('#enqueue_num').val();
        let result = checkError(post_data, enqueue_num, 2);
        if (post_data.array_data.length === 15) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawQueue(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(16);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_enqueue = true;                    //执行入队标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1, result);
            resetSvgData(svg_data);
            drawQueue(post_data.array_data, svg_data);
            drawProgress(animation_data, 0);               //重置进度条
            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("enqueue", post_data);
            drawCode(post_data, animation_data, 1, 0);
            enqueueAnimation(svg_data, post_data, animation_data)

        }
    });
    ///////////////////////////////--------出队功能--------///////////////////////////////////////
    $('#dequeue_bt').click(function () {
        let result = true;
        if (post_data.array_data === null || post_data.array_data.length === 0) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            resetSvgData(svg_data);                                     //重置svg_data
            drawQueue(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);
            errorWarning(14);
            result = false;
        }
        if (result !== false) {
            clearAllTimer(animation_data, true);                //清除所有定时器
            clearAllTimer(animation_data, false);               //初始化动画数据包
            animation_data.is_dequeue = true;                    //执行出队标志
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 2);
            resetSvgData(svg_data);                                     //重置svg_data
            drawQueue(post_data.array_data, svg_data);            //重绘
            drawProgress(animation_data, 0);

            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
            // console.log("pop", post_data);
            drawCode(post_data, animation_data, 1, 0);
            dequeueAnimation(svg_data, post_data, animation_data)
        }
    });

    // ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_enqueue) {                         //入队动画
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
                runEnqueueAnimation(post_data, animation_data);
            }
        }
        else if (animation_data.is_dequeue) {                         //出队动画
            if (!animation_data.is_pause) {
                animation_data.is_pause = true;
                // console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");
                clearAllTimer(animation_data, true);
            }
            else {
                animation_data.is_pause = false;
                $("#play_bt").attr("class", "pause");
                animation_data.duration = 1500;
                runDequeueAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(15);
    });
    // ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
        if (animation_data.is_enqueue) {                        //入队动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 1000;
                clearAllTimer(animation_data, true);
                runEnqueueAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 1000;
                runEnqueueAnimation(post_data, animation_data);
            }
        }
        else if (animation_data.is_dequeue) {                        //出队动画
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 1000;
                clearAllTimer(animation_data, true);
                runDequeueAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 1000;
                runDequeueAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(15);
    });
    hideAnimation();
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
    svg_data.rect_x = [];        //矩形x坐标
    svg_data.width = width;
    svg_data.height = height;
    svg_data.rect_len = 70;        //矩形长度
    svg_data.font_size = 20;            //主视图字体大小
    svg_data.rect_stoke = "#003399";
    svg_data.rect_num_fill = "#333333";
    svg_data.enqueue_rect_fill = "#3ec1d3";
    svg_data.dequeue_rect_fill = "#393e46";
}

/**
 * @description post_data属性设置
 * @param {object} post_data 数据包
 * @param {number} input_tpye 数据生成方式，0默认为手动输入，1为随机
 * @param {object} array_data 保存链表值
 * @param {number} operate_type 进行的操作类型，0：无，1：入队，2：出队
 * @param {number} enqueue_num 要入队的数值
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       enqueue_num = -1) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.enqueue_num = enqueue_num;
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
        animation_data.enqueueframe = [];     //入队动画函数缓存器
        animation_data.dequeueframe = [];     //出队动画函数缓存器
        animation_data.duration = 1500;       //动画时间基数
        animation_data.is_enqueue = false;   //是否执行入队标记
        animation_data.is_dequeue = false;   //是否执行出队标记
        animation_data.code_rect_fill = "#7f4a88";
        animation_data.choose_rect_fill = "#ca82f8";
        animation_data.hint_text_fill = "#5c2626";
        animation_data.explain_words = ["队列创建完成", "请点击开始按钮开始运行算法", "当前数字入队",
            "队尾指针后移", "队首数字出队", "队首指针后移"];
    }
}


/**
 * @description 主视图数组绘制
 * @param {Array} array_data 数组数据
 * @param svg_data
 */
function drawQueue(array_data, svg_data) {
    d3.select("#screen_svg").remove();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", svg_data.width)
        .attr("height", svg_data.height);

    let total_len = svg_data.rect_len * array_data.length;  //总长度
    let start_pos = (svg_data.width - total_len) / 2;

    if (array_data.length === 0) {
        svg.append("g")
            .attr("class", "g_rear")
            .append("rect")
            .attr("class", "rear_rect")
            .attr("id", "rear_rect")
            .attr("x", () => {
                svg_data.rect_x.push(start_pos);
                return start_pos;
            })
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("width", svg_data.rect_len)
            .attr("height", svg_data.rect_len)
            .attr("fill", "white")
            .attr("stroke", svg_data.rect_stoke)
            .attr("stroke-width", 3);

        svg.select(".g_rear")
            .append("text")
            .attr("class", "rear_text")
            .attr("x", start_pos)
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 10)
            .attr("dy", svg_data.rect_len * 1.5)
            .attr("fill", "red")
            .attr("font-size", svg_data.font_size)
            .text("rear");

        svg.select(".g_rear")
            .append("text")
            .attr("class", "front_text")
            .attr("x", start_pos)
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 10)
            .attr("dy", svg_data.rect_len * 2)
            .attr("fill", "red")
            .attr("font-size", svg_data.font_size)
            .text("front");
    }
    else {
        svg.selectAll("rect")                           // 矩形绘制
            .data(array_data)
            .enter()
            .append('g')
            .attr('class', function (d, i) {
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
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("width", svg_data.rect_len)
            .attr("height", svg_data.rect_len)
            .attr("fill", "white")
            .attr("stroke", svg_data.rect_stoke)
            .attr("stroke-width", 3);

        svg.selectAll('g')                              // 数字绘制
            .append("text")
            .attr('class', function (d, i) {
                return "m_rect" + i;
            })
            .attr('id', function (d, i) {
                return "rect_text" + i;
            })
            .attr("x", function (d, i) {
                svg_data.rect_x.push(start_pos + i * svg_data.rect_len);
                return start_pos + i * svg_data.rect_len;
            })
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 4.5)
            .attr("dy", svg_data.rect_len / 1.5)
            .attr("fill", svg_data.rect_num_fill)
            .attr("font-size", svg_data.font_size)
            .text(function (d) {
                return d;
            });

        svg.append("g")
            .attr("class", "g_rear")
            .append("rect")
            .attr("class", "rear_rect")
            .attr("id", "rear_rect")
            .attr("x", svg_data.rect_x[svg_data.rect_x.length - 1] + svg_data.rect_len)
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("width", svg_data.rect_len)
            .attr("height", svg_data.rect_len)
            .attr("fill", "white")
            .attr("stroke", svg_data.rect_stoke)
            .attr("stroke-width", 3);

        svg.select(".g_rear")
            .append("text")
            .attr("class", "rear_text")
            .attr("x", svg_data.rect_x[svg_data.rect_x.length - 1] + svg_data.rect_len)
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 10)
            .attr("dy", svg_data.rect_len * 1.5)
            .attr("fill", "red")
            .attr("font-size", svg_data.font_size)
            .text("rear");

        svg.select(".g_rect0")
            .append("text")
            .attr("class", "front_text")
            .attr("x", svg_data.rect_x[0])
            .attr("y", svg_data.height / 2 - svg_data.rect_len)
            .attr("dx", svg_data.rect_len / 10)
            .attr("dy", svg_data.rect_len * 1.5)
            .attr("fill", "red")
            .attr("font-size", svg_data.font_size)
            .text("front");
    }
    svg_data.m_svg = svg;
}


/**
 * @description 入队过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function enqueueAnimation(svg_data, post_data, animation_data) {
    let temp_frame;
    if (post_data.array_data.length === 1) {
        temp_frame = function () {
            svg_data.m_svg.select("#rear_rect")
                .transition()
                .duration(animation_data.duration)
                .attr("fill", svg_data.enqueue_rect_fill);
            svg_data.m_svg.select(".g_rear")
                .append("text")
                .attr("x", svg_data.rect_x[0])
                .attr("y", svg_data.height / 2 - svg_data.rect_len)
                .attr("dx", svg_data.rect_len / 4.5)
                .attr("dy", svg_data.rect_len / 1.5)
                .attr("fill", "white")
                .attr("font-size", svg_data.font_size)
                .text(post_data.enqueue_num)
                .transition()
                .duration(animation_data.duration)
                .attr("fill", svg_data.rect_num_fill);
        };
        animation_data.enqueueframe.push(temp_frame);

        temp_frame = function () {
            svg_data.m_svg.selectAll(".front_text")
                .transition()
                .duration(animation_data.duration)
                .attr("dy", svg_data.rect_len * 1.5);

            svg_data.m_svg.select(".rear_text")
                .transition()
                .duration(animation_data.duration)
                .attr("x", svg_data.rect_x[0] + svg_data.rect_len);

            svg_data.m_svg.append("g")
                .attr("class", "g_rear")
                .append("rect")
                .attr("class", "rear_rect")
                .attr("id", "rear_rect")
                .attr("x", svg_data.rect_x[0] + svg_data.rect_len)
                .attr("y", svg_data.height / 2 - svg_data.rect_len)
                .attr("width", 0)
                .attr("height", 0)
                .attr("fill", "white")
                .attr("stroke", svg_data.rect_stoke)
                .attr("stroke-width", 3)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("width", svg_data.rect_len)
                .attr("height", svg_data.rect_len);
        };
        animation_data.enqueueframe.push(temp_frame);
    }
    else {
        temp_frame = function () {
            svg_data.m_svg.select("#rear_rect")
                .transition()
                .duration(animation_data.duration)
                .attr("fill", svg_data.enqueue_rect_fill);
            svg_data.m_svg.select(".g_rear")
                .append("text")
                .attr("x", svg_data.rect_x[svg_data.rect_x.length - 1] + svg_data.rect_len)
                .attr("y", svg_data.height / 2 - svg_data.rect_len)
                .attr("dx", svg_data.rect_len / 4.5)
                .attr("dy", svg_data.rect_len / 1.5)
                .attr("fill", "white")
                .attr("font-size", svg_data.font_size)
                .text(post_data.enqueue_num)
                .transition()
                .duration(animation_data.duration)
                .attr("fill", svg_data.rect_num_fill);
        };
        animation_data.enqueueframe.push(temp_frame);

        temp_frame = function () {
            svg_data.m_svg.select(".rear_text")
                .transition()
                .duration(animation_data.duration)
                .attr("x", svg_data.rect_x[svg_data.rect_x.length - 1] + 2 * svg_data.rect_len);

            svg_data.m_svg.append("g")
                .attr("class", "g_rear")
                .append("rect")
                .attr("class", "rear_rect")
                .attr("id", "rear_rect")
                .attr("x", svg_data.rect_x[svg_data.rect_x.length - 1] + 2 * svg_data.rect_len)
                .attr("y", svg_data.height / 2 - svg_data.rect_len)
                .attr("width", 0)
                .attr("height", 0)
                .attr("fill", "white")
                .attr("stroke", svg_data.rect_stoke)
                .attr("stroke-width", 3)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("width", svg_data.rect_len)
                .attr("height", svg_data.rect_len);
        };
        animation_data.enqueueframe.push(temp_frame);
    }
}


/**
 * @description 出队过程的动画生成函数
 * @param {object} svg_data 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function dequeueAnimation(svg_data, post_data, animation_data) {
    let temp_frame;
    temp_frame = function () {
        svg_data.m_svg.select("#rect_text0")
            .transition()
            .duration(animation_data.duration)
            .attr("fill", "white")
            .attr("font-size", "1px");

        svg_data.m_svg.select("#m_rect0")
            .transition()
            .duration(animation_data.duration)
            .attr("fill", svg_data.dequeue_rect_fill)
            .attr("width", 0)
            .attr("height", 0);
    };
    animation_data.dequeueframe.push(temp_frame);

    if (post_data.array_data.length === 0) {
        temp_frame = function () {
            svg_data.m_svg.select(".front_text")
                .transition()
                .duration(animation_data.duration)
                .attr("x", svg_data.rect_x[0] + svg_data.rect_len)
                .attr("y", svg_data.height / 2 - svg_data.rect_len / 2);
        };
        animation_data.dequeueframe.push(temp_frame);
    }
    else {
        temp_frame = function () {
            svg_data.m_svg.select(".front_text")
                .transition()
                .duration(animation_data.duration)
                .attr("x", svg_data.rect_x[0] + svg_data.rect_len)
                .attr("y", svg_data.height / 2 - svg_data.rect_len);
        };
        animation_data.dequeueframe.push(temp_frame);
    }
}

/**
 * @description  (enqueue) 入队过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runEnqueueAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.enqueueframe.length) {      //步进执行
            drawProgress(animation_data, animation_data.enqueueframe.length);
            showCode(post_data, animation_data);
            animation_data.enqueueframe[animation_data.now_step]();//执行主视图动画
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runEnqueueAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.enqueueframe.length - 1) {
                // console.log("end", animation_data.now_step);
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");         //切换播放图标
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            showCode(post_data, animation_data);
            drawProgress(animation_data, animation_data.enqueueframe.length);
            animation_data.enqueueframe[animation_data.now_step]();
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runEnqueueAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description  (dequeue) 出队过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runDequeueAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.dequeueframe.length) {      //步进执行
            drawProgress(animation_data, animation_data.dequeueframe.length);
            showCode(post_data, animation_data);
            animation_data.dequeueframe[animation_data.now_step]();//执行主视图动画
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runDequeueAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (animation_data.now_step > animation_data.dequeueframe.length - 1) {
                // console.log("end", animation_data.now_step);
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");         //切换播放图标
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            showCode(post_data, animation_data);
            drawProgress(animation_data, animation_data.dequeueframe.length);
            animation_data.dequeueframe[animation_data.now_step]();
            // console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runDequeueAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description   伪代码及提示展示函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function showCode(post_data, animation_data) {
    if (animation_data.is_enqueue) {
        if (animation_data.now_step === 0)
            drawCode(post_data, animation_data, 2, 0);
        else if (animation_data.now_step === 1)
            drawCode(post_data, animation_data, 3, 1);
    }
    else if (animation_data.is_dequeue) {
        if (animation_data.now_step === 0)
            drawCode(post_data, animation_data, 4, 0);
        else if (animation_data.now_step === 1)
            drawCode(post_data, animation_data, 5, 1);
    }
}


/**
 * @description 算法窗口绘制
 * @param {object} post_data
 * @param {object} animation_data
 * @param word_id 解释文字所在数组(animation_data.explain_words[])下标
 * @param {number}  now_step 当前选中的代码块
 */
function drawCode(post_data, animation_data, word_id, now_step) {
    let code_text = [];
    if (post_data.operate_type === 1)
        code_text = ["queue.data[rear] = input( );", "queue.rear++;"];
    else if (post_data.operate_type === 0) {
        if (post_data.input_tpye === 0)
            code_text = ["queue = new Queue( );,for(i = 0; i < length; i++){," +
            "queue.data[rear] = input( );,queue.rear++;,}"];
        else
            code_text = ["queue = new Queue( );,for(i = 0; i < length; i++){," +
            "queue.data[rear] = random( );,queue.rear++;,}"];
    }
    else if (post_data.operate_type === 2)
        code_text = ["queue.data[front] = -1", "queue.front++"];

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

    if (post_data.operate_type === 0) {
        let temp = code_text[0].split(",");
        let text = code_svg.selectAll("g")
            .append("text")
            .attr("font-size", "18px")
            .attr("fill", "white")
            .attr('x', width / 10)
            .attr('y', rect_height / 10);
        text.selectAll("tspan")
            .data(temp)
            .enter()
            .append("tspan")
            .attr("x", (d, i) => {
                if (i === 2 || i === 3)
                    return 2 * text.attr("x");
                else
                    return text.attr("x");
            })
            .attr("dy", rect_height / 8)
            .text(function (d) {
                return d
            })

    }
    else {
        for (let index = 0; index < code_text.length; index++) {
            code_svg.selectAll('g')
                .append("text")
                .text(code_text[index])
                .attr('x', width / 10)
                .attr('y', index * rect_height)
                .attr('dy', rect_height / 2)
                .style("font-size", "18px")
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
        .attr("fill", animation_data.hint_text_fill)
        .text(temp);
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
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    let temp = $.ajax({
        type: 'POST',
        url: "/queue_method",
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
 * @param {number} value_type 值的类型，1：数组 2：单值
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
            if (array_num.length > 15) {
                error_type = 11;            // 数组长度超过15
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
            alert("请输入长度小于15的队列");
            break;
        case 12:
            alert("输入含非法字符，请重新输入");
            break;
        case 13:
            alert("请输入0到999间的整数");
            break;
        case 14:
            alert("输先输入队列");
            break;
        case 15:
            alert("请先执行出入队操作");
            break;
        case 16:
            alert("演示队列最大长度为15，无法继续入队");
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