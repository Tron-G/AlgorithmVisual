/**
 * @description 输入窗口及播放暂停步进隐藏等所有交互函数
 */
function inputWindow() {
    let post_data = {};                     //向后台传输的数据包
    let m_svg = null;                       //主屏幕svg对象
    let animation_data = {};                //动画数据缓存

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
            console.log("data", post_data);
            m_svg = drawArray(post_data.array_data);        //主视图绘制
            drawCode(post_data, animation_data, 0, 0);      //伪代码及提示窗口绘制
            drawProgress(animation_data);                   //重置进度条
        }
    });
    ///////////////////////////////--------随机创建--------///////////////////////////////////////
    $('#random_bt').click(function () {
        clearAllTimer(animation_data, true);
        clearAllTimer(animation_data, false);
        resetPostData(post_data, 1);

        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));       //更新数据包
        console.log("data", post_data);
        m_svg = drawArray(post_data.array_data);
        drawCode(post_data, animation_data, 0, 0);
        drawProgress(animation_data);                       // 进度条重置
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
            console.log("search", post_data);
            m_svg = drawArray(post_data.array_data);            //重绘

            drawProgress(animation_data);                       // 进度条重置
            drawCode(post_data, animation_data, 2, 0);
            createAnimation(m_svg, post_data, animation_data); // 查找动画生成
        }
    });
    ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $("#play_bt").click(function () {
        if (animation_data.is_search) {
            if (!animation_data.is_pause) {                     //暂停
                animation_data.is_pause = true;
                console.log("pause", animation_data.now_step);
                $("#play_bt").attr("class", "play");            //图标切换
                clearAllTimer(animation_data, true);           // 清除所有定时器
            } else {                                           // 播放
                animation_data.is_pause = false;
                animation_data.duration = 1500;
                $("#play_bt").attr("class", "pause");
                runAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(17);
    });
    ///////////////////////////////--------步进功能--------////////////////////////////////////
    $('#next_bt').click(function () {
        if (animation_data.is_search) {
            if (!animation_data.is_pause) {                      //强制暂停并步进播放一次
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");
                animation_data.is_next = true;
                animation_data.duration = 800;
                clearAllTimer(animation_data, true);
                runAnimation(post_data, animation_data);
            } else {                                            // 步进播放
                animation_data.is_next = true;
                animation_data.duration = 800;
                clearAllTimer(animation_data, true);
                runAnimation(post_data, animation_data);
            }
        }
        else
            errorWarning(17);
    });
    ///////////////////////////////--------修改功能--------///////////////////////////////////////
    $('#change_bt').click(function () {
        let change_data = $('#change_num').val();
        let result = checkError(post_data, change_data, 3);
        if (result !== false) {
            clearAllTimer(animation_data, false);
            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 2, -1, -1, result[0], result[1]);

            m_svg = drawArray(post_data.array_data);              //重绘
            let change_timer = setTimeout(function () {
                changeAnimation(m_svg, post_data);
                let temp = postData(post_data);
                post_data = JSON.parse(JSON.stringify(temp));     //更新数据包
                drawCode(post_data, animation_data, 1, 0);        //伪代码生成
                drawProgress(animation_data);                     //重置进度条
                console.log("change", post_data);
                clearTimeout(change_timer);
            }, 1000);
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
 * @param {number} search_pos 查找的数值的下标（后台修改生成，默认-1表示未找到）
 * @param {number} change_pos 要修改的数值下标
 * @param {number} change_num 要修改的数值
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                       search_num = -1, search_pos = -1, change_pos = -1, change_num = -1) {
    post_data.input_tpye = input_tpye;
    post_data.array_data = array_data;
    post_data.operate_type = operate_type;
    post_data.search_num = search_num;
    post_data.search_pos = search_pos;
    post_data.change_pos = change_pos;
    post_data.change_num = change_num;
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

/**
 * @description 主视图数组绘制
 * @param {Array} array_data 数组数据
 * @return {object} svg svg对象
 */
function drawArray(array_data) {
    d3.select("#screen_svg").remove();

    let screen = $("#screen");
    let width = screen.width();
    let height = screen.height();

    let svg = d3.select("#screen")
        .append("svg")
        .attr("id", "screen_svg")
        .attr("width", width)
        .attr("height", height);

    let rect_length = 70;                           //矩形边长
    let total_len = rect_length * array_data.length;//总长度
    svg.selectAll("rect")                           // 数组矩形绘制
        .data(array_data)
        .enter()
        .append('g')
        .append("rect")
        .attr('class', function (d, i) {
            return "m_rect" + i;
        })
        .attr("x", function (d, i) {
            let start_pos = (width - total_len) / 2;
            return start_pos + i * rect_length;
        })
        .attr("y", height / 2 - rect_length)
        .attr("width", rect_length)
        .attr("height", rect_length)
        .attr("fill", "white")
        .attr("stroke", "#4CB4E7")
        .attr("stroke-width", 3);

    svg.selectAll('g')                              // 数组数字绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_text" + i;
        })
        .attr('x', function (d, i) {
            let start_pos = (width - total_len) / 2;
            return start_pos + i * rect_length;
        })
        .attr('y', height / 2 - rect_length)
        .attr("dx", rect_length / 4.5)
        .attr("dy", rect_length / 1.5)
        .attr("fill", "#537791")
        .text(function (d) {
            return d;
        });

    svg.selectAll('g')                              // 数组下标绘制
        .append("text")
        .attr('class', function (d, i) {
            return "rect_num" + i;
        })
        .attr('x', function (d, i) {
            let start_pos = (width - total_len) / 2;
            return start_pos + i * rect_length;
        })
        .attr('y', height / 2 - rect_length)
        .attr("dx", rect_length / 10)
        .attr("dy", rect_length * 1.5)
        .attr("fill", "#A3A380")
        .text(function (d, i) {
            return "a[" + i + "]";
        });
    return svg;
}

/**
 * @description 查找过程的动画生成函数
 * @param {object} svg 数组数据
 * @param {object} post_data 数据包
 * @param {object} animation_data 动画数据包
 */
function createAnimation(svg, post_data, animation_data) {
    animation_data.frame = post_data.array_data.map(function (d, i) {
        return function () {
            svg.selectAll(".m_rect" + i)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", "#fab57a");
            svg.selectAll(".rect_num" + i)
                .transition()
                .duration(animation_data.duration / 2)
                .attr("fill", "#FF0033");

            drawProgress(animation_data);       // 进度条
            if (i >= 1) {
                svg.selectAll(".m_rect" + (i - 1))
                    .transition()
                    .duration(animation_data.duration / 4)
                    .attr("fill", "white");
                svg.selectAll(".rect_num" + (i - 1))
                    .transition()
                    .duration(animation_data.duration / 4)
                    .attr("fill", "#A3A380");
            }
        }
    });
}

/**
 * @description 查找过程的动画运行函数
 * @param {object} post_data
 * @param {object} animation_data 动画数据包
 */
function runAnimation(post_data, animation_data) {
    let timer = setTimeout(() => {
        if (animation_data.is_next && animation_data.now_step < animation_data.frame.length
            && !animation_data.is_find) {                   //步进执行
            animation_data.frame[animation_data.now_step]();//执行主视图动画
            drawCode(post_data, animation_data, 3, 1);      //提示窗口判断相等动画
            let temp_timer = setTimeout(() => {
                if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num)
                    drawCode(post_data, animation_data, 6, 4);  //查找成功
                else
                    drawCode(post_data, animation_data, 4, 2);  //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);       // 计时器缓存
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            animation_data.is_next = false;
            runAnimation(post_data, animation_data);
        }
        else {                                              //自动执行
            if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num) {
                animation_data.is_find = true;
                animation_data.is_pause = true;
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找成功" + (animation_data.now_step - 1));
                return;
            }
            else if (animation_data.now_step > animation_data.frame.length - 1) {
                console.log("end", animation_data.now_step);
                animation_data.is_pause = true;
                drawCode(post_data, animation_data, 5, 3);
                $("#play_bt").attr("class", "play");         //切换播放图标
                // alert("查找失败");
                return;
            }
            else if (animation_data.is_pause) {
                return;
            }
            animation_data.frame[animation_data.now_step]();
            drawCode(post_data, animation_data, 3, 1);      //判断相等
            let temp_timer = setTimeout(() => {
                if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num)
                    drawCode(post_data, animation_data, 6, 4);  //查找成功
                else
                    drawCode(post_data, animation_data, 4, 2);  //下一个
            }, animation_data.duration / 2);
            animation_data.all_timer.push(temp_timer);      // 计时器缓存
            console.log("正在播放第:" + animation_data.now_step + "帧");
            animation_data.now_step++;
            runAnimation(post_data, animation_data);
        }
    }, animation_data.duration);
    animation_data.all_timer.push(timer);                   // 计时器缓存
}


/**
 * @description 修改过程的动画绘制
 * @param {object} svg 数组数据
 * @param {object} post_data 数据包
 */
function changeAnimation(svg, post_data) {
    let interval = 600;            //动画时间

    svg.selectAll(".m_rect" + post_data.change_pos)
        .transition()
        .duration(interval / 3)
        .attr("fill", "#a1de93");

    svg.selectAll(".rect_num" + post_data.change_pos)
        .transition()
        .duration(interval / 3)
        .attr("fill", "#FF0033");

    svg.selectAll(".rect_text" + post_data.change_pos)
        .transition()
        .delay(interval / 2)
        .style("opacity", 0)
        .duration(interval / 2)
        .transition()
        .duration(interval / 2)
        .style("opacity", 1)
        .text(post_data.change_num);
}

/**
 * @description 进度条绘制
 * @param {Object} animation_data
 */
function drawProgress(animation_data) {
    d3.select("#progress_svg").remove();
    let screen = $("#progress");
    let width = screen.width();
    let height = screen.height();
    let rect_length;
    if (animation_data.frame.length > 0) {
        rect_length = width / animation_data.frame.length;
    }
    else {
        rect_length = 0;
        $("#play_bt").attr("class", "play");
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
    let temp = "";
    if (word_id === 4)
        temp = animation_data.explain_words[word_id] + animation_data.now_step;
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
        .attr("fill", "#5c2626")
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
            code_text = ["for(i = 0; i < length; i++){,a[i] = input(),}"];
        else
            code_text = ["for(i = 0; i < random_length; i++){,a[i] = random(),}"];
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
            if (array_num.length > 20) {
                error_type = 11;            // 数组长度超过20
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
                if (temp_num[0] < 0 || temp_num[0] > post_data.array_data.length - 1) {
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
            alert("请输入长度小于20的数组");
            break;
        case 12:
            alert("输入含非法字符，请重新输入");
            break;
        case 13:
            alert("请输入0到999间的整数");
            break;
        case 14:
            alert("输先输入数组");
            break;
        case 15:
            alert("数组下标和修改值不能超过一组数");
            break;
        case 16:
            alert("输入下标超出范围");
            break;
        case 17:
            alert("请先执行查找操作");
            break;
    }
}