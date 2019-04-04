/**
 * @description 输入窗口
 */
function inputWindow() {
    let post_data = {};//向后台传输的数据包
    resetPostData(post_data);
    let m_svg = null;
    let animation_data = {};

    clearAllTimer(animation_data, false);

    ///////////////////////////////--------手动输入创建--------///////////////////////////////////////
    $('#submit_bt').click(function () {

        let user_data = $('#user_data').val();
        let result = checkError(post_data, user_data, 1); // 输入错误检查
        if (result !== false) {

            clearAllTimer(animation_data, false);

            resetPostData(post_data,0,result.slice(0));//slice深拷贝

            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp));//更新数据包
            console.log("data", post_data);
            m_svg = drawArray(post_data.array_data);

        }
    });

    ///////////////////////////////--------随机创建--------///////////////////////////////////////
    $('#random_bt').click(function () {

        clearAllTimer(animation_data, true);
        clearAllTimer(animation_data, false);

        resetPostData(post_data, 1);

        let temp = postData(post_data);
        post_data = JSON.parse(JSON.stringify(temp));//更新数据包
        console.log("data", post_data);
        m_svg = drawArray(post_data.array_data);
    });

    ///////////////////////////////--------查找功能--------///////////////////////////////////////
    $('#search_bt').click(function () {
        let search_num = $('#search_num').val();
        let result = checkError(post_data, search_num, 2);
        if (result !== false) {

            clearAllTimer(animation_data, true);

            clearAllTimer(animation_data, false);
            animation_data.is_search = true;

            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 1, result);

            let temp = postData(post_data);
            post_data = JSON.parse(JSON.stringify(temp)); //更新数据包
            console.log("search", post_data);
            let m_svg = drawArray(post_data.array_data); //重绘
            
            // setTimeout(function () {
            //     createAnimation(m_svg, post_data, animation_time);
            // }, 800);

            createAnimation(m_svg, post_data, animation_data);
            alert("点击播放按钮开始查找");
        }
    });

    ///////////////////////////////--------播放暂停功能--------////////////////////////////////////
    $('#play_bt').click(function () {
        if (animation_data.is_search) {
            if (!animation_data.is_pause) { //暂停
                animation_data.is_pause = true;
                console.log("pause", animation_data.now_step);
                clearAllTimer(animation_data, true);
            } else { // 播放
                animation_data.is_pause = false;
                runAnimation(post_data, animation_data);
            }
        }
        else{
            errorWarning(17);
        }

    });

    ///////////////////////////////--------修改功能--------///////////////////////////////////////
    $('#change_bt').click(function () {
        let change_data = $('#change_num').val();
        let result = checkError(post_data, change_data, 3);
        if (result !== false) {

            clearAllTimer(animation_data, false);

            resetPostData(post_data, post_data.input_tpye, post_data.array_data, 2, -1, -1, result[0], result[1]);

            let m_svg = drawArray(post_data.array_data); //重绘
            setTimeout(function () {
                changeAnimation(m_svg, post_data);
                let temp = postData(post_data);
                post_data = JSON.parse(JSON.stringify(temp));//更新数据包
                console.log("change", post_data);
            }, 800);

        }
    });
}

inputWindow();

/**
 * @description 清除定时器
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
        animation_data.duration = 800;     //动画时间基数
        animation_data.is_search = false;   //是否执行查找标记
    }
}

/**
 * @description post_data 属性设置
 */
function resetPostData(post_data, input_tpye = 0, array_data = null, operate_type = 0,
                     search_num = -1, search_pos = -1, change_pos = -1, change_num = -1) {
    post_data.input_tpye = input_tpye;    // 数据生成方式，0默认为手动输入，1为随机
    post_data.array_data = array_data;    //保存数组值
    post_data.operate_type = operate_type;//进行的操作类型，0：无，1：查找，2：修改
    post_data.search_num = search_num;    //要查找的数值
    post_data.search_pos = search_pos;    //查找的数值的下标（后台修改生成，默认-1表示未找到）
    post_data.change_pos = change_pos;    //要修改的数值下标
    post_data.change_num = change_num;    //要修改的数值
}

/**
 * @description div隐藏动画绘制
 */
function hideAnimation() {
    let interval = 800;//动画时间
    let hide_state = false;
    $("#hide_bt").click(function () {
        if (!hide_state) {
            $("#input_page").animate({left: '+85%'}, interval);
            hide_state = true;
        }
        else {
            $("#input_page").animate({left: '0%'}, interval);
            hide_state = false;
        }
    })

}

hideAnimation();


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

    let rect_length = 70;//矩形边长
    let total_len = rect_length * array_data.length;//总长度
    svg.selectAll("rect") // 数组矩形绘制
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

    svg.selectAll('g') // 数组数字绘制
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
        .attr("fill", "#56A36C")
        .text(function (d) {
            return d;
        });

    svg.selectAll('g') // 数组下标绘制
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
                .duration(animation_data.interval / 2)
                .attr("fill", "#FFCC33");

            svg.selectAll(".rect_num" + i)
                .transition()
                .duration(animation_data.interval / 2)
                .attr("fill", "#FF0033");

            if (i >= 1) {
                svg.selectAll(".m_rect" + (i - 1))
                    .transition()
                    .duration(animation_data.interval / 4)
                    .attr("fill", "white");
                svg.selectAll(".rect_num" + (i - 1))
                    .transition()
                    .duration(animation_data.interval / 4)
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
        if (animation_data.is_pause ||
            animation_data.now_step >= animation_data.frame.length) {
            console.log("end");
            alert("查找失败");
            return;
        }
        else if (post_data.array_data[animation_data.now_step - 1] === post_data.search_num){
            alert("查找成功");
            return;
        }
        animation_data.frame[animation_data.now_step]();
        console.log("正在播放第:"+ animation_data.now_step + "帧");
        animation_data.now_step++;
        runAnimation(post_data, animation_data);
    }, animation_data.duration);
    animation_data.all_timer.push(timer);
}


/**
 * @description 修改过程的动画绘制
 * @param {object} svg 数组数据
 * @param {object} post_data 数据包
 */
function changeAnimation(svg, post_data) {
    let interval = 1000;//动画时间

    svg.selectAll(".m_rect" + post_data.change_pos)
        .transition()
        .duration(interval / 3)
        .attr("fill", "pink");

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
 * @description 像后台传输数据
 * @param {Object} p_data 数据包
 * @return {object} 后台返回的数据包
 */
function postData(p_data) {
    // cb = cb || (_ => {});
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
    let error_type = -1;  // 错误类型
    if (value_type === 1) {    // 数组
        let array_num;
        if (value === "") {
            error_type = 10;  // 空串
        }
        else {
            array_num = value.split(',');
            if (array_num.length > 20) {
                error_type = 11;  // 数组长度超过20
            }
            else {
                for (let i = 0; i < array_num.length; i++) {
                    if (array_num[i] === "") {
                        error_type = 10;  // 空串
                    }
                    if (isNaN(array_num[i]) === true || array_num[i].indexOf(" ") !== -1) {
                        error_type = 12;  // 含有非法字符
                    }
                    else if (array_num[i] < 0 || array_num[i] > 999
                        || array_num[i].indexOf('.') !== -1) {
                        error_type = 13;  // 值超出范围或非整数
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
    else if (value_type === 2) {    // 单值
        if (post_data.array_data === null) {
            error_type = 14  // 没有数组数据
        }
        else if (value === "") {
            error_type = 10;  // 空值
        }
        else if (isNaN(value) === true || value.indexOf(" ") !== -1) {
            error_type = 12;  // 含有非法字符
        }
        else if (value < 0 || value > 999
            || value.indexOf('.') !== -1) {
            error_type = 13;  // 值超出范围或非整数
        }
        if (error_type !== -1) {
            errorWarning(error_type);
            return false;
        }
        else {
            return value;
        }
    }
    else if (value_type === 3) {    //下标，值
        let temp_num;
        if (post_data.array_data === null) {
            error_type = 14  // 没有数组数据
        }
        else if (value === "") {
            error_type = 10;  // 空值
        }
        else {
            temp_num = value.split(',');
            if (temp_num.length !== 2) {
                error_type = 15;  // 输入数据长度错误
            }
            else {
                for (let i = 0; i < temp_num.length; i++) {
                    if (temp_num[i] === "") {
                        error_type = 10;  // 空串
                    }
                    if (isNaN(temp_num[i]) === true || temp_num[i].indexOf(" ") !== -1) {
                        error_type = 12;  // 含有非法字符
                    }
                    else if (temp_num[i] < 0 || temp_num[i] > 999
                        || temp_num[i].indexOf('.') !== -1) {
                        error_type = 13;  // 值超出范围或非整数
                    }
                    if (error_type !== -1) {
                        break;
                    }
                }
                if (temp_num[0] < 0 || temp_num[0] > post_data.array_data.length - 1) {
                    error_type = 16;  // 下标超出范围
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