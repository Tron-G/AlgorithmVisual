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
 * @description 错误检查函数
 * @param {object} post_data
 * @param {string||number} value 待检查的值
 * @param {number} value_type 值的类型，1：数组 2：单值 3：位置和值(位置范围0 - length)
 * @param list_len 数组最大长度
 * @param max_num 最大数值
 * @return {boolean||number} 错误(false)或者正确结果
 */
function checkError(post_data, value, value_type, list_len = 10, max_num = 999) {
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
            else if(array_num.length > list_len && list_len === 15){
                error_type = 8;            // 数组长度超过15
            }
            else {
                for (let i = 0; i < array_num.length; i++) {
                    if (array_num[i] === "") {
                        error_type = 1;    // 空串
                    }
                    if (isNaN(array_num[i]) === true || array_num[i].indexOf(" ") !== -1) {
                        error_type = 2;    // 含有非法字符
                    }
                    else if (array_num[i] < 0 || array_num[i] > max_num
                        || array_num[i].indexOf('.') !== -1) {
                        if(max_num === 999)
                            error_type = 3;    // 值超出范围或非整数
                        else if(max_num === 100)
                            error_type = 9;
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
            error_type = 4;                 // 没有数组数据
        }
        else if (value === "") {
            error_type = 1;                // 空值
        }
        else if (isNaN(value) === true || value.indexOf(" ") !== -1) {
            error_type = 2;                // 含有非法字符
        }
        else if (value < 0 || value > max_num
            || value.indexOf('.') !== -1) {
            error_type = 3;                // 值超出范围或非整数
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
            error_type = 4;                 // 没有数组数据
        }
        else if (value === "") {
            error_type = 1;                // 空值
        }
        else {
            temp_num = value.split(',');
            if (temp_num.length !== 2) {
                error_type = 6;            // 输入数据长度错误
            }
            else {
                for (let i = 0; i < temp_num.length; i++) {
                    if (temp_num[i] === "") {
                        error_type = 1;    // 空串
                    }
                    if (isNaN(temp_num[i]) === true || temp_num[i].indexOf(" ") !== -1) {
                        error_type = 2;    // 含有非法字符
                    }
                    else if (temp_num[i] < 0 || temp_num[i] > max_num
                        || temp_num[i].indexOf('.') !== -1) {
                        error_type = 3;    // 值超出范围或非整数
                    }
                    if (error_type !== -1) {
                        break;
                    }
                }
                if (temp_num[0] < 0 || temp_num[0] > post_data.array_data.length) {
                    error_type = 7;        // 下标超出范围
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
 * @param {Number} error_type 错误类型 (0-10)共同输入错误 (10-19)数组 (20-29)链表 (30-39)栈 (40-49)队列
 */
function errorWarning(error_type) {
    switch (error_type) {
        case 1:
            alert("不能输入空值");
            break;
        case 2:
            alert("输入含非法字符，请重新输入");
            break;
        case 3:
            alert("请输入0到999间的整数");
            break;
        case 4:
            alert("请先输入数据结构数据");
            break;
        case 5:
            alert("请输入长度不超过10的数据");
            break;
        case 6:
            alert("位置和修改值只能为一组数");
            break;
        case 7:
            alert("输入位置超出范围");
            break;
        case 8:
            alert("请输入长度不超过15的数据");
            break;
        case 9:
            alert("请输入0到100间的整数");
            break;
        case 11:
            alert("请先执行查找操作");
            break;
        case 21:
            alert("请先执行查找/插入/移除操作");
            break;
        case 22:
            alert("演示链表最大长度为10，无法继续插入");
            break;
        case 30:
            alert("请先执行出入栈操作");
            break;
        case 31:
            alert("演示栈最大长度为10，无法继续入栈");
            break;
        case 40:
            alert("请先执行出入队操作");
            break;
        case 41:
            alert("演示队列最大长度为10，无法继续入队");
            break;
        case 50:
            alert("请先执行排序操作");
            break;
    }
}